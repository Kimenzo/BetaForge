// ============================================================================
// Projects API - Refactored with Enterprise Architecture
// ============================================================================
// GET /api/projects - List all projects
// POST /api/projects - Create a new project
// ============================================================================

import { NextRequest } from "next/server";
import {
  success,
  created,
  parseBody,
  parseQuery,
  type RequestContext,
} from "@/lib/core/api-response";
import { createApiHandler } from "@/lib/core/middleware";
import {
  createProjectSchema,
  listProjectsQuerySchema,
} from "@/lib/core/validation";
import { getProjectService } from "@/lib/services/project.service";
import { config } from "@/lib/core/config";

// ============================================================================
// GET /api/projects
// ============================================================================

async function handleGet(request: NextRequest, ctx: RequestContext) {
  // Parse and validate query parameters
  const queryResult = parseQuery(request, listProjectsQuerySchema, ctx);
  if (queryResult.error) return queryResult.error;

  const { page, limit, status, platform, search, sortBy, sortOrder } = queryResult.data;

  // Get projects from service
  const service = getProjectService();
  const result = await service.listProjects({
    page,
    limit,
    status,
    platform,
    search,
    sortBy,
    sortOrder,
  });

  if (result.isErr()) {
    throw result.error;
  }

  const { items, total, hasMore } = result.value;

  return success(
    { projects: items },
    {
      page,
      limit,
      total,
      hasMore,
      requestId: ctx.requestId,
      processingTime: Math.round(performance.now() - ctx.startTime),
    }
  );
}

// ============================================================================
// POST /api/projects
// ============================================================================

async function handlePost(request: NextRequest, ctx: RequestContext) {
  // Parse and validate request body
  const bodyResult = await parseBody(request, createProjectSchema, ctx);
  if (bodyResult.error) return bodyResult.error;

  const { name, description, platform, accessUrl } = bodyResult.data;

  // In production, get user ID from authenticated session
  // For now, use a placeholder
  const userId = config.isDev
    ? "00000000-0000-0000-0000-000000000000"
    : ctx.userId || "00000000-0000-0000-0000-000000000000";

  // Create project via service
  const service = getProjectService();
  const result = await service.createProject({
    userId,
    name,
    description,
    platform,
    accessUrl,
  });

  if (result.isErr()) {
    throw result.error;
  }

  return created(
    { project: result.value },
    { requestId: ctx.requestId }
  );
}

// ============================================================================
// Route Handler
// ============================================================================

export const GET = createApiHandler(handleGet, { rateLimit: true });
export const POST = createApiHandler(handlePost, { rateLimit: true });
