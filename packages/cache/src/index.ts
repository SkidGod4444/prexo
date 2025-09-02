import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!redisUrl || !redisToken) {
  throw new Error(
    "Missing required environment variables: UPSTASH_REDIS_REST_URL and/or UPSTASH_REDIS_REST_TOKEN",
  );
}

export const cache = new Redis({
  url: redisUrl,
  token: redisToken,
});
