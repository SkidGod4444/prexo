"use client";

import { useId, useState } from "react";
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

const endpoint =
  process.env.NODE_ENV == "development"
    ? "http://localhost:3001/v1/api"
    : "https://api.prexoai.xyz/v1/api";

export default function DeleteProject({ name }: { name: string }) {
  const PROJECT_NAME = name;
  const id = useId();
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const consoleId = useReadLocalStorage("@prexo-#consoleId");

  const handleDeleteBtn = async () => {
    setIsLoading(true);

    // fetch all api keys
    toast.promise(
      (async () => {
        const res = await fetch(`${endpoint}/list/${consoleId}`, {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Error while fetching API keys!");
        }
        const data = await res.json();
        if (data.result && Array.isArray(data.result)) {
          const keyIds = data.result.map((key: { id: string }) => key.id);

          // Only run the delete toast.promise if there are keys to delete
          if (keyIds.length > 0) {
            toast.promise(
              (async () => {
                await Promise.all(
                  keyIds.map(async (keyId: string) => {
                    const res = await fetch(`${endpoint}/delete`, {
                      method: "POST",
                      credentials: "include",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ keyId }),
                    });
                    if (!res.ok) {
                      throw new Error(
                        `Error deleting API key with id ${keyId}`,
                      );
                    }
                    return res.json();
                  }),
                );
                return { name: "API keys" };
              })(),
              {
                loading: "Loading...",
                success: (data) => {
                  setIsLoading(false);
                  return `${data.name} deleted successfully!`;
                },
                error: (err) => {
                  setIsLoading(false);
                  console.log("Error while deleting API keys!", err);
                  return "Error";
                },
              },
            );
          } else {
            setIsLoading(false);
            toast.info("No API keys to delete.");
          }
        } else {
          setIsLoading(false);
          toast.info("No API keys found.");
        }
        return { name: "API keys" };
      })(),
      {
        loading: "Loading...",
        success: (data) => {
          return `${data.name} fetched successfully!`;
        },
        error: (err) => {
          setIsLoading(false);
          console.log("Error while fetching API keys!", err);
          return "Error";
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
