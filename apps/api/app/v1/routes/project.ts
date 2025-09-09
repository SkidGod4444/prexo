import { checkUser } from "@/middleware/check.user";
import { invalidateCache } from "@/lib/utils";
import { auth } from "@prexo/auth";
import { prisma } from "@prexo/db";
import { Hono } from "hono";
import { auditLogs } from "@/middleware/audit.logs";
import { Variables } from "@/types";

const project = new Hono<{ Variables: Variables }>();

project.use(checkUser);
project.use(auditLogs);

project.post("/create", async (c) => {
  const { name, userId, description } = await c.req.json();
  if (!name || !userId) {
    return c.json({ message: "Name and UserId are required" }, 400);
  }

  const newProject = await prisma.project.create({
    data: {
      name: name,
      userId: userId,
      description: description || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  if (!newProject) {
    return c.json({ message: "Failed to create project" }, 500);
  }
  console.log("Created new project:", newProject);
  return c.json({ project: newProject }, 201);
});

project.delete("/delete", async (c) => {
  const { id } = await c.req.json();
  if (!id) {
    return c.json({ message: "Project id is required" }, 400);
  }

  try {
    const user = c.get("user");
    if (!user.id) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    const proj = await prisma.project.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });
    if (!proj) {
      return c.json({ message: "Not found" }, 404);
    }
    if (proj.userId !== user.id) {
      return c.json({ message: "Forbidden" }, 403);
    }

    const deletedProject = await prisma.project.delete({
      where: { id },
    });
    return c.json({ project: deletedProject }, 200);
  } catch (error) {
    console.error("Failed to delete project:", error);
    return c.json({ message: "Failed to delete project" }, 500);
  }
});

project.post("/update", async (c) => {
  const { id, ...fields } = await c.req.json();
  if (!id) {
    return c.json({ message: "Project id is required" }, 400);
  }

  // Remove fields that should not be updated directly
  delete fields.id;
  delete fields.createdAt;
  // Always update updatedAt
  fields.updatedAt = new Date();

  if (Object.keys(fields).length === 1 && fields.updatedAt) {
    // No updatable fields provided
    return c.json({ message: "No fields to update" }, 400);
  }

  try {
    const updatedProject = await prisma.project.update({
      where: { id },
      data: fields,
    });
    await invalidateCache(["findMany_projects"]);
    return c.json({ project: updatedProject }, 200);
  } catch (error) {
    console.error("Failed to update project:", error);
    return c.json({ message: "Failed to update project" }, 500);
  }
});

project.get("/all", async (c) => {
  const user = c.get("user");

  if (!user) {
    return c.json(
      {
        message: "Oops! seems like your session is expired",
        status: 400,
      },
      400,
    );
  }

  const userId = user.id;

  try {
    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      cacheStrategy: {
        ttl: 60,
        swr: 60,
        tags: ["findMany_projects"],
      },
    });
    return c.json({ projects }, 200);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return c.json({ message: "Failed to fetch projects" }, 500);
  }
});

export default project;
