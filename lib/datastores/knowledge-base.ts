// ========================
// Knowledge Base
// ========================
// Purpose: Store testing patterns, best practices, and known issues
// Use for: Agent guidance, bug categorization, fix suggestions
// 
// "Knowledge bases" are one of the key database types for GenAI apps.
// They store structured knowledge that agents can query.

import type {
  DataStore,
  HealthStatus,
  KnowledgeEntry,
  KnowledgeCategory,
  KnowledgeQuery,
} from "./types";
import { getVectorStore } from "./vector-store";

/**
 * Knowledge Base for BetaForge
 * 
 * Stores:
 * - Testing patterns and best practices
 * - Known bug patterns and solutions
 * - UX guidelines and accessibility standards
 * - Platform-specific quirks and issues
 */
export class KnowledgeBase implements DataStore {
  name = "knowledge-base";
  type = "knowledge-base" as const;

  // In-memory store initialized with default knowledge
  private entries: Map<string, KnowledgeEntry> = new Map();

  constructor() {
    this.initializeDefaultKnowledge();
  }

  async isConnected(): Promise<boolean> {
    return true;
  }

  async healthCheck(): Promise<HealthStatus> {
    return {
      healthy: true,
      latencyMs: 0,
      message: `${this.entries.size} knowledge entries`,
    };
  }

  // ========================
  // Knowledge CRUD
  // ========================

