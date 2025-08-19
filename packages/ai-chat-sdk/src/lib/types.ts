import type { Message } from "ai";
import type { QueryMode } from "@upstash/vector";

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
