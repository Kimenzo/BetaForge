// ========================
// OpenAI Embedding Provider
// ========================
// CHEAPEST PAID: $0.02 per 1M tokens (text-embedding-3-small)
// Models: text-embedding-3-small (1536), text-embedding-3-large (3072)
// Best quality-to-cost ratio in the industry

import type { EmbeddingResult } from "../types";

export interface OpenAIEmbedConfig {
  apiKey?: string;
  model?: string;
  dimensions?: number;
}

const DEFAULT_CONFIG: OpenAIEmbedConfig = {
  apiKey: process.env.OPENAI_API_KEY,
  model: process.env.OPENAI_EMBED_MODEL || "text-embedding-3-small",
  dimensions: 1536,
};

// Model dimensions (can be customized for v3 models)
const MODEL_DIMENSIONS: Record<string, number> = {
  "text-embedding-3-small": 1536,
  "text-embedding-3-large": 3072,
  "text-embedding-ada-002": 1536,
};

export class OpenAIEmbeddingProvider {
  name = "openai";
  private config: OpenAIEmbedConfig;

  constructor(config: Partial<OpenAIEmbedConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  getDimensions(): number {
    return (
      this.config.dimensions || MODEL_DIMENSIONS[this.config.model!] || 1536
    );
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
      throw new Error("OpenAI API key not configured");
    }

    const start = Date.now();

    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        input: texts,
        dimensions: this.config.dimensions,
      }),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: { message: response.statusText } }));
      throw new Error(
        `OpenAI embedding failed: ${
          error.error?.message || response.statusText
        }`
      );
    }

    const data = await response.json();
    const latencyMs = Date.now() - start;

    return data.data.map((item: { embedding: number[]; index: number }) => ({
      embedding: item.embedding,
      model: this.config.model!,
      provider: "openai" as const,
      tokensUsed: data.usage?.total_tokens,
      latencyMs,
    }));
  }
}

export function createOpenAIProvider(
  config?: Partial<OpenAIEmbedConfig>
): OpenAIEmbeddingProvider {
  return new OpenAIEmbeddingProvider(config);
}
