import { auth } from "@prexo/auth";
import { Context, Next } from "hono";
import { NextResponse } from "next/server";

export const checkUser = async (c: Context, next: Next) => {
  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (session && session.user) {
      c.set("session", session);
      return await next();
    }
    console.log("Access Denied!");
    return NextResponse.json(
      { message: "Authentication error occurred" },
      { status: 401 },
    );
  } catch (error) {
    console.log("Error while checking user", error);
  }
};
