"use client";

import { useState } from "react";
import { ChevronRight, CodeXml, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLocalStorage } from "usehooks-ts";

export default function CommunityBanner() {
  const [isVisible, setIsVisible] = useLocalStorage<boolean>(
    "@prexo-communityBanner",
    true,
  );

  if (!isVisible) return null;

  return (
    <div className="border-b border-blue-400/50 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 dark:from-blue-800 dark:via-blue-700 dark:to-blue-800 px-4 py-3 text-foreground md:py-2">
      <div className="flex gap-2 md:items-center">
        <div className="flex grow gap-3 md:items-center md:justify-center">
          <CodeXml
            className="shrink-0 opacity-60 max-md:mt-0.5"
            size={16}
            aria-hidden="true"
          />
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <p className="text-sm">
              Join our developer community and get $10 of free credits to get
              started.
            </p>
            <div className="flex gap-2 max-md:flex-wrap">
              <Button variant={"annc"}>
                Join Discord
                <ChevronRight />
              </Button>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
          onClick={() => setIsVisible(false)}
          aria-label="Close banner"
        >
          <XIcon
            size={16}
            className="opacity-60 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />
        </Button>
      </div>
    </div>
  );
}
