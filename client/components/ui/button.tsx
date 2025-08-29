import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 select-none whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 disabled:pointer-events-none disabled:opacity-50 backdrop-blur-xl active:translate-y-[1px] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        liquid:
          "text-white bg-gradient-to-br from-brand-500 to-brand-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_20px_-5px_rgba(0,0,0,0.3)] ring-1 ring-white/30 before:content-[''] before:absolute before:inset-0 before:rounded-xl before:bg-white/20 before:mix-blend-overlay before:opacity-0 hover:before:opacity-100 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_14px_28px_-10px_rgba(0,0,0,0.35)]",
        destructive:
          "text-white bg-gradient-to-br from-red-500 to-red-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_10px_20px_-5px_rgba(0,0,0,0.25)] ring-1 ring-white/20 hover:brightness-105",
        outline:
          "text-foreground bg-white/30 ring-1 ring-white/40 border border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_8px_24px_rgba(0,0,0,0.08)] hover:bg-white/40",
        secondary:
          "text-foreground bg-white/60 dark:bg-white/10 ring-1 ring-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_8px_24px_rgba(0,0,0,0.12)] hover:bg-white/70 dark:hover:bg-white/15",
        ghost: "text-foreground bg-transparent hover:bg-white/20",
        link: "text-brand-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 rounded-2xl px-8",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "liquid",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
