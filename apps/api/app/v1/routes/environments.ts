import { auditLogs } from "@/middleware/audit.logs";
import { checkUser } from "@/middleware/check.user";
import { prisma } from "@prexo/db";
import { Hono } from "hono";

const envs = new Hono();

envs.use(checkUser);
envs.use(auditLogs);

envs.post("/create", async (c) => {
  try {
    const { name, value, projectId } = await c.req.json();
    if (!name || !projectId || !value) {
      return c.json({ message: "Name, Value and ProjectId are required" }, 400);
    }

    const newEnvs = await prisma.environments.create({
      data: {
        name,
        value,
        projectId,
      },
    });
    if (!newEnvs) {
      return c.json({ message: "Failed to create env" }, 500);
    }
    // Avoid logging secret values
    console.log("Created new env:", {
      id: newEnvs.id,
      name: newEnvs.name,
      projectId: newEnvs.projectId,
      createdAt: newEnvs.createdAt,
    });
    return c.json({ environments: newEnvs }, 201);
  } catch (error) {
    console.error("Error creating env:", error);
    return c.json({ message: "Failed to create env" }, 500);
  }
});

envs.get("/:projectId/all", async (c) => {
  const projectId = c.req.param("projectId");
  if (!projectId) {
    return c.json({ message: "Project ID is required" }, 400);
  }
  try {
    const environments = await prisma.environments.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
      cacheStrategy: {
        ttl: 30,
        swr: 30,
        tags: ["findMany_envs"],
      },
    });
    return c.json({ environments }, 200);
  } catch (error) {
    console.error("Error fetching envs:", error);
    return c.json({ message: "Failed to fetch envs" }, 500);
  }
});

export default envs;
