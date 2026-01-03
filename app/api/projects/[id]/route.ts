import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/projects/[id] - Get a single project with full details
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = createServerClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select(`
      *,
      test_sessions (
        id,
        status,
        trigger_type,
        progress,
        bugs_found,
        started_at,
        completed_at,
        agent_executions (
          id,
          agent_id,
          agent_name,
          status,
          progress
        )
      ),
      bug_reports (
        id,
        severity,
        status,
        title,
        agent_name,
        created_at
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    console.error("Fetch project error:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }

  // Calculate stats
  const sessions = project.test_sessions || [];
  const bugs = project.bug_reports || [];
  const lastSession = sessions.find((s) => s.completed_at) || sessions[0];

  return NextResponse.json({
    project: {
      id: project.id,
      name: project.name,
      description: project.description,
      platform: project.platform,
      accessUrl: project.access_url,
      status: project.status,
      createdAt: project.created_at,
      updatedAt: project.updated_at,
      stats: {
        sessionsCount: sessions.length,
        bugsFound: bugs.length,
        lastTested: lastSession?.completed_at || null,
        bugsBySeverity: {
          critical: bugs.filter((b) => b.severity === "critical").length,
          high: bugs.filter((b) => b.severity === "high").length,
          medium: bugs.filter((b) => b.severity === "medium").length,
          low: bugs.filter((b) => b.severity === "low").length,
        },
      },
      recentSessions: sessions.slice(0, 5).map((s) => ({
        id: s.id,
        status: s.status,
        triggerType: s.trigger_type,
        progress: s.progress,
        bugsFound: s.bugs_found,
        startedAt: s.started_at,
        completedAt: s.completed_at,
        agentCount: s.agent_executions?.length || 0,
      })),
      recentBugs: bugs.slice(0, 10).map((b) => ({
        id: b.id,
        severity: b.severity,
        status: b.status,
        title: b.title,
        agentName: b.agent_name,
        createdAt: b.created_at,
      })),
    },
  });
}

// PATCH /api/projects/[id] - Update a project
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = createServerClient();

  try {
    const body = await request.json();
    const { name, description, platform, accessUrl, status } = body;

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (platform !== undefined) updateData.platform = platform;
    if (accessUrl !== undefined) updateData.access_url = accessUrl;
    if (status !== undefined) updateData.status = status;

    const { data: project, error } = await supabase
      .from("projects")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }
      console.error("Update project error:", error);
      return NextResponse.json(
        { error: "Failed to update project" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        platform: project.platform,
        accessUrl: project.access_url,
        status: project.status,
        createdAt: project.created_at,
        updatedAt: project.updated_at,
      },
    });
  } catch (error) {
    console.error("Update project error:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - Delete a project and all related data
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = createServerClient();

  // Delete project (cascades will handle related records if set up)
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete project error:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
