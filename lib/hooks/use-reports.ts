"use client";

import { useState, useEffect } from "react";

export interface BugReport {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "open" | "in_progress" | "fixed" | "wont_fix" | "duplicate";
  title: string;
  description: string;
  agentName: string | null;
  agentColor: string | null;
  reproductionSteps: string[];
  expectedBehavior: string | null;
  actualBehavior: string | null;
  screenshots: string[] | null;
  consoleErrors: unknown[] | null;
  networkLogs: unknown[] | null;
  environmentInfo: Record<string, unknown>;
  projectId: string;
  projectName?: string;
  sessionId?: string;
  createdAt: string;
  updatedAt: string;
}

interface UseReportsOptions {
  projectId?: string;
  severity?: string;
  status?: string;
  limit?: number;
}

interface UseReportsReturn {
  reports: BugReport[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  stats: {
    total: number;
    critical: number;
    open: number;
    fixed: number;
  };
}

export function useReports(options: UseReportsOptions = {}): UseReportsReturn {
  const [reports, setReports] = useState<BugReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (options.projectId) params.set("projectId", options.projectId);
      if (options.severity) params.set("severity", options.severity);
      if (options.status) params.set("status", options.status);
      if (options.limit) params.set("limit", options.limit.toString());

      const res = await fetch(`/api/bug-reports?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch reports");
      const data = await res.json();
      setReports(data.reports || []);
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.projectId, options.severity, options.status, options.limit]);

  // Calculate stats from loaded reports
  const stats = {
    total: reports.length,
    critical: reports.filter((r) => r.severity === "critical").length,
    open: reports.filter((r) => r.status === "open").length,
    fixed: reports.filter((r) => r.status === "fixed").length,
  };

  return {
    reports,
    isLoading,
    error,
    refresh,
    stats,
  };
}
