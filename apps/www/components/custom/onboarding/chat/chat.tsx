import React from "react";
import ChatInput from "./input";
import { useChat } from "@ai-sdk/react";
import { Messages } from "./messages";
import { SuggestedActions } from "../suggested.actions";
import AiBanner from "@/components/ai.banner";

export default function OnboardingChat({ chatId }: { chatId: string }) {
  const BASE_API_URL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3001/v1"
      : "https://api.prexoai.xyz/v1";

  const url = `${BASE_API_URL}/ai/stream`;

  const {
    messages,
    input,
    setInput,
    handleSubmit,
    status,
    addToolResult,
    append,
  } = useChat({
    api: url,
    onFinish: (message, { usage, finishReason }) => {
      console.log("Finished streaming message:", message);
      console.log("Token usage:", usage);
      console.log("Finish reason:", finishReason);
    },
    onError: (error) => {
      console.error("An error occurred:", error);
    },
    onResponse: (response) => {
      console.log("Received HTTP response from server:", response);
    },
    maxSteps: 5,
    credentials: "include"
  });
  return (
    <div className="relative flex flex-col w-screen max-w-2xl mx-auto h-screen">
      {messages.length > 0 && (
        <div className="mx-2">
          <AiBanner />
        </div>
      )}
      <div className="flex-1 overflow-y-auto pt-4">
        <Messages
          chatId={chatId}
          status={status}
          messages={messages}
          addToolResult={addToolResult}
          append={append}
        />
      </div>
      <div className="sticky bottom-0 bg-background z-10 px-2 pb-2">
        {messages.length === 0 && (
          <div className="mb-5">
            <SuggestedActions append={append} />
          </div>
        )}
        <ChatInput
          status={status}
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
