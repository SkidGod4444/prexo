import puppeteer from "puppeteer";
import path from "path";
import Papa from "papaparse";
import Firecrawl from "@mendable/firecrawl-js";

// const OCR_SPACE_API_KEY = process.env.OCR_SPACE_API_KEY!;
// const OCR_SPACE_API_URL = "https://api.ocr.space/parse/image";

const firecrawl = new Firecrawl({ apiKey: process.env.FIRE_CRAWLER_API_KEY! });

export async function extractText(
  source: string,
  type?: "pdf" | "csv" | "html",
): Promise<string> {
  const ext = path.extname(source).toLowerCase();

  // Handle PDF URLs
  if (type !== "csv") {
    if (source.startsWith("https://")) {
      const doc = await firecrawl.scrape(source, {
        formats: ["markdown", "summary"],
      });

      if (
        !doc.markdown ||
        !doc.summary ||
        doc.markdown.length === 0 ||
        doc.summary.length === 0
      ) {
        throw new Error("Failed to extract text from DOC using Firecrawl");
      }

      return JSON.stringify([
        { markdown: doc.markdown },
        { summary: doc.summary },
        { source: doc.metadata?.sourceURL },
      ]);
    } else {
      throw new Error("Local files are not supported. Please provide a URL.");
    }
  }

  // Handle CSV URLs
  if (ext === ".csv" || (type === "csv" && source.startsWith("https://"))) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Set user agent to look more like a real browser
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    );

    // Intercept responses to get CSV content
    let csvContent = "";
    page.on("response", async (response) => {
      if (response.url() === source && response.status() === 200) {
        csvContent = await response.text();
      }
    });

    try {
      await page.goto(source, { waitUntil: "networkidle0" });
    } catch (error) {
      // If navigation fails, try to get content from the response
      if (!csvContent) {
        throw new Error(
          `Failed to fetch CSV: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }

    await browser.close();

    if (!csvContent) {
      throw new Error("No CSV content found");
    }

    return Papa.parse<any>(csvContent, { header: false }).data.flat().join(" ");
  }

  throw new Error(`Unsupported source type: ${source}`);
}
