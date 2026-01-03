// ========================
// Agent Memory Store
// ========================
// Purpose: Persistent memory for AI agents across sessions
// Use for: Context retention, learning from past interactions, personalization
//
// "Agent memory stores and knowledge bases work together to create
// that 'it just gets me' feeling in AI products." - Prasanth Kumar
//
// This is crucial for BetaForge because agents need to:
// - Remember patterns from previous test sessions
// - Learn project-specific quirks and known issues
// - Maintain context within and across testing sessions

import type {
  DataStore,
  HealthStatus,
  AgentMemory,
  MemoryType,
  MemoryQuery,
  AgentContext,
  KnowledgeEntry,
} from "./types";
import { getVectorStore } from "./vector-store";
import { getKnowledgeBase } from "./knowledge-base";

/**
 * Agent Memory Store
 *
 * Implements a tiered memory system:
 * 1. Short-term: Session-specific memories (recent actions, observations)
 * 2. Long-term: Cross-session patterns (learned behaviors, bug patterns)
 * 3. Knowledge: External knowledge base integration
 */
export class AgentMemoryStore implements DataStore {
  name = "agent-memory";
  type = "agent-memory" as const;

  // In-memory store for development
  // In production, this would be backed by a persistent store
  private memories: Map<string, AgentMemory> = new Map();

  async isConnected(): Promise<boolean> {
    return true;
  }

  async healthCheck(): Promise<HealthStatus> {
    return {
      healthy: true,
      latencyMs: 0,
      message: `${this.memories.size} memories in store`,
    };
  }

  // ========================
  // Memory CRUD Operations
  // ========================

  async storeMemory(
    memory: Omit<AgentMemory, "id" | "accessedAt" | "accessCount">
  ): Promise<AgentMemory> {
    const vectorStore = getVectorStore();
    const embedding = await vectorStore.generateEmbedding(memory.content);

    const fullMemory: AgentMemory = {
      ...memory,
      id: crypto.randomUUID(),
      embedding,
      accessedAt: new Date(),
      accessCount: 0,
    };

    this.memories.set(fullMemory.id, fullMemory);
    console.log(
      `[AgentMemory] Stored ${memory.memoryType} memory for agent ${memory.agentId}`
    );

    return fullMemory;
  }

  async getMemory(id: string): Promise<AgentMemory | null> {
    const memory = this.memories.get(id);
    if (memory) {
      // Update access metadata
      memory.accessedAt = new Date();
      memory.accessCount++;
    }
    return memory || null;
  }

  async deleteMemory(id: string): Promise<void> {
    this.memories.delete(id);
  }

  // ========================
  // Memory Retrieval
  // ========================

  /**
   * Query memories with semantic search and filtering
   */
  async queryMemories(query: MemoryQuery): Promise<AgentMemory[]> {
    let results = Array.from(this.memories.values());

    // Filter by agent
    results = results.filter((m) => m.agentId === query.agentId);

    // Filter by project
    if (query.projectId) {
      results = results.filter((m) => m.projectId === query.projectId);
    }

    // Filter by session
    if (query.sessionId) {
      results = results.filter((m) => m.sessionId === query.sessionId);
    }

    // Filter by memory types
    if (query.memoryTypes?.length) {
      results = results.filter((m) =>
        query.memoryTypes!.includes(m.memoryType)
      );
    }

    // Filter by importance
    if (query.minImportance !== undefined) {
      results = results.filter((m) => m.importance >= query.minImportance!);
    }

    // Semantic search if query provided
    if (query.query) {
      const vectorStore = getVectorStore();
      const queryEmbedding = await vectorStore.generateEmbedding(query.query);

      // Score by semantic similarity
      results = results
        .map((memory) => ({
          memory,
          similarity: memory.embedding
            ? vectorStore.cosineSimilarity(queryEmbedding, memory.embedding)
            : 0,
        }))
        .filter((r) => r.similarity > 0.5)
        .sort((a, b) => b.similarity - a.similarity)
        .map((r) => r.memory);
    }

    // Apply recency weighting if specified
    if (query.recencyWeight && query.recencyWeight > 0) {
      const now = Date.now();
      results.sort((a, b) => {
        const recencyA =
          1 / (1 + (now - a.createdAt.getTime()) / (1000 * 60 * 60)); // Decay over hours
        const recencyB =
          1 / (1 + (now - b.createdAt.getTime()) / (1000 * 60 * 60));
        const scoreA = a.importance + recencyA * query.recencyWeight!;
        const scoreB = b.importance + recencyB * query.recencyWeight!;
        return scoreB - scoreA;
      });
    }

    // Limit results
    if (query.limit) {
      results = results.slice(0, query.limit);
    }

    return results;
  }

  // ========================
  // Context Building
  // ========================

