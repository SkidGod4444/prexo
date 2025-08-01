import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  IconBrain,
  IconRobot,
  IconCode,
  IconArrowRight,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import {
  SectionHeader,
  SectionHeaderHeading,
  SectionHeaderDescription,
} from "../../text-wrappers";

const agentCards = [
  {
    title: "Easy Integration",
    description:
      "Integrate agents seamlessly into your existing applications. Our platform supports ReactJs frameworks and languages, making it easy to get started.",
    icon: IconBrain,
    href: "https://docs.prexoai.xyz/app/quick-start",
    class: "md:col-span-2 md:row-span-2 md:h-[40rem]",
    image: "/img/demo.config.png",
  },
  {
    title: "Agentic Automation",
    description:
      "Automate support service and sales processes with intelligent workflows. This feature allows you to focus on more important aspects of your projects.",
    icon: IconRobot,
    href: "https://docs.prexoai.xyz/",
    class: "",
    image: null,
  },
  {
    title: "Personalized Responses",
    description:
      "Agents remembers user interactions and preferences, allowing them to provide personalized responses. This enhances user experience and engagement.",
    icon: IconCode,
    href: "https://docs.prexoai.xyz/",
    class: "",
    image: "",
  },
];

export default function AgentsSec({ isMob = false }: { isMob?: boolean }) {
  return (
    <div className="relative w-full items-center justify-center py-10">
      <div className="px-4 md:px-14">
        <SectionHeader className="flex flex-col z-50 mb-10 items-start">
          <SectionHeaderHeading>
            Why Agents? Not Just Chatbots
          </SectionHeaderHeading>
          <SectionHeaderDescription>
            Agents are more than just chatbots; they are intelligent systems
            that can handle complex background tasks, engage customers, qualify
            leads, and resolve issues. They learn from interactions and adapt to
            provide better responses over time.
          </SectionHeaderDescription>
        </SectionHeader>

        <div className="grid grid-cols-1 px-8 md:px-14 max-w-6xl mx-auto md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agentCards.map((card, index) => (
            <div
              key={index}
              className={cn(
                card.class,
                "relative group overflow-hidden backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-dashed border-border cursor-pointer",
              )}
            >
              {card.image && !isMob && (
                <div className="w-full absolute bottom-[-8rem] right-[-4rem] h-auto mb-4 rounded-xl">
                  <Image
                    src={card.image}
                    alt={card.title}
                    className="h-[35rem] object-contain mb-4 rounded-lg"
                    width={800}
                    height={800}
                  />
                </div>
              )}
              <h3 className="text-2xl font-semibold mb-2">{card.title}</h3>
              <p className="text-muted-foreground">{card.description}</p>
              <div className="md:bottom-[-30rem] left-[10%] group-hover:opacity-100 opacity-30 z-[-1] absolute bg-gradient-to-t from-secondary/20 to-primary/50 blur-[8em] rounded-xl transition-all translate-x-[-50%] duration-500 ease-out w-[10rem] md:w-[30rem] h-[20rem] md:h-[30rem] rotate-[0deg]" />
              <Link
                href={card.href}
                className="text-primary group w-fit flex items-center gap-1 bg-accent text-xs border border-accent rounded-full px-3 mt-4 py-1 transition-all duration-300 hover:bg-primary hover:text-background"
              >
                <span className="font-semibold text-xs">Read More</span>{" "}
                <IconArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all duration-300" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
