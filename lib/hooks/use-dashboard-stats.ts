"use client";

import { useState, useEffect } from "react";

interface DashboardStats {
  activeTests: number;
  bugsFound: number;
  testSessions: number;
  successRate: number;
  todaysSessions: number;
  weeklyBugs: number;
}

interface UseDashboardStatsReturn {
  stats: DashboardStats;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export function useDashboardStats(): UseDashboardStatsReturn {
  const [stats, setStats] = useState<DashboardStats>({
    activeTests: 0,
    bugsFound: 0,
    testSessions: 0,
    successRate: 0,
    todaysSessions: 0,
    weeklyBugs: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      setStats(data.stats);
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return {
    stats,
    isLoading,
    error,
    refresh,
  };
}
