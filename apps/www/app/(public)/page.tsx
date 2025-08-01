"use client";

import AgentsSec from "@/components/custom/site/hero/agents.sec";
import { AnncBtn } from "@/components/custom/site/hero/annc.btn";
import CtaBtns from "@/components/custom/site/hero/cta.btn";
import MemorySec from "@/components/custom/site/hero/memory.sec";
import OssSec from "@/components/custom/site/hero/oss.sec";
import {
  SectionHeaderDescription,
  SectionHeaderHeading,
} from "@/components/custom/text-wrappers";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Home() {
  const isMob = useIsMobile();
  const g_len = isMob ? 5 : 20;
  return (
    <main className="flex flex-col items-center justify-center w-full min-h-screen overflow-hidden gap-5">
      <section
        id="hero"
        className="relative flex flex-col items-center justify-center w-full h-screen p-8 md:px-14 border-y border-dashed overflow-hidden rounded-t-4xl rounded-b-4xl mt-2"
      >
        <div
          className="absolute inset-0 z-0 flex overflow-hidden [mask-image:radial-gradient(circle_at_center,white_0%,white_30%,transparent_70%)]"
          style={{ opacity: 0.5 }}
        >
          <div
            className="absolute inset-0 h-full w-full opacity-[0.2] [mask-image:radial-gradient(#fff,transparent,70%)]"
            style={{
              backgroundImage: 'url("/img/noise.png")',
              backgroundSize: "40%",
              backgroundPosition: "center",
            }}
          />
          <div className="flex w-full h-full">
            {Array.from({ length: g_len }).map((_, i) => (
              <div
                key={i}
                className="flex-1 min-w-0 h-full bg-gradient-to-r from-neutral-100 to-white shadow-[2px_0px_0px_0px_var(--color-neutral-200)] dark:from-neutral-900 dark:to-black dark:shadow-[2px_0px_0px_0px_var(--color-neutral-800)]"
              />
            ))}
          </div>
        </div>
        <AnncBtn />
        <div className="flex flex-col items-center justify-center">
          <SectionHeaderHeading>Transform Your SaaS with</SectionHeaderHeading>
          <SectionHeaderHeading>
            AI-Powered Sales & Support
          </SectionHeaderHeading>

          <SectionHeaderDescription className="mt-2 md:text-center">
            Create intelligent agents that handle both sales and support 24/7,
            engage customers, qualify leads, and resolve issues.
          </SectionHeaderDescription>
        </div>
        <CtaBtns isMob={isMob} />
      </section>
      <section
        id="agents"
        className="flex flex-col items-center justify-center w-full h-full p-4 border-y border-dashed rounded-t-4xl rounded-b-4xl"
      >
        <AgentsSec isMob={isMob} />
      </section>

      <section
        id="memory"
        className="flex flex-col items-center justify-center w-full h-full p-4 border-y border-dashed rounded-t-4xl rounded-b-4xl"
      >
        <MemorySec />
      </section>

      <section
        id="oss"
        className="flex flex-col items-center justify-center w-full h-full p-4 border-y border-dashed rounded-t-4xl rounded-b-4xl"
      >
        <OssSec />
      </section>
    </main>
  );
}
