import { auditLogs } from "@/middleware/audit.logs";
import { checkUser } from "@/middleware/check.user";
import { Variables } from "@/types";
import { prisma } from "@prexo/db";
import { UserType } from "@prexo/types";
import { Hono } from "hono";

const user = new Hono<{ Variables: Variables }>();

user.use(checkUser);
user.use(auditLogs);

user.get("/self", async (c) => {
  const currentUser = c.get("user");
  if (!currentUser) {
    return c.json(
      {
        message: "Oops! seems like your session is expired",
        status: 400,
      },
      400,
    );
  }

  let user: UserType | null = null;

  user = await prisma.user.findUnique({
    where: {
      id: currentUser.id,
    },
  });

  if (user) {
    console.log("Fetched user data from database (self)");
  }

  return c.json({ user }, 200);
});

user.post("/onboarded", async (c) => {
  const { userId } = await c.req.json();
  if (!userId) {
    return c.json({ message: "UserId is required", status: 401 }, 401);
  }
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role: "onboarded",
    },
  });
  return c.json({ user }, 200);
});

user.post("/inactive", async (c) => {
  const { userId } = await c.req.json();
  if (!userId) {
    return c.json({ message: "UserId is required", status: 401 }, 401);
  }
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role: "inactive",
    },
  });
  return c.json({ user }, 200);
});

user.post("/update", async (c) => {
  const { fields } = await c.req.json();
  const User = c.get("user");

  if (!User) {
    return c.json(
      {
        message: "Oops! seems like your session is expired",
        status: 400,
      },
      400,
    );
  }
  if (!fields || typeof fields !== "object" || Array.isArray(fields)) {
    return c.json({ message: "Fields object is required", status: 400 }, 400);
  }
  const user = await prisma.user.update({
    where: {
      id: User.id,
    },
    data: {
      ...fields,
    },
  });
  return c.json({ user }, 200);
});

export default user;
