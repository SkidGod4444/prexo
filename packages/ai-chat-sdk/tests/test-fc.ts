#!/usr/bin/env bun

/**
 * Focused Test Script for Firecrawl and Vector Upsert Functions
 * 
 * This script specifically tests:
 * 1. Firecrawl web scraping functionality
 * 2. Vector database upsert operations
 * 3. Vector retrieval and search
 * 
 * Prerequisites:
 * - FIRECRAWL_API_KEY environment variable
 * - Vector database credentials (VECTOR_URL, VECTOR_TOKEN)
 * 
 * Usage:
 * bun run test-firecrawl-vector.ts
 */

import { AIChatSDK } from "../src/index";

// Test configuration
const VECTOR_CONFIG = {
  url: process.env.UPSTASH_VECTOR_REST_URL || "https://your-vector-db.upstash.io",
  token: process.env.UPSTASH_VECTOR_REST_TOKEN || "your-vector-token",
  namespace: "test-firecrawl-vector",
};

const TEST_URLS = [
  "https://docs.prexoai.xyz",
  "https://devwtf.in",
];

async function testFirecrawlAndVector() {
  console.log("🧪 Testing Firecrawl and Vector Upsert Functions\n");

  // Check environment variables
  if (!process.env.FIRECRAWL_API_KEY) {
    console.error("❌ FIRECRAWL_API_KEY environment variable is required");
    process.exit(1);
  }

  if (!process.env.UPSTASH_VECTOR_REST_URL || !process.env.UPSTASH_VECTOR_REST_TOKEN) {
    console.error("❌ VECTOR_URL and VECTOR_TOKEN environment variables are required");
    process.exit(1);
  }

  // Initialize SDK
  console.log("🔧 Initializing SDK...");
  const sdk = new AIChatSDK({
    context: {
      vector: VECTOR_CONFIG,
    },
  });

  const contextClient = sdk.getContextClient();
  if (!contextClient) {
    console.error("❌ Failed to initialize context client");
    process.exit(1);
  }

  console.log("✅ SDK initialized successfully\n");

  // Test 1: Basic text upsert
  console.log("📝 Test 1: Basic Text Upsert");
  try {
    const textResult = await contextClient.addContext({
      type: "text",
      data: "This is a test document for the AI Chat SDK. It contains information about vector databases and web scraping capabilities.",
      options: {
        metadata: {
          source: "test-script",
          type: "text",
          timestamp: new Date().toISOString(),
        },
      },
    });

    if (textResult.success) {
      console.log(`✅ Text upsert successful - IDs: ${textResult.ids.join(", ")}`);
    } else {
      console.log(`❌ Text upsert failed: ${textResult.error}`);
    }
  } catch (error) {
    console.log(`❌ Text upsert error: ${error}`);
  }

  // Test 2: Firecrawl web scraping and upsert
  console.log("\n🌐 Test 2: Firecrawl Web Scraping and Upsert");
  
  for (const url of TEST_URLS) {
    console.log(`\n   🔍 Processing: ${url}`);
    
    try {
      const scrapeResult = await contextClient.addContext({
        type: "html",
        source: url,
        options: {
          metadata: {
            source: "firecrawl-test",
            url,
            timestamp: new Date().toISOString(),
          },
        },
      });

      if (scrapeResult.success) {
        console.log(`   ✅ Successfully processed ${url}`);
        console.log(`   📊 Created ${scrapeResult.ids.length} vector chunks`);
        console.log(`   🆔 Chunk IDs: ${scrapeResult.ids.slice(0, 3).join(", ")}${scrapeResult.ids.length > 3 ? "..." : ""}`);
      } else {
        console.log(`   ❌ Failed to process ${url}: ${scrapeResult.error}`);
      }
    } catch (error) {
      console.log(`   ❌ Error processing ${url}: ${error}`);
    }
  }

  // Test 3: Vector retrieval and search
  console.log("\n🔍 Test 3: Vector Retrieval and Search");
  
  const searchQueries = [
    "What is the Prexo AI Chat SDK?",
    "Who is Saidev Dhal?",
    "Tell me about Saidev's projects.",
  ];

  for (const query of searchQueries) {
    console.log(`\n   🔎 Searching: "${query}"`);
    
    try {
      const searchResults = await contextClient.getContext({
        question: query,
      });

      console.log(`   📊 Found ${searchResults.length} results:`);
      
      searchResults.forEach((result, index) => {
        console.log(`   ${index + 1}. ID: ${result.id}`);
        console.log(`      Data: ${result.data.substring(0, 100)}...`);
        console.log(`      Metadata: ${JSON.stringify(result.metadata, null, 2)}`);
        console.log("");
      });
    } catch (error) {
      console.log(`   ❌ Search error: ${error}`);
    }
  }

  // Test 4: Test different data types
  console.log("\n📄 Test 4: Different Data Types");
  
  // Test PDF-like content (simulated)
  try {
    const pdfResult = await contextClient.addContext({
      type: "text",
      data: "This is a simulated PDF document content. It contains structured information about the AI Chat SDK features and capabilities. The document includes sections on installation, configuration, and usage examples.",
      options: {
        metadata: {
          source: "test-script",
          type: "pdf-simulation",
          filename: "test-document.pdf",
          timestamp: new Date().toISOString(),
        },
      },
    });

    if (pdfResult.success) {
      console.log(`✅ PDF simulation upsert successful - ID: ${pdfResult.ids[0]}`);
    } else {
      console.log(`❌ PDF simulation upsert failed: ${pdfResult.error}`);
    }
  } catch (error) {
    console.log(`❌ PDF simulation error: ${error}`);
  }

  // Test 5: Vector operations (remove and reset)
  console.log("\n🗑️  Test 5: Vector Operations");
  
  try {
    // Get some IDs to test removal
    const searchResults = await contextClient.getContext({
      question: "test",
      topK: 2,
    });

    if (searchResults.length > 0) {
      const idsToRemove = searchResults.slice(0, 1).map(r => r.id);
      console.log(`   🗑️  Removing IDs: ${idsToRemove.join(", ")}`);
      
      await contextClient.removeContext(idsToRemove);
      console.log(`   ✅ Successfully removed ${idsToRemove.length} vectors`);
    }
  } catch (error) {
    console.log(`   ❌ Vector removal error: ${error}`);
  }

  // Test 6: Reset all context
  console.log("\n🔄 Test 6: Reset All Context");
  try {
    await contextClient.resetContext();
    console.log("   ✅ Successfully reset all context");
    
    // Verify reset by searching
    const verifyResults = await contextClient.getContext({
      question: "test",
      topK: 1,
    });
    
    if (verifyResults.length === 1 && verifyResults[0].data.includes("no answer")) {
      console.log("   ✅ Reset verification successful - no data found");
    } else {
      console.log("   ⚠️  Reset verification failed - data still present");
    }
  } catch (error) {
    console.log(`   ❌ Reset error: ${error}`);
  }

  console.log("\n🎉 Firecrawl and Vector testing completed!");
  console.log("\n📋 Summary:");
  console.log("   • Text upsert functionality tested");
  console.log("   • Firecrawl web scraping tested");
  console.log("   • Vector retrieval and search tested");
  console.log("   • Different data types tested");
  console.log("   • Vector operations (remove/reset) tested");
}

// Run the test
testFirecrawlAndVector().catch(console.error);
