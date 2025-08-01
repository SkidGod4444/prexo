import Image from "next/image";
import Link from "next/link";
import React from "react";
import { socials } from "@prexo/utils/constants";
import { InteractiveHoverButton } from "../../interactive-hover-button";

export default function CtaBtns({ isMob = false }: { isMob?: boolean }) {
  return (
    <div className="flex items-center justify-center gap-4 mt-20 z-50">
      <Link href={socials.docs} target="_blank" rel="noreferrer">
        <InteractiveHoverButton>Documentation</InteractiveHoverButton>
      </Link>

      <div className="relative flex flex-col items-center">
        <Image
          src={"/img/try-it.png"}
          alt="Try it now"
          width={150}
          height={150}
          className="invert absolute -top-20 left-1/2 -translate-x-1/4 z-50"
        />
        <Link href={"/auth"}>
          <InteractiveHoverButton>
            {isMob ? "Try it for free" : "Get Started for Free"}
          </InteractiveHoverButton>
        </Link>
      </div>
    </div>
  );
}
