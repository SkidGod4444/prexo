type UserType = {
  id: string;
  name: string;
  email: string;
  role?: string | null;
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

type ProjectType = {
  id: string;
  name: string;
  description?: string | null;
  domains: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
  userId: string;
  memoId?: string | null;
  keyId?: string | null;
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

export type { UserType, ProjectType, PCards, KeyType };
