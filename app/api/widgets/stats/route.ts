import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

// ============================================
// Widget Stats API
// ============================================
// Provides data for Windows 11 widgets

export async function GET() {
  try {
    const supabase = createServerClient();

    // Get quick stats for the widget
    const [sessionsResult, bugsResult, projectsResult] = await Promise.all([
      supabase
        .from("test_sessions")
        .select("id, status")
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("bug_reports")
        .select("id, severity")
        .order("created_at", { ascending: false })
        .limit(20),
      supabase
        .from("projects")
        .select("id, status")
        .eq("status", "active"),
    ]);

    const runningSessions =
      sessionsResult.data?.filter((s) => s.status === "running").length || 0;
    const completedToday =
      sessionsResult.data?.filter((s) => s.status === "completed").length || 0;
    
    const criticalBugs =
      bugsResult.data?.filter((b) => b.severity === "critical").length || 0;
    const highBugs =
      bugsResult.data?.filter((b) => b.severity === "high").length || 0;

    const activeProjects = projectsResult.data?.length || 0;

    return NextResponse.json({
      template: "betaforge-stats-widget",
      data: {
        runningSessions,
        completedToday,
        criticalBugs,
        highBugs,
        totalBugs: bugsResult.data?.length || 0,
        activeProjects,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("[Widget] Stats error:", error);
    return NextResponse.json({
      template: "betaforge-stats-widget",
      data: {
        runningSessions: 0,
        completedToday: 0,
        criticalBugs: 0,
        highBugs: 0,
        totalBugs: 0,
        activeProjects: 0,
        error: "Failed to load stats",
      },
    });
  }
}
