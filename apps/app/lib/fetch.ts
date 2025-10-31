import { constants } from "./constants";
import { useAuth } from "@clerk/nextjs";
import { useCallback } from "react";

/**
 * Custom hook to make authenticated API requests
 * Automatically includes Clerk session token in Authorization header
 * 
 * @example
 * ```tsx
 * const fetchWithAuth = useAuthenticatedFetch();
 * const response = await fetchWithAuth("/project/all");
 * ```
 */
export function useAuthenticatedFetch() {
  const auth = useAuth();

  const authenticatedFetch = useCallback(
    async (url: string, options: RequestInit = {}): Promise<Response> => {
      // Get the full URL
      const fullUrl = url.startsWith("http")
        ? url
        : `${constants.apiEndpoint}${url}`;

      // Prepare headers
      const headers = new Headers(options.headers);

      // Get and add the session token
      try {
        const token = await auth.getToken();
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      } catch (error) {
        console.error("Failed to get auth token:", error);
      }

      // Merge with existing options
      const fetchOptions: RequestInit = {
        ...options,
        credentials: "include", // Always include credentials
        headers,
      };

      return fetch(fullUrl, fetchOptions);
    },
    [auth],
  );

  return authenticatedFetch;
}

