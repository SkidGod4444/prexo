"use client";
import {
  useApiKeyStore,
  useDomainsStore,
  useProjectsStore,
} from "@prexo/store";
import { DomainType, ProjectType } from "@prexo/types";
import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useReadLocalStorage } from "usehooks-ts";

interface StoreContextType {
  contentLoading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [contentLoading, setContentLoading] = useState(false);
  const consoleId = useReadLocalStorage("@prexo-#consoleId");

  const { projects, setProjects } = useProjectsStore();
  const { domains, setDomains } = useDomainsStore();
  const { key, setKey } = useApiKeyStore();

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
        // Consider adding error state to context for UI feedback
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
        // Consider adding error state to context for UI feedback
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
  }, [projects.length, setProjects, consoleId, setDomains, domains]);

  useEffect(() => {
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
            // Only pick fields defined in KeyType
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
          // Consider adding error state to context for UI feedback
        } finally {
          setContentLoading(false);
        }
      }
    }

    if (!key.id) {
      fetchKeyDetails();
    }
  }, [key.id, setKey, consoleId, projects]);

  const value = {
    contentLoading,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useContent() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
}
