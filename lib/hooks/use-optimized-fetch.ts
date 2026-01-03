// ===========================================
// 🚀 OPTIMIZED DATA FETCHING HOOKS
// SWR-style caching with automatic revalidation
// ===========================================

"use client";

import { useState, useEffect, useCallback, useRef, useMemo, useTransition } from "react";
import { RequestCache, createCacheKey } from "@/lib/performance/cache";

interface FetchState<T> {
  data: T | undefined;
  error: Error | undefined;
  isLoading: boolean;
  isValidating: boolean;
}

interface UseFetchOptions {
  /** Time to live in milliseconds (default: 5 minutes) */
  ttl?: number;
  /** Revalidate on mount */
  revalidateOnMount?: boolean;
  /** Revalidate on focus */
  revalidateOnFocus?: boolean;
  /** Revalidate on reconnect */
  revalidateOnReconnect?: boolean;
  /** Polling interval in ms (0 = disabled) */
  refreshInterval?: number;
  /** Dedupe requests within this window (ms) */
  dedupingInterval?: number;
  /** Initial data for SSR */
  initialData?: unknown;
}

const DEFAULT_OPTIONS: Required<UseFetchOptions> = {
  ttl: 300000, // 5 minutes
  revalidateOnMount: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  refreshInterval: 0,
  dedupingInterval: 2000,
  initialData: undefined,
};

/**
 * Ultra-optimized fetch hook with SWR-style caching
 */
export function useOptimizedFetch<T>(
  url: string | null,
  options: UseFetchOptions = {}
): FetchState<T> & {
  mutate: (data?: T) => Promise<void>;
  revalidate: () => Promise<void>;
} {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const cacheKey = url ? createCacheKey(url) : null;

  const [state, setState] = useState<FetchState<T>>(() => ({
    data: (opts.initialData as T) ?? (cacheKey ? RequestCache.get<T>(cacheKey) : undefined),
    error: undefined,
    isLoading: !opts.initialData && !RequestCache.get(cacheKey ?? ""),
    isValidating: false,
  }));

  const [isPending, startTransition] = useTransition();
  const mountedRef = useRef(true);
  const lastFetchRef = useRef<number>(0);

  const fetchData = useCallback(async (isRevalidation = false) => {
    if (!url || !cacheKey) return;

    // Dedupe check
    const now = Date.now();
    if (now - lastFetchRef.current < opts.dedupingInterval) {
      return;
    }
    lastFetchRef.current = now;

    // Set loading/validating state
    if (!isRevalidation) {
      setState((prev) => ({ ...prev, isLoading: true }));
    } else {
      setState((prev) => ({ ...prev, isValidating: true }));
    }

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      // Cache the result
      RequestCache.set(cacheKey, data, opts.ttl);

      // Update state with transition for smooth UI
      if (mountedRef.current) {
        startTransition(() => {
          setState({
            data,
            error: undefined,
            isLoading: false,
            isValidating: false,
          });
        });
      }
    } catch (error) {
      if (mountedRef.current) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error : new Error("Unknown error"),
          isLoading: false,
          isValidating: false,
        }));
      }
    }
  }, [url, cacheKey, opts.ttl, opts.dedupingInterval]);

  const revalidate = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  const mutate = useCallback(async (newData?: T) => {
    if (!cacheKey) return;
    
    if (newData !== undefined) {
      RequestCache.set(cacheKey, newData, opts.ttl);
      setState((prev) => ({ ...prev, data: newData }));
    } else {
      await revalidate();
    }
  }, [cacheKey, opts.ttl, revalidate]);

  // Initial fetch
  useEffect(() => {
    mountedRef.current = true;
    
    if (opts.revalidateOnMount) {
      fetchData();
    }

    return () => {
      mountedRef.current = false;
    };
  }, [url]); // eslint-disable-line react-hooks/exhaustive-deps

  // Revalidate on focus
  useEffect(() => {
    if (!opts.revalidateOnFocus) return;

    const handleFocus = () => {
      if (document.visibilityState === "visible") {
        fetchData(true);
      }
    };

    document.addEventListener("visibilitychange", handleFocus);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleFocus);
      window.removeEventListener("focus", handleFocus);
    };
  }, [opts.revalidateOnFocus, fetchData]);

  // Revalidate on reconnect
  useEffect(() => {
    if (!opts.revalidateOnReconnect) return;

    const handleOnline = () => fetchData(true);
    window.addEventListener("online", handleOnline);

    return () => window.removeEventListener("online", handleOnline);
  }, [opts.revalidateOnReconnect, fetchData]);

  // Polling interval
  useEffect(() => {
    if (!opts.refreshInterval || opts.refreshInterval <= 0) return;

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchData(true);
      }
    }, opts.refreshInterval);

    return () => clearInterval(interval);
  }, [opts.refreshInterval, fetchData]);

  return {
    ...state,
    mutate,
    revalidate,
  };
}

/**
 * Optimized hook for paginated data
 */
export function useOptimizedPagination<T>(
  baseUrl: string,
  options: UseFetchOptions & { pageSize?: number } = {}
) {
  const { pageSize = 20, ...fetchOptions } = options;
  const [page, setPage] = useState(1);

  const url = `${baseUrl}?page=${page}&limit=${pageSize}`;
  const result = useOptimizedFetch<{ data: T[]; total: number; hasMore: boolean }>(url, fetchOptions);

  const nextPage = useCallback(() => {
    setPage((p) => p + 1);
  }, []);

  const prevPage = useCallback(() => {
    setPage((p) => Math.max(1, p - 1));
  }, []);

  const goToPage = useCallback((newPage: number) => {
    setPage(Math.max(1, newPage));
  }, []);

  return {
    ...result,
    page,
    pageSize,
    nextPage,
    prevPage,
    goToPage,
    hasNextPage: result.data?.hasMore ?? false,
    hasPrevPage: page > 1,
  };
}

/**
 * Hook for infinite scroll with virtual list support
 */
export function useOptimizedInfiniteScroll<T>(
  baseUrl: string,
  options: UseFetchOptions & { pageSize?: number } = {}
) {
  const { pageSize = 20, ...fetchOptions } = options;
  const [pages, setPages] = useState<T[][]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const url = page === 1 ? `${baseUrl}?page=1&limit=${pageSize}` : null;
  const { data, isLoading, error, revalidate } = useOptimizedFetch<{ data: T[]; hasMore: boolean }>(
    url,
    fetchOptions
  );

  // Initialize first page
  useEffect(() => {
    if (data?.data) {
      setPages([data.data]);
      setHasMore(data.hasMore);
    }
  }, [data]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const response = await fetch(`${baseUrl}?page=${nextPage}&limit=${pageSize}`);
      const result = await response.json();
      
      setPages((prev) => [...prev, result.data]);
      setPage(nextPage);
      setHasMore(result.hasMore);
    } finally {
      setIsLoadingMore(false);
    }
  }, [baseUrl, pageSize, page, hasMore, isLoadingMore]);

  const allItems = useMemo(() => pages.flat(), [pages]);

  return {
    items: allItems,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    revalidate,
  };
}
