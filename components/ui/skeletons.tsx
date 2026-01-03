// ===========================================
// 🚀 SKELETON LOADING COMPONENTS
// Instant perceived performance
// ===========================================

"use client";

import { cn } from "@/lib/utils";
import { memo } from "react";

interface SkeletonProps {
  className?: string;
  animate?: boolean;
  style?: React.CSSProperties;
}

/**
 * Base skeleton component with shimmer animation
 */
export const Skeleton = memo(function Skeleton({ 
  className, 
  animate = true,
  style
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-void-elevated rounded-lg",
        animate && "skeleton-shimmer",
        className
      )}
      style={style}
      aria-hidden="true"
    />
  );
});

/**
 * Text skeleton with multiple lines
 */
export const TextSkeleton = memo(function TextSkeleton({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4",
            i === lines - 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  );
});

/**
 * Avatar skeleton
 */
export const AvatarSkeleton = memo(function AvatarSkeleton({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  return (
    <Skeleton className={cn("rounded-full", sizes[size], className)} />
  );
});

/**
 * Card skeleton for project/report cards
 */
export const CardSkeleton = memo(function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-void-surface/80 border border-white/5 rounded-2xl p-6 space-y-4",
        className
      )}
      aria-hidden="true"
    >
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <TextSkeleton lines={2} />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
});

/**
 * Metric card skeleton
 */
export const MetricCardSkeleton = memo(function MetricCardSkeleton({ 
  className 
}: { 
  className?: string 
}) {
  return (
    <div
      className={cn(
        "bg-void-surface/80 border border-white/5 rounded-2xl p-6",
        className
      )}
      aria-hidden="true"
    >
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="w-8 h-8 rounded-lg" />
        <Skeleton className="w-16 h-5 rounded-full" />
      </div>
      <Skeleton className="h-8 w-20 mb-2" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
});

/**
 * Table skeleton
 */
export const TableSkeleton = memo(function TableSkeleton({
  rows = 5,
  columns = 4,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)} aria-hidden="true">
      {/* Header */}
      <div className="flex gap-4 pb-3 border-b border-white/5">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 py-2">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              className={cn(
                "h-4 flex-1",
                colIndex === 0 && "flex-[2]"
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
});

/**
 * Dashboard skeleton - full page
 */
export const DashboardSkeleton = memo(function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in" aria-hidden="true">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-6 w-32" />
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="bg-void-surface/80 border border-white/5 rounded-2xl p-4 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <AvatarSkeleton size="sm" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-2 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

/**
 * List skeleton
 */
export const ListSkeleton = memo(function ListSkeleton({
  items = 5,
  showAvatar = true,
  className,
}: {
  items?: number;
  showAvatar?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)} aria-hidden="true">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-void-surface/50">
          {showAvatar && <AvatarSkeleton size="sm" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  );
});

/**
 * Chart skeleton
 */
export const ChartSkeleton = memo(function ChartSkeleton({ 
  className,
  type = "bar",
}: { 
  className?: string;
  type?: "bar" | "line" | "pie";
}) {
  return (
    <div 
      className={cn(
        "bg-void-surface/80 border border-white/5 rounded-2xl p-6",
        className
      )} 
      aria-hidden="true"
    >
      <Skeleton className="h-5 w-32 mb-4" />
      <div className="h-48 flex items-end gap-2">
        {type === "bar" && Array.from({ length: 7 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-t"
            style={{ height: `${30 + Math.random() * 70}%` }}
          />
        ))}
        {type === "line" && (
          <Skeleton className="w-full h-full rounded-lg opacity-50" />
        )}
        {type === "pie" && (
          <Skeleton className="w-32 h-32 rounded-full mx-auto" />
        )}
      </div>
    </div>
  );
});

/**
 * Agent card skeleton
 */
export const AgentCardSkeleton = memo(function AgentCardSkeleton({ 
  className 
}: { 
  className?: string 
}) {
  return (
    <div
      className={cn(
        "bg-void-surface/80 border border-white/5 rounded-2xl p-6",
        className
      )}
      aria-hidden="true"
    >
      <div className="flex items-center gap-4 mb-4">
        <Skeleton className="w-14 h-14 rounded-2xl" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <TextSkeleton lines={3} />
      <div className="flex gap-2 mt-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-16 rounded-full" />
        ))}
      </div>
    </div>
  );
});
