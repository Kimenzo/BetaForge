"use client";

import Link from "next/link";
import { useProjects } from "@/lib/hooks";
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
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/ui/card";
import { ProjectCard } from "@/components/ui/projectcard";
import { AGENTS } from "@/lib/agents";

export default function DashboardPage() {
  const { projects, isLoading, deleteProject } = useProjects();

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete project "${name}"? This cannot be undone.`)) {
      await deleteProject(id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="animate-fade-in-up">
          <h1 className="text-3xl font-bold text-ghost-white mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-phantom-gray">
            Here&apos;s what&apos;s happening with your projects today.
          </p>
        </div>
        <div className="flex items-center gap-3 animate-fade-in-up stagger-1">
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="animate-fade-in-up stagger-1">
          <MetricCard
            label="Active Tests"
            value="12"
            change="+3 from yesterday"
            trend="up"
            icon={<PlayCircle className="w-5 h-5" />}
          />
        </div>
        <div className="animate-fade-in-up stagger-2">
          <MetricCard
            label="Bugs Found"
            value="47"
            change="+8 this week"
            trend="up"
            icon={<Bug className="w-5 h-5" />}
          />
        </div>
        <div className="animate-fade-in-up stagger-3">
          <MetricCard
            label="Test Sessions"
            value="156"
            change="24 today"
            trend="neutral"
            icon={<Zap className="w-5 h-5" />}
          />
        </div>
        <div className="animate-fade-in-up stagger-4">
          <MetricCard
            label="Success Rate"
            value="94%"
            change="+2.3%"
            trend="up"
            icon={<TrendingUp className="w-5 h-5" />}
          />
        </div>
      </div>

      {/* Agent Status Bar */}
      <div className="glass rounded-2xl p-6 animate-fade-in-up stagger-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-quantum-green animate-pulse" />
            <h2 className="text-lg font-semibold text-ghost-white">AI Agents Online</h2>
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
          {AGENTS.map((agent) => {
            const avatars: Record<string, string> = {
              sarah: "🔍", marcus: "⚡", ahmed: "♿",
              lin: "📱", diego: "🔥", emma: "✨",
            };
            return (
              <div
                key={agent.id}
                className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-void-elevated/50 border border-white/5 hover:border-neural/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `linear-gradient(135deg, ${agent.color}40, ${agent.color}20)` }}
                >
                  {avatars[agent.id]}
                </div>
                <div>
                  <p className="text-sm font-medium text-ghost-white">{agent.name.split(" ")[0]}</p>
                  <p className="text-xs text-mist-gray">{agent.specialization}</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-quantum-green ml-2" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Projects Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-ghost-white">Your Projects</h2>
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
        ) : projects.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center animate-fade-in-up">
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
            {projects.slice(0, 6).map((project, index) => (
              <div
                key={project.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProjectCard
                  project={{
                    ...project,
                    status: "idle" as const,
                    stats: {
                      bugsFound: Math.floor(Math.random() * 20),
                      sessionsCount: Math.floor(Math.random() * 10),
                    },
                  }}
                  onDelete={() => handleDelete(project.id, project.name)}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent Activity */}
      <section className="animate-fade-in-up stagger-3">
        <h2 className="text-xl font-semibold text-ghost-white mb-6">Recent Activity</h2>
        <div className="glass rounded-2xl overflow-hidden">
          <div className="divide-y divide-white/5">
            {[
              {
                agent: "Diego",
                emoji: "🔥",
                color: "#F97316",
                action: "found a security vulnerability",
                project: "E-commerce Platform",
                time: "2 minutes ago",
              },
              {
                agent: "Ahmed",
                emoji: "♿",
                color: "#10B981",
                action: "completed accessibility audit",
                project: "Dashboard App",
                time: "15 minutes ago",
              },
              {
                agent: "Sarah",
                emoji: "🔍",
                color: "#8B5CF6",
                action: "discovered 3 UX issues",
                project: "Mobile Banking",
                time: "1 hour ago",
              },
              {
                agent: "Marcus",
                emoji: "⚡",
                color: "#06B6D4",
                action: "tested keyboard navigation",
                project: "Admin Portal",
                time: "2 hours ago",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${activity.color}40, ${activity.color}20)` }}
                >
                  {activity.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ghost-white">
                    <span className="font-semibold">{activity.agent}</span>{" "}
                    <span className="text-phantom-gray">{activity.action}</span>{" "}
                    <span className="text-neural-bright">{activity.project}</span>
                  </p>
                </div>
                <span className="text-xs text-mist-gray whitespace-nowrap">
                  {activity.time}
                </span>
              </div>
            ))}
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
