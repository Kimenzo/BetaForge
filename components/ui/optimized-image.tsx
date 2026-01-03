// ===========================================
// 🚀 OPTIMIZED IMAGE COMPONENT
// Lazy loading, blur placeholder, and priority hints
// ===========================================

"use client";

import Image, { ImageProps } from "next/image";
import { useState, useCallback, memo } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends Omit<ImageProps, "onLoad" | "onError"> {
  /** Show blur placeholder while loading */
  showBlur?: boolean;
  /** Custom blur data URL */
  blurDataURL?: string;
  /** Fallback component on error */
  fallback?: React.ReactNode;
  /** Container className */
  containerClassName?: string;
}

/**
 * Optimized image component with:
 * - Automatic lazy loading
 * - Blur placeholder
 * - Error handling with fallback
 * - Smooth fade-in animation
 */
export const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  className,
  containerClassName,
  showBlur = true,
  blurDataURL,
  fallback,
  priority = false,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  // Default blur placeholder (1x1 pixel gray)
  const defaultBlurDataURL =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

  if (hasError && fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      <Image
        src={src}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? "eager" : "lazy"}
        placeholder={showBlur ? "blur" : "empty"}
        blurDataURL={blurDataURL || defaultBlurDataURL}
        priority={priority}
        {...props}
      />
      {/* Loading skeleton */}
      {!isLoaded && !hasError && (
        <div
          className="absolute inset-0 bg-void-elevated skeleton-shimmer"
          aria-hidden="true"
        />
      )}
    </div>
  );
});

/**
 * Avatar image with circle crop and loading state
 */
export const OptimizedAvatar = memo(function OptimizedAvatar({
  src,
  alt,
  size = 40,
  className,
  fallbackText,
}: {
  src?: string;
  alt: string;
  size?: number;
  className?: string;
  fallbackText?: string;
}) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-neural/20 text-neural-bright font-semibold",
          className
        )}
        style={{ width: size, height: size }}
        aria-label={alt}
      >
        {fallbackText || alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <div
      className={cn("relative overflow-hidden rounded-full", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="object-cover"
        onError={() => setHasError(true)}
        loading="lazy"
      />
    </div>
  );
});

/**
 * Background image with parallax support
 */
export const BackgroundImage = memo(function BackgroundImage({
  src,
  alt,
  className,
  overlay = true,
  overlayClassName,
  children,
}: {
  src: string;
  alt: string;
  className?: string;
  overlay?: boolean;
  overlayClassName?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        loading="lazy"
        sizes="100vw"
      />
      {overlay && (
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-void-black/90 via-void-black/50 to-transparent",
            overlayClassName
          )}
        />
      )}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
});
