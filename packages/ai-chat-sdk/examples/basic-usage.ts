// Basic usage example for the AI Chat SDK
import { AIChatSDK, SDK_VERSION, SDK_NAME } from '../src/index';

async function basicExample() {
  // Log version information
  console.log(`Using ${SDK_NAME} version ${SDK_VERSION}`);

  // Create SDK using constructor - professional approach
  const sdk = new AIChatSDK({
    telemetry: {
      enabled: true
      // sdkVersion is automatically detected from package.json
    }
  });

  // Track an event
  await sdk.trackEvent('sdk_initialized', {
    timestamp: new Date().toISOString(),
    environment: 'development'
  });

  // Check configuration status
  const status = sdk.getConfigurationStatus();
  console.log('SDK Status:', status);

  // Get version information from SDK instance
  const versionInfo = sdk.getVersionInfo();
  console.log('SDK Version Info:', versionInfo);

  // Later, add context configuration
  sdk.updateConfig({
    telemetry: { enabled: true },
    context: {
      vector: {
        url: 'https://your-vector-db.upstash.io',
        token: 'your-token',
        namespace: 'example-namespace'
      }
    }
  });

  // Get the context client
  const contextClient = sdk.getContextClient();
  if (contextClient) {
    // Add some context
    const result = await contextClient.addContext({
      type: 'text',
      data: 'This is an example context for the AI Chat SDK',
      options: {
        metadata: { 
          source: 'example',
          category: 'documentation'
        }
      }
    });

    console.log('Context added:', result);

    // Retrieve context
    const contexts = await contextClient.getContext({
      question: 'What is the AI Chat SDK?',
      topK: 3
    });

    console.log('Retrieved contexts:', contexts);
  }

  // Check updated status
  const updatedStatus = sdk.getConfigurationStatus();
  console.log('Updated SDK Status:', updatedStatus);
}

// Run the example
basicExample().catch(console.error);
