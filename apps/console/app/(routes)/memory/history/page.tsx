"use client";
import InfobarBreadCrumb from "@/components/custom/infobar/bread.crumb";
import { HistoryViewer } from "@/components/custom/memory/history.viewer";
import React from "react";

export default function MemoryHistory() {
  return (
    <div className="flex flex-col overflow-hidden">
      <InfobarBreadCrumb />
      <HistoryViewer />
    </div>
  );
}
