import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { AGENTS } from "@/lib/agents";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Generate demo session data for development without Supabase
function generateDemoSession(id: string) {
  const isDemo = id.startsWith("demo_");
  const agents = AGENTS.slice(0, 4);
  const now = new Date();
  const startedAt = new Date(now.getTime() - 45000); // 45 seconds ago

  // Simulate progress based on time
  const elapsedMs = now.getTime() - startedAt.getTime();
  const progress = Math.min(100, Math.floor(elapsedMs / 1200)); // ~2 min for 100%
  const isComplete = progress >= 100;

  return {
    session: {
      id,
      projectId: "demo_project",
      status: isComplete ? "completed" : "running",
      triggerType: "manual",
      triggerMetadata: null,
      progress,
      bugsFound: isComplete ? 3 : Math.floor(progress / 30),
      startedAt: startedAt.toISOString(),
      completedAt: isComplete ? now.toISOString() : null,
      createdAt: startedAt.toISOString(),
      isDemo: true,
      project: {
        id: "demo_project",
        name: "BetaForge Demo",
        description: "Demo project for testing the platform",
        platform: "web",
        accessUrl: "https://demo.betaforge.dev",
      },
      agents: agents.map((agent, i) => {
        const agentProgress = Math.min(100, progress + i * 5);
        const agentComplete = agentProgress >= 100;
        return {
          id: `exec_${i + 1}`,
          agentId: agent.id,
          name: agent.name,
          status: agentComplete
            ? "completed"
            : progress > i * 10
            ? "running"
            : "queued",
          progress: Math.min(100, Math.max(0, agentProgress)),
          environmentConfig: agent.deviceConfig,
          interactionLog: [],
          screenshots: [],
          startedAt: new Date(startedAt.getTime() + i * 5000).toISOString(),
          completedAt: agentComplete ? now.toISOString() : null,
        };
      }),
      activityLog: [
        {
          id: "log_1",
          type: "session_started",
          agentName: null,
          message: "Test session started",
          data: null,
          timestamp: startedAt.toISOString(),
        },
        ...agents.slice(0, Math.ceil(progress / 25)).map((agent, i) => ({
          id: `log_${i + 2}`,
          type: "agent_started",
          agentName: agent.name,
          message: `${agent.name} began testing`,
          data: { focus: agent.specialization },
          timestamp: new Date(
            startedAt.getTime() + (i + 1) * 8000
          ).toISOString(),
        })),
        ...(progress > 60
          ? [
              {
                id: "log_bug_1",
                type: "bug_found",
                agentName: agents[0].name,
                message:
                  "Found accessibility issue: Missing alt text on hero image",
                data: { severity: "medium" },
                timestamp: new Date(startedAt.getTime() + 35000).toISOString(),
              },
            ]
          : []),
      ],
      bugReports:
        progress > 60
          ? [
              {
                id: "bug_1",
                severity: "medium",
                status: "open",
                title: "Missing alt text on hero image",
                description:
                  "The main hero image lacks alternative text, affecting screen reader users.",
                agentName: agents[0].name,
                createdAt: new Date(startedAt.getTime() + 35000).toISOString(),
              },
              ...(progress > 80
                ? [
                    {
                      id: "bug_2",
                      severity: "low",
                      status: "open",
                      title: "Button focus state not visible",
                      description:
                        "The primary CTA button does not show a visible focus indicator when navigating with keyboard.",
                      agentName: agents[2].name,
                      createdAt: new Date(
                        startedAt.getTime() + 50000
                      ).toISOString(),
                    },
                  ]
                : []),
              ...(isComplete
                ? [
                    {
                      id: "bug_3",
                      severity: "high",
                      status: "open",
                      title: "Form submission fails silently",
                      description:
                        "The contact form shows no error message when server returns 500 error.",
                      agentName: agents[4]?.name || agents[0].name,
                      createdAt: new Date(
                        startedAt.getTime() + 80000
                      ).toISOString(),
                    },
                  ]
                : []),
            ]
          : [],
    },
  };
}

// GET /api/test-sessions/[id] - Get detailed session information
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  // Check if this is a demo session
  if (id.startsWith("demo_")) {
    return NextResponse.json(generateDemoSession(id));
  }

  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("your-project")) {
    // Return demo data when Supabase isn't configured
    return NextResponse.json(generateDemoSession(id));
  }

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
    // Fallback to demo data on error
    return NextResponse.json(generateDemoSession(id));
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
