import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "focus-ring inline-flex shrink-0 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition duration-200 active:translate-y-px disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        default: "border border-[#d1bb87] bg-[#d1bb87] text-[#24291e] hover:border-[#e5d3aa] hover:bg-[#e5d3aa]",
        secondary: "border border-[#494e3b] bg-[#252b20] text-[#e8e2ce] hover:border-[#85876c] hover:bg-[#303729]",
        ghost: "text-slate-300 hover:bg-white/[0.06] hover:text-foreground",
        danger: "bg-red-500/90 text-white hover:bg-red-500",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 rounded-lg px-3 text-xs",
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
