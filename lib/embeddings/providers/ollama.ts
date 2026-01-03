// ========================
// Ollama Embedding Provider
// ========================
// 100% FREE - Runs locally
// Models: nomic-embed-text, all-minilm, mxbai-embed-large
// Dimensions: 384-1024 depending on model

import type { EmbeddingResult } from "../types";

export interface OllamaConfig {
  baseUrl?: string;
  model?: string;
}

const DEFAULT_CONFIG: OllamaConfig = {
  baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  model: process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text",
};

// Model dimensions mapping
const MODEL_DIMENSIONS: Record<string, number> = {
  "nomic-embed-text": 768,
  "all-minilm": 384,
  "mxbai-embed-large": 1024,
  "snowflake-arctic-embed": 1024,
};

export class OllamaEmbeddingProvider {
  name = "ollama";
  private config: OllamaConfig;

  constructor(config: Partial<OllamaConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  getDimensions(): number {
    return MODEL_DIMENSIONS[this.config.model!] || 768;
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/tags`, {
        method: "GET",
        signal: AbortSignal.timeout(2000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async generateEmbedding(text: string): Promise<EmbeddingResult> {
    const start = Date.now();

    const response = await fetch(`${this.config.baseUrl}/api/embeddings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: this.config.model,
        prompt: text,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Ollama embedding failed: ${error}`);
    }

    const data = await response.json();

    return {
      embedding: data.embedding,
      model: this.config.model!,
      provider: "ollama",
      latencyMs: Date.now() - start,
    };
  }

  async generateBatchEmbeddings(texts: string[]): Promise<EmbeddingResult[]> {
    // Ollama doesn't support batch, so we parallelize
    return Promise.all(texts.map((text) => this.generateEmbedding(text)));
  }
}

export function createOllamaProvider(
  config?: Partial<OllamaConfig>
): OllamaEmbeddingProvider {
  return new OllamaEmbeddingProvider(config);
}
