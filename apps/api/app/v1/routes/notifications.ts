import { checkUser } from "@/checks/check.user";
import { invalidateCache } from "@/lib/utils";
import { prisma } from "@prexo/db";
import { Hono } from "hono";

const notifications = new Hono();

notifications.use(checkUser);

notifications.post("/create", async (c) => {
  const { title, projectId, description, icon, url } = await c.req.json();
  if (!title || !projectId) {
    return c.json({ message: "Title and ProjectId are required" }, 400);
  }

  const notify = await prisma.notifications.create({
    data: {
      title,
      projectId,
      icon,
      url,
      desc: description || null,
      project: {
        connect: { id: projectId },
      },
    },
  });
  if (!notify) {
    return c.json({ message: "Failed to create notification" }, 500);
  }
  console.log("Created new notification:", notify);
  return c.json({ notification: notify }, 201);
});

notifications.get("/:projectId/all", async (c) => {
  const projectId = c.req.param("projectId");
  if (!projectId) {
    return c.json({ message: "Project ID is required" }, 400);
  }
  try {
    const notifications = await prisma.notifications.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
      cacheStrategy: {
        ttl: 30,
        swr: 30,
        tags: ["findMany_notifications"],
      },
    });
    return c.json({ notifications }, 200);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return c.json({ message: "Failed to fetch notifications" }, 500);
  }
});

notifications.post("/mark-as-seen", async (c) => {
  const { ids, projectId } = await c.req.json();

  if (!Array.isArray(ids) || ids.length === 0) {
    return c.json({ message: "No notification ids provided" }, 400);
  }

  try {
    const result = await prisma.notifications.updateMany({
      where: {
        id: { in: ids },
        projectId,
      },
      data: {
        isSeen: true,
        updatedAt: new Date(),
      },
    });

    await invalidateCache(["findMany_notifications"]);

    return c.json(
      {
        message: "Notifications marked as seen",
        count: result.count,
      },
      200,
    );
  } catch (error) {
    console.error("Error marking notifications as seen:", error);
    return c.json({ message: "Failed to mark notifications as seen" }, 500);
  }
});

export default notifications;
