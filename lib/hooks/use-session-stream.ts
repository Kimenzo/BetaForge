"use client";

import { useEffect, useState, useCallback } from "react";
import type { AgentEvent } from "@/lib/types";

interface UseSessionStreamOptions {
  sessionId: string;
  onEvent?: (event: AgentEvent) => void;
  autoConnect?: boolean;
}

interface UseSessionStreamReturn {
  events: AgentEvent[];
  isConnected: boolean;
  error: Error | null;
  connect: () => void;
  disconnect: () => void;
}

export function useSessionStream({
  sessionId,
  onEvent,
  autoConnect = true,
}: UseSessionStreamOptions): UseSessionStreamReturn {
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  const connect = useCallback(() => {
    if (eventSource) {
      eventSource.close();
    }

    const source = new EventSource(`/api/test-sessions/${sessionId}/stream`);

    source.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as AgentEvent;
        setEvents((prev) => [...prev, data]);
        onEvent?.(data);
      } catch (e) {
        console.error("Failed to parse SSE event:", e);
      }
    };

    source.onerror = () => {
      setIsConnected(false);
      setError(new Error("Connection lost"));
      source.close();
    };

    setEventSource(source);
  }, [sessionId, onEvent, eventSource]);

  const disconnect = useCallback(() => {
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
      setIsConnected(false);
    }
  }, [eventSource]);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [sessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    events,
    isConnected,
    error,
    connect,
    disconnect,
  };
}
