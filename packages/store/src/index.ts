import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  ApiKeyStore,
  AuditLogStore,
  ContainerStore,
  DomainStore,
  EnvStore,
  FilesStore,
  LinksStore,
  MyProfileStore,
  NotificationsStore,
  ProjectStore,
  UsageLogStore,
  UserStore,
} from "../types";

const useUsersStore = create<UserStore>()(
  persist(
    (set) => ({
      users: [],
      addUser: (user) => set((state) => ({ users: [...state.users, user] })),
      removeUser: (userId) =>
        set((state) => ({ users: state.users.filter((u) => u.id !== userId) })),
      setUsers: (users) => set({ users }),
    }),
    {
      name: "@prexo-#users",
    },
  ),
);

const useApiKeyStore = create<ApiKeyStore>()(
  persist(
    (set) => ({
      key: null,
      addKey: (key) => set({ key }),
      removeKey: () => set({ key: null }),
      setKey: (key) => set({ key }),
    }),
    {
      name: "@prexo-#key",
    },
  ),
);

const useProjectsStore = create<ProjectStore>()(
  persist(
    (set) => ({
      projects: [],
      addProject: (project) =>
        set((state) => ({ projects: [...state.projects, project] })),
      removeProject: (projectId) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== projectId),
        })),
      setProjects: (projects) => set({ projects }),
    }),
    {
      name: "@prexo-#projects",
    },
  ),
);

const useNotificationsStore = create<NotificationsStore>()(
  persist(
    (set) => ({
      notifications: [],
      addNotifications: (noty) =>
        set((state) => ({ notifications: [...state.notifications, noty] })),
      removeNotification: (notyId) =>
        set((state) => ({
          notifications: state.notifications.filter((p) => p.id !== notyId),
        })),
      setNotifications: (notifications) => set({ notifications }),
    }),
    {
      name: "@prexo-#notifications",
    },
  ),
);

const useDomainsStore = create<DomainStore>()(
  persist(
    (set) => ({
      domains: [],
      addDomain: (domain) =>
        set((state) => ({ domains: [...state.domains, domain] })),
      removeDomain: (domainId) =>
        set((state) => ({
          domains: state.domains.filter((p) => p.id !== domainId),
        })),
      setDomains: (domains) => set({ domains }),
    }),
    {
      name: "@prexo-#domains",
    },
  ),
);

const useEnvsStore = create<EnvStore>()(
  persist(
    (set) => ({
      envs: [],
      addEnv: (env) => set((state) => ({ envs: [...state.envs, env] })),
      removeEnv: (envId) =>
        set((state) => ({
          envs: state.envs.filter((p) => p.id !== envId),
        })),
      setEnvs: (envs) => set({ envs }),
    }),
    {
      name: "@prexo-#environments",
    },
  ),
);

const useLinksStore = create<LinksStore>()(
  persist(
    (set) => ({
      links: [],
      addLink: (link) => set((state) => ({ links: [...state.links, link] })),
      removeLink: (linkId) =>
        set((state) => ({
          links: state.links.filter((p) => p.id !== linkId),
        })),
      setLinks: (links) => set({ links }),
    }),
    {
      name: "@prexo-#contextLinks",
    },
  ),
);

const useFilesStore = create<FilesStore>()(
  persist(
    (set) => ({
      files: [],
      addFile: (file) => set((state) => ({ files: [...state.files, file] })),
      removeFile: (fileId) =>
        set((state) => ({
          files: state.files.filter((p) => p.id !== fileId),
        })),
      setFiles: (files) => set({ files }),
    }),
    {
      name: "@prexo-#contextFiles",
    },
  ),
);

const useContainersStore = create<ContainerStore>()(
  persist(
    (set) => ({
      containers: [],
      addContainer: (container) =>
        set((state) => ({ containers: [...state.containers, container] })),
      removeContainer: (containerId) =>
        set((state) => ({
          containers: state.containers.filter((p) => p.id !== containerId),
        })),
      setContainers: (containers) => set({ containers }),
    }),
    {
      name: "@prexo-#containers",
    },
  ),
);

const useAuditLogsStore = create<AuditLogStore>()(
  persist(
    (set) => ({
      auditLogs: [],
      addAuditLog: (audit) =>
        set((state) => ({ auditLogs: [...state.auditLogs, audit] })),
      removeAuditLog: (auditId) =>
        set((state) => ({
          auditLogs: state.auditLogs.filter((p) => p.id !== auditId),
        })),
      setAuditLogs: (auditLogs) => set({ auditLogs }),
    }),
    {
      name: "@prexo-#auditLogs",
    },
  ),
);

const useUsageLogsStore = create<UsageLogStore>()(
  persist(
    (set) => ({
      usageLogs: [],
      addUsageLog: (usage) =>
        set((state) => ({ usageLogs: [...state.usageLogs, usage] })),
      removeUsageLog: (usageId) =>
        set((state) => ({
          usageLogs: state.usageLogs.filter((p) => p.id !== usageId),
        })),
      setUsageLogs: (usageLogs) => set({ usageLogs }),
    }),
    {
      name: "@prexo-#usageLogs",
    },
  ),
);

const useMyProfileStore = create<MyProfileStore>()(
  persist(
    (set) => ({
      myProfile: null,
      addMyProfile: (user) => set({ myProfile: user }),
      removeMyProfile: (id) =>
        set((state) => ({
          myProfile:
            state.myProfile && state.myProfile.id === id
              ? null
              : state.myProfile,
        })),
    }),
    {
      name: "@prexo-#myProfile",
    },
  ),
);

export {
  useUsersStore,
  useMyProfileStore,
  useProjectsStore,
  useApiKeyStore,
  useDomainsStore,
  useNotificationsStore,
  useEnvsStore,
  useContainersStore,
  useAuditLogsStore,
  useUsageLogsStore,
  useLinksStore,
  useFilesStore
};
