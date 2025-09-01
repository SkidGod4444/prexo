import { AIChatSDK } from '@prexo/ai-chat-sdk';

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