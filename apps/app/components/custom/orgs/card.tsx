import { BookIcon, CirclePlus, DraftingCompass } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Frame, FramePanel } from "@/components/ui/frame";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useId } from "react";
import { Textarea } from "@/components/ui/textarea";

interface OrgsCardProps {
  isEmptyCard?: boolean;
  name?: string;
  description?: string;
  isPaidPlan?: boolean;
  isOnProduction?: boolean;
  endpoint?: string;
}

export default function OrgsCard({
  isEmptyCard,
  name,
  description,
  isPaidPlan,
  isOnProduction,
  endpoint,
}: OrgsCardProps) {
  const id = useId();

  return isEmptyCard ? (
    <Frame className="flex border border-dashed bg-secondary h-[250px] w-[300px]">
      <Empty className="min-h-full min-w-full">
        <EmptyHeader>
          <EmptyTitle className="text-muted-foreground">
            0/5 Apps created
          </EmptyTitle>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex flex-col gap-2 h-full w-full">
          <Dialog>
          <DialogTrigger>
            <Button size="sm" className="w-full">
              <CirclePlus className="opacity-72" />
              Create app
            </Button>
            </DialogTrigger>
            <DialogPopup showCloseButton={false} className={"bg-secondary"}>
              <DialogHeader>
                <DialogTitle>Create new Application</DialogTitle>
                <DialogDescription>
                  Create a new application to get started with Prexo AI.
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
                  <Label htmlFor={id}>Slug</Label>
                  <Input
                    id={id}
                    type="text"
                    placeholder="sales-team"
                    aria-label="Slug"
                    className={"rounded-md"}
                  />
                </div>
                <div className="flex flex-col items-start gap-2">
                  <Label htmlFor={id}>Description</Label>
                  <Textarea
                    id={id}
                    placeholder="sales"
                    aria-label="Description"
                    className={"rounded-md"}
                  />
                </div>
              </div>
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
              View docs
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </Frame>
  ) : (
    <Frame className="flex border border-dashed bg-secondary w-[300px] gap-4 p-3">
      <FramePanel className="flex flex-col justify-between bg-card rounded-xl border h-[190px]">
        <div className="flex flex-row items-center justify-between">
          <DraftingCompass className="size-4" />

          <div className="text-sm text-secondary-foreground">
            {endpoint || "app.prexoai.xyz"}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-lg font-semibold">{name || "Prexo AI"}</div>
          <div className="text-sm text-muted-foreground">
            {description || "AI-powered assistant for your team."}
          </div>
        </div>
      </FramePanel>
      <div className="flex items-center justify-between">
        <Badge>{isOnProduction ? "Production" : "Development"}</Badge>
        <Badge>{isPaidPlan ? "Pro Plan" : "Free Plan"}</Badge>
      </div>
    </Frame>
  );
}
