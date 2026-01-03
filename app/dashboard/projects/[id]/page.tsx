import Link from "next/link";
import {
  ArrowLeft,
  PlayCircle,
  Clock,
  CheckCircle2,
  Bug,
  Zap,
  ExternalLink,
  Globe,
  Settings,
  MoreVertical,
  TrendingUp,
  Activity,
} from "lucide-react";
import { AGENTS } from "@/lib/agents";
import { createServerClient } from "@/lib/supabase";
import { notFound } from "next/navigation";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

// Helper function to format relative time
function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return "Never";
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
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const supabase = createServerClient();

  // Fetch project from database
  const { data: project, error } = await supabase
    .from("projects")
    .select(`
      *,
      test_sessions (
        id,
        status,
        bugs_found,
        completed_at
      ),
      bug_reports (
        id,
        severity,
        status
      )
    `)
    .eq("id", id)
    .single();

  if (error || !project) {
    notFound();
  }

  // Calculate stats
  const sessions = project.test_sessions || [];
  const bugReports = project.bug_reports || [];
  const completedSessions = sessions.filter((s: { status: string }) => s.status === "completed").length;
  const passRate = sessions.length > 0 ? Math.round((completedSessions / sessions.length) * 100) : 0;
  const lastSession = sessions.sort((a: { completed_at: string | null }, b: { completed_at: string | null }) => 
    new Date(b.completed_at || 0).getTime() - new Date(a.completed_at || 0).getTime()
  )[0];
  const openBugs = bugReports.filter((b: { status: string }) => b.status === "open").length;

  const stats = [
    {
      icon: <PlayCircle className="w-5 h-5" />,
      label: "Total Tests",
      value: sessions.length.toString(),
      color: "text-neural-bright",
      bgColor: "bg-neural/10",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: "Last Tested",
      value: formatRelativeTime(lastSession?.completed_at),
      color: "text-electric-cyan",
      bgColor: "bg-electric-cyan/10",
    },
    {
      icon: <CheckCircle2 className="w-5 h-5" />,
      label: "Pass Rate",
      value: `${passRate}%`,
      color: "text-quantum-green",
      bgColor: "bg-quantum-green/10",
    },
    {
      icon: <Bug className="w-5 h-5" />,
      label: "Open Bugs",
      value: openBugs.toString(),
      color: "text-ember-orange",
      bgColor: "bg-ember-orange/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <Link
        href="/dashboard/projects"
        className="inline-flex items-center gap-2 text-phantom-gray hover:text-ghost-white transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Projects
      </Link>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 animate-fade-in-up">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-electric-cyan/20 to-blue-500/20 border border-white/10">
              <Globe className="w-6 h-6 text-electric-cyan" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-ghost-white">
                {project.name}
              </h1>
              <span className={`inline-flex items-center gap-1.5 text-sm ${
                project.status === "active" ? "text-quantum-green" : 
                project.status === "testing" ? "text-neural-bright" : 
                project.status === "error" ? "text-crimson-red" : "text-mist-gray"
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  project.status === "active" ? "bg-quantum-green animate-pulse" : 
                  project.status === "testing" ? "bg-neural-bright animate-pulse" : 
                  project.status === "error" ? "bg-crimson-red" : "bg-mist-gray"
                }`} />
                {(project.status?.charAt(0).toUpperCase() ?? "") + (project.status?.slice(1) ?? "") || "Idle"}
              </span>
            </div>
          </div>
          <p className="text-phantom-gray max-w-2xl mb-4">
            {project.description || "No description provided."}
          </p>

          {/* URL */}
          {project.access_url && (
            <a
              href={project.access_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-void-elevated border border-white/5 text-sm text-electric-cyan hover:text-electric-cyan/80 hover:border-white/10 transition-all group"
            >
              <Globe className="w-4 h-4" />
              <span className="font-mono">{project.access_url}</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="p-3 rounded-xl bg-void-elevated border border-white/5 text-phantom-gray hover:text-ghost-white hover:border-white/10 transition-all">
            <Settings className="w-5 h-5" />
          </button>
          <button className="p-3 rounded-xl bg-void-elevated border border-white/5 text-phantom-gray hover:text-ghost-white hover:border-white/10 transition-all">
            <MoreVertical className="w-5 h-5" />
          </button>
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neural to-neural-bright text-white font-semibold hover:shadow-glow transition-all duration-300">
            <Zap className="w-5 h-5" />
            Run Test
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up stagger-1">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="glass rounded-xl p-5 border border-white/5 hover:border-white/10 transition-all duration-300"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div
              className={`inline-flex p-2 rounded-lg ${stat.bgColor} ${stat.color} mb-3`}
            >
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-ghost-white">{stat.value}</p>
            <p className="text-sm text-phantom-gray">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Testing Agents */}
      <section className="animate-fade-in-up stagger-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-ghost-white">
            Testing Agents
          </h2>
          <button className="text-sm text-neural-bright hover:text-neural transition-colors">
            Configure Agents
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {AGENTS.map((agent) => (
            <div
              key={agent.id}
              className="glass rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all text-center group cursor-pointer"
            >
              <div
                className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center text-xl mb-3 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${agent.color}20` }}
              >
                {agent.name === "Sarah"
                  ? "🔍"
                  : agent.name === "Marcus"
                  ? "⚡"
                  : agent.name === "Ahmed"
                  ? "♿"
                  : agent.name === "Lin"
                  ? "📱"
                  : agent.name === "Diego"
                  ? "🔥"
                  : "✨"}
              </div>
              <p className="font-medium text-ghost-white text-sm">
                {agent.name}
              </p>
              <p className="text-xs text-mist-gray mt-0.5">Ready</p>
            </div>
          ))}
        </div>
      </section>

      {/* Test Sessions */}
      <section className="animate-fade-in-up stagger-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-ghost-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-neural-bright" />
            Test Sessions
          </h2>
          <Link
            href="/dashboard/reports"
            className="text-sm text-neural-bright hover:text-neural transition-colors"
          >
            View All
          </Link>
        </div>
        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-void-elevated flex items-center justify-center">
              <PlayCircle className="w-8 h-8 text-mist-gray" />
            </div>
            <p className="text-phantom-gray mb-4">
              No test sessions yet. Run your first test to see results here.
            </p>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neural/10 text-neural-bright hover:bg-neural/20 transition-colors">
              <Zap className="w-4 h-4" />
              Start Testing
            </button>
          </div>
        </div>
      </section>

      {/* Bug Reports */}
      <section className="animate-fade-in-up stagger-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-ghost-white flex items-center gap-2">
            <Bug className="w-5 h-5 text-ember-orange" />
            Bug Reports
          </h2>
          <Link
            href="/dashboard/reports"
            className="text-sm text-neural-bright hover:text-neural transition-colors"
          >
            View All
          </Link>
        </div>
        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-void-elevated flex items-center justify-center">
              <Bug className="w-8 h-8 text-mist-gray" />
            </div>
            <p className="text-phantom-gray">
              No bugs reported yet. Our AI agents will find issues and report
              them here.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up stagger-5">
        <button className="glass rounded-xl p-5 border border-white/5 hover:border-neural/30 transition-all text-left group">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-neural/10 text-neural-bright">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="font-medium text-ghost-white group-hover:text-neural-bright transition-colors">
              View Analytics
            </span>
          </div>
          <p className="text-sm text-phantom-gray">
            Detailed insights and trends from your tests
          </p>
        </button>
        <button className="glass rounded-xl p-5 border border-white/5 hover:border-electric-cyan/30 transition-all text-left group">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-electric-cyan/10 text-electric-cyan">
              <Settings className="w-5 h-5" />
            </div>
            <span className="font-medium text-ghost-white group-hover:text-electric-cyan transition-colors">
              Configure Project
            </span>
          </div>
          <p className="text-sm text-phantom-gray">
            Update settings, agents, and test parameters
          </p>
        </button>
        <button className="glass rounded-xl p-5 border border-white/5 hover:border-quantum-green/30 transition-all text-left group">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-quantum-green/10 text-quantum-green">
              <Zap className="w-5 h-5" />
            </div>
            <span className="font-medium text-ghost-white group-hover:text-quantum-green transition-colors">
              Setup Webhooks
            </span>
          </div>
          <p className="text-sm text-phantom-gray">
            Automate testing with CI/CD integration
          </p>
        </button>
      </section>
    </div>
  );
}
