"use client";

import { useState, useEffect } from "react";

interface Project {
  id: string;
  name: string;
  description: string;
  platform: string[];
  accessUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface UseProjectsReturn {
  projects: Project[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  createProject: (data: Omit<Project, "id" | "createdAt" | "updatedAt">) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
}

export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async (
    data: Omit<Project, "id" | "createdAt" | "updatedAt">
  ): Promise<Project> => {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create project");
    const result = await res.json();
    await refresh();
    return result.project;
  };

  const deleteProject = async (id: string): Promise<void> => {
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete project");
    await refresh();
  };

  useEffect(() => {
    refresh();
  }, []);

  return {
    projects,
    isLoading,
    error,
    refresh,
    createProject,
    deleteProject,
  };
}
