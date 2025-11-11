"use client";

import { useOrganizationStore, useProjectsStore } from "@prexo/store";
import { useRouter } from "next/navigation";
import { use, useEffect, useMemo } from "react";
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
  const { orgs } = useOrganizationStore();
  const [_, setSelectedApp, removeSelectedApp] = useLocalStorage(
    "@prexo-#selectedApp",
    "",
  );
  const [selectedOrgSlug] = useLocalStorage("@prexo-#selectedOrgSlug", "");

  const selectedOrg = useMemo(() => {
    {
      return orgs.find((o) => o.slug === selectedOrgSlug);
    }
  }, [orgs, selectedOrgSlug]);

  const appsOfSelectedOrg = useMemo(() => {
    if (!selectedOrg) return [];
    return projects.filter((p) => p.orgId === selectedOrg.id);
  }, [projects, selectedOrg]);

  if (!appsOfSelectedOrg.find((proj) => proj.slug === id)) {
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
    const matchedProj = appsOfSelectedOrg.find((proj) => proj.slug === id);
    if (matchedProj) {
      setSelectedApp(matchedProj.id);
    } else {
      removeSelectedApp();
    }
  }, [id, setSelectedApp, removeSelectedApp, projects]);

  return <div>hey</div>;
}
