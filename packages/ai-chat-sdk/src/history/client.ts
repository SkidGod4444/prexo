"use client";
import type { BaseMessageHistory } from "../types";
import { InRedisHistory } from "./in-redis";

export type GetHistoryClientParams = {
  redis?: {
    url: string;
    token: string;
  };
};

export const getHistoryClient = (
  params?: GetHistoryClientParams,
): BaseMessageHistory | undefined => {
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
};
