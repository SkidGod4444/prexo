import { WarningIcon } from "@/components/custom/icons";
import React from "react";

export default function RulesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <WarningIcon />
      <h1 className="text-2xl font-semibold">Rules - Coming Soon!</h1>
      <p className="mt-2 text-muted-foreground">
        We&apos;re working hard to bring you this feature. Stay tuned!
      </p>
    </div>
  );
}
