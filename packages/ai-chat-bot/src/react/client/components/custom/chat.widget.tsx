"use client";
import type React from "react";
import { useEffect, useRef, useCallback, useState } from "react";
import "../../styles/chat.widget.css";
import { Message } from "./message";
import { TypingIndicator } from "./typing.indicator";
import { ChatInput } from "./chat.input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Maximize, Minimize, X } from "lucide-react";
import { useLocalStorage } from "../../../hooks/use.local.store";
import { useChat, type UseChatHelpers } from "@ai-sdk/react";
import { BASE_API_ENDPOINT } from "../../../../lib/utils";
import { SuggestedActions } from "./suggested.actions";
import type {
  AIModelsFreeTierId,
  SuggestedActionsT,
} from "../../../../lib/types";
import { AIChatSDK, type VectorContextResult } from "@prexo/ai-chat-sdk";
import type { Message as MessageT } from "ai";

export interface PrexoAiChatBotProps {
  apiKey: string;
  suggestedActions?: SuggestedActionsT[];
  model?: AIModelsFreeTierId;
  telementry?: { enabled: boolean };
  sessionId?: string;
  sessionTTL?: number;
  onClose?: () => void;
  onOpen?: () => void;
  theme?: "light" | "dark";
  user?: {
    name: string | "Prexo Ai";
    pfp: string | "../../logo.png";
    lastSeen: Date;
  };
  placeholder?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  position?: "bottom-right" | "bottom-left";
  redis?: {
    url: string;
    token: string;
  };
  vector?: {
    url: string;
    token: string;
    namespace: string;
  };
  RAGDisabled?: boolean;
}

// Helper to combine context data
function combineContextData(contextArr: VectorContextResult[]): string {
  return contextArr.map((obj) => obj.data).join("\n");
}

