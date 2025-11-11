import { checkUser } from "@/middleware/check.user";
import { invalidateCache } from "@/lib/utils";
import { prisma } from "@prexo/db";
import { Hono } from "hono";
// import { auditLogs } from "@/middleware/audit.logs";
import { Variables } from "@/types";
import { MailClient } from "@/lib/agentmail";

const project = new Hono<{ Variables: Variables }>();

project.use(checkUser);
// project.use(auditLogs);

project.post("/create", async (c) => {
  const { name, orgId, description, slug } = await c.req.json();
  if (!name || !orgId) {
    return c.json({ message: "Name and OrgId are required" }, 400);
  }

  const pod = await MailClient.pods.create({
    name: `proj-${slug}`,
  });

  const newProject = await prisma.project.create({
    data: {
      name: name,
      orgId: orgId,
      slug: slug,
      description: description || null,
      podId: pod.podId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  if (!newProject) {
    await MailClient.pods.delete(pod.podId);
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
      select: { id: true, orgId: true },
    });
    if (!proj) {
      return c.json({ message: "Not found" }, 404);
    }
    // Authorize by checking org's creator
    const org = await prisma.organization.findUnique({
      where: { id: proj.orgId },
      select: { createdBy: true },
    });
    if (!org) {
      return c.json({ message: "Organization not found" }, 404);
    }
    if (org.createdBy !== user.id) {
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
  const userId = c.get("userId");

  try {
    const projects = await prisma.project.findMany({
      where: { org: { createdBy: userId } },
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
