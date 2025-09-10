"use client";
import CtxFileUploader from "@/components/custom/memory/ctx.files.up";
import InfobarBreadCrumb from "@/components/custom/infobar/bread.crumb";
// import { RainbowButton } from "@/components/custom/rainbow-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import React, { use, useEffect, useState } from "react";
import CtxWebpagesCard from "@/components/custom/memory/ctx.webp.card";
import { InfoIcon } from "lucide-react";
import { useLocalStorage } from "usehooks-ts";
import { useContainersStore } from "@prexo/store";

export default function MemoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params);
  const { containers } = useContainersStore();
  console.log("MemoryPage slug:", slug);
  const container = containers.find((c) => c.key === slug);
  const [containerId, setContainerId] = useLocalStorage("@prexo-#containerId", "");

  useEffect(() => {
    if (container?.id && containerId !== container.id) {
      console.log("Updating containerId from", containerId, "to", container.id);
      setContainerId(container.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [container?.id, setContainerId]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isProcessing, setIsProcessing] = useState(false);
  return (
    <div className="flex flex-col overflow-hidden mb-10">
      <InfobarBreadCrumb />
      <div className="flex flex-col gap-5">
        
      {isProcessing && <div className="rounded-md border border-blue-500/50 px-4 py-3 text-blue-600">
      <p className="text-sm">
        <InfoIcon
          className="me-3 -mt-0.5 inline-flex opacity-60"
          size={16}
          aria-hidden="true"
        />
        Links may take up to 30 seconds to appear in the context, while files can also take a bit longer to process.
      </p>
    </div>}

        <Card className="p-2 gap-2">
          <div className="flex items-center justify-between">
            <Badge>Links as context</Badge>
{/* 
            <RainbowButton variant="outline" className="rounded-2xl">
              Sync context
            </RainbowButton> */}
          </div>
          <CtxWebpagesCard/>
        </Card>

        <Card className="p-2 gap-2">
          <div className="flex items-center justify-between">
            <Badge>Files as context</Badge>
{/* 
            <RainbowButton variant="outline" className="rounded-2xl">
              Sync context
            </RainbowButton> */}
          </div>
          <CtxFileUploader />
        </Card>
      </div>
    </div>
  );
}
