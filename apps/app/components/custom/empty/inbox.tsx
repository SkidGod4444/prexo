"use client";
import { BookIcon, CirclePlus, InfoIcon, Mailbox } from "lucide-react";
import { useId } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function EmptyInbox() {
  const id = useId();
  return (
    <Empty className="border">
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
          {/* dialog */}
          <Dialog>
            <DialogTrigger>
              <Button size="sm">
                <CirclePlus className="opacity-72" />
                Create Inbox
              </Button>
            </DialogTrigger>
            <DialogPopup showCloseButton={false} className={"bg-secondary"}>
              <DialogHeader>
                <DialogTitle>Create Mail Inbox</DialogTitle>
                <DialogDescription>
                  Create an email inbox instantly to start receiving and
                  managing your emails.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="flex flex-col items-start gap-2">
                  <Label htmlFor={id}>Name</Label>
                  <Input
                    id={id}
                    type="text"
                    placeholder="Sales Team"
                    aria-label="Name"
                    className={"rounded-md"}
                  />
                </div>
                <div className="flex flex-col items-start gap-2">
                  <Label htmlFor={id}>Username</Label>
                  <Input
                    id={id}
                    type="text"
                    placeholder="sales"
                    aria-label="Username"
                    className={"rounded-md"}
                  />
                </div>
                <div className="flex flex-col items-start gap-2">
                  <Label htmlFor={id}>Domain</Label>
                  <Input
                    id={id}
                    type="text"
                    placeholder="example.com"
                    aria-label="Domain"
                    defaultValue={"agent.prexoai.xyz"}
                    readOnly
                    className={"rounded-md"}
                  />
                </div>
              </div>
              <Alert variant="info">
                <InfoIcon />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription className="text-xs">
                  Your inbox email will be [username]@agent.prexoai.xyz and your
                  name will be used as the display name. You can use your custom
                  domain only with Pro plan and above.
                </AlertDescription>
              </Alert>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>
                  Cancel
                </DialogClose>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogPopup>
          </Dialog>
          <Button variant="outline" size="sm">
            <BookIcon className="opacity-72" />
            View Docs
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
}
