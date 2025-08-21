import type { Message } from "ai";
import type { QueryMode } from "@upstash/vector";

export const AI_MODELS_FREE_TIER = [
  {
    id: "deepseek/deepseek-chat-v3-0324:free",
    model: "deepseek/deepseek-chat-v3-0324:free",
    name: "DeepSeek Chat V3 (Free)",
    marketplace: "openrouter",
    description: "A powerful open-source chat model by DeepSeek, suitable for general-purpose conversations.",
  },
  {
    id: "openai/gpt-oss-20b:free",
    model: "openai/gpt-oss-20b:free",
    name: "OpenAI GPT-OSS 20B (Free)",
    marketplace: "openrouter",
    description: "An open-source 20B parameter model by OpenAI, ideal for a wide range of chat and completion tasks.",
  },
  {
    id: "meta-llama/Llama-3.3-70B-Instruct-Turbo:free",
    model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
    name: "Meta Llama 3.3 70B Instruct Turbo (Free)",
    marketplace: "togetherai",
    description: "A high-performance 70B parameter model by Meta, optimized for instruction-following tasks.",
  },
  {
    id: "google/gemini-2.0-flash-exp:free",
    model: "google/gemini-2.0-flash-exp:free",
    name: "Google Gemini 2.0 Flash Exp (Free)",
    marketplace: "openrouter",
    description: "An experimental model by Google, designed for fast and efficient instruction tasks.",
  },
  {
    id: "google/gemma-3n-e4b-it:free",
    model: "google/gemma-3n-e4b-it:free",
    name: "Google Gemma 3N E4B Instruct (Free)",
    marketplace: "openrouter",
    description: "A multilingual model by Google, designed for instruction tasks across various languages.",
  },
  {
    id: "mistralai/mistral-small-3.2-24b-instruct:free",
    model: "mistralai/mistral-small-3.2-24b-instruct:free",
    name: "Mistral Small 3.2 24B Instruct (Free)",
    marketplace: "openrouter",
    description: "A compact yet powerful 24B parameter model by Mistral, designed for instruction-following tasks.",
  }
] as const;

/**
 * String literal union of all allowed model IDs.
 * Use this type for type-safe model("") usage and editor autocomplete.
 * 
 * Example:
 *   function setModel(model: AIModelId) { ... }
 *   setModel("deepseek/deepseek-chat-v3-0324:free"); // type-safe, autocompletes
 */
export type AIModelsFreeTierId = typeof AI_MODELS_FREE_TIER[number]["id"];

/**
 * Full model object type for free tier models.
 */
export type AIModelsFreeTier = typeof AI_MODELS_FREE_TIER[number];

export type TelementryEvents = {
  agent_onFinish: {
    llmModel?: string;
    latencyMs?: number;
    RAGDisabled?: boolean;
    sessionId?: string;
    sessionTTL?: number;
    usage?: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
    finishReason?: string;
  };
  agent_onError: {
    code: string;
    error: Error;
  };
  user_message_sent: {
    content: string;
    sessionId?: string;
    sessionTTL?: number;
  };
  user_message_error: {
    content: string;
    sessionId?: string;
    sessionTTL?: number;
    code: string;
  };
  chat_widget_activated: {
    sessionId?: string;
    sessionTTL?: number;
    widgetId?: string;
    value: boolean;
  };
  error: {
    code: string;
    message?: string;
  };
  api_call: {
    latencyMs: number;
    endpoint: string;
  };
  custom_event: {
    [key: string]: any; // fallback for user-defined
  };
};

export type VectorPayload = {
  question: string | number[];
  similarityThreshold?: number;
  topK?: number;
  namespace?: string;
  contextFilter?: string;
  queryMode?: QueryMode;
};

export type FilePath = string;
export type URL = string;

export type ResetOptions = {
  namespace: string;
};

export type AddContextOptions = {
  /**
   * Namespace of the index you wanted to insert. Default is empty string.
   * @default ""
   */

  metadata?: UpstashDict;
  namespace?: string;
};

export type UpstashDict = Record<string, unknown>;

export type SaveOperationResult =
  | { success: true; ids: string[] }
  | { success: false; error: string };

export type DatasWithFileSource =
  | {
      type?: "pdf" | "csv" | "text-file" | "html";
      fileSource: FilePath;
      options?: AddContextOptions;
    }
  | {
      type: "pdf";
      fileSource: FilePath | Blob;
      options?: AddContextOptions;
    }
  | {
      type: "csv";
      fileSource: FilePath | Blob;
      options?: AddContextOptions;
    }
  | {
      type: "text-file";
      fileSource: FilePath | Blob;
      options?: AddContextOptions;
    }
  | (
      | {
          type: "html";
          source: URL;
          options?: AddContextOptions;
        }
      | {
          type: "html";
          source: FilePath | Blob;
          options?: AddContextOptions;
        }
    );

export type AddContextPayload =
  | {
      type: "text";
      data: string;
      options?: AddContextOptions;
      id?: string | number;
    }
  | {
      type: "embedding";
      data: number[];
      text?: string;
      options?: AddContextOptions;
      id?: string | number;
    }
  | DatasWithFileSource;

export interface BaseMessageHistory {
  addMessage(params: {
    message: Message;
    sessionId: string;
    sessionTTL?: number;
  }): Promise<void>;

  deleteMessages(params: { sessionId: string }): Promise<void>;

  getMessages(params: {
    sessionId: string;
    amount?: number;
    startIndex?: number;
  }): Promise<Message[]>;
}
export interface SuggestedActionsT {
  label: string;
  action: string;
}

export interface BaseVectorContext {
  addContext(input: AddContextPayload): Promise<SaveOperationResult>;
  removeContext(ids: string[]): Promise<void>;
  getContext<TMetadata = any>(
    payload: Omit<VectorPayload, "namespace">,
  ): Promise<{ data: string; id: string; metadata: TMetadata }[]>;
  resetContext(): Promise<void>;
}

export type VectorContextResult<TMetadata = any> = {
  data: string;
  id: string;
  metadata: TMetadata;
};
