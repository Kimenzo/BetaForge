import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { createOrchestrator } from "@/lib/orchestrator";
import { getEnabledAgents } from "@/lib/agents";
import type { AgentEvent } from "@/lib/types";
import type { Json } from "@/lib/database.types";

// Webhook receiver for CI/CD integrations
// Supports GitHub, GitLab, Bitbucket webhooks

export async function POST(request: NextRequest) {
  const supabase = createServerClient();

  try {
    const body = await request.json();
    const source = detectWebhookSource(request);

    // Verify webhook signature (production requirement)
    // const isValid = await verifyWebhookSignature(request, source);
    // if (!isValid) {
    //   return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    // }

    // Extract relevant information based on source
    const eventInfo = parseWebhookEvent(source, body);

    if (!eventInfo) {
      return NextResponse.json(
        { error: "Unsupported event type" },
        { status: 400 }
      );
    }

    console.log("[Webhook Received]", {
      source,
      event: eventInfo,
    });

    // Look up project by repository URL
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id, name, access_url, status")
      .or(`access_url.ilike.%${eventInfo.repository}%`)
      .single();

    if (projectError || !project) {
      console.log("No project found for repository:", eventInfo.repository);
      return NextResponse.json({
        success: true,
        message: "Webhook received, but no matching project found",
        event: eventInfo,
      });
    }

    // Create test session
    const { data: session, error: sessionError } = await supabase
      .from("test_sessions")
      .insert({
        project_id: project.id,
        status: "queued",
        trigger_type: "webhook",
        trigger_metadata: {
          source,
          ...eventInfo,
        },
        progress: 0,
        bugs_found: 0,
      })
      .select()
      .single();

    if (sessionError || !session) {
      console.error("Failed to create session:", sessionError);
      return NextResponse.json(
        { error: "Failed to create test session" },
        { status: 500 }
      );
    }

    // Get agents to deploy
    const agents = getEnabledAgents();

    // Create agent executions
    const agentExecutions = agents.map((agent) => ({
      session_id: session.id,
      agent_id: agent.id,
      agent_name: agent.name,
      status: "queued",
      progress: 0,
      environment_config: {
        viewport: agent.deviceConfig.viewport,
        targetUrl: project.access_url,
      },
    }));

    const { data: executions, error: execError } = await supabase
      .from("agent_executions")
      .insert(agentExecutions)
      .select();

    if (execError) {
      console.error("Failed to create agent executions:", execError);
    }

    // Log webhook trigger
    await supabase.from("activity_logs").insert({
      session_id: session.id,
      event_type: "webhook_received",
      message: `Test triggered by ${source} webhook`,
      data: eventInfo as unknown as Json,
    });

    // Update project status
    await supabase
      .from("projects")
      .update({ status: "testing" })
      .eq("id", project.id);

    // Start the test session
    const orchestrator = createOrchestrator({
      projectId: project.id,
      targetUrl: project.access_url || "",
      agents,
      onEvent: async (event: AgentEvent) => {
        // Log to database
        await supabase.from("activity_logs").insert({
          session_id: session.id,
          event_type: event.type,
          agent_name: event.agentName,
          message: event.message || `${event.agentName}: ${event.type}`,
          data: (event.data || {}) as Json,
        });

        // Update execution progress
        if (event.agentId && executions) {
          const execution = executions.find((e) => e.agent_id === event.agentId);
          if (execution) {
            const updateData: Record<string, unknown> = {};

            if (event.type === "agent_started") {
              updateData.status = "running";
              updateData.started_at = new Date().toISOString();
            } else if (event.type === "agent_completed") {
              updateData.status = "completed";
              updateData.progress = 100;
              updateData.completed_at = new Date().toISOString();
            } else if (event.type === "agent_failed") {
              updateData.status = "failed";
              updateData.completed_at = new Date().toISOString();
            }

            if (Object.keys(updateData).length > 0) {
              await supabase
                .from("agent_executions")
                .update(updateData)
                .eq("id", execution.id);
            }
          }
        }

        if (event.type === "session_completed") {
          await supabase
            .from("test_sessions")
            .update({
              status: "completed",
              progress: 100,
              completed_at: new Date().toISOString(),
            })
            .eq("id", session.id);

          await supabase
            .from("projects")
            .update({ status: "active" })
            .eq("id", project.id);
        }
      },
    });

    // Update session to running
    await supabase
      .from("test_sessions")
      .update({
        status: "running",
        started_at: new Date().toISOString(),
      })
      .eq("id", session.id);

    // Start orchestrator (runs in background)
    orchestrator.deployAgents().catch(async (error) => {
      console.error("Orchestrator error:", error);
      await supabase
        .from("test_sessions")
        .update({
          status: "failed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", session.id);
    });

    return NextResponse.json({
      success: true,
      message: "Webhook received, test session queued",
      sessionId: session.id,
      projectId: project.id,
      projectName: project.name,
      event: eventInfo,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}

function detectWebhookSource(request: NextRequest): "github" | "gitlab" | "bitbucket" | "unknown" {
  const headers = request.headers;
  
  if (headers.get("x-github-event")) {
    return "github";
  }
  if (headers.get("x-gitlab-event")) {
    return "gitlab";
  }
  if (headers.get("x-event-key")) {
    return "bitbucket";
  }
  return "unknown";
}

interface WebhookEventInfo {
  type: "push" | "pull_request" | "deployment";
  branch: string;
  commit: string;
  repository: string;
  author: string;
}

function parseWebhookEvent(
  source: string,
  body: Record<string, unknown>
): WebhookEventInfo | null {
  switch (source) {
    case "github":
      return parseGitHubEvent(body);
    case "gitlab":
      return parseGitLabEvent(body);
    case "bitbucket":
      return parseBitbucketEvent(body);
    default:
      return null;
  }
}

function parseGitHubEvent(body: Record<string, unknown>): WebhookEventInfo | null {
  // Handle push events
  if (body.ref && body.after) {
    const ref = body.ref as string;
    const repository = body.repository as Record<string, unknown>;
    const pusher = body.pusher as Record<string, unknown>;
    
    return {
      type: "push",
      branch: ref.replace("refs/heads/", ""),
      commit: body.after as string,
      repository: repository?.html_url as string || "",
      author: pusher?.name as string || "",
    };
  }

  // Handle pull request events
  if (body.pull_request) {
    const pr = body.pull_request as Record<string, unknown>;
    const head = pr.head as Record<string, unknown>;
    const repo = pr.base as Record<string, unknown>;
    const user = pr.user as Record<string, unknown>;
    
    return {
      type: "pull_request",
      branch: head?.ref as string || "",
      commit: head?.sha as string || "",
      repository: (repo?.repo as Record<string, unknown>)?.html_url as string || "",
      author: user?.login as string || "",
    };
  }

  return null;
}

function parseGitLabEvent(body: Record<string, unknown>): WebhookEventInfo | null {
  // Handle push events
  if (body.object_kind === "push") {
    return {
      type: "push",
      branch: (body.ref as string || "").replace("refs/heads/", ""),
      commit: body.after as string || "",
      repository: (body.project as Record<string, unknown>)?.web_url as string || "",
      author: body.user_name as string || "",
    };
  }

  // Handle merge request events
  if (body.object_kind === "merge_request") {
    const attrs = body.object_attributes as Record<string, unknown>;
    return {
      type: "pull_request",
      branch: attrs?.source_branch as string || "",
      commit: attrs?.last_commit as Record<string, unknown>
        ? (attrs.last_commit as Record<string, unknown>).id as string
        : "",
      repository: (body.project as Record<string, unknown>)?.web_url as string || "",
      author: (body.user as Record<string, unknown>)?.name as string || "",
    };
  }

  return null;
}

function parseBitbucketEvent(body: Record<string, unknown>): WebhookEventInfo | null {
  // Handle push events
  if (body.push) {
    const push = body.push as Record<string, unknown>;
    const changes = (push.changes as Array<Record<string, unknown>>)?.[0];
    const newChange = changes?.new as Record<string, unknown>;
    const actor = body.actor as Record<string, unknown>;
    const repository = body.repository as Record<string, unknown>;
    const links = repository?.links as Record<string, unknown>;
    const html = links?.html as Record<string, unknown>;

    return {
      type: "push",
      branch: newChange?.name as string || "",
      commit: (newChange?.target as Record<string, unknown>)?.hash as string || "",
      repository: html?.href as string || "",
      author: actor?.display_name as string || "",
    };
  }

  return null;
}
