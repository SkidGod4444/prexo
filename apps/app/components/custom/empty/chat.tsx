import { MessageCircleWarning } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function EmptyChat() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon" className="bg-secondary border">
          <MessageCircleWarning />
        </EmptyMedia>
        <EmptyTitle>No Chat Selected</EmptyTitle>
        <EmptyDescription>
          Please choose a chat from the left side bar to view messages here.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent />
    </Empty>
  );
}
