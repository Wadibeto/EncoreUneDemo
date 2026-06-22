import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "focus-ring min-h-24 w-full resize-y rounded-xl border border-white/10 bg-black/20 p-3 text-sm placeholder:text-slate-500",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
