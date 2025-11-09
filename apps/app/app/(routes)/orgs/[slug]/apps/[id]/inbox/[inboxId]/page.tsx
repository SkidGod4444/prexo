import { use } from "react";
import { InboxesTable } from "@/components/custom/inboxes/table";

export default function InboxPage({
  params,
}: {
  params: Promise<{ inboxId: string }>;
}) {
  const { inboxId } = use(params);
  console.log("Inbox ID:", inboxId);
  return <InboxesTable />;
}
