import { checkUser } from "@/checks/check.user";
import { auth } from "@prexo/auth";
import { prisma } from "@prexo/db";
import { Hono } from "hono";

const domain = new Hono();

domain.use(checkUser);
// @_TODO_ check project ownership
domain.post("/create", async (c) => {
  const { name, alias, status, projectId } = await c.req.json();
  if (!name || !projectId) {
    return c.json({ message: "Name and ProjectId are required" }, 400);
  }

  const newDomain = await prisma.domain.create({
    data: {
      name: name,
      alias: alias,
      status: status || "Pending",
      project: {
        connect: { id: projectId },
      },
    },
  });
  if (!newDomain) {
    return c.json({ message: "Failed to create domain" }, 500);
  }
  console.log("Created new domain:", newDomain);
  return c.json({ domain: newDomain }, 201);
});

domain.post("/all", async (c) => {
  const { projectId } = await c.req.json();
  try {
    const domains = await prisma.domain.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
      cacheStrategy: {
        ttl: 60,
        swr: 60,
        tags: ["findMany_domains"]
      },
    });
    return c.json({ domains }, 200);
  } catch (error) {
    console.error("Error fetching domains:", error);
    return c.json({ message: "Failed to fetch domains" }, 500);
  }
});

// Delete route for domain
domain.delete("/delete", async (c) => {
  const { id } = await c.req.json();
  if (!id) {
    return c.json({ message: "Domain id is required" }, 400);
  }
  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user?.id) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    const dom = await prisma.domain.findUnique({
      where: { id },
      select: { id: true, project: { select: { userId: true } } },
    });
    if (!dom) {
      return c.json({ message: "Not found" }, 404);
    }
    if (dom.project.userId !== session.user.id) {
      return c.json({ message: "Forbidden" }, 403);
    }

    const deletedDomain = await prisma.domain.delete({
      where: { id },
    });
    return c.json({ message: "Domain deleted", domain: deletedDomain }, 200);
  } catch (error) {
    console.error("Error deleting domain:", error);
    return c.json({ message: "Failed to delete domain" }, 500);
  }
});

export default domain;
