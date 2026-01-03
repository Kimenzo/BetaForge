import { NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase";

interface StreamParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: StreamParams) {
  const { id } = await params;
  const supabase = createServerClient();

  // Verify session exists
  const { data: session, error } = await supabase
    .from("test_sessions")
    .select("id, status, project_id")
    .eq("id", id)
    .single();

  if (error || !session) {
    return new Response(JSON.stringify({ error: "Session not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const encoder = new TextEncoder();
  let lastEventTime: string | null = null;
  let isStreamClosed = false;

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (data: Record<string, unknown>) => {
        if (isStreamClosed) return;
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch {
          isStreamClosed = true;
        }
      };

      // Send initial connection event
      sendEvent({
        type: "connected",
        sessionId: id,
        status: session.status,
        timestamp: new Date().toISOString(),
      });

      // Fetch initial activity logs
      const { data: initialLogs } = await supabase
        .from("activity_logs")
        .select("*")
        .eq("session_id", id)
        .order("created_at", { ascending: true });

      if (initialLogs && initialLogs.length > 0) {
        // Send existing logs
        for (const log of initialLogs) {
          sendEvent({
            type: log.event_type,
            sessionId: id,
            agentName: log.agent_name,
            message: log.message,
            data: log.data,
            timestamp: log.created_at,
          });
          lastEventTime = log.created_at;
        }
      }

      // Poll for new events (in production, use Supabase Realtime)
      const pollInterval = setInterval(async () => {
        if (isStreamClosed) {
          clearInterval(pollInterval);
          return;
        }

        try {
          // Get new activity logs since last event
          let query = supabase
            .from("activity_logs")
            .select("*")
            .eq("session_id", id)
            .order("created_at", { ascending: true });

          if (lastEventTime) {
            query = query.gt("created_at", lastEventTime);
          }

          const { data: newLogs } = await query;

          if (newLogs && newLogs.length > 0) {
            for (const log of newLogs) {
              sendEvent({
                type: log.event_type,
                sessionId: id,
                agentName: log.agent_name,
                message: log.message,
                data: log.data,
                timestamp: log.created_at,
              });
              lastEventTime = log.created_at;
            }
          }

          // Check session status
          const { data: currentSession } = await supabase
            .from("test_sessions")
            .select("status, progress, bugs_found")
            .eq("id", id)
            .single();

          if (currentSession) {
            sendEvent({
              type: "session_status",
              sessionId: id,
              status: currentSession.status,
              progress: currentSession.progress,
              bugsFound: currentSession.bugs_found,
              timestamp: new Date().toISOString(),
            });

            // Close stream if session is completed or failed
            if (currentSession.status === "completed" || currentSession.status === "failed") {
              sendEvent({
                type: "session_ended",
                sessionId: id,
                status: currentSession.status,
                timestamp: new Date().toISOString(),
              });
              clearInterval(pollInterval);
              controller.close();
              isStreamClosed = true;
            }
          }
        } catch (err) {
          console.error("Poll error:", err);
        }
      }, 2000); // Poll every 2 seconds

      // Handle client disconnect
      request.signal.addEventListener("abort", () => {
        clearInterval(pollInterval);
        isStreamClosed = true;
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
