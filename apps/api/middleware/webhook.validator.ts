import { Context, Next } from "hono";

export const validateWebhook = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized Event" }, 401);
  }
  const token = authHeader.slice(7);
  if (token !== process.env.PREXO_WEBHOOK_SECRET) {
    return c.json({ error: "Unauthorized Event" }, 401);
  }
  return await next();
};
