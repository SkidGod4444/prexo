"use client";
import { Frame, FramePanel } from "@/components/ui/frame";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrgCardSkeleton() {
  return (
    <Frame className="flex border border-dashed bg-secondary w-[300px] gap-4 p-3">
      <FramePanel className="flex flex-col justify-between bg-card rounded-xl border h-[190px] p-3">
        <div className="flex flex-row items-center justify-between">
          <Skeleton className="h-4 w-4 rounded-sm" />
          <Skeleton className="h-3 w-28" />
        </div>

        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
      </FramePanel>
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </Frame>
  );
}
