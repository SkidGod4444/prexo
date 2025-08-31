# AI Chat SDK

A comprehensive AI chat SDK that provides persistent history, vector context for building intelligent chat applications.

## Features

- **Persistent Message History**: Store chat history in memory or Redis
- **Vector Context**: Add and retrieve contextual information using vector databases
- **Telemetry**: Built-in analytics and usage tracking
- **Flexible Configuration**: Support for both external and internal vector databases
- **TypeScript Support**: Full TypeScript support with comprehensive type definitions
- **Modular Architecture**: Import only what you need
- **Zero Dependencies**: Lightweight and tree-shakeable

## Installation

```bash
npm install @prexo/ai-chat-sdk@latest
# or
yarn add @prexo/ai-chat-sdk@latest
# or
bun add @prexo/ai-chat-sdk@latest
```

## Quick Start

### Professional Usage (Recommended)

```typescript
import { AIChatSDK } from '@prexo/ai-chat-sdk';

// Create SDK instance using constructor - professional approach
const sdk = new AIChatSDK({
  telemetry: { enabled: true },
  context: {
    vector: {
      url: 'https://your-vector-db.upstash.io',
      token: 'your-token',
      namespace: 'your-namespace'
    }
  },
  history: {
    redis: {
      url: 'https://your-redis.upstash.io',
      token: 'your-token'
    }
  }
});

// Use the configured clients
const contextClient = sdk.getContextClient();
const historyClient = sdk.getHistoryClient();

// Check configuration status
const status = sdk.getConfigurationStatus();
console.log('SDK Status:', status);
```

### Alternative Usage (Convenience Function)

```typescript
import { createAIChatSDK } from '@prexo/ai-chat-sdk';

// Alternative approach using convenience function
const sdk = createAIChatSDK({
  telemetry: { enabled: true }
});
```

### Basic Usage

```typescript
import { AIChatSDK } from '@prexo/ai-chat-sdk';

// Create a basic SDK instance
const sdk = new AIChatSDK();

// Check if configured
console.log(sdk.isConfigured()); // false (no context or history configured)
```

### With Vector Context

```typescript
import { createAIChatSDK } from '@prexo/ai-chat-sdk';

// Configure with external vector database
const sdk = createAIChatSDK({
  context: {
    vector: {
      url: 'https://your-vector-db.upstash.io',
      token: 'your-token',
      namespace: 'your-namespace'
    }
  }
});

// Get the context client
const contextClient = sdk.getContextClient();
if (contextClient) {
  // Add context
  await contextClient.addContext({
    type: 'text',
    data: 'Your contextual information here',
    options: {
      metadata: { source: 'documentation' }
    }
  });

  // Retrieve context
  const results = await contextClient.getContext({
    question: 'What is the main feature?',
    topK: 5
  });
}
```

### With Redis History

```typescript
import { createAIChatSDK } from '@prexo/ai-chat-sdk';

const sdk = createAIChatSDK({
  history: {
    redis: {
      url: 'https://your-redis.upstash.io',
      token: 'your-token'
    }
  }
});

const historyClient = sdk.getHistoryClient();

// Add a message
await historyClient.addMessage({
  message: { id: '1', content: 'Hello!', role: 'user' },
  sessionId: 'session-123'
});

// Retrieve messages
const messages = await historyClient.getMessages({
  sessionId: 'session-123',
  amount: 10
});
```

### With Telemetry

```typescript
import { createAIChatSDK } from '@prexo/ai-chat-sdk';

const sdk = createAIChatSDK({
  telemetry: {
    enabled: true,
    endpoint: 'https://api.prexo.ai/v1/telementry'
    // Note: sdkVersion is automatically detected - no need to provide it!
  }
});

// Track custom events
await sdk.trackEvent('chat_started', {
  userId: 'user-123',
  sessionId: 'session-456'
});
```

## Auto-Versioning

The SDK automatically detects and reports its version without requiring manual configuration:

```typescript
import { createAIChatSDK, SDK_VERSION, SDK_NAME } from '@prexo/ai-chat-sdk';

// Access version information directly
console.log(`Using ${SDK_NAME} version ${SDK_VERSION}`);

// Or get it from the SDK instance
const sdk = createAIChatSDK();
const versionInfo = sdk.getVersionInfo();
console.log(`SDK Version: ${versionInfo.version}`);
console.log(`SDK Name: ${versionInfo.name}`);
```

**How it works:**
- Version is automatically read from `package.json` during build
- No need to manually specify `sdkVersion` in telemetry configuration
- Version is always up-to-date with your package version
- Works across all environments (Node.js, browser, bundlers)

## Advanced Configuration

### Full Configuration Example

```typescript
import { AIChatSDK } from '@prexo/ai-chat-sdk';

const sdk = new AIChatSDK({
  // Telemetry configuration
  telemetry: {
    enabled: true,
    // sdkVersion is automatically detected
  },
  
  // Vector context configuration
  context: {
    vector: {
      url: 'https://your-vector-db.upstash.io',
      token: 'your-token',
      namespace: 'your-namespace'
    }
    // Or use internal vector with API key
    // apiKey: 'your-api-key'
  },
  
  // History configuration
  history: {
    redis: {
      url: 'https://your-redis.upstash.io',
      token: 'your-token'
    }
  }
});
```

