// ============================================================================
// API Validation Schemas
// ============================================================================
// Zod-based validation for all API inputs
// Provides type-safe validation with detailed error messages
// ============================================================================

import { z } from "zod";

// ============================================================================
// Common Schemas
// ============================================================================

export const uuidSchema = z.string().uuid("Invalid UUID format");

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().optional(),
});

export const sortSchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const dateRangeSchema = z
  .object({
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  })
  .refine(
    (data) =>
      !data.startDate || !data.endDate || data.startDate <= data.endDate,
    { message: "Start date must be before end date" }
  );

// ============================================================================
// Platform & Status Enums
// ============================================================================

export const platformSchema = z.enum(["web", "mobile", "desktop"]);
export const projectStatusSchema = z.enum([
  "active",
  "testing",
  "idle",
  "error",
]);
export const testStatusSchema = z.enum([
  "queued",
  "running",
  "completed",
  "failed",
]);
export const bugSeveritySchema = z.enum(["critical", "high", "medium", "low"]);
export const bugStatusSchema = z.enum([
  "open",
  "fixed",
  "wont_fix",
  "duplicate",
]);
export const triggerTypeSchema = z.enum(["manual", "webhook", "scheduled"]);

// ============================================================================
// Project Schemas
// ============================================================================

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Project name must be less than 100 characters")
    .trim(),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional()
    .default(""),
  platform: z
    .array(platformSchema)
    .min(1, "At least one platform is required")
    .default(["web"]),
  accessUrl: z
    .string()
    .url("Invalid URL format")
    .refine(
      (url) => url.startsWith("http://") || url.startsWith("https://"),
      "URL must start with http:// or https://"
    ),
});

export const updateProjectSchema = createProjectSchema.partial().extend({
  status: projectStatusSchema.optional(),
});

export const projectIdParamSchema = z.object({
  id: uuidSchema,
});

export const listProjectsQuerySchema = paginationSchema
  .merge(sortSchema)
  .extend({
    status: projectStatusSchema.optional(),
    platform: platformSchema.optional(),
    search: z.string().max(100).optional(),
  });

// ============================================================================
// Test Session Schemas
// ============================================================================

export const createTestSessionSchema = z.object({
  projectId: uuidSchema,
  triggerType: triggerTypeSchema.default("manual"),
  triggerMetadata: z.record(z.string(), z.unknown()).optional(),
  agentIds: z.array(z.string()).optional(),
});

export const listSessionsQuerySchema = paginationSchema.extend({
  projectId: uuidSchema.optional(),
  status: testStatusSchema.optional(),
});

export const sessionIdParamSchema = z.object({
  id: uuidSchema,
});

// ============================================================================
// Bug Report Schemas
// ============================================================================

export const createBugReportSchema = z.object({
  executionId: uuidSchema,
  projectId: uuidSchema,
  severity: bugSeveritySchema,
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters")
    .trim(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(5000, "Description must be less than 5000 characters"),
  agentName: z.string().optional(),
  agentColor: z.string().optional(),
  reproductionSteps: z.array(z.string()).default([]),
  expectedBehavior: z.string().optional(),
  actualBehavior: z.string().optional(),
  screenshots: z.array(z.string().url()).default([]),
  consoleErrors: z
    .array(
      z.object({
        type: z.enum(["error", "warning", "log"]),
        message: z.string(),
        source: z.string().optional(),
        line: z.number().optional(),
      })
    )
    .default([]),
  networkLogs: z
    .array(
      z.object({
        url: z.string(),
        method: z.string(),
        status: z.number(),
        duration: z.number(),
        error: z.string().optional(),
      })
    )
    .default([]),
  environmentInfo: z.record(z.string(), z.unknown()).default({}),
});

export const updateBugReportSchema = z.object({
  severity: bugSeveritySchema.optional(),
  status: bugStatusSchema.optional(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(5000).optional(),
});

export const listBugReportsQuerySchema = paginationSchema.extend({
  projectId: uuidSchema.optional(),
  sessionId: uuidSchema.optional(),
  severity: bugSeveritySchema.optional(),
  status: bugStatusSchema.optional(),
});

export const bugReportIdParamSchema = z.object({
  id: uuidSchema,
});

// ============================================================================
// Webhook Schemas
// ============================================================================

export const webhookPayloadSchema = z
  .object({
    event: z.string(),
    projectId: uuidSchema,
    timestamp: z.coerce.date().optional(),
    data: z.record(z.string(), z.unknown()).optional(),
  })
  .catchall(z.unknown());

export const githubWebhookSchema = z
  .object({
    action: z.string().optional(),
    ref: z.string().optional(),
    repository: z
      .object({
        id: z.number(),
        name: z.string(),
        full_name: z.string(),
      })
      .optional(),
    sender: z
      .object({
        login: z.string(),
        id: z.number(),
      })
      .optional(),
    head_commit: z
      .object({
        id: z.string(),
        message: z.string(),
        author: z.object({
          name: z.string(),
          email: z.string(),
        }),
      })
      .optional(),
  })
  .passthrough();

// ============================================================================
// Type Exports
// ============================================================================

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ListProjectsQuery = z.infer<typeof listProjectsQuerySchema>;

export type CreateTestSessionInput = z.infer<typeof createTestSessionSchema>;
export type ListSessionsQuery = z.infer<typeof listSessionsQuerySchema>;

export type CreateBugReportInput = z.infer<typeof createBugReportSchema>;
export type UpdateBugReportInput = z.infer<typeof updateBugReportSchema>;
export type ListBugReportsQuery = z.infer<typeof listBugReportsQuerySchema>;

export type WebhookPayload = z.infer<typeof webhookPayloadSchema>;
export type GitHubWebhook = z.infer<typeof githubWebhookSchema>;
