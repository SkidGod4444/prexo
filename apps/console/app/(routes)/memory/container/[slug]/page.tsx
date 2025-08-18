import CtxFileUploader from "@/components/custom/memory/ctx.files.up";
import InfobarBreadCrumb from "@/components/custom/infobar/bread.crumb";
import { RainbowButton } from "@/components/custom/rainbow-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import React from "react";
import CtxWebpagesCard from "@/components/custom/memory/ctx.webp.card";

export default function MemoryPage() {
  return (
    <div className="flex flex-col overflow-hidden mb-20">
      <InfobarBreadCrumb />
      <div className="flex flex-col gap-5">
      <Card className="p-2 gap-5">
        <div className="flex items-center justify-between">
        <Badge >
          Links as context
        </Badge>

        <RainbowButton variant="outline" className="rounded-2xl">
          Sync context
          </RainbowButton>
        </div>
      <CtxWebpagesCard />
      </Card>

      <Card className="p-2 gap-5">
      <div className="flex items-center justify-between">
        <Badge >
          Files as context
        </Badge>

        <RainbowButton variant="outline" className="rounded-2xl">
          Sync context
          </RainbowButton>
        </div>
      <CtxFileUploader />
      </Card>
      </div>
    </div>
  );
}
