import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "focus-ring h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3 text-sm placeholder:text-slate-500",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
