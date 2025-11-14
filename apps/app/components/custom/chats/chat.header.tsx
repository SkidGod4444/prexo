"use client";

import {
  MoreVertical,
  Phone,
  Video,
  Archive,
  Trash2,
  Flag,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatHeaderProps {
  name: string;
  status: string;
  avatar: string;
}

export default function ChatHeader({ name, status, avatar }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3">
      {/* Left - Contact Info */}
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-full border border-border shadow-sm">
          <Image
            src={avatar}
            alt={name}
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">{name}</h2>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <p className="text-xs text-muted-foreground">{status}</p>
          </div>
        </div>
      </div>

      {/* Right - Action Buttons */}
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label="Call"
        >
          <Phone size={16} className="text-muted-foreground" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label="Video call"
        >
          <Video size={16} className="text-muted-foreground" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              aria-label="More options"
            >
              <MoreVertical size={16} className="text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <Flag className="mr-2 h-4 w-4" />
              Mark as Escalated
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Archive className="mr-2 h-4 w-4" />
              Archive Conversation
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Conversation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
