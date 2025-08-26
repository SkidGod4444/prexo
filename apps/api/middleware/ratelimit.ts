import { auth } from "@prexo/auth";
import { cache } from "@prexo/cache";
import { Ratelimit } from "@upstash/ratelimit";
import { Context, Next } from "hono";

const getClientIp = (c: Context) =>
  c.req.header("x-forwarded-for") ||
  c.req.header("x-real-ip") ||
  c.req.raw.headers.get("x-forwarded-for") ||
  c.req.raw.headers.get("x-real-ip") ||
  c.req.raw.headers.get("cf-connecting-ip") ||
  undefined;

const getUserAgent = (c: Context) =>
  c.req.header("user-agent") ||
  c.req.raw.headers.get("user-agent") ||
  undefined;

const getRatelimitInstance = (limit: number) => ({
  free: new Ratelimit({
    redis: cache,
    analytics: true,
    enableProtection: true,
    prefix: "@prexo/ratelimit:free",
    limiter: Ratelimit.slidingWindow(limit, "1m"),
  }),
  pro: new Ratelimit({
    redis: cache,
    analytics: true,
    enableProtection: true,
    prefix: "@prexo/ratelimit:pro",
    limiter: Ratelimit.slidingWindow(limit, "10s"),
  }),
});

export const rateLimitHandler = async (c: Context, next: Next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  const telementryKey =
    c.req.header("x-ingest-key") || c.req.header("x-telemetry-key");
  const projectId = c.req.header("x-project-id");
  const ip = getClientIp(c);
  const userAgent = getUserAgent(c);

  const limit = process.env.NODE_ENV === "production" ? 60 : 100;
  const ratelimit = getRatelimitInstance(limit);

  // Determine rate limit context
  let key: string | undefined;
  let limiter: Ratelimit | undefined;

  if (session?.user) {
    if ("role" in session.user && session.user.role === "pro") {
      key =
        session.user.id ||
        session?.session.ipAddress ||
        ip ||
        userAgent ||
        "anonymous";
      limiter = ratelimit.pro;
    } else {
      key =
        session?.session.ipAddress ||
        session?.session.userId ||
        ip ||
        userAgent ||
        "anonymous";
      limiter = ratelimit.free;
    }
  } else if (telementryKey) {
    key = telementryKey || ip || userAgent || "anonymous";
    limiter = ratelimit.free;
  } else if (projectId) {
    key = projectId || ip || userAgent || "anonymous";
    limiter = ratelimit.free;
  } else {
    // fallback for completely anonymous users
    key = ip || userAgent || "anonymous";
    limiter = ratelimit.free;
  }

  // Apply rate limit
  const { success, pending, reason, deniedValue } = await limiter.limit(key, {
    ip,
    userAgent,
  });
  await pending; // Await analytics if enabled

  // Optionally log for debugging
  console.log("RATELIMIT HANDLER: ", success, reason, deniedValue);

  if (!success) {
    return c.json({ message: "You hit the rate limit" }, 429);
  }
  return await next();
};