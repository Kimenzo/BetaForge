// ===========================================
// 🚀 GPU-ACCELERATED ANIMATIONS
// Buttery smooth 60fps+ animations
// ===========================================

/**
 * CSS properties that trigger GPU acceleration
 * Use these for smooth animations without layout thrashing
 */
export const GPU_ACCELERATED_PROPERTIES = [
  "transform",
  "opacity",
  "filter",
  "backdrop-filter",
] as const;

/**
 * Properties to avoid animating (cause layout/paint)
 */
export const LAYOUT_THRASHING_PROPERTIES = [
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  "margin",
  "padding",
  "border",
  "font-size",
] as const;

/**
 * GPU acceleration styles - apply to animated elements
 */
export const gpuAccelerate = {
  transform: "translateZ(0)",
  backfaceVisibility: "hidden" as const,
  perspective: 1000,
  willChange: "transform",
} as const;

/**
 * Create will-change style for specific properties
 */
export function willChange(...properties: string[]): React.CSSProperties {
  return {
    willChange: properties.join(", "),
  };
}

/**
 * Optimized animation presets with GPU acceleration
 */
export const optimizeAnimation = {
  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    style: willChange("opacity"),
  },
  fadeOut: {
    initial: { opacity: 1 },
    animate: { opacity: 0 },
    style: willChange("opacity"),
  },

  // Slide animations (GPU-accelerated)
  slideUp: {
    initial: { opacity: 0, transform: "translateY(20px) translateZ(0)" },
    animate: { opacity: 1, transform: "translateY(0) translateZ(0)" },
    style: willChange("transform", "opacity"),
  },
  slideDown: {
    initial: { opacity: 0, transform: "translateY(-20px) translateZ(0)" },
    animate: { opacity: 1, transform: "translateY(0) translateZ(0)" },
    style: willChange("transform", "opacity"),
  },
  slideLeft: {
    initial: { opacity: 0, transform: "translateX(20px) translateZ(0)" },
    animate: { opacity: 1, transform: "translateX(0) translateZ(0)" },
    style: willChange("transform", "opacity"),
  },
  slideRight: {
    initial: { opacity: 0, transform: "translateX(-20px) translateZ(0)" },
    animate: { opacity: 1, transform: "translateX(0) translateZ(0)" },
    style: willChange("transform", "opacity"),
  },

  // Scale animations
  scaleIn: {
    initial: { opacity: 0, transform: "scale(0.95) translateZ(0)" },
    animate: { opacity: 1, transform: "scale(1) translateZ(0)" },
    style: willChange("transform", "opacity"),
  },
  scaleOut: {
    initial: { opacity: 1, transform: "scale(1) translateZ(0)" },
    animate: { opacity: 0, transform: "scale(0.95) translateZ(0)" },
    style: willChange("transform", "opacity"),
  },

  // Pop animation (for buttons, cards)
  pop: {
    initial: { transform: "scale(1) translateZ(0)" },
    hover: { transform: "scale(1.02) translateZ(0)" },
    tap: { transform: "scale(0.98) translateZ(0)" },
    style: willChange("transform"),
  },
};

/**
 * Spring physics for natural-feeling animations
 */
export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

export const SPRING_PRESETS: Record<string, SpringConfig> = {
  // Snappy - for buttons and small elements
  snappy: { stiffness: 400, damping: 30, mass: 1 },
  // Gentle - for modals and large elements
  gentle: { stiffness: 200, damping: 25, mass: 1 },
  // Bouncy - for playful animations
  bouncy: { stiffness: 500, damping: 15, mass: 1 },
  // Slow - for page transitions
  slow: { stiffness: 100, damping: 20, mass: 1 },
};

/**
 * Create spring animation timing
 */
export function createSpring(
  preset: keyof typeof SPRING_PRESETS | SpringConfig
): string {
  const config = typeof preset === "string" ? SPRING_PRESETS[preset] : preset;

  // Convert spring physics to cubic-bezier approximation
  // This is a simplified conversion - for true springs, use a physics library
  const { stiffness, damping } = config;
  const dampingRatio = damping / (2 * Math.sqrt(stiffness));

  if (dampingRatio >= 1) {
    // Overdamped - use ease-out
    return "cubic-bezier(0.16, 1, 0.3, 1)";
  } else if (dampingRatio >= 0.7) {
    // Slightly underdamped
    return "cubic-bezier(0.34, 1.2, 0.64, 1)";
  } else {
    // Underdamped - bouncy
    return "cubic-bezier(0.34, 1.56, 0.64, 1)";
  }
}

/**
 * Stagger delay for list animations
 */
export function staggerDelay(index: number, baseDelay: number = 50): string {
  return `${index * baseDelay}ms`;
}

/**
 * CSS variables for animations with reduced motion support
 */
export const animationVariables = `
  /* Animation durations */
  --duration-instant: 50ms;
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --duration-slowest: 1000ms;

  /* Animation timing functions */
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-spring: cubic-bezier(0.34, 1.2, 0.64, 1);

  /* Respect reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    --duration-instant: 0ms;
    --duration-fast: 0ms;
    --duration-normal: 0ms;
    --duration-slow: 0ms;
    --duration-slowest: 0ms;
  }
`;

/**
 * Check if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Get animation duration respecting reduced motion
 */
export function getAnimationDuration(ms: number): number {
  return prefersReducedMotion() ? 0 : ms;
}

/**
 * Optimized keyframes for common animations
 */
export const OPTIMIZED_KEYFRAMES = {
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  fadeInUp: `
    @keyframes fadeInUp {
      from { 
        opacity: 0; 
        transform: translateY(20px) translateZ(0);
      }
      to { 
        opacity: 1; 
        transform: translateY(0) translateZ(0);
      }
    }
  `,
  slideInRight: `
    @keyframes slideInRight {
      from { 
        opacity: 0; 
        transform: translateX(-20px) translateZ(0);
      }
      to { 
        opacity: 1; 
        transform: translateX(0) translateZ(0);
      }
    }
  `,
  pulse: `
    @keyframes pulse {
      0%, 100% { 
        opacity: 1; 
      }
      50% { 
        opacity: 0.5; 
      }
    }
  `,
  shimmer: `
    @keyframes shimmer {
      0% { 
        background-position: -200% 0;
      }
      100% { 
        background-position: 200% 0;
      }
    }
  `,
  float: `
    @keyframes float {
      0%, 100% { 
        transform: translateY(0) translateZ(0);
      }
      50% { 
        transform: translateY(-10px) translateZ(0);
      }
    }
  `,
};
