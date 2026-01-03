// ============================================================================
// Application Error System
// ============================================================================
// Structured error handling with error codes, HTTP status mapping,
// and rich error context for debugging and user feedback.
//
// Key principles:
// - Every error has a unique code for tracking
// - Errors are categorized for proper handling
// - Sensitive details are hidden from clients
// - Full context is preserved for logging
// ============================================================================

/**
 * Error categories for routing and handling
 */
export enum ErrorCategory {
  /** User input validation errors */
  VALIDATION = "VALIDATION",
  /** Authentication errors */
  AUTHENTICATION = "AUTHENTICATION",
  /** Authorization/permission errors */
  AUTHORIZATION = "AUTHORIZATION",
  /** Resource not found */
  NOT_FOUND = "NOT_FOUND",
  /** Business logic/domain errors */
  BUSINESS = "BUSINESS",
  /** External service errors */
  EXTERNAL_SERVICE = "EXTERNAL_SERVICE",
  /** Infrastructure errors */
  INFRASTRUCTURE = "INFRASTRUCTURE",
  /** Rate limiting */
  RATE_LIMIT = "RATE_LIMIT",
  /** Unknown/unexpected errors */
  INTERNAL = "INTERNAL",
}

/**
 * Error codes for tracking and debugging
 * Format: CATEGORY_SPECIFIC_ERROR
 */
export enum ErrorCode {
  // Validation errors (400)
  VALIDATION_FAILED = "VALIDATION_FAILED",
  INVALID_INPUT = "INVALID_INPUT",
  MISSING_REQUIRED_FIELD = "MISSING_REQUIRED_FIELD",
  INVALID_FORMAT = "INVALID_FORMAT",
  INVALID_JSON = "INVALID_JSON",

  // Authentication errors (401)
  UNAUTHENTICATED = "UNAUTHENTICATED",
  INVALID_TOKEN = "INVALID_TOKEN",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",

  // Authorization errors (403)
  UNAUTHORIZED = "UNAUTHORIZED",
  INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS",
  RESOURCE_ACCESS_DENIED = "RESOURCE_ACCESS_DENIED",

  // Not found errors (404)
  RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",
  PROJECT_NOT_FOUND = "PROJECT_NOT_FOUND",
  SESSION_NOT_FOUND = "SESSION_NOT_FOUND",
  REPORT_NOT_FOUND = "REPORT_NOT_FOUND",
  USER_NOT_FOUND = "USER_NOT_FOUND",

  // Business logic errors (422)
  BUSINESS_RULE_VIOLATION = "BUSINESS_RULE_VIOLATION",
  INVALID_STATE_TRANSITION = "INVALID_STATE_TRANSITION",
  DUPLICATE_ENTRY = "DUPLICATE_ENTRY",
  LIMIT_EXCEEDED = "LIMIT_EXCEEDED",
  SESSION_ALREADY_RUNNING = "SESSION_ALREADY_RUNNING",

  // External service errors (502)
  EXTERNAL_SERVICE_ERROR = "EXTERNAL_SERVICE_ERROR",
  SUPABASE_ERROR = "SUPABASE_ERROR",
  ANTHROPIC_ERROR = "ANTHROPIC_ERROR",
  EMBEDDING_SERVICE_ERROR = "EMBEDDING_SERVICE_ERROR",

  // Rate limiting (429)
  RATE_LIMITED = "RATE_LIMITED",
  TOO_MANY_REQUESTS = "TOO_MANY_REQUESTS",

  // Infrastructure errors (500)
  INTERNAL_ERROR = "INTERNAL_ERROR",
  DATABASE_ERROR = "DATABASE_ERROR",
  CONFIGURATION_ERROR = "CONFIGURATION_ERROR",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
}

/**
 * Map error codes to HTTP status codes
 */
const ERROR_STATUS_MAP: Record<ErrorCode, number> = {
  // 400
  [ErrorCode.VALIDATION_FAILED]: 400,
  [ErrorCode.INVALID_INPUT]: 400,
  [ErrorCode.MISSING_REQUIRED_FIELD]: 400,
  [ErrorCode.INVALID_FORMAT]: 400,
  [ErrorCode.INVALID_JSON]: 400,

  // 401
  [ErrorCode.UNAUTHENTICATED]: 401,
  [ErrorCode.INVALID_TOKEN]: 401,
  [ErrorCode.TOKEN_EXPIRED]: 401,
  [ErrorCode.INVALID_CREDENTIALS]: 401,

  // 403
  [ErrorCode.UNAUTHORIZED]: 403,
  [ErrorCode.INSUFFICIENT_PERMISSIONS]: 403,
  [ErrorCode.RESOURCE_ACCESS_DENIED]: 403,

  // 404
  [ErrorCode.RESOURCE_NOT_FOUND]: 404,
  [ErrorCode.PROJECT_NOT_FOUND]: 404,
  [ErrorCode.SESSION_NOT_FOUND]: 404,
  [ErrorCode.REPORT_NOT_FOUND]: 404,
  [ErrorCode.USER_NOT_FOUND]: 404,

  // 422
  [ErrorCode.BUSINESS_RULE_VIOLATION]: 422,
  [ErrorCode.INVALID_STATE_TRANSITION]: 422,
  [ErrorCode.DUPLICATE_ENTRY]: 422,
  [ErrorCode.LIMIT_EXCEEDED]: 422,
  [ErrorCode.SESSION_ALREADY_RUNNING]: 422,

  // 429
  [ErrorCode.RATE_LIMITED]: 429,
  [ErrorCode.TOO_MANY_REQUESTS]: 429,

  // 500
  [ErrorCode.INTERNAL_ERROR]: 500,
  [ErrorCode.DATABASE_ERROR]: 500,
  [ErrorCode.CONFIGURATION_ERROR]: 500,
  [ErrorCode.SERVICE_UNAVAILABLE]: 503,

  // 502
  [ErrorCode.EXTERNAL_SERVICE_ERROR]: 502,
  [ErrorCode.SUPABASE_ERROR]: 502,
  [ErrorCode.ANTHROPIC_ERROR]: 502,
  [ErrorCode.EMBEDDING_SERVICE_ERROR]: 502,
};

