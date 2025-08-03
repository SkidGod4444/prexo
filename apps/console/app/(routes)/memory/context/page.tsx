import CtxFileUploader from "@/components/ctx.files.up";
import InfobarBreadCrumb from "@/components/custom/infobar/bread.crumb";
import React from "react";

export default function Context() {
  return (
    <div className="flex flex-col overflow-hidden">
      <InfobarBreadCrumb />
      <CtxFileUploader />
    </div>
  );
}
