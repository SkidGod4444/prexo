import React, { useState } from "react";
import SectionLabel from "../section.label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ChevronDownIcon,
  DatabaseBackup,
  DatabaseZap,
  CircleQuestionMark,
  Logs,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EnvKeysSettings() {
  const [selectedDB, setSelectedDB] = useState<"" | "redis" | "vector">(
    "redis",
  );

  const key1 =
    selectedDB === "redis"
      ? "UPSTASH_REDIS_REST_URL"
      : "UPSTASH_VECTOR_REST_URL";
  const key2 =
    selectedDB === "redis"
      ? "UPSTASH_REDIS_REST_TOKEN"
      : "UPSTASH_VECTOR_REST_TOKEN";

  const dbOptions: {
    key: "" | "redis" | "vector";
    icon: React.ElementType;
    label: string;
    desc: string;
  }[] = [
    {
      key: "redis",
      icon: DatabaseBackup,
      label: "Upstash Redis",
      desc: "Redis database for chat history",
    },
    {
      key: "vector",
      icon: DatabaseZap,
      label: "Upstash Vector",
      desc: "Vector database for AI context",
    },
  ];

  function DBDorpdown() {
    const selected = dbOptions.find((opt) => opt.key === selectedDB);

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center justify-between w-full rounded-lg"
          >
            <span className="flex items-center gap-2 ">
              {selected ? (
                <selected.icon
                  size={18}
                  className="text-primary/80"
                  aria-hidden="true"
                />
              ) : (
                <Logs
                  size={18}
                  className="text-primary/80"
                  aria-hidden="true"
                />
              )}
              <span>{selected ? selected.label : "Choose Database"}</span>
            </span>
            <ChevronDownIcon
              className="ml-2 opacity-70"
              size={18}
              aria-hidden="true"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-full mt-2 rounded-xl shadow-lg border border-border bg-popover p-1"
          align="start"
        >
          {dbOptions.map((opt) => (
            <DropdownMenuItem
              key={opt.key}
              className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors cursor-pointer ${
                selectedDB === opt.key ? "bg-accent" : ""
              }`}
              onSelect={() => setSelectedDB(opt.key as "redis" | "vector")}
            >
              <opt.icon size={18} aria-hidden="true" />
              <div>
                <div className="font-semibold text-sm">{opt.label}</div>
                <div className="text-xs text-muted-foreground">{opt.desc}</div>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  return (
    <div className="flex flex-col items-start justify-start h-full w-full overflow-hidden">
      <SectionLabel
        label="Environment Variables"
        msg="Manage your Environmental keys."
      />
      <Card className="w-full mt-5 p-0">
        <CardContent className="p-2">
          <Badge variant={"outline"} className="mb-2">
            Sensitive
          </Badge>
          <DBDorpdown />
          <Separator className="my-4" />
          <div className="flex flex-row gap-2">
            <div className="flex-1 flex-col">
              <Label htmlFor="env-key" className="mb-2">
                Key
              </Label>
              <Input id="env-key" value={key1} readOnly />
              <Input id="env-key2" value={key2} readOnly className="mt-2" />
            </div>
            <div className="flex-col flex-1">
              <Label htmlFor="env-value" className="mb-2">
                Value
              </Label>
              <Input id="env-value" placeholder="Enter value" />
              <Input id="env-value2" placeholder="Enter key" className="mt-2" />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between gap-2 border-t p-2">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size={"icon"}
                  variant={"outline"}
                  className="rounded-full"
                >
                  <CircleQuestionMark />
                </Button>
              </TooltipTrigger>
              <TooltipContent showArrow={true} className="w-40">
                <p>
                  Keep your environment keys secure and never share them
                  publicly.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button size={"sm"}>Save</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