  async addEntry(
    entry: Omit<KnowledgeEntry, "id" | "embedding" | "usageCount" | "createdAt" | "updatedAt">
  ): Promise<KnowledgeEntry> {
    const vectorStore = getVectorStore();
    const embedding = await vectorStore.generateEmbedding(
      `${entry.title} ${entry.content} ${entry.tags.join(" ")}`
    );

    const fullEntry: KnowledgeEntry = {
      ...entry,
      id: crypto.randomUUID(),
      embedding,
      usageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.entries.set(fullEntry.id, fullEntry);
    return fullEntry;
  }

  async getEntry(id: string): Promise<KnowledgeEntry | null> {
    const entry = this.entries.get(id);
    if (entry) {
      entry.usageCount++;
    }
    return entry || null;
  }

  async updateEntry(
    id: string,
    updates: Partial<KnowledgeEntry>
  ): Promise<KnowledgeEntry | null> {
    const entry = this.entries.get(id);
    if (!entry) return null;

    const updated = {
      ...entry,
      ...updates,
      updatedAt: new Date(),
    };

    // Regenerate embedding if content changed
    if (updates.content || updates.title) {
      const vectorStore = getVectorStore();
      updated.embedding = await vectorStore.generateEmbedding(
        `${updated.title} ${updated.content} ${updated.tags.join(" ")}`
      );
    }

    this.entries.set(id, updated);
    return updated;
  }

  async deleteEntry(id: string): Promise<void> {
    this.entries.delete(id);
  }

  // ========================
  // Knowledge Search
  // ========================

  async search(query: KnowledgeQuery): Promise<KnowledgeEntry[]> {
    let results = Array.from(this.entries.values());

    // Filter by categories
    if (query.categories?.length) {
      results = results.filter(e => query.categories!.includes(e.category));
    }

    // Filter by tags
    if (query.tags?.length) {
      results = results.filter(e => 
        query.tags!.some(tag => e.tags.includes(tag))
      );
    }

    // Filter by confidence
    if (query.minConfidence !== undefined) {
      results = results.filter(e => e.confidence >= query.minConfidence!);
    }

    // Semantic search
    if (query.query) {
      const vectorStore = getVectorStore();
      const queryEmbedding = await vectorStore.generateEmbedding(query.query);

      results = results
        .map(entry => ({
          entry,
          similarity: entry.embedding
            ? vectorStore.cosineSimilarity(queryEmbedding, entry.embedding)
            : 0,
        }))
        .filter(r => r.similarity > 0.5)
        .sort((a, b) => b.similarity - a.similarity)
        .map(r => r.entry);
    }

    // Limit results
    if (query.limit) {
      results = results.slice(0, query.limit);
    }

    return results;
  }

  async getByCategory(category: KnowledgeCategory): Promise<KnowledgeEntry[]> {
    return Array.from(this.entries.values())
      .filter(e => e.category === category);
  }

  // ========================
  // Default Knowledge
  // ========================

  private initializeDefaultKnowledge(): void {
    const defaultKnowledge: Array<Omit<KnowledgeEntry, "id" | "embedding" | "usageCount" | "createdAt" | "updatedAt">> = [
      // Testing Patterns
      {
        category: "testing-pattern",
        title: "Form Validation Testing",
        content: "Always test form validation with: empty values, minimum/maximum lengths, invalid formats (email, phone), special characters, SQL injection attempts, XSS payloads.",
        tags: ["forms", "validation", "security"],
        source: "system",
        confidence: 0.95,
      },
      {
        category: "testing-pattern",
        title: "Navigation Flow Testing",
        content: "Test browser back/forward buttons, deep linking, bookmark functionality, and state preservation when navigating between pages.",
        tags: ["navigation", "routing", "ux"],
        source: "system",
        confidence: 0.9,
      },
      {
        category: "testing-pattern",
        title: "Error State Testing",
        content: "Verify error handling for: network failures, API timeouts, 4xx/5xx responses, empty states, and loading states.",
        tags: ["errors", "api", "resilience"],
        source: "system",
        confidence: 0.95,
      },

      // Bug Patterns
      {
        category: "bug-pattern",
        title: "Race Condition in Form Submit",
        content: "Multiple rapid clicks on submit button causing duplicate submissions. Solution: Disable button on first click or implement debouncing.",
        tags: ["forms", "race-condition", "ux"],
        source: "system",
        confidence: 0.9,
      },
      {
        category: "bug-pattern",
        title: "Memory Leak in Event Listeners",
        content: "Components adding event listeners without cleanup cause memory leaks. Look for scroll, resize, and custom events not being removed on unmount.",
        tags: ["memory", "performance", "react"],
        source: "system",
        confidence: 0.85,
      },
      {
        category: "bug-pattern",
        title: "Z-Index Stacking Issues",
        content: "Dropdowns, modals, or tooltips appearing behind other elements. Common with multiple overlapping UI components.",
        tags: ["css", "ui", "modal"],
        source: "system",
        confidence: 0.9,
      },

      // UX Guidelines
      {
        category: "ux-guideline",
        title: "Touch Target Size",
        content: "Interactive elements should be at least 44x44 pixels for accessibility. Smaller targets cause frustration on mobile devices.",
        tags: ["accessibility", "mobile", "touch"],
        source: "system",
        confidence: 0.95,
      },
      {
        category: "ux-guideline",
        title: "Loading State Feedback",
        content: "Always show loading indicators for operations > 300ms. Use skeleton screens for content loading, spinners for actions.",
        tags: ["loading", "feedback", "ux"],
        source: "system",
        confidence: 0.9,
      },
      {
        category: "ux-guideline",
        title: "Error Message Clarity",
        content: "Error messages should: explain what happened, be in plain language, suggest how to fix it, and appear near the related input.",
        tags: ["errors", "forms", "ux"],
        source: "system",
        confidence: 0.95,
      },

      // Accessibility
      {
        category: "accessibility",
        title: "Focus Management",
        content: "Interactive elements must be keyboard-focusable. Focus should be visible and follow logical order. Modals should trap focus.",
        tags: ["keyboard", "focus", "a11y"],
        source: "system",
        confidence: 0.95,
      },
      {
        category: "accessibility",
        title: "Color Contrast Requirements",
        content: "WCAG 2.1 requires 4.5:1 contrast for normal text, 3:1 for large text. Never use color alone to convey information.",
        tags: ["color", "wcag", "a11y"],
        source: "system",
        confidence: 0.95,
      },
      {
        category: "accessibility",
        title: "Screen Reader Compatibility",
        content: "All images need alt text. Use semantic HTML (headings, lists, buttons). ARIA labels for custom components.",
        tags: ["screen-reader", "aria", "a11y"],
        source: "system",
        confidence: 0.95,
      },

      // Platform Quirks
      {
        category: "platform-quirk",
        title: "Safari Date Input",
        content: "Safari on iOS has limited date input support. Consider using a custom date picker for consistent cross-browser experience.",
        tags: ["safari", "ios", "forms"],
        source: "system",
        confidence: 0.85,
      },
      {
        category: "platform-quirk",
        title: "Firefox Flexbox Gap",
        content: "Older Firefox versions don't support gap property in flexbox. Use margins as fallback.",
        tags: ["firefox", "css", "flexbox"],
        source: "system",
        confidence: 0.8,
      },

      // Fix Suggestions
      {
        category: "fix-suggestion",
        title: "Debounce Rapid Clicks",
        content: "Use lodash debounce or a custom implementation to prevent multiple rapid clicks from causing issues. Typical delay: 300ms.",
        tags: ["debounce", "clicks", "forms"],
        source: "system",
        confidence: 0.9,
      },
      {
        category: "fix-suggestion",
        title: "Optimistic UI Updates",
        content: "For better perceived performance, update UI immediately and revert on error. Show subtle loading indicator for confirmation.",
        tags: ["performance", "ux", "api"],
        source: "system",
        confidence: 0.85,
      },
    ];

    // Add all default knowledge entries
    for (const entry of defaultKnowledge) {
      const fullEntry: KnowledgeEntry = {
        ...entry,
        id: crypto.randomUUID(),
        embedding: undefined,
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.entries.set(fullEntry.id, fullEntry);
    }
  }

  // ========================
  // Learning from Testing
  // ========================

  /**
   * Learn a new pattern from bug discoveries
   */
  async learnFromBug(
    bugTitle: string,
    bugDescription: string,
    reproSteps: string[],
    category: KnowledgeCategory = "bug-pattern"
  ): Promise<KnowledgeEntry> {
    return this.addEntry({
      category,
      title: bugTitle,
      content: `${bugDescription}\n\nReproduction: ${reproSteps.join(" → ")}`,
      tags: ["learned", "auto-generated"],
      source: "learned",
      confidence: 0.7, // Lower confidence for auto-learned patterns
    });
  }

  /**
   * Get knowledge relevant to a specific testing context
   */
  async getContextualKnowledge(
    context: {
      url?: string;
      platform?: string;
      agentPersona?: string;
      currentAction?: string;
    }
  ): Promise<KnowledgeEntry[]> {
    const queries: string[] = [];

    if (context.currentAction) {
      queries.push(context.currentAction);
    }
    if (context.platform) {
      queries.push(context.platform);
    }

    const searchQuery = queries.join(" ");
    if (!searchQuery) {
      return [];
    }

    return this.search({
      query: searchQuery,
      limit: 5,
      minConfidence: 0.7,
    });
  }
}

// Singleton instance
let knowledgeBase: KnowledgeBase | null = null;

export function getKnowledgeBase(): KnowledgeBase {
  if (!knowledgeBase) {
    knowledgeBase = new KnowledgeBase();
  }
  return knowledgeBase;
}
