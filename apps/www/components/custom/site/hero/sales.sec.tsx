import React from "react";
import { SectionHeaderHeading } from "../../text-wrappers";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PointerHighlight } from "@/components/ui/pointer-highlight";
import { useIsMobile } from "@/hooks/use-mobile";

export default function SalesSec() {
  const isMobile = useIsMobile();
  return (
    <div className="relative w-full items-center justify-center py-10">
      <div className="px-4 md:px-14 flex flex-col md:flex-row items-center md:justify-between gap-10 w-full">
        <SectionHeaderHeading className="text-center md:text-left w-full md:w-auto">
          Let Agents, Make you{" "}
          {!isMobile ? (
            <PointerHighlight>
              <span className="px-2">Dollars</span>
            </PointerHighlight>
          ) : (
            "Dollars"
          )}
        </SectionHeaderHeading>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10 w-full md:w-auto">
          <Link
            href="https://cal.com/saidevdhal/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto"
          >
            <Button
              className="w-full md:w-auto text-lg py-6 px-8 rounded-2xl"
              variant="outline"
              size="lg"
            >
              Book Meeting
            </Button>
          </Link>
          <Link href="/auth" className="w-full md:w-auto">
            <Button
              className="w-full md:w-auto text-lg py-6 px-8 rounded-2xl"
              size="lg"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
