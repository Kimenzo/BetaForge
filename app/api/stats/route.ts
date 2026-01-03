import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

// GET /api/stats - Get dashboard statistics
export async function GET() {
  const supabase = createServerClient();

  try {
    // Get running sessions count
    const { count: activeTests } = await supabase
      .from("test_sessions")
      .select("*", { count: "exact", head: true })
      .eq("status", "running");

    // Get total bugs count
    const { count: totalBugs } = await supabase
      .from("bug_reports")
      .select("*", { count: "exact", head: true });

    // Get total sessions count
    const { count: totalSessions } = await supabase
      .from("test_sessions")
      .select("*", { count: "exact", head: true });

    // Get completed sessions count for success rate
    const { count: completedSessions } = await supabase
      .from("test_sessions")
      .select("*", { count: "exact", head: true })
      .eq("status", "completed");

    // Get today's sessions
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count: todaysSessions } = await supabase
      .from("test_sessions")
      .select("*", { count: "exact", head: true })
      .gte("created_at", today.toISOString());

    // Get this week's bugs
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const { count: weeklyBugs } = await supabase
      .from("bug_reports")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weekAgo.toISOString());

    // Get open bugs
    const { count: openBugs } = await supabase
      .from("bug_reports")
      .select("*", { count: "exact", head: true })
      .eq("status", "open");

    // Get critical bugs
    const { count: criticalBugs } = await supabase
      .from("bug_reports")
      .select("*", { count: "exact", head: true })
      .eq("severity", "critical");

    // Calculate success rate
    const successRate =
      totalSessions && totalSessions > 0
        ? Math.round(((completedSessions || 0) / totalSessions) * 100)
        : 0;

    return NextResponse.json({
      stats: {
        activeTests: activeTests || 0,
        bugsFound: totalBugs || 0,
        testSessions: totalSessions || 0,
        successRate,
        todaysSessions: todaysSessions || 0,
        weeklyBugs: weeklyBugs || 0,
        openBugs: openBugs || 0,
        criticalBugs: criticalBugs || 0,
      },
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
