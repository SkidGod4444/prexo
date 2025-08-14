import { auth } from "@prexo/auth";
import { Context, Next } from "hono";

export const checkUser = async (c: Context, next: Next) => {
  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (session && session.user) {
      c.set("session", session);
      c.set("user", session.user);
      return await next();
    }
    console.log("Access Denied!");
    return c.json(
      { message: "You are not authorized!" },
      401
    );
  } catch (error) {
    console.log("Error while checking user", error);
    return c.json(
      { message: "An error occurred. Please contact us at connect.saidev@gmail.com." },
      401
    );
  }
};