/**
 * Error context for debugging
 */
export interface ErrorContext {
  /** Request ID for tracing */
  requestId?: string;
  /** User ID if authenticated */
  userId?: string;
  /** Related resource ID */
  resourceId?: string;
  /** Related resource type */
  resourceType?: string;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
  /** Original error if wrapping */
  cause?: Error;
  /** Stack trace */
  stack?: string;
}

/**
 * Serialized error for API responses
 */
export interface SerializedError {
  code: ErrorCode;
  message: string;
  requestId?: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

/**
 * Application error base class
 */
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly category: ErrorCategory;
  public readonly statusCode: number;
  public readonly context: ErrorContext;
  public readonly isOperational: boolean;
  public readonly timestamp: Date;

  constructor(
    code: ErrorCode,
    message: string,
    context: ErrorContext = {},
    isOperational = true
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.category = this.categorizeError(code);
    this.statusCode = ERROR_STATUS_MAP[code] || 500;
    this.context = context;
    this.isOperational = isOperational;
    this.timestamp = new Date();

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
    this.context.stack = this.stack;
  }

  private categorizeError(code: ErrorCode): ErrorCategory {
    if (code.startsWith("VALIDATION") || code.startsWith("INVALID") || code.startsWith("MISSING")) {
      return ErrorCategory.VALIDATION;
    }
    if (code.includes("UNAUTHENTICATED") || code.includes("TOKEN") || code.includes("CREDENTIALS")) {
      return ErrorCategory.AUTHENTICATION;
    }
    if (code.includes("UNAUTHORIZED") || code.includes("PERMISSION") || code.includes("ACCESS_DENIED")) {
      return ErrorCategory.AUTHORIZATION;
    }
    if (code.includes("NOT_FOUND")) {
      return ErrorCategory.NOT_FOUND;
    }
    if (code.includes("RATE") || code.includes("TOO_MANY")) {
      return ErrorCategory.RATE_LIMIT;
    }
    if (code.includes("EXTERNAL") || code.includes("SUPABASE") || code.includes("ANTHROPIC") || code.includes("EMBEDDING")) {
      return ErrorCategory.EXTERNAL_SERVICE;
    }
    if (code.includes("DATABASE") || code.includes("CONFIGURATION") || code.includes("SERVICE_UNAVAILABLE")) {
      return ErrorCategory.INFRASTRUCTURE;
    }
    if (code.includes("BUSINESS") || code.includes("STATE") || code.includes("DUPLICATE") || code.includes("LIMIT") || code.includes("SESSION_ALREADY")) {
      return ErrorCategory.BUSINESS;
    }
    return ErrorCategory.INTERNAL;
  }

  /**
   * Convert to client-safe serialized format
   */
  serialize(includeDetails = false): SerializedError {
    const serialized: SerializedError = {
      code: this.code,
      message: this.message,
      timestamp: this.timestamp.toISOString(),
    };

    if (this.context.requestId) {
      serialized.requestId = this.context.requestId;
    }

    // Only include details for non-sensitive errors
    if (includeDetails && this.isOperational) {
      serialized.details = {
        resourceId: this.context.resourceId,
        resourceType: this.context.resourceType,
        ...this.context.metadata,
      };
    }

    return serialized;
  }

  /**
   * Check if this is a retryable error
   */
  isRetryable(): boolean {
    return [
      ErrorCategory.EXTERNAL_SERVICE,
      ErrorCategory.INFRASTRUCTURE,
      ErrorCategory.RATE_LIMIT,
    ].includes(this.category);
  }

  /**
   * Create a formatted log entry
   */
  toLogEntry(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      category: this.category,
      message: this.message,
      statusCode: this.statusCode,
      isOperational: this.isOperational,
      timestamp: this.timestamp.toISOString(),
      context: this.context,
      stack: this.stack,
    };
  }
}

// ============================================================================
// Specific Error Classes
// ============================================================================

