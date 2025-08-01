import { checkUser } from "@/checks/check.user";
import { auth } from "@prexo/auth";
import { prisma } from "@prexo/db";
import { Hono } from "hono";

const project = new Hono();

project.use(checkUser);

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

project.get("/all", async (c) => {
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
    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return c.json({ projects }, 200);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return c.json({ message: "Failed to fetch projects" }, 500);
  }
});

export default project;
