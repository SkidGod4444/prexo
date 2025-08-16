import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  ApiKeyStore,
  ContainerStore,
  DomainStore,
  EnvStore,
  MyProfileStore,
  NotificationsStore,
  ProjectStore,
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
};
