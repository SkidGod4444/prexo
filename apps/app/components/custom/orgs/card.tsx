"use client";
import { BookIcon, CirclePlus, DraftingCompass, Loader } from "lucide-react";
import { useId, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { toastManager } from "@/components/ui/toast";
import { constants } from "@/lib/constants";
import { useAuth } from "@clerk/nextjs";

interface OrgsCardProps {
  isEmptyCard?: boolean;
  name?: string;
  description?: string;
  isFreeTier?: boolean;
  isOnProduction?: boolean;
  endpoint?: string;
}

export default function OrgsCard({
  isEmptyCard,
  name,
  description,
  isFreeTier,
  isOnProduction,
  endpoint,
}: OrgsCardProps) {
  const id = useId();
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [projName, setProjName] = useState("");
  const [projSlug, setProjSlug] = useState("");
  const [projDesc, setProjDesc] = useState("");

  const handleSubmit = async () => {
    setIsLoading(true);
    await toastManager
      .promise(
        (async () => {
          const payload = {
            name: projName || "",
            userId: auth.userId || "",
            slug: projSlug || "",
            description: projDesc || "",
          };

          const res = await fetch(`${constants.apiEndpoint}/project/create`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            throw new Error("Failed to create project");
          }
          const data = await res.json();
          return data.project?.name || "Project created";
        })(),
        {
          loading: {
            title: "Creating project…",
            description: "Your project is being created.",
          },
          success: (data: string) => ({
            title: "Project Created!",
            description: `Success: ${data}`,
          }),
          error: (err: Error) => ({
            title: "Error!",
            description: err.message || "Please try again.",
          }),
        },
      )
      .finally(() => {
        setIsLoading(false);
      });
  };

  return isEmptyCard ? (
    <Frame className="flex border border-dashed bg-secondary h-[250px] w-[300px]">
      <Empty className="min-h-full min-w-full">
        <EmptyHeader>
          <EmptyTitle className="text-muted-foreground">
            0/2 Apps created
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
                      onValueChange={(value) => setProjName(value)}
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
                      onValueChange={(value) => setProjSlug(value)}
                    />
                  </div>
                  <div className="flex flex-col items-start gap-2">
                    <Label htmlFor={id}>Description</Label>
                    <Textarea
                      id={id}
                      placeholder="sales"
                      aria-label="Description"
                      className={"rounded-md"}
                      onChange={(e) => setProjDesc(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline" />}>
                    Cancel
                  </DialogClose>
                  {isLoading ? (
                    <Button type="button" disabled>
                      <Loader className="size-4 animate-spin" />
                      Creating...
                    </Button>
                  ) : (
                    <Button type="submit" onClick={handleSubmit}>
                      Create Application
                    </Button>
                  )}
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
        <Badge>{isFreeTier ? "Pro Plan" : "Free Plan"}</Badge>
      </div>
    </Frame>
  );
}
