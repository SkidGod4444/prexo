"use client";

import React from "react";
import { Button } from "../button";
import { changelogConfig } from "@prexo/utils/config";
import { toast } from "sonner";

const handleCopy = (date: string) => {
  navigator.clipboard.writeText(`${changelogConfig.url}/c/${date}`);
  toast.success("Copied to clipboard!");
};

export default function VersionBadge({
  version,
  date,
}: {
  version: string;
  date: string;
}) {
  return (
    <Button
      variant={"outline"}
      size={"sm"}
      onClick={() => handleCopy(date)}
      className="cursor-pointer"
    >
      v-{version}
    </Button>
  );
}
