import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MyProfileStore, ProjectStore, UserStore } from "../types";

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

export { useUsersStore, useMyProfileStore, useProjectsStore };
