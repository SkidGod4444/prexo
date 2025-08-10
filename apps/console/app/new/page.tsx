"use client";

import React, { useId, useState } from "react";
import { Hammer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth.context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMyProfileStore, useProjectsStore } from "@prexo/store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useContent } from "@/context/store.context";

// Inline SVG with gradients for the warning icon
function WarningIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      className="h-24 w-24 mb-8"
      strokeWidth={4}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={96}
      height={96}
    >
      <defs>
        {/* Background gradient: dark gray to slightly lighter gray */}
        <linearGradient id="404-background" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#23272e" /> {/* dark gray */}
          <stop offset="100%" stopColor="#3a3f47" /> {/* lighter gray */}
        </linearGradient>
        {/* Border gradient: gray to white (was orange, now white) */}
        <linearGradient id="404-border" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#3a3f47" /> {/* gray */}
          <stop offset="100%" stopColor="#ffffff" /> {/* white */}
        </linearGradient>
      </defs>
      <path
        fill="url(#404-background)"
        stroke="url(#404-border)"
        strokeWidth={4}
        d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"
      />
    </svg>
  );
}

const endpoint =
  process.env.NODE_ENV == "development"
    ? "http://localhost:3001/v1/project"
    : "https://api.prexoai.xyz/v1/project";

const endpoint02 =
  process.env.NODE_ENV == "development"
    ? "http://localhost:3001/v1/user"
    : "https://api.prexoai.xyz/v1/user";

export default function NewFallBack() {
  const { logout, user } = useAuth();
  const id = useId();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const { addProject, projects } = useProjectsStore();
  const { removeMyProfile } = useMyProfileStore();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { hardReload } = useContent();

  const handleTroubleShoot = async () => {
    try {
      const res = await fetch(`${endpoint02}/onboarded`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id }),
      });

      if (res.ok) {
        console.log("Updated user role: ", res);
        hardReload();
        setTimeout(() => router.push("/dashboard"), 100);
      }
    } catch (err) {
      console.error("Failed to set user as inactive", err);
    }
  };

  const handleOnSubmit = () => {
    toast.promise(
      (async () => {
        setIsLoading(true);

        // Input validation
        if (!name.trim()) {
          throw new Error("Project name is required.");
        }
        if (!user?.id) {
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
            userId: user.id,
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

        // Mark user as onboarded
        const onboardRes = await fetch(`${endpoint02}/onboarded`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        });

        if (!onboardRes.ok) {
          let msg = "Error while updating user!";
          try {
            const err = await onboardRes.json();
            if (err?.message) msg = err.message;
          } catch {
            // ignore
          }
          throw new Error(msg);
        }
        removeMyProfile(user.id);
        addProject(data.project);
        // Delay navigation slightly to ensure state updates
        setTimeout(() => router.push("/dashboard"), 100);

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sidebar">
      <WarningIcon />
      <h1 className="font-uxum font-bold text-3xl md:text-4xl text-white mb-2">
        Inactive Workspace!
      </h1>
      <p className="text-gray-400 text-base mb-8 text-center max-w-md">
        It looks like you don&apos;t have any projects yet. To access the
        console, please create at least one project.
      </p>
      <div className="flex gap-5">
        <Button variant={"outline"} onClick={logout}>
          Sign Out
        </Button>

        {projects.length == 0 ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button>Create Project</Button>
            </DialogTrigger>
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
                    Don&apos;t worry, you can update your project details at any
                    time.
                  </DialogDescription>
                </DialogHeader>
              </div>

              <form className="space-y-5">
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
                    type="button"
                    className="flex-1"
                    disabled={isLoading}
                    onClick={handleOnSubmit}
                  >
                    {isLoading ? "Creating..." : "Create Project"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        ) : (
          <Button onClick={handleTroubleShoot}>Troubleshoot</Button>
        )}
      </div>
      <span className="text-gray-400 text-base mt-10 text-center max-w-md">
        If you believe this is a mistake, please contact us at{" "}
        <a
          href={`mailto:connect.saidev@gmail.com?subject=Inactive%20Workspace%20Support&body=${encodeURIComponent(
            `<<--- <b>ID:</b> <u>${user?.id}</u> --->>`,
          )}`}
          className="underline hover:text-primary transition-colors"
        >
          connect.saidev@gmail.com
        </a>
        .
      </span>
    </div>
  );
}