export const PrexoAiChatBot: React.FC<PrexoAiChatBotProps> = ({
  apiKey,
  telementry = { enabled: true },
  model = "openai/gpt-oss-20b:free",
  suggestedActions,
  sessionId,
  sessionTTL,
  onClose,
  onOpen,
  user,
  theme,
  placeholder = "Type your message...",
  className = "",
  width = 400,
  height = 650,
  position = "bottom-right",
  redis,
  vector,
  RAGDisabled = false,
}) => {
  // Initialize SDK with professional approach
  const sdk = new AIChatSDK({
    telemetry: {
      enabled: telementry?.enabled ?? true,
    },
    apiKey: apiKey, // Pass API key to SDK level
    context: vector ? { vector } : apiKey ? { apiKey } : undefined,
    history: redis ? { redis } : undefined,
  });

  // Get clients from SDK
  const history = sdk.getHistoryClient();
  const context = sdk.getContextClient();

  // State and refs
  const [isOpen, setIsOpen] = useLocalStorage("@prexo-chat-bot-#isOpen", false);
  const [loading, setLoading] = useState(false);
  const [convo, setConvo] = useState<MessageT[]>([]);
  const [cntxt, setCntxt] = useLocalStorage<VectorContextResult[]>(
    "@prexo-chat-bot-#cntxt",
    [],
  );
  const [cleanCntxt, setCleanCntxt] = useLocalStorage<string>(
    "@prexo-chat-bot-#cleanCntxt",
    "",
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isMinimized, setIsMinimized] = useLocalStorage(
    "@prexo-chat-bot-#isMinimized",
    false,
  );
  const [historyFetched, setHistoryFetched] = useState(false);
  const [isActive, setIsActive] = useLocalStorage(
    "@prexo-chat-bot-#isActive",
    false,
  );
  const DOMAIN_API_ENDPOINT =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3001/v1/domain"
      : "https://api.prexoai.xyz/v1/domain";

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    let isUnmounted = false;

    const fetchDomainStatus = async () => {
      try {
        let domainName = window.location.hostname;
        if (
          typeof process !== "undefined" &&
          process.env &&
          process.env.NODE_ENV === "development"
        ) {
          domainName = "devwtf.in";
        }
        const res = await fetch(`${DOMAIN_API_ENDPOINT}/status`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ domain: domainName }),
        });
        if (!res.ok) {
          if (!isUnmounted) {
            setIsActive(false);
            sdk.trackEvent("chat_widget_activated", {
              value: false,
              sessionId,
              sessionTTL,
            });
            console.log(
              "PrexoAiChatBot is not active yet. Please log in to console.prexoai.xyz and configure this domain.",
            );
          }
          return;
        }
        const data = await res.json();
        if (!isUnmounted) {
          if (data.status === "Valid") {
            setIsActive(true);
          } else {
            setIsActive(false);
            sdk.trackEvent("chat_widget_activated", {
              value: false,
              sessionId,
              sessionTTL,
            });
            console.log(
              "PrexoAiChatBot is not active yet. Please log in to console.prexoai.xyz and configure this domain.",
            );
          }
        }
      } catch (err) {
        if (!isUnmounted) {
          setIsActive(false);
          sdk.trackEvent("chat_widget_activated", {
            value: false,
            sessionId,
            sessionTTL,
          });
          console.log(
            "PrexoAiChatBot is not active yet. Please log in to console.prexoai.xyz and configure this domain.",
          );
        }
      }
    };

    fetchDomainStatus();
    intervalId = setInterval(fetchDomainStatus, 30000);

    return () => {
      isUnmounted = true;
      if (intervalId) clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Error checks
  if (!apiKey || apiKey.length === 0) {
    sdk.trackEvent("error", {
      code: "API_KEY_MISSING",
      message: "API key is required for PrexoAiChatBot to function properly",
    });
    console.error(
      "API key is required for PrexoAiChatBot to function properly",
    );
    throw new Error(
      "API key is required for PrexoAiChatBot to function properly",
    );
  }
  if (suggestedActions && suggestedActions.length > 3) {
    const msg = "You can only add max 3 suggested actions!";
    sdk.trackEvent("error", {
      code: "SUGGESTED_ACTIONS_LIMIT_EXCEEDED",
      message: msg,
    });
    console.error(msg);
    throw new Error(msg);
  }

  // useChat hook
  const {
    messages,
    input,
    handleInputChange,
    status,
    append: realAppend,
    setInput,
  } = useChat({
    api: `${BASE_API_ENDPOINT}/ai/stream`,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "x-model-id": model,
    },
    body: {
      history: convo,
      context: cleanCntxt, // always use the latest context
      RAGDisabled: RAGDisabled,
    },
    async onFinish(message, { usage, finishReason }) {
      sdk.trackEvent("agent_onFinish", {
        sessionId,
        sessionTTL,
        RAGDisabled,
        usage,
        finishReason,
      });
      if (history) {
        await history.addMessage({
          message: {
            id: message.id,
            role: message.role,
            content: message.content,
          },
          sessionId: sessionId!,
          sessionTTL: sessionTTL!,
        });
      }
    },
    onError(error) {
      sdk.trackEvent("agent_onError", {
        code: "AGENT_CALL_ERROR_OCCURED",
        error,
      });
      console.log("ERROR OCCURED: ", error);
    },
  });

  // Unified append function for all user messages
  const customAppend: UseChatHelpers["append"] = async (message) => {
    setLoading(true);
    let combinedContext = "";
    if (context && !RAGDisabled) {
      const contextResults = await context.getContext({
        question: message.content,
      });
      if (contextResults.length > 0) {
        combinedContext = combineContextData(contextResults);
        setCntxt(contextResults); // for UI
        setCleanCntxt(combinedContext); // persist in localStorage
      }
    }
    setLoading(false);
    return realAppend(
      {
        id: message.id,
        role: message.role,
        content: message.content,
      },
      {
        body: {
          history: convo,
          context: combinedContext, // always use the latest context
          RAGDisabled: RAGDisabled,
        },
      },
    );
  };

  // Handler for manual input submit
  const handleCustomSubmit: UseChatHelpers["handleSubmit"] = async (event) => {
    event?.preventDefault?.();
    setLoading(true);
    await customAppend({
      id: Date.now().toString(),
      role: "user",
      content: input,
    });
    setLoading(false);
  };

  // Handler for suggested actions
  const handleSuggestedAction = async (content: string) => {
    setLoading(true);
    await customAppend({
      id: Date.now().toString(),
      role: "user",
      content,
    });
    setLoading(false);
    setInput("");
  };

  // Clear input after message is submitted
  useEffect(() => {
    if (status === "submitted") {
      sdk.trackEvent("user_message_sent", {
        sessionId,
        sessionTTL,
        content: input,
      });
      setInput("");
    }
    if (RAGDisabled && cntxt.length > 0 && cleanCntxt.length > 0) {
      setCleanCntxt("");
      setCntxt([]);
    }
    if (status === "error") {
      sdk.trackEvent("user_message_error", {
        code: "MESSAGE_SUBMISSION_ERROR",
        sessionId,
        sessionTTL,
        content: input,
      });
    }
  }, [
    status,
    setInput,
    RAGDisabled,
    setCleanCntxt,
    setCntxt,
    cntxt,
    cleanCntxt,
  ]);

  // Fetch chat history if needed
  useEffect(() => {
    const fetchHistory = async () => {
              try {
          setLoading(true);
          if (history) {
            const chatHistory: MessageT[] = await history.getMessages({
              sessionId: sessionId!,
            });
            if (chatHistory.length > 0) {
              setConvo([]);
              setConvo(chatHistory);
            }
          }
          setHistoryFetched(true);
        } catch (error) {
        console.error("Error fetching chat history:", error);
      } finally {
        setLoading(false);
      }
    };
    if (input.length > 0 && convo.length === 0 && !historyFetched) {
      fetchHistory().then(() => {
        console.log("History is set!");
      });
    }
  }, [input, convo.length, historyFetched, history, sessionId]);

  const isTyping = status === "submitted";
  const isSreaming = status === "streaming";

  // Scroll to bottom on new messages
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0 || isSreaming) {
      scrollToBottom();
    }
  }, [messages, isSreaming, scrollToBottom]);

  // Widget controls
  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleClose = async () => {
    if (history) {
      await history.deleteMessages({ sessionId: sessionId! });
    }
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };
  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    if (onOpen) {
      onOpen();
    }
  };

  // UI helpers
  const getPositionClasses = () => {
    switch (position) {
      case "bottom-left":
        return "bottom-left";
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
              src="../../logo.png"
              className="w-12 h-12 rounded-lg object-cover"
              alt="Chat bot avatar"
              onError={(e) => {
                console.error("Failed to load image:", e);
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </button>
        </div>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div
          className={`chat-widget ${theme} ${isMinimized ? "minimized" : ""} ${
            isOpen && position === "bottom-right" ? "open right" : "open left"
          } ${!isOpen ? "close" : ""} ${getPositionClasses()} ${className}`}
          style={getWidgetStyle()}
        >
          <div className="chat-header">
            {user ? (
              <div className="chat-title">
                <Avatar>
                  <AvatarImage src={user.pfp} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span>{user.name}</span>
                  <div className="message-time">
                    Last seen {formatTime(user.lastSeen)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="chat-title">
                <img
                  src="../../logo.png"
                  className="w-9 h-9 rounded-lg object-cover invert"
                  alt="Chat bot avatar"
                  onError={(e) => {
                    console.error("Failed to load image:", e);
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
                <div className="flex flex-col">
                  <span>Prexo Ai</span>
                  <div className="message-time">
                    Last seen {formatTime(new Date())}
                  </div>
                </div>
              </div>
            )}
            <div className="chat-controls">
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
                {messages.length === 0 && isActive && (
                  <div className="message bot">
                    <div className="bot-avatar">
                      <img
                        src="../../logo.png"
                        className="w-10 h-10 rounded-lg object-cover invert"
                        alt="Chat bot avatar"
                        onError={(e) => {
                          console.error("Failed to load image:", e);
                          (e.currentTarget as HTMLImageElement).style.display =
                            "none";
                        }}
                      />
                    </div>
                    <div className="message-content">
                      <div className="message-bubble">
                        <p>Hello! I'm Prexo Ai. How can I help you today?</p>
                      </div>
                    </div>
                  </div>
                )}

                {!isActive && (
                  <div className="message bot">
                    <div className="bot-avatar">
                      <img
                        src="../../logo.png"
                        className="w-10 h-10 rounded-lg object-cover invert"
                        alt="Chat bot avatar"
                        onError={(e) => {
                          console.error("Failed to load image:", e);
                          (e.currentTarget as HTMLImageElement).style.display =
                            "none";
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="message-content">
                        <div className="message-bubble">
                          <p>Seems like this domain is not activated yet!</p>
                        </div>
                      </div>
                      <div className="message-content">
                        <div className="message-bubble">
                          <p>
                            Please log in to{" "}
                            <a
                              href="https://console.prexoai.xyz"
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "#2563eb",
                                textDecoration: "underline",
                              }}
                            >
                              console.prexoai.xyz
                            </a>{" "}
                            and configure this domain.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {messages.map((message) => (
                  <Message key={message.id} message={message} />
                ))}

                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>

              {messages.length === 0 &&
                isActive &&
                suggestedActions &&
                suggestedActions.length < 3 && (
                  <div className="p-2">
                    <SuggestedActions
                      append={handleSuggestedAction}
                      suggestedActions={suggestedActions}
                      history={history}
                      sessionId={sessionId!}
                      sessionTTL={sessionTTL}
                    />
                  </div>
                )}
              <ChatInput
                input={input}
                handleInputChange={handleInputChange}
                handleSubmit={handleCustomSubmit}
                status={status}
                placeholder={placeholder}
                sessionId={sessionId}
                sessionTTL={sessionTTL}
                isLoading={loading}
                history={history}
                isDisabled={!isActive}
              />
            </>
          )}
        </div>
      )}
    </>
  );
};
