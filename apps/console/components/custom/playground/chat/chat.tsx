import React from "react";
import ChatInput from "./input";
import { useChat } from "@ai-sdk/react";
import { Messages } from "./messages";
import { useReadLocalStorage } from "usehooks-ts";
import { AIModelsFreeTierId } from "@prexo/types";
// import { useApiKeyStore } from "@prexo/store";
// import {getApiKey} from "@prexo/keys";

export default function ChatPanel({ chatId }: { chatId: string }) {
  const model = useReadLocalStorage<AIModelsFreeTierId>(
    "@prexo-#selectedAiModel",
  );
  // const {key} = useApiKeyStore();
  const apiKey = "";

  const BASE_API_URL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3001/v1"
      : "https://api.prexoai.xyz/v1";

  const url = `${BASE_API_URL}/playground/ai/stream`;

  const { messages, input, setInput, handleSubmit, status } = useChat({
    api: url,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "x-model-id": model ?? "mistralai/mistral-small-3.2-24b-instruct:free",
    },
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
    credentials: "include",
  });
  return (
    <div className="fixed inset-x-0 bottom-0 flex flex-col w-screen max-w-2xl mx-auto h-screen">
      <div className="flex-1 flex flex-col justify-end pointer-events-auto">
        <div className="max-h-[67vh] overflow-y-auto flex-1">
          <Messages chatId={chatId} status={status} messages={messages} />
        </div>
        <div className="bg-background z-10 px-2 pb-2 pt-2">
          <ChatInput
            status={status}
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
