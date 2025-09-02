"use client";

import { cn } from "@/lib/utils";
import { socials } from "@prexo/utils/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../logo";

export function MainNavbar() {
  const pathname = usePathname();

  return (
    <div className="flex">
      <Link
        href="/"
        draggable={false}
        className="mr-8 flex items-center space-x-2"
      >
        <Logo isTextVisible={false} />
      </Link>
      <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
        <Link
          href={socials.docs}
          target="_blank"
          rel="noreferrer"
          draggable={false}
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/docs")
              ? "text-foreground"
              : "text-foreground/60",
          )}
        >
          Docs
        </Link>

        <Link
          href="/pricing"
          draggable={false}
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/pricing")
              ? "text-foreground"
              : "text-foreground/60",
          )}
        >
          Pricing
        </Link>

        {/* <Link
          href="/contact"
          draggable={false}
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/contact")
              ? "text-foreground"
              : "text-foreground/60",
          )}
        >
          Contact
        </Link> */}
      </nav>
    </div>
  );
}
