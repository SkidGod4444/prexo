"use client";
import { useUser } from "@clerk/nextjs";
import Observability from "@launchdarkly/observability";
import SessionReplay from "@launchdarkly/session-replay";
import * as Sentry from "@sentry/nextjs";
import { LDProvider } from "launchdarkly-react-client-sdk";
import { type ReactNode, useEffect, useState } from "react";
import { IdentifyComponent, OpenPanelComponent } from "@openpanel/nextjs";
import { logSentry } from "@/lib/logger";
import Script from "next/script";

declare global {
  interface Window {
    $ujq?: unknown[][];
    uj?: {
      init: (
        key: string,
        options: { widget: boolean; position: string; theme: string },
      ) => void;
      identify: (user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        avatar: string;
      }) => void;
    };
  }
}

export const FeatCntxt = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Setup UserJot queue and proxy before script loads
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.$ujq = window.$ujq || [];
      window.uj =
        window.uj ||
        (new Proxy(
          {},
          {
            get:
              (_: unknown, p: string) =>
              (...a: unknown[]) =>
                window.$ujq?.push([p, ...a]),
          },
        ) as Window["uj"]);
    }
  }, []);

  // Initialize UserJot after script loads
  useEffect(() => {
    if (typeof window !== "undefined" && window.uj) {
      const checkAndInit = () => {
        if (window.uj && typeof window.uj.init === "function") {
          window.uj.init("cmet0uyxc04q5lb0h49hv6lil", {
            widget: true,
            position: "right",
            theme: "auto",
          });
        } else {
          setTimeout(checkAndInit, 100);
        }
      };
      checkAndInit();
    }
  }, []);

  // Identify user after script loads
  useEffect(() => {
    if (typeof window !== "undefined" && window.uj && user) {
      const checkAndIdentify = () => {
        if (window.uj && typeof window.uj.identify === "function") {
          window.uj.identify({
            id: user.id || "user_123",
            email: user.emailAddresses[0]?.emailAddress || "",
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            avatar: user.imageUrl || "",
          });
        } else {
          setTimeout(checkAndIdentify, 100);
        }
      };
      checkAndIdentify();
    }
  }, [user]);

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
      <OpenPanelComponent
        clientId={process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID || ""}
        trackScreenViews={true}
        trackAttributes={true}
        trackOutgoingLinks={true}
        profileId={user?.id || ""}
      />
      <IdentifyComponent
        profileId={user?.id || ""}
        firstName={user?.firstName || ""}
        lastName={user?.lastName || ""}
        email={user?.emailAddresses[0]?.emailAddress || ""}
      />
      <Script
        src="https://cdn.userjot.com/sdk/v2/uj.js"
        strategy="afterInteractive"
        type="module"
      />
      {children}
    </LDProvider>
  );
};
