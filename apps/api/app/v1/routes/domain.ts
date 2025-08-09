import { checkUser } from "@/checks/check.user";
import { prisma } from "@prexo/db";
import { Hono } from "hono";

const domain = new Hono();

domain.use(checkUser);

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
    });
    return c.json({ domains }, 200);
  } catch (error) {
    console.error("Error fetching domains:", error);
    return c.json({ message: "Failed to fetch domains" }, 500);
  }
});

export default domain;
