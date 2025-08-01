import { prisma } from "@prexo/db";
import { Hono } from "hono";
import { createApi, getApiKey, verifyApi } from "@prexo/keys";
import { checkUser } from "@/checks/check.user";

const api = new Hono();

api.use(checkUser);

api.post("/create", async (c) => {
  const { name, projectId, expires } = await c.req.json();
  if (!name || !projectId) {
    return c.json({ message: "Name and ProjectId are required" }, 400);
  }

  const apiKey = await createApi(projectId, name, true, expires);
  if (!apiKey.key) {
    return c.json({ message: "Failed to create API key" }, 500);
  }

  const newAPI = await prisma.project.update({
    where: { id: projectId },
    data: {
      keyId: apiKey.keyId,
      updatedAt: new Date(),
    },
  });
  if (!newAPI) {
    return c.json({ message: "Failed to create ApiKey" }, 500);
  }
  console.log("Created new ApiKey:", newAPI);
  return c.json({ project: newAPI, apiKey: apiKey.key }, 201);
});

api.post("/new", async (c) => {
  const { name, projectId, expires } = await c.req.json();
  if (!name || !projectId) {
    return c.json({ message: "Name and ProjectId are required" }, 400);
  }

  const apiKey = await createApi(projectId, name, true, expires);
  if (!apiKey.key) {
    return c.json({ message: "Failed to create API key" }, 500);
  }

  const newAPI = await prisma.project.update({
    where: { id: projectId },
    data: {
      keyId: apiKey.keyId,
      updatedAt: new Date(),
    },
  });
  if (!newAPI) {
    return c.json({ message: "Failed to store ApiKey" }, 500);
  }
  console.log("Created new ApiKey:", apiKey.key);
  return c.json({ apiKey: apiKey.key }, 201);
});

api.post("/verify", async (c) => {
  const { apiKey } = await c.req.json();
  if (!apiKey) {
    return c.json({ message: "API key is required" }, 400);
  }

  const verify = await verifyApi(apiKey);
  if (!verify.result) {
    return c.json({ message: "Failed to verify API key" }, 401);
  }

  return c.json({ result: verify.result }, 201);
});

api.get("/key/:keyId", async (c) => {
  const { keyId } = c.req.param();
  if (!keyId) {
    return c.json({ message: "keyId is required" }, 400);
  }

  const apiKey = await getApiKey(keyId);

  if (!apiKey.apiId) {
    return c.json({ message: "API key not found" }, 404);
  }

  return c.json({ apiKey }, 200);
});

export default api;
