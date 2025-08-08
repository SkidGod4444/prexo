import React, { useRef, useState } from "react";
import SectionLabel from "../section.label";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckIcon, Copy } from "lucide-react";
import { useProjectsStore } from "@prexo/store";
import { useReadLocalStorage } from "usehooks-ts";
import { toast } from "sonner";
import DeleteProject from "../proj.delete.btn";

export default function AppSettings() {
  const { projects } = useProjectsStore();
  const consoleId = useReadLocalStorage("@prexo-#consoleId");
  const thisProject = projects.find((project) => project.id === consoleId);
  const [name, setName] = useState(thisProject?.name);
  const [apiId] = useState(thisProject?.keyId);
  const [isCopied, setIsCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    if (inputRef.current && apiId) {
      navigator.clipboard.writeText(inputRef.current.value)
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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleNameSave = () => {
    // Save logic here
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
        {/* Name Card */}
        <Card className="w-full p-0">
          <CardContent className="p-3">
            <div className="flex flex-col gap-1">
              <Label htmlFor="project-name" className="text-lg font-medium">
                Name
              </Label>
              <span className="text-sm text-muted-foreground">
                Change the name of your Project. This is only visible to you and
                your team.
              </span>
              <div className="flex flex-row gap-2 items-center">
                <Input
                  id="project-name"
                  value={name}
                  onChange={handleNameChange}
                  className="flex-1"
                  autoComplete="off"
                />
                <Button
                  size="sm"
                  className="px-4"
                  onClick={handleNameSave}
                  type="button"
                >
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* API ID Card */}
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
