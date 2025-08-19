import { prisma } from "@prexo/db";
import { MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";

export function verifyTelementryKey(): MiddlewareHandler {
  return async (c, next) => {
    const telementry_key =
      c.req.header("x-ingest-key") || c.req.header("x-telementry-key");
    if (!telementry_key) {
      throw new HTTPException(401, { message: "Missing ingestion key" });
    }
    const keyRecord = await prisma.domain.findUnique({
      where: { telementry_key },
    });
    if (!keyRecord) {
      throw new HTTPException(401, { message: "Invalid ingestion key" });
    }
    c.set("x-ingest-key", telementry_key);
    await next();
  };
}
