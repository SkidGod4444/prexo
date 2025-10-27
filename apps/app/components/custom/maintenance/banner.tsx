import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";

export default function MaintenanceBanner() {
  return (
    <div className="w-full border-b border-yellow-400/50 bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-100 dark:from-yellow-800 dark:via-yellow-700 dark:to-yellow-800 px-6 py-3 shadow-md flex items-center justify-between">
      <div className="flex items-center gap-3">
        <TriangleAlert className="shrink-0" size={25} aria-hidden="true" />
        <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-2">
          <span className="text-sm font-medium">
            The site is currently under{" "}
            <span className="font-bold underline">maintenance mode</span>. Some
            features may be unavailable or change unexpectedly.
          </span>
        </div>
      </div>

      <Button variant={"outline"} size="sm" className="bg-yellow-50 dark:bg-yellow-900">
        <a
          href="https://status.example.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Status Page
        </a>
      </Button>
    </div>
  );
}
