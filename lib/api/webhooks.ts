// ============================================================================
// Outbound Webhook Service
// ============================================================================
// Sends webhook events to configured endpoints (Slack, Jira, custom URLs)
// Handles retries, signature generation, and delivery tracking
// ============================================================================

import crypto from "crypto";
import { createServerClient } from "@/lib/supabase";
import type { Json } from "@/lib/database.types";

// ============================================================================
// Types
// ============================================================================

export type WebhookEventType =
  | "session.started"
  | "session.completed"
  | "session.failed"
  | "bug.found"
  | "bug.critical"
  | "agent.started"
  | "agent.completed";

export interface WebhookPayload {
  event: WebhookEventType;
  timestamp: string;
  data: Record<string, unknown>;
}

export interface WebhookConfig {
  id: string;
  url: string;
  secret: string;
  events: WebhookEventType[];
  isActive: boolean;
  projectId?: string;
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  eventType: WebhookEventType;
  payload: WebhookPayload;
  status: "pending" | "success" | "failed";
  statusCode?: number;
  responseBody?: string;
  attempts: number;
  lastAttemptAt?: string;
  nextRetryAt?: string;
}

// ============================================================================
// Webhook Event Dispatcher
// ============================================================================

/**
 * Dispatch a webhook event to all configured endpoints
 */
export async function dispatchWebhookEvent(
  eventType: WebhookEventType,
  data: Record<string, unknown>,
  projectId?: string
): Promise<void> {
  const supabase = createServerClient();

  // Get all active webhooks that subscribe to this event
  let query = supabase
    .from("webhook_endpoints")
    .select("*")
    .eq("is_active", true)
    .contains("events", [eventType]);

  if (projectId) {
    query = query.or(`project_id.eq.${projectId},project_id.is.null`);
  }

  const { data: webhooks, error } = await query;

  if (error) {
    console.error("[Webhook] Failed to fetch webhook endpoints:", error);
    return;
  }

  if (!webhooks || webhooks.length === 0) {
    console.log(`[Webhook] No endpoints configured for event: ${eventType}`);
    return;
  }

  // Build payload
  const payload: WebhookPayload = {
    event: eventType,
    timestamp: new Date().toISOString(),
    data,
  };

  // Dispatch to all endpoints in parallel
  const deliveryPromises = webhooks.map((webhook) =>
    deliverWebhook(webhook as WebhookEndpointRecord, payload)
  );

  await Promise.allSettled(deliveryPromises);
}

// Webhook endpoint record type for internal use
interface WebhookEndpointRecord {
  id: string;
  url: string;
  secret: string;
  events: string[];
  is_active: boolean;
  project_id: string | null;
}

/**
 * Deliver a webhook to a single endpoint
 */
