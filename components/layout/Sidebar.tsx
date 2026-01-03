"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  Bug,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  Activity,
  Clock,
  Sparkles,
} from "lucide-react";
import { AGENTS } from "@/lib/agents";

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/projects", label: "Projects", icon: FolderOpen },
    { href: "/dashboard/reports", label: "Reports", icon: Bug },
    { href: "/agents", label: "Agents", icon: Users },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  // Get avatar emoji or first letter for each agent
  const getAgentAvatar = (agent: typeof AGENTS[0]) => {
    const avatars: Record<string, string> = {
      sarah: "🔍",
      marcus: "⚡",
      ahmed: "♿",
      lin: "📱",
      diego: "🔥",
      emma: "✨",
    };
    return avatars[agent.id] || agent.name[0];
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen z-40 transition-all duration-500 ease-out-expo ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Background */}
      <div className="absolute inset-0 glass border-r border-white/5">
        {/* Subtle mesh gradient */}
        <div className="absolute inset-0 opacity-30 mesh-bg" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col p-4">
        {/* Logo */}
        <div className="flex items-center justify-between mb-8 pt-2">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-neural-bright/30 blur-xl rounded-full" />
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-neural-bright to-electric-cyan flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold gradient-text">BetaForge</span>
            </Link>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg bg-void-surface/50 text-phantom-gray hover:text-ghost-white hover:bg-void-elevated transition-all duration-300"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 stagger-${index + 1} animate-fade-in ${
                  active
                    ? "bg-neural/15 text-ghost-white neural-glow-static"
                    : "text-phantom-gray hover:text-ghost-white hover:bg-white/5"
                }`}
              >
                <div
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    active
                      ? "bg-neural/20"
                      : "bg-void-surface/50 group-hover:bg-void-elevated"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors duration-300 ${
                      active ? "text-neural-bright" : ""
                    }`}
                  />
                </div>
                {!collapsed && (
                  <>
                    <span className="font-medium">{item.label}</span>
                    {active && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-neural-bright animate-pulse" />
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* New Project Button */}
        {!collapsed && (
          <Link
            href="/dashboard/projects/new"
            className="flex items-center justify-center gap-2 px-4 py-3 mb-6 rounded-xl bg-gradient-to-r from-neural to-electric-cyan text-white font-semibold btn-neural"
          >
            <Plus className="w-5 h-5" />
            <span>New Project</span>
          </Link>
        )}

        {/* Agent Control Panel */}
        {!collapsed && (
          <div className="border-t border-white/5 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs text-mist-gray uppercase tracking-wider font-semibold">
                AI Agents
              </h3>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-quantum-green/10 text-quantum-green text-xs">
                <Activity className="w-3 h-3" />
                <span>6 Online</span>
              </div>
            </div>

            {/* Agent Avatars */}
            <div className="grid grid-cols-3 gap-2">
              {AGENTS.map((agent) => (
                <button
                  key={agent.id}
                  onMouseEnter={() => setHoveredAgent(agent.id)}
                  onMouseLeave={() => setHoveredAgent(null)}
                  className={`relative p-3 rounded-xl transition-all duration-300 ${
                    hoveredAgent === agent.id
                      ? "bg-void-elevated scale-105 shadow-glow"
                      : "bg-void-surface/30 hover:bg-void-surface"
                  }`}
                >
                  {/* Agent Avatar */}
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                      style={{
                        background: `linear-gradient(135deg, ${agent.color}40, ${agent.color}20)`,
                      }}
                    >
                      {getAgentAvatar(agent)}
                    </div>
                    <span className="text-xs text-phantom-gray truncate w-full text-center">
                      {agent.name.split(" ")[0]}
                    </span>
                  </div>

                  {/* Online Indicator */}
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-quantum-green animate-pulse" />

                  {/* Hover Tooltip */}
                  {hoveredAgent === agent.id && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-void-black border border-white/10 whitespace-nowrap z-50 animate-fade-in">
                      <p className="text-sm font-medium text-ghost-white">
                        {agent.name}
                      </p>
                      <p className="text-xs text-phantom-gray">
                        {agent.specialization}
                      </p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity (Collapsed shows only icons) */}
        {!collapsed && (
          <div className="mt-4 p-3 rounded-xl bg-void-surface/30 border border-white/5">
            <div className="flex items-center gap-2 text-phantom-gray text-xs mb-2">
              <Clock className="w-3 h-3" />
              <span>Latest Activity</span>
            </div>
            <p className="text-sm text-ghost-white truncate">
              Diego found 3 issues in E-commerce...
            </p>
            <p className="text-xs text-mist-gray mt-1">2 minutes ago</p>
          </div>
        )}

        {/* Collapsed Agent Indicators */}
        {collapsed && (
          <div className="space-y-2">
            {AGENTS.slice(0, 4).map((agent) => (
              <div
                key={agent.id}
                className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center text-lg"
                style={{
                  background: `linear-gradient(135deg, ${agent.color}40, ${agent.color}20)`,
                }}
              >
                {getAgentAvatar(agent)}
              </div>
            ))}
            <div className="w-12 h-12 mx-auto rounded-xl bg-void-surface/50 flex items-center justify-center text-phantom-gray text-sm">
              +2
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
