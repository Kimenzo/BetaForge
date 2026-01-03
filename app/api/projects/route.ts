import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import type { ProjectInsert } from "@/lib/database.types";

// GET /api/projects - List all projects for the authenticated user
export async function GET(request: NextRequest) {
  const supabase = createServerClient();

  // For now, we'll return all projects (in production, filter by user_id)
  // TODO: Get user from auth and filter by user_id
  const { data: projects, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      test_sessions (
        id,
        status,
        bugs_found,
        completed_at
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch projects error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }

  // Transform to include computed stats
  const projectsWithStats = projects?.map((project) => {
    const sessions = project.test_sessions || [];
    const lastSession = sessions[0];
    const totalBugs = sessions.reduce((sum, s) => sum + (s.bugs_found || 0), 0);

    return {
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
        bugsFound: totalBugs,
        lastTested: lastSession?.completed_at || null,
      },
    };
  });

  return NextResponse.json({ projects: projectsWithStats || [] });
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  const supabase = createServerClient();

  try {
    const body = await request.json();
    const { name, description, platform, accessUrl, userId } = body;

    if (!name || !accessUrl) {
      return NextResponse.json(
        { error: "name and accessUrl are required" },
        { status: 400 }
      );
    }

    // For demo purposes, use provided userId or a placeholder
    // In production, get user_id from authenticated session
    const projectData: ProjectInsert = {
      user_id: userId || "00000000-0000-0000-0000-000000000000",
      name,
      description: description || null,
      platform: platform || ["web"],
      access_url: accessUrl,
      status: "active",
    };

    const { data: project, error } = await supabase
      .from("projects")
      .insert(projectData)
      .select()
      .single();

    if (error) {
      console.error("Create project error:", error);
      return NextResponse.json(
        { error: "Failed to create project" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
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
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
