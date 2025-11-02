"use client";

import { useProjectsStore } from "@prexo/store";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPopup,
  DialogTitle,
} from "@/components/ui/dialog";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { projects } = useProjectsStore();

  if (!projects.find((proj) => proj.slug === id)) {
    return (
      <Dialog open={true}>
        <DialogPopup>
          <DialogHeader>
            <DialogTitle>Application not found!</DialogTitle>
            <DialogDescription>
              The application with the slug "
              <u className="text-primary-foreground font-semibold">{id}</u>"
              does not exist or has been removed. Please check the slug and try
              again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose
              render={
                <Button
                  onClick={() => {
                    router.push("/");
                  }}
                />
              }
            >
              Go back to Applications
            </DialogClose>
          </DialogFooter>
        </DialogPopup>
      </Dialog>
    );
  }

  return <div>hey</div>;
}
