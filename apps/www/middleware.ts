import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "@prexo/auth";
import { NextResponse, type NextRequest } from "next/server";
const baseDomain =
  process.env.NODE_ENV === "production"
    ? "https://api.prexoai.xyz"
    : "http://localhost:3001";
const appDomain =
  process.env.NODE_ENV === "production"
    ? "https://console.prexoai.xyz"
    : "http://localhost:3002";

const protectedRoutes = ["/onboarding"];

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

  if (!session || !("role" in session.user)) {
    return NextResponse.next();
  }

  if (!session.user && protectedRoutes.includes(currentPath)) {
    return NextResponse.redirect("/auth");
  }

  if (
    session.user.role === "onboarded" &&
    protectedRoutes.includes(currentPath)
  ) {
    return NextResponse.redirect(appDomain);
  }

  if (session.user.role === "onboarded" && currentPath.includes("/auth")) {
    return NextResponse.redirect(appDomain);
  }

  if (
    session.user &&
    session.user.role !== "onboarded" &&
    currentPath.includes("/auth")
  ) {
    return NextResponse.redirect(`/onboarding`);
  }

  // Otherwise, allow
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
