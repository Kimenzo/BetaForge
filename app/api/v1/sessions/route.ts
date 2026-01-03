// ============================================================================
// BetaForge Public API v1 - Sessions Endpoint
// ============================================================================
// POST /api/v1/sessions - Create and start a test session
// GET /api/v1/sessions/:id - Get session status and results
// ============================================================================
// This endpoint can be called from any CI/CD system using curl/HTTP:
// - GitHub Actions (via curl)
// - GitLab CI (via curl)
// - Jenkins pipelines (via curl or httpRequest)
// - Bitbucket Pipelines (via curl)
// - Any HTTP-capable automation tool
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api/auth";
import { dispatchWebhookEvent } from "@/lib/api/webhooks";
import { createServerClient } from "@/lib/supabase";
import { createOrchestrator } from "@/lib/orchestrator";
import { getEnabledAgents, AGENTS } from "@/lib/agents";
import type { AgentEvent } from "@/lib/types";
import type { Json } from "@/lib/database.types";

// ============================================================================
// POST /api/v1/sessions - Create a new test session
// ============================================================================

export async function POST(request: NextRequest) {
  // Validate API key
  const auth = await validateApiKey(request);
  if (!auth.valid) {
    return NextResponse.json(
      {
        error: "unauthorized",
        message: auth.error,
        docs: "https://docs.betaforge.ai/api/authentication",
      },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    // Validate required fields
    const { projectId, testUrl, agents: requestedAgents } = body;

    if (!projectId) {
      return NextResponse.json(
        {
          error: "bad_request",
          message: "projectId is required",
          docs: "https://docs.betaforge.ai/api/sessions#create",
        },
        { status: 400 }
      );
    }

    if (!testUrl) {
      return NextResponse.json(
        {
          error: "bad_request",
          message: "testUrl is required",
          docs: "https://docs.betaforge.ai/api/sessions#create",
        },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(testUrl);
    } catch {
      return NextResponse.json(
        {
          error: "bad_request",
          message: "testUrl must be a valid URL",
        },
        { status: 400 }
      );
    }

    // Parse options
    const waitForResults = body.waitForResults === true;
    const timeout = Math.min(body.timeout || 600, 1800); // Max 30 minutes
    const failOnCritical = body.failOnCritical !== false; // Default true
    const failOnHigh = body.failOnHigh === true; // Default false

    // Determine which agents to use
    let agentsToUse = getEnabledAgents();
    if (requestedAgents && Array.isArray(requestedAgents)) {
      const agentNames = requestedAgents.map((a: string) => a.toLowerCase());
      agentsToUse = AGENTS.filter((agent) =>
        agentNames.some(
          (name: string) =>
            agent.name.toLowerCase().includes(name) ||
            agent.id.toLowerCase() === name
        )
      );

      if (agentsToUse.length === 0) {
        return NextResponse.json(
          {
            error: "bad_request",
            message: `No valid agents found. Available: ${AGENTS.map((a) => a.name).join(", ")}`,
          },
          { status: 400 }
        );
      }
    }

    const supabase = createServerClient();

    // Verify project exists and user has access
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id, name, access_url, user_id, status")
      .eq("id", projectId)
      .single();

    // In demo mode or if Supabase isn't configured, use demo project
    const isDemoMode =
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project");

    let projectName = "Demo Project";
    let actualProjectId = projectId;

    if (!isDemoMode && project) {
      projectName = project.name;
      actualProjectId = project.id;
    } else if (!isDemoMode && projectError) {
      return NextResponse.json(
        {
          error: "not_found",
          message: "Project not found or access denied",
        },
        { status: 404 }
      );
    }

    // Create session ID
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Create session in database (if Supabase is configured)
    let dbSession: { id: string } | null = null;
    if (!isDemoMode) {
      const { data: session, error: sessionError } = await supabase
        .from("test_sessions")
        .insert({
          project_id: actualProjectId,
          status: "queued",
          trigger_type: "api",
          trigger_metadata: {
            source: "v1_api",
            apiKeyId: auth.keyId,
            agents: agentsToUse.map((a) => a.name),
            testUrl,
          },
          progress: 0,
          bugs_found: 0,
        })
        .select()
        .single();

      if (sessionError) {
        console.error("Failed to create session:", sessionError);
        return NextResponse.json(
          {
            error: "internal_error",
            message: "Failed to create test session",
          },
          { status: 500 }
        );
      }

      dbSession = session;
    }

    const actualSessionId = dbSession?.id || sessionId;

    // Dispatch session.started webhook
    await dispatchWebhookEvent(
      "session.started",
      {
        sessionId: actualSessionId,
        projectId: actualProjectId,
        projectName,
        testUrl,
        agents: agentsToUse.map((a) => ({ id: a.id, name: a.name })),
      },
      actualProjectId
    );

    // If not waiting for results, return immediately
    if (!waitForResults) {
      return NextResponse.json(
        {
          success: true,
          sessionId: actualSessionId,
          status: "queued",
          message: "Test session queued. Use GET /api/v1/sessions/:id to check status.",
          dashboardUrl: `https://app.betaforge.ai/sessions/${actualSessionId}`,
          agents: agentsToUse.map((a) => a.name),
        },
        { status: 202 }
      );
    }

    // Start the test and wait for results
    const results = await runTestSession({
      sessionId: actualSessionId,
      projectId: actualProjectId,
      projectName,
      testUrl,
      agents: agentsToUse,
      timeout,
      supabase: isDemoMode ? null : supabase,
    });

    // Dispatch completion webhook
    await dispatchWebhookEvent(
      results.status === "completed" ? "session.completed" : "session.failed",
      {
        sessionId: actualSessionId,
        projectId: actualProjectId,
        projectName,
        status: results.status,
        summary: results.summary,
        duration: results.duration,
        dashboardUrl: `https://app.betaforge.ai/sessions/${actualSessionId}`,
      },
      actualProjectId
    );

    // Determine if we should fail the CI
    const shouldFail =
      (failOnCritical && (results.summary?.critical || 0) > 0) ||
      (failOnHigh && (results.summary?.high || 0) > 0);

    return NextResponse.json(
      {
        success: !shouldFail,
        sessionId: actualSessionId,
        status: results.status,
        duration: results.duration,
        summary: results.summary,
        bugs: results.bugs,
        dashboardUrl: `https://app.betaforge.ai/sessions/${actualSessionId}`,
        ...(shouldFail && {
          failReason:
            (results.summary?.critical || 0) > 0
              ? `Found ${results.summary?.critical} critical bugs`
              : `Found ${results.summary?.high} high severity bugs`,
        }),
      },
      { status: shouldFail ? 422 : 200 }
    );
  } catch (error) {
    console.error("API v1 sessions error:", error);
    return NextResponse.json(
      {
        error: "internal_error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET /api/v1/sessions - List sessions (with optional projectId filter)
// ============================================================================

export async function GET(request: NextRequest) {
  // Validate API key
  const auth = await validateApiKey(request);
  if (!auth.valid) {
    return NextResponse.json(
      {
        error: "unauthorized",
        message: auth.error,
      },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);

  const supabase = createServerClient();

  let query = supabase
    .from("test_sessions")
    .select(
      `
      id,
      project_id,
      status,
      trigger_type,
      progress,
      bugs_found,
      started_at,
      completed_at,
      created_at,
      projects (
        name
      )
    `
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (projectId) {
    query = query.eq("project_id", projectId);
  }

  const { data: sessions, error } = await query;

  if (error) {
    return NextResponse.json(
      {
        error: "internal_error",
        message: "Failed to fetch sessions",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    sessions: sessions?.map((s) => ({
      id: s.id,
      projectId: s.project_id,
      projectName: (s.projects as Record<string, unknown> | null)?.name || null,
      status: s.status,
      triggerType: s.trigger_type,
      progress: s.progress,
      bugsFound: s.bugs_found,
      startedAt: s.started_at,
      completedAt: s.completed_at,
      createdAt: s.created_at,
    })),
  });
}

// ============================================================================
// Helper: Run test session and collect results
// ============================================================================

interface RunTestSessionParams {
  sessionId: string;
  projectId: string;
  projectName: string;
  testUrl: string;
  agents: typeof AGENTS;
  timeout: number;
  supabase: ReturnType<typeof createServerClient> | null;
}

interface TestResults {
  status: "completed" | "failed" | "timeout";
  duration: number;
  summary: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  bugs: Array<{
    id: string;
    title: string;
    severity: string;
    agent: string;
  }>;
}

async function runTestSession(params: RunTestSessionParams): Promise<TestResults> {
  const { sessionId, projectId, projectName, testUrl, agents, timeout, supabase } = params;
  const startTime = Date.now();
  const bugs: TestResults["bugs"] = [];

  return new Promise((resolve) => {
    // Timeout handler
    const timeoutId = setTimeout(() => {
      resolve({
        status: "timeout",
        duration: Math.round((Date.now() - startTime) / 1000),
        summary: aggregateBugs(bugs),
        bugs,
      });
    }, timeout * 1000);

    // Create orchestrator
    const orchestrator = createOrchestrator({
      projectId,
      targetUrl: testUrl,
      agents,
      onEvent: async (event: AgentEvent) => {
        // Log events
        if (supabase) {
          await supabase.from("activity_logs").insert({
            session_id: sessionId,
            event_type: event.type,
            agent_name: event.agentName,
            message: event.message || `${event.agentName}: ${event.type}`,
            data: (event.data || {}) as Json,
          });
        }

        // Handle bug found
        if (event.type === "agent_bug_found" && event.data) {
          const bug = {
            id: `bug_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            title: (event.data as Record<string, unknown>).title as string || "Untitled Bug",
            severity: (event.data as Record<string, unknown>).severity as string || "medium",
            agent: event.agentName || "Unknown",
          };
          bugs.push(bug);

          // Dispatch bug webhook
          const severity = bug.severity.toLowerCase();
          await dispatchWebhookEvent(
            severity === "critical" ? "bug.critical" : "bug.found",
            {
              bugId: bug.id,
              title: bug.title,
              severity: bug.severity,
              agentName: bug.agent,
              sessionId,
              projectId,
              projectName,
              dashboardUrl: `https://app.betaforge.ai/bugs/${bug.id}`,
            },
            projectId
          );
        }

        // Handle session completion
        if (event.type === "session_completed") {
          clearTimeout(timeoutId);

          if (supabase) {
            await supabase
              .from("test_sessions")
              .update({
                status: "completed",
                progress: 100,
                bugs_found: bugs.length,
                completed_at: new Date().toISOString(),
              })
              .eq("id", sessionId);
          }

          resolve({
            status: "completed",
            duration: Math.round((Date.now() - startTime) / 1000),
            summary: aggregateBugs(bugs),
            bugs,
          });
        }

        // Handle session failure
        if (event.type === "session_failed") {
          clearTimeout(timeoutId);

          if (supabase) {
            await supabase
              .from("test_sessions")
              .update({
                status: "failed",
                bugs_found: bugs.length,
                completed_at: new Date().toISOString(),
              })
              .eq("id", sessionId);
          }

          resolve({
            status: "failed",
            duration: Math.round((Date.now() - startTime) / 1000),
            summary: aggregateBugs(bugs),
            bugs,
          });
        }
      },
    });

    // Update session to running
    if (supabase) {
      supabase
        .from("test_sessions")
        .update({
          status: "running",
          started_at: new Date().toISOString(),
        })
        .eq("id", sessionId)
        .then(() => {});
    }

    // Start orchestrator
    orchestrator.deployAgents().catch((error) => {
      console.error("Orchestrator error:", error);
      clearTimeout(timeoutId);
      resolve({
        status: "failed",
        duration: Math.round((Date.now() - startTime) / 1000),
        summary: aggregateBugs(bugs),
        bugs,
      });
    });
  });
}

function aggregateBugs(bugs: TestResults["bugs"]): TestResults["summary"] {
  return {
    total: bugs.length,
    critical: bugs.filter((b) => b.severity === "critical").length,
    high: bugs.filter((b) => b.severity === "high").length,
    medium: bugs.filter((b) => b.severity === "medium").length,
    low: bugs.filter((b) => b.severity === "low").length,
  };
}
