import { Hono } from "hono";
import { cache } from "@prexo/cache";
import { prisma } from "@prexo/db";
import { checkTelementry } from "@/middleware/check.telemetry";

type Variables = {
  "x-ingest-key": string;
};

const telementryEvents = new Hono<{ Variables: Variables }>();

telementryEvents.post("/key", async (c) => {
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

  // Check if the domain exists
  const data = await prisma.domain.findFirst({
    where: { name: hostName },
    select: { telementry_key: true, id: true, status: true },
  });

  if (!data) {
    return c.json({ message: "Domain not found" }, 404);
  }

  if (data.status !== "Valid" && data.status === "Pending") {
    console.log("Domain is not active, updating status to Active:", hostName);
    await prisma.domain.update({
      where: { id: data.id },
      data: { status: "Valid" },
    });
    data.status = "Valid";
  }
  console.log("Found telemetry key for domain:", hostName);
  // Return the telemetry key
  return c.json(
    { key: data.telementry_key, id: data.id, status: data.status },
    200,
  );
});

telementryEvents.use(checkTelementry);

telementryEvents.post("/", async (c) => {
  const body = await c.req.json();
  const telementry_key =
    c.req.header("x-ingest-key") || c.req.header("x-telemetry-key");

  console.log("Ingest ID: ", telementry_key);
  if (!body || typeof body !== "object") {
    return c.json({ message: "Invalid request body" }, 400);
  }
  if (!body.event) {
    return c.json({ message: "Event field is required" }, 400);
  }
  if (!body.properties || typeof body.properties !== "object") {
    return c.json({ message: "Properties field must be an object" }, 400);
  }
  if (!telementry_key) {
    return c.json({ message: "Ingestion key is required" }, 400);
  }

  await cache.rpush(
    "telementry_events",
    JSON.stringify({
      telementry_key,
      ...body,
      receivedAt: new Date().toISOString(),
    }),
  );

  return c.json({ status: "success" }, 200);
});

telementryEvents.post("/flush", async (c) => {
  const events: string[] = [];
  let event: string | null | undefined;

  // Pop all events from the cache until empty
  while (
    (event = await cache.lpop("telementry_events")) !== undefined &&
    event !== null
  ) {
    events.push(event);
  }

  if (events.length === 0) {
    return c.json({ status: "No telementry events found!" });
  }

  const parsedEvents = events
    .map((e) => {
      try {
        const obj = JSON.parse(e);
        return {
          key: obj.telementry_key, // map Redis key → schema key
          event: obj.event ?? "unknown", // ensure required field
          properties: obj.properties ?? {},
          timestamp: obj.receivedAt ? new Date(obj.receivedAt) : new Date(),
        };
      } catch {
        return null;
      }
    })
    .filter((e) => e !== null);

  const result = await prisma.telementry.createMany({
    data: parsedEvents,
  });

  return c.json({ message: "Flushed Successfully!", count: result.count });
});

export default telementryEvents;
