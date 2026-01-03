"use client";

// ============================================================================
// API Client Hook
// ============================================================================
// Type-safe API client with:
// - Automatic error handling
// - Loading states
// - Retry logic
// - Request deduplication
// - Optimistic updates
// ============================================================================

import { useState, useCallback, useRef, useEffect } from "react";

// ============================================================================
// Types
// ============================================================================

export interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
    requestId?: string;
    processingTime?: number;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    requestId?: string;
    details?: Record<string, unknown>;
    timestamp: string;
  };
}

export type ApiResult<T> = ApiResponse<T> | ApiError;

export interface UseApiOptions {
  /** Enable automatic retries on failure */
  retry?: boolean;
  /** Number of retry attempts */
  retryCount?: number;
  /** Delay between retries in ms */
  retryDelay?: number;
  /** Cache the response */
  cache?: boolean;
  /** Cache TTL in seconds */
  cacheTTL?: number;
  /** Dedupe identical requests */
  dedupe?: boolean;
}

export interface ApiState<T> {
  data: T | null;
  error: ApiError["error"] | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
}

// ============================================================================
// Request Cache & Deduplication
// ============================================================================

const requestCache = new Map<string, { data: unknown; timestamp: number }>();
const inflightRequests = new Map<string, Promise<unknown>>();

function getCacheKey(url: string, options?: RequestInit): string {
  const method = options?.method || "GET";
  const body = options?.body || "";
  return `${method}:${url}:${body}`;
}

function getFromCache<T>(key: string, ttl: number): T | null {
  const cached = requestCache.get(key);
  if (cached && Date.now() - cached.timestamp < ttl * 1000) {
    return cached.data as T;
  }
  return null;
}

function setCache(key: string, data: unknown): void {
  requestCache.set(key, { data, timestamp: Date.now() });
}

// ============================================================================
// Core Fetch Function
// ============================================================================

async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
  apiOptions: UseApiOptions = {}
): Promise<ApiResult<T>> {
  const { retry = true, retryCount = 3, retryDelay = 1000, cache = false, cacheTTL = 60, dedupe = true } = apiOptions;

  const cacheKey = getCacheKey(url, options);

  // Check cache for GET requests
  if (cache && (!options.method || options.method === "GET")) {
    const cached = getFromCache<ApiResult<T>>(cacheKey, cacheTTL);
    if (cached) return cached;
  }

  // Check for inflight request (deduplication)
  if (dedupe && inflightRequests.has(cacheKey)) {
    return inflightRequests.get(cacheKey) as Promise<ApiResult<T>>;
  }

  const fetchWithRetry = async (attempt: number): Promise<ApiResult<T>> => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        // Server returned an error response
        const apiError: ApiError = {
          success: false,
          error: result.error || {
            code: `HTTP_${response.status}`,
            message: result.message || response.statusText,
            timestamp: new Date().toISOString(),
          },
        };

        // Don't retry client errors (4xx)
        if (response.status >= 400 && response.status < 500) {
          return apiError;
        }

        // Retry server errors (5xx)
        if (retry && attempt < retryCount) {
          await new Promise((r) => setTimeout(r, retryDelay * attempt));
          return fetchWithRetry(attempt + 1);
        }

        return apiError;
      }

      // Cache successful GET responses
      if (cache && (!options.method || options.method === "GET")) {
        setCache(cacheKey, result);
      }

      return result as ApiResult<T>;
    } catch (error) {
      // Network error
      if (retry && attempt < retryCount) {
        await new Promise((r) => setTimeout(r, retryDelay * attempt));
        return fetchWithRetry(attempt + 1);
      }

      return {
        success: false,
        error: {
          code: "NETWORK_ERROR",
          message: error instanceof Error ? error.message : "Network request failed",
          timestamp: new Date().toISOString(),
        },
      };
    }
  };

  // Store inflight request for deduplication
  const promise = fetchWithRetry(1);
  if (dedupe) {
    inflightRequests.set(cacheKey, promise);
    promise.finally(() => inflightRequests.delete(cacheKey));
  }

  return promise;
}

// ============================================================================
// useApi Hook
// ============================================================================

export function useApi<T>(
  url: string,
  options: RequestInit = {},
  apiOptions: UseApiOptions = {}
) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    error: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(async (overrideOptions?: RequestInit) => {
    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setState((prev) => ({
      ...prev,
      isLoading: true,
      isError: false,
      isSuccess: false,
    }));

    const result = await apiFetch<T>(
      url,
      {
        ...options,
        ...overrideOptions,
        signal: abortControllerRef.current.signal,
      },
      apiOptions
    );

    if (result.success) {
      setState({
        data: result.data,
        error: null,
        isLoading: false,
        isError: false,
        isSuccess: true,
      });
      return result.data;
    } else {
      setState({
        data: null,
        error: result.error,
        isLoading: false,
        isError: true,
        isSuccess: false,
      });
      return null;
    }
  }, [url, options, apiOptions]);

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      isError: false,
      isSuccess: false,
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return {
    ...state,
    execute,
    reset,
    refetch: execute,
  };
}

// ============================================================================
// Convenience Hooks
// ============================================================================

export function useApiQuery<T>(
  url: string,
  options: UseApiOptions = {}
) {
  const { execute, ...state } = useApi<T>(url, { method: "GET" }, options);

  // Auto-fetch on mount
  useEffect(() => {
    execute();
  }, [execute]);

  return { ...state, refetch: execute };
}

export function useApiMutation<TInput, TOutput>(
  url: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST"
) {
  const [state, setState] = useState<ApiState<TOutput>>({
    data: null,
    error: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
  });

  const mutate = useCallback(
    async (data?: TInput) => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        isError: false,
        isSuccess: false,
      }));

      const result = await apiFetch<TOutput>(
        url,
        {
          method,
          body: data ? JSON.stringify(data) : undefined,
        },
        { retry: false }
      );

      if (result.success) {
        setState({
          data: result.data,
          error: null,
          isLoading: false,
          isError: false,
          isSuccess: true,
        });
        return result.data;
      } else {
        setState({
          data: null,
          error: result.error,
          isLoading: false,
          isError: true,
          isSuccess: false,
        });
        return null;
      }
    },
    [url, method]
  );

  return { ...state, mutate };
}

// ============================================================================
// API Client Instance
// ============================================================================

export const api = {
  get: <T>(url: string, options?: UseApiOptions) => apiFetch<T>(url, { method: "GET" }, options),
  post: <T>(url: string, data?: unknown, options?: UseApiOptions) =>
    apiFetch<T>(url, { method: "POST", body: JSON.stringify(data) }, options),
  put: <T>(url: string, data?: unknown, options?: UseApiOptions) =>
    apiFetch<T>(url, { method: "PUT", body: JSON.stringify(data) }, options),
  patch: <T>(url: string, data?: unknown, options?: UseApiOptions) =>
    apiFetch<T>(url, { method: "PATCH", body: JSON.stringify(data) }, options),
  delete: <T>(url: string, options?: UseApiOptions) => apiFetch<T>(url, { method: "DELETE" }, options),
};
