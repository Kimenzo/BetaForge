// ============================================================================
// Bug Report Repository
// ============================================================================
// Data access layer for BugReport entities
// ============================================================================

import { SupabaseClient } from "@supabase/supabase-js";
import {
  BaseRepository,
  QueryOptions,
  PaginatedResult,
} from "../core/repository";
import { Result, ok, err } from "../core/result";
import { AppError, Errors } from "../core/errors";
import type { Database } from "../database.types";

// ============================================================================
// Types
// ============================================================================

export interface BugReport {
  id: string;
  projectId: string;
  executionId: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "open" | "fixed" | "wont_fix" | "duplicate";
  title: string;
  description: string;
  agentName: string | null;
  agentColor: string | null;
  reproductionSteps: string[];
  expectedBehavior: string | null;
  actualBehavior: string | null;
  screenshots: string[];
  consoleErrors: ConsoleError[];
  networkLogs: NetworkLog[];
  environmentInfo: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConsoleError {
  type: "error" | "warning" | "log";
  message: string;
  source?: string;
  line?: number;
}

export interface NetworkLog {
  url: string;
  method: string;
  status: number;
  duration: number;
  error?: string;
}

export interface BugReportWithContext extends BugReport {
  projectName?: string;
  sessionId?: string;
}

export interface CreateBugReportData {
  projectId: string;
  executionId: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  agentName?: string;
  agentColor?: string;
  reproductionSteps?: string[];
  expectedBehavior?: string;
  actualBehavior?: string;
  screenshots?: string[];
  consoleErrors?: ConsoleError[];
  networkLogs?: NetworkLog[];
  environmentInfo?: Record<string, unknown>;
}

export interface UpdateBugReportData {
  severity?: "critical" | "high" | "medium" | "low";
  status?: "open" | "fixed" | "wont_fix" | "duplicate";
  title?: string;
  description?: string;
}

export interface BugReportQueryOptions extends QueryOptions {
  projectId?: string;
  sessionId?: string;
  severity?: string;
  status?: string;
}

// ============================================================================
// Repository Implementation
// ============================================================================

export class BugReportRepository extends BaseRepository<
  BugReport,
  CreateBugReportData,
  UpdateBugReportData
> {
  constructor(db: SupabaseClient<Database>) {
    super(db, "bug_reports");
  }

  protected get resourceType(): string {
    return "BugReport";
  }

  protected toEntity(row: Record<string, unknown>): BugReport {
    return {
      id: row.id as string,
      projectId: row.project_id as string,
      executionId: row.execution_id as string,
      severity: row.severity as BugReport["severity"],
      status: (row.status as BugReport["status"]) || "open",
      title: row.title as string,
      description: (row.description as string) || "",
      agentName: row.agent_name as string | null,
      agentColor: row.agent_color as string | null,
      reproductionSteps: (row.reproduction_steps as string[]) || [],
      expectedBehavior: row.expected_behavior as string | null,
      actualBehavior: row.actual_behavior as string | null,
      screenshots: (row.screenshots as string[]) || [],
      consoleErrors: (row.console_errors as ConsoleError[]) || [],
      networkLogs: (row.network_logs as NetworkLog[]) || [],
      environmentInfo: (row.environment_info as Record<string, unknown>) || {},
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    };
  }

  protected toInsertRow(data: CreateBugReportData): Record<string, unknown> {
    return {
      project_id: data.projectId,
      execution_id: data.executionId,
      severity: data.severity,
      title: data.title,
      description: data.description,
      agent_name: data.agentName,
      agent_color: data.agentColor,
      reproduction_steps: data.reproductionSteps || [],
      expected_behavior: data.expectedBehavior,
      actual_behavior: data.actualBehavior,
      screenshots: data.screenshots || [],
      console_errors: data.consoleErrors || [],
      network_logs: data.networkLogs || [],
      environment_info: data.environmentInfo || {},
      status: "open",
    };
  }

  protected toUpdateRow(data: UpdateBugReportData): Record<string, unknown> {
    const row: Record<string, unknown> = {};
    if (data.severity !== undefined) row.severity = data.severity;
    if (data.status !== undefined) row.status = data.status;
    if (data.title !== undefined) row.title = data.title;
    if (data.description !== undefined) row.description = data.description;
    return row;
  }

  /**
   * Find reports with project and session context
   */
  async findWithContext(
    options: BugReportQueryOptions = {}
  ): Promise<Result<PaginatedResult<BugReportWithContext>, AppError>> {
    const timer = this.log.startTimer("reports.findWithContext");
    const {
      page = 1,
      limit = 20,
      sortBy = "created_at",
      sortOrder = "desc",
    } = options;
    const offset = (page - 1) * limit;

    try {
      let query = this.db.from("bug_reports").select(
        `
          *,
          agent_executions (
            id,
            session_id,
            test_sessions (
              id,
              project_id,
              projects (
                id,
                name
              )
            )
          )
        `,
        { count: "exact" }
      );

      // Apply filters
      if (options.projectId) {
        query = query.eq("project_id", options.projectId);
      }
      if (options.severity) {
        query = query.eq("severity", options.severity);
      }
      if (options.status) {
        query = query.eq("status", options.status);
      }

      // Apply sorting and pagination
      query = query
        .order(sortBy, { ascending: sortOrder === "asc" })
        .range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      timer();

      if (error) {
        return err(Errors.supabase(error.message));
      }

      const items = (data || []).map((row) => this.toReportWithContext(row));
      const total = count || 0;

      return ok({
        items,
        total,
        page,
        limit,
        hasMore: offset + items.length < total,
      });
    } catch (e) {
      timer();
      return err(Errors.supabase(String(e)));
    }
  }

  /**
   * Get report by ID with full context
   */
  async findByIdWithContext(
    id: string
  ): Promise<Result<BugReportWithContext, AppError>> {
    const timer = this.log.startTimer("reports.findByIdWithContext");

    try {
      const { data, error } = await this.db
        .from("bug_reports")
        .select(
          `
          *,
          agent_executions (
            id,
            session_id,
            test_sessions (
              id,
              projects (
                id,
                name
              )
            )
          )
        `
        )
        .eq("id", id)
        .single();

      timer();

      if (error) {
        if (error.code === "PGRST116") {
          return err(Errors.reportNotFound(id));
        }
        return err(Errors.supabase(error.message));
      }

      return ok(this.toReportWithContext(data));
    } catch (e) {
      timer();
      return err(Errors.supabase(String(e)));
    }
  }

  /**
   * Get report statistics for a project
   */
  async getProjectStats(projectId: string): Promise<
    Result<
      {
        total: number;
        bySeverity: Record<string, number>;
        byStatus: Record<string, number>;
      },
      AppError
    >
  > {
    try {
      const { data, error } = await this.db
        .from("bug_reports")
        .select("severity, status")
        .eq("project_id", projectId);

      if (error) {
        return err(Errors.supabase(error.message));
      }

      const reports = data || [];
      const bySeverity: Record<string, number> = {};
      const byStatus: Record<string, number> = {};

      for (const report of reports) {
        bySeverity[report.severity] = (bySeverity[report.severity] || 0) + 1;
        byStatus[report.status] = (byStatus[report.status] || 0) + 1;
      }

      return ok({
        total: reports.length,
        bySeverity,
        byStatus,
      });
    } catch (e) {
      return err(Errors.supabase(String(e)));
    }
  }

  private toReportWithContext(
    row: Record<string, unknown>
  ): BugReportWithContext {
    const report = this.toEntity(row);
    const execution = row.agent_executions as Record<string, unknown> | null;
    const session = execution?.test_sessions as Record<string, unknown> | null;
    const project = session?.projects as Record<string, unknown> | null;

    return {
      ...report,
      sessionId: session?.id as string | undefined,
      projectName: project?.name as string | undefined,
    };
  }
}

// ============================================================================
// Factory
// ============================================================================

let reportRepository: BugReportRepository | null = null;

export function getReportRepository(
  db: SupabaseClient<Database>
): BugReportRepository {
  if (!reportRepository) {
    reportRepository = new BugReportRepository(db);
  }
  return reportRepository;
}
