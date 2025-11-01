"use client";
import { useProjectsStore } from "@prexo/store";
import { ProjectType } from "@prexo/types";
import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { useMyUser } from "./user.cntxt";
import { useAuthenticatedFetch } from "@/lib/fetch";

interface StoreContextType {
  contentLoading: boolean;
  hardReload: () => void;
}

// Global hard reload event name
const HARD_RELOAD_EVENT = "__PREXO_HARD_RELOAD__";

// Exportable function to trigger hard reload from anywhere
export function triggerHardReload() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(HARD_RELOAD_EVENT));
  }
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [contentLoading, setContentLoading] = useState(false);
  const { user, loading } = useMyUser();
  const { projects, setProjects } = useProjectsStore();
  const fetchWithAuth = useAuthenticatedFetch();

  // Hard reload function: empties all stores and optionally localStorage
  const hardReload = useCallback(() => {
    setProjects([]);
  }, [setProjects]);

  // Listen for global hard reload event
  useEffect(() => {
    function onHardReloadEvent() {
      hardReload();
    }
    window.addEventListener(HARD_RELOAD_EVENT, onHardReloadEvent);
    return () => {
      window.removeEventListener(HARD_RELOAD_EVENT, onHardReloadEvent);
    };
  }, [hardReload]);

  // Store refs to avoid stale closures
  const fetchWithAuthRef = useRef(fetchWithAuth);
  const userRef = useRef(user);

  // Update refs when values change
  useEffect(() => {
    fetchWithAuthRef.current = fetchWithAuth;
    userRef.current = user;
  }, [fetchWithAuth, user]);

  // Fetch projects and domains, poll every 30 seconds
  useEffect(() => {
    // Don't fetch if user is still loading
    if (loading) {
      return;
    }

    // Don't fetch if no user is signed in
    if (!user) {
      setProjects([]);
      return;
    }

    let isMounted = true;
    let intervalId: NodeJS.Timeout | null = null;

    async function fetchProjects() {
      if (!isMounted) return;

      setContentLoading(true);
      try {
        const data = await fetchWithAuthRef.current("/project/all", {
          headers: {
            // "x-project-id": String(consoleId || ""),
            "x-polling-req": "true", // Indicate this is a polling request
          },
        });

        if (!isMounted) return;

        if (!data.ok) {
          throw new Error(`Failed to fetch projects: ${data.status}`);
        }

        const response = await data.json();
        if (!isMounted) return;

        if (Array.isArray(response?.projects)) {
          setProjects(response.projects.map((project: ProjectType) => project));
        } else {
          setProjects([]);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        if (isMounted) {
          setProjects([]);
        }
      } finally {
        if (isMounted) {
          setContentLoading(false);
        }
      }
    }

    // Always fetch once when user loads or changes
    fetchProjects();

    // Set up polling interval (30 seconds)
    intervalId = setInterval(() => {
      if (isMounted && userRef.current) {
        fetchProjects();
      }
    }, 30000);

    return () => {
      isMounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [setProjects, user?.id, loading]);

  const value = {
    contentLoading,
    hardReload: triggerHardReload, // Use the exported trigger function
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useContent() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
}
