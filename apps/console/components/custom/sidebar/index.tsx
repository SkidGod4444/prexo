"use client";
import {
  Layers2,
  Settings,
  BrainCircuit,
  FlaskConical,
  BookMarked,
  MessageCircleDashed,
  Video,
  GitCompareArrows,
  // DollarSign,
  // SquareDashedMousePointer,
  // Bolt,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { usePathname } from "next/navigation";
import { NavUser } from "./nav.user";
import Logo from "../logo";
import QuickActionButton from "./quick.actions";
import Link from "next/link";
import { useAuth } from "@/context/auth.context";
import { NavSecondary } from "./nav.secondary";

// Define a type for menu items that may have subItems
type MenuItem = {
  title: string;
  url: string;
  icon: React.ElementType;
  isDisabled?: boolean;
  subItems?: MenuItem[];
};

// Menu items.
const items: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Layers2,
  },
  {
    title: "Conversations",
    url: "#",
    icon: MessageCircleDashed,
    isDisabled: true,
  },
  {
    title: "Meetings",
    url: "#",
    icon: Video,
    isDisabled: true,
  },
];

const navSecondary = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Documentation",
    url: "https://docs.prexoai.xyz",
    icon: BookMarked,
  },
  {
    title: "Changelogs",
    url: "https://changelogs.prexoai.xyz",
    icon: GitCompareArrows,
  },
];
// Playground items.
const IntelItems: MenuItem[] = [
  {
    title: "Memory",
    url: "/memory",
    icon: BrainCircuit,
  },
  // {
  //   title: "Commerce",
  //   url: "#",
  //   icon: DollarSign,
  //   subItems: [
  //     {
  //       title: "Configs",
  //       url: "/memory/history",
  //       icon: Bolt,
  //     },
  //     {
  //       title: "Tools",
  //       url: "/memory/context",
  //       icon: SquareDashedMousePointer,
  //     },
  //   ],
  // },
  {
    title: "Playground",
    url: "/playground",
    icon: FlaskConical,
  },
];

export function AppSidebar() {
  const path = usePathname();
  const { state } = useSidebar();
  const { user, loading } = useAuth();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Logo isCollapsed={state === "collapsed"} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={path.includes(item.url)}
                    className={`border ${item.isDisabled && "bg-black hover:bg-black border-dashed"}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="text-muted-foreground" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Intelligence</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {IntelItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={
                      path.split("/").pop() === item.url.replace(/^\//, "")
                    }
                  >
                    <Link href={item.url}>
                      <item.icon className="text-muted-foreground" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {Array.isArray(item.subItems) && item.subItems.length > 0 ? (
                    <SidebarMenuSub>
                      {item.subItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={path.includes(subItem.url)}
                          >
                            <Link href={subItem.url}>
                              <subItem.icon className="text-muted-foreground" />
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <QuickActionButton collapse={state} />
        {user && !loading && <NavUser user={user} />}
      </SidebarFooter>
    </Sidebar>
  );
}
