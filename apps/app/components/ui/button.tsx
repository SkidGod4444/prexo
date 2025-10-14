import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px] focus-visible:border-[var(--primary)] before:absolute before:inset-0 before:rounded-md before:pointer-events-none before:transition-opacity",
  {
    variants: {
      variant: {
        default:
          "bg-primary hover:bg-primary/50 text-primary-foreground shadow-[0px_0px_0px_1.5px_rgb(0_0_0/.30),inset_0px_1px_1px_0_rgb(255_255_255/.20)] focus-visible:ring-primary",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 focus-visible:ring-destructive",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 focus-visible:ring-secondary",
        ghost:
          "hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring",
        link: "text-primary underline-offset-4 hover:underline focus-visible:ring-ring",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  },
);

function Button({
  className,
  size,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ size, variant, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
