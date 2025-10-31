import { validateWebhook } from "@/middleware/webhook.validator";
import { Hono } from "hono";
import { cache } from "@prexo/cache";

const vectorizer = new Hono();

vectorizer.use(validateWebhook);

vectorizer.post("/", async (c) => {
  const { container_id, type, url } = await c.req.json();
  try {
    const STREAM_KEY = "vectorizer-stream";
    await cache.xadd(STREAM_KEY, "*", {
      container_id,
      type,
      url,
    });
    console.log(
      `Added type: ${type} event with container_id: ${container_id} to vectorizer stream`,
    );
    return c.text(
      `Added type: ${type} event with container_id: ${container_id} to vectorizer stream`,
      200,
    );
  } catch (error) {
    console.error("Webhook processing error:", error);
    throw error;
  }
});

export default vectorizer;
