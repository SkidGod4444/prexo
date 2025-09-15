// AI Chat SDK - Main Entry Point
// This SDK provides AI chat functionality with persistent history and vector context

// Import all components
import { Telementry } from "./telemetry";
import { getContextClient, VectorDB, ExtVector } from "./context";
import { getHistoryClient, InRedisHistory } from "./history";

// Import centralized types and version info
import type {
  TelementryOptions,
  GetContextClientParams,
  GetHistoryClientParams,
  ExtVectorConfig,
  RedisHistoryConfig,
  SDKConfig,
  SDKStatus,
  EventName,
  EventProperties,
  VectorContextResult,
  BaseMessageHistory,
} from "./types";
import { SDK_VERSION, SDK_NAME } from "./version";

// Re-export all components
export {
  Telementry,
  getContextClient,
  getHistoryClient,
  VectorDB,
  ExtVector,
  InRedisHistory,
};

// Re-export constants
export {
  DEFAULT_CHAT_SESSION_ID,
  DEFAULT_HISTORY_LENGTH,
  DEFAULT_HISTORY_TTL,
  DEFAULT_MSG_ID,
  DEFAULT_SIMILARITY_THRESHOLD,
  DEFAULT_TOP_K,
} from "./lib/constants";

// Re-export all types
export type {
  TelementryOptions,
  GetContextClientParams,
  GetHistoryClientParams,
  ExtVectorConfig,
  RedisHistoryConfig,
  SDKConfig,
  SDKStatus,
  EventName,
  EventProperties,
  VectorContextResult,
  BaseMessageHistory,
};

// Export version information
export { SDK_VERSION, SDK_NAME };

/**
 * AI Chat SDK - Main class for configuring and managing AI chat functionality
 *
 * @example
 * ```typescript
 * // Professional usage - recommended approach
 * const sdk = new AIChatSDK({
 *   telemetry: { enabled: true },
 *   context: {
 *     vector: {
 *       url: 'https://your-vector-db.upstash.io',
 *       token: 'your-token',
 *       namespace: 'your-namespace'
 *     }
 *   }
 * });
 *
 * // Use the configured clients
 * const contextClient = sdk.getContextClient();
 * const historyClient = sdk.getHistoryClient();
 * ```
 */
export class AIChatSDK {
  private telemetry?: Telementry;
  private contextClient?: ReturnType<typeof getContextClient>;
  private historyClient?: ReturnType<typeof getHistoryClient>;

  /**
   * Creates a new AIChatSDK instance with the specified configuration
   *
   * @param config - Configuration options for telemetry, context, and history
   *
   * @example
   * ```typescript
   * const sdk = new AIChatSDK({
   *   telemetry: { enabled: true },
   *   context: { vector: { url: '...', token: '...', namespace: '...' } },
   *   history: { redis: { url: '...', token: '...' } }
   * });
   * ```
   */
  constructor(config?: SDKConfig) {
    if (config?.telemetry) {
      this.telemetry = new Telementry(config.telemetry);
    }

    if (config?.context) {
      this.contextClient = getContextClient(config.context);
    }

    if (config?.history) {
      this.historyClient = getHistoryClient(config.history);
    }
  }

  /**
   * Get the configured telemetry instance
   */
  getTelemetry(): Telementry | undefined {
    return this.telemetry;
  }

  /**
   * Get the configured context client
   */
  getContextClient() {
    return this.contextClient;
  }

  /**
   * Get the configured history client
   */
  getHistoryClient() {
    return this.historyClient;
  }

  /**
   * Send a telemetry event if telemetry is enabled
   */
  async trackEvent(
    event: EventName,
    properties: EventProperties,
  ): Promise<void> {
    if (this.telemetry) {
      await this.telemetry.send(event as any, properties as any);
    }
  }

  /**
   * Check if the SDK is properly configured
   */
  isConfigured(): boolean {
    return !!(this.contextClient || this.historyClient);
  }

  /**
   * Get SDK configuration status
   */
  getConfigurationStatus(): SDKStatus {
    return {
      telemetry: !!this.telemetry,
      context: !!this.contextClient,
      history: !!this.historyClient,
    };
  }

  /**
   * Get SDK version information
   */
  getVersionInfo(): { version: string; name: string } {
    return {
      version: SDK_VERSION,
      name: SDK_NAME,
    };
  }

  /**
   * Reset all configured clients
   */
  reset(): void {
    this.telemetry = undefined;
    this.contextClient = undefined;
    this.historyClient = undefined;
  }

  /**
   * Update SDK configuration
   */
  updateConfig(config: SDKConfig): void {
    this.reset();

    if (config.telemetry) {
      this.telemetry = new Telementry(config.telemetry);
    }

    if (config.context) {
      this.contextClient = getContextClient(config.context);
    }

    if (config.history) {
      this.historyClient = getHistoryClient(config.history);
    }
  }
}

// Alternative convenience function (for backward compatibility)
export function createAIChatSDK(config?: SDKConfig): AIChatSDK {
  return new AIChatSDK(config);
}

// Utility functions for direct access to components
export function createTelemetry(options: TelementryOptions): Telementry {
  return new Telementry(options);
}

export function createContextClient(params: GetContextClientParams) {
  return getContextClient(params);
}

export function createHistoryClient(params?: GetHistoryClientParams) {
  return getHistoryClient(params);
}

// Default export for convenience
export default AIChatSDK;
