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
import { Check, ChevronsUpDown, Plus, Slash, Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { FeedbackModal } from "../feedback.modal";
import { useApiKeyStore, useProjectsStore } from "@prexo/store";
import { useLocalStorage } from "usehooks-ts";
import Link from "next/link";

export default function Infobar() {
  const { projects } = useProjectsStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [openPopover2, setOpenPopover2] = useState(false);
  const [value, setValue] = useLocalStorage(
    "@prexo-#consoleId",
    "", 
  );
  const { key } = useApiKeyStore();
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
    if(projects.length > 0 && !value) {
      setValue(projects[0].id);
    }

    if(projects.length > 0 && value && !projects.find((proj) => proj.id === value)) {
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
            {pathname.length > 0 && pathname.map((segment, idx) => (
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
        <Button variant={"outline"} size={"sm"}>
        <span className="inline-flex items-center">
          <svg height="12" width="12" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
          <g fill="currentColor">
            <ellipse cx="9.5" cy="3.75" fill="none" rx="6.25" ry="2" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1">
              </ellipse>
              <path d="M3.25,3.75v3c0,1.104,2.798,2,6.25,2s6.25-.896,6.25-2V3.75" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1">
                </path>
                <path d="M2.25,11.25v3c0,1.104,2.798,2,6.25,2s6.25-.896,6.25-2v-3" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"></path><path d="M3.311,10.135c-.67,.319-1.061,.702-1.061,1.115,0,1.104,2.798,2,6.25,2s6.25-.896,6.25-2c0-.223-.119-.438-.33-.638" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"></path><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" x1="9.5" x2="9.5" y1="5.75" y2="8.75"></line><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" x1="6.25" x2="6.25" y1="5.458" y2="8.458"></line><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" x1="12.75" x2="12.75" y1="5.458" y2="8.458"></line><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" x1="8.5" x2="8.5" y1="13.25" y2="16.25"></line><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" x1="5.25" x2="5.25" y1="12.958" y2="15.958"></line><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" x1="11.75" x2="11.75" y1="12.958" y2="15.958"></line></g></svg>
                </span>
          {key.remaining ? key.remaining : "0"}
        </Button>
        <FeedbackModal />
      </div>
    </nav>
  );
}
