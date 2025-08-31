// Centralized types for the AI Chat SDK

// Telemetry types
export type TelementryOptions = {
  enabled?: boolean;
  endpoint?: string;
  ingestionKey?: string;
  sdkVersion?: string;
};

// Context types
export type GetContextClientParams = {
  vector?: {
    url: string;
    token: string;
    namespace: string;
  };
  apiKey?: string;
};

export type ExtVectorConfig = {
  url: string;
  token: string;
};

// History types
export type GetHistoryClientParams = {
  redis?: {
    url: string;
    token: string;
  };
};

export type RedisHistoryConfig = {
  config?: import('@upstash/redis').RedisConfigNodejs;
  client?: import('@upstash/redis').Redis;
};

// SDK Configuration types
export type SDKConfig = {
  telemetry?: TelementryOptions;
  context?: GetContextClientParams;
  history?: GetHistoryClientParams;
};

// SDK Status types
export type SDKStatus = {
  telemetry: boolean;
  context: boolean;
  history: boolean;
};

// Event tracking types
export type EventProperties = Record<string, any>;
export type EventName = string | number | symbol;
