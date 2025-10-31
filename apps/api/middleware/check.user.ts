// import { auth } from "@prexo/auth";
// import { Context, Next } from "hono";

// export const checkUser = async (c: Context, next: Next) => {
//   try {
//     const session = await auth.api.getSession({ headers: c.req.raw.headers });
//     if (session && session.user) {
//       c.set("session", session);
//       c.set("user", session.user);
//       return await next();
//     }
//     console.log("Access Denied!");
//     return c.json({ message: "You are not authorized!" }, 401);
//   } catch (error) {
//     console.log("Error while checking user", error);
//     return c.json(
//       {
//         message:
//           "An error occurred. Please contact us at connect.saidev@gmail.com",
//       },
//       401,
//     );
//   }
// };

import { getAuth } from "@hono/clerk-auth";
import { verifyToken } from "@clerk/backend";
import type { JwtPayload } from "@clerk/types";
import { Context, Next } from "hono";

export const checkUser = async (c: Context, next: Next) => {
  try {
    // First, try to get auth from Hono Clerk middleware (cookies/headers)
    // This works for same-origin requests where cookies are forwarded
    let auth = getAuth(c);
    
    // If authenticated via middleware, proceed
    if (auth && auth.isAuthenticated && auth.userId) {
      c.set("auth", auth);
      c.set("userId", auth.userId);
      return await next();
    }
    
    // If not authenticated via middleware, check for Authorization header
    // This handles cross-origin requests where cookies might not be forwarded
    const authHeader = c.req.header("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "").trim();
      
      try {
        // Use Clerk's official verifyToken method to verify the session token
        // This properly verifies the token signature and expiration
        // Reference: https://clerk.com/docs/guides/sessions/manual-jwt-verification
        const result = await verifyToken(token, {
          secretKey: process.env.CLERK_SECRET_KEY,
        });
        
        // verifyToken returns JwtReturnType<JwtPayload, TokenVerificationError>
        // Check if result has data property (success) or errors property (failure)
        if (result.data && !result.errors) {
          const sessionClaims = result.data as JwtPayload;
          // Create auth object compatible with existing code
          if (sessionClaims.sub) {
            c.set("auth", {
              userId: sessionClaims.sub,
              sessionId: (sessionClaims.sid as string) || undefined,
              isAuthenticated: true,
            });
            c.set("userId", sessionClaims.sub);
            return await next();
          }
        }
        
        // If we have errors, log them
        if (result.errors && Array.isArray(result.errors) && result.errors.length > 0) {
          console.log("Token verification errors:", result.errors);
        }
      } catch (tokenError) {
        console.log("Token verification failed:", tokenError);
        // Fall through to return 401
      }
    }
    
    // If we get here, authentication failed
    console.log("Access Denied! No valid authentication found.");
    console.log("Debug info:", {
      hasAuth: !!auth,
      isAuthenticated: auth?.isAuthenticated,
      authHeader: c.req.header("Authorization") ? "present" : "missing",
      cookie: c.req.header("Cookie") ? "present" : "missing",
    });
    return c.json({ message: "Not authenticated" }, 401);
  } catch (error) {
    console.log("Error while checking user", error);
    return c.json(
      {
        message:
          "An error occurred. Please contact us at connect.saidev@gmail.com",
      },
      401,
    );
  }
};
