// ===========================================
// 🚀 BETAFORGE PERFORMANCE LIBRARY
// Ultra-fast utilities for top 1% performance
// ===========================================

export { preloadCriticalResources, prefetchRoute, preconnectOrigins } from "./preload";
export { measureWebVitals, PerformanceMonitor, reportPerformance } from "./monitoring";
export { 
  memoWithDeepCompare, 
  createOptimizedContext, 
  useStableCallback,
  useDeferredValue,
  useThrottledValue,
  useDebouncedValue,
} from "./react-optimizations";
export {
  RequestCache,
  createCacheKey,
  withCache,
  invalidateCache,
  preloadData,
} from "./cache";
export {
  LazyComponent,
  withSuspense,
  createLazyComponent,
} from "./lazy-loading";
export {
  gpuAccelerate,
  willChange,
  optimizeAnimation,
  createSpring,
} from "./animations";
