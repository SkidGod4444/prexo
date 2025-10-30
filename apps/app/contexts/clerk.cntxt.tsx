"use client";
import {
  ClerkDegraded,
  ClerkFailed,
  ClerkLoaded,
  ClerkLoading,
} from "@clerk/nextjs";
import { socials } from "@prexo/utils/constants";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type WarningIconProps = {
  variant?: "red" | "yellow";
};

function WarningIcon({ variant = "red" }: WarningIconProps) {
  // Color variants
  const gradients = {
    red: {
      bg: {
        id: "warning-bg-red",
        stops: [
          { offset: "0%", color: "#7f1d1d" }, // dark red
          { offset: "100%", color: "#dc2626" }, // medium red
        ],
      },
      border: {
        id: "warning-border-red",
        stops: [
          { offset: "0%", color: "#dc2626" }, // medium red
          { offset: "100%", color: "#fff" }, // white
        ],
      },
    },
    yellow: {
      bg: {
        id: "warning-bg-yellow",
        stops: [
          { offset: "0%", color: "#b45309" }, // dark yellow
          { offset: "100%", color: "#fde047" }, // light yellow
        ],
      },
      border: {
        id: "warning-border-yellow",
        stops: [
          { offset: "0%", color: "#fde047" }, // light yellow
          { offset: "100%", color: "#fff" }, // white
        ],
      },
    },
  };

  const g = gradients[variant];

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      className="h-24 w-24 mb-8"
      strokeWidth={4}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={96}
      height={96}
    >
      <defs>
        <linearGradient id={g.bg.id} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset={g.bg.stops[0].offset} stopColor={g.bg.stops[0].color} />
          <stop offset={g.bg.stops[1].offset} stopColor={g.bg.stops[1].color} />
        </linearGradient>
        <linearGradient id={g.border.id} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop
            offset={g.border.stops[0].offset}
            stopColor={g.border.stops[0].color}
          />
          <stop
            offset={g.border.stops[1].offset}
            stopColor={g.border.stops[1].color}
          />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${g.bg.id})`}
        stroke={`url(#${g.border.id})`}
        strokeWidth={4}
        d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"
      />
    </svg>
  );
}

export const ClerkCntxt = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <ClerkLoading>
        <div className="flex items-center justify-center min-h-screen w-full">
          <Spinner className="h-8 w-8 animate-spin" />
        </div>
      </ClerkLoading>
      <ClerkLoaded>{children}</ClerkLoaded>

      <ClerkDegraded>
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-yellow-700">
          <WarningIcon variant="yellow" />
          <h1 className="font-uxum font-bold text-3xl text-white mb-2">
            Error while loading...
          </h1>
          <p className=" text-base mb-8 text-center max-w-md">
            Clerk failed to load. Please refresh or contact support.
          </p>

          <div className="flex items-center justify-between gap-5">
            <Button variant={"warn"} onClick={() => window.location.reload()}>
              Reload page
            </Button>
            <Link href={socials.discord} target="_blank" rel="noreferrer">
              <Button variant={"warn"}>Contact Support</Button>
            </Link>
          </div>
        </div>
      </ClerkDegraded>

      <ClerkFailed>
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-red-800">
          <WarningIcon variant="red" />
          <h1 className="font-uxum font-bold text-3xl text-white mb-2">
            Error while loading...
          </h1>
          <p className=" text-base mb-8 text-center max-w-md">
            Clerk failed to load. Please refresh or contact support.
          </p>

          <div className="flex items-center justify-between gap-5">
            <Button
              variant={"destructive"}
              onClick={() => window.location.reload()}
            >
              Reload page
            </Button>
            <Link href={socials.discord} target="_blank" rel="noreferrer">
              <Button variant={"destructive"}>Contact Support</Button>
            </Link>
          </div>
        </div>
      </ClerkFailed>
    </>
  );
};
