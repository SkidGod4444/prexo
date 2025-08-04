"use client";

import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import SectionLabel from "../section.label";
import { SystemMode } from "../themes/system";
import { LightMode } from "../themes/light";
import { DarkMode } from "../themes/dark";

export default function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();

  const cardContainerClass =
    "w-full aspect-[16/5] md:aspect-[16/7] lg:aspect-[16/11] flex items-stretch";
  const cardInnerClass =
    "flex-1 rounded-2xl overflow-hidden cursor-pointer border-4 border-transparent box-border flex items-center justify-center h-full";

  return (
    <div className="flex flex-col gap-4">
      <SectionLabel
        label="Interface Settings"
        msg="Select or customize your interface theme."
      />
      {theme ? (
        <div className="flex flex-col md:flex-row gap-2 ld:gap-4">
          <div className="flex flex-col">
            <div
              className={cn(
                cardContainerClass
              )}
            >
              <div
                className={cn(
                  cardInnerClass,
                  theme == "system" && "border-border"
                )}
                onClick={() => setTheme("system")}
              >
                <SystemMode className="w-full h-full" />
              </div>
            </div>
            <span className="mt-2 text-sm font-medium text-muted-foreground w-full text-center">
              System Theme
            </span>
          </div>

          <div className="flex flex-col">
            <div className={cn(cardContainerClass)}>
              <div
                className={cn(
                  cardInnerClass,
                  theme == "light" && "border-border"
                )}
                onClick={() => setTheme("light")}
              >
                <LightMode className="w-full h-full" />
              </div>
            </div>
            <span className="mt-2 text-sm font-medium text-muted-foreground w-full text-center">
              Light Theme
            </span>
          </div>

          <div className="flex flex-col">
            <div className={cn(cardContainerClass)}>
              <div
                className={cn(
                  cardInnerClass,
                  theme == "dark" && "border-border"
                )}
                onClick={() => setTheme("dark")}
              >
                <DarkMode className="w-full h-full" />
              </div>
            </div>
            <span className="mt-2 text-sm font-medium text-muted-foreground w-full text-center">
              Dark Theme
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={cardContainerClass}>
              <Skeleton className="flex-1 rounded-xl h-full w-full">
                <div className="h-3 flex items-center gap-1.5 p-4">
                  <div className="w-3 h-3 rounded-full bg-muted" />
                  <div className="w-3 h-3 rounded-full bg-muted" />
                  <div className="w-3 h-3 rounded-full bg-muted" />
                </div>
              </Skeleton>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
