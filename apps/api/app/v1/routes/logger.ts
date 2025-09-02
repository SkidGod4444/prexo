import { prisma } from "@prexo/db";
import { Hono } from "hono";

const auditLogs = new Hono();

auditLogs.get("/:projectId/all", async (c) => {
  try {
    const projectId = c.req.param("projectId");
    if (!projectId) {
      return c.json({ message: "Project ID is required" }, 400);
    }

    const [auditData, usageData] = await Promise.all([
      prisma.auditLogs.findMany({
        where: { projectId },
        orderBy: { createdAt: "desc" },
        cacheStrategy: {
          ttl: 60,
          swr: 60,
          tags: ["findMany_auditLogs"],
        },
      }),
      prisma.usageLogs.findMany({
        where: { projectId },
        orderBy: { createdAt: "desc" },
        cacheStrategy: {
          ttl: 60,
          swr: 60,
          tags: ["findMany_usageLogs"],
        },
      }),
    ]);

    return c.json({ auditLogs: auditData, usageLogs: usageData }, 200);
  } catch (error) {
    console.error("Error fetching logs:", error);
    return c.json(
      {
        message: "Failed to fetch logs",
        error: error instanceof Error ? error.message : error,
      },
      500,
    );
  }
});

auditLogs.post("/audit/create", async (c) => {
  const { time, actor, action, endpoint, credits, projectId } =
    await c.req.json();
  if (!projectId) {
    return c.json({ error: "projectId is required" }, 400);
  }

  try {
    const auditLogs = await prisma.auditLogs.create({
      data: {
        time,
        actor,
        action,
        endpoint,
        credits,
        projectId,
      },
    });
    return c.json({ auditLogs }, 201);
  } catch (error) {
    return c.json({ message: "Failed to create usage log", error }, 500);
  }
});

auditLogs.post("/usage/create", async (c) => {
  const { year, month, api_calls, credits_used, projectId } =
    await c.req.json();
  if (!projectId) {
    return c.json({ error: "projectId is required" }, 400);
  }

  try {
    const usageLog = await prisma.usageLogs.create({
      data: {
        year,
        month,
        api_calls,
        credits_used,
        projectId,
      },
    });
    return c.json({ usageLog }, 201);
  } catch (error) {
    return c.json({ message: "Failed to create usage log", error }, 500);
  }
});

export default auditLogs;
