// ============================================================================
// Project Service
// ============================================================================
// Business logic layer for project operations
// Orchestrates repositories and enforces business rules
// ============================================================================

import { createServerClient } from "../supabase";
import { Result, ok, err } from "../core/result";
import { AppError, Errors } from "../core/errors";
import { logger } from "../core/logger";
import {
  getProjectRepository,
  ProjectRepository,
  ProjectWithStats,
  CreateProjectData,
  UpdateProjectData,
  ProjectQueryOptions,
} from "../repositories/project.repository";
import { getSessionRepository } from "../repositories/session.repository";
import { PaginatedResult } from "../core/repository";
import { config } from "../core/config";

// ============================================================================
// Types
// ============================================================================

export interface ProjectServiceConfig {
  maxProjectsPerUser?: number;
  allowedPlatforms?: string[];
}

// ============================================================================
// Service Implementation
// ============================================================================

export class ProjectService {
  private projectRepo: ProjectRepository;
  private config: ProjectServiceConfig;
  private log = logger.child({});

  constructor(config: ProjectServiceConfig = {}) {
    const db = createServerClient();
    this.projectRepo = getProjectRepository(db);
    this.config = {
      maxProjectsPerUser: config.maxProjectsPerUser || 50,
      allowedPlatforms: config.allowedPlatforms || ["web", "mobile", "desktop"],
    };
  }

  /**
   * Get all projects with stats
   */
  async listProjects(
    options: ProjectQueryOptions = {}
  ): Promise<Result<PaginatedResult<ProjectWithStats>, AppError>> {
    this.log.debug("Listing projects", { options });
    return this.projectRepo.findAllWithStats(options);
  }

  /**
   * Get projects for a specific user
   */
  async listUserProjects(
    userId: string,
    options: ProjectQueryOptions = {}
  ): Promise<Result<PaginatedResult<ProjectWithStats>, AppError>> {
    this.log.debug("Listing user projects", { userId, options });
    return this.projectRepo.findByUserId(userId, options);
  }

  /**
   * Get a single project by ID
   */
  async getProject(id: string): Promise<Result<ProjectWithStats, AppError>> {
    this.log.debug("Getting project", { id });

    const result = await this.projectRepo.findAllWithStats({ limit: 1 });
    if (result.isErr()) {
      return err(result.error);
    }

    const project = result.value.items.find((p) => p.id === id);
    if (!project) {
      return err(Errors.projectNotFound(id));
    }

    return ok(project);
  }

  /**
   * Create a new project
   */
  async createProject(
    data: CreateProjectData
  ): Promise<Result<ProjectWithStats, AppError>> {
    this.log.info("Creating project", { name: data.name, userId: data.userId });

    // Validate platforms
    if (data.platform) {
      const invalidPlatforms = data.platform.filter(
        (p) => !this.config.allowedPlatforms?.includes(p)
      );
      if (invalidPlatforms.length > 0) {
        return err(
          Errors.invalidInput(
            "platform",
            `Invalid platforms: ${invalidPlatforms.join(", ")}`
          )
        );
      }
    }

    // Check project limit
    const existingResult = await this.projectRepo.findByUserId(data.userId, {
      limit: 1,
    });
    if (existingResult.isOk()) {
      const total = existingResult.value.total;
      if (total >= (this.config.maxProjectsPerUser || 50)) {
        return err(
          Errors.businessRule(
            `Maximum of ${this.config.maxProjectsPerUser} projects per user`
          )
        );
      }
    }

    // Create the project
    const createResult = await this.projectRepo.create(data);
    if (createResult.isErr()) {
      return err(createResult.error);
    }

    // Return with stats
    return this.getProject(createResult.value.id);
  }

  /**
   * Update a project
   */
  async updateProject(
    id: string,
    data: UpdateProjectData,
    userId?: string
  ): Promise<Result<ProjectWithStats, AppError>> {
    this.log.info("Updating project", { id, data });

    // Check ownership if userId provided
    if (userId) {
      const isOwner = await this.projectRepo.isOwner(id, userId);
      if (isOwner.isErr()) {
        return err(isOwner.error);
      }
      if (!isOwner.value) {
        return err(Errors.unauthorized());
      }
    }

    // Validate platforms if updating
    if (data.platform) {
      const invalidPlatforms = data.platform.filter(
        (p) => !this.config.allowedPlatforms?.includes(p)
      );
      if (invalidPlatforms.length > 0) {
        return err(
          Errors.invalidInput(
            "platform",
            `Invalid platforms: ${invalidPlatforms.join(", ")}`
          )
        );
      }
    }

    // Update the project
    const updateResult = await this.projectRepo.update(id, data);
    if (updateResult.isErr()) {
      return err(updateResult.error);
    }

    // Return with stats
    return this.getProject(id);
  }

  /**
   * Delete a project
   */
  async deleteProject(
    id: string,
    userId?: string
  ): Promise<Result<void, AppError>> {
    this.log.info("Deleting project", { id });

    // Check ownership if userId provided
    if (userId) {
      const isOwner = await this.projectRepo.isOwner(id, userId);
      if (isOwner.isErr()) {
        return err(isOwner.error);
      }
      if (!isOwner.value) {
        return err(Errors.unauthorized());
      }
    }

    // Check for running sessions
    const db = createServerClient();
    const sessionRepo = getSessionRepository(db);
    const hasRunning = await sessionRepo.hasRunningSession(id);
    if (hasRunning.isOk() && hasRunning.value) {
      return err(
        Errors.businessRule("Cannot delete project with running test sessions")
      );
    }

    return this.projectRepo.delete(id);
  }

  /**
   * Start a test session for a project
   */
  async startTestSession(
    projectId: string,
    options: {
      triggerType?: "manual" | "webhook" | "scheduled";
      triggerMetadata?: Record<string, unknown>;
    } = {}
  ): Promise<Result<{ sessionId: string }, AppError>> {
    this.log.info("Starting test session", { projectId, options });

    // Check if AI testing is enabled
    if (!config.features.aiTesting) {
      return err(
        Errors.businessRule(
          "AI testing is not available. Configure ANTHROPIC_API_KEY to enable."
        )
      );
    }

    // Check project exists
    const projectResult = await this.projectRepo.findById(projectId);
    if (projectResult.isErr()) {
      return err(projectResult.error);
    }

    // Check for existing running session
    const db = createServerClient();
    const sessionRepo = getSessionRepository(db);
    const hasRunning = await sessionRepo.hasRunningSession(projectId);
    if (hasRunning.isOk() && hasRunning.value) {
      return err(Errors.sessionAlreadyRunning(projectId));
    }

    // Create session
    const sessionResult = await sessionRepo.create({
      projectId,
      triggerType: options.triggerType || "manual",
      triggerMetadata: options.triggerMetadata,
    });

    if (sessionResult.isErr()) {
      return err(sessionResult.error);
    }

    // Update project status
    await this.projectRepo.update(projectId, { status: "testing" });

    // TODO: Trigger orchestrator to run agents
    // This would be done via a background job in production

    return ok({ sessionId: sessionResult.value.id });
  }
}

// ============================================================================
// Factory
// ============================================================================

let projectService: ProjectService | null = null;

export function getProjectService(): ProjectService {
  if (!projectService) {
    projectService = new ProjectService();
  }
  return projectService;
}
