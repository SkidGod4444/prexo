"use client";

import { Paperclip, Send, Smile } from "lucide-react";
import type React from "react";
import { useState } from "react";

interface ChatInputProps {
  onSendMessage?: (message: string) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage?.(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2 border-t border-border/60 bg-background/60 px-4 py-2.5 backdrop-blur supports-[backdrop-filter]:bg-background/40">
      {/* Attachment Button */}
      <button
        type="button"
        className="flex-shrink-0 rounded-full p-1.5 transition-colors hover:bg-muted"
        aria-label="Attach file"
      >
        <Paperclip size={16} className="text-muted-foreground" />
      </button>

      {/* Input Field */}
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        className="flex-1 rounded-full border border-border/60 bg-transparent px-3 py-1.5 text-xs text-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />

      {/* Emoji Button */}
      <button
        type="button"
        className="flex-shrink-0 rounded-full p-1.5 transition-colors hover:bg-muted"
        aria-label="Emoji picker"
      >
        <Smile size={16} className="text-muted-foreground" />
      </button>

      {/* Send Button */}
      <button
        type="button"
        onClick={handleSend}
        disabled={!message.trim()}
        className="flex-shrink-0 rounded-full p-1.5 transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Send message"
      >
        <Send
          size={16}
          className={message.trim() ? "text-primary" : "text-muted-foreground"}
        />
      </button>
    </div>
  );
}
