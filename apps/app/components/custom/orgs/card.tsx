import { BookIcon, CirclePlus, DraftingCompass } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Frame, FramePanel } from "@/components/ui/frame";

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
            <Button size="sm">
              <CirclePlus className="opacity-72" />
              Create app
            </Button>
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
