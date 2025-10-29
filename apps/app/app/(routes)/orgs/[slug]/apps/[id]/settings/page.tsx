"use client";

import {
  Activity,
  AlertCircle,
  BookOpen,
  Clock,
  Grid3x3,
  Info,
  Key,
  Lock,
  Settings,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("endpoints");

  const sidebarSections = [
    {
      title: "User & authentication",
      items: [
        { icon: BookOpen, label: "User & authentication" },
        { icon: Lock, label: "SSO connections" },
        { icon: Zap, label: "Web3" },
        { icon: Key, label: "Multi-factor" },
        { icon: Shield, label: "Restrictions" },
        { icon: AlertCircle, label: "Attack protection" },
      ],
    },
    {
      title: "Session management",
      items: [
        { icon: Clock, label: "Sessions" },
        { icon: Settings, label: "JWT templates" },
      ],
    },
    {
      title: "Compliance",
      items: [{ icon: Users, label: "Legal" }],
    },
    {
      title: "Feature management",
      items: [{ icon: Grid3x3, label: "Features" }],
    },
    {
      title: "Organization management",
      items: [],
    },
  ];

  const tabs = [
    { id: "endpoints", label: "Endpoints", icon: BookOpen },
    { id: "catalog", label: "Event Catalog", icon: Grid3x3 },
    { id: "logs", label: "Logs", icon: Clock },
    { id: "activity", label: "Activity", icon: Activity },
  ];

  return (
    <div className="flex h-full w-full">
      {/* Left Sidebar */}
      <aside className="w-64 mr-5">
        <div className="p-1">
          {sidebarSections.map((section) => (
            <div key={section.title} className="mb-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {section.title}
              </h3>
              <nav className="border-b pb-4">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  // For demonstration, highlight first button of first section.
                  const isActive =
                    section.title === "User & authentication" &&
                    item.label === "User & authentication";
                  return (
                    <Button
                      key={item.label}
                      variant={isActive ? "default" : "ghost"}
                      className="w-full justify-start gap-3 text-sm font-medium"
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </Button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-[#2a2a2a] bg-[#0f0f0f]">
          <div className="px-8 py-6">
            <h1 className="text-4xl font-bold">Webhooks</h1>
          </div>

          {/* Info Banner */}
          <div className="px-8 pb-6">
            <div className="bg-[#1a2a3a] border border-[#2a4a6a] rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Info size={20} className="text-blue-400" />
                <p className="text-sm text-gray-300">
                  Learn how to use Webhooks with Clerk by reading our{" "}
                  <span className="text-blue-400 hover:text-blue-300">
                    webhook documentation
                  </span>
                  .
                </p>
              </div>
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
              >
                Learn more
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-[#2a2a2a] bg-[#0f0f0f]">
          <div className="px-8 flex gap-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? "border-blue-500 text-white"
                      : "border-transparent text-gray-400 hover:text-gray-300"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-8 py-8">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold">Endpoints</h2>
              <button
                type="button"
                className="px-4 py-2 border border-blue-500 text-blue-400 hover:bg-blue-500/10 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <span>+</span>
                Add Endpoint
              </button>
            </div>

            {/* Table */}
            <div className="border border-[#2a2a2a] rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-2 bg-[#0f0f0f] border-b border-[#2a2a2a]">
                <div className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Endpoint
                </div>
                <div className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">
                  Error Rate
                </div>
              </div>

              {/* Empty State */}
              <div className="bg-[#1a1a1a] px-6 py-16 text-center">
                <h3 className="text-xl font-semibold mb-2">
                  Set up an endpoint to get started
                </h3>
                <p className="text-gray-400 text-sm">
                  For a list of events you can subscribe to, take a look at the{" "}
                  <Link
                    href="/event-catalog"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Event Catalog
                  </Link>
                  .
                </p>
              </div>

              {/* Footer */}
              <div className="bg-[#0f0f0f] border-t border-[#2a2a2a] px-6 py-4">
                <p className="text-xs text-gray-500">Showing 0 items</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
