// ============================================================================
// Project Repository
// ============================================================================
// Data access layer for Project entities
// ============================================================================

import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository, QueryOptions, PaginatedResult } from "../core/repository";
import { Result, ok, err } from "../core/result";
import { AppError, Errors } from "../core/errors";
import type { Database } from "../database.types";

// ============================================================================
// Types
// ============================================================================

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  platform: string[];
  accessUrl: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectWithStats extends Project {
  stats: {
    sessionsCount: number;
    bugsFound: number;
    lastTested: Date | null;
  };
}

export interface CreateProjectData {
  userId: string;
  name: string;
  description?: string;
  platform?: string[];
  accessUrl: string;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  platform?: string[];
  accessUrl?: string;
  status?: string;
}

export interface ProjectQueryOptions extends QueryOptions {
  userId?: string;
  status?: string;
  platform?: string;
  search?: string;
}

// ============================================================================
// Repository Implementation
// ============================================================================

export class ProjectRepository extends BaseRepository<
  Project,
  CreateProjectData,
  UpdateProjectData
> {
  constructor(db: SupabaseClient<Database>) {
    super(db, "projects");
  }

  protected get resourceType(): string {
    return "Project";
  }

  protected toEntity(row: Record<string, unknown>): Project {
    return {
      id: row.id as string,
      userId: row.user_id as string,
      name: row.name as string,
      description: (row.description as string) || "",
      platform: (row.platform as string[]) || ["web"],
      accessUrl: row.access_url as string | null,
      status: (row.status as string) || "active",
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    };
  }

  protected toInsertRow(data: CreateProjectData): Record<string, unknown> {
    return {
      user_id: data.userId,
      name: data.name,
      description: data.description || "",
      platform: data.platform || ["web"],
      access_url: data.accessUrl,
      status: "active",
    };
  }

  protected toUpdateRow(data: UpdateProjectData): Record<string, unknown> {
    const row: Record<string, unknown> = {};
    if (data.name !== undefined) row.name = data.name;
    if (data.description !== undefined) row.description = data.description;
    if (data.platform !== undefined) row.platform = data.platform;
    if (data.accessUrl !== undefined) row.access_url = data.accessUrl;
    if (data.status !== undefined) row.status = data.status;
    return row;
  }

  /**
   * Find projects by user ID with stats
   */
  async findByUserId(
    userId: string,
    options: ProjectQueryOptions = {}
  ): Promise<Result<PaginatedResult<ProjectWithStats>, AppError>> {
    const timer = this.log.startTimer("projects.findByUserId");
    const { page = 1, limit = 20, sortBy = "created_at", sortOrder = "desc" } = options;
    const offset = (page - 1) * limit;

    try {
      let query = this.db
        .from("projects")
        .select(
          `
          *,
          test_sessions (
            id,
            status,
            bugs_found,
            completed_at
          )
        `,
          { count: "exact" }
        )
        .eq("user_id", userId);

      // Apply filters
      if (options.status) {
        query = query.eq("status", options.status);
      }
      if (options.platform) {
        query = query.contains("platform", [options.platform]);
      }
      if (options.search) {
        query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`);
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

      const items = (data || []).map((row) => this.toProjectWithStats(row));
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
   * Find all projects with stats (for demo/admin)
   */
  async findAllWithStats(
    options: ProjectQueryOptions = {}
  ): Promise<Result<PaginatedResult<ProjectWithStats>, AppError>> {
    const timer = this.log.startTimer("projects.findAllWithStats");
    const { page = 1, limit = 20, sortBy = "created_at", sortOrder = "desc" } = options;
    const offset = (page - 1) * limit;

    try {
      let query = this.db
        .from("projects")
        .select(
          `
          *,
          test_sessions (
            id,
            status,
            bugs_found,
            completed_at
          )
        `,
          { count: "exact" }
        );

      // Apply filters
      if (options.status) {
        query = query.eq("status", options.status);
      }
      if (options.platform) {
        query = query.contains("platform", [options.platform]);
      }
      if (options.search) {
        query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`);
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

      const items = (data || []).map((row) => this.toProjectWithStats(row));
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
   * Transform row with sessions to ProjectWithStats
   */
  private toProjectWithStats(row: Record<string, unknown>): ProjectWithStats {
    const project = this.toEntity(row);
    const sessions = (row.test_sessions as Array<Record<string, unknown>>) || [];
    const lastSession = sessions[0];
    const totalBugs = sessions.reduce(
      (sum, s) => sum + ((s.bugs_found as number) || 0),
      0
    );

    return {
      ...project,
      stats: {
        sessionsCount: sessions.length,
        bugsFound: totalBugs,
        lastTested: lastSession?.completed_at
          ? new Date(lastSession.completed_at as string)
          : null,
      },
    };
  }

  /**
   * Check if user owns project
   */
  async isOwner(projectId: string, userId: string): Promise<Result<boolean, AppError>> {
    try {
      const { count, error } = await this.db
        .from("projects")
        .select("id", { count: "exact", head: true })
        .eq("id", projectId)
        .eq("user_id", userId);

      if (error) {
        return err(Errors.supabase(error.message));
      }

      return ok((count || 0) > 0);
    } catch (e) {
      return err(Errors.supabase(String(e)));
    }
  }
}

// ============================================================================
// Factory
// ============================================================================

let projectRepository: ProjectRepository | null = null;

export function getProjectRepository(db: SupabaseClient<Database>): ProjectRepository {
  if (!projectRepository) {
    projectRepository = new ProjectRepository(db);
  }
  return projectRepository;
}
