"use client";
import React, { useRef, type KeyboardEvent, memo } from "react";
import type { UseChatHelpers } from "@ai-sdk/react";
import type { BaseMessageHistory } from "../../../../src/lib/types";
import { DEFAULT_MSG_ID } from "../../../../src/lib/constants";

interface ChatInputProps {
  input: UseChatHelpers["input"];
  status: UseChatHelpers["status"];
  handleSubmit: UseChatHelpers["handleSubmit"];
  handleInputChange: UseChatHelpers["handleInputChange"];
  placeholder: string;
  sessionId?: string;
  sessionTTL?: number;
  isLoading?: boolean;
  isDisabled?: boolean;
  history?: BaseMessageHistory;
}

function ChatInputComponent({
  input,
  status,
  handleSubmit,
  handleInputChange,
  placeholder,
  sessionId,
  sessionTTL,
  isLoading,
  history,
  isDisabled = false,
}: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyPress = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      try {
        if (history) {
          await history.addMessage({
            message: {
              id: DEFAULT_MSG_ID,
              role: "user",
              content: input,
            },
            sessionId: sessionId!,
            sessionTTL: sessionTTL!,
          });
        }
      } catch (err) {
        console.error("addMessage error:", err);
      }
      handleSubmit(e);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (history) {
        await history.addMessage({
          message: {
            id: DEFAULT_MSG_ID,
            role: "user",
            content: input,
          },
          sessionId: sessionId!,
          sessionTTL: sessionTTL!,
        });
      }
    } catch (err) {
      console.error("addMessage error:", err);
    }
    handleSubmit(e);
  };

  return (
    <form className="chat-input" onSubmit={handleFormSubmit}>
      <div className="input-container">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={status === "streaming" || isLoading || isDisabled}
          className="message-input"
        />
        <button
          type="submit"
          disabled={status === "streaming" || isLoading || isDisabled}
          className="send-button"
          aria-label="Send message"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
      <a
        href="https://prexoai.xyz"
        target="_blank"
        rel="noopener noreferrer"
        className="chat-input-watermark"
      >
        Powered by Prexo Ai
      </a>
    </form>
  );
}

export const ChatInput = memo(ChatInputComponent);
