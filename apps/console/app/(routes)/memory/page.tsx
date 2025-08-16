import InfobarBreadCrumb from "@/components/custom/infobar/bread.crumb";
import ContainersTable from "@/components/custom/memory/containers.table";
import React from "react";

export default function MemoryPage() {
  return (
    <div className="flex flex-col overflow-hidden">
      <InfobarBreadCrumb />
      <ContainersTable />
    </div>
  );
}
