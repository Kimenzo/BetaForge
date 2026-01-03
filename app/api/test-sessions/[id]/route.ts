import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/test-sessions/[id] - Get detailed session information
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = createServerClient();

  const { data: session, error } = await supabase
    .from("test_sessions")
    .select(
      `
      *,
      projects (
        id,
        name,
        description,
        platform,
        access_url
      ),
      agent_executions (
        id,
        agent_id,
        agent_name,
        status,
        progress,
        environment_config,
        interaction_log,
        screenshots,
        started_at,
        completed_at
      ),
      activity_logs (
        id,
        event_type,
        agent_name,
        message,
        data,
        created_at
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    console.error("Fetch session error:", error);
    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 500 }
    );
  }

  // Get bug reports for this session via agent_executions
  const executionIds = session.agent_executions?.map((e) => e.id) || [];
  let bugReports: {
    id: string;
    severity: string;
    status: string;
    title: string;
    description: string;
    agent_name: string | null;
    created_at: string | null;
  }[] = [];

  if (executionIds.length > 0) {
    const { data: bugs } = await supabase
      .from("bug_reports")
      .select(
        "id, severity, status, title, description, agent_name, created_at"
      )
      .in("execution_id", executionIds)
      .order("created_at", { ascending: false });

    bugReports = bugs || [];
  }

  return NextResponse.json({
    session: {
      id: session.id,
      projectId: session.project_id,
      status: session.status,
      triggerType: session.trigger_type,
      triggerMetadata: session.trigger_metadata,
      progress: session.progress,
      bugsFound: session.bugs_found,
      startedAt: session.started_at,
      completedAt: session.completed_at,
      createdAt: session.created_at,
      project: session.projects
        ? {
            id: session.projects.id,
            name: session.projects.name,
            description: session.projects.description,
            platform: session.projects.platform,
            accessUrl: session.projects.access_url,
          }
        : null,
      agents:
        session.agent_executions?.map((e) => ({
          id: e.id,
          agentId: e.agent_id,
          name: e.agent_name,
          status: e.status,
          progress: e.progress,
          environmentConfig: e.environment_config,
          interactionLog: e.interaction_log,
          screenshots: e.screenshots,
          startedAt: e.started_at,
          completedAt: e.completed_at,
        })) || [],
      activityLog:
        session.activity_logs?.map((log) => ({
          id: log.id,
          type: log.event_type,
          agentName: log.agent_name,
          message: log.message,
          data: log.data,
          timestamp: log.created_at,
        })) || [],
      bugReports: bugReports.map((b) => ({
        id: b.id,
        severity: b.severity,
        status: b.status,
        title: b.title,
        description: b.description,
        agentName: b.agent_name,
        createdAt: b.created_at,
      })),
    },
  });
}

// PATCH /api/test-sessions/[id] - Update session status
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = createServerClient();

  try {
    const body = await request.json();
    const { status, progress, bugsFound } = body;

    const updateData: Record<string, unknown> = {};

    if (status !== undefined) {
      updateData.status = status;
      if (status === "running" && !body.started_at) {
        updateData.started_at = new Date().toISOString();
      }
      if (status === "completed" || status === "failed") {
        updateData.completed_at = new Date().toISOString();
      }
    }
    if (progress !== undefined) updateData.progress = progress;
    if (bugsFound !== undefined) updateData.bugs_found = bugsFound;

    const { data: session, error } = await supabase
      .from("test_sessions")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Session not found" },
          { status: 404 }
        );
      }
      console.error("Update session error:", error);
      return NextResponse.json(
        { error: "Failed to update session" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      session: {
        id: session.id,
        status: session.status,
        progress: session.progress,
        bugsFound: session.bugs_found,
        startedAt: session.started_at,
        completedAt: session.completed_at,
      },
    });
  } catch (error) {
    console.error("Update session error:", error);
    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 }
    );
  }
}

// DELETE /api/test-sessions/[id] - Delete a session and related data
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = createServerClient();

  const { error } = await supabase.from("test_sessions").delete().eq("id", id);

  if (error) {
    console.error("Delete session error:", error);
    return NextResponse.json(
      { error: "Failed to delete session" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
