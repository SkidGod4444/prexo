import React from "react";
import {
  SectionHeader,
  SectionHeaderHeading,
  SectionHeaderDescription,
} from "../../text-wrappers";
import { AnimatedBeamDB, AnimatedBeamMemoryInput } from "./memory.anim";
import { Card, CardDescription, CardFooter } from "@/components/ui/card";

export default function MemorySec() {
  return (
    <div className="relative w-full items-center justify-center py-10">
      <div className="px-4 md:px-14">
        <SectionHeader className="flex flex-col z-50 mb-10 items-start">
          <SectionHeaderHeading>
            Customisable, Persistent Memory
          </SectionHeaderHeading>
          <SectionHeaderDescription>
            Our memory system allows you to create custom memory inputs and
            databases, enabling your agents to learn and adapt over time.
            customer queries and tasks.
          </SectionHeaderDescription>
        </SectionHeader>

        <div className="grid grid-cols-1 px-4 md:px-14 max-w-7xl mx-auto lg:grid-cols-2 gap-5">
          <Card className="flex items-center justify-between border-dashed bg-transparent p-5 rounded-3xl">
            <span className="text-sm bg-muted text-muted-foreground border rounded-xl px-2 py-1 border-dashed self-start">
              Context Memory
            </span>
            <CardDescription>
              <span className="text-lg text-muted-foreground">
                Agent&apos;s memory extracts contexts from your provided
                documents, allowing it to query the context and adapt its
                responses accordingly.
              </span>
            </CardDescription>

            <CardFooter className="w-full mt-4 px-3 md:px-auto">
              <AnimatedBeamMemoryInput />
            </CardFooter>
          </Card>

          <Card className="flex items-center justify-between border-dashed bg-transparent p-5 rounded-3xl">
          <span className="text-sm bg-muted text-muted-foreground border rounded-xl px-2 py-1 border-dashed self-start">
              Chat Memory
            </span>
            <CardDescription>
              <span className="text-lg text-muted-foreground">
                The memory database stores all the interactions and contexts,
                allowing your agents to recall past conversations and provide
                more relevant responses per user.
              </span>
            </CardDescription>

            <CardFooter className="flex w-[350] md:w-full md:px-auto mt-auto md:mb-20">
              <AnimatedBeamDB />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
