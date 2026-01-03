// ========================
// Relational Data Store
// ========================
// Purpose: Structured data with ACID transactions
// Use for: Projects, Users, Sessions, Bug Reports (metadata)
//
// "Relational databases are the backbone for structured,
// transactional data that needs consistency guarantees."

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "../database.types";
import type {
  DataStore,
  HealthStatus,
  QueryOptions,
  TransactionContext,
} from "./types";
import type { Project, TestSession, BugReport, AgentExecution } from "../types";

export class RelationalStore implements DataStore {
  name = "supabase-postgres";
  type = "relational" as const;
  private client: SupabaseClient<Database> | null = null;
  private isConfigured: boolean;

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    this.isConfigured = Boolean(supabaseUrl && supabaseKey);
    if (this.isConfigured) {
      this.client = createClient<Database>(supabaseUrl, supabaseKey);
    }
  }

  private getClient(): SupabaseClient<Database> {
    if (!this.client) {
      throw new Error(
        "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
      );
    }
    return this.client;
  }

  async isConnected(): Promise<boolean> {
    if (!this.isConfigured) return false;
    try {
      const { error } = await this.getClient()
        .from("projects")
        .select("id")
        .limit(1);
      return !error;
    } catch {
      return false;
    }
  }

  async healthCheck(): Promise<HealthStatus> {
    const start = Date.now();
    try {
      const connected = await this.isConnected();
      return {
        healthy: connected,
        latencyMs: Date.now() - start,
        message: connected ? "PostgreSQL connected" : "Connection failed",
      };
    } catch (error) {
      return {
        healthy: false,
        latencyMs: Date.now() - start,
        message: String(error),
      };
    }
  }

  // ========================
  // Project Operations
  // ========================

  async getProject(id: string): Promise<Project | null> {
    const { data, error } = await this.getClient()
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return this.mapProject(data);
  }

  async getProjects(
    userId: string,
    options?: QueryOptions
  ): Promise<Project[]> {
    let query = this.getClient().from("projects").select("*").eq("user_id", userId);

    if (options?.limit) query = query.limit(options.limit);
    if (options?.offset)
      query = query.range(
        options.offset,
        options.offset + (options.limit || 10) - 1
      );
    if (options?.orderBy) {
      query = query.order(options.orderBy, {
        ascending: options.order === "asc",
      });
    }

    const { data, error } = await query;
    if (error || !data) return [];
    return data.map(this.mapProject);
  }

  async createProject(
    project: Omit<Project, "id" | "createdAt" | "updatedAt">
  ): Promise<Project> {
    const { data, error } = await this.getClient()
      .from("projects")
      .insert({
        user_id: project.userId,
        name: project.name,
        description: project.description,
        platform: project.platform,
        access_url: project.accessUrl,
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to create project: ${error?.message}`);
    }
    return this.mapProject(data);
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const { data, error } = await this.getClient()
      .from("projects")
      .update({
        name: updates.name,
        description: updates.description,
        platform: updates.platform,
        access_url: updates.accessUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to update project: ${error?.message}`);
    }
    return this.mapProject(data);
  }

  // ========================
  // Session Operations
  // ========================

  async getSession(id: string): Promise<TestSession | null> {
    const { data, error } = await this.getClient()
      .from("test_sessions")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return this.mapSession(data);
  }

  async getSessionsByProject(
    projectId: string,
    options?: QueryOptions
  ): Promise<TestSession[]> {
    let query = this.getClient()
      .from("test_sessions")
      .select("*")
      .eq("project_id", projectId);

    if (options?.limit) query = query.limit(options.limit);
    if (options?.orderBy) {
      query = query.order(options.orderBy, {
        ascending: options.order === "asc",
      });
    }

    const { data, error } = await query;
    if (error || !data) return [];
    return data.map(this.mapSession);
  }

  async createSession(session: Omit<TestSession, "id">): Promise<TestSession> {
    const { data, error } = await this.getClient()
      .from("test_sessions")
      .insert({
        project_id: session.projectId,
        status: session.status,
        trigger_type: session.triggerType,
        trigger_metadata: (session.triggerMetadata || null) as Json,
        started_at: session.startedAt?.toISOString(),
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to create session: ${error?.message}`);
    }
    return this.mapSession(data);
  }

  // ========================
  // Bug Report Operations
  // ========================

  async getBugReport(id: string): Promise<BugReport | null> {
    const { data, error } = await this.getClient()
      .from("bug_reports")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return this.mapBugReport(data);
  }

  async getBugReportsBySession(sessionId: string): Promise<BugReport[]> {
    const { data, error } = await this.getClient()
      .from("bug_reports")
      .select("*, agent_executions!inner(session_id)")
      .eq("agent_executions.session_id", sessionId);

    if (error || !data) return [];
    return data.map(this.mapBugReport);
  }

  async createBugReport(
    report: Omit<BugReport, "id" | "createdAt">
  ): Promise<BugReport> {
    const { data, error } = await this.getClient()
      .from("bug_reports")
      .insert({
        project_id: report.projectId,
        execution_id: report.executionId,
        severity: report.severity,
        title: report.title,
        description: report.description,
        reproduction_steps: report.reproductionSteps,
        expected_behavior: report.expectedBehavior,
        actual_behavior: report.actualBehavior,
        screenshots: report.screenshots,
        console_errors: report.consoleErrors as unknown as Json,
        network_logs: report.networkLogs as unknown as Json,
        environment_info: report.environmentInfo as unknown as Json,
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to create bug report: ${error?.message}`);
    }
    return this.mapBugReport(data);
  }

  // ========================
  // Transaction Support
  // ========================

  async withTransaction<T>(
    fn: (ctx: TransactionContext) => Promise<T>
  ): Promise<T> {
    // Supabase doesn't support client-side transactions natively
    // For complex transactions, use RPC functions or Edge Functions
    const ctx: TransactionContext = {
      id: crypto.randomUUID(),
      operations: [],
    };
    return fn(ctx);
  }

  // ========================
  // Private Mappers
  // ========================

  /* eslint-disable @typescript-eslint/no-explicit-any */
  private mapProject(data: any): Project {
    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      description: data.description || "",
      platform: data.platform || [],
      accessUrl: data.access_url,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  private mapSession(data: any): TestSession {
    return {
      id: data.id,
      projectId: data.project_id,
      status: data.status,
      triggerType: data.trigger_type,
      triggerMetadata: data.trigger_metadata,
      startedAt: data.started_at ? new Date(data.started_at) : undefined,
      completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
    };
  }

  private mapBugReport(data: any): BugReport {
    return {
      id: data.id,
      projectId: data.project_id,
      executionId: data.execution_id,
      severity: data.severity,
      title: data.title,
      description: data.description,
      reproductionSteps: data.reproduction_steps || [],
      expectedBehavior: data.expected_behavior,
      actualBehavior: data.actual_behavior,
      screenshots: data.screenshots || [],
      consoleErrors: data.console_errors || [],
      networkLogs: data.network_logs || [],
      environmentInfo: data.environment_info,
      createdAt: new Date(data.created_at),
    };
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

// Singleton instance
let relationalStore: RelationalStore | null = null;

export function getRelationalStore(): RelationalStore {
  if (!relationalStore) {
    relationalStore = new RelationalStore();
  }
  return relationalStore;
}
