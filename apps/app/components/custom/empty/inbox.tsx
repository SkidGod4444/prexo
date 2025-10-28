import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { CirclePlus, BookIcon, Mailbox } from "lucide-react";

export function EmptyInbox() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon" className="bg-secondary border">
          <Mailbox />
        </EmptyMedia>
        <EmptyTitle>No inboxes found</EmptyTitle>
        <EmptyDescription>
          You haven't created any inboxes yet. Create an inbox to start
          receiving and managing mails.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button size="sm">
            <CirclePlus className="opacity-72" />
            Create Inbox
          </Button>
          <Button variant="outline" size="sm">
            <BookIcon className="opacity-72" />
            View Docs
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
}
