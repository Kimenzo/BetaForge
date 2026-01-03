// ============================================================================
// Health Check Endpoint
// ============================================================================
// Production-ready health checks for:
// - Kubernetes liveness/readiness probes
// - Load balancer health checks
// - Monitoring systems
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/core/config";
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase";
import { getVectorStore } from "@/lib/datastores/vector-store";
import { getCacheStore } from "@/lib/datastores/cache-store";

interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  version: string;
  uptime: number;
  checks: Record<
    string,
    {
      status: "pass" | "warn" | "fail";
      latencyMs?: number;
      message?: string;
    }
  >;
}

const startTime = Date.now();

export async function GET(request: NextRequest): Promise<NextResponse<HealthStatus>> {
  const url = new URL(request.url);
  const verbose = url.searchParams.get("verbose") === "true";

  const checks: HealthStatus["checks"] = {};
  let overallStatus: HealthStatus["status"] = "healthy";

  // Check Supabase connection
  if (isSupabaseConfigured) {
    try {
      const start = performance.now();
      const supabase = createServerClient();
      
      // Simple query to check connection
      const { error } = await supabase
        .from("projects")
        .select("id", { count: "exact", head: true })
        .limit(1);

      const latency = Math.round(performance.now() - start);

      if (error) {
        checks.database = { status: "fail", latencyMs: latency, message: error.message };
        overallStatus = "unhealthy";
      } else {
        checks.database = { status: "pass", latencyMs: latency };
      }
    } catch (e) {
      checks.database = { status: "fail", message: String(e) };
      overallStatus = "unhealthy";
    }
  } else {
    checks.database = { status: "warn", message: "Supabase not configured" };
    if (overallStatus === "healthy") overallStatus = "degraded";
  }

  // Check Anthropic API
  if (config.isAnthropicConfigured) {
    checks.anthropic = { status: "pass", message: "API key configured" };
  } else {
    checks.anthropic = { status: "warn", message: "API key not configured" };
    if (overallStatus === "healthy") overallStatus = "degraded";
  }

  // Check Vector Store
  try {
    const vectorStore = getVectorStore();
    const health = await vectorStore.healthCheck();
    checks.vectorStore = {
      status: health.healthy ? "pass" : "warn",
      latencyMs: health.latencyMs,
      message: health.message,
    };
  } catch (e) {
    checks.vectorStore = { status: "warn", message: String(e) };
  }

  // Check Cache Store
  try {
    const cacheStore = getCacheStore();
    const health = await cacheStore.healthCheck();
    checks.cacheStore = {
      status: health.healthy ? "pass" : "warn",
      latencyMs: health.latencyMs,
      message: health.message,
    };
  } catch (e) {
    checks.cacheStore = { status: "warn", message: String(e) };
  }

  // Check Auth configuration
  if (config.isAuthConfigured) {
    checks.auth = { status: "pass", message: "Auth provider configured" };
  } else {
    checks.auth = { status: "warn", message: "Auth not configured (guest mode)" };
  }

  const response: HealthStatus = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "0.1.0",
    uptime: Math.round((Date.now() - startTime) / 1000),
    checks: verbose ? checks : {},
  };

  // Return 503 if unhealthy (for load balancers)
  const statusCode = overallStatus === "unhealthy" ? 503 : 200;

  return NextResponse.json(response, { status: statusCode });
}
