import type { TelementryEvents } from "../types";
import { SDK_VERSION } from "../version";

export type TelementryOptions = {
  enabled?: boolean;
  ingestionKey?: string;
};

// Static cache for ingestion key per endpoint+domain
const ingestionKeyCache: Record<string, Promise<string>> = {};

// Auto-detect SDK version
function getSDKVersion(): string {
  try {
    // Try to get from process.env (works in Node.js)
    if (typeof process !== "undefined" && process.env?.PREXO_SDK_VERSION) {
      return process.env.PREXO_SDK_VERSION;
    }

    // Try to get from window (works in browser with injected globals)
    if (
      typeof window !== "undefined" &&
      (window as any).__PREXO_SDK_VERSION__
    ) {
      return (window as any).__PREXO_SDK_VERSION__;
    }

    // Try to get from globalThis (works in modern environments)
    if (
      typeof globalThis !== "undefined" &&
      (globalThis as any).__PREXO_SDK_VERSION__
    ) {
      return (globalThis as any).__PREXO_SDK_VERSION__;
    }

    // Use the version from the version file (default fallback)
    return SDK_VERSION;
  } catch {
    return SDK_VERSION;
  }
}

function getCacheKey(endpoint: string, domain: string) {
  return `${endpoint}::${domain}`;
}

export class Telementry {
  private enabled: boolean;
  private endpoint: string;
  private ingestionKey?: string;
  private sdkVersion: string;
  private ingestionKeyPromise?: Promise<string>;

  constructor(options: TelementryOptions) {
    const envDisabled =
      typeof process !== "undefined" && process.env?.DISABLE_TELEMETRY === "1";

    this.enabled = options.enabled ?? !envDisabled;
    this.endpoint =
      typeof process !== "undefined" &&
      process.env &&
      process.env.NODE_ENV === "development"
        ? "http://localhost:3001/v1/telementry"
        : "https://api.prexoai.xyz/v1/telementry";

    // Auto-detect SDK version if not provided
    this.sdkVersion = getSDKVersion();

    if (options.ingestionKey) {
      this.ingestionKey = options.ingestionKey;
    }
    // else: don't fetch here, defer to send() and use cache
  }

  private async fetchIngestionKeyCached(): Promise<string> {
    // Determine domain
    let domain = "";
    if (
      typeof window !== "undefined" &&
      window.location &&
      window.location.origin
    ) {
      if (
        typeof process !== "undefined" &&
        process.env &&
        process.env.NODE_ENV === "development"
      ) {
        domain = "devwtf.in";
      } else {
        domain = window.location.origin;
      }
    }
    const cacheKey = getCacheKey(this.endpoint, domain);

    if (!ingestionKeyCache[cacheKey]) {
      ingestionKeyCache[cacheKey] = this.fetchIngestionKey(domain);
    }
    return ingestionKeyCache[cacheKey];
  }

  private async fetchIngestionKey(domain: string): Promise<string> {
    const keyEndpoint = this.endpoint
      ? this.endpoint.replace(/\/?$/, "/key")
      : "https://api.prexoai.xyz/v1/telementry/key";
    try {
      const res = await fetch(keyEndpoint, {
        method: "POST",
        credentials: "include",
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

  /**
   * Returns a string with browser details using the Navigator API.
   * See: https://developer.mozilla.org/en-US/docs/Web/API/Navigator
   */
  private detectBrowser(): string {
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      const userAgent = navigator.userAgent || "unknown";
      const appVersion = navigator.appVersion || "unknown";
      const vendor = (navigator as any).vendor || "unknown";
      const language = (navigator as any).language || "unknown";
      const platform = (navigator as any).platform || "unknown";
      const cookieEnabled =
        (navigator as any).cookieEnabled !== undefined
          ? String((navigator as any).cookieEnabled)
          : "unknown";
      const hardwareConcurrency =
        (navigator as any).hardwareConcurrency !== undefined
          ? String((navigator as any).hardwareConcurrency)
          : "unknown";
      const deviceMemory =
        (navigator as any).deviceMemory !== undefined
          ? String((navigator as any).deviceMemory)
          : "unknown";
      return [
        `UserAgent: ${userAgent}`,
        `AppVersion: ${appVersion}`,
        `Vendor: ${vendor}`,
        `Language: ${language}`,
        `Platform: ${platform}`,
        `CookieEnabled: ${cookieEnabled}`,
        `HardwareConcurrency: ${hardwareConcurrency}`,
        `DeviceMemory: ${deviceMemory}`,
      ].join("; ");
    }
    // Fallback for non-browser environments
    return "not-browser";
  }

  /**
   * Returns the platform/OS using the Navigator API if available.
   * See: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/platform
   */
  private detectPlatform(): string {
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.platform === "string"
    ) {
      return navigator.platform || "unknown";
    }
    if (
      typeof process !== "undefined" &&
      typeof process.platform === "string"
    ) {
      return process.platform;
    }
    return "unknown";
  }

  /**
   * Retrieves the user's current geolocation (latitude, longitude) if available.
   * Returns null if not available or not permitted.
   */
  private async getGeolocation(): Promise<{
    latitude: number;
    longitude: number;
  } | null> {
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.geolocation !== "undefined"
    ) {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve({ latitude, longitude });
          },
          (error) => {
            // Handle specific error codes for debugging
            switch (error.code) {
              case error.PERMISSION_DENIED:
                console.warn("Geolocation: Permission denied by user");
                break;
              case error.POSITION_UNAVAILABLE:
                console.warn(
                  "Geolocation: Position unavailable (no signal/GPS)",
                );
                break;
              case error.TIMEOUT:
                console.warn("Geolocation: Request timed out");
                break;
              default:
                console.warn("Geolocation: Unknown error", error);
            }
            resolve(null); // still resolve null to avoid breaking telemetry
          },
          { timeout: 5000, maximumAge: 0 }, // optional config
        );
      });
    }
    return null;
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
        // Use the static cache to avoid spamming /key endpoint
        this.ingestionKeyPromise = this.fetchIngestionKeyCached();
      }
      ingestionKey = await this.ingestionKeyPromise;
      this.ingestionKey = ingestionKey; // cache for future
    }

    // Retrieve geolocation data if available
    const geolocation = await this.getGeolocation();

    const payload = {
      event,
      properties: {
        ...properties,
        sdkVersion: this.sdkVersion,
        browser: this.detectBrowser(),
        platform: this.detectPlatform(),
        timestamp: new Date().toISOString(),
        geolocation, // { latitude, longitude } or null
      },
    };

    try {
      await fetch(this.endpoint, {
        method: "POST",
        credentials: "include",
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
