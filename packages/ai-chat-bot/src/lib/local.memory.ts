import type { Message } from "ai";
import {
  DEFAULT_CHAT_SESSION_ID,
  DEFAULT_HISTORY_LENGTH,
} from "../lib/constants";
import type { BaseMessageHistory } from "@prexo/ai-chat-sdk/types";

function getSessionKey(sessionId: string) {
  return DEFAULT_CHAT_SESSION_ID(sessionId);
}

function isLocalStorageAvailable() {
  try {
    return (
      typeof window !== "undefined" &&
      typeof window.localStorage !== "undefined"
    );
  } catch {
    return false;
  }
}

function handleStorageError(error: unknown, context: string) {
  console.warn(`[InMemoryHistory] ${context}:`, error);
}

export class InMemoryHistory implements BaseMessageHistory {
  constructor() {}

  async addMessage(params: {
    message: Message;
    sessionId: string;
    sessionTTL?: number;
  }): Promise<void> {
    if (!isLocalStorageAvailable()) {
      handleStorageError("localStorage not available", "addMessage");
      return;
    }
    const { message, sessionId } = params;
    const sessionKey = getSessionKey(sessionId);
    try {
      const item = window.localStorage.getItem(sessionKey);
      const oldMessages: Message[] = item ? JSON.parse(item) : [];
      const newMessages = [message, ...oldMessages];
      window.localStorage.setItem(sessionKey, JSON.stringify(newMessages));
    } catch (error) {
      handleStorageError(error, "addMessage");
    }
  }

  async deleteMessages({ sessionId }: { sessionId: string }): Promise<void> {
    if (!isLocalStorageAvailable()) {
      handleStorageError("localStorage not available", "deleteMessages");
      return;
    }
    const sessionKey = getSessionKey(sessionId);
    try {
      window.localStorage.setItem(sessionKey, JSON.stringify([]));
    } catch (error) {
      handleStorageError(error, "deleteMessages");
    }
  }

  async getMessages({
    sessionId,
    amount = DEFAULT_HISTORY_LENGTH,
    startIndex = 0,
  }: {
    sessionId?: string;
    amount?: number;
    startIndex?: number;
  }): Promise<Message[]> {
    if (!isLocalStorageAvailable()) {
      handleStorageError("localStorage not available", "getMessages");
      return [];
    }
    const sessionKey = getSessionKey(sessionId || "");
    try {
      const item = window.localStorage.getItem(sessionKey);
      const messages: Message[] = item ? JSON.parse(item) : [];
      const slicedMessages = messages.slice(startIndex, startIndex + amount);
      return slicedMessages.reverse();
    } catch (error) {
      handleStorageError(error, "getMessages");
      return [];
    }
  }
}
