"use client";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import SearchBar from "@/components/search.bar";
import { Badge } from "@/components/ui/badge";
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

export default function NavBar() {
  const pathname = usePathname();

  // Navigation links array to be used in both desktop and mobile menus
  const defaultNavLinks = [
    { href: "#", label: "Docs" },
    { href: "#", label: "API reference" },
  ];

  const segments = pathname.split("/");
  const appBasePath = segments.slice(0, 5).join("/");
  // /orgs/prexo-ai/apps/1 (dynamic app slug)

  const appNavLinks = [
    { href: `${appBasePath}`, label: "Overview", isBeta: false },
    { href: `${appBasePath}/inbox`, label: "Inbox", isBeta: true },
    { href: `${appBasePath}/chats`, label: "Chats", isBeta: true },
    { href: `${appBasePath}/meets`, label: "Meetings", isBeta: true },
    { href: `${appBasePath}/settings`, label: "Settings", isBeta: false },
  ];
  console.log("Current pathname:", pathname);
  const navLinks = pathname?.includes("/apps/")
    ? appNavLinks
    : defaultNavLinks.map((link) => ({ ...link, isBeta: false }));

  return (
    <header className="border-b bg-secondary">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        {/* Left side */}
        <div className="flex items-center gap-2">
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
                  aria-label="Menu"
                >
                  <title>Menu</title>
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
                  {navLinks.map((link, index) => (
                    <NavigationMenuItem key={index} className="w-full">
                      <NavigationMenuLink href={link.href} className="py-1.5">
                        {link.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          {/* Breadcrumb */}
          {/* <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Select defaultValue="personal">
                  <SelectPrimitive.SelectTrigger
                    aria-label="Select account type"
                    asChild
                  >
                    <Button
                      variant="ghost"
                      className="h-8 p-1.5 text-foreground hover:bg-transparent focus-visible:ring-0"
                    >
                      <Avatar className="rounded-sm mr-2">
  <AvatarImage src="https://github.com/shadcn.png" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>
                      <SelectValue placeholder="Select account type" />
                      <ChevronsUpDown
                        size={14}
                        className="text-muted-foreground/80"
                      />
                    </Button>
                  </SelectPrimitive.SelectTrigger>
                  <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </BreadcrumbItem>
              {/* <BreadcrumbSeparator> / </BreadcrumbSeparator>
              <BreadcrumbItem>
                <Select defaultValue="1">
                  <SelectPrimitive.SelectTrigger
                    aria-label="Select project"
                    asChild
                  >
                    <Button
                      variant="ghost"
                      className="h-8 p-1.5 text-foreground focus-visible:bg-accent focus-visible:ring-0"
                    >
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
              </BreadcrumbItem> */}
          {/* </BreadcrumbList>
          </Breadcrumb>  */}
          <OrganizationSwitcher
            afterCreateOrganizationUrl="/orgs/:slug" // Navigate to the org's slug after creating an org
            afterSelectOrganizationUrl="/orgs/:slug" // Navigate to the org's slug after selecting  it
          />
        </div>
        <div className="hidden md:block">
          <SearchBar />
        </div>
        {/* Right side */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {/* Settings */}
            {/* <SettingsMenu /> */}
          </div>
          {/* User menu */}
          <UserButton />
        </div>
      </div>
      {/* Bottom navigation */}
      <div className="border-t px-4 md:px-6 py-2 max-md:hidden">
        {/* Navigation menu */}
        <NavigationMenu>
          <NavigationMenuList className="gap-2">
            {navLinks.map((link, index) => (
              <NavigationMenuItem key={index}>
                <NavigationMenuLink
                  active={pathname === link.href}
                  href={link.href}
                  className="inline-flex flex-row items-center gap-2 text-muted-foreground hover:bg-secondary hover:text-primary-foreground font-medium px-2 py-1"
                >
                  <span>{link.label}</span>

                  {link.isBeta && (
                    <Badge
                      variant={"outline"}
                      className="ml-1 text-xs border border-dashed text-blue-600 border-blue-600"
                    >
                      Beta
                    </Badge>
                  )}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}
