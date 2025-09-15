#!/usr/bin/env bun

/**
 * Comprehensive SDK Test Script
 * Tests Firecrawl integration and vector upsert functionality
 *
 * Prerequisites:
 * 1. Set FIRECRAWL_API_KEY environment variable
 * 2. Set up a vector database (Upstash Vector) with URL and token
 * 3. Optionally set up Redis for history testing
 *
 * Usage:
 * bun run test-sdk.ts
 */

import { AIChatSDK, SDK_VERSION, SDK_NAME } from "../src/index";

// Test configuration - Update these with your actual credentials
const TEST_CONFIG = {
  // Vector database configuration (Upstash Vector)
  vector: {
    url: process.env.VECTOR_URL || "https://your-vector-db.upstash.io",
    token: process.env.VECTOR_TOKEN || "your-vector-token",
    namespace: "test-namespace",
  },
  // Redis configuration (optional)
  redis: {
    url: process.env.REDIS_URL || "https://your-redis.upstash.io",
    token: process.env.REDIS_TOKEN || "your-redis-token",
  },
  // Firecrawl API key
  firecrawlApiKey: process.env.FIRECRAWL_API_KEY,
};

// Test URLs for Firecrawl testing
const TEST_URLS = [
  "https://docs.prexoai.xyz", // Your documentation site
  "https://github.com/SkidGod4444/prexo", // Your GitHub repo
  "https://example.com", // Simple test site
];

// Test data for vector upsert
const TEST_TEXT_DATA = [
  "The AI Chat SDK is a comprehensive solution for building intelligent chat applications with persistent history and vector context.",
  "Vector databases enable semantic search and retrieval of relevant context for AI conversations.",
  "Firecrawl integration allows the SDK to scrape and process web content for context storage.",
  "Redis integration provides persistent message history across chat sessions.",
  "The SDK supports multiple data types including text, PDFs, CSVs, and HTML content.",
];

interface TestResult {
  name: string;
  success: boolean;
  error?: string;
  duration: number;
  details?: any;
}

class SDKTester {
  private sdk: AIChatSDK;
  private results: TestResult[] = [];

  constructor() {
    console.log(`🧪 Starting SDK Test Suite`);
    console.log(`📦 SDK: ${SDK_NAME} v${SDK_VERSION}\n`);

    // Initialize SDK with test configuration
    this.sdk = new AIChatSDK({
      telemetry: { enabled: false }, // Disable telemetry for testing
      context: {
        vector: TEST_CONFIG.vector,
      },
      history: {
        redis: TEST_CONFIG.redis,
      },
    });
  }

  private async runTest<T>(
    name: string,
    testFn: () => Promise<T>,
  ): Promise<T | null> {
    const startTime = Date.now();
    console.log(`⏳ Running: ${name}`);

    try {
      const result = await testFn();
      const duration = Date.now() - startTime;

      this.results.push({
        name,
        success: true,
        duration,
        details: result,
      });

      console.log(`✅ ${name} - Success (${duration}ms)`);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      this.results.push({
        name,
        success: false,
        error: errorMessage,
        duration,
      });

      console.log(`❌ ${name} - Failed (${duration}ms)`);
      console.log(`   Error: ${errorMessage}`);
      return null;
    }
  }

  async testSDKInitialization() {
    return this.runTest("SDK Initialization", async () => {
      const status = this.sdk.getConfigurationStatus();
      const isConfigured = this.sdk.isConfigured();
      const versionInfo = this.sdk.getVersionInfo();

      if (!isConfigured) {
        throw new Error("SDK is not properly configured");
      }

      return {
        status,
        isConfigured,
        versionInfo,
      };
    });
  }

  async testContextClient() {
    return this.runTest("Context Client Setup", async () => {
      const contextClient = this.sdk.getContextClient();

      if (!contextClient) {
        throw new Error("Context client is not available");
      }

      return {
        clientType: contextClient.constructor.name,
        hasAddContext: typeof contextClient.addContext === "function",
        hasGetContext: typeof contextClient.getContext === "function",
        hasRemoveContext: typeof contextClient.removeContext === "function",
        hasResetContext: typeof contextClient.resetContext === "function",
      };
    });
  }

