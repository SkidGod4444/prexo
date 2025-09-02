"use client";
import type { BaseVectorContext } from "../types";
import { ExtVector } from "./ext-vector";
import { IntVector } from "./int-vector";

export type GetContextClientParams = {
  vector?: {
    url: string;
    token: string;
    namespace: string;
  };
  apiKey?: string;
};

export const getContextClient = (
  params?: GetContextClientParams,
): BaseVectorContext | undefined => {
  const vectorUrl = params?.vector?.url;
  const vectorToken = params?.vector?.token;
  const namespace = params?.vector?.namespace;
  const apiKey = params?.apiKey;

  if (vectorUrl && vectorToken && namespace) {
    return new ExtVector({ url: vectorUrl, token: vectorToken }, namespace);
  } else if (apiKey && namespace) {
    return new IntVector(namespace, apiKey);
  }
};
