"use client";
import { BookIcon, CirclePlus, InfoIcon, Loader, Mailbox } from "lucide-react";
import { useId, useState } from "react";
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
import { toastManager } from "@/components/ui/toast";
import { useMaintenance } from "@/contexts/maintenance.cntxt";
import { useAuthenticatedFetch } from "@/lib/fetch";
import { useReadLocalStorage } from "usehooks-ts";
import { useProjectsStore } from "@prexo/store";
import { useRouter } from "next/navigation";

export function EmptyInbox() {
  const id = useId();
  const router = useRouter();
  const { isEnabled: isMaintenanceModeEnabled } = useMaintenance();
  const { projects } = useProjectsStore();
  const selectedProjId = useReadLocalStorage<string>("@prexo-#selectedApp");
  const selectedProject = projects.find((proj) => proj.id === selectedProjId);
  const fetchWithAuth = useAuthenticatedFetch();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [domain, setDomain] = useState("agent.prexoai.xyz");

  const handleInboxCreation = async () => {
    setIsLoading(true);
    await toastManager
      .promise(
        (async () => {
          const payload = {
            name: name || "",
            userName: username || "",
            domain: domain || "",
            podId: selectedProject?.podId || "",
          };

          const res = await fetchWithAuth("/inbox/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            throw new Error("Failed to create inbox");
          }
          const data = await res.json();
          console.log("Inbox created:", data);
          return data.inbox.display_name || "Inbox created";
        })(),
        {
          loading: {
            title: "Creating inbox…",
            description: "Your inbox is being created.",
          },
          success: (data: string) => ({
            title: "Inbox Created!",
            description: `Success: ${data}`,
          }),
          error: (err: Error) => ({
            title: "Error!",
            description: err.message || "Please try again.",
          }),
        },
      )
      .finally(() => {
        console.log("Finished creating inbox");
        setIsLoading(false);
        setIsOpen(false);
        setDomain("");
        setName("");
        setUsername("");
        router.refresh();
      });
  };

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
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                    defaultValue={name}
                    onChange={(e) => setName(e.target.value)}
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
                    defaultValue={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="flex flex-col items-start gap-2">
                  <Label htmlFor={id}>Domain</Label>
                  <Input
                    id={id}
                    type="text"
                    placeholder="example.com"
                    aria-label="Domain"
                    defaultValue={domain}
                    readOnly
                    className={"rounded-md"}
                    onChange={(e) => setDomain(e.target.value)}
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
                {isLoading ? (
                  <Button type="button" disabled>
                    <Loader className="size-4 animate-spin" />
                    Creating...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    onClick={handleInboxCreation}
                    disabled={isMaintenanceModeEnabled}
                  >
                    Create Inbox
                  </Button>
                )}
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
