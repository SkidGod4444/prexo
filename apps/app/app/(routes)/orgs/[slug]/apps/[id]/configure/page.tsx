"use client";

import { Activity, BookOpen, Clock, Grid3x3, Info, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ConfigurePage() {
  const tabs = [
    { id: "endpoints", label: "Endpoints", icon: BookOpen },
    { id: "catalog", label: "Event Catalog", icon: Grid3x3 },
    { id: "logs", label: "Logs", icon: Clock },
    { id: "activity", label: "Activity", icon: Activity },
  ];

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-background">
        <div className="px-6 py-6">
          <h1 className="text-3xl font-bold">User & Authentication</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure user authentication and webhook endpoints
          </p>
        </div>

        {/* Info Banner */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-muted/50 p-4">
            <div className="flex items-center gap-3">
              <Info size={20} className="flex-shrink-0 text-primary" />
              <p className="text-sm">
                Learn how to use Webhooks with Clerk by reading our{" "}
                <Link href="#" className="text-primary hover:underline">
                  webhook documentation
                </Link>
                .
              </p>
            </div>
            <Button size="sm" asChild>
              <Link href="#">Learn more</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        defaultValue="endpoints"
        className="flex h-full flex-col overflow-hidden"
      >
        <div className="border-b border-border bg-background px-6">
          <TabsList className="h-auto bg-transparent p-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  <Icon size={16} />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-background">
          <TabsContent value="endpoints" className="m-0 h-full p-6">
            {/* Section Header */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Endpoints</h2>
              <Button size="sm">
                <Plus size={16} />
                Add Endpoint
              </Button>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-lg border border-border">
              {/* Table Header */}
              <div className="grid grid-cols-2 border-b border-border bg-muted">
                <div className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Endpoint
                </div>
                <div className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Error Rate
                </div>
              </div>

              {/* Empty State */}
              <div className="bg-background px-6 py-16 text-center">
                <h3 className="mb-2 text-lg font-semibold">
                  Set up an endpoint to get started
                </h3>
                <p className="text-sm text-muted-foreground">
                  For a list of events you can subscribe to, take a look at the{" "}
                  <Link href="#" className="text-primary hover:underline">
                    Event Catalog
                  </Link>
                  .
                </p>
              </div>

              {/* Footer */}
              <div className="border-t border-border bg-muted px-6 py-3">
                <p className="text-xs text-muted-foreground">Showing 0 items</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="catalog" className="m-0 h-full p-6">
            <h2 className="text-xl font-semibold">Event Catalog</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Browse available webhook events
            </p>
          </TabsContent>

          <TabsContent value="logs" className="m-0 h-full p-6">
            <h2 className="text-xl font-semibold">Logs</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              View webhook delivery logs
            </p>
          </TabsContent>

          <TabsContent value="activity" className="m-0 h-full p-6">
            <h2 className="text-xl font-semibold">Activity</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Monitor webhook activity
            </p>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