### Using Internal Vector Database

```typescript
import { AIChatSDK } from '@prexo/ai-chat-sdk';

const sdk = new AIChatSDK({
  context: {
    apiKey: 'your-prexo-api-key'
  }
});

const contextClient = sdk.getContextClient();
if (contextClient) {
  // Add context using internal vector database
  await contextClient.addContext({
    type: 'text',
    data: 'Your contextual information',
    options: {
      namespace: 'your-namespace',
      metadata: { source: 'documentation' }
    }
  });
}
```

## Modular Imports

You can also import specific modules directly:

```typescript
// Import only telemetry
import { Telementry } from '@prexo/ai-chat-sdk/telemetry';

// Import only context utilities
import { getContextClient, ExtVector } from '@prexo/ai-chat-sdk/context';

// Import only history utilities
import { getHistoryClient, InMemoryHistory } from '@prexo/ai-chat-sdk/history';

// Import only types
import type { SDKConfig, TelementryOptions } from '@prexo/ai-chat-sdk/types';
```

## API Reference

### AIChatSDK Class

#### Constructor
```typescript
constructor(config?: SDKConfig)
```

#### Methods

- `getTelemetry()`: Returns the configured telemetry instance
- `getContextClient()`: Returns the configured context client
- `getHistoryClient()`: Returns the configured history client
- `trackEvent(event, properties)`: Sends a telemetry event
- `isConfigured()`: Checks if the SDK is properly configured
- `getConfigurationStatus()`: Returns detailed configuration status
- `reset()`: Resets all configured clients
- `updateConfig(config)`: Updates the SDK configuration

### Context Clients

#### ExtVector (External Vector Database)
```typescript
import { ExtVector } from '@prexo/ai-chat-sdk/context';

const extVector = new ExtVector({
  url: 'https://your-vector-db.upstash.io',
  token: 'your-token'
}, 'namespace');

await extVector.addContext({
  type: 'text',
  data: 'Your text data'
});

const results = await extVector.getContext({
  question: 'Your question',
  topK: 5
});
```

#### IntVector (Internal Vector Database)
```typescript
import { IntVector } from '@prexo/ai-chat-sdk/context';

const intVector = new IntVector('namespace', 'your-api-key');

await intVector.addContext({
  type: 'text',
  data: 'Your text data'
});

const results = await intVector.getContext({
  question: 'Your question',
  topK: 5
});
```

### History Clients

#### InMemoryHistory
```typescript
import { InMemoryHistory } from '@prexo/ai-chat-sdk/history';

const history = new InMemoryHistory();

await history.addMessage({
  message: { id: '1', content: 'Hello', role: 'user' },
  sessionId: 'session-123'
});

const messages = await history.getMessages({
  sessionId: 'session-123',
  amount: 10
});
```

#### InRedisHistory
```typescript
import { InRedisHistory } from '@prexo/ai-chat-sdk/history';

const history = new InRedisHistory({
  config: {
    url: 'https://your-redis.upstash.io',
    token: 'your-token'
  }
});

await history.addMessage({
  message: { id: '1', content: 'Hello', role: 'user' },
  sessionId: 'session-123'
});

const messages = await history.getMessages({
  sessionId: 'session-123',
  amount: 10
});
```

## Configuration Management

### Dynamic Configuration Updates

```typescript
const sdk = new AIChatSDK({
  telemetry: { enabled: true }
});

// Later, update the configuration
sdk.updateConfig({
  telemetry: { enabled: true },
  context: {
    vector: {
      url: 'https://new-vector-db.upstash.io',
      token: 'new-token',
      namespace: 'new-namespace'
    }
  }
});

// Check configuration status
const status = sdk.getConfigurationStatus();
console.log(status); // { telemetry: true, context: true, history: false }
```

## Environment Variables

- `DISABLE_TELEMETRY=1`: Disables telemetry globally
- `PREXO_API_KEY`: API key for internal vector database operations

## Types

The SDK exports comprehensive TypeScript types:

```typescript
import type {
  SDKConfig,           // Main SDK configuration
  SDKStatus,           // SDK configuration status
  TelementryOptions,   // Telemetry configuration
  GetContextClientParams, // Context client parameters
  GetHistoryClientParams, // History client parameters
  ExtVectorConfig,     // External vector configuration
  RedisHistoryConfig,  // Redis history configuration
  EventName,           // Event name type
  EventProperties     // Event properties type
} from '@prexo/ai-chat-sdk/types';
```

## Building and Development

```bash
# Install dependencies
bun install

# Build the SDK
bun run d:build

# Type checking
bun run type-check
```

## Contributing

This project is licensed under the GNU Affero General Public License v3.0. See the LICENSE file for details.

## Support

For support and questions, please visit our [documentation](https://docs.prexoai.xyz) or open an issue on GitHub.
