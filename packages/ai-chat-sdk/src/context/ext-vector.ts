import { Index } from "@upstash/vector";
import { VectorDB } from "./vector-db";
import type {
  AddContextPayload,
  VectorPayload,
  SaveOperationResult,
} from "../types";

export type ExtVectorConfig = {
  url: string;
  token: string;
};

export class ExtVector {
  private vectorDB: VectorDB;
  private namespace: string;

  constructor(config: ExtVectorConfig, namespace: string) {
    const index = new Index({
      url: config.url,
      token: config.token,
    });
    this.vectorDB = new VectorDB(index);
    this.namespace = namespace;
  }

  async addContext(input: AddContextPayload): Promise<SaveOperationResult> {
    // Always use the provided namespace
    if (!input.options) input.options = {};
    input.options.namespace = this.namespace;
    return this.vectorDB.save(input);
  }

  async removeContext(ids: string[]): Promise<void> {
    await this.vectorDB.delete({ ids, namespace: this.namespace });
  }

  async getContext<TMetadata>(
    payload: Omit<VectorPayload, "namespace">,
  ): Promise<{ data: string; id: string; metadata: TMetadata }[]> {
    return this.vectorDB.retrieve<TMetadata>({
      ...payload,
      namespace: this.namespace,
    });
  }

  async resetContext(): Promise<void> {
    await this.vectorDB.reset({ namespace: this.namespace });
  }
}
