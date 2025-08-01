"use client";

import type { UIMessage } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import React, { memo } from "react";
import { sanitizeText, cn } from "@/lib/utils";
import Logo from "../../site/logo";
import { Markdown } from "../markdown";
import equal from "fast-deep-equal";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import ProjectCardAiUi from "../../ai-ui/project.card";
import ApiCardAiUi from "../../ai-ui/api.card";
import { Button } from "@/components/ui/button";
import OnboardingCardAiUi from "../../ai-ui/onboarding.card";
import ApiKeyCardAiUi from "../../ai-ui/api.key.card";

const PurePreviewMessage = ({
  message,
  requiresScrollPadding,
  addToolResult,
  append,
}: {
  message: UIMessage;
  requiresScrollPadding: boolean;
  addToolResult: (result: { toolCallId: string; result: string }) => void;
  append: (message: UIMessage) => void;
}) => {
  const { containerRef, scrollToBottom } = useScrollToBottom();
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      const screenHeight = window.innerHeight;
      // buffer accounts for margin-bottom (e.g. mb-40), tailwind default = 16px * 4 = 64px
      const buffer = 40 * 4;
      if (contentHeight > screenHeight - buffer) {
        scrollToBottom("auto");
      }
    }
  }, [message, scrollToBottom]);

  return (
    <AnimatePresence>
      <motion.div
        data-testid={`message-${message.role}`}
        className="w-full mx-auto max-w-3xl px-4 group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
        ref={containerRef}
      >
        <div
          ref={contentRef}
          className={cn(
            "flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:w-fit overflow-hidden",
          )}
        >
          {message.role === "assistant" && (
            <div className="size-8 flex items-center justify-center shrink-0 bg-background">
              <div className="translate-y-px">
                <Logo isTextVisible={false} />
              </div>
            </div>
          )}

          <div
            className={cn("flex flex-col gap-4 w-full", {
              "min-h-96": message.role === "assistant" && requiresScrollPadding,
            })}
          >
            {message.parts?.map((part, index) => {
              switch (part.type) {
                case "text":
                  return (
                    <div
                      key={`message-${message.id}-part-${index}`}
                      className="flex flex-row gap-2 items-start"
                    >
                      <div
                        data-testid="message-content"
                        className={cn("flex flex-col gap-4", {
                          "bg-primary text-primary-foreground px-3 py-2 rounded-xl":
                            message.role === "user",
                        })}
                      >
                        <Markdown>{sanitizeText(part.text)}</Markdown>
                      </div>
                    </div>
                  );

                case "tool-invocation": {
                  const callId = part.toolInvocation.toolCallId;
                  const toolName = part.toolInvocation.toolName;
                  const state = part.toolInvocation.state;

                  switch (toolName) {
                    case "askForConfirmation": {
                      switch (state) {
                        case "call":
                          return (
                            <div key={callId}>
                              {part.toolInvocation.args.message}
                              <div className="flex gap-2 mt-2">
                                <Button
                                  variant={"outline"}
                                  className="cursor-pointer"
                                  onClick={() => {
                                    scrollToBottom("auto");
                                    append({
                                      id: callId,
                                      role: "user",
                                      content: "Yes, confirmed.",
                                      parts: [
                                        {
                                          type: "text",
                                          text: "Yes, confirmed.",
                                        },
                                      ],
                                    });
                                    addToolResult({
                                      toolCallId: callId,
                                      result: "Yes, confirmed.",
                                    });
                                  }}
                                >
                                  Yes
                                </Button>
                                <Button
                                  variant={"outline"}
                                  className="cursor-pointer"
                                  onClick={() => {
                                    scrollToBottom("auto");
                                    append({
                                      id: callId,
                                      role: "user",
                                      content: "No, denied",
                                      parts: [
                                        {
                                          type: "text",
                                          text: "No, denied",
                                        },
                                      ],
                                    });
                                    addToolResult({
                                      toolCallId: callId,
                                      result: "No, denied",
                                    });
                                  }}
                                >
                                  No
                                </Button>
                              </div>
                            </div>
                          );
                        case "result":
                          return (
                            <div key={callId}>
                              {part.toolInvocation.args.message}
                              <div className="flex gap-2 mt-2">
                                <Button
                                  variant={"outline"}
                                  disabled
                                  onClick={() => {
                                    scrollToBottom("auto");
                                    append({
                                      id: callId,
                                      role: "user",
                                      content: "Yes, confirmed.",
                                      parts: [
                                        {
                                          type: "text",
                                          text: "Yes, confirmed.",
                                        },
                                      ],
                                    });
                                    addToolResult({
                                      toolCallId: callId,
                                      result: "Yes, confirmed.",
                                    });
                                  }}
                                >
                                  Yes
                                </Button>
                                <Button
                                  variant={"outline"}
                                  disabled
                                  onClick={() => {
                                    scrollToBottom("auto");
                                    append({
                                      id: callId,
                                      role: "user",
                                      content: "No, denied",
                                      parts: [
                                        {
                                          type: "text",
                                          text: "No, denied",
                                        },
                                      ],
                                    });
                                    addToolResult({
                                      toolCallId: callId,
                                      result: "No, denied",
                                    });
                                  }}
                                >
                                  No
                                </Button>
                              </div>
                            </div>
                          );
                        default:
                          return null;
                      }
                    }
                    case "sendCreateProjectForm": {
                      switch (state) {
                        case "call":
                          return (
                            <div key={callId}>
                              <div className="flex flex-col mb-5">
                                {part.toolInvocation.args.message}
                              </div>
                              <ProjectCardAiUi
                                callId={callId}
                                addToolResult={addToolResult}
                                append={append}
                              />
                            </div>
                          );
                        case "result":
                          return (
                            <div key={callId}>{part.toolInvocation.result}</div>
                          );
                        default:
                          return null;
                      }
                    }
                    case "sendCreateApiFrom": {
                      switch (state) {
                        case "result":
                          return (
                            <div key={callId + "result"}>
                              <div className="flex flex-col mb-5">
                                {part.toolInvocation.result}
                              </div>
                              <ApiCardAiUi
                                addToolResult={addToolResult}
                                append={append}
                                callId={callId}
                              />
                            </div>
                          );
                        case "call":
                          return (
                            <div key={callId}>
                              <div className="flex flex-col mb-5">
                                {part.toolInvocation.args.message}
                              </div>
                              <ApiCardAiUi
                                addToolResult={addToolResult}
                                append={append}
                                callId={callId}
                              />
                            </div>
                          );
                        default:
                          return null;
                      }
                    }
                    case "sendApiCopyCard": {
                      switch (state) {
                        case "call":
                          return (
                            <div key={callId + "result"}>
                              <div className="flex flex-col mb-5">
                              {part.toolInvocation.args.message}
                              </div>
                              <ApiKeyCardAiUi
                              append={append}
                              callId={callId}
                              />
                            </div>
                          );
                        case "result":
                          return (
                            <div key={callId}>{part.toolInvocation.result}</div>
                          );
                        default:
                          return null;
                      }
                    }

                    case "completeOnboarding": {
                      switch (state) {
                        case "call":
                          return (
                            <div key={callId}>
                              <OnboardingCardAiUi
                                addToolResult={addToolResult}
                                append={append}
                                callId={callId}
                              />
                            </div>
                          );
                        default:
                          return null;
                      }
                    }
                    default:
                      return null;
                  }
                }
                default:
                  return null;
              }
            })}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.message.id !== nextProps.message.id) return false;
    if (prevProps.requiresScrollPadding !== nextProps.requiresScrollPadding)
      return false;
    if (!equal(prevProps.message.parts, nextProps.message.parts)) return false;

    return true;
  },
);

export const ThinkingMessage = () => {
  const role = "assistant";

  return (
    <motion.div
      data-testid="message-assistant-loading"
      className="w-full mx-auto max-w-3xl px-4 group/message min-h-96"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={cn(
          "flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl",
          {
            "group-data-[role=user]/message:bg-muted": true,
          },
        )}
      >
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
          <Logo isTextVisible={false} />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-4 text-muted-foreground">
            Hmm...
          </div>
        </div>
      </div>
    </motion.div>
  );
};
