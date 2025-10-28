import Link from "next/link";
import { Button } from "@/components/ui/button";

// Inline SVG with gradients for the warning icon
function WarningIcon() {
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
        {/* Background gradient: dark gray to slightly lighter gray */}
        <linearGradient id={"404-bg"} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#23272e" /> {/* dark gray */}
          <stop offset="100%" stopColor="#3a3f47" /> {/* lighter gray */}
        </linearGradient>
        {/* Border gradient: gray to white (was orange, now white) */}
        <linearGradient id={"404-border"} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#3a3f47" /> {/* gray */}
          <stop offset="100%" stopColor="#ffffff" /> {/* white */}
        </linearGradient>
      </defs>
      <path
        fill="url(#404-background)"
        stroke="url(#404-border)"
        strokeWidth={4}
        d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"
      />
    </svg>
  );
}

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <WarningIcon />
      <h1 className="font-uxum font-bold text-3xl text-white mb-2">
        Page not found!
      </h1>
      <p className="text-gray-400 text-base mb-8 text-center max-w-md">
        We&apos;re sorry, we couldn&apos;t find the page you were looking for.
      </p>
      <Link href="/">
        <Button size={"sm"}>Return home</Button>
      </Link>
    </div>
  );
}
