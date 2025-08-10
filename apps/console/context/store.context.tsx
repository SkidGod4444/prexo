"use client";
import {
  useApiKeyStore,
  useDomainsStore,
  useMyProfileStore,
  useProjectsStore,
} from "@prexo/store";
import { DomainType, ProjectType } from "@prexo/types";
import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useReadLocalStorage } from "usehooks-ts";
import { useAuth } from "./auth.context";

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
  const consoleId = useReadLocalStorage("@prexo-#consoleId");
  const { user, loading } = useAuth();
  const { projects, setProjects } = useProjectsStore();
  const { domains, setDomains } = useDomainsStore();
  const { key, removeKey, setKey } = useApiKeyStore();

  // Hard reload function: empties all stores and optionally localStorage
  const hardReload = useCallback(() => {
    setProjects([]);
    setDomains([]);
    removeKey();
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("@prexo-#consoleId");
    }
  }, [setProjects, setDomains, removeKey]);

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

  const PROJECTS_API_ENDPOINT =
    process.env.NODE_ENV == "development"
      ? "http://localhost:3001/v1/project/all"
      : "https://api.prexoai.xyz/v1/project/all";

  const DOMAINS_API_ENDPOINT =
    process.env.NODE_ENV == "development"
      ? "http://localhost:3001/v1/domain/all"
      : "https://api.prexoai.xyz/v1/domain/all";

  function getKeyApiEndpoint(keyId: string) {
    return process.env.NODE_ENV == "development"
      ? `http://localhost:3001/v1/api/key/${keyId}`
      : `https://api.prexoai.xyz/v1/api/key/${keyId}`;
  }

  useEffect(() => {
    // Only fetch if myProfile exists and role is not "inactive"
    if (loading || user?.role === "inactive") {
      return;
    }

    async function fetchProjects() {
      setContentLoading(true);
      try {
        const data = await fetch(PROJECTS_API_ENDPOINT, {
          credentials: "include",
        });

        if (!data.ok) {
          throw new Error(`Failed to fetch projects: ${data.status}`);
        }

        const response = await data.json();
        if (response?.projects) {
          setProjects(response.projects.map((project: ProjectType) => project));
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setContentLoading(false);
      }
    }

    async function fetchDomains() {
      setContentLoading(true);
      try {
        const data = await fetch(DOMAINS_API_ENDPOINT, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ projectId: consoleId }),
        });

        if (!data.ok) {
          throw new Error(`Failed to fetch domains: ${data.status}`);
        }

        const response = await data.json();
        if (response?.domains) {
          setDomains(response.domains.map((domain: DomainType) => domain));
        }
      } catch (error) {
        console.error("Error fetching domains:", error);
      } finally {
        setContentLoading(false);
      }
    }

    if (projects.length === 0) {
      fetchProjects();
    }

    if (domains.length === 0) {
      fetchDomains();
    }
  }, [
    projects.length,
    setProjects,
    consoleId,
    setDomains,
    domains,
    user,
    loading,
  ]);

  useEffect(() => {
    // Only fetch if myProfile exists and role is not "inactive"
    if (loading || user?.role === "inactive") {
      return;
    }

    async function fetchKeyDetails() {
      if (consoleId && projects.length > 0) {
        const selectedProj = projects.find(
          (project) => project.id === consoleId,
        );
        if (!selectedProj) {
          console.error("No project found with the given consoleId");
          return;
        }
        setContentLoading(true);
        try {
          const data = await fetch(getKeyApiEndpoint(selectedProj.keyId!), {
            credentials: "include",
          });

          if (!data.ok) {
            throw new Error(`Failed to fetch API key: ${data.status}`);
          }

          const response = await data.json();
          if (response?.apiKey) {
            const {
              id,
              name,
              start,
              enabled,
              workspaceId,
              createdAt,
              deletedAt,
              expires,
              remaining,
              roles,
            } = response.apiKey;
            setKey({
              id,
              name,
              start,
              enabled,
              workspaceId,
              createdAt,
              deletedAt,
              expires,
              remaining,
              roles,
            });
          }
        } catch (error) {
          console.error("Error fetching projects:", error);
        } finally {
          setContentLoading(false);
        }
      }
    }

    if (!key) {
      fetchKeyDetails();
    }
  }, [key, setKey, consoleId, projects, user, loading]);

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
