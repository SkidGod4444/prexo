import { checkUser } from "@/middleware/check.user";
import { Hono } from "hono";
import { AI_MODELS_PRO_TIER } from "@prexo/utils/constants";
const models = new Hono();

models.use(checkUser);

models.get("/", async (c) => {
  return c.json({ models: AI_MODELS_PRO_TIER });
});

export default models;
