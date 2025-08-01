"use client";

import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import SectionLabel from "./custom/section.label";
import { SystemMode } from "./custom/themes/system";
import { LightMode } from "./custom/themes/light";
import { DarkMode } from "./custom/themes/dark";

export default function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();

  // Set a fixed width for the theme cards to prevent border overflow
  const cardWidth = "w-[280px]"; // adjust as needed to match content

  return (
    <div className="flex flex-col gap-4">
      <SectionLabel
        label="Interface Settings"
        msg="Select or customize your interface theme."
      />
      {theme ? (
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex flex-col">
            <div
              className={cn(
                cardWidth,
                "h-[190px]",
                "rounded-2xl overflow-hidden cursor-pointer border-4 border-transparent box-border",
                theme == "system" && "border-border",
              )}
              onClick={() => setTheme("system")}
            >
              <SystemMode />
            </div>
            <span className="mt-2 text-sm font-medium text-muted-foreground w-full text-center">
              System Theme
            </span>
          </div>

          <div className="flex flex-col">
            <div
              className={cn(
                cardWidth,
                "h-[190px]",
                "rounded-2xl overflow-hidden cursor-pointer border-4 border-transparent box-border",
                theme == "light" && "border-border",
              )}
              onClick={() => setTheme("light")}
            >
              <LightMode />
            </div>
            <span className="mt-2 text-sm font-medium text-muted-foreground w-full text-center">
              Light Theme
            </span>
          </div>

          <div className="flex flex-col">
            <div
              className={cn(
                cardWidth,
                "h-[190px]",
                "rounded-2xl overflow-hidden cursor-pointer border-4 border-transparent box-border",
                theme == "dark" && "border-border",
              )}
              onClick={() => setTheme("dark")}
            >
              <DarkMode />
            </div>
            <span className="mt-2 text-sm font-medium text-muted-foreground w-full text-center">
              Dark Theme
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-5">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="w-[280px] h-[190px] rounded-xl">
              <div className="h-3 flex items-center gap-1.5 p-4">
                <div className="w-3 h-3 rounded-full bg-muted" />
                <div className="w-3 h-3 rounded-full bg-muted" />
                <div className="w-3 h-3 rounded-full bg-muted" />
              </div>
            </Skeleton>
          ))}
        </div>
      )}
    </div>
  );
}
