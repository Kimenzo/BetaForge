"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Globe,
  Smartphone,
  Monitor,
  MoreVertical,
  Play,
  Pause,
  Settings,
  Trash2,
  ExternalLink,
  Bug,
  Clock,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";

// Simplified project type for card display (doesn't need all backend fields)
interface ProjectCardData {
  id: string;
  name: string;
  description: string;
  platform: string | string[];
  accessUrl?: string;
  status?: "active" | "testing" | "idle" | "error";
  agentIds?: string[];
  stats?: {
    bugsFound: number;
    sessionsCount: number;
  };
}

interface ProjectCardProps {
  project: ProjectCardData;
  onStartTest?: () => void;
  onDelete?: () => void;
}

const platformIcons = {
  web: Globe,
  mobile: Smartphone,
  desktop: Monitor,
};

const platformColors = {
  web: "from-electric-cyan to-blue-500",
  mobile: "from-plasma-pink to-rose-500",
  desktop: "from-neural to-purple-600",
};

export function ProjectCard({ project, onStartTest, onDelete }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Handle platform as array - use first platform as primary
  const primaryPlatform = Array.isArray(project.platform) 
    ? project.platform[0] 
    : project.platform;
  
  const Icon = platformIcons[primaryPlatform as keyof typeof platformIcons] || Globe;
  const gradientClass = platformColors[primaryPlatform as keyof typeof platformColors] || platformColors.web;
  
  const statusColors = {
    active: { bg: "bg-quantum-green/10", text: "text-quantum-green", dot: "bg-quantum-green" },
    testing: { bg: "bg-electric-cyan/10", text: "text-electric-cyan", dot: "bg-electric-cyan" },
    idle: { bg: "bg-phantom-gray/10", text: "text-phantom-gray", dot: "bg-phantom-gray" },
    error: { bg: "bg-crimson-red/10", text: "text-crimson-red", dot: "bg-crimson-red" },
  };
  
  const status = statusColors[project.status as keyof typeof statusColors] || statusColors.idle;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setMenuOpen(false); }}
      className={cn(
        "group relative rounded-2xl overflow-hidden transition-all duration-500",
        "bg-void-surface/80 border border-white/5",
        isHovered && "border-white/15 shadow-xl"
      )}
      style={{
        transform: isHovered ? "translateY(-8px)" : "translateY(0)",
        boxShadow: isHovered
          ? "0 25px 50px rgba(0, 0, 0, 0.4), 0 0 40px rgba(139, 92, 246, 0.1)"
          : "0 4px 20px rgba(0, 0, 0, 0.2)",
      }}
    >
      {/* Top gradient bar */}
      <div className={cn("h-1 bg-gradient-to-r", gradientClass)} />
      
      {/* Hover glow effect */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none",
          isHovered && "opacity-100"
        )}
        style={{
          background: "radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
        }}
      />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Platform Icon */}
            <div className={cn("p-3 rounded-xl bg-gradient-to-br", gradientClass, "bg-opacity-20")}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            
            <div>
              <Link 
                href={`/dashboard/projects/${project.id}`}
                className="text-lg font-semibold text-ghost-white hover:text-neural-bright transition-colors line-clamp-1"
              >
                {project.name}
              </Link>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={cn("inline-flex items-center gap-1.5 text-xs", status.text)}>
                  <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", status.dot)} />
                  {(project.status || "idle").charAt(0).toUpperCase() + (project.status || "idle").slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg text-mist-gray hover:text-ghost-white hover:bg-void-elevated transition-all duration-200"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-void-elevated border border-white/10 shadow-xl z-50 animate-scale-in origin-top-right">
                <div className="py-1">
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-phantom-gray hover:text-ghost-white hover:bg-white/5 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                  {project.accessUrl && (
                    <a
                      href={project.accessUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-phantom-gray hover:text-ghost-white hover:bg-white/5 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Open URL</span>
                    </a>
                  )}
                  <button
                    onClick={() => { onDelete?.(); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-crimson-red hover:bg-crimson-red/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {project.description && (
          <p className="text-sm text-phantom-gray line-clamp-2 mb-4">
            {project.description}
          </p>
        )}

        {/* URL */}
        {project.accessUrl && (
          <div className="flex items-center gap-2 px-3 py-2 mb-4 rounded-lg bg-void-elevated/50 border border-white/5">
            <Globe className="w-4 h-4 text-mist-gray flex-shrink-0" />
            <span className="text-sm text-phantom-gray truncate font-mono">
              {project.accessUrl}
            </span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-3 rounded-xl bg-void-elevated/30">
            <div className="flex items-center justify-center gap-1 text-neural-bright mb-1">
              <Bug className="w-4 h-4" />
            </div>
            <p className="text-lg font-semibold text-ghost-white">
              {project.stats?.bugsFound ?? 0}
            </p>
            <p className="text-[10px] text-mist-gray uppercase tracking-wider">Bugs</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-void-elevated/30">
            <div className="flex items-center justify-center gap-1 text-electric-cyan mb-1">
              <Clock className="w-4 h-4" />
            </div>
            <p className="text-lg font-semibold text-ghost-white">
              {project.stats?.sessionsCount ?? 0}
            </p>
            <p className="text-[10px] text-mist-gray uppercase tracking-wider">Sessions</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-void-elevated/30">
            <div className="flex items-center justify-center gap-1 text-plasma-pink mb-1">
              <Users className="w-4 h-4" />
            </div>
            <p className="text-lg font-semibold text-ghost-white">
              {project.agentIds?.length ?? 6}
            </p>
            <p className="text-[10px] text-mist-gray uppercase tracking-wider">Agents</p>
          </div>
        </div>

        {/* Agents */}
        {project.agentIds && project.agentIds.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-mist-gray">Testing agents:</span>
            <div className="flex -space-x-2">
              {["🔍", "⚡", "♿", "📱", "🔥", "✨"].slice(0, project.agentIds.length).map((emoji, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-lg bg-void-elevated border border-void-surface flex items-center justify-center text-sm"
                >
                  {emoji}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={onStartTest}
          className={cn(
            "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300",
            project.status === "testing"
              ? "bg-void-elevated text-phantom-gray border border-white/10 hover:bg-white/5"
              : "bg-gradient-to-r from-neural to-electric-cyan text-white hover:shadow-glow hover:-translate-y-0.5"
          )}
        >
          {project.status === "testing" ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Testing in Progress</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Start Testing</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}