// ============================================================================
// Structured Logging System
// ============================================================================
// Production-grade logging with:
// - Structured JSON output for log aggregation (DataDog, Splunk, etc.)
// - Log levels and filtering
// - Request correlation via trace IDs
// - Sensitive data redaction
// - Performance tracking
//
// In production, integrate with:
// - Vercel Logs, DataDog, New Relic, Splunk, or CloudWatch
// ============================================================================

/**
 * Log levels in order of severity
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

/**
 * Structured log entry
 */
export interface LogEntry {
  level: keyof typeof LogLevel;
  message: string;
  timestamp: string;
  traceId?: string;
  spanId?: string;
  userId?: string;
  service: string;
  environment: string;
  data?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    code?: string;
    stack?: string;
  };
  duration?: number;
  httpRequest?: {
    method: string;
    url: string;
    statusCode?: number;
    userAgent?: string;
    ip?: string;
  };
}

/**
 * Fields to redact from logs
 */
const SENSITIVE_FIELDS = new Set([
  "password",
  "token",
  "secret",
  "apiKey",
  "api_key",
  "authorization",
  "cookie",
  "creditCard",
  "credit_card",
  "ssn",
  "accessToken",
  "access_token",
  "refreshToken",
  "refresh_token",
  "privateKey",
  "private_key",
]);

/**
 * Redact sensitive data from objects
 */
function redactSensitive(obj: unknown, depth = 0): unknown {
  if (depth > 10) return "[MAX_DEPTH]";

  if (obj === null || obj === undefined) return obj;

  if (typeof obj === "string") {
    // Redact JWT-like tokens
    if (obj.match(/^eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$/)) {
      return "[REDACTED_JWT]";
    }
    // Redact API keys
    if (obj.match(/^(sk-|pk-|api_|key_)/i)) {
      return "[REDACTED_KEY]";
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => redactSensitive(item, depth + 1));
  }

  if (typeof obj === "object") {
    const redacted: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      const lowerKey = key.toLowerCase();
      if (SENSITIVE_FIELDS.has(lowerKey)) {
        redacted[key] = "[REDACTED]";
      } else {
        redacted[key] = redactSensitive(value, depth + 1);
      }
    }
    return redacted;
  }

  return obj;
}

/**
 * Get current log level from environment
 */
function getCurrentLogLevel(): LogLevel {
  const envLevel = process.env.LOG_LEVEL?.toUpperCase();
  if (envLevel && envLevel in LogLevel) {
    return LogLevel[envLevel as keyof typeof LogLevel];
  }
  return process.env.NODE_ENV === "production" ? LogLevel.INFO : LogLevel.DEBUG;
}

/**
 * Logger context for request tracing
 */
export interface LogContext {
  traceId?: string;
  spanId?: string;
  userId?: string;
  requestId?: string;
}

/**
 * Create a child logger with bound context
 */
export class Logger {
  private context: LogContext;
  private service: string;
  private environment: string;

  constructor(service = "betaforge", context: LogContext = {}) {
    this.service = service;
    this.context = context;
    this.environment = process.env.NODE_ENV || "development";
  }

  /**
   * Create a child logger with additional context
   */
  child(context: Partial<LogContext>): Logger {
    const childLogger = new Logger(this.service, {
      ...this.context,
      ...context,
    });
    return childLogger;
  }

  /**
   * Internal log method
   */
  private log(
    level: keyof typeof LogLevel,
    message: string,
    data?: Record<string, unknown>,
    error?: Error
  ): void {
    const levelValue = LogLevel[level];
    if (levelValue < getCurrentLogLevel()) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      service: this.service,
      environment: this.environment,
      traceId: this.context.traceId,
      spanId: this.context.spanId,
      userId: this.context.userId,
    };

    if (data) {
      entry.data = redactSensitive(data) as Record<string, unknown>;
    }

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        code: (error as { code?: string }).code,
        stack: process.env.NODE_ENV !== "production" ? error.stack : undefined,
      };
    }

    // Output as JSON in production, pretty print in development
    const output =
      process.env.NODE_ENV === "production"
        ? JSON.stringify(entry)
        : this.formatPretty(entry);

    switch (level) {
      case "ERROR":
      case "FATAL":
        console.error(output);
        break;
      case "WARN":
        console.warn(output);
        break;
      default:
        console.log(output);
    }
  }

  /**
   * Pretty format for development
   */
  private formatPretty(entry: LogEntry): string {
    const levelColors: Record<string, string> = {
      DEBUG: "\x1b[36m", // Cyan
      INFO: "\x1b[32m", // Green
      WARN: "\x1b[33m", // Yellow
      ERROR: "\x1b[31m", // Red
      FATAL: "\x1b[35m", // Magenta
    };
    const reset = "\x1b[0m";
    const dim = "\x1b[2m";

    let output = `${levelColors[entry.level]}[${entry.level}]${reset} ${
      entry.message
    }`;

    if (entry.traceId) {
      output += ` ${dim}(trace: ${entry.traceId.slice(0, 8)})${reset}`;
    }

    if (entry.data && Object.keys(entry.data).length > 0) {
      output += `\n  ${dim}${JSON.stringify(entry.data, null, 2).replace(
        /\n/g,
        "\n  "
      )}${reset}`;
    }

    if (entry.error) {
      output += `\n  ${levelColors.ERROR}Error: ${entry.error.message}${reset}`;
      if (entry.error.stack) {
        output += `\n  ${dim}${entry.error.stack}${reset}`;
      }
    }

    return output;
  }

  // Public logging methods
  debug(message: string, data?: Record<string, unknown>): void {
    this.log("DEBUG", message, data);
  }

  info(message: string, data?: Record<string, unknown>): void {
    this.log("INFO", message, data);
  }

  warn(message: string, data?: Record<string, unknown>, error?: Error): void {
    this.log("WARN", message, data, error);
  }

  error(message: string, error?: Error, data?: Record<string, unknown>): void {
    this.log("ERROR", message, data, error);
  }

  fatal(message: string, error?: Error, data?: Record<string, unknown>): void {
    this.log("FATAL", message, data, error);
  }

  /**
   * Log HTTP request details
   */
  httpRequest(
    req: { method: string; url: string; headers?: Record<string, string> },
    statusCode: number,
    duration: number
  ): void {
    this.log("INFO", `${req.method} ${req.url} ${statusCode}`, {
      httpRequest: {
        method: req.method,
        url: req.url,
        statusCode,
        userAgent: req.headers?.["user-agent"],
      },
      duration,
    });
  }

  /**
   * Create a timer for performance tracking
   */
  startTimer(operation: string): () => void {
    const start = performance.now();
    return () => {
      const duration = Math.round(performance.now() - start);
      this.debug(`${operation} completed`, { duration, operation });
    };
  }
}

// Default logger instance
export const logger = new Logger();

// Request-scoped logger factory
export function createRequestLogger(traceId: string, userId?: string): Logger {
  return new Logger("betaforge", { traceId, userId });
}
