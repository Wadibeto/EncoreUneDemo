import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "focus-ring inline-flex shrink-0 items-center justify-center gap-2 rounded-sm text-sm font-semibold transition duration-200 active:translate-y-px disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        default: "border border-[#efad86] bg-[#e9cc9e] text-[#271a15] shadow-[inset_0_0_0_2px_#271a1520,0_3px_0_#0005] hover:border-[#ffd5ab] hover:bg-[#f2d8b2]",
        secondary: "border border-[#6e5140] bg-[#2a211c] text-[#ead8b8] hover:border-[#d18d6b] hover:bg-[#3b2922]",
        ghost: "text-slate-300 hover:bg-white/[0.06] hover:text-foreground",
        danger: "bg-red-500/90 text-white hover:bg-red-500",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 rounded-sm px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "size-10 p-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { buttonVariants };
