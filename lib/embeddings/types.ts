// ========================
// Embedding Types
// ========================

export type EmbeddingProviderType = 'ollama' | 'jina' | 'openai';

export interface EmbeddingConfig {
  provider: EmbeddingProviderType;
  model?: string;
  apiKey?: string;
  baseUrl?: string;
  dimensions?: number;
}

export interface EmbeddingResult {
  embedding: number[];
  model: string;
  provider: EmbeddingProviderType;
  tokensUsed?: number;
  latencyMs: number;
}

export interface EmbeddingProvider {
  name: string;
  generateEmbedding(text: string): Promise<EmbeddingResult>;
  generateBatchEmbeddings(texts: string[]): Promise<EmbeddingResult[]>;
  getDimensions(): number;
  isAvailable(): Promise<boolean>;
}

export interface EmbeddingUsage {
  provider: string;
  tokensUsed: number;
  cost: number;
  timestamp: Date;
}
