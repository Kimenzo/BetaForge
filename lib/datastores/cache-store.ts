// ========================
// Cache Store (Key-Value)
// ========================
// Purpose: Fast access to frequently used data, session state
// Use for: API response caching, session tokens, rate limiting
//
// "For beginners, prioritize vector, relational, and key-value
// as they cover most early use cases." - Ethan Ruhe
//
// Key-value stores are essential for:
// - Session management
// - Caching expensive computations
// - Rate limiting
// - Temporary data storage

import type {
  DataStore,
  HealthStatus,
  CacheEntry,
  CacheOptions,
} from "./types";

/**
 * In-Memory Cache Store
 *
 * In production, this would be backed by:
 * - Redis (most common)
 * - Memcached
 * - Supabase Edge Cache
 * - Vercel KV
 */
export class CacheStore implements DataStore {
  name = "memory-cache";
  type = "key-value" as const;

  private cache: Map<string, CacheEntry> = new Map();
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // Start cleanup interval for expired entries
    this.startCleanup();
  }

  async isConnected(): Promise<boolean> {
    return true;
  }

  async healthCheck(): Promise<HealthStatus> {
    return {
      healthy: true,
      latencyMs: 0,
      message: `${this.cache.size} items cached`,
    };
  }

  // ========================
  // Basic Operations
  // ========================

  async get<T = unknown>(key: string, namespace?: string): Promise<T | null> {
    const fullKey = this.buildKey(key, namespace);
    const entry = this.cache.get(fullKey);

    if (!entry) {
      return null;
    }

    // Check expiration
    if (entry.expiresAt && entry.expiresAt < new Date()) {
      this.cache.delete(fullKey);
      return null;
    }

    return entry.value as T;
  }

  async set<T = unknown>(
    key: string,
    value: T,
    options: CacheOptions = {}
  ): Promise<void> {
    const fullKey = this.buildKey(key, options.namespace);
    const now = new Date();

    const entry: CacheEntry<T> = {
      key: fullKey,
      value,
      ttlSeconds: options.ttlSeconds,
      createdAt: now,
      expiresAt: options.ttlSeconds
        ? new Date(now.getTime() + options.ttlSeconds * 1000)
        : undefined,
    };

    this.cache.set(fullKey, entry as CacheEntry);
  }

  async delete(key: string, namespace?: string): Promise<void> {
    const fullKey = this.buildKey(key, namespace);
    this.cache.delete(fullKey);
  }

  async exists(key: string, namespace?: string): Promise<boolean> {
    const value = await this.get(key, namespace);
    return value !== null;
  }

  // ========================
  // Advanced Operations
  // ========================

  /**
   * Get or compute a value (cache-aside pattern)
   */
  async getOrSet<T>(
    key: string,
    compute: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    const cached = await this.get<T>(key, options.namespace);
    if (cached !== null) {
      return cached;
    }

    const value = await compute();
    await this.set(key, value, options);
    return value;
  }

  /**
   * Increment a numeric value (useful for rate limiting)
   */
  async increment(
    key: string,
    amount: number = 1,
    options: CacheOptions = {}
  ): Promise<number> {
    const current = (await this.get<number>(key, options.namespace)) || 0;
    const newValue = current + amount;
    await this.set(key, newValue, options);
    return newValue;
  }

  /**
   * Set multiple keys at once
   */
  async mset(
    entries: Array<{ key: string; value: unknown }>,
    options: CacheOptions = {}
  ): Promise<void> {
    for (const entry of entries) {
      await this.set(entry.key, entry.value, options);
    }
  }

  /**
   * Get multiple keys at once
   */
  async mget<T = unknown>(
    keys: string[],
    namespace?: string
  ): Promise<Map<string, T>> {
    const results = new Map<string, T>();
    for (const key of keys) {
      const value = await this.get<T>(key, namespace);
      if (value !== null) {
        results.set(key, value);
      }
    }
    return results;
  }

  /**
   * Delete all keys matching a pattern (namespace)
   */
  async deleteByPattern(pattern: string): Promise<number> {
    let deleted = 0;
    for (const [key] of this.cache) {
      if (key.startsWith(pattern)) {
        this.cache.delete(key);
        deleted++;
      }
    }
    return deleted;
  }

  /**
   * Clear entire cache
   */
  async clear(): Promise<void> {
    this.cache.clear();
  }

  // ========================
  // Rate Limiting
  // ========================

  /**
   * Check rate limit using sliding window
   */
  async checkRateLimit(
    identifier: string,
    limit: number,
    windowSeconds: number
  ): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
    const key = `ratelimit:${identifier}`;
    const now = Date.now();
    const windowStart = now - windowSeconds * 1000;

    // Get current requests in window
    const requests = (await this.get<number[]>(key)) || [];

    // Filter to only include requests in current window
    const validRequests = requests.filter((ts) => ts > windowStart);

    const allowed = validRequests.length < limit;
    const remaining = Math.max(
      0,
      limit - validRequests.length - (allowed ? 1 : 0)
    );
    const resetAt = new Date(windowStart + windowSeconds * 1000);

    if (allowed) {
      validRequests.push(now);
      await this.set(key, validRequests, { ttlSeconds: windowSeconds });
    }

    return { allowed, remaining, resetAt };
  }

  // ========================
  // Session Management
  // ========================

  /**
   * Store session data
   */
  async setSession<T extends Record<string, unknown>>(
    sessionId: string,
    data: T,
    ttlSeconds: number = 3600
  ): Promise<void> {
    await this.set(sessionId, data, {
      namespace: "session",
      ttlSeconds,
    });
  }

  async getSession<T extends Record<string, unknown>>(
    sessionId: string
  ): Promise<T | null> {
    return this.get<T>(sessionId, "session");
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.delete(sessionId, "session");
  }

  // ========================
  // Internal Helpers
  // ========================

  private buildKey(key: string, namespace?: string): string {
    return namespace ? `${namespace}:${key}` : key;
  }

  private startCleanup(): void {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => {
      const now = new Date();
      for (const [key, entry] of this.cache) {
        if (entry.expiresAt && entry.expiresAt < now) {
          this.cache.delete(key);
        }
      }
    }, 60000);
  }

  /**
   * Stop cleanup (for graceful shutdown)
   */
  stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

// Singleton instance
let cacheStore: CacheStore | null = null;

export function getCacheStore(): CacheStore {
  if (!cacheStore) {
    cacheStore = new CacheStore();
  }
  return cacheStore;
}
