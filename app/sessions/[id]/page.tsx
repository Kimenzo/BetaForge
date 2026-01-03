"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  Clock,
  StopCircle,
  Activity,
  Bug,
  Globe,
  Zap,
  Loader2,
  AlertCircle,
  Play,
  Eye,
} from "lucide-react";
import { AGENTS } from "@/lib/agents";
import { Button } from "@/components/ui/button";
import { useSessionDetails } from "@/lib/hooks";
import { TestSimulator } from "@/components/simulation";

interface SessionPageProps {
  params: Promise<{ id: string }>;
}

export default function SessionDetailPage({ params }: SessionPageProps) {
  const [id, setId] = useState<string>("");
  const [showSimulator, setShowSimulator] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<{ id: string; name: string } | null>(null);
  const { session, loading, error, refetch } = useSessionDetails(id);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  // Auto-refresh while session is running
  useEffect(() => {
    if (!session || session.status !== "running") return;
    
    const interval = setInterval(() => {
      refetch();
    }, 3000); // Refresh every 3 seconds while running
    
    return () => clearInterval(interval);
  }, [session?.status, refetch]);

  // Format activity log entries from API data
  const activityLogs = session?.activityLog?.map(log => ({
    time: new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false }),
    agent: log.agentName || 'System',
    action: log.message,
    type: log.type === 'bug_found' ? 'bug' as const : 
          log.type === 'agent_completed' ? 'success' as const : undefined,
  })) || [];

  const statusConfig = {
    running: {
      label: "Running",
      color: "text-electric-cyan",
      bg: "bg-electric-cyan/10",
      border: "border-electric-cyan/20",
      dot: "bg-electric-cyan",
    },
    completed: {
      label: "Completed",
      color: "text-quantum-green",
      bg: "bg-quantum-green/10",
      border: "border-quantum-green/20",
      dot: "bg-quantum-green",
    },
    failed: {
      label: "Failed",
      color: "text-crimson-red",
      bg: "bg-crimson-red/10",
      border: "border-crimson-red/20",
      dot: "bg-crimson-red",
    },
    queued: {
      label: "Queued",
      color: "text-phantom-gray",
      bg: "bg-phantom-gray/10",
      border: "border-phantom-gray/20",
      dot: "bg-phantom-gray",
    },
  };

  const getAgentEmoji = (name: string) => {
    const emojis: Record<string, string> = {
      Sarah: "🔍",
      Marcus: "⚡",
      Ahmed: "♿",
      Lin: "📱",
      Diego: "🔥",
      Emma: "✨",
    };
    return emojis[name] || "🤖";
  };

  const getAgentColor = (name: string) => {
    const agent = AGENTS.find((a) => a.name === name);
    return agent?.color || "#8B5CF6";
  };

  // Loading state
  if (loading || !id) {
    return (
      <div className="min-h-screen bg-void-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-neural-bright animate-spin mx-auto mb-4" />
          <p className="text-phantom-gray">Loading session details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !session) {
    return (
      <div className="min-h-screen bg-void-black flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-crimson-red mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-ghost-white mb-2">Session Not Found</h2>
          <p className="text-phantom-gray mb-6">{error || "Unable to load session details."}</p>
          <Link href="/dashboard">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Map agents for display
  const displayAgents = session.agents?.map(agent => ({
    id: agent.id,
    name: agent.name,
    status: agent.status,
    progress: agent.progress || 0,
    bugsFound: session.bugReports?.filter(b => b.agentName === agent.name).length || 0,
  })) || [];

  return (
    <div className="min-h-screen bg-void-black">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-neural/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-electric-cyan/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-8">
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-phantom-gray hover:text-ghost-white transition-colors group mb-8"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8 animate-fade-in-up">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-neural/20 to-electric-cyan/20 border border-white/10">
                <Activity className="w-6 h-6 text-neural-bright" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-ghost-white">
                  Test Session
                </h1>
                <p className="text-phantom-gray">{session.project?.name || "Test Session"}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-4">
              <span
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
                  statusConfig[session.status].bg
                } ${statusConfig[session.status].color} ${
                  statusConfig[session.status].border
                } border`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    statusConfig[session.status].dot
                  } ${session.status === "running" ? "animate-pulse" : ""}`}
                />
                {statusConfig[session.status].label}
              </span>
              <span className="text-sm text-phantom-gray flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                Started {new Date(session.startedAt || session.createdAt).toLocaleString()}
              </span>
              {session.project?.accessUrl && (
                <a
                  href={session.project.accessUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-electric-cyan hover:text-electric-cyan/80 flex items-center gap-1.5"
                >
                  <Globe className="w-4 h-4" />
                  {session.project.accessUrl}
                </a>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {session.project?.accessUrl && (
              <Button 
                onClick={() => {
                  // Pick first available agent or Sarah as default
                  const agent = session.agents?.[0] || { id: "sarah", name: "Sarah" };
                  setSelectedAgent({ id: agent.id, name: agent.name });
                  setShowSimulator(true);
                }}
                className="bg-neural hover:bg-neural-bright text-void-black group"
              >
                <Eye className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                Watch Live Test
              </Button>
            )}
            <Button variant="destructive" className="group">
              <StopCircle className="w-4 h-4 transition-transform group-hover:scale-110" />
              Stop Test
            </Button>
          </div>
        </div>

        {/* Live Test Simulator Modal */}
        {showSimulator && selectedAgent && session.project?.accessUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-void-black/80 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-7xl max-h-[90vh] overflow-hidden">
              <TestSimulator
                targetUrl={session.project.accessUrl}
                agentId={selectedAgent.id}
                agentName={selectedAgent.name}
                onComplete={() => {
                  refetch();
                }}
                onClose={() => {
                  setShowSimulator(false);
                  setSelectedAgent(null);
                }}
              />
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="glass rounded-2xl p-6 border border-white/5 mb-8 animate-fade-in-up stagger-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-phantom-gray">Overall Progress</span>
            <span className="text-sm font-medium text-ghost-white">
              {session.progress}%
            </span>
          </div>
          <div className="h-2 bg-void-elevated rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-neural to-electric-cyan rounded-full transition-all duration-1000"
              style={{ width: `${session.progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-sm text-phantom-gray">
              {displayAgents.filter((a) => a.status === "completed").length} of{" "}
              {displayAgents.length} agents completed
            </span>
            <span className="text-sm text-ember-orange flex items-center gap-1.5">
              <Bug className="w-4 h-4" />
              {session.bugsFound || 0} bugs found
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Agent Grid */}
          <div className="lg:col-span-2">
            <section className="animate-fade-in-up stagger-2">
              <h2 className="text-xl font-semibold text-ghost-white mb-4 flex items-center gap-2">
                <Bot className="w-5 h-5 text-neural-bright" />
                Agent Status
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {displayAgents.map((agent) => {
                  const config =
                    statusConfig[agent.status as keyof typeof statusConfig];
                  return (
                    <div
                      key={agent.id}
                      className={`glass rounded-xl p-5 border transition-all duration-300 ${
                        agent.status === "running"
                          ? "border-electric-cyan/30"
                          : agent.status === "completed"
                          ? "border-quantum-green/20"
                          : "border-white/5"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                            style={{
                              backgroundColor: `${getAgentColor(agent.name)}20`,
                            }}
                          >
                            {getAgentEmoji(agent.name)}
                          </div>
                          <span className="font-medium text-ghost-white">
                            {agent.name}
                          </span>
                        </div>
                        {agent.status === "completed" && (
                          <CheckCircle2 className="w-5 h-5 text-quantum-green" />
                        )}
                        {agent.status === "running" && (
                          <Clock className="w-5 h-5 text-electric-cyan animate-pulse" />
                        )}
                        {agent.status === "queued" && (
                          <Clock className="w-5 h-5 text-mist-gray" />
                        )}
                      </div>

                      {/* Progress */}
                      {agent.status !== "queued" && (
                        <div className="mb-3">
                          <div className="h-1.5 bg-void-elevated rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                agent.status === "completed"
                                  ? "bg-quantum-green"
                                  : "bg-electric-cyan"
                              }`}
                              style={{ width: `${agent.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm">
                        <span className={config.color}>{config.label}</span>
                        <div className="flex items-center gap-2">
                          {agent.bugsFound > 0 && (
                            <span className="text-ember-orange flex items-center gap-1">
                              <Bug className="w-3 h-3" />
                              {agent.bugsFound}
                            </span>
                          )}
                          {session.project?.accessUrl && (
                            <button
                              onClick={() => {
                                setSelectedAgent({ id: agent.id, name: agent.name });
                                setShowSimulator(true);
                              }}
                              className="p-1 rounded hover:bg-white/10 text-phantom-gray hover:text-electric-cyan transition-colors"
                              title={`Watch ${agent.name} test`}
                            >
                              <Play className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Live Activity Feed */}
          <div className="lg:col-span-1">
            <section className="animate-fade-in-up stagger-3">
              <h2 className="text-xl font-semibold text-ghost-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-electric-cyan" />
                Live Activity
              </h2>
              <div className="glass rounded-2xl border border-white/5 overflow-hidden">
                <div className="h-[400px] overflow-y-auto p-4 space-y-2 font-mono text-sm">
                  {activityLogs.map((log, i) => (
                    <div
                      key={i}
                      className={`py-2 px-3 rounded-lg ${
                        log.type === "bug"
                          ? "bg-crimson-red/10 border border-crimson-red/20"
                          : log.type === "success"
                          ? "bg-quantum-green/10 border border-quantum-green/20"
                          : "bg-void-elevated/50"
                      }`}
                    >
                      <span className="text-mist-gray">[{log.time}]</span>{" "}
                      <span
                        className="font-medium"
                        style={{ color: getAgentColor(log.agent) }}
                      >
                        {log.agent}:
                      </span>{" "}
                      <span
                        className={
                          log.type === "bug"
                            ? "text-crimson-red"
                            : log.type === "success"
                            ? "text-quantum-green"
                            : "text-phantom-gray"
                        }
                      >
                        {log.action}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
