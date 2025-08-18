import { auth as BetterAuth } from "@prexo/auth";
import { Hono } from "hono";

const auth = new Hono();

auth.get("/*", (c) => BetterAuth.handler(c.req.raw));
auth.post("/*", (c) => BetterAuth.handler(c.req.raw));
export default auth;
