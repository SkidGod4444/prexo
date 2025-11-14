"use client";

import { useCallback, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import ChatHeader from "./chat.header";
import ChatInput from "./chat.input";
import ChatMessage from "./chat.msg";
import { MessageSquare } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "other";
  timestamp: string;
}

// Mock data structure for conversations
const mockConversations: Record<
  number,
  {
    name: string;
    avatar: string;
    status: string;
    messages: Message[];
  }
> = {
  1: {
    name: "Micky Doe",
    avatar:
      "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Christopher",
    status: "Active now",
    messages: [
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
    ],
  },
  2: {
    name: "Amanda Doe",
    avatar: "https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=Amaya",
    status: "Offline",
    messages: [
      {
        id: 1,
        text: "Hello, I have a question about my order",
        sender: "other",
        timestamp: "1:15 PM",
      },
      {
        id: 2,
        text: "Of course! What's your order number?",
        sender: "user",
        timestamp: "1:16 PM",
      },
      {
        id: 3,
        text: "It's #12345",
        sender: "other",
        timestamp: "1:17 PM",
      },
      {
        id: 4,
        text: "Let me check that for you",
        sender: "user",
        timestamp: "1:18 PM",
      },
    ],
  },
  3: {
    name: "John Smith",
    avatar: "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Aiden",
    status: "Active 5 minutes ago",
    messages: [
      {
        id: 1,
        text: "Thank you for your quick response.",
        sender: "other",
        timestamp: "12:00 PM",
      },
      {
        id: 2,
        text: "You're welcome! Happy to help.",
        sender: "user",
        timestamp: "12:01 PM",
      },
    ],
  },
};

export default function ChatWindow() {
  const params = useParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatId = params?.chatId ? Number(params.chatId) : null;
  const conversation = chatId ? mockConversations[chatId] : null;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [conversation, scrollToBottom]);

  const handleSendMessage = (message: string) => {
    console.log("Message sent:", message);
    // TODO: Implement real message sending logic
  };

  // Empty state when no conversation is selected
  if (!conversation) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-muted/20 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
          <MessageSquare className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">
          No conversation selected
        </h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Choose a conversation from the list to start viewing messages
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-card">
      {/* Header */}
      <ChatHeader
        name={conversation.name}
        status={conversation.status}
        avatar={conversation.avatar}
      />

      {/* Messages Area */}
      <div className="flex-1 min-h-0 space-y-3 overflow-y-auto bg-muted/20 px-4 py-4">
        {conversation.messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            text={msg.text}
            sender={msg.sender}
            timestamp={msg.timestamp}
            avatar={msg.sender === "other" ? conversation.avatar : undefined}
            name={msg.sender === "other" ? conversation.name : undefined}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
}
