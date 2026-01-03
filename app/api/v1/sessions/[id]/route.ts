// ============================================================================
// BetaForge Public API v1 - Single Session Endpoint
// ============================================================================
// GET /api/v1/sessions/:id - Get session status and results
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api/auth";
import { createServerClient } from "@/lib/supabase";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  // Validate API key
  const auth = await validateApiKey(request);
  if (!auth.valid) {
    return NextResponse.json(
      {
        error: "unauthorized",
        message: auth.error,
      },
      { status: 401 }
    );
  }

  const { id: sessionId } = await context.params;

  if (!sessionId) {
    return NextResponse.json(
      {
        error: "bad_request",
        message: "Session ID is required",
      },
      { status: 400 }
    );
  }

  // Check for demo session
  if (sessionId.startsWith("demo_") || sessionId.startsWith("sess_")) {
    // For demo/test sessions, return mock data
    const isCompleted = Date.now() % 2 === 0; // Random for demo
    
    return NextResponse.json({
      id: sessionId,
      projectId: "demo-project",
      projectName: "Demo Project",
      status: isCompleted ? "completed" : "running",
      progress: isCompleted ? 100 : Math.floor(Math.random() * 80) + 10,
      bugsFound: isCompleted ? 3 : 1,
      summary: isCompleted
        ? {
            total: 3,
            critical: 0,
            high: 1,
            medium: 1,
            low: 1,
          }
        : null,
      agents: [
        { name: "Sarah", status: isCompleted ? "completed" : "running", progress: isCompleted ? 100 : 75 },
        { name: "Marcus", status: isCompleted ? "completed" : "running", progress: isCompleted ? 100 : 50 },
        { name: "Diego", status: isCompleted ? "completed" : "queued", progress: isCompleted ? 100 : 0 },
      ],
      startedAt: new Date(Date.now() - 300000).toISOString(),
      completedAt: isCompleted ? new Date().toISOString() : null,
      dashboardUrl: `https://app.betaforge.ai/sessions/${sessionId}`,
    });
  }

  const supabase = createServerClient();

  // Fetch session with related data
  const { data: session, error } = await supabase
    .from("test_sessions")
    .select(
      `
      *,
      projects (
        id,
        name,
        access_url
      ),
      agent_executions (
        id,
        agent_id,
        agent_name,
        status,
        progress,
        started_at,
        completed_at
      )
    `
    )
    .eq("id", sessionId)
    .single();

  if (error || !session) {
    return NextResponse.json(
      {
        error: "not_found",
        message: "Session not found",
      },
      { status: 404 }
    );
  }

  // Get execution IDs for this session
  const executionIds = (session.agent_executions as Array<{ id: string }> | null)?.map(e => e.id) || [];
  
  // Fetch bugs for the session's agent executions
  let bugs: Array<{
    id: string;
    title: string;
    severity: string;
    agent_name: string | null;
    created_at: string | null;
  }> = [];
  
  if (executionIds.length > 0) {
    const { data: bugData } = await supabase
      .from("bug_reports")
      .select("id, title, severity, agent_name, created_at")
      .in("execution_id", executionIds);
    bugs = bugData || [];
  }

  const summary = {
    total: bugs.length,
    critical: bugs.filter((b) => b.severity === "critical").length,
    high: bugs.filter((b) => b.severity === "high").length,
    medium: bugs.filter((b) => b.severity === "medium").length,
    low: bugs.filter((b) => b.severity === "low").length,
  };

  return NextResponse.json({
    id: session.id,
    projectId: session.project_id,
    projectName: (session.projects as Record<string, unknown> | null)?.name || null,
    status: session.status,
    progress: session.progress,
    bugsFound: bugs.length,
    summary,
    agents:
      (session.agent_executions as Array<Record<string, unknown>>)?.map((e) => ({
        id: e.agent_id,
        name: e.agent_name,
        status: e.status,
        progress: e.progress,
        startedAt: e.started_at,
        completedAt: e.completed_at,
      })) || [],
    bugs: bugs.map((b) => ({
      id: b.id,
      title: b.title,
      severity: b.severity,
      agent: b.agent_name,
      createdAt: b.created_at,
    })),
    triggerType: session.trigger_type,
    triggerMetadata: session.trigger_metadata,
    startedAt: session.started_at,
    completedAt: session.completed_at,
    createdAt: session.created_at,
    dashboardUrl: `https://app.betaforge.ai/sessions/${session.id}`,
  });
}
