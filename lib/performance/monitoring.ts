// ===========================================
// 🚀 PERFORMANCE MONITORING
// Track Web Vitals & performance metrics
// ===========================================

import type { Metric } from "web-vitals";

// Performance thresholds (top 1% targets)
const THRESHOLDS = {
  LCP: { good: 1200, poor: 2500 }, // Largest Contentful Paint
  FID: { good: 50, poor: 100 }, // First Input Delay
  CLS: { good: 0.05, poor: 0.1 }, // Cumulative Layout Shift
  FCP: { good: 900, poor: 1800 }, // First Contentful Paint
  TTFB: { good: 200, poor: 500 }, // Time to First Byte
  INP: { good: 100, poor: 200 }, // Interaction to Next Paint
};

export type MetricName = keyof typeof THRESHOLDS;

export interface PerformanceReport {
  metric: MetricName;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  timestamp: number;
}

/**
 * Rate a metric value based on thresholds
 */
function rateMetric(
  name: MetricName,
  value: number
): PerformanceReport["rating"] {
  const threshold = THRESHOLDS[name];
  if (!threshold) return "needs-improvement";
  if (value <= threshold.good) return "good";
  if (value <= threshold.poor) return "needs-improvement";
  return "poor";
}

/**
 * Measure Web Vitals with callback
 * Import dynamically in client components only
 */
export async function measureWebVitals(
  callback: (report: PerformanceReport) => void
): Promise<void> {
  if (typeof window === "undefined") return;

  const { onLCP, onFID, onCLS, onFCP, onTTFB, onINP } = await import(
    "web-vitals"
  );

  const handleMetric = (metric: Metric) => {
    const name = metric.name as MetricName;
    callback({
      metric: name,
      value: metric.value,
      rating: rateMetric(name, metric.value),
      timestamp: Date.now(),
    });
  };

  onLCP(handleMetric);
  onFID(handleMetric);
  onCLS(handleMetric);
  onFCP(handleMetric);
  onTTFB(handleMetric);
  onINP(handleMetric);
}

/**
 * Performance Monitor class for advanced tracking
 */
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  private marks: Map<string, number> = new Map();

  /**
   * Start a performance mark
   */
  mark(name: string): void {
    this.marks.set(name, performance.now());
  }

  /**
   * Measure time since mark
   */
  measure(name: string, markName?: string): number {
    const start = markName ? this.marks.get(markName) : 0;
    const duration = performance.now() - (start || 0);

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(duration);

    return duration;
  }

  /**
   * Get average time for a measurement
   */
  getAverage(name: string): number {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  /**
   * Get P95 time for a measurement
   */
  getP95(name: string): number {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.floor(sorted.length * 0.95);
    return sorted[index];
  }

  /**
   * Clear all measurements
   */
  clear(): void {
    this.metrics.clear();
    this.marks.clear();
  }

  /**
   * Get full report
   */
  getReport(): Record<string, { avg: number; p95: number; count: number }> {
    const report: Record<string, { avg: number; p95: number; count: number }> =
      {};

    this.metrics.forEach((values, name) => {
      report[name] = {
        avg: this.getAverage(name),
        p95: this.getP95(name),
        count: values.length,
      };
    });

    return report;
  }
}

/**
 * Report performance to analytics endpoint
 */
export function reportPerformance(report: PerformanceReport): void {
  // Log in development
  if (process.env.NODE_ENV === "development") {
    const emoji =
      report.rating === "good" ? "✅" : report.rating === "poor" ? "❌" : "⚠️";
    console.log(
      `${emoji} ${report.metric}: ${report.value.toFixed(2)}ms (${
        report.rating
      })`
    );
  }

  // Send to analytics in production
  if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
    const url = "/api/analytics/performance";
    const data = JSON.stringify(report);
    navigator.sendBeacon(url, data);
  }
}

/**
 * Create a global performance monitor instance
 */
export const globalMonitor = new PerformanceMonitor();
