// ===========================================
// 🚀 LAZY LOADING UTILITIES
// Code splitting for faster initial loads
// ===========================================

"use client";

import {
  lazy,
  Suspense,
  type ComponentType,
  type ReactNode,
  type LazyExoticComponent,
} from "react";

// Default loading fallback
const DefaultFallback = () => (
  <div className="flex items-center justify-center p-8">
    <div className="relative w-8 h-8">
      <div className="absolute inset-0 rounded-full border-2 border-neural/20" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-neural-bright animate-spin" />
    </div>
  </div>
);

// Skeleton loading fallback
const SkeletonFallback = () => (
  <div className="animate-pulse space-y-4 p-4">
    <div className="h-4 bg-void-elevated rounded w-3/4" />
    <div className="h-4 bg-void-elevated rounded w-1/2" />
    <div className="h-4 bg-void-elevated rounded w-5/6" />
  </div>
);

/**
 * LazyComponent wrapper with preloading support
 */
export interface LazyComponentOptions {
  fallback?: ReactNode;
  preload?: boolean;
  ssr?: boolean;
}

/**
 * Create a lazy-loaded component with enhanced options
 */
export function createLazyComponent<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: LazyComponentOptions = {}
): {
  Component: LazyExoticComponent<ComponentType<P>>;
  preload: () => Promise<{ default: ComponentType<P> }>;
} {
  let modulePromise: Promise<{ default: ComponentType<P> }> | null = null;

  const preload = () => {
    if (!modulePromise) {
      modulePromise = importFn();
    }
    return modulePromise;
  };

  // Preload immediately if requested
  if (options.preload && typeof window !== "undefined") {
    // Defer preload to after main thread is free
    requestIdleCallback(() => preload());
  }

  const LazyComp = lazy(preload);

  return {
    Component: LazyComp,
    preload,
  };
}

/**
 * Suspense wrapper with configurable fallback
 */
export function LazyComponent({
  children,
  fallback = <DefaultFallback />,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}

/**
 * HOC to wrap component with Suspense
 */
export function withSuspense<P extends object>(
  Component: ComponentType<P>,
  fallback: ReactNode = <DefaultFallback />
): ComponentType<P> {
  const WithSuspense = (props: P) => (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );
  WithSuspense.displayName = `withSuspense(${
    Component.displayName || Component.name
  })`;
  return WithSuspense;
}

/**
 * Lazy load on viewport intersection
 */
export function createViewportLazy<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: LazyComponentOptions & { rootMargin?: string } = {}
) {
  const { Component, preload } = createLazyComponent(importFn, options);

  const ViewportLazy = (props: P & { fallback?: ReactNode }) => {
    const { fallback = options.fallback || <SkeletonFallback />, ...rest } =
      props;

    return (
      <div
        data-lazy-boundary
        ref={(el) => {
          if (!el) return;
          const observer = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                preload();
                observer.disconnect();
              }
            },
            { rootMargin: options.rootMargin || "100px" }
          );
          observer.observe(el);
        }}
      >
        <Suspense fallback={fallback}>
          <Component {...(rest as P)} />
        </Suspense>
      </div>
    );
  };

  return {
    Component: ViewportLazy,
    preload,
  };
}

/**
 * Lazy load on hover/focus
 */
export function createInteractionLazy<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>
) {
  const { Component, preload } = createLazyComponent(importFn);
  let loaded = false;

  const handleInteraction = () => {
    if (!loaded) {
      loaded = true;
      preload();
    }
  };

  const InteractionLazy = (props: P & { fallback?: ReactNode }) => {
    const { fallback = <SkeletonFallback />, ...rest } = props;

    return (
      <div
        onMouseEnter={handleInteraction}
        onFocus={handleInteraction}
        onTouchStart={handleInteraction}
      >
        <Suspense fallback={fallback}>
          <Component {...(rest as P)} />
        </Suspense>
      </div>
    );
  };

  return {
    Component: InteractionLazy,
    preload,
  };
}

// Polyfill for requestIdleCallback
if (typeof window !== "undefined" && !window.requestIdleCallback) {
  window.requestIdleCallback = (cb: IdleRequestCallback) => {
    const start = Date.now();
    return setTimeout(() => {
      cb({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
      });
    }, 1) as unknown as number;
  };
}
