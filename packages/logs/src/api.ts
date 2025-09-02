const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001/v1/logger"
    : "https://api.prexoai.xyz/v1/logger";

/**
 * Create an audit log entry.
 */
export async function createAuditLog({
  time,
  actor,
  action,
  endpoint,
  credits,
  projectId,
}: {
  time: string;
  actor: string;
  action: string;
  endpoint: string;
  credits: number;
  projectId: string;
}) {
  const res = await fetch(`${BASE_URL}/audit/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      time,
      actor,
      action,
      endpoint,
      credits,
      projectId,
    }),
    credentials: "include",
  });
  if (!res.ok) {
    console.error("Failed to create audit log:", res.status, await res.text());
    throw new Error(`Failed to create audit log: ${res.status}`);
  }
  return res.json();
}

/**
 * Create a usage log entry.
 */
export async function createUsageLog({
  year,
  month,
  api_calls,
  credits_used,
  projectId,
}: {
  year: number;
  month: number;
  api_calls: number;
  credits_used: number;
  projectId: string;
}) {
  const res = await fetch(`${BASE_URL}/usage/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      year,
      month,
      api_calls,
      credits_used,
      projectId,
    }),
    credentials: "include",
  });
  if (!res.ok) {
    console.error("Failed to create usage log:", res.status, await res.text());
    throw new Error(`Failed to create usage log: ${res.status}`);
  }
  return res.json();
}
