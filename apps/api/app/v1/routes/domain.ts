import { checkUser } from "@/middleware/check.user";
import { auth } from "@prexo/auth";
import { prisma } from "@prexo/db";
import { Hono } from "hono";
import { generateTelemetryKey } from "@prexo/crypt/utils";
import { auditLogs } from "@/middleware/audit.logs";

const domain = new Hono();

domain.use(auditLogs);

domain.post("/status", async (c) => {
  const { domain } = await c.req.json();
  if (!domain) {
    return c.json({ message: "Domain is required" }, 400);
  }
  // Extract host from the domain URL (e.g., "https://app.prexo.com" -> "app.prexo.com")
  let hostName: string;
  try {
    hostName = new URL(domain).host;
    if (hostName.startsWith("www.")) {
      hostName = hostName.slice(4);
    }
  } catch {
    hostName = domain;
  }

  try {
    const dom = await prisma.domain.findFirst({
      where: { name: hostName },
      select: { status: true },
    });
    if (!dom) {
      return c.json({ message: "Not found" }, 404);
    }

    return c.json({ status: dom.status }, 200);
  } catch (error) {
    console.error("Error fetching domain status:", error);
    return c.json({ message: "Failed to fetch domain status" }, 500);
  }
});

domain.use(checkUser);

domain.post("/create", async (c) => {
  const { name, alias, status, projectId } = await c.req.json();
  if (!name || !projectId) {
    return c.json({ message: "Name and ProjectId are required" }, 400);
  }
  // Check if the domain already exists
  const existingDomain = await prisma.domain.findFirst({
    where: {
      name: name,
    },
    select: { id: true },
  });
  if (existingDomain) {
    return c.json({ message: "Domain already exists", existingDomain }, 409);
  }
  console.log("No existing domain found, proceeding to create a new one");
  // Create the new domain
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session?.user?.id) {
    return c.json({ message: "Unauthorized" }, 401);
  }
  const userId = session.user.id;
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { userId: true },
  });
  if (!project) {
    return c.json({ message: "Project not found" }, 404);
  }
  if (project.userId !== userId) {
    return c.json({ message: "Forbidden" }, 403);
  }
  console.log("User is authorized to create a domain for this project");
  // Create the domain
  const telementry_key = await generateTelemetryKey(name);
  if (!telementry_key) {
    return c.json({ message: "Failed to generate telemetry key" }, 500);
  }
  console.log("Generated telemetry key:", telementry_key);

  const newDomain = await prisma.domain.create({
    data: {
      name: name,
      alias: alias,
      status: status || "Pending",
      projectId,
      telementry_key,
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
        tags: ["findMany_domains"],
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
