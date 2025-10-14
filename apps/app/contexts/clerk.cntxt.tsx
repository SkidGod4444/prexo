"use client";
import { ReactNode } from "react";
import {
  ClerkLoaded,
  ClerkLoading,
  ClerkDegraded,
  ClerkFailed,
} from "@clerk/nextjs";
import { Spinner } from "@/components/ui/spinner";

export const ClerkCntxt = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <ClerkLoading>
        <div className="flex items-center justify-center min-h-screen w-full">
          <Spinner className="h-8 w-8 animate-spin" />
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        {children}
        <ClerkDegraded>
          <div className="flex items-center justify-center min-h-screen w-full">
            <p className="text-lg text-yellow-600">
              Clerk is experiencing issues. Please try again later.
            </p>
          </div>
        </ClerkDegraded>
      </ClerkLoaded>
      <ClerkFailed>
        <div className="flex items-center justify-center min-h-screen w-full">
          <p className="text-lg text-red-600">
            Something went wrong with Clerk. Please contact support.
          </p>
        </div>
      </ClerkFailed>
    </>
  );
};
