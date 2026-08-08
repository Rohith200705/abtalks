import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "info"
  | "easy"
  | "medium"
  | "hard";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-white/5 text-muted border border-border",
  success: "bg-success/10 text-success border border-success/20",
  warning: "bg-warning/10 text-warning border border-warning/20",
  info: "bg-primary/10 text-primary border border-primary/20",
  easy: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  medium: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  hard: "bg-red-500/10 text-red-400 border border-red-500/20",
};

export function Badge({
  variant = "default",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
