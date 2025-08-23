import { verifyApiKey } from "@/middleware/check.api";
import { VectorDB } from "@prexo/ai-chat-sdk/context";
import { Index } from "@upstash/vector";
import { Hono } from "hono";

export const maxDuration = 60;

const context = new Hono();
const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL!,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
});
const vectorDB = new VectorDB(index);

context.use(
  "*",
  verifyApiKey(
    {
      apiId: process.env.UNKEY_API_ID!,
      tags: ["/sdk/context"],
      handleInvalidKey: (c, result) => {
        console.log("Invalid API key!", result);
        return c.json({ error: "unauthorized", reason: result?.code }, 401);
      },
      onError: (c, err) => {
        console.log("Unkey Error:", err.message);
        return c.text("unauthorized", 401);
      },
    },
    2,
    5,
    60,
  ),
);

context.post("/add", async (c) => {
  try {
    const { namespace, type, url, data } = await c.req.json();
    let result;

    switch (type) {
      case "html":
        result = await vectorDB.save({
          type: "html",
          fileSource: url,
          options: { namespace },
        });
        break;
      case "text":
        result = await vectorDB.save({
          type: "text",
          data: data,
          options: { namespace },
        });
        break;
      case "pdf":
        result = await vectorDB.save({
          type: "pdf",
          fileSource: url,
          options: { namespace },
        });
        break;
      case "csv":
        result = await vectorDB.save({
          type: "csv",
          fileSource: url,
          options: { namespace },
        });
        break;
      case "text-file":
        result = await vectorDB.save({
          type: "text-file",
          fileSource: url,
          options: { namespace },
        });
        break;
      case "embedding":
        result = await vectorDB.save({
          type: "embedding",
          data: data,
          options: { namespace },
        });
        break;

      default:
        return c.json(
          {
            message: "Invalid type provided",
            status: 400,
          },
          400,
        );
    }

    if (!result.success) {
      throw new Error(result.error || "Unknown error");
    }

    return c.json(
      {
        message: "Context added successfully!",
        status: 201,
        ids: result.ids,
      },
      201,
    );
  } catch (error) {
    console.error("Error adding context:", error);
    return c.json(
      {
        message: "Failed to add context",
        error: error instanceof Error ? error.message : String(error),
        status: 500,
      },
      500,
    );
  }
});

context.get("/get", async (c) => {
  try {
    const { payload, namespace } = await c.req.json();
    const result = await vectorDB.retrieve({ ...payload, namespace });

    if (!result || result.length === 0) {
      throw new Error("No data found");
    }

    return c.json(
      {
        message: "Context retrieved successfully!",
        status: 200,
        data: result,
      },
      200,
    );
  } catch (error) {
    console.error("Error getting context:", error);
    return c.json(
      {
        message: "Failed to get context",
        error: error instanceof Error ? error.message : String(error),
        status: 500,
      },
      500,
    );
  }
});

context.post("/reset", async (c) => {
  try {
    const { namespace } = await c.req.json();
    await vectorDB.reset({ namespace });
    return c.json(
      {
        message: "Context reset successfully!",
        status: 200,
      },
      200,
    );
  } catch (error) {
    console.error("Error resetting context:", error);
    return c.json(
      {
        message: "Failed to reset context",
        error: error instanceof Error ? error.message : String(error),
        status: 500,
      },
      500,
    );
  }
});

context.delete("/delete", async (c) => {
  try {
    const { ids, namespace } = await c.req.json();
    await vectorDB.delete({ ids, namespace });
    return c.json(
      {
        message: "Context delete successfully!",
        status: 200,
      },
      200,
    );
  } catch (error) {
    console.error("Error deleting context:", error);
    return c.json(
      {
        message: "Failed to delete context",
        error: error instanceof Error ? error.message : String(error),
        status: 500,
      },
      500,
    );
  }
});

export default context;
