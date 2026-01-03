// ========================
// Jina AI Embedding Provider
// ========================
// FREE TIER: 1 Million tokens (no credit card required!)
// Models: jina-embeddings-v3 (best), jina-embeddings-v2-base-en
// Dimensions: 1024 (v3), 768 (v2)
// Sign up: https://jina.ai/embeddings/

import type { EmbeddingResult } from '../types';

export interface JinaConfig {
  apiKey?: string;
  model?: string;
}

const DEFAULT_CONFIG: JinaConfig = {
  apiKey: process.env.JINA_API_KEY,
  model: process.env.JINA_EMBED_MODEL || 'jina-embeddings-v3',
};

// Model dimensions
const MODEL_DIMENSIONS: Record<string, number> = {
  'jina-embeddings-v3': 1024,
  'jina-embeddings-v2-base-en': 768,
  'jina-embeddings-v2-small-en': 512,
};

export class JinaEmbeddingProvider {
  name = 'jina';
  private config: JinaConfig;

  constructor(config: Partial<JinaConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  getDimensions(): number {
    return MODEL_DIMENSIONS[this.config.model!] || 1024;
  }

  async isAvailable(): Promise<boolean> {
    return !!this.config.apiKey;
  }

  async generateEmbedding(text: string): Promise<EmbeddingResult> {
    const results = await this.generateBatchEmbeddings([text]);
    return results[0];
  }

  async generateBatchEmbeddings(texts: string[]): Promise<EmbeddingResult[]> {
    if (!this.config.apiKey) {
      throw new Error('Jina API key not configured. Get free key at https://jina.ai/embeddings/');
    }

    const start = Date.now();

    const response = await fetch('https://api.jina.ai/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        input: texts,
        normalized: true,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(`Jina embedding failed: ${error.detail || response.statusText}`);
    }

    const data = await response.json();
    const latencyMs = Date.now() - start;

    return data.data.map((item: { embedding: number[]; index: number }) => ({
      embedding: item.embedding,
      model: this.config.model!,
      provider: 'jina' as const,
      tokensUsed: data.usage?.total_tokens,
      latencyMs,
    }));
  }
}

export function createJinaProvider(config?: Partial<JinaConfig>): JinaEmbeddingProvider {
  return new JinaEmbeddingProvider(config);
}
