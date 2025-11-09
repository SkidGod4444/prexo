import { AgentMailClient } from "agentmail";

export const MailClient = new AgentMailClient({
  apiKey: process.env.AGENTMAIL_API_KEY || "",
});
