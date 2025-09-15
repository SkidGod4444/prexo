import Firecrawl from '@mendable/firecrawl-js';

const apiKey = process.env.FIRECRAWL_API_KEY;

if (!apiKey) {
  throw new Error("FIRECRAWL_API_KEY is not set in environment variables");
}

const firecrawl = new Firecrawl({ apiKey });

export async function scrapeContent(url: string) {
  const data = await firecrawl.scrape(url, { formats: ['markdown', 'summary'] });
  return data;
}