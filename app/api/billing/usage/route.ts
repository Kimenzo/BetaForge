import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = createServerClient();

    // Get current user
    const { data: users } = await supabase
      .from("users")
      .select("id")
      .limit(1)
      .single();

    if (!users) {
      return NextResponse.json({
        usage: {
          projects: { used: 0, limit: 3 },
          sessions: { used: 0, limit: 10 },
          agents: { used: 6, limit: 6 },
        },
      });
    }

    // Get subscription to determine limits
    const { data: subscription } = await supabase
      .from("user_subscriptions")
      .select("plan_id")
      .eq("user_id", users.id)
      .single();

    const planLimits: Record<
      string,
      { projects: number; sessions: number; agents: number }
    > = {
      free: { projects: 3, sessions: 10, agents: 6 },
      pro: { projects: -1, sessions: -1, agents: 6 }, // -1 means unlimited
      team: { projects: -1, sessions: -1, agents: 6 },
      enterprise: { projects: -1, sessions: -1, agents: 6 },
    };

    const planId = subscription?.plan_id || "free";
    const limits = planLimits[planId];

    // Count actual usage
    const { count: projectCount, data: projects } = await supabase
      .from("projects")
      .select("id", { count: "exact" })
      .eq("user_id", users.id);

    const projectIds = projects?.map(p => p.id) || [];
    
    const { count: sessionCount } = await supabase
      .from("test_sessions")
      .select("id", { count: "exact", head: true })
      .in("project_id", projectIds.length > 0 ? projectIds : ["none"]);

    return NextResponse.json({
      usage: {
        projects: {
          used: projectCount || 0,
          limit: limits.projects,
        },
        sessions: {
          used: sessionCount || 0,
          limit: limits.sessions,
        },
        agents: {
          used: 6,
          limit: limits.agents,
        },
      },
    });
  } catch (error) {
    console.error("Get usage error:", error);
    return NextResponse.json(
      { error: "Failed to fetch usage" },
      { status: 500 }
    );
  }
}
