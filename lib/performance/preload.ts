// ===========================================
// 🚀 PRELOADING & PREFETCHING UTILITIES
// Anticipate user actions for instant navigation
// ===========================================

/**
 * Preconnect to critical third-party origins
 * Call this in layout.tsx for instant connections
 */
export function preconnectOrigins(origins: string[]): void {
  if (typeof window === "undefined") return;

  origins.forEach((origin) => {
    // Preconnect link
    const preconnect = document.createElement("link");
    preconnect.rel = "preconnect";
    preconnect.href = origin;
    preconnect.crossOrigin = "anonymous";
    document.head.appendChild(preconnect);

    // DNS prefetch as fallback
    const dnsPrefetch = document.createElement("link");
    dnsPrefetch.rel = "dns-prefetch";
    dnsPrefetch.href = origin;
    document.head.appendChild(dnsPrefetch);
  });
}

/**
 * Preload critical resources (fonts, images, scripts)
 */
export function preloadCriticalResources(resources: Array<{
  href: string;
  as: "font" | "image" | "script" | "style" | "fetch";
  type?: string;
  crossOrigin?: "anonymous" | "use-credentials";
}>): void {
  if (typeof window === "undefined") return;

  resources.forEach((resource) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = resource.href;
    link.as = resource.as;
    if (resource.type) link.type = resource.type;
    if (resource.crossOrigin) link.crossOrigin = resource.crossOrigin;
    document.head.appendChild(link);
  });
}

/**
 * Prefetch a route for instant navigation
 * Use on hover/focus for likely navigation targets
 */
export function prefetchRoute(href: string): void {
  if (typeof window === "undefined") return;

  // Check if already prefetched
  const existing = document.querySelector(`link[rel="prefetch"][href="${href}"]`);
  if (existing) return;

  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = href;
  document.head.appendChild(link);
}

/**
 * Intersection Observer for viewport-based prefetching
 */
export function createViewportPrefetcher(): IntersectionObserver | null {
  if (typeof window === "undefined") return null;

  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const href = (entry.target as HTMLElement).dataset.prefetch;
          if (href) prefetchRoute(href);
        }
      });
    },
    { rootMargin: "100px" }
  );
}

/**
 * Preload image for instant display
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Preload multiple images in parallel
 */
export function preloadImages(srcs: string[]): Promise<void[]> {
  return Promise.all(srcs.map(preloadImage));
}
