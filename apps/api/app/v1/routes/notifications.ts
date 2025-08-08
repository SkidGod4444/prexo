import { checkUser } from "@/checks/check.user";
import { auth } from "@prexo/auth";
import { prisma } from "@prexo/db";
import { Hono } from "hono";

const notifications = new Hono();

notifications.use(checkUser);

notifications.post("/create", async (c) => {
  const { title, userId, description, icon, url } = await c.req.json();
  if (!title || !userId) {
    return c.json({ message: "Title and UserId are required" }, 400);
  }

  const notify = await prisma.notifications.create({
    data: {
      title,
      userId,
      icon,
      url,
      desc: description || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  if (!notify) {
    return c.json({ message: "Failed to create notification" }, 500);
  }
  console.log("Created new notification:", notify);
  return c.json({ notification: notify }, 201);
});

notifications.get("/all", async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json(
      {
        message: "Oops! seems like your session is expired",
        status: 400,
      },
      400,
    );
  }

  const userId = session.user.id;

  try {
    const notifications = await prisma.notifications.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return c.json({ notifications }, 200);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return c.json({ message: "Failed to fetch notifications" }, 500);
  }
});

notifications.post("/mark-as-seen", async (c) => {
  const { ids } = await c.req.json();
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json(
      {
        message: "Oops! seems like your session is expired",
        status: 400,
      },
      400,
    );
  }

  const userId = session.user.id;

  if (!Array.isArray(ids) || ids.length === 0) {
    return c.json({ message: "No notification ids provided" }, 400);
  }

  try {
    // Update notifications' isSeen to true for the given ids and userId
    const result = await prisma.notifications.updateMany({
      where: {
        id: { in: ids },
        userId,
      },
      data: {
        isSeen: true,
        updatedAt: new Date(),
      },
    });

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
