"use client";

import { Maximize2, Minimize2 } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import ConvoFilter from "@/components/custom/chats/convo.filter";
import ConvoPanel from "@/components/custom/chats/convo.panel";
import { Button } from "@/components/ui/button";
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
  const [filterValue, setFilterValue] = useState<string>("all");

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

  const containerClassName = cn(
    "relative flex flex-col gap-3 bg-background transition-all duration-200",
    isFullscreen
      ? "fixed inset-0 z-50 h-screen w-screen p-4 sm:p-6"
      : "h-[calc(100vh-12rem)] w-full",
  );

  return (
    <>
      {isFullscreen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity" />
      )}
      <div className={containerClassName}>
        {/* Header */}
        <div className="flex items-center justify-between px-1">
          <ConvoFilter value={filterValue} onChange={setFilterValue} />
          <Button
            type="button"
            variant="outline"
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

        {/* Main Chat Area */}
        <div className="flex-1 overflow-hidden rounded-xl border border-border bg-background shadow-sm">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel
              defaultSize={30}
              minSize={20}
              maxSize={40}
              className="flex flex-col"
            >
              <ConvoPanel filter={filterValue} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={70} minSize={50}>
              {children}
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </>
  );
}
