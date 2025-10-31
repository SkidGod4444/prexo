import { Hono } from "hono";
import {
  validateEvent,
  WebhookVerificationError,
} from "@polar-sh/sdk/webhooks";
import { cache } from "@prexo/cache";

const mailer = new Hono();

mailer.post("/", async (c) => {
  try {
    const STREAM_KEY = "polar-webhooks-stream";
    // Get the raw body as text for webhook signature verification
    const rawBody = await c.req.raw.text();

    // Get headers from the request
    const headers = Object.fromEntries(c.req.raw.headers.entries());

    // Validate the webhook event using Polar SDK
    const event = validateEvent(
      rawBody,
      headers,
      process.env["POLAR_WEBHOOK_SECRET"] ?? "",
    );

    // Process the event here
    console.log("Webhook event received:", event);

    if (!event.data || !event.data.id) {
      throw new Error(
        "Error processing webhook event: Missing event data or ID",
      );
    }

    if (event.type === "customer.created") {
      console.log(
        `Received ${event.type} event, adding to polar webhook stream`,
      );
      await cache.xadd(STREAM_KEY, "*", {
        id: event.data.id,
        type: event.type,
        email: event.data.email,
        payload: JSON.stringify(event.data),
      });
      console.log(
        `Added ${event.type} event with email: ${event.data.email} to polar webhook stream`,
      );
      return c.text(
        `Added ${event.type} event with email: ${event.data.email} to polar webhook stream`,
        200,
      );
    }

    if (event.type === "checkout.created") {
      console.log(
        `Received ${event.type} event, adding to polar webhook stream`,
      );
      await cache.xadd(STREAM_KEY, "*", {
        id: event.data.id,
        type: event.type,
        email: event.data.customerEmail,
        payload: JSON.stringify(event.data),
      });
      console.log(
        `Added ${event.type} event with email: ${event.data.customerEmail} to polar webhook stream`,
      );
      return c.text(
        `Added ${event.type} event with email: ${event.data.customerEmail} to polar webhook stream`,
        200,
      );
    }

    if (event.type === "checkout.updated") {
      console.log(
        `Received ${event.type} event, adding to polar webhook stream`,
      );
      await cache.xadd(STREAM_KEY, "*", {
        id: event.data.id,
        type: event.type,
        email: event.data.customerEmail,
        payload: JSON.stringify(event.data),
      });
      console.log(
        `Added ${event.type} event with email: ${event.data.customerEmail} to polar webhook stream`,
      );
      return c.text(
        `Added ${event.type} event with email: ${event.data.customerEmail} to polar webhook stream`,
        200,
      );
    }

    if (event.type === "subscription.created") {
      console.log(
        `Received ${event.type} event, adding to polar webhook stream`,
      );
      await cache.xadd(STREAM_KEY, "*", {
        id: event.data.id,
        type: event.type,
        email: event.data.customer.email,
        payload: JSON.stringify(event.data),
      });
      console.log(
        `Added ${event.type} event with email: ${event.data.customer.email} to polar webhook stream`,
      );
      return c.text(
        `Added ${event.type} event with email: ${event.data.customer.email} to polar webhook stream`,
        200,
      );
    }

    if (event.type === "subscription.canceled") {
      console.log(
        `Received ${event.type} event, adding to polar webhook stream`,
      );
      await cache.xadd(STREAM_KEY, "*", {
        id: event.data.id,
        type: event.type,
        email: event.data.customer.email,
        payload: JSON.stringify(event.data),
      });
      console.log(
        `Added ${event.type} event with email: ${event.data.customer.email} to polar webhook stream`,
      );
      return c.text(
        `Added ${event.type} event with email: ${event.data.customer.email} to polar webhook stream`,
        200,
      );
    }

    if (event.type === "subscription.revoked") {
      console.log(
        `Received ${event.type} event, adding to polar webhook stream`,
      );
      await cache.xadd(STREAM_KEY, "*", {
        id: event.data.id,
        type: event.type,
        email: event.data.customer.email,
        payload: JSON.stringify(event.data),
      });
      console.log(
        `Added ${event.type} event with email: ${event.data.customer.email} to polar webhook stream`,
      );
      return c.text(
        `Added ${event.type} event with email: ${event.data.customer.email} to polar webhook stream`,
        200,
      );
    }

    if (event.type === "order.created") {
      console.log(
        `Received ${event.type} event, adding to polar webhook stream`,
      );
      await cache.xadd(STREAM_KEY, event.data.id, {
        id: event.data.id,
        type: event.type,
        email: event.data.customer.email,
        payload: JSON.stringify(event.data),
      });
      console.log(
        `Added ${event.type} event with email: ${event.data.customer.email} to polar webhook stream`,
      );
      return c.text(
        `Added ${event.type} event with email: ${event.data.customer.email} to polar webhook stream`,
        200,
      );
    }

    console.log(`Unhandled event type: ${event.type}, ignoring.`);

    // Return 202 Accepted status
    return c.text(
      `Polar webhook event received for: ${event.type}, ignoring for now!`,
      202,
    );
  } catch (error) {
    if (error instanceof WebhookVerificationError) {
      // Return 403 Forbidden for webhook verification errors
      return c.text(
        `Error: ${error.name}, Message: ${error.message}, Cause: ${error.cause}`,
        403,
      );
    }

    // Log other errors and re-throw them
    console.error("Webhook processing error:", error);
    throw error;
  }
});

export default mailer;
