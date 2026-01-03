// ===========================================
// 🚀 REQUEST CACHING SYSTEM
// SWR-style caching for ultra-fast data fetching
// ===========================================

type CacheEntry<T> = {
  data: T;
  timestamp: number;
  ttl: number;
};

/**
 * In-memory request cache with TTL support
 */
class RequestCacheImpl {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private pendingRequests: Map<string, Promise<unknown>> = new Map();

  /**
   * Get cached data if valid
   */
  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.data as T;
  }

  /**
   * Set cache data with TTL (default: 5 minutes)
   */
  set<T>(key: string, data: T, ttl: number = 300000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Delete cache entry
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Deduplicate in-flight requests
   */
  async dedupe<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    // Check for pending request
    const pending = this.pendingRequests.get(key);
    if (pending) {
      return pending as Promise<T>;
    }

    // Create new request
    const promise = fetcher().finally(() => {
      this.pendingRequests.delete(key);
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  /**
   * Get cached or fetch fresh data (SWR pattern)
   */
  async getOrFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: { ttl?: number; revalidate?: boolean } = {}
  ): Promise<T> {
    const { ttl = 300000, revalidate = false } = options;

    // Return cached if valid
    const cached = this.get<T>(key);
    if (cached && !revalidate) {
      return cached;
    }

    // Fetch fresh data
    const data = await this.dedupe(key, fetcher);
    this.set(key, data, ttl);
    return data;
  }

  /**
   * Prefetch data for future use
   */
  async prefetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number
  ): Promise<void> {
    // Don't prefetch if already cached
    if (this.get<T>(key)) return;

    try {
      const data = await fetcher();
      this.set(key, data, ttl);
    } catch {
      // Silently fail prefetch - it's optimistic
    }
  }

  /**
   * Invalidate cache entries by prefix
   */
  invalidateByPrefix(prefix: string): void {
    const keysToDelete: string[] = [];
    this.cache.forEach((_, key) => {
      if (key.startsWith(prefix)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach((key) => this.cache.delete(key));
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Singleton export
export const RequestCache = new RequestCacheImpl();

/**
 * Create a cache key from URL and params
 */
export function createCacheKey(
  url: string,
  params?: Record<string, unknown>
): string {
  const base = url.replace(/^https?:\/\/[^/]+/, "");
  if (!params) return base;
  return `${base}?${JSON.stringify(params)}`;
}

/**
 * HOC for caching fetch requests
 */
export function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
): () => Promise<T> {
  return () => RequestCache.getOrFetch(key, fetcher, { ttl });
}

/**
 * Invalidate cache for a specific key or prefix
 */
export function invalidateCache(keyOrPrefix: string, isPrefix = false): void {
  if (isPrefix) {
    RequestCache.invalidateByPrefix(keyOrPrefix);
  } else {
    RequestCache.delete(keyOrPrefix);
  }
}

/**
 * Preload data into cache
 */
export async function preloadData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
): Promise<void> {
  await RequestCache.prefetch(key, fetcher, ttl);
}

// ===========================================
// BROWSER CACHE API UTILITIES
// ===========================================

/**
 * Store response in Cache API for offline support
 */
export async function cacheResponse(
  request: Request,
  response: Response,
  cacheName: string = "betaforge-v1"
): Promise<void> {
  if (typeof caches === "undefined") return;

  const cache = await caches.open(cacheName);
  await cache.put(request, response.clone());
}

/**
 * Get cached response from Cache API
 */
export async function getCachedResponse(
  request: Request,
  cacheName: string = "betaforge-v1"
): Promise<Response | undefined> {
  if (typeof caches === "undefined") return undefined;

  const cache = await caches.open(cacheName);
  return await cache.match(request);
}
