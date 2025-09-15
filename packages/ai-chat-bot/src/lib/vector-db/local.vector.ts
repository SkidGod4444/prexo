
import { BASE_API_ENDPOINT } from "../utils";
import type {
  AddContextPayload,
  VectorPayload,
  SaveOperationResult,
} from "@prexo/ai-chat-sdk/types";

export class IntVector {
  private namespace: string;
  private apiKey?: string;
  private BASE_API = `${BASE_API_ENDPOINT}/context`;

  constructor(namespace: string, apiKey?: string) {
    this.namespace = namespace;
    this.apiKey = apiKey;
  }

  async addContext(input: AddContextPayload): Promise<SaveOperationResult> {
    // Map SDK payload to server contract
    let body: any = { namespace: this.namespace };
    if (input.type === "text") {
      body = { ...body, type: "text", data: (input as any).data };
    } else if (input.type === "embedding") {
      body = { ...body, type: "embedding", data: (input as any).data };
    } else if (input.type === "html") {
      const src = (input as any).fileSource ?? (input as any).source;
      body = { ...body, type: "html", url: src };
    } else if (input.type === "pdf") {
      const src = (input as any).fileSource ?? (input as any).source;
      body = { ...body, type: "pdf", url: src };
    } else if (input.type === "csv") {
      const src = (input as any).fileSource ?? (input as any).source;
      body = { ...body, type: "csv", url: src };
    } else if (input.type === "text-file" || (input as any).fileSource) {
      const src = (input as any).fileSource ?? (input as any).source;
      body = { ...body, type: "text-file", url: src };
    }

    const response = await fetch(`${this.BASE_API}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    // Normalize to SaveOperationResult
    if (json && Array.isArray(json.ids)) {
      return { success: true, ids: json.ids };
    }
    return { success: false, error: json?.error || "Unknown error" };
  }

  async removeContext(ids: string[]): Promise<void> {
    const response = await fetch(`${this.BASE_API}/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ ids, namespace: this.namespace }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  async getContext<TMetadata = any>(
    payload: Omit<VectorPayload, "namespace">,
  ): Promise<{ data: string; id: string; metadata: TMetadata }[]> {
    const response = await fetch(`${this.BASE_API}/get`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ payload, namespace: this.namespace }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    // Server returns { data: [...] }
    return json?.data ?? [];
  }

  async resetContext(): Promise<void> {
    const response = await fetch(`${this.BASE_API}/reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ namespace: this.namespace }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}