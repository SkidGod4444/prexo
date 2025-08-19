import { checkUser } from "@/checks/check.user";
import { generateContainerKey } from "@/lib/utils";
import { auth } from "@prexo/auth";
import { prisma } from "@prexo/db";
import { Hono } from "hono";

const containers = new Hono();

containers.use(checkUser);

containers.post("/create", async (c) => {
  const { name, description, projectId } = await c.req.json();
  if (!name || !projectId) {
    return c.json({ message: "Name and ProjectId are required" }, 400);
  }

  const newContainer = await prisma.containers.create({
    data: {
      key: generateContainerKey(),
      name,
      description,
      projectId,
    },
  });
  if (!newContainer) {
    return c.json({ message: "Failed to create container" }, 500);
  }
  console.log("Created new container:", newContainer);
  return c.json({ container: newContainer }, 201);
});

containers.get("/:projectId/all", async (c) => {
  const projectId = c.req.param("projectId");
  if (!projectId) {
    return c.json({ message: "Project ID is required" }, 400);
  }
  try {
    const containers = await prisma.containers.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
      cacheStrategy: {
        ttl: 30,
        swr: 30,
        tags: ["findMany_containers"],
      },
    });
    return c.json({ containers }, 200);
  } catch (error) {
    console.error("Error fetching containers:", error);
    return c.json({ message: "Failed to fetch containers" }, 500);
  }
});

containers.delete("/delete", async (c) => {
  const { id } = await c.req.json();
  if (!id) {
    return c.json({ message: "Container id is required" }, 400);
  }
  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user?.id) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    const container = await prisma.containers.findUnique({
      where: { id },
      select: { id: true, project: { select: { userId: true } } },
    });
    if (!container) {
      return c.json({ message: "Not found" }, 404);
    }
    if (container.project.userId !== session.user.id) {
      return c.json({ message: "Forbidden" }, 403);
    }

    const delCont = await prisma.containers.delete({
      where: { id },
    });
    return c.json({ message: "Container deleted", container: delCont }, 200);
  } catch (error) {
    console.error("Error deleting container:", error);
    return c.json({ message: "Failed to delete container" }, 500);
  }
});

export default containers;
