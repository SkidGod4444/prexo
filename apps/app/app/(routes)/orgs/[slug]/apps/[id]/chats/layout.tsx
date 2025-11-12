"use client";

import { Maximize2, Minimize2 } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import ConvoFilter from "@/components/custom/chats/convo.filter";
import ConvoPanel from "@/components/custom/chats/convo.panel";
import { Button } from "@/components/ui/button";
import { Frame, FramePanel } from "@/components/ui/frame";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";

export default function ChatsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = isFullscreen ? "hidden" : "";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFullscreen]);

  useEffect(() => {
    if (!isFullscreen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  const frameClassName = cn(
    "relative flex flex-col gap-2 bg-secondary overflow-hidden rounded-xl transition-all duration-200",
    isFullscreen
      ? "fixed inset-0 z-50 h-screen w-screen rounded-none p-4 sm:p-6 shadow-2xl"
      : "h-full w-full p-2",
  );

  return (
    <>
      {isFullscreen && (
        <div className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm transition-opacity" />
      )}
      <Frame className={frameClassName}>
        <div className="flex items-center justify-between">
          <ConvoFilter />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="h-9 w-9"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 size={16} className="text-muted-foreground" />
            ) : (
              <Maximize2 size={16} className="text-muted-foreground" />
            )}
          </Button>
        </div>
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          <FramePanel className="flex h-full w-full gap-0 overflow-hidden rounded-xl bg-background p-0">
            <ResizablePanel
              defaultSize={25}
              minSize={isFullscreen ? 20 : 25}
              className={cn(
                "flex flex-col overflow-hidden rounded-xl bg-secondary p-1 transition-all",
                isFullscreen
                  ? "mr-0 max-h-[var(--chat-window-max-height,100vh)]"
                  : "mr-2 max-h-[70dvh]",
              )}
            >
              <ConvoPanel />
            </ResizablePanel>
            <ResizableHandle withHandle className="h-full" />
            <ResizablePanel
              defaultSize={isFullscreen ? 75 : 75}
              minSize={isFullscreen ? 45 : 60}
              className={cn(
                "flex h-full flex-col overflow-hidden rounded-xl bg-secondary transition-all",
                isFullscreen ? "ml-0" : "ml-2",
              )}
            >
              <div
                className="flex h-full w-full"
                style={
                  {
                    "--chat-window-max-height": isFullscreen ? "100vh" : "70vh",
                  } as React.CSSProperties
                }
              >
                {children}
              </div>
            </ResizablePanel>
          </FramePanel>
        </ResizablePanelGroup>
      </Frame>
    </>
  );
}
