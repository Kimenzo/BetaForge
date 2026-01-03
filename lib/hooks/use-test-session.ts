"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

interface StartTestResult {
  success: boolean;
  sessionId?: string;
  error?: string;
}

interface UseTestSessionReturn {
  startTest: (projectId: string) => Promise<StartTestResult>;
  isStarting: boolean;
  error: string | null;
}

/**
 * Hook to start a new test session for a project
 * Creates the session via API and navigates to the session detail page
 */
export function useTestSession(): UseTestSessionReturn {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startTest = useCallback(
    async (projectId: string): Promise<StartTestResult> => {
      setIsStarting(true);
      setError(null);

      try {
        // Create a new test session
        const response = await fetch("/api/test-sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId,
            triggerType: "manual",
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          const errorMessage = data.error || "Failed to start test session";
          setError(errorMessage);
          return { success: false, error: errorMessage };
        }

        const sessionId = data.session?.id;

        if (!sessionId) {
          setError("No session ID returned");
          return { success: false, error: "No session ID returned" };
        }

        // Navigate to the session detail page
        router.push(`/sessions/${sessionId}`);

        return { success: true, sessionId };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to start test";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsStarting(false);
      }
    },
    [router]
  );

  return {
    startTest,
    isStarting,
    error,
  };
}

/**
 * Hook to fetch and subscribe to session updates
 */
export function useSessionDetails(sessionId: string) {
  const [session, setSession] = useState<{
    id: string;
    projectId: string;
    status: "queued" | "running" | "completed" | "failed";
    progress: number;
    bugsFound: number;
    startedAt?: string;
    createdAt: string;
    completedAt?: string;
    isDemo?: boolean;
    project?: {
      id: string;
      name: string;
      description?: string;
      platform?: string;
      accessUrl?: string;
    };
    agents: Array<{
      id: string;
      agentId?: string;
      name: string;
      status: string;
      progress: number;
    }>;
    activityLog?: Array<{
      id: string;
      type: string;
      agentName: string | null;
      message: string;
      data?: Record<string, unknown>;
      timestamp: string;
    }>;
    bugReports?: Array<{
      id: string;
      severity: string;
      status: string;
      title: string;
      description: string;
      agentName: string | null;
      createdAt: string;
    }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = useCallback(async () => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/test-sessions/${sessionId}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Session fetch failed:", errorText);
        setError("Failed to load session");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setSession(data.session);
      setError(null);
    } catch (err) {
      console.error("Session fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch session");
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  // Initial fetch
  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return {
    session,
    loading,
    error,
    refetch: fetchSession,
  };
}