  /**
   * Build complete agent context for a testing session
   * This combines short-term memories, long-term patterns, and knowledge base
   */
  async buildAgentContext(
    agentId: string,
    projectId: string,
    sessionId?: string,
    contextQuery?: string
  ): Promise<AgentContext> {
    // Get short-term memories (session-specific, recent)
    const shortTermMemories = await this.queryMemories({
      agentId,
      projectId,
      sessionId,
      memoryTypes: ["observation", "action"],
      limit: 20,
      recencyWeight: 1.0,
    });

    // Get long-term memories (cross-session patterns)
    const longTermMemories = await this.queryMemories({
      agentId,
      projectId,
      memoryTypes: ["reflection", "bug-pattern", "user-preference"],
      minImportance: 0.7,
      limit: 10,
    });

    // Get relevant knowledge from knowledge base
    const knowledgeBase = getKnowledgeBase();
    const relevantKnowledge = contextQuery
      ? await knowledgeBase.search({ query: contextQuery, limit: 5 })
      : [];

    return {
      shortTermMemories,
      longTermMemories,
      relevantKnowledge,
    };
  }

  // ========================
  // Memory Management
  // ========================

  /**
   * Create an observation memory (what the agent saw)
   */
  async observe(
    agentId: string,
    projectId: string,
    sessionId: string,
    observation: string,
    importance: number = 0.5
  ): Promise<AgentMemory> {
    return this.storeMemory({
      agentId,
      projectId,
      sessionId,
      memoryType: "observation",
      content: observation,
      importance,
      metadata: { source: "testing" },
      createdAt: new Date(),
    });
  }

  /**
   * Create an action memory (what the agent did)
   */
  async recordAction(
    agentId: string,
    projectId: string,
    sessionId: string,
    action: string,
    result: string,
    importance: number = 0.5
  ): Promise<AgentMemory> {
    return this.storeMemory({
      agentId,
      projectId,
      sessionId,
      memoryType: "action",
      content: `Action: ${action}\nResult: ${result}`,
      importance,
      metadata: { action, result },
      createdAt: new Date(),
    });
  }

  /**
   * Create a reflection (agent's analysis/insight)
   */
  async reflect(
    agentId: string,
    projectId: string,
    reflection: string,
    importance: number = 0.8
  ): Promise<AgentMemory> {
    return this.storeMemory({
      agentId,
      projectId,
      memoryType: "reflection",
      content: reflection,
      importance,
      metadata: { source: "self-reflection" },
      createdAt: new Date(),
    });
  }

  /**
   * Learn a bug pattern for future recognition
   */
  async learnBugPattern(
    agentId: string,
    projectId: string,
    pattern: {
      title: string;
      description: string;
      symptoms: string[];
      category: string;
    }
  ): Promise<AgentMemory> {
    return this.storeMemory({
      agentId,
      projectId,
      memoryType: "bug-pattern",
      content: `Bug Pattern: ${pattern.title}\n${
        pattern.description
      }\nSymptoms: ${pattern.symptoms.join(", ")}`,
      importance: 0.9,
      metadata: pattern,
      createdAt: new Date(),
    });
  }

  /**
   * Consolidate memories (cleanup old, merge similar)
   * This is important for long-running agents
   */
  async consolidateMemories(agentId: string, projectId: string): Promise<void> {
    const memories = await this.queryMemories({ agentId, projectId });

    // Remove old, low-importance memories
    const now = Date.now();
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

    for (const memory of memories) {
      const age = now - memory.createdAt.getTime();
      const shouldDelete =
        age > maxAge && memory.importance < 0.5 && memory.accessCount < 3;

      if (shouldDelete) {
        await this.deleteMemory(memory.id);
      }
    }

    console.log(`[AgentMemory] Consolidated memories for agent ${agentId}`);
  }

  /**
   * Format memories for inclusion in agent prompt
   */
  formatContextForPrompt(context: AgentContext): string {
    let prompt = "";

    if (context.shortTermMemories.length > 0) {
      prompt += "## Recent Session Context\n";
      for (const mem of context.shortTermMemories.slice(0, 10)) {
        prompt += `- ${mem.content}\n`;
      }
      prompt += "\n";
    }

    if (context.longTermMemories.length > 0) {
      prompt += "## Learned Patterns\n";
      for (const mem of context.longTermMemories.slice(0, 5)) {
        prompt += `- ${mem.content}\n`;
      }
      prompt += "\n";
    }

    if (context.relevantKnowledge.length > 0) {
      prompt += "## Relevant Knowledge\n";
      for (const knowledge of context.relevantKnowledge.slice(0, 5)) {
        prompt += `- [${knowledge.category}] ${knowledge.title}: ${knowledge.content}\n`;
      }
      prompt += "\n";
    }

    return prompt;
  }
}

// Singleton instance
let agentMemoryStore: AgentMemoryStore | null = null;

export function getAgentMemoryStore(): AgentMemoryStore {
  if (!agentMemoryStore) {
    agentMemoryStore = new AgentMemoryStore();
  }
  return agentMemoryStore;
}
