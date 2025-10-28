import { Megaphone, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MaintenanceBanner() {
  return (
    <div className="w-full border-b border-yellow-400/50 bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-100 dark:from-yellow-800 dark:via-yellow-700 dark:to-yellow-800 px-4 md:px-6 py-3 shadow-md flex flex-col md:flex-row md:items-center md:justify-between items-start gap-3">
      <div className="flex items-start md:items-center gap-2 w-full md:w-auto">
        <TriangleAlert
          className="shrink-0 mt-0.5 md:mt-0"
          size={25}
          aria-hidden="true"
        />
        <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-2">
          <span className="text-sm font-medium">
            The site is currently under{" "}
            <span className="font-bold underline">maintenance mode</span>. Some
            features may be unavailable or change unexpectedly.
          </span>
        </div>
      </div>

      <div className="w-full md:w-auto flex md:justify-end">
        <Link
          href="https://status.example.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full md:w-auto"
        >
          <Button
            variant={"warn"}
            size="sm"
            className="w-full md:w-auto bg-yellow-50 dark:bg-yellow-800"
          >
            <Megaphone /> <span className="ml-1">Read Notification</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
