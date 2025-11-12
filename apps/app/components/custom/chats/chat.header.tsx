"use client";

import { MoreVertical, Phone, Video } from "lucide-react";

interface ChatHeaderProps {
  name: string;
  status: string;
  avatar: string;
}

export default function ChatHeader({ name, status, avatar }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 bg-background/60 px-4 py-2.5 backdrop-blur supports-[backdrop-filter]:bg-background/40">
      {/* Left - Contact Info */}
      <div className="flex items-center gap-3">
        <img
          src={avatar || "/placeholder.svg"}
          alt={name}
          className="h-8 w-8 rounded-full object-cover ring-1 ring-border/40"
        />
        <div>
          <h2 className="text-sm font-semibold text-foreground">{name}</h2>
          <p className="text-xs text-muted-foreground">{status}</p>
        </div>
      </div>

      {/* Right - Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-full p-1.5 transition-colors hover:bg-muted"
          aria-label="Call"
        >
          <Phone size={16} className="text-muted-foreground" />
        </button>
        <button
          type="button"
          className="rounded-full p-1.5 transition-colors hover:bg-muted"
          aria-label="Video call"
        >
          <Video size={16} className="text-muted-foreground" />
        </button>
        <button
          type="button"
          className="rounded-full p-1.5 transition-colors hover:bg-muted"
          aria-label="More options"
        >
          <MoreVertical size={16} className="text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
