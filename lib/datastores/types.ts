// ========================
// Multi-Database Type Definitions
// ========================
// Each database type serves a specific purpose in GenAI applications.
// This file defines the interfaces for each store type.

/**
 * Data Store Types used in BetaForge
 *
 * Based on the GenAI database taxonomy:
 * ✦ Relational DB - Structured data (projects, users, sessions)
 * ✦ Vector DB - Semantic search (similar bugs, reports)
 * ✦ Agent Memory Store - Agent context and conversation history
 * ✦ Knowledge Base - Testing patterns, known issues
 * ✦ Key-Value Store - Caching, session state
 */

// Base interface for all data stores
export interface DataStore {
  name: string;
  type: DataStoreType;
  isConnected(): Promise<boolean>;
  healthCheck(): Promise<HealthStatus>;
}

export type DataStoreType =
  | "relational"
  | "vector"
  | "agent-memory"
  | "knowledge-base"
  | "key-value"
  | "time-series";

export interface HealthStatus {
  healthy: boolean;
  latencyMs: number;
  message?: string;
}

// ========================
// Vector Store Types
// ========================

export interface VectorDocument {
  id: string;
  content: string;
  embedding?: number[];
  metadata: Record<string, unknown>;
  createdAt: Date;
}

export interface VectorSearchResult {
  document: VectorDocument;
  similarity: number;
  distance: number;
}

export interface VectorSearchOptions {
  topK?: number;
  threshold?: number;
  filter?: Record<string, unknown>;
}

// ========================
// Agent Memory Types
// ========================

export interface AgentMemory {
  id: string;
  agentId: string;
  projectId: string;
  sessionId?: string;
  memoryType: MemoryType;
  content: string;
  importance: number; // 0-1 scale for memory prioritization
  embedding?: number[];
  metadata: Record<string, unknown>;
  createdAt: Date;
  accessedAt: Date;
  accessCount: number;
}

export type MemoryType =
  | "observation" // What the agent saw/experienced
  | "action" // What the agent did
  | "reflection" // Agent's analysis/insight
  | "bug-pattern" // Recognized bug patterns
  | "user-preference" // Learned user/app preferences
  | "conversation"; // Context from interactions

export interface MemoryQuery {
  agentId: string;
  projectId?: string;
  sessionId?: string;
  memoryTypes?: MemoryType[];
  query?: string; // For semantic search
  limit?: number;
  minImportance?: number;
  recencyWeight?: number; // How much to weight recent memories
}

export interface AgentContext {
  shortTermMemories: AgentMemory[]; // Recent, session-specific
  longTermMemories: AgentMemory[]; // Cross-session patterns
  relevantKnowledge: KnowledgeEntry[]; // From knowledge base
}

// ========================
// Knowledge Base Types
// ========================

export interface KnowledgeEntry {
  id: string;
  category: KnowledgeCategory;
  title: string;
  content: string;
  embedding?: number[];
  tags: string[];
  source: "system" | "learned" | "user-defined";
  confidence: number;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export type KnowledgeCategory =
  | "testing-pattern" // Common testing patterns
  | "bug-pattern" // Known bug types
  | "ux-guideline" // UX best practices
  | "accessibility" // A11y standards
  | "platform-quirk" // Platform-specific issues
  | "reproduction-step" // Common repro patterns
  | "fix-suggestion"; // Known solutions

export interface KnowledgeQuery {
  query: string;
  categories?: KnowledgeCategory[];
  tags?: string[];
  minConfidence?: number;
  limit?: number;
}

// ========================
// Cache Store Types
// ========================

export interface CacheEntry<T = unknown> {
  key: string;
  value: T;
  ttlSeconds?: number;
  createdAt: Date;
  expiresAt?: Date;
}

export interface CacheOptions {
  ttlSeconds?: number;
  namespace?: string;
}

// ========================
// Relational Store Types
// ========================

export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  order?: "asc" | "desc";
}

export interface TransactionContext {
  id: string;
  operations: (() => Promise<unknown>)[];
}
