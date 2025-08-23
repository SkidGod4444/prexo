import { Hono } from "hono";
import {
  NoSuchToolError,
  InvalidToolArgumentsError,
  streamText,
  ToolExecutionError,
} from "ai";
import { playgroundPrompt } from "@/lib/constants";
import { checkUser } from "@/middleware/check.user";
import { prexoai } from "@/lib/utils";
import { createTogetherAI } from "@ai-sdk/togetherai";
import { AIModelsFreeTierId } from "@prexo/types";

const playgroundAi = new Hono();

playgroundAi.use(checkUser);

const togetherai = createTogetherAI({
  apiKey: process.env.TOGETHERAI_API_KEY!,
});

export const maxDuration = 30;

playgroundAi.post("/stream", async (c) => {
  const { messages } = await c.req.json();
  const modelId = c.req.header("x-model-id");
  if (!modelId) {
    return c.json({ error: "Missing model id" }, 400);
  }
  const LLM_MODEL: AIModelsFreeTierId = modelId as AIModelsFreeTierId;
  const filteredMessages = messages.map((msg: any) => {
    if (!msg.parts) return msg;
    return {
      ...msg,
      parts: msg.parts.filter((part: any) => {
        if (part.type !== "tool-invocation") return true;
        return part.toolInvocation?.state !== "call";
      }),
    };
  });

  const result = streamText({
    model: prexoai(LLM_MODEL),
    system: playgroundPrompt,
    messages: filteredMessages,
    maxSteps: 5,
    onStepFinish: (step) => {
      console.log("Step finished:", step);
    },
  });

  return result.toDataStreamResponse({
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Encoding": "none",
    },
    getErrorMessage: (error) => {
      if (NoSuchToolError.isInstance(error)) {
        return "The model tried to call a unknown tool.";
      } else if (InvalidToolArgumentsError.isInstance(error)) {
        return "The model called a tool with invalid arguments.";
      } else if (ToolExecutionError.isInstance(error)) {
        return "An error occurred during tool execution.";
      } else {
        return "An unknown error occurred.";
      }
    },
  });
});

export default playgroundAi;
