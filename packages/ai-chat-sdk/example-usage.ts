#!/usr/bin/env bun

/**
 * Example Usage Script
 * Demonstrates basic SDK functionality with Firecrawl and Vector operations
 *
 * This is a simplified example showing how to use the SDK in practice
 */

import { AIChatSDK } from "./src/index";

async function exampleUsage() {
  console.log("🚀 AI Chat SDK Example Usage\n");

  // Initialize the SDK
  const sdk = new AIChatSDK({
    context: {
      vector: {
        url: process.env.VECTOR_URL || "https://your-vector-db.upstash.io",
        token: process.env.VECTOR_TOKEN || "your-vector-token",
        namespace: "example-usage",
      },
    },
  });

  const contextClient = sdk.getContextClient();
  if (!contextClient) {
    console.error(
      "❌ Context client not available. Please check your vector database configuration.",
    );
    return;
  }

  console.log("✅ SDK initialized successfully\n");

  // Example 1: Add some text context
  console.log("📝 Adding text context...");
  const textResult = await contextClient.addContext({
    type: "text",
    data: "The AI Chat SDK provides powerful tools for building intelligent chat applications with persistent history and vector-based context retrieval.",
    options: {
      metadata: {
        source: "example",
        category: "introduction",
      },
    },
  });

  if (textResult.success) {
    console.log(`✅ Text added with ID: ${textResult.ids[0]}`);
  } else {
    console.log(`❌ Failed to add text: ${textResult.error}`);
  }

  // Example 2: Scrape and add web content (if Firecrawl is configured)
  if (process.env.FIRECRAWL_API_KEY) {
    console.log("\n🌐 Scraping web content...");
    const webResult = await contextClient.addContext({
      type: "html",
      source: "https://docs.prexoai.xyz",
      options: {
        metadata: {
          source: "web-scraping",
          url: "https://docs.prexoai.xyz",
        },
      },
    });

    if (webResult.success) {
      console.log(
        `✅ Web content processed - ${webResult.ids.length} chunks created`,
      );
    } else {
      console.log(`❌ Failed to process web content: ${webResult.error}`);
    }
  } else {
    console.log("\n⚠️  Skipping web scraping (FIRECRAWL_API_KEY not set)");
  }

  // Example 3: Search for relevant context
  console.log("\n🔍 Searching for relevant context...");
  const searchQueries = [
    "What is the AI Chat SDK?",
    "How does vector search work?",
    "What features are available?",
  ];

  for (const query of searchQueries) {
    console.log(`\n   Query: "${query}"`);

    const results = await contextClient.getContext({
      question: query,
      topK: 2,
      similarityThreshold: 0.3,
    });

    if (results.length > 0) {
      console.log(`   📊 Found ${results.length} relevant results:`);
      results.forEach((result, index) => {
        console.log(`   ${index + 1}. ${result.data.substring(0, 100)}...`);
        console.log(`      Metadata: ${JSON.stringify(result.metadata)}`);
      });
    } else {
      console.log("   📭 No relevant results found");
    }
  }

  // Example 4: Clean up (optional)
  console.log("\n🧹 Cleaning up...");
  await contextClient.resetContext();
  console.log("✅ Context reset completed");

  console.log("\n🎉 Example completed successfully!");
  console.log("\n💡 Next steps:");
  console.log("   • Integrate this into your application");
  console.log("   • Set up proper error handling");
  console.log("   • Configure production environment variables");
  console.log("   • Add monitoring and logging");
}

// Run the example
exampleUsage().catch(console.error);
