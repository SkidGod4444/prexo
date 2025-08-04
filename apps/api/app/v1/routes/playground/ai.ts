import { Hono } from "hono";
import { createTogetherAI } from "@ai-sdk/togetherai";
// import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import {
  NoSuchToolError,
  InvalidToolArgumentsError,
  streamText,
  ToolExecutionError,
} from "ai";
import { playgroundPrompt } from "@/lib/constants";
import { checkUser } from "@/checks/check.user";

const playgroundAi = new Hono();

playgroundAi.use(checkUser);

export const maxDuration = 30;

const togetherai = createTogetherAI({
  apiKey: process.env.TOGETHER_API_KEY!,
});

// const openrouter = createOpenRouter({
//   apiKey: process.env.OPENROUTER_API_KEY!,
// });

playgroundAi.post("/stream", async (c) => {
  const { messages } = await c.req.json();
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
    model: togetherai("meta-llama/Llama-3.3-70B-Instruct-Turbo-Free"),
    // model: openrouter("deepseek/deepseek-chat-v3-0324:free"),
    system: playgroundPrompt,
    messages: filteredMessages,
    maxSteps: 5,
    onStepFinish: (step) => {
      // console.log("Step finished:", step);
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
