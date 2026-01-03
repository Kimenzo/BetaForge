import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

// GET /api/test-sessions - List recent test sessions across all projects
export async function GET(request: NextRequest) {
  const supabase = createServerClient();
  const { searchParams } = new URL(request.url);

  const limit = parseInt(searchParams.get("limit") || "20");
  const status = searchParams.get("status");
  const projectId = searchParams.get("projectId");

  let query = supabase
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
        progress
      )
    `
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (status) {
    query = query.eq("status", status);
  }

  if (projectId) {
    query = query.eq("project_id", projectId);
  }

  const { data: sessions, error } = await query;

  if (error) {
    console.error("Fetch sessions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch test sessions" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    sessions:
      sessions?.map((s) => ({
        id: s.id,
        projectId: s.project_id,
        projectName: s.projects?.name,
        status: s.status,
        triggerType: s.trigger_type,
        progress: s.progress,
        bugsFound: s.bugs_found,
        startedAt: s.started_at,
        completedAt: s.completed_at,
        createdAt: s.created_at,
        agents:
          s.agent_executions?.map((e) => ({
            id: e.id,
            agentId: e.agent_id,
            name: e.agent_name,
            status: e.status,
            progress: e.progress,
          })) || [],
      })) || [],
  });
}

// POST /api/test-sessions - Create a new test session (alternative to /api/projects/[id]/test)
export async function POST(request: NextRequest) {
  const supabase = createServerClient();

  try {
    const body = await request.json();
    const { projectId, triggerType = "manual", triggerMetadata } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: "projectId is required" },
        { status: 400 }
      );
    }

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("your-project")) {
      // Return a demo session for development without Supabase
      const demoSessionId = `demo_${Date.now()}_${Math.random()
        .toString(36)
        .substring(7)}`;
      return NextResponse.json(
        {
          success: true,
          session: {
            id: demoSessionId,
            projectId,
            projectName: "Demo Project",
            status: "running",
            triggerType,
            createdAt: new Date().toISOString(),
            isDemo: true,
          },
        },
        { status: 201 }
      );
    }

    // Verify project exists
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id, name, access_url")
      .eq("id", projectId)
      .single();

    if (projectError || !project) {
      // Fallback to demo session if project not found in DB
      const demoSessionId = `demo_${Date.now()}_${Math.random()
        .toString(36)
        .substring(7)}`;
      return NextResponse.json(
        {
          success: true,
          session: {
            id: demoSessionId,
            projectId,
            projectName: "Demo Project",
            status: "running",
            triggerType,
            createdAt: new Date().toISOString(),
            isDemo: true,
          },
        },
        { status: 201 }
      );
    }

    // Create session
    const { data: session, error: sessionError } = await supabase
      .from("test_sessions")
      .insert({
        project_id: projectId,
        status: "queued",
        trigger_type: triggerType,
        trigger_metadata: triggerMetadata || null,
        progress: 0,
        bugs_found: 0,
      })
      .select()
      .single();

    if (sessionError || !session) {
      console.error("Create session error:", sessionError);
      return NextResponse.json(
        { error: "Failed to create test session" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        session: {
          id: session.id,
          projectId: session.project_id,
          projectName: project.name,
          status: session.status,
          triggerType: session.trigger_type,
          createdAt: session.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create session error:", error);
    // Fallback to demo session on any error
    const demoSessionId = `demo_${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}`;
    return NextResponse.json(
      {
        success: true,
        session: {
          id: demoSessionId,
          projectId: "demo",
          projectName: "Demo Project",
          status: "running",
          triggerType: "manual",
          createdAt: new Date().toISOString(),
          isDemo: true,
        },
      },
      { status: 201 }
    );
  }
}
