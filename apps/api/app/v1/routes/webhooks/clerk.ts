import { Hono } from "hono";
import { verifyWebhook } from "@clerk/backend/webhooks";
import { cache } from "@prexo/cache";
import { prisma } from "@prexo/db";
import { logTelegram } from "@/lib/logger";

const clerk = new Hono();

const STREAM_KEY = "email-stream";

clerk.post("/", async (c) => {
  try {
    const evt = await verifyWebhook(c.req.raw);

    // Access event data
    const { id } = evt.data;
    const eventType = evt.type;

    // Handle specific event types
    if (eventType === "user.created") {
      console.log("Received new user created event:", id);

      const user = await prisma.user.create({
        data: {
          id: id || "",
          name: evt.data.first_name + " " + evt.data.last_name,
          email: evt.data.email_addresses[0]?.email_address,
          emailVerified:
            evt.data.email_addresses[0]?.verification?.status === "verified",
          image: evt.data.image_url || "",
          createdAt: new Date(evt.data.created_at * 1000),
          updatedAt: new Date(evt.data.updated_at * 1000),
          role: "user",
          banned: evt.data.banned || false,
        },
      });

      console.log("New user created in DB:", user);

      await cache.xadd(STREAM_KEY, `user-${id}`, {
        id,
        type: eventType,
        email: evt.data.email_addresses[0]?.email_address || "",
        payload: JSON.stringify(evt.data),
      });

      console.log("User creation event added to cache stream:", STREAM_KEY);

      await logTelegram({
        logTitle: "Clerk Webhook - User Created",
        logSummary: `A new user has been created with ID: ${id} & Email: ${evt.data.email_addresses[0]?.email_address}`,
        logType: "webhook",
        severity: "low",
        stackTrace: `Created User Email: ${evt.data.email_addresses[0]?.email_address}`,
        environment: process.env.NODE_ENV || "development",
      });
    }

    if (eventType === "user.deleted") {
      console.log("New user deleted:", id);
      // Handle user creation logic here
      await logTelegram({
        logTitle: "Clerk Webhook - User Deleted",
        logSummary: `A user has been deleted with ID: ${id}`,
        logType: "webhook",
        severity: "medium",
        stackTrace: `Deleted User Id: ${evt.data.id}`,
        environment: process.env.NODE_ENV || "development",
      });
    }

    if (eventType === "organization.created") {
      console.log("New org created:", id);
      // Handle user creation logic here
      await logTelegram({
        logTitle: "Clerk Webhook - Organization Created",
        logSummary: `A new organization has been created with ID: ${id}`,
        logType: "webhook",
        severity: "low",
        stackTrace: `Organization Slug: ${evt.data.slug}`,
        environment: process.env.NODE_ENV || "development",
      });
    }

    if (eventType === "organization.updated") {
      console.log("New org updated:", id);
      // Handle user creation logic here
    }

    if (eventType === "organization.deleted") {
      console.log("New org deleted:", id);
      // Handle user creation logic here
      await logTelegram({
        logTitle: "Clerk Webhook - Organization Deleted",
        logSummary: `An organization has been deleted with ID: ${evt.data.id}`,
        logType: "webhook",
        severity: "medium",
        stackTrace: `Organization Slug: ${evt.data.slug}`,
        environment: process.env.NODE_ENV || "development",
      });
    }

    if (eventType === "organizationInvitation.created") {
      console.log("New org deleted:", id);
      // Handle user creation logic here
      await logTelegram({
        logTitle: "Clerk Webhook - Organization Invitation Created",
        logSummary: `A new organization invitation has been created with ID: ${evt.data.organization_id}`,
        logType: "webhook",
        severity: "low",
        stackTrace: `Invited Email: ${evt.data.email_address}`,
        environment: process.env.NODE_ENV || "development",
      });
    }

    if (eventType === "organizationInvitation.accepted") {
      console.log("New org deleted:", id);
      // Handle user creation logic here
    }

    if (eventType === "organizationMembership.created") {
      console.log("New org deleted:", id);
      // Handle user creation logic here
    }

    if (eventType === "organizationMembership.deleted") {
      console.log("New org deleted:", id);
      // Handle user creation logic here
    }

    return c.text("Success", 200);
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return c.text("Webhook verification failed", 400);
  }
});

export default clerk;
