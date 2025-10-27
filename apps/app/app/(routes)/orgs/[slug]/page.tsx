"use client";
import OrgsCard from "@/components/custom/orgs/card";
import { useMaintenance } from "@/contexts/maintenance.cntxt";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Orgs() {
  const { isEnabled } = useMaintenance();
  const pathname = usePathname();
  // Example data array for 4 org cards
  const orgs = [
    {
      id: 1,
      name: "App A",
      description: "First organization app for demonstration purposes.",
      isPaidPlan: true,
      isOnProduction: false,
      endpoint: "https://api.appa.example.com"
    },
    {
      id: 2,
      name: "App B",
      description: "Second app with premium subscription active.",
      isPaidPlan: true,
      isOnProduction: true,
      endpoint: "https://api.appb.example.com"
    },
    {
      id: 3,
      name: "App C",
      description: "Third app, still in development.",
      isPaidPlan: false,
      isOnProduction: false,
      endpoint: "https://dev.appc.example.com"
    }
  ]; // Only 3 actual orgs, so we get total 4 cards

  return (
    <div className="flex flex-col px-4 md:px-16">
      <div className="w-full max-w-8xl mx-auto flex flex-col items-start">
        <h1 className="text-3xl font-bold mb-2">Applications</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Manage your apps or create a new one.
        </p>
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
            {/* Empty card as the first card */}
            <OrgsCard isEmptyCard={true} />
            {/* Map actual org cards */}
            {orgs.map((org) => (
              <Link key={org.id} href={`${pathname}/apps/${org.id}`} className="flex">
              <OrgsCard name={org.name} isOnProduction={org.isOnProduction} isPaidPlan={org.isPaidPlan} description={org.description} endpoint={org.endpoint} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
