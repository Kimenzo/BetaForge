// ============================================================================
// API Authentication - API Key Validation
// ============================================================================
// Validates API keys for programmatic access (CI/CD, CLI, webhooks)
// ============================================================================

import { NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase";
import crypto from "crypto";

export interface ApiKeyValidation {
  valid: boolean;
  userId?: string;
  projectId?: string;
  keyId?: string;
  scopes?: string[];
  error?: string;
}

/**
 * Validate an API key from the Authorization header
 * Supports: Bearer <api_key> or just <api_key>
 */
export async function validateApiKey(
  request: NextRequest
): Promise<ApiKeyValidation> {
  const authHeader = request.headers.get("authorization");
  const apiKeyHeader = request.headers.get("x-api-key");

  // Extract API key from header
  let apiKey: string | null = null;

  if (authHeader) {
    if (authHeader.startsWith("Bearer ")) {
      apiKey = authHeader.slice(7);
    } else {
      apiKey = authHeader;
    }
  } else if (apiKeyHeader) {
    apiKey = apiKeyHeader;
  }

  if (!apiKey) {
    return {
      valid: false,
      error: "Missing API key. Provide via Authorization header or X-API-Key header.",
    };
  }

  // Validate format (bf_live_xxx or bf_test_xxx)
  if (!apiKey.match(/^bf_(live|test)_[a-zA-Z0-9]{32,}$/)) {
    return {
      valid: false,
      error: "Invalid API key format. Expected: bf_live_xxx or bf_test_xxx",
    };
  }

  const isTestKey = apiKey.startsWith("bf_test_");

  // In development or with test keys, allow demo access
  if (isTestKey || process.env.NODE_ENV === "development") {
    // For test keys, return demo user access
    return {
      valid: true,
      userId: "demo-user-id",
      keyId: "demo-key-id",
      scopes: ["read", "write", "test"],
    };
  }

  // Production: validate against database
  const supabase = createServerClient();

  // Hash the key to compare against stored hash
  const keyHash = crypto.createHash("sha256").update(apiKey).digest("hex");

  const { data: keyData, error } = await supabase
    .from("api_keys")
    .select("id, user_id, project_id, scopes, is_active, expires_at")
    .eq("key_hash", keyHash)
    .single();

  if (error || !keyData) {
    return {
      valid: false,
      error: "Invalid or expired API key",
    };
  }

  // Check if key is active
  if (!keyData.is_active) {
    return {
      valid: false,
      error: "API key has been revoked",
    };
  }

  // Check expiration
  if (keyData.expires_at && new Date(keyData.expires_at) < new Date()) {
    return {
      valid: false,
      error: "API key has expired",
    };
  }

  // Update last used timestamp (fire and forget)
  supabase
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", keyData.id)
    .then(() => {});

  return {
    valid: true,
    userId: keyData.user_id,
    projectId: keyData.project_id ?? undefined,
    keyId: keyData.id,
    scopes: keyData.scopes || ["read"],
  };
}

/**
 * Generate a new API key
 * Returns the raw key (only shown once) and the hash for storage
 */
export function generateApiKey(
  type: "live" | "test" = "live"
): { key: string; hash: string } {
  // Generate 32 random bytes = 64 hex chars
  const randomBytes = crypto.randomBytes(32).toString("hex");
  const key = `bf_${type}_${randomBytes}`;
  const hash = crypto.createHash("sha256").update(key).digest("hex");

  return { key, hash };
}

/**
 * Verify webhook signature (HMAC-SHA256)
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  // Constant-time comparison to prevent timing attacks
  const expectedBuffer = Buffer.from(`sha256=${expectedSignature}`);
  const signatureBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== signatureBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
}

/**
 * Generate webhook signature for outbound webhooks
 */
export function generateWebhookSignature(
  payload: string,
  secret: string
): string {
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return `sha256=${signature}`;
}
