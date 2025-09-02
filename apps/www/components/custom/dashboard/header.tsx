"use client";
import { Select as SelectPrimitive } from "radix-ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronsUpDown,
  HouseIcon,
  InboxIcon,
  SparklesIcon,
  ZapIcon,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

// Navigation links array
const navigationLinks = [
  { href: "#", label: "Home", icon: HouseIcon, active: true },
  { href: "#", label: "Inbox", icon: InboxIcon },
  { href: "#", label: "Insights", icon: ZapIcon },
];

export default function DashboardHeader() {
  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="flex flex-1 items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                variant="ghost"
                size="icon"
              >
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, index) => {
                    const Icon = link.icon;
                    return (
                      <NavigationMenuItem key={index} className="w-full">
                        <NavigationMenuLink
                          href={link.href}
                          className="flex-row items-center gap-2 py-1.5"
                          active={link.active}
                        >
                          <Icon
                            size={16}
                            className="text-muted-foreground/80"
                            aria-hidden="true"
                          />
                          <span>{link.label}</span>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>

          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Select defaultValue="personal">
                  <SelectPrimitive.SelectTrigger
                    aria-label="Select account type"
                    asChild
                  >
                    <Button variant="secondary" size={"sm"}>
                      <SelectValue placeholder="Select account type" />
                      <ChevronsUpDown
                        size={14}
                        className="text-muted-foreground/80"
                      />
                    </Button>
                  </SelectPrimitive.SelectTrigger>
                  <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
                    <SelectItem value="personal">Personal</SelectItem>
                  </SelectContent>
                </Select>
              </BreadcrumbItem>
              <BreadcrumbSeparator> / </BreadcrumbSeparator>
              <BreadcrumbItem>
                <Select defaultValue="1">
                  <SelectPrimitive.SelectTrigger
                    aria-label="Select project"
                    asChild
                  >
                    <Button variant="secondary" size={"sm"}>
                      <SelectValue placeholder="Select project" />
                      <ChevronsUpDown
                        size={14}
                        className="text-muted-foreground/80"
                      />
                    </Button>
                  </SelectPrimitive.SelectTrigger>
                  <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
                    <SelectItem value="1">Main project</SelectItem>
                    <SelectItem value="2">Origin project</SelectItem>
                  </SelectContent>
                </Select>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Middle side: Logo */}
        {/* <div className="flex items-center">
          <Logo isTextVisible={false}/>
        </div> */}

        {/* Right side: Actions */}
        <div className="flex flex-1 items-center justify-end gap-4">
          {/* Upgrade button */}
          <Button size="sm" className="text-sm sm:aspect-square">
            <SparklesIcon
              className="opacity-60 sm:-ms-1"
              size={16}
              aria-hidden="true"
            />
            <span className="sm:sr-only">Upgrade</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
