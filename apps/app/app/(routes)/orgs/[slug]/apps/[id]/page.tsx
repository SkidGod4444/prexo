"use client";

import { useProjectsStore } from "@prexo/store";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPopup,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocalStorage } from "usehooks-ts";

export default function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { projects } = useProjectsStore();
  const [_, setSelectedApp, removeSelectedApp] = useLocalStorage(
    "@prexo-#selectedApp",
    "",
  );

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

  useEffect(() => {
    const matchedProj = projects.find((proj) => proj.slug === id);
    if (matchedProj) {
      setSelectedApp(matchedProj.id);
    } else {
      removeSelectedApp();
    }
  }, [id, setSelectedApp, removeSelectedApp, projects]);

  return <div>hey</div>;
}
