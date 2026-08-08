"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  color?: string;
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  color = "bg-primary",
  label,
  showPercentage = false,
  className,
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("w-full", className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-xs text-muted font-medium">{label}</span>
          )}
          {showPercentage && (
            <span className="text-xs text-muted font-medium">
              {Math.round(clampedValue)}%
            </span>
          )}
        </div>
      )}
      <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            color,
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}
