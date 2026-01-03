// ============================================================================
// Readiness Probe Endpoint
// ============================================================================
// Indicates if the service is ready to accept traffic
// Used by Kubernetes for rolling deployments
// ============================================================================

import { NextResponse } from "next/server";
import { isSupabaseConfigured, createServerClient } from "@/lib/supabase";

interface ReadinessStatus {
  ready: boolean;
  timestamp: string;
}

export async function GET(): Promise<NextResponse<ReadinessStatus>> {
  let ready = true;

  // Check database connectivity for readiness
  if (isSupabaseConfigured) {
    try {
      const supabase = createServerClient();
      const { error } = await supabase
        .from("projects")
        .select("id", { head: true })
        .limit(1);

      if (error) {
        ready = false;
      }
    } catch {
      ready = false;
    }
  }

  const response: ReadinessStatus = {
    ready,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response, { status: ready ? 200 : 503 });
}
