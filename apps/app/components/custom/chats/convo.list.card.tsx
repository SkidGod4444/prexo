"use client";

import { Tooltip, TooltipPopup, TooltipTrigger } from "@/components/ui/tooltip";
import { Check, CheckCheck, BellRing } from "lucide-react";
import Image from "next/image";

export interface ChatListCardProps {
  name: string;
  avatar: string;
  flag: string;
  message: string;
  timestamp: string;
  isEscalated?: boolean;
  isResolved?: boolean;
  isUnResolved?: boolean;
}

export default function ChatListCard({
  name,
  avatar,
  flag,
  message,
  timestamp,
  isEscalated = false,
  isResolved = false,
  isUnResolved = false,
}: ChatListCardProps) {
  return (
    <div
      className={`relative flex items-center gap-3 ${(isUnResolved && "bg-muted") || (isEscalated && "bg-red-600/30 hover:bg-red-600/40")} rounded-xl border cursor-pointer px-2 py-1 shadow-sm transition-colors hover:bg-muted/60 overflow-hidden`}
    >
      {/* Avatar Section */}
      <div className="relative flex-shrink-0">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted shadow-sm">
          <Image
            src={avatar || "/placeholder.svg"}
            alt={name}
            width={48}
            height={48}
            className="h-full w-full object-cover"
          />
        </div>
        {/* Flag Overlay */}
        <div className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background text-xs shadow-sm">
          {flag}
        </div>
      </div>

      {/* Content Section */}
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-foreground">
            {name}
          </h3>
          <span className="text-xs text-muted-foreground">{timestamp}</span>
        </div>
        <p className="flex items-center truncate text-xs text-muted-foreground">
          <span>{message}</span>
        </p>
      </div>
      {isEscalated && (
        <Tooltip>
          <TooltipTrigger>
            <div className="absolute cursor-pointer top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full text-red-600 bg-background text-xs shadow-sm z-10">
              <BellRing size={15} strokeWidth={2.3} />
            </div>
          </TooltipTrigger>
          <TooltipPopup>Escalated</TooltipPopup>
        </Tooltip>
      )}
      {isResolved && (
        <Tooltip>
          <TooltipTrigger>
            <div className="absolute cursor-pointer top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-background text-xs shadow-sm z-10">
              <CheckCheck size={15} strokeWidth={2.3} />
            </div>
          </TooltipTrigger>
          <TooltipPopup>Resolved</TooltipPopup>
        </Tooltip>
      )}
      {isUnResolved && (
        <Tooltip>
          <TooltipTrigger>
            <div className="text-white/50 cursor-pointer absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-background text-xs shadow-sm z-10">
              <Check size={15} strokeWidth={2.3} />
            </div>
          </TooltipTrigger>
          <TooltipPopup>Unresolved</TooltipPopup>
        </Tooltip>
      )}
    </div>
  );
}
