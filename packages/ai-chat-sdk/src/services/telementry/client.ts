import type { TelementryEvents } from "@/src/lib/types";

type TelementryOptions = {
  enabled?: boolean;
  endpoint?: string;
  ingestionKey?: string;
  sdkVersion?: string;
};

export class Telementry {
  private enabled: boolean;
  private endpoint: string;
  private ingestionKey?: string;
  private sdkVersion?: string;
  private ingestionKeyPromise?: Promise<string>;

  constructor(options: TelementryOptions) {
    const envDisabled =
      typeof process !== "undefined" && process.env?.DISABLE_TELEMETRY === "1";

    this.enabled = options.enabled ?? !envDisabled;
    this.endpoint = options.endpoint ?? "https://api.prexo.ai/v1/telementry";
    this.sdkVersion = options.sdkVersion ?? "unknown";

    if (options.ingestionKey) {
      this.ingestionKey = options.ingestionKey;
    } else {
      // Defer fetching ingestionKey until needed
      this.ingestionKeyPromise = this.fetchIngestionKey();
    }
  }

  private async fetchIngestionKey(): Promise<string> {
    const keyEndpoint = "https://api.prexo.ai/v1/telementry/key";
    try {
      let domain = "";
      if (
        typeof window !== "undefined" &&
        window.location &&
        window.location.origin
      ) {
        domain = window.location.origin;
      }
      const res = await fetch(keyEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domain }),
      });
      if (!res.ok) {
        throw new Error("Failed to fetch ingestion key");
      }
      const data = await res.json();
      // Assume the key is in data.key
      return data.key || "prexoai-ingest-key";
    } catch {
      // fallback to default
      return "prexoai-ingest-key";
    }
  }

  private detectRuntime() {
    // Deno global detection
    if (
      typeof globalThis !== "undefined" &&
      typeof (globalThis as any).Deno !== "undefined"
    ) {
      return "deno";
    }
    // Bun global detection
    if (
      typeof globalThis !== "undefined" &&
      typeof (globalThis as any).Bun !== "undefined"
    ) {
      return "bun";
    }
    // EdgeRuntime global detection
    if (
      typeof globalThis !== "undefined" &&
      typeof (globalThis as any).EdgeRuntime !== "undefined"
    ) {
      return "edge";
    }
    // Node.js detection
    if (
      typeof process !== "undefined" &&
      typeof process.release !== "undefined" &&
      process.release?.name === "node"
    ) {
      return `node_${process.version}`;
    }
  }

  private detectPlatform(): string {
    if (typeof process !== "undefined" && process.platform) {
      return process.platform; // "darwin", "win32", "linux"
    }
    if (typeof navigator !== "undefined") {
      return navigator.userAgent;
    }
    return "unknown";
  }

  async send<K extends keyof TelementryEvents>(
    event: K,
    properties: TelementryEvents[K],
  ) {
    if (!this.enabled) return;

    // Ensure ingestionKey is available
    let ingestionKey = this.ingestionKey;
    if (!ingestionKey) {
      if (!this.ingestionKeyPromise) {
        this.ingestionKeyPromise = this.fetchIngestionKey();
      }
      ingestionKey = await this.ingestionKeyPromise;
      this.ingestionKey = ingestionKey; // cache for future
    }

    const payload = {
      event,
      properties: {
        ...properties,
        sdkVersion: this.sdkVersion,
        runtime: this.detectRuntime(),
        platform: this.detectPlatform(),
        timestamp: new Date().toISOString(),
      },
    };

    try {
      await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-ingest-key": ingestionKey,
        },
        body: JSON.stringify(payload),
      });
    } catch {
      // never throw
    }
  }
}
