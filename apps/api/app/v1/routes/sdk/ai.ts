import { Hono } from "hono";
import { UnkeyContext } from "@unkey/hono";
import {
  NoSuchToolError,
  InvalidToolArgumentsError,
  streamText,
  ToolExecutionError,
} from "ai";
import { verifyApiKey } from "@/checks/check.api";

import {
  BodyParameters,
  SDK_RAG_SYSTEM_PROMPT,
  SDK_SYSTEM_PROMPT,
} from "@/lib/constants";
import { prexoai } from "@/lib/utils";
import { AIModelsFreeTierId } from "@prexo/types";

const aiSdk = new Hono<{ Variables: { verifyApiKey: UnkeyContext } }>();

export const maxDuration = 30;

aiSdk.use(
  "*",
  verifyApiKey(
    {
      apiId: process.env.UNKEY_API_ID!,
      tags: ["/sdk/ai"],
      handleInvalidKey: (c, result) => {
        console.log("Invalid API key!", result);
        return c.json(
          {
            error: "unauthorized",
            reason: result?.code,
          },
          401,
        );
      },
      onError: (c, err) => {
        console.log("Unkey Error:", err.message);
        return c.text("unauthorized", 401);
      },
    },
    3,
    3,
    60,
  ),
);

aiSdk.post("/stream", async (c) => {
  const { messages, history, context, RAGDisabled }: BodyParameters =
    await c.req.json();
    const modelId = c.req.header("x-model-id");
    if (!modelId) {
      return c.json(
        { error: "Missing model id" },
        400
      );
    }
    const LLM_MODEL: AIModelsFreeTierId = modelId as AIModelsFreeTierId;
    
  const userQuestion = messages[messages.length - 1];

  const sysPrompt = RAGDisabled
    ? SDK_SYSTEM_PROMPT({
        question: userQuestion.content,
        chatHistory: history,
      })
    : SDK_RAG_SYSTEM_PROMPT({
        question: userQuestion.content,
        chatHistory: history,
        context: context,
      });
  console.log(sysPrompt);

  const result = streamText({
    model: prexoai(LLM_MODEL),
    messages: messages,
    system: sysPrompt,
    maxSteps: 5,
    // onStepFinish: (step) => {
    //   console.log("Step finished:", step);
    // },
  });

  return result.toDataStreamResponse({
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Encoding": "none",
    },
    getErrorMessage: (error) => {
      if (error == null) {
        return "unknown error";
      }

      if (typeof error === "string") {
        return error;
      }

      if (error instanceof Error) {
        return error.message;
      }

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

export default aiSdk;
