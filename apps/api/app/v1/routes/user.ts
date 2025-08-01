import { checkUser } from "@/checks/check.user";
import { auth } from "@prexo/auth";
import { prisma } from "@prexo/db";
import { UserType } from "@prexo/types";
import { Hono } from "hono";

const user = new Hono();

user.use(checkUser);

user.get("/self", async (c) => {
  const currentUser = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

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
      id: currentUser.user.id,
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

export default user;
