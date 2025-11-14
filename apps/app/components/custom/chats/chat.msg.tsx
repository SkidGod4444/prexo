"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  text: string;
  sender: "user" | "other";
  timestamp: string;
  avatar?: string;
  name?: string;
}

export default function ChatMessage({
  text,
  sender,
  timestamp,
  avatar,
  name,
}: ChatMessageProps) {
  const isUser = sender === "user";

  return (
    <div
      className={cn(
        "flex gap-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      {/* Avatar for received messages */}
      {!isUser && avatar && (
        <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full border border-border shadow-sm">
          <Image
            src={avatar}
            alt={name || "User"}
            fill
            className="object-cover"
            sizes="32px"
          />
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={cn(
          "flex max-w-[75%] flex-col gap-1",
          isUser ? "items-end" : "items-start",
        )}
      >
        {!isUser && name && (
          <span className="px-1 text-xs font-medium text-foreground">
            {name}
          </span>
        )}
        <div
          className={cn(
            "rounded-2xl px-4 py-2 text-sm shadow-sm",
            isUser
              ? "rounded-br-md bg-primary text-primary-foreground"
              : "rounded-bl-md border border-border bg-card text-foreground",
          )}
        >
          <p className="whitespace-pre-wrap break-words">{text}</p>
        </div>
        <span className="px-1 text-xs text-muted-foreground">{timestamp}</span>
      </div>
    </div>
  );
}
