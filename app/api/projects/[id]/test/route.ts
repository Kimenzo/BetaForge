import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { createOrchestrator } from "@/lib/orchestrator";
import { getEnabledAgents } from "@/lib/agents";
import type { AgentEvent } from "@/lib/types";
import type { TestSessionInsert, AgentExecutionInsert, ActivityLogInsert, Json } from "@/lib/database.types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/projects/[id]/test - Start a test session for a project
export async function POST(request: NextRequest, { params }: RouteParams) {
  const { id: projectId } = await params;
  const supabase = createServerClient();

  try {
    const body = await request.json().catch(() => ({}));
    const { targetUrl, agentIds } = body;

    // Verify project exists
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id, name, access_url")
      .eq("id", projectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const testUrl = targetUrl || project.access_url;

    if (!testUrl) {
      return NextResponse.json(
        { error: "targetUrl is required" },
        { status: 400 }
      );
    }

    // Get agents to deploy
    let agents = getEnabledAgents();
    if (agentIds && Array.isArray(agentIds) && agentIds.length > 0) {
      agents = agents.filter((a) => agentIds.includes(a.id));
    }

    if (agents.length === 0) {
      return NextResponse.json(
        { error: "No agents selected for testing" },
        { status: 400 }
      );
    }

    // Create test session in database
    const sessionData: TestSessionInsert = {
      project_id: projectId,
      status: "queued",
      trigger_type: "manual",
      progress: 0,
      bugs_found: 0,
    };

    const { data: session, error: sessionError } = await supabase
      .from("test_sessions")
      .insert(sessionData)
      .select()
      .single();

    if (sessionError || !session) {
      console.error("Create session error:", sessionError);
      return NextResponse.json(
        { error: "Failed to create test session" },
        { status: 500 }
      );
    }

    // Update project status to testing
    await supabase
      .from("projects")
      .update({ status: "testing" })
      .eq("id", projectId);

    // Create agent executions
    const agentExecutions: AgentExecutionInsert[] = agents.map((agent) => ({
      session_id: session.id,
      agent_id: agent.id,
      agent_name: agent.name,
      status: "queued",
      progress: 0,
      environment_config: {
        viewport: agent.deviceConfig.viewport,
        targetUrl: testUrl,
      },
    }));

    const { data: executions, error: execError } = await supabase
      .from("agent_executions")
      .insert(agentExecutions)
      .select();

    if (execError) {
      console.error("Create executions error:", execError);
    }

    // Log session start activity
    const activityLog: ActivityLogInsert = {
      session_id: session.id,
      event_type: "session_started",
      message: `Test session started with ${agents.length} agent(s)`,
      data: {
        agentCount: agents.length,
        agents: agents.map((a) => a.name),
        targetUrl: testUrl,
      },
    };

    await supabase.from("activity_logs").insert(activityLog);

    // Create orchestrator and deploy agents
    const orchestrator = createOrchestrator({
      projectId,
      targetUrl: testUrl,
      agents,
      onEvent: async (event: AgentEvent) => {
        // Log events to database
        const logEntry: ActivityLogInsert = {
          session_id: session.id,
          event_type: event.type,
          agent_name: event.agentName,
          message: event.message || `${event.agentName}: ${event.type}`,
          data: (event.data || {}) as Json,
        };

        await supabase.from("activity_logs").insert(logEntry);

        // Update agent execution progress
        if (event.agentId) {
          const execution = executions?.find((e) => e.agent_id === event.agentId);
          if (execution) {
            const updateData: Record<string, unknown> = {};

            if (event.type === "agent_started") {
              updateData.status = "running";
              updateData.started_at = new Date().toISOString();
            } else if (event.type === "agent_completed") {
              updateData.status = "completed";
              updateData.progress = 100;
              updateData.completed_at = new Date().toISOString();
            } else if (event.type === "agent_failed") {
              updateData.status = "failed";
              updateData.completed_at = new Date().toISOString();
            } else if (event.progress !== undefined) {
              updateData.progress = event.progress;
            }

            if (Object.keys(updateData).length > 0) {
              await supabase
                .from("agent_executions")
                .update(updateData)
                .eq("id", execution.id);
            }
          }
        }

        // Update session progress
        if (event.type === "session_completed") {
          await supabase
            .from("test_sessions")
            .update({
              status: "completed",
              progress: 100,
              completed_at: new Date().toISOString(),
            })
            .eq("id", session.id);

          // Update project status back to active
          await supabase
            .from("projects")
            .update({ status: "active" })
            .eq("id", projectId);
        }

        console.log(`[Test Session ${session.id}]`, event);
      },
    });

    // Update session to running
    await supabase
      .from("test_sessions")
      .update({
        status: "running",
        started_at: new Date().toISOString(),
      })
      .eq("id", session.id);

    // Start testing (runs in background)
    orchestrator.deployAgents().catch(async (error) => {
      console.error("Orchestrator error:", error);
      await supabase
        .from("test_sessions")
        .update({
          status: "failed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", session.id);
    });

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        projectId: session.project_id,
        status: session.status,
        triggerType: session.trigger_type,
        agentCount: agents.length,
        agents: agents.map((a) => ({
          id: a.id,
          name: a.name,
          color: a.color,
        })),
      },
      message: `Test session started with ${agents.length} agent(s)`,
    });
  } catch (error) {
    console.error("Start test error:", error);
    return NextResponse.json(
      { error: "Failed to start test session" },
      { status: 500 }
    );
  }
}

// GET /api/projects/[id]/test - Get test history for a project
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id: projectId } = await params;
  const supabase = createServerClient();

  const { data: sessions, error } = await supabase
    .from("test_sessions")
    .select(`
      *,
      agent_executions (
        id,
        agent_id,
        agent_name,
        status,
        progress,
        started_at,
        completed_at
      )
    `)
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Fetch test history error:", error);
    return NextResponse.json(
      { error: "Failed to fetch test history" },
      { status: 500 }
    );
  }

  // Get bug reports for this project
  const { data: bugs } = await supabase
    .from("bug_reports")
    .select("id, severity, title, execution_id")
    .eq("project_id", projectId);

  return NextResponse.json({
    sessions: sessions?.map((s) => {
      const sessionBugs = bugs?.filter((b) => 
        s.agent_executions?.some((e) => e.id === b.execution_id)
      ) || [];

      return {
        id: s.id,
        status: s.status,
        triggerType: s.trigger_type,
        progress: s.progress,
        bugsFound: s.bugs_found,
        startedAt: s.started_at,
        completedAt: s.completed_at,
        agents: s.agent_executions || [],
        bugSummary: {
          critical: sessionBugs.filter((b) => b.severity === "critical").length,
          high: sessionBugs.filter((b) => b.severity === "high").length,
          medium: sessionBugs.filter((b) => b.severity === "medium").length,
          low: sessionBugs.filter((b) => b.severity === "low").length,
        },
      };
    }) || [],
  });
}
