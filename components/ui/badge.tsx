import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, forwardRef } from "react";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-300",
  {
    variants: {
      variant: {
        default: "border-neural/30 bg-neural/10 text-neural-bright",
        secondary: "border-white/10 bg-void-elevated text-phantom-gray",
        destructive: "border-crimson-red/30 bg-crimson-red/10 text-crimson-red",
        success: "border-quantum-green/30 bg-quantum-green/10 text-quantum-green",
        warning: "border-photon-yellow/30 bg-photon-yellow/10 text-photon-yellow",
        info: "border-electric-cyan/30 bg-electric-cyan/10 text-electric-cyan",
        outline: "border-white/20 bg-transparent text-ghost-white",
        ghost: "border-transparent bg-transparent text-phantom-gray",
        pink: "border-plasma-pink/30 bg-plasma-pink/10 text-plasma-pink",
        orange: "border-ember-orange/30 bg-ember-orange/10 text-ember-orange",
      },
      size: {
        sm: "text-[10px] px-2 py-0.5",
        default: "text-xs px-3 py-1",
        lg: "text-sm px-4 py-1.5",
      },
      glow: {
        none: "",
        subtle: "shadow-[0_0_10px_currentColor/0.2]",
        strong: "shadow-[0_0_15px_currentColor/0.3] animate-glow-breathe",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      glow: "none",
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
  pulse?: boolean;
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, glow, dot, pulse, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size, glow }), className)}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full bg-current",
              pulse && "animate-pulse"
            )}
          />
        )}
        {children}
      </div>
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
