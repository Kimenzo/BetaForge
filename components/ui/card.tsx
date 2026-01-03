import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva(
  "rounded-2xl border transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-void-surface/80 border-white/5 backdrop-blur-sm",
        glass: "glass",
        elevated: "bg-void-elevated border-white/10 shadow-xl",
        outline: "bg-transparent border-neural/20 hover:border-neural/40",
        ghost: "bg-transparent border-transparent",
        gradient: "bg-gradient-to-br from-void-surface to-void-elevated border-white/10",
        glow: "bg-void-surface/80 border-neural/20 shadow-glow hover:shadow-glow-intense",
      },
      hover: {
        none: "",
        lift: "card-hover",
        glow: "hover:shadow-glow hover:border-neural/30",
        scale: "hover:scale-[1.02] active:scale-[0.98]",
      },
      padding: {
        none: "",
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      hover: "none",
      padding: "none",
    },
  }
);

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, hover, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, hover, padding, className }))}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-2 p-6 pb-4", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-lg font-semibold leading-tight tracking-tight text-ghost-white",
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-phantom-gray leading-relaxed", className)}
      {...props}
    />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-3 p-6 pt-4 border-t border-white/5", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

// New: Metric card for stats
interface MetricCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
}

const MetricCard = forwardRef<HTMLDivElement, MetricCardProps>(
  ({ className, label, value, change, trend = "neutral", icon, ...props }, ref) => {
    const trendColors = {
      up: "text-quantum-green",
      down: "text-crimson-red",
      neutral: "text-phantom-gray",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "glass rounded-2xl p-6 card-hover group",
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between mb-4">
          <span className="text-sm text-phantom-gray font-medium">{label}</span>
          {icon && (
            <div className="p-2 rounded-xl bg-neural/10 text-neural-bright group-hover:bg-neural/20 transition-colors">
              {icon}
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold text-ghost-white tracking-tight">
            {value}
          </p>
          {change && (
            <p className={cn("text-sm font-medium", trendColors[trend])}>
              {trend === "up" && "↑ "}
              {trend === "down" && "↓ "}
              {change}
            </p>
          )}
        </div>
      </div>
    );
  }
);
MetricCard.displayName = "MetricCard";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, MetricCard, cardVariants };
