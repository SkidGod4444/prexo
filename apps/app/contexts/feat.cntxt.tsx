"use client";
import * as Sentry from "@sentry/nextjs";
import { ReactNode, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { LDProvider } from "launchdarkly-react-client-sdk";
import Observability from "@launchdarkly/observability";
import SessionReplay from "@launchdarkly/session-replay";

import { logSentry } from "@/lib/logger";

export const FeatCntxt = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render until we're on the client
  if (!isClient) {
    return null;
  }

  const context = {
    kind: "user",
    key: user?.id || "anonymous",
    firstName: user?.firstName,
    lastName: user?.lastName,
    avatar: user?.imageUrl,
    email: user?.emailAddresses[0]?.emailAddress,
  };

  const clientSideID = process.env.NEXT_PUBLIC_LD_CLIENT_ID;

  // If no LaunchDarkly client ID is provided, avoid rendering children using LD hooks
  if (!clientSideID) {
    console.warn(
      "LaunchDarkly client ID not provided. Feature flags will not be available.",
    );
    logSentry(
      "LaunchDarkly client ID not provided. Feature flags will not be available.",
      "warn",
    );
    return null;
  }
  return (
    <LDProvider
      clientSideID={clientSideID}
      context={context}
      options={{
        bootstrap: "localStorage",
        inspectors: [Sentry.buildLaunchDarklyFlagUsedHandler()],
        plugins: [
          new Observability({
            networkRecording: {
              enabled: true,
              recordHeadersAndBody: true,
            },
          }),
          new SessionReplay({
            privacySetting: "none",
          }),
        ],
      }}
    >
      {children}
    </LDProvider>
  );
};
