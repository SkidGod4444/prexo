"use server";

import { DiscordEmbedBuilder, GetLogs } from "getlogs-sdk";
const webhookUrl = process.env.LOGS_WEBHOOK_URL!;
if (!webhookUrl) {
  throw new Error("LOGS_WEBHOOK_URL environment variable is not set.");
}

const logger = new GetLogs({
  provider: "discord",
  discord: {
    webhookUrl: webhookUrl,
  },
});

type fTypes = {
  content: string;
  color: string;
  userId: string;
  userName: string;
  emo: string;
};
async function feedbacksLogger({
  content,
  color,
  userId,
  userName,
  emo,
}: fTypes) {
  const embed = new DiscordEmbedBuilder()
    .setTitle("📝 New User Feedback")
    .setDescription(
      [
        `**User:** ${userName} (\`${userId}\`)`,
        `**Emotion:** ${emo}`,
        "",
        `**Feedback:**`,
        `> ${content.replace(/\n/g, "\n> ")}`,
      ].join("\n"),
    )
    .setColor(color);
  logger.log({ embed: embed, content: "<@&1403569727351164958>" });
  return true;
}

export { feedbacksLogger };
