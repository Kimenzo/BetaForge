// ============================================================================
// API Response Types & Utilities
// ============================================================================
// Standardized API response format for consistency across all endpoints
// ============================================================================

import { NextResponse } from "next/server";
import { ZodError, ZodSchema } from "zod";
import { AppError, ErrorCode, toAppError, type SerializedError } from "./errors";
import { logger, type LogContext } from "./logger";

// ============================================================================
// Response Types
// ============================================================================

/**
 * Standard API success response
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: ResponseMeta;
}

/**
 * Standard API error response
 */
export interface ApiErrorResponse {
  success: false;
  error: SerializedError;
}

/**
 * Response metadata for pagination, etc.
 */
export interface ResponseMeta {
  page?: number;
  limit?: number;
  total?: number;
  hasMore?: boolean;
  cursor?: string;
  requestId?: string;
  processingTime?: number;
}

/**
 * Combined response type
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ============================================================================
// Request Context
// ============================================================================

/**
 * Request context passed through middleware
 */
export interface RequestContext extends LogContext {
  requestId: string;
  startTime: number;
  ip?: string;
  userAgent?: string;
  method: string;
  path: string;
}

/**
 * Generate a unique request ID
 */
export function generateRequestId(): string {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Create request context from a request
 */
export function createRequestContext(request: Request): RequestContext {
  const url = new URL(request.url);
  return {
    requestId: generateRequestId(),
    traceId: request.headers.get("x-trace-id") || generateRequestId(),
    startTime: performance.now(),
    ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined,
    userAgent: request.headers.get("user-agent") || undefined,
    method: request.method,
    path: url.pathname,
  };
}

// ============================================================================
// Response Builders
// ============================================================================

/**
 * Create a success response
 */
export function success<T>(data: T, meta?: ResponseMeta, status = 200): NextResponse<ApiSuccessResponse<T>> {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
    meta,
  };

  return NextResponse.json(response, { status });
}

/**
 * Create a created (201) response
 */
export function created<T>(data: T, meta?: ResponseMeta): NextResponse<ApiSuccessResponse<T>> {
  return success(data, meta, 201);
}

/**
 * Create a no content (204) response
 */
export function noContent(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

/**
 * Create an error response
 */
export function error(appError: AppError, ctx?: RequestContext): NextResponse<ApiErrorResponse> {
  const serialized = appError.serialize(appError.isOperational);
  
  if (ctx) {
    serialized.requestId = ctx.requestId;
  }

  // Log the error
  const log = ctx ? logger.child({ traceId: ctx.traceId, requestId: ctx.requestId }) : logger;
  
  if (appError.statusCode >= 500) {
    log.error(`API Error: ${appError.message}`, appError, appError.context.metadata as Record<string, unknown>);
  } else {
    log.warn(`API Error: ${appError.message}`, { code: appError.code, statusCode: appError.statusCode });
  }

  const response: ApiErrorResponse = {
    success: false,
    error: serialized,
  };

  const headers: Record<string, string> = {};

  // Add rate limit headers if applicable
  if (appError.code === ErrorCode.RATE_LIMITED && "retryAfter" in appError) {
    headers["Retry-After"] = String((appError as { retryAfter: number }).retryAfter);
  }

  return NextResponse.json(response, { status: appError.statusCode, headers });
}

/**
 * Handle unknown errors and convert to proper response
 */
export function handleError(err: unknown, ctx?: RequestContext): NextResponse<ApiErrorResponse> {
  const appError = toAppError(err, { requestId: ctx?.requestId });
  return error(appError, ctx);
}

/**
 * Handle Zod validation errors
 */
export function handleValidationError(zodError: ZodError, ctx?: RequestContext): NextResponse<ApiErrorResponse> {
  const issues = zodError.issues.map((e) => ({
    field: e.path.join("."),
    message: e.message,
  }));

  const appError = new AppError(
    ErrorCode.VALIDATION_FAILED,
    "Validation failed",
    {
      requestId: ctx?.requestId,
      metadata: { issues },
    }
  );

  return error(appError, ctx);
}

// ============================================================================
// Request Parsing Utilities
// ============================================================================

/**
 * Parse and validate request body
 */
export async function parseBody<T>(
  request: Request,
  schema: ZodSchema<T>,
  ctx?: RequestContext
): Promise<{ data: T; error?: never } | { data?: never; error: NextResponse<ApiErrorResponse> }> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return { error: handleValidationError(result.error, ctx) };
    }

    return { data: result.data };
  } catch (e) {
    if (e instanceof SyntaxError) {
      const appError = new AppError(
        ErrorCode.INVALID_JSON,
        "Invalid JSON in request body",
        { requestId: ctx?.requestId }
      );
      return { error: error(appError, ctx) };
    }
    throw e;
  }
}

/**
 * Parse and validate query parameters
 */
export function parseQuery<T>(
  request: Request,
  schema: ZodSchema<T>,
  ctx?: RequestContext
): { data: T; error?: never } | { data?: never; error: NextResponse<ApiErrorResponse> } {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams.entries());
  const result = schema.safeParse(params);

  if (!result.success) {
    return { error: handleValidationError(result.error, ctx) };
  }

  return { data: result.data };
}

/**
 * Parse and validate route parameters
 */
export function parseParams<T>(
  params: Record<string, string>,
  schema: ZodSchema<T>,
  ctx?: RequestContext
): { data: T; error?: never } | { data?: never; error: NextResponse<ApiErrorResponse> } {
  const result = schema.safeParse(params);

  if (!result.success) {
    return { error: handleValidationError(result.error, ctx) };
  }

  return { data: result.data };
}

// ============================================================================
// Response Headers
// ============================================================================

/**
 * Add standard response headers
 */
export function withStandardHeaders(
  response: NextResponse,
  ctx?: RequestContext
): NextResponse {
  // Request ID for tracing
  if (ctx?.requestId) {
    response.headers.set("X-Request-ID", ctx.requestId);
  }

  // Processing time
  if (ctx?.startTime) {
    const duration = Math.round(performance.now() - ctx.startTime);
    response.headers.set("X-Processing-Time", `${duration}ms`);
  }

  // Security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  return response;
}

/**
 * Add cache headers
 */
export function withCacheHeaders(
  response: NextResponse,
  options: { maxAge?: number; staleWhileRevalidate?: number; private?: boolean } = {}
): NextResponse {
  const directives: string[] = [];

  if (options.private) {
    directives.push("private");
  } else {
    directives.push("public");
  }

  if (options.maxAge !== undefined) {
    directives.push(`max-age=${options.maxAge}`);
  }

  if (options.staleWhileRevalidate !== undefined) {
    directives.push(`stale-while-revalidate=${options.staleWhileRevalidate}`);
  }

  response.headers.set("Cache-Control", directives.join(", "));
  return response;
}
