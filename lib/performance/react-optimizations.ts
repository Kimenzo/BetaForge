// ===========================================
// 🚀 REACT PERFORMANCE OPTIMIZATIONS
// Memoization, stable callbacks, and more
// ===========================================

"use client";

import {
  useCallback,
  useRef,
  useMemo,
  useState,
  useEffect,
  createContext,
  useContext,
  memo,
  type ComponentType,
  type Context,
  type ReactNode,
  useDeferredValue as useReactDeferredValue,
} from "react";

/**
 * Deep comparison memo wrapper
 * Use for complex objects that need deep equality checks
 */
export function memoWithDeepCompare<P extends object>(
  Component: ComponentType<P>,
  displayName?: string
): ComponentType<P> {
  const MemoizedComponent = memo(Component, (prevProps, nextProps) => {
    return JSON.stringify(prevProps) === JSON.stringify(nextProps);
  });

  MemoizedComponent.displayName =
    displayName || `Memo(${Component.displayName || Component.name})`;

  return MemoizedComponent;
}

/**
 * Create an optimized context with automatic memoization
 * Prevents unnecessary re-renders from context updates
 */
export function createOptimizedContext<T>(
  defaultValue: T,
  displayName?: string
): {
  Provider: ComponentType<{ value: T; children: ReactNode }>;
  useContext: () => T;
} {
  const Context = createContext<T>(defaultValue);
  Context.displayName = displayName;

  const Provider: ComponentType<{ value: T; children: ReactNode }> = memo(
    ({ value, children }) => {
      const memoizedValue = useMemo(() => value, [JSON.stringify(value)]);
      return (
        <Context.Provider value={memoizedValue}>{children}</Context.Provider>
      );
    }
  );

  const useOptimizedContext = () => {
    const value = useContext(Context);
    if (value === undefined) {
      throw new Error(`useContext must be used within ${displayName}Provider`);
    }
    return value;
  };

  return {
    Provider,
    useContext: useOptimizedContext,
  };
}

/**
 * useStableCallback - Returns a stable callback reference
 * Prevents child components from re-rendering when callback changes
 */
export function useStableCallback<T extends (...args: never[]) => unknown>(
  callback: T
): T {
  const callbackRef = useRef<T>(callback);

  // Update ref on every render
  callbackRef.current = callback;

  // Return stable callback
  return useCallback(
    ((...args: Parameters<T>) => callbackRef.current(...args)) as T,
    []
  );
}

/**
 * Re-export React's useDeferredValue with better typing
 */
export function useDeferredValue<T>(value: T): T {
  return useReactDeferredValue(value);
}

/**
 * useThrottledValue - Throttle rapid value updates
 * Perfect for scroll/resize handlers, search inputs
 */
export function useThrottledValue<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdated = useRef<number>(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdated.current;

    if (timeSinceLastUpdate >= delay) {
      setThrottledValue(value);
      lastUpdated.current = now;
    } else {
      // Schedule update for remaining time
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setThrottledValue(value);
        lastUpdated.current = Date.now();
      }, delay - timeSinceLastUpdate);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, delay]);

  return throttledValue;
}

/**
 * useDebouncedValue - Debounce value updates
 * Perfect for search inputs, form validation
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * useIntersectionObserver - Efficient viewport detection
 * Perfect for lazy loading and animations on scroll
 */
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
): [React.RefObject<HTMLElement | null>, boolean] {
  const ref = useRef<HTMLElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold: 0.1, ...options }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [options.root, options.rootMargin, options.threshold]);

  return [ref, isIntersecting];
}

/**
 * useMediaQuery - Responsive breakpoint hook with SSR support
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

/**
 * useReducedMotion - Respect user's motion preferences
 */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/**
 * usePrefersColorScheme - Detect user's color scheme preference
 */
export function usePrefersColorScheme(): "light" | "dark" {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  return prefersDark ? "dark" : "light";
}
