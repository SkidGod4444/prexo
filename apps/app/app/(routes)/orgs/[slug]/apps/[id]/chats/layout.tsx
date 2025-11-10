import type React from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import ConvoPanel from "@/components/custom/chats/convo.panel";
import { Frame, FramePanel } from "@/components/ui/frame";
import ConvoFilter from "@/components/custom/chats/convo.filter";

export default function ChatsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Frame className="relative flex flex-col gap-2 h-full w-full bg-secondary overflow-hidden p-2 rounded-xl">
        <ConvoFilter/>
      <ResizablePanelGroup direction="horizontal" className="h-full w-full">
        <FramePanel className="flex h-full w-full bg-background overflow-hidden p-0 gap-0 rounded-xl">
          <ResizablePanel defaultSize={25} minSize={20} className="border-r-2 bg-secondary rounded-xl p-1 min-h-full flex flex-col overflow-hidden">
            <ConvoPanel />
          </ResizablePanel>
          <ResizableHandle className="h-full" />
          <ResizablePanel defaultSize={75} minSize={60} className="h-full bg-secondary rounded-xl flex flex-col overflow-hidden">
            {children}
          </ResizablePanel>
        </FramePanel>
      </ResizablePanelGroup>
    </Frame>
  );
}
