import { use } from "react";
import ChatWindow from "@/components/custom/chats/chat.window";

export default function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  use(params);
  return (
    <div className="flex h-full w-full overflow-hidden items-center justify-center">
      <div className="w-full max-w-4xl max-h-[70vh]">
        <ChatWindow />
      </div>
    </div>
  );
}
