"use client";
import type { BaseVectorContext, GetContextClientParams } from "../types";
import { ExtVector } from "./ext-vector";

export const getContextClient = (
  params?: GetContextClientParams,
): BaseVectorContext | undefined => {
  const vectorUrl = params?.vector?.url;
  const vectorToken = params?.vector?.token;
  // Prefer container_id as namespace, fallback to provided vector.namespace
  const namespace = params?.vector?.namespace;

  if (vectorUrl && vectorToken && namespace) {
    return new ExtVector({ url: vectorUrl, token: vectorToken }, namespace);
  }
};
