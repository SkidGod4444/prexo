"use client";
import type { BaseMessageHistory } from "../../../ai-chat-bot/src/lib/types";
import { InMemoryHistory } from "./in-memory";
import { InRedisHistory } from "./in-redis";

export type GetHistoryClientParams = {
  redis?: {
    url: string;
    token: string;
  };
};

export const getHistoryClient = (
  params?: GetHistoryClientParams,
): BaseMessageHistory => {
  const redisUrl = params?.redis?.url;
  const redisToken = params?.redis?.token;

  if (redisUrl && redisToken) {
    return new InRedisHistory({
      config: {
        url: redisUrl,
        token: redisToken,
      },
    });
  }

  return new InMemoryHistory();
};
