import { NextRequest, NextResponse } from "next/server";

// ===========================================
// 🚀 PERFORMANCE ANALYTICS ENDPOINT
// Receives Web Vitals metrics from client
// ===========================================

// Use Edge Runtime for fastest response
export const runtime = "edge";

// Store metrics in memory (in production, use a real analytics service)
const metricsBuffer: Array<{
  metric: string;
  value: number;
  rating: string;
  timestamp: number;
  userAgent?: string;
  pathname?: string;
}> = [];

// Flush buffer to analytics service every 10 seconds
const FLUSH_INTERVAL = 10000;
let lastFlush = Date.now();

async function flushMetrics() {
  if (metricsBuffer.length === 0) return;

  // In production, send to your analytics service
  // Example: await fetch('https://analytics.example.com/vitals', {
  //   method: 'POST',
  //   body: JSON.stringify(metricsBuffer),
  // });

  // Log summary in development
  if (process.env.NODE_ENV === "development") {
    const summary = metricsBuffer.reduce((acc, m) => {
      acc[m.metric] = acc[m.metric] || { total: 0, count: 0, good: 0, poor: 0 };
      acc[m.metric].total += m.value;
      acc[m.metric].count += 1;
      if (m.rating === "good") acc[m.metric].good += 1;
      if (m.rating === "poor") acc[m.metric].poor += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number; good: number; poor: number }>);

    console.log("📊 Web Vitals Summary:", summary);
  }

  // Clear buffer
  metricsBuffer.length = 0;
  lastFlush = Date.now();
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate metric data
    if (!data.metric || typeof data.value !== "number") {
      return NextResponse.json(
        { error: "Invalid metric data" },
        { status: 400 }
      );
    }

    // Add to buffer
    metricsBuffer.push({
      metric: data.metric,
      value: data.value,
      rating: data.rating || "unknown",
      timestamp: data.timestamp || Date.now(),
      userAgent: request.headers.get("user-agent") || undefined,
      pathname: request.headers.get("referer") || undefined,
    });

    // Flush if buffer is large or enough time has passed
    if (metricsBuffer.length >= 100 || Date.now() - lastFlush > FLUSH_INTERVAL) {
      await flushMetrics();
    }

    return NextResponse.json(
      { success: true },
      {
        status: 200,
        headers: {
          // No caching for analytics
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Failed to process metric" },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve metrics summary (for dashboards)
export async function GET(request: NextRequest) {
  const summary = metricsBuffer.reduce((acc, m) => {
    if (!acc[m.metric]) {
      acc[m.metric] = { avg: 0, count: 0, good: 0, poor: 0 };
    }
    acc[m.metric].count += 1;
    acc[m.metric].avg = (acc[m.metric].avg * (acc[m.metric].count - 1) + m.value) / acc[m.metric].count;
    if (m.rating === "good") acc[m.metric].good += 1;
    if (m.rating === "poor") acc[m.metric].poor += 1;
    return acc;
  }, {} as Record<string, { avg: number; count: number; good: number; poor: number }>);

  return NextResponse.json({ summary, bufferSize: metricsBuffer.length });
}
