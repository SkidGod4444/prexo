"use client";

import { useEffect, useId, useState } from "react";
import { CircleAlertIcon, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useReadLocalStorage } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { useContent } from "@/context/store.context";
import { useMyProfileStore, useProjectsStore } from "@prexo/store";

const API_ENDPOINT =
  process.env.NODE_ENV == "development"
    ? "http://localhost:3001/v1/api"
    : "https://api.prexoai.xyz/v1/api";

const PROJECTS_ENDPOINT =
  process.env.NODE_ENV == "development"
    ? "http://localhost:3001/v1/project"
    : "https://api.prexoai.xyz/v1/project";

const USERS_ENDPOINT =
  process.env.NODE_ENV == "development"
    ? "http://localhost:3001/v1/user"
    : "https://api.prexoai.xyz/v1/user";

export default function DeleteProject({ name }: { name: string }) {
  const PROJECT_NAME = name;
  const id = useId();
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const consoleId = useReadLocalStorage("@prexo-#consoleId");
  const router = useRouter();
  const { projects } = useProjectsStore();
  const { myProfile } = useMyProfileStore();
  const { hardReload } = useContent();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    if (projects.length === 0 && myProfile && myProfile.role === "onboarded") {
      // Wait for 2 seconds before deciding
      timeoutId = setTimeout(() => {
        // Use an async IIFE inside useEffect to handle async/await
        (async () => {
          try {
            const res = await fetch(`${USERS_ENDPOINT}/inactive`, {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId: myProfile.id }),
            });

            if (res.ok) {
              console.log("Updated user role: ", res);
            }
          } catch (err) {
            // Optionally handle error here
            console.error("Failed to set user as inactive", err);
          }
        })();
      }, 2000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [projects, myProfile]);

  const handleDeleteBtn = async () => {
    setIsLoading(true);

    // Helper to reset state and show error
    const handleError = (msg: string, err?: unknown) => {
      setIsLoading(false);
      if (err instanceof Error) {
        console.error(msg, err);
      }
      toast.error(msg);
    };

    if (!consoleId) {
      handleError("Unable to determine current project.");
      return;
    }

    // Helper to fetch all API keys for the project
    const fetchApiKeys = async (): Promise<string[]> => {
      try {
        const res = await fetch(`${API_ENDPOINT}/list/${consoleId}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Error while fetching API keys!");
        const data = await res.json();
        if (data.result && Array.isArray(data.result)) {
          return data.result.map((key: { id: string }) => key.id);
        }
        return [];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        throw new Error("Failed to fetch API keys.");
      }
    };

    // Helper to delete all API keys
    const deleteApiKeys = async (keyIds: string[]) => {
      if (keyIds.length === 0) return;
      await Promise.all(
        keyIds.map(async (keyId) => {
          const res = await fetch(`${API_ENDPOINT}/delete`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ keyId }),
          });
          if (!res.ok) {
            throw new Error(`Error deleting API key with id ${keyId}`);
          }
        }),
      );
    };

    // Helper to delete the project
    const deleteProject = async () => {
      const res = await fetch(`${PROJECTS_ENDPOINT}/delete`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: consoleId }),
      });
      if (!res.ok) {
        throw new Error("Error deleting project!");
      }
    };

    // Main logic wrapped in toast.promise for user feedback
    toast.promise(
      (async () => {
        // Step 1: Fetch API keys
        let keyIds: string[] = [];
        try {
          keyIds = await fetchApiKeys();
        } catch (err) {
          handleError("Error while fetching API keys!", err);
          throw err;
        }

        // Step 2: Delete API keys if any
        if (keyIds.length > 0) {
          toast.promise(deleteApiKeys(keyIds), {
            loading: "Deleting API keys...",
            success: "API keys deleted successfully!",
            error: (err) => {
              console.error("Error while deleting API keys!", err);
              return "Error deleting API keys!";
            },
          });
        } else {
          toast.info("No API keys to delete.");
        }

        // Step 4: Delete the project
        toast.promise(deleteProject(), {
          loading: "Deleting project...",
          success: () => {
            hardReload();
            return "Project deleted successfully!";
          },
          error: (err) => {
            setIsLoading(false);
            console.error("Error while deleting project!", err);
            return "Error deleting project!";
          },
        });

        return { name: "Project" };
      })(),
      {
        loading: "Processing deletion...",
        success: (data) => {
          router.refresh();
          return `${data.name} deleted successfully!`;
        },
        error: (err) => {
          setIsLoading(false);
          console.error("Error during deletion process!", err);
          return "Error during deletion process!";
        },
      },
    );
  };

  // Prevent default form submission
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="w-fit flex items-center justify-end gap-2 bg-red-700 hover:bg-red-800 text-primary"
          type="button"
        >
          <Trash2 size={16} />
          Delete Project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <CircleAlertIcon className="opacity-80" size={16} />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              Final confirmation
            </DialogTitle>
            <DialogDescription className="sm:text-center">
              To confirm, please enter the project name.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-5" onSubmit={handleFormSubmit}>
          <div className="*:not-first:mt-2">
            <Label htmlFor={id}>Project name</Label>
            <Input
              id={id}
              type="text"
              placeholder={`Type "${name}" to confirm`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                className="flex-1"
                onClick={() => setInputValue("")}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              className="flex-1 bg-red-700 hover:bg-red-800 text-primary"
              disabled={inputValue !== PROJECT_NAME || isLoading}
              onClick={handleDeleteBtn}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
