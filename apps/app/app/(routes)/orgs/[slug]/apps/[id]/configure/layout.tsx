"use client";

import {
  AlertCircle,
  BookOpen,
  Clock,
  Grid3x3,
  Key,
  Lock,
  Settings,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { Button } from "@/components/ui/button";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const settingsIndex = segments.indexOf("settings");
  const basePath = segments.slice(0, settingsIndex + 1).join("/");

  const sidebarSections = [
    {
      title: "User & authentication",
      items: [
        { icon: BookOpen, label: "User & authentication", path: `${basePath}` },
        { icon: Lock, label: "SSO connections", path: `${basePath}/sso` },
        { icon: Zap, label: "Web3", path: `${basePath}/web3` },
        { icon: Key, label: "Multi-factor", path: `${basePath}/mfa` },
        {
          icon: Shield,
          label: "Restrictions",
          path: `${basePath}/restrictions`,
        },
        {
          icon: AlertCircle,
          label: "Attack protection",
          path: `${basePath}/attack-protection`,
        },
      ],
    },
    {
      title: "Session management",
      items: [
        { icon: Clock, label: "Sessions", path: `${basePath}` },
        { icon: Settings, label: "JWT templates", path: `${basePath}` },
      ],
    },
    {
      title: "Compliance",
      items: [{ icon: Users, label: "Legal", path: `${basePath}` }],
    },
    {
      title: "Feature management",
      items: [{ icon: Grid3x3, label: "Features", path: `${basePath}` }],
    },
  ];

  return (
    <div className="flex h-full w-full">
      <aside className="w-64 mr-5">
        <div>
          {sidebarSections.map((section) => (
            <div key={section.title} className="mb-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {section.title}
              </h3>
              {/* Add space between the buttons (vertical gap-1) */}
              <nav className="border-b pb-4 flex flex-col gap-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path;
                  return (
                    <Link key={item.label} href={item.path} className="w-full">
                      <Button
                        variant={isActive ? "outline" : "ghost"}
                        className="w-full justify-start gap-3 text-sm font-medium"
                      >
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </Button>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
    </div>
  );
}
