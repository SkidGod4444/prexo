import { logger, schedules } from "@trigger.dev/sdk/v3";
import { extractText } from "./lib/extract-text";
import { Redis } from "@upstash/redis";
import { Index } from "@upstash/vector";

const STREAM_KEY = "vectorizer-stream";
const GROUP = "vectorizer";
const CONSUMER = "vectorizer-worker";
const redis = Redis.fromEnv();
const vectorIndex = Index.fromEnv();

export const textExtractor = schedules.task({
  id: "vectorizer-worker",
  cron: "*/0.5 * * * * *", // every 30 seconds
  maxDuration: 300, // Stop executing after 300 secs (5 mins) of compute
  run: async (payload) => {
    const res = await redis.xreadgroup(GROUP, CONSUMER, [STREAM_KEY], [">"], {
      count: 50,
    });
    if (!res) return "No jobs found!";
    // logger.log("Starting text extraction for", { payload, ctx });
    // const extText = await extractText(payload.url);
    // logger.log("Text Extracted: ", { extText });
    return {
      //   txt: extText,
    };
  },
});
