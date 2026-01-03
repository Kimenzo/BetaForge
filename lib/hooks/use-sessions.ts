"use client";

import { useState, useEffect } from "react";

export interface TestSession {
  id: string;
  projectId: string;
  projectName?: string;
  status: "queued" | "running" | "completed" | "failed";
  triggerType: "manual" | "webhook" | "scheduled";
  progress: number;
  bugsFound: number;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  agents: {
    id: string;
    agentId: string;
    name: string;
    status: string;
    progress: number;
  }[];
}

interface UseSessionsOptions {
  projectId?: string;
  status?: string;
  limit?: number;
}

interface UseSessionsReturn {
  sessions: TestSession[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  stats: {
    total: number;
    running: number;
    completed: number;
    queued: number;
  };
}

export function useSessions(options: UseSessionsOptions = {}): UseSessionsReturn {
  const [sessions, setSessions] = useState<TestSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (options.projectId) params.set("projectId", options.projectId);
      if (options.status) params.set("status", options.status);
      if (options.limit) params.set("limit", options.limit.toString());

      const res = await fetch(`/api/test-sessions?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch sessions");
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.projectId, options.status, options.limit]);

  // Calculate stats from loaded sessions
  const stats = {
    total: sessions.length,
    running: sessions.filter((s) => s.status === "running").length,
    completed: sessions.filter((s) => s.status === "completed").length,
    queued: sessions.filter((s) => s.status === "queued").length,
  };

  return {
    sessions,
    isLoading,
    error,
    refresh,
    stats,
  };
}
