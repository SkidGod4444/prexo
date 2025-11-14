import { use } from "react";
import ChatWindow from "@/components/custom/chats/chat.window";

export default function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  use(params);
  return <ChatWindow />;
}
