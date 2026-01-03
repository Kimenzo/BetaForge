"use client";

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useTransition,
  useRef,
} from "react";
import { RequestCache, createCacheKey } from "@/lib/performance/cache";

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
  createProject: (
    data: Omit<Project, "id" | "createdAt" | "updatedAt">
  ) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
}

const CACHE_KEY = "/api/projects";
const CACHE_TTL = 60000; // 1 minute

export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>(() => {
    // Initialize from cache for instant display
    return RequestCache.get<Project[]>(CACHE_KEY) || [];
  });
  const [isLoading, setIsLoading] = useState(
    () => !RequestCache.get(CACHE_KEY)
  );
  const [error, setError] = useState<Error | null>(null);
  const [isPending, startTransition] = useTransition();
  const mountedRef = useRef(true);
  const lastFetchRef = useRef<number>(0);

  const refresh = useCallback(async () => {
    // Dedupe requests within 2 seconds
    const now = Date.now();
    if (now - lastFetchRef.current < 2000) return;
    lastFetchRef.current = now;

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/projects", {
        // Enable HTTP caching
        cache: "no-store",
        headers: {
          "Cache-Control": "max-age=60",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data = await res.json();
      const projectList = data.projects || [];

      // Cache the result
      RequestCache.set(CACHE_KEY, projectList, CACHE_TTL);

      // Use transition for smooth UI update
      if (mountedRef.current) {
        startTransition(() => {
          setProjects(projectList);
        });
      }
    } catch (e) {
      if (mountedRef.current) {
        setError(e instanceof Error ? e : new Error("Unknown error"));
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  const createProject = useCallback(
    async (
      data: Omit<Project, "id" | "createdAt" | "updatedAt">
    ): Promise<Project> => {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create project");
      const result = await res.json();

      // Invalidate cache and refresh
      RequestCache.delete(CACHE_KEY);
      await refresh();

      return result.project;
    },
    [refresh]
  );

  const deleteProject = useCallback(async (id: string): Promise<void> => {
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete project");

    // Optimistic update
    setProjects((prev) => prev.filter((p) => p.id !== id));

    // Invalidate cache
    RequestCache.delete(CACHE_KEY);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    refresh();

    return () => {
      mountedRef.current = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      projects,
      isLoading,
      error,
      refresh,
      createProject,
      deleteProject,
    }),
    [projects, isLoading, error, refresh, createProject, deleteProject]
  );
}
