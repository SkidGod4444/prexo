import { ProjectType, UserType, KeyType } from "@prexo/types";

type UserStore = {
  users: UserType[];
  addUser: (user: UserType) => void;
  removeUser: (userId: string) => void;
  setUsers: (users: UserType[]) => void;
};

type ApiKeyStore = {
  key: KeyType;
  addKey: (key: KeyType) => void;
  removeKey: () => void;
  setKey: (key: KeyType) => void;
};

type MyProfileStore = {
  myProfile: UserType | null;
  addMyProfile: (user: UserType) => void;
  removeMyProfile: (userId: string) => void;
};

type ProjectStore = {
  projects: ProjectType[];
  addProject: (project: ProjectType) => void;
  removeProject: (projectId: string) => void;
  setProjects: (projects: ProjectType[]) => void;
};

export type { UserStore, MyProfileStore, ProjectStore, ApiKeyStore };
