// ===========================================
// 🚀 WEB VITALS MONITORING COMPONENT
// Track and report Core Web Vitals
// ===========================================

"use client";

import { useEffect, useCallback, useRef } from "react";
import {
  measureWebVitals,
  reportPerformance,
  type PerformanceReport,
} from "@/lib/performance/monitoring";

interface WebVitalsProps {
  /** Callback when a metric is measured */
  onReport?: (report: PerformanceReport) => void;
  /** Enable console logging in development */
  debug?: boolean;
  /** Send metrics to analytics endpoint */
  sendToAnalytics?: boolean;
}

/**
 * WebVitals component - invisible, measures and reports performance
 * Add this to your root layout for global monitoring
 */
export function WebVitals({
  onReport,
  debug = process.env.NODE_ENV === "development",
  sendToAnalytics = process.env.NODE_ENV === "production",
}: WebVitalsProps) {
  const reportsRef = useRef<PerformanceReport[]>([]);

  const handleReport = useCallback(
    (report: PerformanceReport) => {
      // Store report
      reportsRef.current.push(report);

      // Debug logging
      if (debug) {
        const emoji =
          report.rating === "good"
            ? "✅"
            : report.rating === "poor"
            ? "❌"
            : "⚠️";
        console.log(
          `%c${emoji} ${report.metric}: ${report.value.toFixed(2)}ms`,
          `color: ${
            report.rating === "good"
              ? "#10B981"
              : report.rating === "poor"
              ? "#EF4444"
              : "#F59E0B"
          }`
        );
      }

      // Send to analytics
      if (sendToAnalytics) {
        reportPerformance(report);
      }

      // Custom callback
      onReport?.(report);
    },
    [debug, sendToAnalytics, onReport]
  );

  useEffect(() => {
    // Start measuring Web Vitals
    measureWebVitals(handleReport);

    // Log summary on unmount in dev
    return () => {
      if (debug && reportsRef.current.length > 0) {
        console.group("📊 Web Vitals Summary");
        reportsRef.current.forEach((r) => {
          console.log(`${r.metric}: ${r.value.toFixed(2)}ms (${r.rating})`);
        });
        console.groupEnd();
      }
    };
  }, [handleReport, debug]);

  // This component renders nothing
  return null;
}

/**
 * Performance debug overlay (development only)
 */
export function PerformanceDebugOverlay() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 p-3 rounded-lg bg-void-surface/90 backdrop-blur-sm border border-neural/20 text-xs font-mono">
      <div className="flex items-center gap-2 text-phantom-gray">
        <span className="w-2 h-2 rounded-full bg-quantum-green animate-pulse" />
        <span>Performance Monitor Active</span>
      </div>
    </div>
  );
}
