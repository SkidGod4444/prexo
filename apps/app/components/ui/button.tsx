import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px] focus-visible:border-[var(--primary)] before:absolute before:inset-0 before:rounded-md before:pointer-events-none before:transition-opacity",
  {
    variants: {
      variant: {
        destructive:
          "text-primary-foreground bg-red-800 transition duration-300 ease-[cubic-bezier(0.455,0.03,0.515,0.955)] shadow-[0_2px_8px_0_rgba(0,0,0,0.22),inset_0_0_0_1px_#ffffff1f,inset_0_2px_3px_#ffffff1a,inset_0_-4px_1px_#00000029] border border-red-900/60 hover:bg-red-800/90 active:scale-[0.97] focus-visible:ring-red-500",
        warn: "text-primary-foreground bg-yellow-600 transition duration-300 ease-[cubic-bezier(0.455,0.03,0.515,0.955)] shadow-[0_2px_8px_0_rgba(0,0,0,0.22),inset_0_0_0_1px_#ffffff1f,inset_0_2px_3px_#ffffff1a,inset_0_-4px_1px_#00000029] border border-yellow-600/60 hover:bg-yellow-600/90 active:scale-[0.97]",
        annc: "text-primary-foreground bg-blue-600 transition duration-300 ease-[cubic-bezier(0.455,0.03,0.515,0.955)] shadow-[0_2px_8px_0_rgba(0,0,0,0.22),inset_0_0_0_1px_#ffffff1f,inset_0_2px_3px_#ffffff1a,inset_0_-4px_1px_#00000029] border border-blue-600/60 hover:bg-blue-600/90 active:scale-[0.90]",
        secondary:
          "text-primary-foreground bg-secondary border transition duration-300 ease-[cubic-bezier(0.455,0.03,0.515,0.955)] shadow-[0_2px_8px_0_rgba(0,0,0,0.22),inset_0_0_0_1px_#ffffff1f,inset_0_2px_3px_#ffffff1a,inset_0_-4px_1px_#00000029] border border-secondary/60 hover:bg-secondary/80 active:scale-[0.97] focus-visible:ring-secondary",
        outline:
          "text-secondary-foreground bg-secondary transition duration-300 ease-[cubic-bezier(0.455,0.03,0.515,0.955)] shadow-[0_2px_8px_0_rgba(0,0,0,0.22),inset_0_0_0_1px_#ffffff1f,inset_0_2px_3px_#ffffff1a,inset_0_-4px_1px_#00000029] border border-secondary/60 hover:bg-secondary/80 active:scale-[0.97] focus-visible:ring-secondary",
        ghost:
          "text-primary-foreground bg-transparent hover:bg-secondary/50 hover:text-accent-foreground active:scale-[0.97]",
        link: "text-primary underline underline-offset-4 transition duration-300 ease-[cubic-bezier(0.455,0.03,0.515,0.955)] shadow-[0_2px_8px_0_rgba(0,0,0,0.22),inset_0_0_0_1px_#ffffff1f,inset_0_2px_3px_#ffffff1a,inset_0_-4px_1px_#00000029] hover:underline active:scale-[0.97] focus-visible:ring-ring bg-transparent border-0 px-0",
        default:
          "text-primary-foreground bg-primary transition duration-300 ease-[cubic-bezier(0.455,0.03,0.515,0.955)] shadow-[0_2px_8px_0_rgba(0,0,0,0.22),inset_0_0_0_1px_#ffffff1f,inset_0_2px_3px_#ffffff1a,inset_0_-4px_1px_#00000029] border border-primary/60 hover:bg-primary/60 active:scale-[0.97]",
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
  const Comp = (asChild ? Slot : "button") as React.ElementType;

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ size, variant, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
