"use client";

import React, { useState, useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Plus, Slash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { FeedbackModal } from "../feedback.modal";
import { useProjectsStore } from "@prexo/store";
import { useLocalStorage } from "usehooks-ts";

export default function Infobar() {
  const { projects } = useProjectsStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [openPopover2, setOpenPopover2] = useState(false);
  const [value, setValue] = useLocalStorage("@prexo-#consoleId", "");
  const pathname = usePathname()
    .replace(/^\/|\/$/g, "")
    .split("/");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (projects.length > 0 && !value) {
      setValue(projects[0].id);
    }

    if (
      projects.length > 0 &&
      value &&
      !projects.find((proj) => proj.id === value)
    ) {
      setValue(projects[0].id);
    }
  }, [projects, value, setValue]);

  return (
    <nav
      className={`flex w-full items-center sticky top-0 right-0 bg-background border-b ${
        isScrolled ? "z-50" : ""
      }`}
    >
      <div className="flex flex-row items-center gap-2 py-3 w-full">
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarTrigger className="cursor-pointer" />
          </TooltipTrigger>
          <TooltipContent>
            <p>⌘ + B</p>
          </TooltipContent>
        </Tooltip>
        <Separator orientation="vertical" className="h-6 bg-muted" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Popover open={openPopover2} onOpenChange={setOpenPopover2}>
                <PopoverTrigger asChild>
                  <Button
                    variant="secondary"
                    role="combobox"
                    aria-expanded={openPopover2}
                    className="justify-between p-2 h-6"
                  >
                    {value
                      ? projects.find((proj) => proj.id === value)?.name
                      : "Select project"}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0 ml-2">
                  <Command>
                    <CommandInput
                      placeholder="Search project..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No project found.</CommandEmpty>
                      <CommandGroup>
                        {projects.map((proj) => (
                          <CommandItem
                            key={proj.id}
                            value={proj.id}
                            onSelect={(currentValue) => {
                              setValue(
                                currentValue === value ? "" : currentValue,
                              );
                              setOpenPopover2(false);
                            }}
                          >
                            {proj.name}
                            <Check
                              className={cn(
                                "ml-auto",
                                value === proj.id ? "opacity-100" : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                    <Separator />
                    <Button size={"sm"} variant={"outline"} className="m-2">
                      <Plus className="size-4" />
                      New Project
                    </Button>
                  </Command>
                </PopoverContent>
              </Popover>
            </BreadcrumbItem>
            {pathname.length > 0 &&
              pathname.map((segment, idx) => (
                <React.Fragment key={idx}>
                  <BreadcrumbSeparator>
                    <Slash className="h-4 w-4" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <Button
                      variant={"ghost"}
                      className="select-none p-2 h-6 border border-dashed"
                    >
                      {segment.charAt(0).toUpperCase() + segment.slice(1)}
                    </Button>
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="hidden md:flex gap-2">
        <FeedbackModal />
      </div>
    </nav>
  );
}
