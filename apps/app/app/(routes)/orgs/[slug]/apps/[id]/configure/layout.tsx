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
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const configureIndex = segments.indexOf("configure");
  const basePath = segments.slice(0, configureIndex + 1).join("/");

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
        { icon: Clock, label: "Sessions", path: `${basePath}/sessions` },
        { icon: Settings, label: "JWT templates", path: `${basePath}/jwt` },
      ],
    },
    {
      title: "Compliance",
      items: [{ icon: Users, label: "Legal", path: `${basePath}/legal` }],
    },
    {
      title: "Feature management",
      items: [
        { icon: Grid3x3, label: "Features", path: `${basePath}/features` },
      ],
    },
  ];

  return (
    <div className="flex h-full w-full gap-6">
      <aside className="w-64 flex-shrink-0">
        <ScrollArea className="h-full">
          <div className="pr-2">
            {sidebarSections.map((section, index) => (
              <div key={section.title} className={index > 0 ? "mt-6" : ""}>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
                  {section.title}
                </h3>
                <nav className="flex flex-col gap-1 pb-4 border-b border-border">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;
                    return (
                      <Link
                        key={item.label}
                        href={item.path}
                        className="w-full"
                      >
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
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
        </ScrollArea>
      </aside>

      <main className="flex-1 min-w-0 overflow-hidden">{children}</main>
    </div>
  );
}
