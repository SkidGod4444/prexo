import { prisma } from "@prexo/db";
import { Context, MiddlewareHandler, Next } from "hono";
import { HTTPException } from "hono/http-exception";

export const checkTelementry: MiddlewareHandler = async (
  c: Context,
  next: Next,
) => {
  const telementry_key =
    c.req.header("x-ingest-key") || c.req.header("x-telemetry-key");
  if (!telementry_key) {
    throw new HTTPException(401, { message: "Missing ingestion key" });
  }
  const keyRecord = await prisma.domain.findUnique({
    where: { telementry_key },
  });
  if (!keyRecord) {
    throw new HTTPException(401, { message: "Invalid ingestion key" });
  }

  return await next();
};
