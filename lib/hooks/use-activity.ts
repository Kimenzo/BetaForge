"use client";

import { useState, useEffect } from "react";

export interface ActivityLog {
  id: string;
  sessionId: string;
  eventType: "agent_started" | "agent_action" | "agent_screenshot" | "agent_bug_found" | "agent_completed" | "agent_failed" | "session_completed";
  agentName: string | null;
  message: string | null;
  data: Record<string, unknown> | null;
  projectId?: string;
  projectName?: string;
  createdAt: string;
}

interface UseActivityOptions {
  sessionId?: string;
  limit?: number;
}

interface UseActivityReturn {
  activities: ActivityLog[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export function useActivity(options: UseActivityOptions = {}): UseActivityReturn {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (options.sessionId) params.set("sessionId", options.sessionId);
      if (options.limit) params.set("limit", options.limit.toString());

      const res = await fetch(`/api/activity?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch activity");
      const data = await res.json();
      setActivities(data.activities || []);
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.sessionId, options.limit]);

  return {
    activities,
    isLoading,
    error,
    refresh,
  };
}
