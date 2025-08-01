import { Hono } from "hono";
import { createTogetherAI } from "@ai-sdk/togetherai";
import {
  NoSuchToolError,
  InvalidToolArgumentsError,
  streamText,
  ToolExecutionError,
} from "ai";
import { systemPrompt } from "@/lib/constants";
import { z } from "zod";
import { checkUser } from "@/checks/check.user";

const ai = new Hono();

ai.use(checkUser);

export const maxDuration = 30;

const togetherai = createTogetherAI({
  apiKey: process.env.TOGETHER_API_KEY!,
});

ai.post("/stream", async (c) => {
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
    system: systemPrompt(),
    messages: filteredMessages,
    maxSteps: 5,
    tools: {
      askForConfirmation: {
        description: "Ask the user for any confirmation.",
        parameters: z.object({
          message: z
            .string()
            .describe("Onboarding message to ask for confirmation."),
        }),
      },
      sendCreateProjectForm: {
        description: "Send create project form to user. After confirmation.",
        parameters: z.object({
          message: z
            .string()
            .describe("Message to send to user after confirmation."),
        }),
      },
      sendCreateApiFrom: {
        description: "Send create API form to user. After confirmation.",
        parameters: z.object({
          message: z
            .string()
            .describe("Message to send to user after confirmation."),
        }),
      },
      sendApiCopyCard: {
        description: "Send API Key copy card. After confirmation.",
        parameters: z.object({
          message: z
            .string()
            .describe("Message to send to user after confirmation."),
        }),
      },
      completeOnboarding: {
        description: "Send UI to user to confirm onboarding is complete.",
        parameters: z.object({
          message: z
            .string()
            .describe("Message to ask if onboarding is complete."),
        }),
      },
    },
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

export default ai;
