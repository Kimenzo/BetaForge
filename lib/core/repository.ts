// ============================================================================
// Repository Pattern - Base Repository
// ============================================================================
// Abstraction layer over data access for:
// - Clean separation of concerns
// - Easy testing with mocks
// - Database-agnostic business logic
// - Consistent error handling
// ============================================================================

import { SupabaseClient } from "@supabase/supabase-js";
import { Result, ok, err, tryCatch } from "./result";
import { AppError, Errors } from "./errors";
import { logger } from "./logger";
import type { Database } from "../database.types";

// ============================================================================
// Repository Types
// ============================================================================

/**
 * Common query options for list operations
 */
export interface QueryOptions {
  page?: number;
  limit?: number;
  cursor?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Paginated result
 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  cursor?: string;
}

/**
 * Base entity with timestamps
 */
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
}

// ============================================================================
// Base Repository
// ============================================================================

/**
 * Abstract base repository with common CRUD operations
 */
export abstract class BaseRepository<
  TEntity extends BaseEntity,
  TInsert,
  TUpdate
> {
  protected tableName: string;
  protected db: SupabaseClient<Database>;
  protected log = logger.child({});

  constructor(db: SupabaseClient<Database>, tableName: string) {
    this.db = db;
    this.tableName = tableName;
  }

  /**
   * Transform database row to entity
   */
  protected abstract toEntity(row: Record<string, unknown>): TEntity;

  /**
   * Transform entity to database row for insert
   */
  protected abstract toInsertRow(data: TInsert): Record<string, unknown>;

  /**
   * Transform update data to database row
   */
  protected abstract toUpdateRow(data: TUpdate): Record<string, unknown>;

  /**
   * Get the resource type name for error messages
   */
  protected abstract get resourceType(): string;

  /**
   * Find entity by ID
   */
  async findById(id: string): Promise<Result<TEntity, AppError>> {
    const timer = this.log.startTimer(`${this.tableName}.findById`);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (this.db as any)
        .from(this.tableName)
        .select("*")
        .eq("id", id)
        .single();

      timer();

      if (error) {
        if (error.code === "PGRST116") {
          return err(Errors.notFound(this.resourceType, id));
        }
        return err(Errors.supabase(error.message));
      }

      return ok(this.toEntity(data as Record<string, unknown>));
    } catch (e) {
      timer();
      return err(Errors.supabase(String(e)));
    }
  }

  /**
   * Find all entities with pagination
   */
  async findAll(
    options: QueryOptions = {}
  ): Promise<Result<PaginatedResult<TEntity>, AppError>> {
    const timer = this.log.startTimer(`${this.tableName}.findAll`);
    const {
      page = 1,
      limit = 20,
      sortBy = "created_at",
      sortOrder = "desc",
    } = options;
    const offset = (page - 1) * limit;

    try {
      // Get total count
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { count, error: countError } = await (this.db as any)
        .from(this.tableName)
        .select("*", { count: "exact", head: true });

      if (countError) {
        timer();
        return err(Errors.supabase(countError.message));
      }

      // Get paginated data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (this.db as any)
        .from(this.tableName)
        .select("*")
        .order(sortBy, { ascending: sortOrder === "asc" })
        .range(offset, offset + limit - 1);

      timer();

      if (error) {
        return err(Errors.supabase(error.message));
      }

      const items = (data || []).map((row: Record<string, unknown>) =>
        this.toEntity(row)
      );
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
   * Create a new entity
   */
  async create(data: TInsert): Promise<Result<TEntity, AppError>> {
    const timer = this.log.startTimer(`${this.tableName}.create`);
    const row = this.toInsertRow(data);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: created, error } = await (this.db as any)
        .from(this.tableName)
        .insert(row)
        .select()
        .single();

      timer();

      if (error) {
        if (error.code === "23505") {
          return err(Errors.duplicate(this.resourceType));
        }
        return err(Errors.supabase(error.message));
      }

      return ok(this.toEntity(created as Record<string, unknown>));
    } catch (e) {
      timer();
      return err(Errors.supabase(String(e)));
    }
  }

  /**
   * Update an entity
   */
  async update(id: string, data: TUpdate): Promise<Result<TEntity, AppError>> {
    const timer = this.log.startTimer(`${this.tableName}.update`);
    const row = this.toUpdateRow(data);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: updated, error } = await (this.db as any)
        .from(this.tableName)
        .update({ ...row, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      timer();

      if (error) {
        if (error.code === "PGRST116") {
          return err(Errors.notFound(this.resourceType, id));
        }
        return err(Errors.supabase(error.message));
      }

      return ok(this.toEntity(updated as Record<string, unknown>));
    } catch (e) {
      timer();
      return err(Errors.supabase(String(e)));
    }
  }

  /**
   * Delete an entity
   */
  async delete(id: string): Promise<Result<void, AppError>> {
    const timer = this.log.startTimer(`${this.tableName}.delete`);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (this.db as any)
        .from(this.tableName)
        .delete()
        .eq("id", id);

      timer();

      if (error) {
        return err(Errors.supabase(error.message));
      }

      return ok(undefined);
    } catch (e) {
      timer();
      return err(Errors.supabase(String(e)));
    }
  }

  /**
   * Check if entity exists
   */
  async exists(id: string): Promise<Result<boolean, AppError>> {
    const result = await tryCatch<boolean, AppError>(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.db as any)
        .from(this.tableName)
        .select("id", { count: "exact", head: true })
        .eq("id", id)
        .then(({ count }: { count: number | null }) => (count || 0) > 0),
      (e) => Errors.supabase(String(e))
    );

    return result;
  }
}

// ============================================================================
// Unit of Work Pattern
// ============================================================================

/**
 * Unit of Work for managing transactions
 */
export interface UnitOfWork {
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

// Note: Supabase doesn't have direct transaction support in the JS client
// For complex transactions, use Supabase Edge Functions with raw SQL
