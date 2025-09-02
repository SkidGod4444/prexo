import { verifyApiKey } from "@/middleware/check.api";
import { Hono } from "hono";
import { tasks, runs } from "@trigger.dev/sdk/v3";
import { textExtractor } from "../../../../../../triggers/extractor.example";
const extractor = new Hono();

export const maxDuration = 300;

extractor.use(
  "*",
  verifyApiKey(
    {
      apiId: process.env.UNKEY_API_ID!,
      tags: ["/sdk/extractor"],
      handleInvalidKey: (c, result) => {
        console.log("Invalid API key!", result);
        return c.json(
          {
            error: "unauthorized",
            reason: result?.code,
          },
          401,
        );
      },
      onError: (c, err) => {
        console.log("Unkey Error:", err.message);
        return c.text("unauthorized", 401);
      },
    },
    5,
    2,
    60,
  ),
);

extractor.post("/", async (c) => {
  const { url } = await c.req.json();
  const handle = await tasks.trigger<typeof textExtractor>("extractor", {
    url,
  });
  for await (const run of runs.subscribeToRun<typeof textExtractor>(
    handle.id,
  )) {
    if (run.output) {
      return c.json({
        status: "ok",
        output: run.output,
      });
    }
    if (run.error) {
      return c.json({
        status: run.error.name,
        message: run.error.message,
      });
    }
  }
  // If no output was found, return an error
  return c.json(
    {
      status: "error",
      message: "No output from extractor",
    },
    500,
  );
});

export default extractor;
