import { MailClient } from "@/lib/agentmail";
import { checkUser } from "@/middleware/check.user";
import { Hono } from "hono";

const inbox = new Hono();
inbox.use(checkUser);

inbox.get("/list", async (c) => {
  const podId = c.req.query("pod_id");
  if (!podId) {
    return c.json({ message: "pod_id is required" }, 400);
  }

  try {
    const inboxes = await MailClient.pods.inboxes.list(podId, {});
    return c.json({ inboxes });
  } catch (error) {
    return c.json(
      { message: "Failed to fetch inboxes", error: String(error) },
      500,
    );
  }
});

inbox.post("/create", async (c) => {
  const { podId, username, domain, displayName } = await c.req.json();
  if (!podId || !username || !domain) {
    return c.json({ message: "podId, username & domain are required!" }, 400);
  }

  try {
    const inbox = await MailClient.pods.inboxes.create(podId, {
      username,
      domain,
      displayName,
    });
    return c.json({ inbox });
  } catch (error) {
    return c.json(
      { message: "Failed to create inbox", error: String(error) },
      500,
    );
  }
});

inbox.delete("/delete", async (c) => {
  const { podId, inboxId } = await c.req.json();
  if (!podId || !inboxId) {
    return c.json({ message: "podId & inboxId are required!" }, 400);
  }

  try {
    await MailClient.pods.inboxes.delete(podId, inboxId);
    return c.json({ message: "Inbox deleted successfully" });
  } catch (error) {
    return c.json(
      { message: "Failed to delete inbox", error: String(error) },
      500,
    );
  }
});

export default inbox;
