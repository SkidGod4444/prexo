import React, { useRef, useState } from "react";
import SectionLabel from "../section.label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckIcon, Copy } from "lucide-react";
import { useProjectsStore } from "@prexo/store";
import { useReadLocalStorage } from "usehooks-ts";
import { toast } from "sonner";
import DeleteProject from "../proj.delete.btn";

const API_ENDPOINT =
  process.env.NODE_ENV == "development"
    ? "http://localhost:3001/v1/project"
    : "https://api.prexoai.xyz/v1/project";

export default function AppSettings() {
  const { projects, setProjects } = useProjectsStore();
  const consoleId = useReadLocalStorage("@prexo-#consoleId");
  const thisProject = projects.find((project) => project.id === consoleId);
  const [name, setName] = useState(thisProject?.name);
  const [desc, setDesc] = useState(thisProject?.description);
  const [apiId] = useState(thisProject?.keyId);
  const [isCopied, setIsCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCopy = () => {
    if (inputRef.current && apiId) {
      navigator.clipboard
        .writeText(inputRef.current.value)
        .then(() => {
          setIsCopied(true);
          toast("Copied to clipboard!");
          setTimeout(() => setIsCopied(false), 1500);
        })
        .catch(() => {
          toast("Failed to copy to clipboard");
        });
    }
  };

  const handleOnSave = () => {
    if (name && name?.length > 0) {
      setIsLoading(true);
      toast.promise(
        (async () => {
          const res = await fetch(`${API_ENDPOINT}/update`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: consoleId,
              name: name?.trim(),
              description: desc?.trim(),
            }),
          });
          if (!res.ok) {
            throw new Error("Error while updating name!");
          }
          return { name: "Name & Description" };
        })(),
        {
          loading: "Loading...",
          success: (data) => {
            setIsLoading(false);
            setProjects([]);
            window.location.reload();
            return `${data.name} updated successfully!`;
          },
          error: (err) => {
            setIsLoading(false);
            console.log("Error while updating name!", err);
            return "Error";
          },
        },
      );
    }
  };

  return (
    <div className="flex flex-col items-start justify-start h-full w-full overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between w-full">
        <SectionLabel
          label="Projects Settings"
          msg="Manage your project settings."
        />
      </div>
      <div className="flex flex-col gap-4 w-full mt-5">
        {/* Name & Description Card */}
        <Card className="w-full p-0">
          <CardContent className="p-3">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <Label htmlFor="project-name" className="text-lg font-medium">
                  Name
                </Label>
                <span className="text-sm text-muted-foreground">
                  Change the name of your Project. This is only visible to you
                  and your team.
                </span>
                <Input
                  id="project-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="off"
                  disabled={isLoading}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="project-desc" className="text-lg font-medium">
                  Description
                </Label>
                <span className="text-sm text-muted-foreground">
                  Change the description of your Project. This is only visible
                  to you and your team.
                </span>
                <Input
                  id="project-desc"
                  value={desc!}
                  onChange={(e) => setDesc(e.target.value)}
                  autoComplete="off"
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t p-2">
            <Button
              className="flex-1"
              onClick={handleOnSave}
              type="button"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
        {/* API ID Card */}
        {apiId && (
          <Card className="w-full p-0">
            <CardContent className="p-3">
              <div className="flex flex-col gap-1">
                <Label htmlFor="api-id" className="text-lg font-medium">
                  API ID
                </Label>
                <span className="text-sm text-muted-foreground">
                  An identifier for this Project&apos;s API, used in some API
                  calls.
                </span>
                <div className="flex flex-row gap-2 items-center">
                  <Input
                    id="api-id"
                    value={apiId!}
                    readOnly
                    ref={inputRef}
                    className="flex-1"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    className="px-2"
                    onClick={handleCopy}
                    type="button"
                    aria-label="Copy API ID"
                  >
                    {isCopied ? (
                      <CheckIcon size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {/* Delete Project Card */}
        <Card className="w-full p-0">
          <CardContent className="p-3">
            <div className="flex flex-col">
              <Label className="text-lg mb-1">Delete Project</Label>
              <span className="text-sm text-muted-foreground mb-2">
                Deleting your project will permanently remove all data and
                cannot be undone. This action is irreversible and can not be
                undone.
              </span>
              <DeleteProject name={thisProject?.name ?? ""} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
