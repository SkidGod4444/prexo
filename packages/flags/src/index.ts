import { createPostHogAdapter, type PostHogEntities } from "@flags-sdk/posthog";
import { dedupe, flag } from "flags/next";
import { authClient } from "@prexo/auth/client";

const postHogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const postHogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (!postHogKey || !postHogHost) {
  throw new Error(
    "Missing required environment variables: NEXT_PUBLIC_POSTHOG_KEY and/or NEXT_PUBLIC_POSTHOG_HOST",
  );
}

type Entities = PostHogEntities & {
  user?: { role: string };
};

const identify = dedupe(async (): Promise<Entities> => {
  const session = await authClient.getSession();
  const user = session?.data?.user ?? null;
  if (!user) return { distinctId: "" };
  if ("role" in user && typeof user.role === "string") {
    return { user: { role: user.role }, distinctId: user.id };
  }
  return { distinctId: "" };
});

const postHogAdapter = createPostHogAdapter({
  postHogKey,
  postHogOptions: {
    host: postHogHost,
  },
});

export const isPremiumUserFlag = flag<boolean>({
  key: "is-pro-user",
  defaultValue: false,
  identify,
  adapter: postHogAdapter.isFeatureEnabled(),
  decide: ({ entities }: { entities?: Entities }) => {
    if (!entities?.user || !entities?.user.role) return false;
    return entities.user.role === "pro";
  },
});

export const isFreeUserFlag = flag<boolean>({
  key: "is-free-user",
  defaultValue: false,
  identify,
  adapter: postHogAdapter.isFeatureEnabled(),
  decide: ({ entities }: { entities?: Entities }) => {
    if (!entities?.user || !entities?.user.role) return false;
    return entities.user.role === "onboarded";
  },
});
