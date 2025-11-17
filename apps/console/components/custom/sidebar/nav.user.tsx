"use client";

import {
  ChevronsUpDown,
  Cog,
  CreditCard,
  DoorOpen,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/auth.context";
import { useMyProfileStore } from "@prexo/store";
import PlansDialog from "./plans.dialog";
import { useRouter } from "next/navigation";
import { maskEmail } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { logout } = useAuth();
  const { myProfile } = useMyProfileStore();
  const router = useRouter();
  const isPremium = myProfile?.role === "pro";
  if (!myProfile) {
    return;
  }
  const handleBiling = async () => {
    const res = await authClient.customer.portal();
    console.log(res);
  };

  const redirectOnClick = (url: string) => {
    router.push(url);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent cursor-pointer data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={myProfile.image!} alt={myProfile.name} />
                <AvatarFallback className="rounded-lg">
                  {myProfile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{myProfile.name}</span>
                <span className="truncate text-xs">
                  {maskEmail(myProfile.email)}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={myProfile.image!} alt={myProfile.name} />
                  <AvatarFallback className="rounded-lg">
                    {myProfile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{myProfile.name}</span>
                  <span className="truncate text-xs">
                    {maskEmail(myProfile.email)}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => redirectOnClick("https://prexoai.xyz")}
              className="cursor-pointer"
            >
              <DoorOpen />
              Home
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Cog />
              Account
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {isPremium ? (
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleBiling}
              >
                <CreditCard />
                Billing
              </DropdownMenuItem>
            ) : (
              <PlansDialog />
            )}
            <Button
              className="mx-2 my-1 w-[calc(100%-1rem)]"
              variant="outline"
              onClick={logout}
            >
              <LogOut className="text-primary" />
              Log out
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
