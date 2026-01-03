// ========================
// Embedding Service
// ========================
// Multi-provider embedding generation with fallback support
// Providers ranked by cost (cheapest/free first):
// 1. Ollama (free, local)
// 2. Jina AI (free tier: 1M tokens)
// 3. OpenAI text-embedding-3-small ($0.02/1M tokens)

export * from './types';
export * from './providers';
export * from './embedding-service';
