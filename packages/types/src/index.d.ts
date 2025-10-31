import { AI_MODELS_FREE_TIER } from "@prexo/utils/constants";

type UserType = {
  id: string;
  name: string;
  email: string;
  role?: string | null;
  hashKey?: string | null;
  lang?: string | null;
  emailVerified: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  image?: string | null;
};

type KeyType = {
  id: string;
  name: string;
  start: string;
  enabled: boolean;
  workspaceId: string;
  createdAt: Date | string | number;
  deletedAt: Date | string | number;
  expires?: Date | string | number | null;
  remaining?: number | null;
  roles: string[];
};

type LinkType = {
  id: string;
  type?: string | null;
  url: string;
  markdown?: string | null;
  summary?: string | null;
  containerId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

type FileType = {
  id: string;
  key: string;
  name: string;
  size: number;
  url?: string | null;
  downloadUrl?: string | null;
  type: string;
  embeddings: string[];
  containerId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

type NotificationType = {
  id: string;
  userId: string;
  title: string;
  desc?: string | null;
  icon?: string | null;
  url?: string | null;
  isSeen: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
};

type EnvType = {
  id: string;
  projectId: string;
  environment?: string | null;
  name: string;
  value: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

type ContainerType = {
  id: string;
  key: string;
  name: string;
  description?: string | null;
  resources?: number | null;
  filesId: string[];
  projectId: string;
  status?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

type ProjectType = {
  id: string;
  name: string;
  description?: string | null;
  domains: DomainType[];
  isFreeTier: boolean;
  endpoint?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  userId: string;
  memoId?: string | null;
  keyId?: string | null;
};

type DomainType = {
  id: string;
  name: string;
  alias?: string;
  status: "Valid" | "Invalid" | "Pending";
  telementry_key: string;
};

type AuditLogType = {
  id: string;
  time: Date | string;
  actor: string;
  action: string;
  endpoint: string;
  credits?: number | null;
  projectId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

type UsageLogType = {
  id: string;
  year?: number | null;
  month?: number | null;
  api_calls?: number | null;
  credits_used?: number | null;
  projectId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

interface PCards {
  isYearly?: boolean;
  isUserAuthenticated?: boolean;
  items: Array<{
    name: string;
    isFeatured: boolean;
    isFree: boolean;
    currency: string;
    btn: string;
    priceMonthly: number;
    priceYearly: number;
    beforePriceMonthly: number;
    beforePriceYearly: number;
    discountYearly: number;
    discountMonthly: number;
    benifits: string[];
  }>;
}

/**
 * String literal union of all allowed model IDs.
 * Use this type for type-safe model("") usage and editor autocomplete.
 *
 * Example:
 *   function setModel(model: AIModelId) { ... }
 *   setModel("deepseek/deepseek-chat-v3-0324:free"); // type-safe, autocompletes
 */
type AIModelsFreeTierId = (typeof AI_MODELS_FREE_TIER)[number]["id"];

/**
 * Full model object type for free tier models.
 */
type AIModelsFreeTier = (typeof AI_MODELS_FREE_TIER)[number];

export type {
  UserType,
  ProjectType,
  PCards,
  KeyType,
  NotificationType,
  DomainType,
  EnvType,
  ContainerType,
  AIModelsFreeTierId,
  AIModelsFreeTier,
  AuditLogType,
  UsageLogType,
  LinkType,
  FileType,
};
