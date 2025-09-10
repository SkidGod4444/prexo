import { auditLogs } from "@/middleware/audit.logs";
import { checkUser } from "@/middleware/check.user";
import { Variables } from "@/types";
import { prisma } from "@prexo/db";
import { Hono } from "hono";

const link = new Hono<{ Variables: Variables }>();

link.use(checkUser);
link.use(auditLogs);

link.post("/create", async (c) => {
  const { url, containerId, type } = await c.req.json();
  if (!url || !containerId) {
    return c.json({ message: "URL and containerId are required" }, 400);
  }

  const newLink = await prisma.links.create({
    data: {
      url,
      containerId,
      type,
    },
  });
  if (!newLink) {
    return c.json({ message: "Failed to create link" }, 500);
  }
  console.log("Created new link:", newLink);
  return c.json({ link: newLink }, 201);
});

link.get("/:containerId/all", async (c) => {
  const containerId = c.req.param("containerId");
  if (!containerId) {
    return c.json({ message: "Container ID is required" }, 400);
  }
  try {
    const links = await prisma.links.findMany({
      where: { containerId },
      orderBy: { createdAt: "desc" },
      cacheStrategy: {
        ttl: 30,
        swr: 30,
        tags: ["findMany_links"],
      },
    });
    return c.json({ links }, 200);
  } catch (error) {
    console.error("Error fetching links:", error);
    return c.json({ message: "Failed to fetch links" }, 500);
  }
});

link.delete("/delete", async (c) => {
  const { id } = await c.req.json();
  if (!id) {
    return c.json({ message: "Link id is required" }, 400);
  }

  try {
    const user = c.get("user");
    if (!user.id) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    const link = await prisma.links.findUnique({
      where: { id },
      select: {
        id: true,
        container: { select: { project: { select: { userId: true } } } },
      },
    });
    if (!link) {
      return c.json({ message: "Not found" }, 404);
    }
    if (link.container.project.userId !== user.id) {
      return c.json({ message: "Forbidden" }, 403);
    }

    const deletedLink = await prisma.links.delete({
      where: { id },
    });
    return c.json({ link: deletedLink }, 200);
  } catch (error) {
    console.error("Error deleting link:", error);
    return c.json({ message: "Error deleting link" }, 500);
  }
});

link.post("/update", async (c) => {
  const { id, ...fields } = await c.req.json();
  if (!id) {
    return c.json({ message: "Link id is required" }, 400);
  }
  try {
    const user = c.get("user");
    if (!user.id) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    const link = await prisma.links.findUnique({
      where: { id },
      select: {
        id: true,
        container: { select: { project: { select: { userId: true } } } },
      },
    });
    if (!link) {
      return c.json({ message: "Not found" }, 404);
    }
    if (link.container.project.userId !== user.id) {
      return c.json({ message: "Forbidden" }, 403);
    }

    const updatedLink = await prisma.links.update({
      where: { id },
      data: { ...fields, updatedAt: new Date() },
    });
    return c.json({ link: updatedLink }, 200);
  } catch (error) {
    console.error("Failed to update link:", error);
    return c.json({ message: "Failed to update link" }, 500);
  }
});

export default link;
