import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "cta" | "outline" | "success";
};

const variants: Record<string, string> = {
  default: "border-transparent bg-secondary text-secondary-foreground",
  cta: "border-transparent bg-cta/15 text-cta-foreground",
  outline: "border-border bg-transparent text-foreground",
  success: "border-transparent bg-success/15 text-success",
};

export const Badge = ({
  className,
  variant = "default",
  ...props
}: BadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
      variants[variant],
      className,
    )}
    {...props}
  />
);
