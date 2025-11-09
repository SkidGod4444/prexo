import { use } from "react";

export default function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = use(params);
  return <div>{`Inbox Page - Inbox ID: ${chatId}`}</div>;
}