  async testHistoryClient() {
    return this.runTest("History Client Setup", async () => {
      const historyClient = this.sdk.getHistoryClient();

      if (!historyClient) {
        console.log(
          "   ⚠️  History client not configured (Redis not available)",
        );
        return { configured: false };
      }

      return {
        configured: true,
        clientType: historyClient.constructor.name,
        hasAddMessage: typeof historyClient.addMessage === "function",
        hasGetMessages: typeof historyClient.getMessages === "function",
        hasDeleteMessages: typeof historyClient.deleteMessages === "function",
      };
    });
  }

  async testVectorTextUpsert() {
    return this.runTest("Vector Text Upsert", async () => {
      const contextClient = this.sdk.getContextClient();
      if (!contextClient) {
        throw new Error("Context client not available");
      }

      const results: Array<{ text: string; ids: string[] }> = [];

      // Test individual text upserts
      for (let i = 0; i < TEST_TEXT_DATA.length; i++) {
        const text = TEST_TEXT_DATA[i];
        const result = await contextClient.addContext({
          type: "text",
          data: text,
          options: {
            metadata: {
              source: "test-script",
              index: i,
              timestamp: new Date().toISOString(),
            },
          },
        });

        if (!result.success) {
          throw new Error(`Failed to upsert text ${i}: ${result.error}`);
        }

        results.push({
          text: text.substring(0, 50) + "...",
          ids: result.ids,
        });
      }

      return {
        totalUpserted: results.length,
        results,
      };
    });
  }

  async testVectorRetrieval() {
    return this.runTest("Vector Retrieval", async () => {
      const contextClient = this.sdk.getContextClient();
      if (!contextClient) {
        throw new Error("Context client not available");
      }

      // Test different queries
      const queries = [
        "What is the AI Chat SDK?",
        "How does vector search work?",
        "What data types are supported?",
        "Tell me about Firecrawl integration",
        "How does Redis work with the SDK?",
      ];

      const results: Array<{
        query: string;
        found: number;
        results: Array<{ id: string; data: string; metadata: any }>;
      }> = [];

      for (const query of queries) {
        const contextResults = await contextClient.getContext({
          question: query,
          topK: 3,
          similarityThreshold: 0.3,
        });

        results.push({
          query,
          found: contextResults.length,
          results: contextResults.map((r) => ({
            id: r.id,
            data: r.data.substring(0, 100) + "...",
            metadata: r.metadata,
          })),
        });
      }

      return {
        totalQueries: queries.length,
        results,
      };
    });
  }

