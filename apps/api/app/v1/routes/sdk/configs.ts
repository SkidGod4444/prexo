import { Hono } from "hono";
import { UnkeyContext } from "@unkey/hono";
import { verifyApiKey } from "@/checks/check.api";

const configs = new Hono<{ Variables: { verifyApiKey: UnkeyContext } }>();

configs.use(
  "*",
  verifyApiKey(
    {
      apiId: process.env.UNKEY_API_ID!,
      tags: ["/sdk/configs"],
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
    0,
  ),
);

export default configs;
