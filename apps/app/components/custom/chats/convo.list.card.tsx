"use client";

import { Tooltip, TooltipPopup, TooltipTrigger } from "@/components/ui/tooltip";
import { Check, CheckCheck, BellRing } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface ChatListCardProps {
  name: string;
  avatar: string;
  flag: string;
  message: string;
  timestamp: string;
  isEscalated?: boolean;
  isResolved?: boolean;
  isUnResolved?: boolean;
  isActive?: boolean;
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
  isActive = false,
}: ChatListCardProps) {
  const bgColorClass = cn(
    "relative flex items-center gap-3 rounded-xl border cursor-pointer px-3 py-2 shadow-sm transition-all duration-200",
    isActive && "bg-primary/10 border-primary/30 shadow-md",
    !isActive &&
      isEscalated &&
      "bg-red-600/10 hover:bg-red-600/20 border-red-600/30",
    !isActive && isUnResolved && "bg-muted hover:bg-muted/80",
    !isActive && !isEscalated && !isUnResolved && "hover:bg-muted/60",
  );

  return (
    <div className={bgColorClass}>
      {/* Avatar Section */}
      <div className="relative flex-shrink-0">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted shadow-sm">
          <Image
            src={avatar}
            alt={name}
            width={48}
            height={48}
            className="h-full w-full object-cover"
          />
        </div>
        {/* Flag Overlay */}
        <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-background text-xs shadow-sm">
          {flag}
        </div>
      </div>

      {/* Content Section */}
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-center justify-between gap-2">
          <h3 className="truncate text-sm font-semibold text-foreground">
            {name}
          </h3>
          <span className="flex-shrink-0 text-xs text-muted-foreground">
            {timestamp}
          </span>
        </div>
        <p className="truncate text-xs text-muted-foreground">{message}</p>
      </div>

      {/* Status Indicators */}
      {isEscalated && (
        <Tooltip>
          <TooltipTrigger>
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-600/20 text-red-600">
              <BellRing size={14} strokeWidth={2.3} />
            </div>
          </TooltipTrigger>
          <TooltipPopup>Escalated</TooltipPopup>
        </Tooltip>
      )}
      {isResolved && (
        <Tooltip>
          <TooltipTrigger>
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-600/20 text-green-600">
              <CheckCheck size={14} strokeWidth={2.3} />
            </div>
          </TooltipTrigger>
          <TooltipPopup>Resolved</TooltipPopup>
        </Tooltip>
      )}
      {isUnResolved && !isEscalated && (
        <Tooltip>
          <TooltipTrigger>
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Check size={14} strokeWidth={2.3} />
            </div>
          </TooltipTrigger>
          <TooltipPopup>Unresolved</TooltipPopup>
        </Tooltip>
      )}
    </div>
  );
}
