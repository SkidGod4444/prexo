"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ClerkCntxt } from "@/contexts/clerk.cntxt";
import { FeatCntxt } from "@/contexts/feat.cntxt";
import { UserProvider } from "@/contexts/user.cntxt";
import { ContentProvider } from "@/contexts/store.cntxt";
import { ToastProvider } from "@/components/ui/toast";
import { Analytics } from "@vercel/analytics/next";
import ConsoleMessage from "@/components/custom/console.msg";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <ClerkCntxt>
        <FeatCntxt>
          <UserProvider>
            <ContentProvider>
              <ToastProvider position="bottom-center">
                {children}
                <Analytics />
              </ToastProvider>
              <ConsoleMessage />
            </ContentProvider>
          </UserProvider>
        </FeatCntxt>
      </ClerkCntxt>
    </ClerkProvider>
  );
}
