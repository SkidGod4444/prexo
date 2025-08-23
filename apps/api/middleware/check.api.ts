import { computeCost } from "@/lib/compute.cal";
import { verifyApi } from "@prexo/keys";
import { UnkeyConfig } from "@unkey/hono";
import { MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { createUsageLog, createAuditLog } from "@prexo/logs/api";

export function verifyApiKey(
  config: UnkeyConfig,
  cost?: number,
  requests?: number,
  timeFrame?: number,
): MiddlewareHandler {
  return async (c, next) => {
    const projectID = c.req.header("x-project-id");
    const key = config.getKey
      ? config.getKey(c)
      : (c.req.header("Authorization")?.replace("Bearer ", "") ?? null);
    if (!key) {
      return c.json({ error: "unauthorized" }, { status: 401 });
    }
    if (typeof key !== "string") {
      return key;
    }
    if (!config.tags) {
      return c.json({ error: "tags needed!" }, { status: 401 });
    }
    const dynamicCost = computeCost(
      key,
      config?.tags[0],
      timeFrame ?? 60,
      requests ?? 10000,
      cost ?? 0,
    );
    console.info("THIS REQS COSTS:", dynamicCost);
    const res = await verifyApi(key, config.tags, dynamicCost);

    if (res.error) {
      const { code, requestId, message, docs } = res.error as {
        code?: string;
        requestId?: string;
        message?: string;
        docs?: string;
      };
      throw new HTTPException(500, {
        message: `Unkey Error: [CODE: ${code ?? "unknown"}] - [REQUEST_ID: ${requestId ?? "unknown"}] - ${message ?? "No message"} - read more at ${docs ?? "N/A"}`,
      });
    }

    if (!res.result?.valid && config.handleInvalidKey) {
      return config.handleInvalidKey(c, res.result);
    }

    if (res.result && projectID) {
      const audits = await createAuditLog({
        time: new Date().toISOString(),
        actor: res.result.keyId!,
        action: c.req.method,
        endpoint: c.req.path,
        credits: dynamicCost,
        projectId: projectID,
      });
      console.info("Audit log created:", audits);

      const usage = await createUsageLog({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        api_calls: 1,
        credits_used: dynamicCost,
        projectId: projectID,
      });
      console.info("Usage log created:", usage);
    }

    c.set("prexo-unkey", res);

    await next();
  };
}
