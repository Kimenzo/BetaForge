import { cn } from "@/lib/utils";
import { Loader2, Sparkles } from "lucide-react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  variant?: "default" | "neural" | "dots";
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
};

export function Spinner({
  size = "md",
  className,
  variant = "default",
}: SpinnerProps) {
  if (variant === "neural") {
    return (
      <div className={cn("relative", sizeClasses[size], className)}>
        <div className="absolute inset-0 rounded-full border-2 border-neural/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-neural-bright animate-spin" />
        <div className="absolute inset-1 rounded-full border border-transparent border-t-electric-cyan animate-spin-slow" />
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-neural-bright animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    );
  }

  return (
    <Loader2
      className={cn(
        "animate-spin text-neural-bright",
        sizeClasses[size],
        className
      )}
    />
  );
}

interface LoadingProps {
  message?: string;
  variant?: "default" | "neural" | "fullscreen";
}

export function Loading({
  message = "Loading...",
  variant = "default",
}: LoadingProps) {
  if (variant === "fullscreen") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-void-black/90 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-6 animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 bg-neural/20 blur-3xl rounded-full animate-pulse" />
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-neural to-electric-cyan flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner variant="dots" />
            <p className="text-phantom-gray text-sm">{message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "neural") {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-6">
        <div className="relative">
          <div className="absolute inset-0 bg-neural/10 blur-2xl rounded-full animate-pulse" />
          <Spinner size="xl" variant="neural" />
        </div>
        <p className="text-phantom-gray text-sm animate-pulse">{message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <Spinner size="lg" variant="neural" />
      <p className="text-phantom-gray text-sm">{message}</p>
    </div>
  );
}

// Skeleton loader for content placeholders
interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
}

export function Skeleton({
  className,
  variant = "rectangular",
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "shimmer",
        variant === "circular" && "rounded-full",
        variant === "text" && "h-4 rounded-md",
        variant === "rectangular" && "rounded-xl",
        className
      )}
    />
  );
}

// Pulsing placeholder for cards
export function CardSkeleton() {
  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton variant="text" className="w-48" />
        </div>
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" className="w-full" />
        <Skeleton variant="text" className="w-3/4" />
      </div>
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}
