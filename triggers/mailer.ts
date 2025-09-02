import { schedules, wait } from "@trigger.dev/sdk/v3";
import { Redis } from "@upstash/redis";
import { Resend } from "resend";
import PrexoWelcomeMail from "./lib/templates/welcome";
import CheckoutCreatedEmail from "./lib/templates/checkout.created";

type WebhookData = {
  id: string;
  type: string;
  email: string;
  payload: string;
};

type StreamMessage = [string, WebhookData[]];
type StreamResponse = [string, StreamMessage[]][];

const redis = Redis.fromEnv();
const resend = new Resend(process.env.RESEND_API_KEY);
const STREAM_KEY = "polar-webhooks-stream";
const GROUP = "workers";
const CONSUMER = "trigger-cron-consumer";

export const mailerConsumerJobs = schedules.task({
  id: "mailer-consumer",
  cron: "*/0.5 * * * * *", // every 30 seconds
  maxDuration: 300, // Stop executing after 300 secs (5 mins) of compute
  run: async (payload) => {
    const res = await redis.xreadgroup(GROUP, CONSUMER, [STREAM_KEY], [">"], {
      count: 50,
    });

    if (!res) return "No jobs found!";

    // Parse the response as StreamResponse
    const parsedRes = res as unknown as StreamResponse;

    const grouped: Record<string, { id: string; data: WebhookData }[]> = {};

    for (const [, messages] of parsedRes) {
      for (const [id, fields] of messages) {
        const webhookData = fields[0] as WebhookData;
        if (!webhookData?.email) {
          console.log("No email found for job:", id);
          await redis.xack(STREAM_KEY, GROUP, [id]);
          continue;
        }

        if (!grouped[webhookData.type]) {
          grouped[webhookData.type] = [];
        }
        grouped[webhookData.type].push({ id, data: webhookData });
      }
    }

    for (const [type, jobs] of Object.entries(grouped)) {
      console.log(`Processing group of type: ${type} with ${jobs.length} jobs`);
      // Create different email content based on webhook type
      let batchEmails;

      switch (type) {
        case "customer.created":
          batchEmails = jobs.map((job) => ({
            from: "Saidev from Prexo AI <onboarding@updates.prexoai.xyz>",
            to: [job.data.email],
            subject: "Welcome to Prexo AI! 🎉",
            react: PrexoWelcomeMail({
              userName: JSON.parse(job.data.payload).name,
            }),
          }));
          break;

        case "checkout.created":
          batchEmails = jobs.map((job) => ({
            from: "Prexo AI <sales@updates.prexoai.xyz>",
            to: [job.data.email],
            subject: "Your Checkout is Ready! 🛒",
            react: CheckoutCreatedEmail({
              userName: JSON.parse(job.data.payload).customerName,
              checkoutUrl: JSON.parse(job.data.payload).url,
              productId: JSON.parse(job.data.payload).productId,
              billingAddress: JSON.parse(job.data.payload)
                .customerBillingAddress,
            }),
          }));
          break;

        // case 'checkout.updated':
        //   batchEmails = jobs.map((job) => ({
        //     from: "Acme <onboarding@resend.dev>",
        //     to: [job.data.email],
        //     subject: "Your Checkout Has Been Updated! ✏️",
        //     html: `
        //       <h1>Checkout Updated</h1>
        //       <p>Hi there,</p>
        //       <p>Your checkout has been updated. Please review the changes.</p>
        //       <p>Best regards,<br>The Acme Team</p>
        //     `,
        //   }));
        //   break;

        // case 'subscription.created':
        //   batchEmails = jobs.map((job) => ({
        //     from: "Acme <onboarding@resend.dev>",
        //     to: [job.data.email],
        //     subject: "Subscription Activated! 🚀",
        //     html: `
        //       <h1>Subscription Activated!</h1>
        //       <p>Hi there,</p>
        //       <p>Congratulations! Your subscription has been activated successfully.</p>
        //       <p>You now have access to all premium features.</p>
        //       <p>Best regards,<br>The Acme Team</p>
        //     `,
        //   }));
        //   break;

        // case 'subscription.canceled':
        //   batchEmails = jobs.map((job) => ({
        //     from: "Acme <onboarding@resend.dev>",
        //     to: [job.data.email],
        //     subject: "Subscription Canceled 😔",
        //     html: `
        //       <h1>Subscription Canceled</h1>
        //       <p>Hi there,</p>
        //       <p>Your subscription has been canceled. We're sorry to see you go.</p>
        //       <p>You can reactivate anytime by visiting your dashboard.</p>
        //       <p>Best regards,<br>The Acme Team</p>
        //     `,
        //   }));
        //   break;

        // case 'subscription.revoked':
        //   batchEmails = jobs.map((job) => ({
        //     from: "Acme <onboarding@resend.dev>",
        //     to: [job.data.email],
        //     subject: "Subscription Revoked ⚠️",
        //     html: `
        //       <h1>Subscription Revoked</h1>
        //       <p>Hi there,</p>
        //       <p>Your subscription has been revoked due to policy violations.</p>
        //       <p>Please contact support if you have any questions.</p>
        //       <p>Best regards,<br>The Acme Team</p>
        //     `,
        //   }));
        //   break;

        // case 'order.created':
        //   batchEmails = jobs.map((job) => ({
        //     from: "Acme <onboarding@resend.dev>",
        //     to: [job.data.email],
        //     subject: "Order Confirmed! 📦",
        //     html: `
        //       <h1>Order Confirmed!</h1>
        //       <p>Hi there,</p>
        //       <p>Your order has been confirmed and is being processed.</p>
        //       <p>You'll receive tracking information soon.</p>
        //       <p>Best regards,<br>The Acme Team</p>
        //     `,
        //   }));
        //   break;

        default:
          console.log(
            `Unknown webhook type: ${type}, skipping email processing`,
          );
          // Skip processing for unknown types
          continue;
      }

      const { data, error } = await resend.batch.send(batchEmails, {
        idempotencyKey: `batch-${type}-${Date.now()}`,
      });
      if (error) {
        console.error("Batch send error:", error);
        continue;
      }

      console.log("Batch email sent successfully:", data, payload.timestamp);
      await wait.for({ seconds: 30 }); // simulate some processing time

      const ids = jobs.map((job) => job.id);
      await redis.xack(STREAM_KEY, GROUP, ids);
      console.log("Jobs processed and acknowledged:", ids);
    }

    return "All jobs processed!";
  },
});
