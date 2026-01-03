// ============================================================================
// Liveness Probe Endpoint
// ============================================================================
// Simple endpoint to check if the process is alive
// Used by Kubernetes to restart stuck containers
// ============================================================================

import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { alive: true, timestamp: new Date().toISOString() },
    { status: 200 }
  );
}
