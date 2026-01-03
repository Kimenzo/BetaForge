// ========================
// Embedding Health Check API
// ========================
// GET /api/embeddings/health - Check embedding provider status
// POST /api/embeddings/test - Test embedding generation

import { NextResponse } from "next/server";
import { getEmbeddingService } from "@/lib/embeddings";
import { getVectorStore } from "@/lib/datastores";

export async function GET() {
  try {
    const embeddingService = getEmbeddingService();
    const vectorStore = getVectorStore();

    // Try to initialize
    await embeddingService.initialize();

    const stats = embeddingService.getCacheStats();
    const health = await vectorStore.healthCheck();

    return NextResponse.json({
      status: "ok",
      embeddingProvider: stats.provider,
      cacheSize: stats.size,
      vectorStore: health.message,
      latencyMs: health.latencyMs,
      availableProviders: {
        ollama: "Free - Local (requires Ollama running)",
        jina: "Free tier - 1M tokens (set JINA_API_KEY)",
        openai: "$0.02/1M tokens (set OPENAI_API_KEY)",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        setup: {
          ollama:
            "Install from https://ollama.ai, run: ollama pull nomic-embed-text",
          jina: "Get free API key from https://jina.ai/embeddings/",
          openai: "Get API key from https://platform.openai.com/api-keys",
        },
      },
      { status: 503 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Missing 'text' field in request body" },
        { status: 400 }
      );
    }

    const embeddingService = getEmbeddingService();
    await embeddingService.initialize();

    const startTime = Date.now();
    const embedding = await embeddingService.embed(text);
    const latencyMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      provider: embeddingService.getActiveProvider(),
      dimensions: embedding.length,
      latencyMs,
      // Show first 10 values as preview
      embeddingPreview: embedding.slice(0, 10),
      text: text.substring(0, 100) + (text.length > 100 ? "..." : ""),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
