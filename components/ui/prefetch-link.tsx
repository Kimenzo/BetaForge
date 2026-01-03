// ===========================================
// 🚀 OPTIMIZED PREFETCH LINK
// Smart prefetching on hover/focus
// ===========================================

"use client";

import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { forwardRef, useCallback, useRef, memo, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/utils";
import { prefetchRoute } from "@/lib/performance/preload";

interface PrefetchLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
  /** Prefetch on hover (default: true) */
  prefetchOnHover?: boolean;
  /** Prefetch on focus (default: true) */
  prefetchOnFocus?: boolean;
  /** Delay before prefetching on hover (ms) */
  hoverDelay?: number;
  /** External link (opens in new tab) */
  external?: boolean;
}

/**
 * Optimized Link component with smart prefetching
 * - Prefetches on hover after delay
 * - Prefetches on focus
 * - GPU-accelerated hover animations
 */
export const PrefetchLink = memo(
  forwardRef<HTMLAnchorElement, PrefetchLinkProps>(function PrefetchLink(
    {
      children,
      className,
      href,
      prefetchOnHover = true,
      prefetchOnFocus = true,
      hoverDelay = 100,
      external = false,
      ...props
    },
    ref
  ) {
    const router = useRouter();
    const hoverTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const prefetchedRef = useRef(false);

    const handlePrefetch = useCallback(() => {
      if (prefetchedRef.current) return;

      const hrefString = typeof href === "string" ? href : href.pathname || "";

      // Don't prefetch external links or hash links
      if (hrefString.startsWith("http") || hrefString.startsWith("#")) return;

      prefetchedRef.current = true;
      router.prefetch(hrefString);
      prefetchRoute(hrefString);
    }, [href, router]);

    const handleMouseEnter = useCallback(() => {
      if (!prefetchOnHover) return;

      hoverTimeoutRef.current = setTimeout(handlePrefetch, hoverDelay);
    }, [prefetchOnHover, hoverDelay, handlePrefetch]);

    const handleMouseLeave = useCallback(() => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    }, []);

    const handleFocus = useCallback(() => {
      if (prefetchOnFocus) {
        handlePrefetch();
      }
    }, [prefetchOnFocus, handlePrefetch]);

    if (external) {
      const hrefString = typeof href === "string" ? href : href.toString();
      return (
        <a
          ref={ref}
          href={hrefString}
          className={className}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }

    return (
      <Link
        ref={ref}
        href={href}
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        {...props}
      >
        {children}
      </Link>
    );
  })
);

/**
 * Navigation link with active state
 */
export const NavLink = memo(
  forwardRef<HTMLAnchorElement, PrefetchLinkProps & { 
    isActive?: boolean;
    activeClassName?: string;
  }>(function NavLink(
    {
      children,
      className,
      isActive,
      activeClassName = "text-ghost-white",
      ...props
    },
    ref
  ) {
    return (
      <PrefetchLink
        ref={ref}
        className={cn(
          "transition-colors duration-200",
          isActive ? activeClassName : "text-phantom-gray hover:text-ghost-white",
          className
        )}
        {...props}
      >
        {children}
      </PrefetchLink>
    );
  })
);

/**
 * Button link - styled like a button but is a link
 */
export const ButtonLink = memo(
  forwardRef<HTMLAnchorElement, PrefetchLinkProps & {
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
  }>(function ButtonLink(
    {
      children,
      className,
      variant = "primary",
      size = "md",
      ...props
    },
    ref
  ) {
    const variants = {
      primary: "bg-gradient-to-r from-neural to-neural-dim text-white hover:shadow-glow",
      secondary: "bg-void-elevated text-ghost-white border border-white/10 hover:border-neural/30",
      ghost: "text-phantom-gray hover:text-ghost-white hover:bg-white/5",
    };

    const sizes = {
      sm: "h-9 px-4 text-xs rounded-lg",
      md: "h-11 px-5 py-2.5 rounded-xl",
      lg: "h-13 px-8 text-base rounded-2xl",
    };

    return (
      <PrefetchLink
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold transition-gpu hover:-translate-y-0.5 gpu-accelerate",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </PrefetchLink>
    );
  })
);
