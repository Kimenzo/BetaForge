"use client";

import { useState } from "react";
import Link from "next/link";
import { Activity, Zap, Target, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AgentPersona } from "@/lib/types";

interface AgentCardProps {
  agent: AgentPersona;
  stats?: {
    testsRun: number;
    bugsFound: number;
    lastActive?: string;
  };
  isActive?: boolean;
  onClick?: () => void;
}

// Agent avatar emojis
const agentAvatars: Record<string, string> = {
  sarah: "🔍",
  marcus: "⚡",
  ahmed: "♿",
  lin: "📱",
  diego: "🔥",
  emma: "✨",
};

// Agent accent colors for gradient
const agentColors: Record<string, { from: string; to: string }> = {
  sarah: { from: "#8B5CF6", to: "#6366F1" },
  marcus: { from: "#06B6D4", to: "#0EA5E9" },
  ahmed: { from: "#10B981", to: "#059669" },
  lin: { from: "#EC4899", to: "#F43F5E" },
  diego: { from: "#F97316", to: "#EF4444" },
  emma: { from: "#A78BFA", to: "#8B5CF6" },
};

export function AgentCard({ agent, stats, isActive = true, onClick }: AgentCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const colors = agentColors[agent.id] || { from: "#8B5CF6", to: "#06B6D4" };
  const avatar = agentAvatars[agent.id] || agent.name[0];

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer",
        "bg-void-surface/80 border border-white/5",
        isHovered && "border-white/20 scale-[1.02]"
      )}
      style={{
        boxShadow: isHovered
          ? `0 20px 40px rgba(0,0,0,0.4), 0 0 40px ${colors.from}20`
          : "0 4px 20px rgba(0,0,0,0.2)",
      }}
    >
      {/* Animated gradient background on hover */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-500",
          isHovered && "opacity-100"
        )}
        style={{
          background: `radial-gradient(circle at 50% 0%, ${colors.from}15 0%, transparent 60%)`,
        }}
      />

      {/* Holographic border effect */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none",
          isHovered && "opacity-100"
        )}
        style={{
          background: `linear-gradient(135deg, ${colors.from}30, transparent 40%, transparent 60%, ${colors.to}30)`,
        }}
      />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar */}
          <div
            className="relative w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
            style={{
              background: `linear-gradient(135deg, ${colors.from}40, ${colors.to}40)`,
            }}
          >
            {avatar}
            {/* Active indicator */}
            {isActive && (
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-quantum-green border-2 border-void-surface animate-pulse" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-ghost-white truncate">
              {agent.name}
            </h3>
            <p
              className="text-sm font-medium truncate"
              style={{ color: colors.from }}
            >
              {agent.specialization}
            </p>
            <div className="flex items-center gap-1 mt-1 text-phantom-gray text-xs">
              <Activity className="w-3 h-3" />
              <span>{isActive ? "Online" : "Offline"}</span>
            </div>
          </div>

          {/* Hover arrow */}
          <ChevronRight
            className={cn(
              "w-5 h-5 text-mist-gray transition-all duration-300",
              isHovered && "text-ghost-white translate-x-1"
            )}
          />
        </div>

        {/* Description */}
        <p className="text-sm text-phantom-gray line-clamp-2 mb-4 leading-relaxed">
          {agent.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {agent.traits.slice(0, 3).map((trait) => (
            <span
              key={trait}
              className="px-2.5 py-1 text-xs rounded-full bg-white/5 text-phantom-gray border border-white/5"
            >
              {trait}
            </span>
          ))}
          {agent.traits.length > 3 && (
            <span className="px-2.5 py-1 text-xs rounded-full bg-white/5 text-mist-gray">
              +{agent.traits.length - 3}
            </span>
          )}
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${colors.from}15` }}
              >
                <Zap className="w-4 h-4" style={{ color: colors.from }} />
              </div>
              <div>
                <p className="text-lg font-semibold text-ghost-white">
                  {stats.testsRun}
                </p>
                <p className="text-xs text-mist-gray">Tests Run</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${colors.to}15` }}
              >
                <Target className="w-4 h-4" style={{ color: colors.to }} />
              </div>
              <div>
                <p className="text-lg font-semibold text-ghost-white">
                  {stats.bugsFound}
                </p>
                <p className="text-xs text-mist-gray">Bugs Found</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Compact version for sidebars and lists
interface AgentAvatarProps {
  agent: AgentPersona;
  size?: "sm" | "md" | "lg";
  showStatus?: boolean;
  showTooltip?: boolean;
}

export function AgentAvatar({
  agent,
  size = "md",
  showStatus = true,
  showTooltip = false,
}: AgentAvatarProps) {
  const [showTip, setShowTip] = useState(false);
  const colors = agentColors[agent.id] || { from: "#8B5CF6", to: "#06B6D4" };
  const avatar = agentAvatars[agent.id] || agent.name[0];

  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-lg",
    lg: "w-16 h-16 text-2xl",
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
    >
      <div
        className={cn(
          "rounded-xl flex items-center justify-center transition-transform duration-300 hover:scale-110",
          sizes[size]
        )}
        style={{
          background: `linear-gradient(135deg, ${colors.from}40, ${colors.to}40)`,
        }}
      >
        {avatar}
      </div>

      {showStatus && (
        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-quantum-green border-2 border-void-surface" />
      )}

      {showTooltip && showTip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-void-black border border-white/10 whitespace-nowrap z-50 animate-fade-in">
          <p className="text-sm font-medium text-ghost-white">{agent.name}</p>
          <p className="text-xs text-phantom-gray">{agent.specialization}</p>
        </div>
      )}
    </div>
  );
}