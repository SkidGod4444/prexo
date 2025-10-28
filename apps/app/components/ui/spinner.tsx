import { Loader } from "lucide-react";

import { cn } from "@/lib/utils";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader
      role="status"
      aria-label="Loading"
      className={cn("size-2 animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
