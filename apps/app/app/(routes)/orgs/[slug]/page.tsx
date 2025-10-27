"use client";
import OrgsCard from "@/components/custom/orgs/card";
import { useMaintenance } from "@/contexts/maintenance.cntxt";
import React from "react";

export default function Orgs() {
  const {isEnabled} = useMaintenance();
  return (
    <div className="flex flex-col px-4 md:px-16">
      <div className="w-full max-w-8xl mx-auto flex flex-col items-start">
        <h1 className="text-3xl font-bold mb-2">Applications</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Manage your apps or create a new one.
        </p>
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            <OrgsCard />
            <OrgsCard />
            <OrgsCard />
            <OrgsCard />
            <OrgsCard />
            <OrgsCard />
            <OrgsCard />
            <OrgsCard />
          </div>
        </div>
      </div>
    </div>
  );
}
