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

      const email = evt.data.email_addresses[0]?.email_address || "";
      const name =
        `${evt.data.first_name || ""} ${evt.data.last_name || ""}`.trim();
      const emailVerified =
        evt.data.email_addresses[0]?.verification?.status === "verified";
      const image = evt.data.image_url || "";
      const banned = evt.data.banned || false;

      let user = null;

      // Ensure DB user.id === Clerk user id. Handle duplicates on unique email.
      const existingById = await prisma.user.findUnique({ where: { id } });
      if (existingById) {
        user = await prisma.user.update({
          where: { id },
          data: {
            name,
            email,
            emailVerified,
            image,
            updatedAt: new Date(),
            banned,
          },
        });
      } else {
        const existingByEmail = await prisma.user.findUnique({
          where: { email },
        });
        if (existingByEmail && existingByEmail.id !== id) {
          // Migrate related records to new Clerk id, then update the user id

          user = await prisma.user.update({
            where: { id: existingByEmail.id },
            data: {
              id,
              name,
              email,
              emailVerified,
              image,
              updatedAt: new Date(),
              banned,
            },
          });
        } else if (existingByEmail && existingByEmail.id === id) {
          user = await prisma.user.update({
            where: { id },
            data: {
              name,
              email,
              emailVerified,
              image,
              updatedAt: new Date(),
              banned,
            },
          });
        } else {
          user = await prisma.user.create({
            data: {
              id: id || "",
              name,
              email,
              emailVerified,
              image,
              createdAt: new Date(),
              updatedAt: new Date(),
              role: "user",
              banned,
            },
          });
        }
      }

      console.log("User upserted in DB:", user);

      await cache.xadd(STREAM_KEY, "*", {
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
      if (!evt.data.created_by) {
        throw new Error(
          "Organization created event missing created_by user id",
        );
      }
      const org = await prisma.organization.create({
        data: {
          id: evt.data.id,
          name: evt.data.name,
          slug: evt.data.slug,
          imgUrl: evt.data.image_url,
          status: "ACTIVE",
          membersCount: evt.data.members_count,
          maxAllowedMembers: evt.data.max_allowed_memberships,
          user: {
            connect: { id: evt.data.created_by },
          },
        },
      });
      console.log("Organization created in DB:", org);
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
      const org = await prisma.organization.updateMany({
        where: { id: evt.data.id },
        data: {
          name: evt.data.name,
          slug: evt.data.slug,
          imgUrl: evt.data.image_url,
          membersCount: evt.data.members_count,
          maxAllowedMembers: evt.data.max_allowed_memberships,
          updatedAt: new Date(),
        },
      });
    }

    if (eventType === "organization.deleted") {
      console.log("New org deleted:", id);
      // Handle user creation logic here
      const org = await prisma.organization.updateMany({
        where: { id: evt.data.id },
        data: { status: "DELETED", deletedAt: new Date() },
      });
      console.log("Organization marked as deleted in DB:", org);
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
