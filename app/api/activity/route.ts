import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

// GET /api/activity - List recent activity logs
export async function GET(request: NextRequest) {
  const supabase = createServerClient();
  const { searchParams } = new URL(request.url);

  const limit = parseInt(searchParams.get("limit") || "20");
  const sessionId = searchParams.get("sessionId");

  let query = supabase
    .from("activity_logs")
    .select(
      `
      *,
      test_sessions (
        id,
        project_id,
        projects (
          id,
          name
        )
      )
    `
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (sessionId) {
    query = query.eq("session_id", sessionId);
  }

  const { data: activities, error } = await query;

  if (error) {
    console.error("Fetch activity error:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    activities:
      activities?.map((a) => ({
        id: a.id,
        sessionId: a.session_id,
        eventType: a.event_type,
        agentName: a.agent_name,
        message: a.message,
        data: a.data,
        projectId: a.test_sessions?.project_id,
        projectName: a.test_sessions?.projects?.name,
        createdAt: a.created_at,
      })) || [],
  });
}