  async testFirecrawlIntegration() {
    return this.runTest("Firecrawl Integration", async () => {
      if (!TEST_CONFIG.firecrawlApiKey) {
        throw new Error("FIRECRAWL_API_KEY not set - skipping Firecrawl test");
      }

      const contextClient = this.sdk.getContextClient();
      if (!contextClient) {
        throw new Error("Context client not available");
      }

      const results: Array<{
        url: string;
        success: boolean;
        error?: string;
        chunksCreated?: number;
        ids?: string[];
      }> = [];

      // Test with each URL
      for (const url of TEST_URLS) {
        try {
          console.log(`   🔍 Scraping: ${url}`);

          const result = await contextClient.addContext({
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

          if (!result.success) {
            console.log(`   ⚠️  Failed to process ${url}: ${result.error}`);
            results.push({ url, success: false, error: result.error });
            continue;
          }

          results.push({
            url,
            success: true,
            chunksCreated: result.ids.length,
            ids: result.ids,
          });

          console.log(
            `   ✅ Processed ${url} - ${result.ids.length} chunks created`,
          );
        } catch (error) {
          console.log(`   ❌ Error processing ${url}: ${error}`);
          results.push({ url, success: false, error: String(error) });
        }
      }

      return {
        totalUrls: TEST_URLS.length,
        successful: results.filter((r) => r.success).length,
        results,
      };
    });
  }

  async testVectorReset() {
    return this.runTest("Vector Reset", async () => {
      const contextClient = this.sdk.getContextClient();
      if (!contextClient) {
        throw new Error("Context client not available");
      }

      await contextClient.resetContext();

      // Verify reset by trying to retrieve data
      const results = await contextClient.getContext({
        question: "test query",
        topK: 5,
      });

      // Should return the "no answer" response
      const isEmpty =
        results.length === 1 &&
        results[0].data ===
          "There is no answer for this question in the provided context.";

      return {
        resetSuccessful: isEmpty,
        resultsAfterReset: results.length,
      };
    });
  }

  async testHistoryOperations() {
    return this.runTest("History Operations", async () => {
      const historyClient = this.sdk.getHistoryClient();
      if (!historyClient) {
        console.log(
          "   ⚠️  History client not configured - skipping history test",
        );
        return { configured: false };
      }

      const sessionId = `test-session-${Date.now()}`;
      const testMessages = [
        { id: "1", content: "Hello, how are you?", role: "user" as const },
        {
          id: "2",
          content: "I'm doing well, thank you!",
          role: "assistant" as const,
        },
        {
          id: "3",
          content: "What can you help me with?",
          role: "user" as const,
        },
        {
          id: "4",
          content: "I can help you with various tasks using the AI Chat SDK.",
          role: "assistant" as const,
        },
      ];

      // Add messages
      for (const message of testMessages) {
        await historyClient.addMessage({
          message,
          sessionId,
          sessionTTL: 3600, // 1 hour
        });
      }

      // Retrieve messages
      const retrievedMessages = await historyClient.getMessages({
        sessionId,
        amount: 10,
      });

      // Clean up
      await historyClient.deleteMessages({ sessionId });

      return {
        configured: true,
        messagesAdded: testMessages.length,
        messagesRetrieved: retrievedMessages.length,
        messagesMatch: retrievedMessages.length === testMessages.length,
      };
    });
  }

  async runAllTests() {
    console.log("🚀 Starting comprehensive SDK testing...\n");

    // Basic setup tests
    await this.testSDKInitialization();
    await this.testContextClient();
    await this.testHistoryClient();

    // Vector operations tests
    await this.testVectorTextUpsert();
    await this.testVectorRetrieval();
    await this.testFirecrawlIntegration();
    await this.testVectorReset();

    // History operations tests
    await this.testHistoryOperations();

    // Print summary
    this.printSummary();
  }

  private printSummary() {
    console.log("\n" + "=".repeat(60));
    console.log("📊 TEST SUMMARY");
    console.log("=".repeat(60));

    const totalTests = this.results.length;
    const passedTests = this.results.filter((r) => r.success).length;
    const failedTests = totalTests - passedTests;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    console.log(`Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`⏱️  Total Duration: ${totalDuration}ms`);
    console.log(
      `📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`,
    );

    if (failedTests > 0) {
      console.log("\n❌ FAILED TESTS:");
      this.results
        .filter((r) => !r.success)
        .forEach((r) => {
          console.log(`   • ${r.name}: ${r.error}`);
        });
    }

    console.log("\n" + "=".repeat(60));

    if (failedTests === 0) {
      console.log("🎉 All tests passed! Your SDK is working correctly.");
    } else {
      console.log(
        "⚠️  Some tests failed. Please check the configuration and try again.",
      );
    }
  }
}

// Main execution
async function main() {
  // Check environment variables
  console.log("🔍 Checking environment variables...");

  const requiredEnvVars = [
    { name: "FIRECRAWL_API_KEY", value: process.env.FIRECRAWL_API_KEY },
    { name: "VECTOR_URL", value: process.env.VECTOR_URL },
    { name: "VECTOR_TOKEN", value: process.env.VECTOR_TOKEN },
  ];

  const missingVars = requiredEnvVars.filter((v) => !v.value);

  if (missingVars.length > 0) {
    console.log("❌ Missing required environment variables:");
    missingVars.forEach((v) => console.log(`   • ${v.name}`));
    console.log("\nPlease set these variables and try again.");
    console.log("\nExample:");
    console.log("export FIRECRAWL_API_KEY='your-firecrawl-key'");
    console.log("export VECTOR_URL='https://your-vector-db.upstash.io'");
    console.log("export VECTOR_TOKEN='your-vector-token'");
    console.log("export REDIS_URL='https://your-redis.upstash.io' (optional)");
    console.log("export REDIS_TOKEN='your-redis-token' (optional)");
    process.exit(1);
  }

  console.log("✅ Environment variables configured\n");

  // Run tests
  const tester = new SDKTester();
  await tester.runAllTests();
}

// Handle uncaught errors
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Rejection:", reason);
  process.exit(1);
});

// Run the tests
main().catch(console.error);
