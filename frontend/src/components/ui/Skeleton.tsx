import { cn } from "@/lib/utils";

type SkeletonVariant = "text" | "card" | "avatar" | "button";

interface SkeletonProps {
  variant?: SkeletonVariant;
  className?: string;
  count?: number;
}

const variantStyles: Record<SkeletonVariant, string> = {
  text: "h-4 rounded-md",
  card: "h-40 rounded-2xl",
  avatar: "h-12 w-12 rounded-full",
  button: "h-10 w-24 rounded-xl",
};

export function Skeleton({
  variant = "text",
  className,
  count = 1,
}: SkeletonProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "animate-pulse",
            "bg-white/5 backdrop-blur-sm",
            "relative overflow-hidden before:absolute before:inset-0",
            "before:-translate-x-full before:animate-[shimmer_2s_infinite]",
            "before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
            variantStyles[variant],
            className,
          )}
        />
      ))}
    </div>
  );
}
