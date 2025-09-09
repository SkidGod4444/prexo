import {
  ProjectType,
  UserType,
  KeyType,
  DomainType,
  NotificationType,
  EnvType,
  ContainerType,
  AuditLogType,
  UsageLogType,
  LinkType,
} from "@prexo/types";

type UserStore = {
  users: UserType[];
  addUser: (user: UserType) => void;
  removeUser: (userId: string) => void;
  setUsers: (users: UserType[]) => void;
};

type ApiKeyStore = {
  key: KeyType | null;
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

type AuditLogStore = {
  auditLogs: AuditLogType[];
  addAuditLog: (audit: AuditLogType) => void;
  removeAuditLog: (auditId: string) => void;
  setAuditLogs: (audits: AuditLogType[]) => void;
};

type LinksStore = {
  links: LinkType[];
  addLink: (link: LinkType) => void;
  removeLink: (linkId: string) => void;
  setLinks: (links: LinkType[]) => void;
};

type UsageLogStore = {
  usageLogs: UsageLogType[];
  addUsageLog: (usage: UsageLogType) => void;
  removeUsageLog: (usageId: string) => void;
  setUsageLogs: (usages: UsageLogType[]) => void;
};

type NotificationsStore = {
  notifications: NotificationType[];
  addNotifications: (noty: NotificationType) => void;
  removeNotification: (notyId: string) => void;
  setNotifications: (notys: NotificationType[]) => void;
};

type DomainStore = {
  domains: DomainType[];
  addDomain: (domain: DomainType) => void;
  removeDomain: (domainId: string) => void;
  setDomains: (domains: DomainType[]) => void;
};

type EnvStore = {
  envs: EnvType[];
  addEnv: (env: EnvType) => void;
  removeEnv: (envId: string) => void;
  setEnvs: (envs: EnvType[]) => void;
};

type ContainerStore = {
  containers: ContainerType[];
  addContainer: (env: ContainerType) => void;
  removeContainer: (envId: string) => void;
  setContainers: (envs: ContainerType[]) => void;
};

export type {
  UserStore,
  MyProfileStore,
  ProjectStore,
  ApiKeyStore,
  DomainStore,
  NotificationsStore,
  EnvStore,
  ContainerStore,
  AuditLogStore,
  UsageLogStore,
  LinksStore,
};
