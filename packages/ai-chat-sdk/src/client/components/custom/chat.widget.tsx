"use client";
import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import "../../styles/chat.widget.css";
import { Message } from "./message";
import { TypingIndicator } from "./typing.indicator";
import { ChatInput } from "./chat.msg";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Maximize,
  Minimize,
  PanelLeftOpen,
  PanelRightOpen,
  X,
} from "lucide-react";

const BOT_RESPONSES = [
  "Hello! How can I assist you today?",
  "I'm here to help. What do you need?",
  "Just a moment, I'm processing your request.",
  "Thank you for your message. I'll get back to you soon.",
  "I'm sorry, I didn't understand that. Could you please rephrase?",
];

export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export interface ChatWidgetProps {
  sessionId: string;
  documentId: string;
  onClose?: () => void;
  onNewMessage?: (message: ChatMessage) => void;
  theme?: "light" | "dark";
  title?: string;
  placeholder?: string;
  botName?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  bubbleText?: string;
  bubbleIcon?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  sessionId,
  documentId,
  onClose,
  onNewMessage,
  theme = "light",
  title = "Alex Zend",
  placeholder = "Type your message...",
  botName = "Assistant",
  className = "",
  width = 350,
  height = 500,
  position = "bottom-right",
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const generateBotResponse = useCallback(() => {
    const randomResponse =
      BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)];
    const botMessage: ChatMessage = {
      id: `bot-${Date.now()}`,
      content: randomResponse!,
      sender: "bot",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);

    // Only call onNewMessage if it exists
    if (onNewMessage) {
      onNewMessage(botMessage);
    }
  }, [onNewMessage]);

  const handleSendMessage = useCallback(
    (content: string) => {
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        content,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);

      // Only call onNewMessage if it exists
      if (onNewMessage) {
        onNewMessage(userMessage);
      }

      // Simulate bot typing and response
      setIsTyping(true);
      setTimeout(
        () => {
          setIsTyping(false);
          setTimeout(() => {
            generateBotResponse();
          }, 200);
        },
        1000 + Math.random() * 2000,
      );
    },
    [onNewMessage, generateBotResponse],
  );

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Only call onClose if it exists
    if (onClose) {
      onClose();
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  const getPositionClasses = () => {
    switch (position) {
      case "bottom-left":
        return "bottom-left";
      case "top-right":
        return "top-right";
      case "top-left":
        return "top-left";
      default:
        return "bottom-right";
    }
  };

  const getWidgetStyle = () => {
    return {
      width: typeof width === "number" ? `${width}px` : width,
      height: isMinimized
        ? "60px"
        : typeof height === "number"
          ? `${height}px`
          : height,
    };
  };
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {/* Floating Bubble Button */}
      {!isOpen && (
        <div className={`chat-bubble ${theme} ${getPositionClasses()}`}>
          <button type="button" onClick={handleOpen} className="bubble-button">
            <img
              src="https://raw.githubusercontent.com/plura-ai/prexo/refs/heads/main/apps/www/public/logo.png"
              className="w-12 h-12 rounded-lg object-cover"
              alt="Chat bot avatar"
              onError={(e) => {
                console.error("Failed to load image:", e);
                e.currentTarget.style.display = "none";
              }}
            />
          </button>
        </div>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div
          className={`chat-widget ${theme} ${isMinimized ? "minimized" : ""} ${getPositionClasses()} ${className}`}
          data-session-id={sessionId}
          data-document-id={documentId}
          style={getWidgetStyle()}
        >
          <div className="chat-header">
            <div className="chat-title">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span>{title}</span>
                <div className="message-time">{formatTime(new Date())}</div>
              </div>
            </div>
            <div className="chat-controls">
              {/* <button
                className="control-btn minimize-btn"
                onClick={handleMinimize}
                aria-label={isMinimized ? "Expand width" : "Minimize width"}
              >
                {isMinimized ? <PanelRightOpen className="size-4" /> : <PanelLeftOpen className="size-4" />}
              </button> */}
              <button
                className="control-btn minimize-btn"
                onClick={handleMinimize}
                aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
              >
                {isMinimized ? (
                  <Maximize className="size-4" />
                ) : (
                  <Minimize className="size-4" />
                )}
              </button>
              <button
                className="control-btn close-btn"
                onClick={handleClose}
                aria-label="Close chat"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="chat-messages" ref={messagesContainerRef}>
                {messages.length === 0 && (
                  <div className="message bot">
                    <div className="bot-avatar">
                      <img
                        src="https://raw.githubusercontent.com/plura-ai/prexo/refs/heads/main/apps/www/public/logo.png"
                        className="w-10 h-10 rounded-lg object-cover invert"
                        alt="Chat bot avatar"
                        onError={(e) => {
                          console.error("Failed to load image:", e);
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                    <div className="message-content">
                      <div className="message-bubble">
                        <p>Hello! I'm {botName}. How can I help you today?</p>
                      </div>
                    </div>
                  </div>
                )}

                {messages.map((message) => (
                  <Message
                    key={message.id}
                    message={message}
                    botName={botName}
                  />
                ))}

                {isTyping && <TypingIndicator botName={botName} />}
                <div ref={messagesEndRef} />
              </div>

              <ChatInput
                onSendMessage={handleSendMessage}
                placeholder={placeholder}
                disabled={isTyping}
              />
            </>
          )}
        </div>
      )}
    </>
  );
};
