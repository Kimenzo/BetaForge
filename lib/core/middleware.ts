// ============================================================================
// API Middleware System
// ============================================================================
// Composable middleware for request processing:
// - Rate limiting
// - Authentication/Authorization
// - Request logging
// - Error handling
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import {
  createRequestContext,
  handleError,
  withStandardHeaders,
  type RequestContext,
  error as errorResponse,
} from "./api-response";
import { AppError, ErrorCode, Errors } from "./errors";
import { logger } from "./logger";
import { config } from "./config";

// ============================================================================
// Types
// ============================================================================

/**
 * Handler function signature
 */
export type ApiHandler<T = unknown> = (
  request: NextRequest,
  context: RequestContext,
  params?: Record<string, string>
) => Promise<NextResponse<T>>;

/**
 * Middleware function signature
 */
export type Middleware = (handler: ApiHandler) => ApiHandler;

// ============================================================================
// Rate Limiter (In-Memory for development, use Redis in production)
// ============================================================================

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Get rate limit key from request
 */
function getRateLimitKey(request: NextRequest, ctx: RequestContext): string {
  // In production, use authenticated user ID if available
  // Fall back to IP address
  return ctx.ip || request.headers.get("x-forwarded-for") || "anonymous";
}

/**
 * Check rate limit
 */
function checkRateLimit(key: string): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = config.rateLimit.requestsPerMinute;

  let entry = rateLimitStore.get(key);

  // Clean up or create new entry
  if (!entry || entry.resetAt < now) {
    entry = { count: 0, resetAt: now + windowMs };
    rateLimitStore.set(key, entry);
  }

  entry.count++;

  // Periodically clean up old entries
  if (rateLimitStore.size > 10000) {
    for (const [k, v] of rateLimitStore) {
      if (v.resetAt < now) {
        rateLimitStore.delete(k);
      }
    }
  }

  return {
    allowed: entry.count <= maxRequests,
    remaining: Math.max(0, maxRequests - entry.count),
    resetAt: entry.resetAt,
  };
}

// ============================================================================
// Core Middleware
// ============================================================================

/**
 * Base request handler wrapper with error handling and logging
 */
export function withErrorHandling(handler: ApiHandler): ApiHandler {
  return async (request, ctx, params) => {
    try {
      const response = await handler(request, ctx, params);
      return withStandardHeaders(response, ctx);
    } catch (err) {
      return handleError(err, ctx);
    }
  };
}

/**
 * Add request logging
 */
export function withLogging(handler: ApiHandler): ApiHandler {
  return async (request, ctx, params) => {
    const log = logger.child({
      traceId: ctx.traceId,
      requestId: ctx.requestId,
    });

    log.debug(`→ ${ctx.method} ${ctx.path}`, {
      ip: ctx.ip,
      userAgent: ctx.userAgent,
    });

    const response = await handler(request, ctx, params);
    const duration = Math.round(performance.now() - ctx.startTime);

    log.info(`← ${ctx.method} ${ctx.path} ${response.status}`, {
      statusCode: response.status,
      duration,
    });

    return response;
  };
}

/**
 * Add rate limiting
 */
export function withRateLimit(handler: ApiHandler): ApiHandler {
  return async (request, ctx, params) => {
    const key = getRateLimitKey(request, ctx);
    const { allowed, remaining, resetAt } = checkRateLimit(key);

    if (!allowed) {
      const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);
      return errorResponse(
        Errors.rateLimited(retryAfter, { requestId: ctx.requestId }),
        ctx
      );
    }

    const response = await handler(request, ctx, params);

    // Add rate limit headers
    response.headers.set(
      "X-RateLimit-Limit",
      String(config.rateLimit.requestsPerMinute)
    );
    response.headers.set("X-RateLimit-Remaining", String(remaining));
    response.headers.set(
      "X-RateLimit-Reset",
      String(Math.ceil(resetAt / 1000))
    );

    return response;
  };
}

/**
 * Require authentication
 */
