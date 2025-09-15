import Firecrawl from '@mendable/firecrawl-js';

// Lazily initialize Firecrawl only when an API key is available.
// This avoids throwing during client-side bundles where process.env is not present.
let firecrawlClient: Firecrawl | undefined;

function getFirecrawlApiKey(): string | undefined {
  try {
    // In Node/bundler environments, process may exist
    if (typeof process !== 'undefined' && process.env && process.env.FIRECRAWL_API_KEY) {
      return process.env.FIRECRAWL_API_KEY;
    }
  } catch {
    // ignore
  }
  return undefined;
}

function getFirecrawl(): Firecrawl | undefined {
  const key = getFirecrawlApiKey();
  if (!key) return undefined;
  if (!firecrawlClient) {
    firecrawlClient = new Firecrawl({ apiKey: key });
  }
  return firecrawlClient;
}

export async function scrapeContent(url: string) {
  const client = getFirecrawl();
  if (!client) {
    throw new Error("Firecrawl is not configured. Set FIRECRAWL_API_KEY on the server to enable scraping.");
  }
  const data = await client.scrape(url, { formats: ['markdown', 'summary'] });
  return data;
}