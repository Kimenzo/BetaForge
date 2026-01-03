import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

// GET /api/bug-reports - List bug reports with filtering
export async function GET(request: NextRequest) {
  const supabase = createServerClient();
  const { searchParams } = new URL(request.url);

  const limit = parseInt(searchParams.get("limit") || "50");
  const projectId = searchParams.get("projectId");
  const severity = searchParams.get("severity");
  const status = searchParams.get("status");

  let query = supabase
    .from("bug_reports")
    .select(
      `
      *,
      agent_executions (
        id,
        agent_name,
        session_id,
        test_sessions (
          id,
          project_id,
          projects (
            id,
            name
          )
        )
      )
    `
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (projectId) {
    query = query.eq("project_id", projectId);
  }
  if (severity) {
    query = query.eq("severity", severity);
  }
  if (status) {
    query = query.eq("status", status);
  }

  const { data: reports, error } = await query;

  if (error) {
    console.error("Fetch bug reports error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bug reports" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    reports:
      reports?.map((r) => ({
        id: r.id,
        severity: r.severity,
        status: r.status,
        title: r.title,
        description: r.description,
        agentName: r.agent_name,
        agentColor: r.agent_color,
        reproductionSteps: r.reproduction_steps,
        expectedBehavior: r.expected_behavior,
        actualBehavior: r.actual_behavior,
        screenshots: r.screenshots,
        consoleErrors: r.console_errors,
        networkLogs: r.network_logs,
        environmentInfo: r.environment_info,
        projectId: r.project_id,
        projectName: r.agent_executions?.test_sessions?.projects?.name,
        sessionId: r.agent_executions?.test_sessions?.id,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      })) || [],
  });
}

// POST /api/bug-reports - Create a new bug report
export async function POST(request: NextRequest) {
  const supabase = createServerClient();

  try {
    const body = await request.json();
    const {
      executionId,
      projectId,
      severity,
      title,
      description,
      agentName,
      agentColor,
      reproductionSteps,
      expectedBehavior,
      actualBehavior,
      screenshots,
      consoleErrors,
      networkLogs,
      environmentInfo,
    } = body;

    if (!executionId || !projectId || !severity || !title || !description) {
      return NextResponse.json(
        {
          error:
            "executionId, projectId, severity, title, and description are required",
        },
        { status: 400 }
      );
    }

    const { data: report, error } = await supabase
      .from("bug_reports")
      .insert({
        execution_id: executionId,
        project_id: projectId,
        severity,
        status: "open",
        title,
        description,
        agent_name: agentName || null,
        agent_color: agentColor || null,
        reproduction_steps: reproductionSteps || [],
        expected_behavior: expectedBehavior || null,
        actual_behavior: actualBehavior || null,
        screenshots: screenshots || null,
        console_errors: consoleErrors || null,
        network_logs: networkLogs || null,
        environment_info: environmentInfo || {},
      })
      .select()
      .single();

    if (error) {
      console.error("Create bug report error:", error);
      return NextResponse.json(
        { error: "Failed to create bug report" },
        { status: 500 }
      );
    }

    // Update bugs_found count in the session
    const { data: execution } = await supabase
      .from("agent_executions")
      .select("session_id")
      .eq("id", executionId)
      .single();

    if (execution) {
      // Increment bugs_found in the session
      const { data: currentSession } = await supabase
        .from("test_sessions")
        .select("bugs_found")
        .eq("id", execution.session_id)
        .single();

      if (currentSession) {
        await supabase
          .from("test_sessions")
          .update({ bugs_found: (currentSession.bugs_found || 0) + 1 })
          .eq("id", execution.session_id);
      }
    }

    return NextResponse.json(
      {
        report: {
          id: report.id,
          severity: report.severity,
          status: report.status,
          title: report.title,
          description: report.description,
          agentName: report.agent_name,
          createdAt: report.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create bug report error:", error);
    return NextResponse.json(
      { error: "Failed to create bug report" },
      { status: 500 }
    );
  }
}
