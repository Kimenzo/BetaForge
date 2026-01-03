// ============================================================================
// Single Project API - Refactored with Enterprise Architecture
// ============================================================================
// GET /api/v2/projects/[id] - Get a single project
// PUT /api/v2/projects/[id] - Update a project
// DELETE /api/v2/projects/[id] - Delete a project
// ============================================================================

import { NextRequest } from "next/server";
import {
  success,
  noContent,
  parseBody,
  parseParams,
  type RequestContext,
} from "@/lib/core/api-response";
import { createApiHandler } from "@/lib/core/middleware";
import {
  projectIdParamSchema,
  updateProjectSchema,
} from "@/lib/core/validation";
import { getProjectService } from "@/lib/services/project.service";
import { config } from "@/lib/core/config";

// ============================================================================
// GET /api/v2/projects/[id]
// ============================================================================

async function handleGet(
  request: NextRequest,
  ctx: RequestContext,
  params?: Record<string, string>
) {
  // Validate ID parameter
  const paramsResult = parseParams(params || {}, projectIdParamSchema, ctx);
  if (paramsResult.error) return paramsResult.error;

  const { id } = paramsResult.data;

  // Get project from service
  const service = getProjectService();
  const result = await service.getProject(id);

  if (result.isErr()) {
    throw result.error;
  }

  return success(
    { project: result.value },
    { requestId: ctx.requestId }
  );
}

// ============================================================================
// PUT /api/v2/projects/[id]
// ============================================================================

async function handlePut(
  request: NextRequest,
  ctx: RequestContext,
  params?: Record<string, string>
) {
  // Validate ID parameter
  const paramsResult = parseParams(params || {}, projectIdParamSchema, ctx);
  if (paramsResult.error) return paramsResult.error;

  const { id } = paramsResult.data;

  // Parse and validate request body
  const bodyResult = await parseBody(request, updateProjectSchema, ctx);
  if (bodyResult.error) return bodyResult.error;

  // Get user ID for authorization (placeholder in dev)
  const userId = config.isDev ? undefined : ctx.userId;

  // Update project via service
  const service = getProjectService();
  const result = await service.updateProject(id, bodyResult.data, userId);

  if (result.isErr()) {
    throw result.error;
  }

  return success(
    { project: result.value },
    { requestId: ctx.requestId }
  );
}

// ============================================================================
// DELETE /api/v2/projects/[id]
// ============================================================================

async function handleDelete(
  request: NextRequest,
  ctx: RequestContext,
  params?: Record<string, string>
) {
  // Validate ID parameter
  const paramsResult = parseParams(params || {}, projectIdParamSchema, ctx);
  if (paramsResult.error) return paramsResult.error;

  const { id } = paramsResult.data;

  // Get user ID for authorization (placeholder in dev)
  const userId = config.isDev ? undefined : ctx.userId;

  // Delete project via service
  const service = getProjectService();
  const result = await service.deleteProject(id, userId);

  if (result.isErr()) {
    throw result.error;
  }

  return noContent();
}

// ============================================================================
// Route Handlers - Compatible with Next.js 16+ async params
// ============================================================================

export const GET = createApiHandler(handleGet, { rateLimit: true });
export const PUT = createApiHandler(handlePut, { rateLimit: true });
export const DELETE = createApiHandler(handleDelete, { rateLimit: true });

// Enable caching for GET requests
export const revalidate = 60;
