import { createTogetherAI } from "@ai-sdk/togetherai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { prisma } from "@prexo/db";
import { AIModelsFreeTierId } from "@prexo/types";
import { AI_MODELS_FREE_TIER } from "@prexo/utils/constants";
import { createOllama } from "ollama-ai-provider-v2";

export function generateContainerKey(): string {
  const id = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  return `con_${id}`;
}

export function prexoai(modelId: AIModelsFreeTierId) {
  const modelObj = AI_MODELS_FREE_TIER.find((m) => m.id === modelId);
  if (!modelObj) {
    throw new Error(`Unknown modelId: ${modelId}`);
  }
  const { marketplace, model } = modelObj;

  switch (marketplace) {
    case "openrouter": {
      const openrouter = createOpenRouter({
        apiKey: process.env.OPENROUTER_API_KEY!,
      });
      console.log(`Using OpenRouter model: ${model}`);
      return openrouter(model);
    }
    case "togetherai": {
      const togetherai = createTogetherAI({
        apiKey: process.env.TOGETHERAI_API_KEY!,
      });
      console.log(`Using TogetherAI model: ${model}`);
      return togetherai(model);
    }
    default:
      const togetherai = createTogetherAI({
        apiKey: process.env.TOGETHERAI_API_KEY!,
      });
      console.log(`Using default TogetherAI model!`);
      return togetherai("meta-llama/Llama-3.3-70B-Instruct-Turbo-Free");
  }
}

export async function invalidateCache(tags: string[]) {
  try {
    await prisma.$accelerate.invalidate({ tags });
  } catch (e: any) {
    if (e && typeof e === "object" && "code" in e && e.code === "P6003") {
      console.log(
        "The cache invalidation rate limit has been reached. Please try again later.",
      );
    }
    throw e;
  }
}
