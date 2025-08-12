import { checkUser } from "@/checks/check.user";
import { prisma } from "@prexo/db";
import { Hono } from "hono";

const envs = new Hono();

envs.use(checkUser);

envs.post("/create", async (c) => {
  const { name, value, projectId } = await c.req.json();
  if (!name || !projectId || !value) {
    return c.json({ message: "Name, Value and ProjectId are required" }, 400);
  }

  const newEnvs = await prisma.environments.create({
    data: {
      name: name,
      value: value,
      project: {
        connect: { id: projectId },
      },
    },
  });
  if (!newEnvs) {
    return c.json({ message: "Failed to create env" }, 500);
  }
  console.log("Created new env:", newEnvs);
  return c.json({ environments: newEnvs }, 201);
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
    });
    return c.json({ environments }, 200);
  } catch (error) {
    console.error("Error fetching envs:", error);
    return c.json({ message: "Failed to fetch envs" }, 500);
  }
});

export default envs;
