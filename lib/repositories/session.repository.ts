// ============================================================================
// Test Session Repository
// ============================================================================
// Data access layer for TestSession entities
// ============================================================================

import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository, QueryOptions, PaginatedResult } from "../core/repository";
import { Result, ok, err } from "../core/result";
import { AppError, Errors } from "../core/errors";
import type { Database } from "../database.types";

// ============================================================================
// Types
// ============================================================================

export interface TestSession {
  id: string;
  projectId: string;
  status: "queued" | "running" | "completed" | "failed";
  triggerType: "manual" | "webhook" | "scheduled";
  triggerMetadata: Record<string, unknown>;
  progress: number;
  bugsFound: number;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
}

export interface TestSessionWithDetails extends TestSession {
  project?: {
    id: string;
    name: string;
    accessUrl: string | null;
  };
  agents: AgentExecution[];
}

export interface AgentExecution {
  id: string;
  agentId: string;
  agentName: string;
  status: string;
  progress: number;
}

export interface CreateSessionData {
  projectId: string;
  triggerType?: "manual" | "webhook" | "scheduled";
  triggerMetadata?: Record<string, unknown>;
}

export interface UpdateSessionData {
  status?: "queued" | "running" | "completed" | "failed";
  progress?: number;
  bugsFound?: number;
  startedAt?: Date;
  completedAt?: Date;
}

export interface SessionQueryOptions extends QueryOptions {
  projectId?: string;
  status?: string;
}

// ============================================================================
// Repository Implementation
// ============================================================================

export class TestSessionRepository extends BaseRepository<
  TestSession,
  CreateSessionData,
  UpdateSessionData
> {
  constructor(db: SupabaseClient<Database>) {
    super(db, "test_sessions");
  }

  protected get resourceType(): string {
    return "TestSession";
  }

  protected toEntity(row: Record<string, unknown>): TestSession {
    return {
      id: row.id as string,
      projectId: row.project_id as string,
      status: (row.status as TestSession["status"]) || "queued",
      triggerType: (row.trigger_type as TestSession["triggerType"]) || "manual",
      triggerMetadata: (row.trigger_metadata as Record<string, unknown>) || {},
      progress: (row.progress as number) || 0,
      bugsFound: (row.bugs_found as number) || 0,
      startedAt: row.started_at ? new Date(row.started_at as string) : null,
      completedAt: row.completed_at ? new Date(row.completed_at as string) : null,
      createdAt: new Date(row.created_at as string),
    };
  }

  protected toInsertRow(data: CreateSessionData): Record<string, unknown> {
    return {
      project_id: data.projectId,
      trigger_type: data.triggerType || "manual",
      trigger_metadata: data.triggerMetadata || {},
      status: "queued",
      progress: 0,
      bugs_found: 0,
    };
  }

  protected toUpdateRow(data: UpdateSessionData): Record<string, unknown> {
    const row: Record<string, unknown> = {};
    if (data.status !== undefined) row.status = data.status;
    if (data.progress !== undefined) row.progress = data.progress;
    if (data.bugsFound !== undefined) row.bugs_found = data.bugsFound;
    if (data.startedAt !== undefined) row.started_at = data.startedAt.toISOString();
    if (data.completedAt !== undefined) row.completed_at = data.completedAt.toISOString();
    return row;
  }

  /**
   * Find sessions with project and agent details
   */
  async findWithDetails(
    options: SessionQueryOptions = {}
  ): Promise<Result<PaginatedResult<TestSessionWithDetails>, AppError>> {
    const timer = this.log.startTimer("sessions.findWithDetails");
    const { page = 1, limit = 20, sortBy = "created_at", sortOrder = "desc" } = options;
    const offset = (page - 1) * limit;

    try {
      let query = this.db
        .from("test_sessions")
        .select(
          `
          *,
          projects (
            id,
            name,
            access_url
          ),
          agent_executions (
            id,
            agent_id,
            agent_name,
            status,
            progress
          )
        `,
          { count: "exact" }
        );

      // Apply filters
      if (options.projectId) {
        query = query.eq("project_id", options.projectId);
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

      const items = (data || []).map((row) => this.toSessionWithDetails(row));
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
   * Get session by ID with full details
   */
  async findByIdWithDetails(id: string): Promise<Result<TestSessionWithDetails, AppError>> {
    const timer = this.log.startTimer("sessions.findByIdWithDetails");

    try {
      const { data, error } = await this.db
        .from("test_sessions")
        .select(
          `
          *,
          projects (
            id,
            name,
            access_url
          ),
          agent_executions (
            id,
            agent_id,
            agent_name,
            status,
            progress
          )
        `
        )
        .eq("id", id)
        .single();

      timer();

      if (error) {
        if (error.code === "PGRST116") {
          return err(Errors.sessionNotFound(id));
        }
        return err(Errors.supabase(error.message));
      }

      return ok(this.toSessionWithDetails(data));
    } catch (e) {
      timer();
      return err(Errors.supabase(String(e)));
    }
  }

  /**
   * Check if project has a running session
   */
  async hasRunningSession(projectId: string): Promise<Result<boolean, AppError>> {
    try {
      const { count, error } = await this.db
        .from("test_sessions")
        .select("id", { count: "exact", head: true })
        .eq("project_id", projectId)
        .in("status", ["queued", "running"]);

      if (error) {
        return err(Errors.supabase(error.message));
      }

      return ok((count || 0) > 0);
    } catch (e) {
      return err(Errors.supabase(String(e)));
    }
  }

  /**
   * Start a session (set status to running)
   */
  async startSession(id: string): Promise<Result<TestSession, AppError>> {
    return this.update(id, {
      status: "running",
      startedAt: new Date(),
    });
  }

  /**
   * Complete a session
   */
  async completeSession(id: string, bugsFound: number): Promise<Result<TestSession, AppError>> {
    return this.update(id, {
      status: "completed",
      completedAt: new Date(),
      progress: 100,
      bugsFound,
    });
  }

  /**
   * Fail a session
   */
  async failSession(id: string): Promise<Result<TestSession, AppError>> {
    return this.update(id, {
      status: "failed",
      completedAt: new Date(),
    });
  }

  private toSessionWithDetails(row: Record<string, unknown>): TestSessionWithDetails {
    const session = this.toEntity(row);
    const projectData = row.projects as Record<string, unknown> | null;
    const agentsData = (row.agent_executions as Array<Record<string, unknown>>) || [];

    return {
      ...session,
      project: projectData
        ? {
            id: projectData.id as string,
            name: projectData.name as string,
            accessUrl: projectData.access_url as string | null,
          }
        : undefined,
      agents: agentsData.map((a) => ({
        id: a.id as string,
        agentId: a.agent_id as string,
        agentName: a.agent_name as string,
        status: a.status as string,
        progress: (a.progress as number) || 0,
      })),
    };
  }
}

// ============================================================================
// Factory
// ============================================================================

let sessionRepository: TestSessionRepository | null = null;

export function getSessionRepository(db: SupabaseClient<Database>): TestSessionRepository {
  if (!sessionRepository) {
    sessionRepository = new TestSessionRepository(db);
  }
  return sessionRepository;
}
