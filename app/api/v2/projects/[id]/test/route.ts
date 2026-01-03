// ============================================================================
// Start Test Session API
// ============================================================================
// POST /api/v2/projects/[id]/test - Start a new test session
// ============================================================================

import { NextRequest } from "next/server";
import { z } from "zod";
import {
  success,
  parseBody,
  parseParams,
  type RequestContext,
} from "@/lib/core/api-response";
import { createApiHandler } from "@/lib/core/middleware";
import { projectIdParamSchema, triggerTypeSchema } from "@/lib/core/validation";
import { getProjectService } from "@/lib/services/project.service";

// ============================================================================
// Request Schema
// ============================================================================

const startTestSchema = z.object({
  triggerType: triggerTypeSchema.optional().default("manual"),
  triggerMetadata: z.record(z.string(), z.unknown()).optional(),
  agentIds: z.array(z.string()).optional(),
});

// ============================================================================
// POST /api/v2/projects/[id]/test
// ============================================================================

async function handlePost(
  request: NextRequest,
  ctx: RequestContext,
  params?: Record<string, string>
) {
  // Validate ID parameter
  const paramsResult = parseParams(params || {}, projectIdParamSchema, ctx);
  if (paramsResult.error) return paramsResult.error;

  const { id: projectId } = paramsResult.data;

  // Parse optional body
  let body = {};
  try {
    body = await request.json();
  } catch {
    // Empty body is OK
  }

  const bodyResult = startTestSchema.safeParse(body);
  if (!bodyResult.success) {
    // Use defaults if validation fails
    body = {};
  }

  const { triggerType, triggerMetadata } = bodyResult.success
    ? bodyResult.data
    : { triggerType: "manual" as const, triggerMetadata: undefined };

  // Start test session via service
  const service = getProjectService();
  const result = await service.startTestSession(projectId, {
    triggerType,
    triggerMetadata,
  });

  if (result.isErr()) {
    throw result.error;
  }

  return success(
    {
      message: "Test session started",
      sessionId: result.value.sessionId,
      projectId,
    },
    { requestId: ctx.requestId }
  );
}

// ============================================================================
// Route Handler
// ============================================================================

export const POST = createApiHandler(handlePost, {
  rateLimit: true,
  featureFlag: "aiTesting",
});
