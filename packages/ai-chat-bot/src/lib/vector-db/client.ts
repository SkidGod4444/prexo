"use client";
import type { BaseVectorContext } from "@prexo/ai-chat-sdk/types";
import { IntVector } from "./local.vector";

export type GetContextClientParams = {
  namespace: string;
  apiKey?: string;
};

export const getIntContextClient = (
  params?: GetContextClientParams,
): BaseVectorContext | undefined => {
  const namespace = params?.namespace;
  const apiKey = params?.apiKey;

  if (apiKey && namespace) {
    return new IntVector(namespace, apiKey);
  }
};