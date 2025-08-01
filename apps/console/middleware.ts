import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "@prexo/auth";
import { NextResponse, type NextRequest } from "next/server";
const baseDomain =
  process.env.NODE_ENV === "production"
    ? "https://api.prexoai.xyz"
    : "http://localhost:3001";
const redirectUrl =
  process.env.NODE_ENV === "production"
    ? "https://prexoai.xyz/auth"
    : "http://localhost:3000/auth";
const appDomain =
  process.env.NODE_ENV === "production"
    ? "https://console.prexoai.xyz"
    : "http://localhost:3002";

export default async function authMiddleware(request: NextRequest) {
  const { data: session } = await betterFetch<Session>(
    `${baseDomain}/v1/auth/get-session`,
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    },
  );

  const currentPath = request.nextUrl.pathname;

  if (!session) {
    return NextResponse.redirect(redirectUrl);
  }

  if (!("role" in session.user) || session.user.role !== "onboarded") {
    return NextResponse.redirect(redirectUrl);
  }

  if (session.user.role === "onboarded" && currentPath === "/") {
    return NextResponse.redirect(`${appDomain}/dashboard`);
  }

  // Otherwise, allow
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
