import { schedules, wait } from "@trigger.dev/sdk/v3";
import { Redis } from "@upstash/redis";
import { Resend } from "resend";

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
const STREAM_KEY = "jobs";
const GROUP = "workers";
const CONSUMER = "trigger-cron-consumer";

export const firstScheduledTask = schedules.task({
  id: "mailer-consumer",
  cron: "*/5 * * * *", // every 5 minutes
  run: async (payload) => {
    const res = await redis.xreadgroup(GROUP, CONSUMER, [STREAM_KEY], [">"], {
      count: 5,
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

      const batchEmails = jobs.map((job) => ({
        from: "Acme <onboarding@resend.dev>",
        to: [job.data.email],
        subject: `Notification for type: ${type}`,
        html: `<p>${job.data.payload}</p>`,
      }));

      const { data, error } = await resend.batch.send(batchEmails);
      if (error) {
        console.error("Batch send error:", error);
        continue;
      }

      console.log("Batch email sent successfully:", data, payload.timestamp);

      const ids = jobs.map((job) => job.id);
      await redis.xack(STREAM_KEY, GROUP, ids);
      console.log("Jobs processed and acknowledged:", ids);
    }

    return "done";
  },
});
