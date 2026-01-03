"use client";

import Link from "next/link";
import { Plus, Search, Filter, Grid3X3, List, Sparkles, Loader2 } from "lucide-react";
import { useProjects, useTestSession } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProjectCard } from "@/components/ui/projectcard";
import { CardSkeleton } from "@/components/ui/loading";
import { useState } from "react";

export default function ProjectsPage() {
  const { projects, isLoading, deleteProject } = useProjects();
  const { startTest, isStarting } = useTestSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [startingProjectId, setStartingProjectId] = useState<string | null>(null);

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete project "${name}"? This cannot be undone.`)) {
      await deleteProject(id);
    }
  };

  const handleStartTest = async (projectId: string) => {
    setStartingProjectId(projectId);
    await startTest(projectId);
    setStartingProjectId(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="animate-fade-in-up">
          <h1 className="text-3xl font-bold text-ghost-white mb-2">Projects</h1>
          <p className="text-phantom-gray">
            All your applications under AI-powered testing
          </p>
        </div>
        <div className="flex items-center gap-3 animate-fade-in-up stagger-1">
          <Link href="/dashboard/projects/new">
            <Button className="group">
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
              New Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 animate-fade-in-up stagger-2">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mist-gray" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 bg-void-elevated border-white/5"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
          <div className="flex items-center rounded-lg bg-void-elevated border border-white/5 p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-all ${
                viewMode === "grid"
                  ? "bg-neural/20 text-neural-bright"
                  : "text-mist-gray hover:text-ghost-white"
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-all ${
                viewMode === "list"
                  ? "bg-neural/20 text-neural-bright"
                  : "text-mist-gray hover:text-ghost-white"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid/List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col gap-4"
          }
        >
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ProjectCard
                project={{
                  ...project,
                  status: startingProjectId === project.id 
                    ? "testing" 
                    : (project as { status?: string }).status as "active" | "testing" | "idle" | "error" || "idle",
                  stats: (project as { stats?: { bugsFound: number; sessionsCount: number } }).stats || {
                    bugsFound: 0,
                    sessionsCount: 0,
                  },
                }}
                onStartTest={() => handleStartTest(project.id)}
                onDelete={() => handleDelete(project.id, project.name)}
              />
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-void-surface/50 p-12 text-center animate-fade-in-up">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neural/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-neural/20 to-electric-cyan/20 flex items-center justify-center border border-white/10">
              <Sparkles className="w-10 h-10 text-neural-bright" />
            </div>
            <h3 className="text-xl font-semibold text-ghost-white mb-2">
              {searchQuery ? "No matching projects" : "No projects yet"}
            </h3>
            <p className="text-phantom-gray mb-6 max-w-md mx-auto">
              {searchQuery
                ? "Try adjusting your search query"
                : "Create your first project to start AI-powered beta testing with our diverse team of agent personas."}
            </p>
            {!searchQuery && (
              <Link href="/dashboard/projects/new">
                <Button size="lg" className="group">
                  <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                  Add Your First Project
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
