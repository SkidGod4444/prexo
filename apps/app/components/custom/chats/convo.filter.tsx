"use client";

import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ArrowUp, ArrowDown, ListIcon, CircleDashed } from "lucide-react";

const items = [
  {
    label: "All Conversations",
    value: "all",
    icon: ListIcon,
    desc: "View all conversations",
  },
  {
    label: "Escalated",
    value: "escalated",
    icon: ArrowUp,
    desc: "Conversation requires human intervention",
  },
  {
    label: "Unresolved",
    value: "unresolved",
    icon: CircleDashed,
    desc: "Conversation still open",
  },
  {
    label: "Resolved",
    value: "resolved",
    icon: ArrowDown,
    desc: "Solved conversations",
  },
];

interface ConvoFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ConvoFilter({ value, onChange }: ConvoFilterProps) {
  const selectedItem = items.find((item) => item.value === value) || items[0];

  return (
    <Select
      value={selectedItem}
      onValueChange={(item) => onChange(item.value)}
      itemToStringValue={(item) => item.value}
      aria-label="Search conversations by filter"
    >
      <SelectTrigger className="w-[220px]">
        <SelectValue>
          {(item) => (
            <span className="flex items-center gap-2">
              <item.icon className="size-4 opacity-72" />
              <span className="flex flex-col truncate">
                {item.label}
                <span className="truncate text-xs text-muted-foreground">
                  {item.desc}
                </span>
              </span>
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectPopup>
        {items.map((item) => (
          <SelectItem key={item.value} value={item} className="cursor-pointer">
            <span className="flex items-center gap-2">
              <item.icon className="size-4 opacity-72" />
              <span className="flex flex-col truncate">
                {item.label}
                <span className="truncate text-xs text-muted-foreground">
                  {item.desc}
                </span>
              </span>
            </span>
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  );
}
