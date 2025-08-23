import { MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { createAuditLog } from "@prexo/logs/api";

export const auditLogs: MiddlewareHandler = async (c, next) => {
  const projectId = c.req.header("x-project-id");
  const isPolling = c.req.header("x-polling-req") === "true";

  if (isPolling) {
    console.log("Skipping audit log for polling request");
    return await next();
  }

  if (!projectId) {
    throw new HTTPException(401, { message: "Missing project id" });
  }

  const method = c.req.method;
  const path = c.req.path;

  // For non-polling requests, create audit logs normally
  try {
    const audits = await createAuditLog({
      time: new Date().toISOString(),
      actor: "USER",
      action: method,
      endpoint: path,
      credits: 0,
      projectId,
    });
    console.info("Audit log created:", audits);
  } catch (error) {
    console.error("Failed to create audit log:", error);
  }

  return await next();
};
