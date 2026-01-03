import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/bug-reports/[id] - Get a single bug report with full details
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = createServerClient();

  const { data: report, error } = await supabase
    .from("bug_reports")
    .select(`
      *,
      agent_executions (
        id,
        agent_id,
        agent_name,
        session_id,
        environment_config,
        test_sessions (
          id,
          status,
          trigger_type,
          started_at,
          completed_at,
          project_id,
          projects (
            id,
            name,
            access_url,
            platform
          )
        )
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return NextResponse.json({ error: "Bug report not found" }, { status: 404 });
    }
    console.error("Fetch bug report error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bug report" },
      { status: 500 }
    );
  }

  const execution = report.agent_executions;
  const session = execution?.test_sessions;
  const project = session?.projects;

  return NextResponse.json({
    report: {
      id: report.id,
      severity: report.severity,
      status: report.status,
      title: report.title,
      description: report.description,
      agentName: report.agent_name,
      agentColor: report.agent_color,
      reproductionSteps: report.reproduction_steps,
      expectedBehavior: report.expected_behavior,
      actualBehavior: report.actual_behavior,
      screenshots: report.screenshots,
      consoleErrors: report.console_errors,
      networkLogs: report.network_logs,
      environmentInfo: report.environment_info,
      createdAt: report.created_at,
      updatedAt: report.updated_at,
      execution: execution ? {
        id: execution.id,
        agentId: execution.agent_id,
        agentName: execution.agent_name,
        environmentConfig: execution.environment_config,
      } : null,
      session: session ? {
        id: session.id,
        status: session.status,
        triggerType: session.trigger_type,
        startedAt: session.started_at,
        completedAt: session.completed_at,
      } : null,
      project: project ? {
        id: project.id,
        name: project.name,
        accessUrl: project.access_url,
        platform: project.platform,
      } : null,
    },
  });
}

// PATCH /api/bug-reports/[id] - Update a bug report status
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = createServerClient();

  try {
    const body = await request.json();
    const { status, severity, title, description } = body;

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (status !== undefined) updateData.status = status;
    if (severity !== undefined) updateData.severity = severity;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;

    const { data: report, error } = await supabase
      .from("bug_reports")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Bug report not found" }, { status: 404 });
      }
      console.error("Update bug report error:", error);
      return NextResponse.json(
        { error: "Failed to update bug report" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      report: {
        id: report.id,
        severity: report.severity,
        status: report.status,
        title: report.title,
        updatedAt: report.updated_at,
      },
    });
  } catch (error) {
    console.error("Update bug report error:", error);
    return NextResponse.json(
      { error: "Failed to update bug report" },
      { status: 500 }
    );
  }
}

// DELETE /api/bug-reports/[id] - Delete a bug report
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = createServerClient();

  const { error } = await supabase
    .from("bug_reports")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete bug report error:", error);
    return NextResponse.json(
      { error: "Failed to delete bug report" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
