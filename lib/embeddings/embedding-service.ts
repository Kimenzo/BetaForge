// ========================
// Unified Embedding Service
// ========================
// Automatically selects the best available provider with fallback
// Priority: Ollama (free) -> Jina (free tier) -> OpenAI (paid)

import type { EmbeddingProviderType } from './types';
import { createOllamaProvider, OllamaEmbeddingProvider } from './providers/ollama';
import { createJinaProvider, JinaEmbeddingProvider } from './providers/jina';
import { createOpenAIProvider, OpenAIEmbeddingProvider } from './providers/openai';

type ProviderInstance = OllamaEmbeddingProvider | JinaEmbeddingProvider | OpenAIEmbeddingProvider;

export interface EmbeddingServiceConfig {
  preferredProvider?: EmbeddingProviderType;
  enableFallback?: boolean;
  cacheEnabled?: boolean;
}

export class EmbeddingService {
  private providers: Map<string, ProviderInstance> = new Map();
  private activeProvider: ProviderInstance | null = null;
  private config: EmbeddingServiceConfig;
  private cache: Map<string, number[]> = new Map();
  private initialized = false;

  constructor(config: EmbeddingServiceConfig = {}) {
    this.config = {
      enableFallback: true,
      cacheEnabled: true,
      ...config,
    };

    // Initialize all providers
    this.providers.set('ollama', createOllamaProvider());
    this.providers.set('jina', createJinaProvider());
    this.providers.set('openai', createOpenAIProvider());
  }

  /**
   * Initialize and select the best available provider
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    // Priority order (cheapest first)
    const priorityOrder: EmbeddingProviderType[] = this.config.preferredProvider
      ? [this.config.preferredProvider, 'ollama', 'jina', 'openai']
      : ['ollama', 'jina', 'openai'];

    for (const providerName of priorityOrder) {
      const provider = this.providers.get(providerName);
      if (provider && await provider.isAvailable()) {
        this.activeProvider = provider;
        console.log(`[EmbeddingService] Using provider: ${provider.name}`);
        this.initialized = true;
        return;
      }
    }

    throw new Error(
      'No embedding provider available. Configure one of:\n' +
      '- OLLAMA_BASE_URL (free, local)\n' +
      '- JINA_API_KEY (free tier: 1M tokens)\n' +
      '- OPENAI_API_KEY (paid: $0.02/1M tokens)'
    );
  }

  /**
   * Get the active provider name
   */
  getActiveProvider(): string {
    return this.activeProvider?.name || 'none';
  }

  /**
   * Get embedding dimensions for the active provider
   */
  getDimensions(): number {
    return this.activeProvider?.getDimensions() || 1024;
  }

  /**
   * Generate embedding for a single text
   */
  async embed(text: string): Promise<number[]> {
    await this.initialize();

    // Check cache first
    const cacheKey = this.getCacheKey(text);
    if (this.config.cacheEnabled && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const result = await this.activeProvider!.generateEmbedding(text);
      
      // Cache the result
      if (this.config.cacheEnabled) {
        this.cache.set(cacheKey, result.embedding);
      }

      return result.embedding;
    } catch (error) {
      // Try fallback if enabled
      if (this.config.enableFallback) {
        return this.embedWithFallback(text);
      }
      throw error;
    }
  }

  /**
   * Generate embeddings for multiple texts (batch)
   */
  async embedBatch(texts: string[]): Promise<number[][]> {
    await this.initialize();

    // Check cache for each text
    const results: (number[] | null)[] = texts.map(text => {
      const cacheKey = this.getCacheKey(text);
      return this.config.cacheEnabled && this.cache.has(cacheKey)
        ? this.cache.get(cacheKey)!
        : null;
    });

    // Find texts that need embedding
    const uncachedIndices: number[] = [];
    const uncachedTexts: string[] = [];
    texts.forEach((text, i) => {
      if (results[i] === null) {
        uncachedIndices.push(i);
        uncachedTexts.push(text);
      }
    });

    if (uncachedTexts.length > 0) {
      const newEmbeddings = await this.activeProvider!.generateBatchEmbeddings(uncachedTexts);
      
      // Merge results and cache
      newEmbeddings.forEach((result, i) => {
        const originalIndex = uncachedIndices[i];
        results[originalIndex] = result.embedding;
        
        if (this.config.cacheEnabled) {
          this.cache.set(this.getCacheKey(texts[originalIndex]), result.embedding);
        }
      });
    }

    return results as number[][];
  }

  /**
   * Calculate cosine similarity between two embeddings
   */
  cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Embeddings must have same dimensions');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Find most similar embeddings from a list
   */
  findSimilar(
    queryEmbedding: number[],
    candidates: { id: string; embedding: number[] }[],
    topK: number = 5,
    threshold: number = 0.7
  ): { id: string; similarity: number }[] {
    const scored = candidates.map(candidate => ({
      id: candidate.id,
      similarity: this.cosineSimilarity(queryEmbedding, candidate.embedding),
    }));

    return scored
      .filter(item => item.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  }

  /**
   * Try fallback providers
   */
  private async embedWithFallback(text: string): Promise<number[]> {
    const fallbackOrder: EmbeddingProviderType[] = ['jina', 'openai', 'ollama'];
    
    for (const providerName of fallbackOrder) {
      if (providerName === this.activeProvider?.name) continue;
      
      const provider = this.providers.get(providerName);
      if (provider && await provider.isAvailable()) {
        try {
          console.log(`[EmbeddingService] Falling back to ${providerName}`);
          const result = await provider.generateEmbedding(text);
          return result.embedding;
        } catch {
          continue;
        }
      }
    }

    throw new Error('All embedding providers failed');
  }

  private getCacheKey(text: string): string {
    // Simple hash for cache key
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `${this.activeProvider?.name}:${hash}`;
  }

  /**
   * Clear the embedding cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; provider: string } {
    return {
      size: this.cache.size,
      provider: this.activeProvider?.name || 'none',
    };
  }
}

// Singleton instance
let embeddingService: EmbeddingService | null = null;

export function getEmbeddingService(): EmbeddingService {
  if (!embeddingService) {
    embeddingService = new EmbeddingService();
  }
  return embeddingService;
}
