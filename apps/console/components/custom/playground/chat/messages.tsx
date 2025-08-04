import type { UIMessage } from "ai";
import { memo } from "react";
import equal from "fast-deep-equal";
import type { UseChatHelpers } from "@ai-sdk/react";
import { motion } from "framer-motion";
import { useMessages } from "@/hooks/use-messages";
import { GreetingMsg } from "../greeting";
import { PreviewMessage, ThinkingMessage } from "./msg";

interface MessagesProps {
  chatId: string;
  status: UseChatHelpers["status"];
  messages: Array<UIMessage>;
}

function PureMessages({ chatId, status, messages }: MessagesProps) {
  const {
    containerRef: messagesContainerRef,
    endRef: messagesEndRef,
    onViewportEnter,
    onViewportLeave,
    hasSentMessage,
  } = useMessages({
    chatId,
    status,
  });

  return (
    <div
      ref={messagesContainerRef}
      className="flex flex-col min-w-full gap-6 flex-1 overflow-y-scroll pt-2 relative"
    >
      {messages.length === 0 && <GreetingMsg />}

      {messages.map((message, index) => (
        <PreviewMessage
          key={message.id}
          message={message}
          requiresScrollPadding={
            hasSentMessage && index === messages.length - 1
          }
        />
      ))}

      {status === "submitted" &&
        messages.length > 0 &&
        messages[messages.length - 1].role === "user" && <ThinkingMessage />}

      <motion.div
        ref={messagesEndRef}
        className="shrink-0 min-w-[24px] min-h-[24px]"
        onViewportLeave={onViewportLeave}
        onViewportEnter={onViewportEnter}
      />
    </div>
  );
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.status !== nextProps.status) return false;
  if (prevProps.status && nextProps.status) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  if (!equal(prevProps.messages, nextProps.messages)) return false;

  return true;
});
