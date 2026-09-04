import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-xs uppercase tracking-[0.14em] font-semibold cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-violet text-ivory hover:bg-violet/90 shadow-sm",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-border bg-transparent text-ink hover:bg-lavender/60 hover:text-ink",
        secondary: "bg-royal text-white hover:bg-royal/90",
        ghost: "hover:bg-lavender/40 hover:text-violet",
        link: "text-violet underline-offset-4 hover:underline",
        editorial: "border border-ink/20 text-ink bg-transparent hover:bg-ink hover:text-ivory",
        hero: "bg-ivory text-ink hover:bg-violet hover:text-ivory shadow-sm px-6",
        heroOutline: "border border-ivory/40 text-ivory hover:border-ivory hover:bg-ivory/10 px-6",
        violetAction: "bg-violet text-ivory hover:bg-royal shadow-sm",
        linkDark: "text-ink hover:text-violet",
        linkLight: "text-ivory hover:text-lavender",
        iconGhost: "border border-border text-ink hover:border-violet hover:text-violet",
        iconLight: "border border-ivory/30 text-ivory hover:border-ivory hover:text-lavender",
        choice:
          "min-h-20 bg-ivory text-ink hover:bg-lavender/60 border border-border text-sm font-bold tracking-normal uppercase-none",
        choiceActive:
          "min-h-20 bg-violet text-ivory border border-violet text-sm font-bold tracking-normal uppercase-none",
        mobileBar:
          "border-r border-border bg-ivory text-ink hover:bg-lavender/60 tracking-wider text-[11px]",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 px-4 text-[11px]",
        lg: "h-14 px-8 text-xs",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