async function deliverWebhook(
  webhook: WebhookEndpointRecord,
  payload: WebhookPayload,
  attempt: number = 1
): Promise<boolean> {
  const supabase = createServerClient();
  const payloadString = JSON.stringify(payload);

  // Generate signature
  const signature = generateSignature(payloadString, webhook.secret as string);

  // Create delivery record
  const { data: delivery, error: deliveryError } = await supabase
    .from("webhook_deliveries")
    .insert({
      webhook_id: webhook.id,
      event_type: payload.event,
      payload: payload as unknown as Json,
      status: "pending",
      attempts: attempt,
    })
    .select()
    .single();

  if (deliveryError) {
    console.error("[Webhook] Failed to create delivery record:", deliveryError);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    const response = await fetch(webhook.url as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "BetaForge-Webhook/1.0",
        "X-BetaForge-Event": payload.event,
        "X-BetaForge-Signature": signature,
        "X-BetaForge-Timestamp": payload.timestamp,
        "X-BetaForge-Delivery": delivery?.id || "unknown",
      },
      body: payloadString,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const responseBody = await response.text().catch(() => "");

    // Update delivery record
    if (delivery) {
      await supabase
        .from("webhook_deliveries")
        .update({
          status: response.ok ? "success" : "failed",
          response_status: response.status,
          response_body: responseBody.slice(0, 1000), // Limit stored response
          delivered_at: new Date().toISOString(),
        })
        .eq("id", delivery.id);
    }

    if (!response.ok) {
      console.error(
        `[Webhook] Delivery failed: ${response.status} ${response.statusText}`
      );

      // Retry logic
      if (attempt < 3 && response.status >= 500) {
        const retryDelay = Math.pow(2, attempt) * 1000; // Exponential backoff
        setTimeout(() => {
          deliverWebhook(webhook, payload, attempt + 1);
        }, retryDelay);
      }

      return false;
    }

    console.log(`[Webhook] Delivered ${payload.event} to ${webhook.url}`);
    return true;
  } catch (error) {
    console.error(`[Webhook] Delivery error:`, error);

    // Update delivery record as failed
    if (delivery) {
      await supabase
        .from("webhook_deliveries")
        .update({
          status: "failed",
          response_body:
            error instanceof Error ? error.message : "Unknown error",
          next_retry_at:
            attempt < 3
              ? new Date(Date.now() + Math.pow(2, attempt) * 1000).toISOString()
              : null,
        })
        .eq("id", delivery.id);
    }

    // Retry on network errors
    if (attempt < 3) {
      const retryDelay = Math.pow(2, attempt) * 1000;
      setTimeout(() => {
        deliverWebhook(webhook, payload, attempt + 1);
      }, retryDelay);
    }

    return false;
  }
}

/**
 * Generate HMAC-SHA256 signature
 */
function generateSignature(payload: string, secret: string): string {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(payload);
  return `sha256=${hmac.digest("hex")}`;
}

// ============================================================================
// Slack-specific Webhook Formatting
// ============================================================================

export interface SlackMessage {
  text?: string;
  blocks?: SlackBlock[];
  attachments?: SlackAttachment[];
}

interface SlackBlock {
  type: string;
  text?: { type: string; text: string; emoji?: boolean };
  fields?: { type: string; text: string }[];
  elements?: Record<string, unknown>[];
  accessory?: Record<string, unknown>;
}

interface SlackAttachment {
  color?: string;
  blocks?: SlackBlock[];
}

/**
 * Format a bug report as a Slack message
 */
export function formatBugForSlack(bug: Record<string, unknown>): SlackMessage {
  const severityColors: Record<string, string> = {
    critical: "#dc2626",
    high: "#f97316",
    medium: "#eab308",
    low: "#22c55e",
    info: "#6b7280",
  };

  const severityEmoji: Record<string, string> = {
    critical: "🚨",
    high: "🔴",
    medium: "🟡",
    low: "🟢",
    info: "ℹ️",
  };

  const severity = (bug.severity as string) || "medium";

  return {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `${severityEmoji[severity]} Bug Found - ${severity.toUpperCase()}`,
          emoji: true,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Project:*\n${bug.projectName || "Unknown"}`,
          },
          {
            type: "mrkdwn",
            text: `*Agent:*\n${bug.agentName || "Unknown"}`,
          },
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${bug.title}*\n${(bug.description as string)?.slice(0, 300) || "No description"}...`,
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "View Report",
              emoji: true,
            },
            url: bug.dashboardUrl || `https://app.betaforge.ai/bugs/${bug.id}`,
            style: "primary",
          },
        ],
      },
    ],
    attachments: [
      {
        color: severityColors[severity] || "#6b7280",
        blocks: [],
      },
    ],
  };
}

/**
 * Format a session summary as a Slack message
 */
