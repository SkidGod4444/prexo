"use client";
import ActivityLogsTable from "@/components/custom/activity.logs.table";
import { ApiCallsChart } from "@/components/custom/charts/apicalls.chart";
import { CreditsUsageChart } from "@/components/custom/charts/credits.chart";
import InfobarBreadCrumb from "@/components/custom/infobar/bread.crumb";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import React from "react";

export default function Dashboard() {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col overflow-hidden h-full w-full">
      <InfobarBreadCrumb />
      <div className="flex flex-col w-full border rounded-2xl md:flex-row md:items-start md:justify-between">
        <div className="flex-1 w-full">
          <ApiCallsChart />
        </div>
        <Separator orientation={isMobile ? "horizontal" : "vertical"} />
        <div className="flex-1 w-full">
          <CreditsUsageChart />
        </div>
      </div>
      <ActivityLogsTable />
    </div>
  );
}
