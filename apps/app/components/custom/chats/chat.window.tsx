"use client";

import { useCallback, useEffect, useRef } from "react";
import ChatHeader from "./chat.header";
import ChatInput from "./chat.input";
import ChatMessage from "./chat.msg";

interface Message {
  id: number;
  text: string;
  sender: "user" | "other";
  timestamp: string;
}

const mockMessages: Message[] = [
  {
    id: 1,
    text: "Hi! How can I help you today?",
    sender: "other",
    timestamp: "2:30 PM",
  },
  {
    id: 2,
    text: "I need help with my account",
    sender: "user",
    timestamp: "2:31 PM",
  },
  {
    id: 3,
    text: "Sure, I'd be happy to assist. What seems to be the problem?",
    sender: "other",
    timestamp: "2:32 PM",
  },
  {
    id: 4,
    text: "I can't reset my password. I've tried everything.",
    sender: "user",
    timestamp: "2:33 PM",
  },
  {
    id: 5,
    text: "No problem! Let me guide you through the reset process. First, click on 'Forgot Password' on the login page.",
    sender: "other",
    timestamp: "2:34 PM",
  },
  {
    id: 6,
    text: "Done! I got the email with the reset link.",
    sender: "user",
    timestamp: "2:35 PM",
  },
  {
    id: 7,
    text: "Perfect! Now click the link and create a new password. Make sure it's strong and unique.",
    sender: "other",
    timestamp: "2:36 PM",
  },
  {
    id: 8,
    text: "Great! It worked. Thank you so much for your help!",
    sender: "user",
    timestamp: "2:37 PM",
  },
  {
    id: 9,
    text: "You're welcome! Is there anything else I can help you with?",
    sender: "other",
    timestamp: "2:38 PM",
  },
];

export default function ChatWindow() {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  const handleSendMessage = (message: string) => {
    console.log("[v0] Message sent:", message);
    // In a real app, you would send this to a backend or update state
  };

  return (
    <div className="flex h-full max-h-[var(--chat-window-max-height,70vh)] w-full flex-col overflow-hidden rounded-[calc(var(--radius-xl)-0.5rem)] border border-border/60 bg-card shadow-sm">
      {/* Header */}
      <ChatHeader
        name="Micky Doe"
        status="Active now"
        avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=micky"
      />

      {/* Messages Area */}
      <div className="flex-1 min-h-0 space-y-2 overflow-y-auto bg-muted/40 px-4 py-3">
        {mockMessages.map((msg) => (
          <ChatMessage
            key={msg.id}
            text={msg.text}
            sender={msg.sender}
            timestamp={msg.timestamp}
            avatar={
              msg.sender === "other"
                ? "https://api.dicebear.com/7.x/avataaars/svg?seed=micky"
                : undefined
            }
            name={msg.sender === "other" ? "Micky Doe" : undefined}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
}