export function formatSessionForSlack(
  session: Record<string, unknown>
): SlackMessage {
  const status = session.status as string;
  const statusEmoji = status === "completed" ? "✅" : status === "failed" ? "❌" : "🔄";

  const summary = session.summary as Record<string, number> | undefined;

  return {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `${statusEmoji} Test Session ${status === "completed" ? "Complete" : "Failed"}`,
          emoji: true,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Project:*\n${session.projectName || "Unknown"}`,
          },
          {
            type: "mrkdwn",
            text: `*Duration:*\n${session.duration || "N/A"}`,
          },
        ],
      },
      ...(summary
        ? [
            {
              type: "section" as const,
              text: {
                type: "mrkdwn" as const,
                text: `📊 *Bug Summary:*\n• 🚨 Critical: ${summary.critical || 0}\n• 🔴 High: ${summary.high || 0}\n• 🟡 Medium: ${summary.medium || 0}\n• 🟢 Low: ${summary.low || 0}`,
              },
            },
          ]
        : []),
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "View Dashboard",
              emoji: true,
            },
            url:
              session.dashboardUrl ||
              `https://app.betaforge.ai/sessions/${session.id}`,
          },
        ],
      },
    ],
  };
}

// ============================================================================
// Jira-specific Webhook Formatting
// ============================================================================

export interface JiraIssue {
  fields: {
    project: { key: string };
    summary: string;
    description: JiraADF;
    issuetype: { name: string };
    priority: { name: string };
    labels: string[];
    [key: string]: unknown;
  };
}

interface JiraADF {
  type: "doc";
  version: 1;
  content: JiraADFNode[];
}

interface JiraADFNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: JiraADFNode[];
  text?: string;
  marks?: { type: string }[];
}

/**
 * Format a bug report as a Jira issue (ADF format)
 */
export function formatBugForJira(
  bug: Record<string, unknown>,
  projectKey: string
): JiraIssue {
  const severityMap: Record<string, string> = {
    critical: "Highest",
    high: "High",
    medium: "Medium",
    low: "Low",
    info: "Lowest",
  };

  const steps = (bug.stepsToReproduce as string[]) || [];
  const environment = bug.environment as Record<string, string> | undefined;

  return {
    fields: {
      project: { key: projectKey },
      summary: (bug.title as string) || "Untitled Bug",
      description: {
        type: "doc",
        version: 1,
        content: [
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "Bug Description" }],
          },
          {
            type: "paragraph",
            content: [
              { type: "text", text: (bug.description as string) || "No description provided" },
            ],
          },
          ...(steps.length > 0
            ? [
                {
                  type: "heading" as const,
                  attrs: { level: 2 },
                  content: [{ type: "text" as const, text: "Steps to Reproduce" }],
                },
                {
                  type: "orderedList" as const,
                  content: steps.map((step) => ({
                    type: "listItem" as const,
                    content: [
                      {
                        type: "paragraph" as const,
                        content: [{ type: "text" as const, text: step }],
                      },
                    ],
                  })),
                },
              ]
            : []),
          ...(environment
            ? [
                {
                  type: "heading" as const,
                  attrs: { level: 2 },
                  content: [{ type: "text" as const, text: "Environment" }],
                },
                {
                  type: "bulletList" as const,
                  content: Object.entries(environment).map(([key, value]) => ({
                    type: "listItem" as const,
                    content: [
                      {
                        type: "paragraph" as const,
                        content: [
                          { type: "text" as const, text: `${key}: `, marks: [{ type: "strong" }] },
                          { type: "text" as const, text: value },
                        ],
                      },
                    ],
                  })),
                },
              ]
            : []),
          {
            type: "paragraph",
            content: [
              { type: "text", text: "Found by BetaForge AI Agent: " },
              {
                type: "text",
                text: (bug.agentName as string) || "Unknown",
                marks: [{ type: "strong" }],
              },
            ],
          },
        ],
      },
      issuetype: { name: "Bug" },
      priority: { name: severityMap[(bug.severity as string) || "medium"] },
      labels: [
        "betaforge",
        `agent-${((bug.agentName as string) || "unknown").toLowerCase().replace(/\s+/g, "-")}`,
        (bug.severity as string) || "medium",
      ],
    },
  };
}
