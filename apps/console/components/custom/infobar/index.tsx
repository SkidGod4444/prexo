"use client";

import React, { useState, useEffect, useId } from "react";
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
import { Check, ChevronsUpDown, Hammer, Plus, Slash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { FeedbackModal } from "../feedback.modal";
import { useMyProfileStore, useProjectsStore } from "@prexo/store";
import { useLocalStorage } from "usehooks-ts";
import { useContent } from "@/context/store.context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const endpoint =
  process.env.NODE_ENV == "development"
    ? "http://localhost:3001/v1/project"
    : "https://api.prexoai.xyz/v1/project";

export default function Infobar() {
  const id = useId();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const { addProject, projects } = useProjectsStore();
  const { myProfile } = useMyProfileStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openPopover2, setOpenPopover2] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [value, setValue] = useLocalStorage("@prexo-#consoleId", "");
  const { hardReload } = useContent();

  // Fix: handle empty pathname correctly
  const rawPathname = usePathname();
  const pathname =
    rawPathname && rawPathname.replace(/^\/|\/$/g, "").length > 0
      ? rawPathname.replace(/^\/|\/$/g, "").split("/")
      : [];

  // Fix: Prevent multiple submissions and ensure state is always reset
  const handleOnSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);

    toast.promise(
      (async () => {
        // Input validation
        if (!name.trim()) {
          throw new Error("Project name is required.");
        }
        if (!myProfile?.id) {
          throw new Error("User session is invalid. Please sign in again.");
        }

        // Create project
        const res = await fetch(`${endpoint}/create`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            description: desc.trim(),
            userId: myProfile.id,
          }),
        });

        if (!res.ok) {
          let msg = "Error while creating project!";
          try {
            const err = await res.json();
            if (err?.message) msg = err.message;
          } catch {
            // ignore
          }
          throw new Error(msg);
        }

        const data = await res.json();
        if (!data?.project) {
          throw new Error("Project creation failed. Please try again.");
        }

        addProject(data.project);
        // Optionally, reload content after project creation
        hardReload();
        // Set the new project as selected
        setValue(data.project.id);
        // Close the dialog after successful creation
        setOpenDialog(false);
        setTimeout(() => window.location.reload(), 200);
        return { name: data.project.name };
      })(),
      {
        loading: "Creating project...",
        success: (data: { name: string }) => {
          setIsLoading(false);
          setName("");
          setDesc("");
          return `Project "${data.name}" created successfully!`;
        },
        error: (err: Error) => {
          setIsLoading(false);
          return err?.message || "An error occurred. Please try again.";
        },
      },
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // If there are no projects, or a value is already selected, do nothing
    if (!projects || projects.length === 0 || value) return;

    // Helper to check if value is still empty after a short delay
    const timeoutId = setTimeout(() => {
      // If value is still not set, and projects exist, select the first project
      if (!value && projects.length > 0) {
        setValue(projects[0].id);
      }
    }, 800); // 800ms for a snappier UX, but not instant

    // Cleanup timeout if component unmounts or dependencies change
    return () => clearTimeout(timeoutId);
  }, [projects, value, setValue, hardReload]);

  return (
    <nav
      className={`flex w-full items-center sticky top-0 right-0 bg-background border-b ${
        isScrolled ? "z-[100]" : "z-50"
      }`}
    >
      <div className="flex flex-row items-center gap-2 py-3 w-full">
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarTrigger className="cursor-pointer border" />
          </TooltipTrigger>
          <TooltipContent>
            <p>⌘ + B</p>
          </TooltipContent>
        </Tooltip>
        <Separator orientation="vertical" className="h-6 bg-muted" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Popover
                open={openPopover2}
                onOpenChange={(open) => {
                  // Only update popover state if dialog is not open
                  // If dialog is open, allow popover to close independently
                  setOpenPopover2(open);
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="secondary"
                    role="combobox"
                    aria-expanded={openPopover2}
                    className="justify-between p-2 h-6"
                  >
                    {value
                      ? projects.find((proj) => proj.id === value)?.name ||
                        "Select project"
                      : "No projects"}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0 ml-2 z-[500]">
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
                              if (currentValue !== value) {
                                hardReload();
                                setValue(currentValue);

                                setTimeout(() => window.location.reload(), 200);
                              }
                              setOpenPopover2(false);
                            }}
                            className="cursor-pointer"
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

                    {/* Decoupled Dialog: controlled by openDialog */}
                    <Button
                      size={"sm"}
                      variant={"outline"}
                      className="m-2"
                      onClick={() => {
                        setOpenPopover2(false);
                        setOpenDialog(true);
                      }}
                    >
                      <Plus className="size-4" />
                      New Project
                    </Button>
                  </Command>
                </PopoverContent>
              </Popover>
              {/* Dialog is rendered outside Popover so it is not affected by Popover closing */}
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                      aria-hidden="true"
                    >
                      <Hammer className="opacity-80" size={16} />
                    </div>
                    <DialogHeader>
                      <DialogTitle className="sm:text-center">
                        Create Project
                      </DialogTitle>
                      <DialogDescription className="sm:text-center">
                        Don&apos;t worry, you can update your project details at
                        any time.
                      </DialogDescription>
                    </DialogHeader>
                  </div>

                  <form
                    className="space-y-5"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleOnSubmit();
                    }}
                  >
                    <div className="*:not-first:mt-2">
                      <Label htmlFor={id}>Name *</Label>
                      <Input
                        id={id}
                        type="text"
                        placeholder="Prexo"
                        value={name}
                        disabled={isLoading}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="*:not-first:mt-2">
                      <Label htmlFor={id}>Description</Label>
                      <Textarea
                        id={id}
                        placeholder="Prexo is an Ai agent."
                        value={desc}
                        disabled={isLoading}
                        onChange={(e) => setDesc(e.target.value)}
                      />
                    </div>
                    <DialogFooter className="mt-10">
                      <Button
                        type="submit"
                        className="flex-1"
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating..." : "Create Project"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </BreadcrumbItem>
            {pathname.length > 0 &&
              pathname.slice(0, 2).map((segment, idx) => (
                <React.Fragment key={idx}>
                  <BreadcrumbSeparator>
                    <Slash className="h-4 w-4" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <Button
                      variant={"ghost"}
                      className="select-none p-2 h-6 border border-dashed bg-secondary"
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
