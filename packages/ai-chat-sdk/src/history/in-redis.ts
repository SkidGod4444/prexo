import { Redis, type RedisConfigNodejs } from "@upstash/redis";
import type { Message } from "ai";
import {
  DEFAULT_CHAT_SESSION_ID,
  DEFAULT_HISTORY_LENGTH,
  DEFAULT_HISTORY_TTL,
} from "../lib/constants";
import type { BaseMessageHistory } from "../types";

export type RedisHistoryConfig = {
  config?: RedisConfigNodejs;
  client?: Redis;
};

export class InRedisHistory implements BaseMessageHistory {
  public client: Redis;

  constructor(config: RedisHistoryConfig) {
    const { config: redisConfig, client } = config;

    if (client) {
      this.client = client;
    } else if (redisConfig) {
      this.client = new Redis(redisConfig);
    } else {
      throw new Error(
        "Redis message stores require either a config object or a pre-configured client.",
      );
    }
  }

  async addMessage(params: {
    message: Message;
    sessionId: string;
    sessionTTL?: number;
  }): Promise<void> {
    const { message, sessionId, sessionTTL } = params;
    let TTL = DEFAULT_HISTORY_TTL;
    if (sessionTTL) {
      TTL = sessionTTL;
    }
    const sessionID = DEFAULT_CHAT_SESSION_ID(sessionId);

    await this.client.lpush(sessionID, JSON.stringify(message));
    if (sessionTTL) {
      await this.client.expire(sessionID, TTL);
    }
  }

  async deleteMessages({ sessionId }: { sessionId: string }): Promise<void> {
    await this.client.del(sessionId);
  }

  async getMessages({
    sessionId,
    amount = DEFAULT_HISTORY_LENGTH,
    startIndex = 0,
  }: {
    sessionId: string;
    amount?: number;
    startIndex?: number;
  }): Promise<Message[]> {
    const sessionID = DEFAULT_CHAT_SESSION_ID(sessionId);
    const endIndex = startIndex + amount - 1;
    const messages = await this.client.lrange<Message>(
      sessionID,
      startIndex,
      endIndex,
    );
    return messages.reverse();
  }
}
