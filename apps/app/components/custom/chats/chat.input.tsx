"use client";

import { Paperclip, Send, Smile } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2 border-t border-border bg-background px-4 py-3">
      {/* Attachment Button */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-9 w-9 flex-shrink-0"
        aria-label="Attach file"
      >
        <Paperclip size={18} className="text-muted-foreground" />
      </Button>

      {/* Input Field */}
      <Textarea
        placeholder="Type a message... (Shift + Enter for new line)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        className="min-h-[2.5rem] max-h-32 resize-none text-sm"
        rows={1}
      />

      {/* Emoji Button */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-9 w-9 flex-shrink-0"
        aria-label="Emoji picker"
      >
        <Smile size={18} className="text-muted-foreground" />
      </Button>

      {/* Send Button */}
      <Button
        type="button"
        onClick={handleSend}
        disabled={!message.trim()}
        size="icon"
        className="h-9 w-9 flex-shrink-0"
        aria-label="Send message"
      >
        <Send size={16} />
      </Button>
    </div>
  );
}
