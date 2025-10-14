import { Hono } from "hono";
import { verifyWebhook } from "@clerk/backend/webhooks";

const clerk = new Hono();

clerk.post("/", async (c) => {
  try {
    const evt = await verifyWebhook(c.req.raw);

    // Access event data
    const { id } = evt.data;
    const eventType = evt.type;

    // Handle specific event types
    if (eventType === "user.created") {
      console.log("New user created:", id);
      // Handle user creation logic here
    }

    if (eventType === "user.deleted") {
      console.log("New user deleted:", id);
      // Handle user creation logic here
    }

    if (eventType === "user.updated") {
      console.log("New user updated:", id);
      // Handle user creation logic here
    }

    if (eventType === "organization.created") {
      console.log("New org created:", id);
      // Handle user creation logic here
    }

    if (eventType === "organization.updated") {
      console.log("New org updated:", id);
      // Handle user creation logic here
    }

    if (eventType === "organization.deleted") {
      console.log("New org deleted:", id);
      // Handle user creation logic here
    }

    if (eventType === "organization.deleted") {
      console.log("New org deleted:", id);
      // Handle user creation logic here
    }

    if (eventType === "organizationInvitation.created") {
      console.log("New org deleted:", id);
      // Handle user creation logic here
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
