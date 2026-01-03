"use client";

import Link from "next/link";
import { useProjects, useDashboardStats, useActivity } from "@/lib/hooks";
import { memo, useMemo, useCallback, Suspense } from "react";
import {
  Plus,
  PlayCircle,
  Clock,
  CheckCircle2,
  Bug,
  Zap,
  TrendingUp,
  ArrowRight,
  Activity,
} from "lucide-react";
import { Loading, CardSkeleton } from "@/components/ui/loading";
import {
  MetricCardSkeleton,
  DashboardSkeleton,
} from "@/components/ui/skeletons";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/ui/card";
import { ProjectCard } from "@/components/ui/projectcard";
import { AGENTS } from "@/lib/agents";

// ===========================================
// 🚀 PERFORMANCE: Memoized helper functions
// ===========================================

// Helper function to format relative time - memoized
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

// Map event types to human-readable actions - constant
const ACTIVITY_ACTIONS: Record<string, string> = {
  agent_started: "started testing",
  agent_action: "performed an action on",
  agent_screenshot: "captured screenshot on",
  agent_bug_found: "found a bug in",
  agent_completed: "completed testing",
  agent_failed: "encountered an error on",
  session_completed: "finished session for",
};

const getActivityAction = (eventType: string): string =>
  ACTIVITY_ACTIONS[eventType] || "interacted with";

// Agent avatars - constant
const AGENT_AVATARS: Record<string, string> = {
  sarah: "🔍",
  marcus: "⚡",
  ahmed: "♿",
  lin: "📱",
  diego: "🔥",
  emma: "✨",
};

// Agent config for activity - constant
const AGENT_CONFIG: Record<string, { emoji: string; color: string }> = {
  "Sarah Chen": { emoji: "🔍", color: "#8B5CF6" },
  "Marcus Johnson": { emoji: "⚡", color: "#06B6D4" },
  "Ahmed Hassan": { emoji: "♿", color: "#10B981" },
  "Lin Wei": { emoji: "📱", color: "#EC4899" },
  "Diego Martinez": { emoji: "🔥", color: "#F97316" },
  "Emma Wilson": { emoji: "✨", color: "#6366F1" },
};

// ===========================================
// 🚀 PERFORMANCE: Memoized Components
// ===========================================

// Memoized Stats Grid
const StatsGrid = memo(function StatsGrid({
  stats,
  isLoading,
}: {
  stats: ReturnType<typeof useDashboardStats>["stats"];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="animate-fade-in-up stagger-1 gpu-accelerate">
        <MetricCard
          label="Active Tests"
          value={stats.activeTests.toString()}
          change={`${stats.todaysSessions} today`}
          trend="up"
          icon={<PlayCircle className="w-5 h-5" />}
        />
      </div>
      <div className="animate-fade-in-up stagger-2 gpu-accelerate">
        <MetricCard
          label="Bugs Found"
          value={stats.bugsFound.toString()}
          change={`+${stats.weeklyBugs} this week`}
          trend="up"
          icon={<Bug className="w-5 h-5" />}
        />
      </div>
      <div className="animate-fade-in-up stagger-3 gpu-accelerate">
        <MetricCard
          label="Test Sessions"
          value={stats.testSessions.toString()}
          change={`${stats.todaysSessions} today`}
          trend="neutral"
          icon={<Zap className="w-5 h-5" />}
        />
      </div>
      <div className="animate-fade-in-up stagger-4 gpu-accelerate">
        <MetricCard
          label="Success Rate"
          value={`${stats.successRate}%`}
          change={stats.successRate >= 90 ? "Excellent" : "Good"}
          trend="up"
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>
    </div>
  );
});

// Memoized Agent Card
const AgentStatusCard = memo(function AgentStatusCard({
  agent,
}: {
  agent: (typeof AGENTS)[0];
}) {
  return (
    <div className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-void-elevated/50 border border-white/5 hover:border-neural/30 transition-gpu hover:-translate-y-1 gpu-accelerate">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-gpu group-hover:scale-110"
        style={{
          background: `linear-gradient(135deg, ${agent.color}40, ${agent.color}20)`,
        }}
      >
        {AGENT_AVATARS[agent.id]}
      </div>
      <div>
        <p className="text-sm font-medium text-ghost-white">
          {agent.name.split(" ")[0]}
        </p>
        <p className="text-xs text-mist-gray">{agent.specialization}</p>
      </div>
      <div className="w-2 h-2 rounded-full bg-quantum-green ml-2" />
    </div>
  );
});

