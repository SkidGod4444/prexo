/**
 * Generate a telemetry ingestion key for a given domain/project.
 */
export async function generateTelemetryKey(domain: string): Promise<string> {
  // Hash the domain with SHA-256
  const encoder = new TextEncoder();
  const domainData = encoder.encode(domain);
  const hashBuffer = await crypto.subtle.digest("SHA-256", domainData);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const domainHash = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 12);

  // Generate random bytes
  const randomBytes = new Uint8Array(16);
  crypto.getRandomValues(randomBytes);
  const randomPart = Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `ingest_${domainHash}_${randomPart}`;
}
