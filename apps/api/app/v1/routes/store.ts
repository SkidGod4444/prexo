import { checkUser } from "@/middleware/check.user";
import { Variables } from "@/types";
import { prisma } from "@prexo/db";
import { Hono } from "hono";
import { cache } from "@prexo/cache";

const store = new Hono<{ Variables: Variables }>();
store.use(checkUser);

store.get("/", async (c) => {
  const userId = c.get("userId");
  const cacheKey = `@prexo/store_${userId}`;

  // Return cached response if available
  const cached = await cache.get(cacheKey);
  if (cached) {
    console.log("Store cache hit for user:", userId);
    return c.json(cached, 200);
  }

  const orgs = await prisma.organization.findMany({
    where: { createdBy: userId },
    orderBy: { createdAt: "desc" },
    cacheStrategy: {
      ttl: 29,
      swr: 29,
      tags: ["store_orgs"],
    },
  });

  const projects = await prisma.project.findMany({
    where: { org: { createdBy: userId } },
    orderBy: { createdAt: "desc" },
    cacheStrategy: {
      ttl: 29,
      swr: 29,
      tags: ["store_projects"],
    },
  });

  const payload = { userId, orgs, projects };
  // Store in cache for a short TTL
  await cache.set(cacheKey, payload, { ex: 30 });
  console.log("Store cache set for user:", userId);
  return c.json(payload, 200);
});

export default store;