// Memoized Agent Status Bar
const AgentStatusBar = memo(function AgentStatusBar() {
  return (
    <div className="glass rounded-2xl p-6 animate-fade-in-up stagger-2 gpu-accelerate contain-layout">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-quantum-green animate-pulse" />
          <h2 className="text-lg font-semibold text-ghost-white">
            AI Agents Online
          </h2>
        </div>
        <Link
          href="/agents"
          className="flex items-center gap-1 text-sm text-neural-bright hover:text-neural transition-colors"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="flex flex-wrap gap-3">
        {AGENTS.map((agent) => (
          <AgentStatusCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
});

// Memoized Activity Item
const ActivityItem = memo(function ActivityItem({
  activity,
}: {
  activity: {
    id: string;
    agentName?: string | null;
    eventType: string;
    projectName?: string | null;
    createdAt: string;
  };
}) {
  const config = AGENT_CONFIG[activity.agentName || ""] || {
    emoji: "🤖",
    color: "#8B5CF6",
  };

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors contain-layout">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
        style={{
          background: `linear-gradient(135deg, ${config.color}40, ${config.color}20)`,
        }}
      >
        {config.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-ghost-white">
          <span className="font-semibold">{activity.agentName || "Agent"}</span>{" "}
          <span className="text-phantom-gray">
            {getActivityAction(activity.eventType)}
          </span>{" "}
          <span className="text-neural-bright">
            {activity.projectName || "a project"}
          </span>
        </p>
      </div>
      <span className="text-xs text-mist-gray whitespace-nowrap">
        {formatRelativeTime(activity.createdAt)}
      </span>
    </div>
  );
});

export default function DashboardPage() {
  const { projects, isLoading } = useProjects();
  const { stats, isLoading: statsLoading } = useDashboardStats();
  const { activities, isLoading: activityLoading } = useActivity({ limit: 10 });

  // Memoize delete handler
  const handleDelete = useCallback(async (id: string, name: string) => {
    if (confirm(`Delete project "${name}"? This cannot be undone.`)) {
      // deleteProject function from useProjects would be called here
    }
  }, []);

  // Memoize sliced projects
  const displayedProjects = useMemo(() => projects.slice(0, 6), [projects]);
  const displayedActivities = useMemo(
    () => activities.slice(0, 5),
    [activities]
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="animate-fade-in-up gpu-accelerate">
          <h1 className="text-3xl font-bold text-ghost-white mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-phantom-gray">
            Here&apos;s what&apos;s happening with your projects today.
          </p>
        </div>
        <div className="flex items-center gap-3 animate-fade-in-up stagger-1 gpu-accelerate">
          <Button variant="secondary">
            <Activity className="w-4 h-4" />
            View Reports
          </Button>
          <Link href="/dashboard/projects/new">
            <Button>
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid - Memoized */}
      <StatsGrid stats={stats} isLoading={statsLoading} />

      {/* Agent Status Bar - Memoized */}
      <AgentStatusBar />

      {/* Projects Section */}
      <section className="contain-layout">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-ghost-white">
            Your Projects
          </h2>
          <Link
            href="/dashboard/projects"
            className="flex items-center gap-1 text-sm text-phantom-gray hover:text-ghost-white transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : displayedProjects.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center animate-fade-in-up gpu-accelerate">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-neural/10 flex items-center justify-center">
              <Plus className="w-8 h-8 text-neural-bright" />
            </div>
            <h3 className="text-xl font-semibold text-ghost-white mb-2">
              No projects yet
            </h3>
            <p className="text-phantom-gray mb-6 max-w-md mx-auto">
              Create your first project to start testing with AI agents.
              They&apos;ll explore your app and find bugs like real users.
            </p>
            <Link href="/dashboard/projects/new">
              <Button size="lg">
                <Plus className="w-5 h-5" />
                Create Your First Project
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayedProjects.map((project, index) => (
              <div
                key={project.id}
                className="animate-fade-in-up gpu-accelerate contain-layout"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ProjectCard
                  project={{
                    ...project,
                    status:
                      ((project as { status?: string }).status as
                        | "active"
                        | "testing"
                        | "idle"
                        | "error") || "idle",
                    stats: (
                      project as {
                        stats?: { bugsFound: number; sessionsCount: number };
                      }
                    ).stats || {
                      bugsFound: 0,
                      sessionsCount: 0,
                    },
                  }}
                  onDelete={() => handleDelete(project.id, project.name)}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent Activity - Memoized Items */}
      <section className="animate-fade-in-up stagger-3 gpu-accelerate contain-layout">
        <h2 className="text-xl font-semibold text-ghost-white mb-6">
          Recent Activity
        </h2>
        <div className="glass rounded-2xl overflow-hidden">
          <div className="divide-y divide-white/5">
            {activityLoading ? (
              <div className="p-8 text-center text-phantom-gray">
                Loading activity...
              </div>
            ) : displayedActivities.length === 0 ? (
              <div className="p-8 text-center text-phantom-gray">
                No recent activity. Start testing to see agent actions here.
              </div>
            ) : (
              displayedActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))
            )}
          </div>
          <div className="p-4 border-t border-white/5 text-center">
            <Link
              href="/dashboard/reports"
              className="text-sm text-neural-bright hover:text-neural transition-colors"
            >
              View all activity →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
