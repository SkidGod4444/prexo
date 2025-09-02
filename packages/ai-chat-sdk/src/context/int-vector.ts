import { BASE_API_ENDPOINT } from "../lib/utils";
import type {
  AddContextPayload,
  VectorPayload,
  SaveOperationResult,
} from "../types";

export class IntVector {
  private namespace: string;
  private apiKey?: string;
  private BASE_API = `${BASE_API_ENDPOINT}/context`;

  constructor(namespace: string, apiKey?: string) {
    this.namespace = namespace;
    this.apiKey = apiKey;
  }

  async addContext(input: AddContextPayload): Promise<SaveOperationResult> {
    // Always use the internal namespace
    if (!input.options) input.options = {};
    input.options.namespace = this.namespace;

    const response = await fetch(`${this.BASE_API}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
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
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ ...payload, namespace: this.namespace }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
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
