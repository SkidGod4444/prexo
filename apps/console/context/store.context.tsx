/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import {
  useApiKeyStore,
  useAuditLogsStore,
  useContainersStore,
  useDomainsStore,
  useEnvsStore,
  useLinksStore,
  useNotificationsStore,
  useProjectsStore,
  useUsageLogsStore,
} from "@prexo/store";
import {
  AuditLogType,
  ContainerType,
  DomainType,
  EnvType,
  LinkType,
  NotificationType,
  ProjectType,
  UsageLogType,
} from "@prexo/types";
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
  const containerId = useReadLocalStorage("@prexo-#containerId");
  const { user, loading } = useAuth();
  const { projects, setProjects } = useProjectsStore();
  const { notifications, setNotifications } = useNotificationsStore();
  const { domains, setDomains } = useDomainsStore();
  const { envs, setEnvs } = useEnvsStore();
  const { key, removeKey, setKey } = useApiKeyStore();
  const { links, setLinks} = useLinksStore();
  const { containers, setContainers } = useContainersStore();
  const { auditLogs, setAuditLogs } = useAuditLogsStore();
  const { usageLogs, setUsageLogs } = useUsageLogsStore();

  // Hard reload function: empties all stores and optionally localStorage
  const hardReload = useCallback(() => {
    setProjects([]);
    setDomains([]);
    removeKey();
    setEnvs([]);
    setNotifications([]);
    setContainers([]);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("@prexo-#consoleId");
    }
  }, [setProjects, setDomains, removeKey, setNotifications, setEnvs]);

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

  const LOGGER_API_ENDPOINT =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3001/v1/logger"
      : "https://api.prexoai.xyz/v1/logger";

  const DOMAINS_API_ENDPOINT =
    process.env.NODE_ENV == "development"
      ? "http://localhost:3001/v1/domain/all"
      : "https://api.prexoai.xyz/v1/domain/all";

  const NOTI_API_ENDPOINT =
    process.env.NODE_ENV == "development"
      ? "http://localhost:3001/v1/notification"
      : "https://api.prexoai.xyz/v1/notification";

  const ENVS_API_ENDPOINT =
    process.env.NODE_ENV == "development"
      ? "http://localhost:3001/v1/envs"
      : "https://api.prexoai.xyz/v1/envs";

  const CONTAINERS_API_ENDPOINT =
    process.env.NODE_ENV == "development"
      ? "http://localhost:3001/v1/container"
      : "https://api.prexoai.xyz/v1/container";

      const LINK_API_ENDPOINT = process.env.NODE_ENV === "production" ? "https://api.prexoai.xyz/v1/link" : "http://localhost:3001/v1/link";


  function getKeyApiEndpoint(keyId: string) {
    return process.env.NODE_ENV == "development"
      ? `http://localhost:3001/v1/api/key/${keyId}`
      : `https://api.prexoai.xyz/v1/api/key/${keyId}`;
  }

  // Fetch projects and domains, poll every 30 seconds
  useEffect(() => {
    if (loading) {
      return;
    }

    async function fetchProjects() {
      setContentLoading(true);
      try {
        const data = await fetch(PROJECTS_API_ENDPOINT, {
          credentials: "include",
          headers: {
            "x-project-id": String(consoleId || ""),
            "x-polling-req": "true", // Indicate this is a polling request
          },
        });

        if (!data.ok) {
          throw new Error(`Failed to fetch projects: ${data.status}`);
        }

        const response = await data.json();
        if (Array.isArray(response?.projects)) {
          setProjects(response.projects.map((project: ProjectType) => project));
        } else {
          setProjects([]);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
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
            "x-project-id": String(consoleId || ""),
            "x-polling-req": "true", // Indicate this is a polling request
          },
          body: JSON.stringify({ projectId: consoleId }),
        });

        if (!data.ok) {
          throw new Error(`Failed to fetch domains: ${data.status}`);
        }

        const response = await data.json();
        if (Array.isArray(response?.domains)) {
          setDomains(response.domains.map((domain: DomainType) => domain));
        } else {
          setDomains([]);
        }
      } catch (error) {
        console.error("Error fetching domains:", error);
        setDomains([]);
      } finally {
        setContentLoading(false);
      }
    }

    async function fetchAll() {
      await Promise.all([fetchProjects(), fetchDomains()]);
    }

    if (projects.length == 0 || domains.length == 0) {
      fetchAll();
    }

    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, [
    setProjects,
    setDomains,
    consoleId,
    user,
    loading,
    domains.length,
    projects.length,
  ]);

  // Fetch notifications, poll every 10 seconds
  useEffect(() => {
    if (loading || user?.role === "inactive") {
      return;
    }

    async function fetchNotifications() {
      setContentLoading(true);
      try {
        const data = await fetch(`${NOTI_API_ENDPOINT}/${consoleId}/all`, {
          credentials: "include",
          headers: {
            "x-project-id": String(consoleId || ""),
            "x-polling-req": "true", // Indicate this is a polling request
          },
        });

        if (!data.ok) {
          throw new Error(`Failed to fetch notifications: ${data.status}`);
        }

        const response = await data.json();
        if (Array.isArray(response?.notifications)) {
          setNotifications(
            response.notifications.map((noti: NotificationType) => noti),
          );
        } else {
          setNotifications([]);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]);
      } finally {
        setContentLoading(false);
      }
    }

    async function fetchLinks() {
      setContentLoading(true);
      try {
        const data = await fetch(`${LINK_API_ENDPOINT}/${containerId}/all`, {
          credentials: "include",
          headers: {
            "x-project-id": String(consoleId || ""),
            "x-polling-req": "true", // Indicate this is a polling request
          },
        });

        if (!data.ok) {
          throw new Error(`Failed to fetch links: ${data.status}`);
        }

        const response = await data.json();
        if (Array.isArray(response?.links)) {
          setLinks(response.links.map((link: LinkType) => link));
        } else {
          setLinks([]);
        }
      } catch (error) {
        console.error("Error fetching links:", error);
        setLinks([]);
      } finally {
        setContentLoading(false);
      }
    }

    async function fetchContainers() {
      setContentLoading(true);
      try {
        const data = await fetch(
          `${CONTAINERS_API_ENDPOINT}/${consoleId}/all`,
          {
            credentials: "include",
            headers: {
              "x-project-id": String(consoleId || ""),
              "x-polling-req": "true", // Indicate this is a polling request
            },
          },
        );

        if (!data.ok) {
          throw new Error(`Failed to fetch containers: ${data.status}`);
        }

        const response = await data.json();
        if (Array.isArray(response?.containers)) {
          setContainers(response.containers.map((cont: ContainerType) => cont));
        } else {
          setContainers([]);
        }
      } catch (error) {
        console.error("Error fetching containers:", error);
        setContainers([]);
      } finally {
        setContentLoading(false);
      }
    }

    async function fetchLogs() {
      setContentLoading(true);
      try {
        const data = await fetch(`${LOGGER_API_ENDPOINT}/${consoleId}/all`, {
          credentials: "include",
          headers: {
            "x-project-id": String(consoleId || ""),
            "x-polling-req": "true", // Indicate this is a polling request
          },
        });

        if (!data.ok) {
          throw new Error(`Failed to fetch logs: ${data.status}`);
        }

        const response = await data.json();
        console.log("Logger API response:", response);

        if (Array.isArray(response?.auditLogs)) {
          console.log("Setting audit logs:", response.auditLogs);
          setAuditLogs(response.auditLogs.map((audit: AuditLogType) => audit));
        } else {
          console.log("No audit logs array found, setting empty array");
          setAuditLogs([]);
        }

        if (Array.isArray(response?.usageLogs)) {
          console.log("Setting usage logs:", response.usageLogs);
          setUsageLogs(response.usageLogs.map((usage: UsageLogType) => usage));
        } else {
          console.log("No usage logs array found, setting empty array");
          setUsageLogs([]);
        }
      } catch (error) {
        console.error("Error fetching logs:", error);
        setAuditLogs([]);
        setUsageLogs([]);
      } finally {
        setContentLoading(false);
      }
    }

    async function fetchEnvs() {
      setContentLoading(true);
      try {
        const data = await fetch(`${ENVS_API_ENDPOINT}/${consoleId}/all`, {
          credentials: "include",
          headers: {
            "x-project-id": String(consoleId || ""),
            "x-polling-req": "true", // Indicate this is a polling request
          },
        });

        if (!data.ok) {
          throw new Error(`Failed to fetch envs: ${data.status}`);
        }

        const response = await data.json();
        if (Array.isArray(response?.environments)) {
          setEnvs(response.environments.map((env: EnvType) => env));
        } else {
          setEnvs([]);
        }
      } catch (error) {
        console.error("Error fetching envs:", error);
        setEnvs([]);
      } finally {
        setContentLoading(false);
      }
    }

    if (notifications.length == 0) {
      fetchNotifications();
    }

    if (envs.length == 0) {
      fetchEnvs();
    }

    if (containers.length == 0) {
      fetchContainers();
    }

    if (links.length == 0) {
      fetchLinks();
    }

    if (auditLogs.length == 0 || usageLogs.length == 0) {
      console.log("Fetching logs because arrays are empty");
      fetchLogs();
    }

    const interval = setInterval(() => {
      fetchNotifications();
      fetchEnvs();
      fetchContainers();
      fetchLogs();
      fetchLinks();
    }, 30000);
    return () => clearInterval(interval);
  }, [
    setNotifications,
    setEnvs,
    setContainers,
    setAuditLogs,
    setUsageLogs,
    consoleId,
    user,
    loading,
    notifications.length,
    envs.length,
    containers.length,
    auditLogs.length,
    usageLogs.length,
  ]);

  // Fetch key details only once, even if the response is empty
  useEffect(() => {
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
            headers: {
              "x-project-id": String(consoleId || ""),
            },
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
          } else {
            removeKey();
          }
        } catch (error) {
          console.error("Error fetching projects:", error);
          removeKey();
        } finally {
          setContentLoading(false);
        }
      }
    }

    if (!key) {
      fetchKeyDetails();
    }
  }, [key, setKey, consoleId, projects, user, loading, removeKey]);

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