export class ValidationError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super(ErrorCode.VALIDATION_FAILED, message, context);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication required", context?: ErrorContext) {
    super(ErrorCode.UNAUTHENTICATED, message, context);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "Access denied", context?: ErrorContext) {
    super(ErrorCode.UNAUTHORIZED, message, context);
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends AppError {
  constructor(resourceType: string, resourceId?: string, context?: ErrorContext) {
    const message = resourceId
      ? `${resourceType} with ID '${resourceId}' not found`
      : `${resourceType} not found`;
    super(ErrorCode.RESOURCE_NOT_FOUND, message, {
      ...context,
      resourceType,
      resourceId,
    });
    this.name = "NotFoundError";
  }
}

export class BusinessError extends AppError {
  constructor(message: string, code: ErrorCode = ErrorCode.BUSINESS_RULE_VIOLATION, context?: ErrorContext) {
    super(code, message, context);
    this.name = "BusinessError";
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message: string, cause?: Error, context?: ErrorContext) {
    super(ErrorCode.EXTERNAL_SERVICE_ERROR, `${service}: ${message}`, {
      ...context,
      cause,
      metadata: { ...context?.metadata, service },
    });
    this.name = "ExternalServiceError";
  }
}

export class RateLimitError extends AppError {
  public readonly retryAfter: number;

  constructor(retryAfter = 60, context?: ErrorContext) {
    super(ErrorCode.RATE_LIMITED, `Rate limit exceeded. Retry after ${retryAfter} seconds`, context);
    this.name = "RateLimitError";
    this.retryAfter = retryAfter;
  }
}

// ============================================================================
// Error Factory
// ============================================================================

export const Errors = {
  validation: (message: string, context?: ErrorContext) => new ValidationError(message, context),
  invalidInput: (field: string, reason: string, context?: ErrorContext) =>
    new AppError(ErrorCode.INVALID_INPUT, `Invalid ${field}: ${reason}`, context),
  missingField: (field: string, context?: ErrorContext) =>
    new AppError(ErrorCode.MISSING_REQUIRED_FIELD, `Missing required field: ${field}`, context),

  unauthenticated: (context?: ErrorContext) => new AuthenticationError("Authentication required", context),
  invalidToken: (context?: ErrorContext) => new AppError(ErrorCode.INVALID_TOKEN, "Invalid or expired token", context),
  unauthorized: (context?: ErrorContext) => new AuthorizationError("Access denied", context),

  notFound: (resourceType: string, resourceId?: string, context?: ErrorContext) =>
    new NotFoundError(resourceType, resourceId, context),
  projectNotFound: (id: string, context?: ErrorContext) =>
    new AppError(ErrorCode.PROJECT_NOT_FOUND, `Project '${id}' not found`, { ...context, resourceId: id, resourceType: "project" }),
  sessionNotFound: (id: string, context?: ErrorContext) =>
    new AppError(ErrorCode.SESSION_NOT_FOUND, `Test session '${id}' not found`, { ...context, resourceId: id, resourceType: "session" }),
  reportNotFound: (id: string, context?: ErrorContext) =>
    new AppError(ErrorCode.REPORT_NOT_FOUND, `Bug report '${id}' not found`, { ...context, resourceId: id, resourceType: "report" }),

  businessRule: (message: string, context?: ErrorContext) => new BusinessError(message, ErrorCode.BUSINESS_RULE_VIOLATION, context),
  duplicate: (resourceType: string, context?: ErrorContext) =>
    new AppError(ErrorCode.DUPLICATE_ENTRY, `${resourceType} already exists`, { ...context, resourceType }),
  sessionAlreadyRunning: (projectId: string, context?: ErrorContext) =>
    new AppError(ErrorCode.SESSION_ALREADY_RUNNING, "A test session is already running for this project", {
      ...context,
      resourceId: projectId,
      resourceType: "project",
    }),

  supabase: (message: string, cause?: Error, context?: ErrorContext) =>
    new ExternalServiceError("Supabase", message, cause, context),
  anthropic: (message: string, cause?: Error, context?: ErrorContext) =>
    new ExternalServiceError("Anthropic", message, cause, context),
  embedding: (message: string, cause?: Error, context?: ErrorContext) =>
    new ExternalServiceError("EmbeddingService", message, cause, context),

  rateLimited: (retryAfter?: number, context?: ErrorContext) => new RateLimitError(retryAfter, context),

  internal: (message: string, cause?: Error, context?: ErrorContext) =>
    new AppError(ErrorCode.INTERNAL_ERROR, message, { ...context, cause }, false),
  configuration: (message: string, context?: ErrorContext) =>
    new AppError(ErrorCode.CONFIGURATION_ERROR, message, context, false),
};

/**
 * Convert unknown errors to AppError
 */
export function toAppError(error: unknown, context?: ErrorContext): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(
      ErrorCode.INTERNAL_ERROR,
      error.message,
      { ...context, cause: error },
      false
    );
  }

  return new AppError(
    ErrorCode.INTERNAL_ERROR,
    String(error),
    context,
    false
  );
}