export function withAuth(handler: ApiHandler): ApiHandler {
  return async (request, ctx, params) => {
    // For now, just check for authorization header
    // In production, integrate with your auth provider (Clerk, NextAuth, Auth0, etc.)
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      // Allow requests without auth in development if auth is not configured
      if (config.isDev && !config.isAuthConfigured) {
        return handler(request, ctx, params);
      }

      return errorResponse(
        Errors.unauthenticated({ requestId: ctx.requestId }),
        ctx
      );
    }

    // TODO: Validate token with your auth provider
    // For now, just pass through if header exists

    return handler(request, ctx, params);
  };
}

/**
 * Check feature flag
 */
export function withFeatureFlag(
  flag: keyof typeof config.features
): Middleware {
  return (handler) => async (request, ctx, params) => {
    if (!config.features[flag]) {
      return errorResponse(
        new AppError(
          ErrorCode.SERVICE_UNAVAILABLE,
          "This feature is not available",
          { requestId: ctx.requestId }
        ),
        ctx
      );
    }
    return handler(request, ctx, params);
  };
}

/**
 * CORS middleware
 */
export function withCors(allowedOrigins: string[] = ["*"]): Middleware {
  return (handler) => async (request, ctx, params) => {
    // Handle preflight
    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": allowedOrigins.includes("*")
            ? "*"
            : allowedOrigins.join(", "),
          "Access-Control-Allow-Methods":
            "GET, POST, PUT, PATCH, DELETE, OPTIONS",
          "Access-Control-Allow-Headers":
            "Content-Type, Authorization, X-Request-ID, X-Trace-ID",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    const response = await handler(request, ctx, params);

    response.headers.set(
      "Access-Control-Allow-Origin",
      allowedOrigins.includes("*") ? "*" : allowedOrigins.join(", ")
    );

    return response;
  };
}

// ============================================================================
// Compose Middleware
// ============================================================================

/**
 * Compose multiple middlewares into a single handler
 */
export function compose(...middlewares: Middleware[]): Middleware {
  return (handler) => {
    return middlewares.reduceRight(
      (acc, middleware) => middleware(acc),
      handler
    );
  };
}

/**
 * Next.js 16+ uses Promise-based params for dynamic routes
 */
type NextRouteContext<T = Record<string, string>> = {
  params: Promise<T>;
};

/**
 * Create an API route handler with standard middleware
 * Compatible with Next.js 16+ async params
 */
export function createApiHandler(
  handler: ApiHandler,
  options: {
    requireAuth?: boolean;
    rateLimit?: boolean;
    featureFlag?: keyof typeof config.features;
  } = {}
): (request: NextRequest, context: NextRouteContext) => Promise<NextResponse> {
  const middlewares: Middleware[] = [withErrorHandling, withLogging];

  if (options.rateLimit !== false) {
    middlewares.push(withRateLimit);
  }

  if (options.requireAuth) {
    middlewares.push(withAuth);
  }

  if (options.featureFlag) {
    middlewares.push(withFeatureFlag(options.featureFlag));
  }

  const composed = compose(...middlewares)(handler);

  return async (request: NextRequest, context: NextRouteContext) => {
    const ctx = createRequestContext(request);

    // Handle Promise-based params (Next.js 16+)
    const resolvedParams = await context.params;

    return composed(request, ctx, resolvedParams);
  };
}

// ============================================================================
// Method Router
// ============================================================================

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";

interface RouteHandlers {
  GET?: ApiHandler;
  POST?: ApiHandler;
  PUT?: ApiHandler;
  PATCH?: ApiHandler;
  DELETE?: ApiHandler;
  OPTIONS?: ApiHandler;
}

/**
 * Create a route handler that routes to different handlers by method
 */
export function createRouteHandler(
  handlers: RouteHandlers,
  options: {
    requireAuth?: boolean;
    rateLimit?: boolean;
  } = {}
) {
  const methodNotAllowed: ApiHandler = async (_, ctx) => {
    return errorResponse(
      new AppError(ErrorCode.VALIDATION_FAILED, "Method not allowed", {
        requestId: ctx.requestId,
      }),
      ctx
    );
  };

  const routeHandler: ApiHandler = async (request, ctx, params) => {
    const method = request.method as HttpMethod;
    const handler = handlers[method] || methodNotAllowed;
    return handler(request, ctx, params);
  };

  return createApiHandler(routeHandler, options);
}
