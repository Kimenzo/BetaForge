import { cn } from "@/lib/utils";
import { forwardRef, ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 ease-out-expo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neural focus-visible:ring-offset-2 focus-visible:ring-offset-void-black disabled:pointer-events-none disabled:opacity-50 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-neural to-neural-dim text-white hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0 btn-neural",
        secondary:
          "bg-void-elevated text-ghost-white border border-white/10 hover:border-neural/30 hover:bg-void-surface hover:-translate-y-0.5",
        outline:
          "border border-neural/50 bg-transparent text-neural-bright hover:bg-neural/10 hover:border-neural hover:-translate-y-0.5",
        ghost:
          "text-phantom-gray hover:text-ghost-white hover:bg-white/5",
        destructive:
          "bg-gradient-to-r from-crimson-red to-red-600 text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:-translate-y-0.5",
        success:
          "bg-gradient-to-r from-quantum-green to-emerald-600 text-white hover:shadow-glow-green hover:-translate-y-0.5",
        link:
          "text-neural-bright underline-offset-4 hover:underline p-0 h-auto",
        glow:
          "bg-void-surface text-ghost-white border border-neural/30 hover:border-neural hover:shadow-glow-intense hover:-translate-y-1 animate-glow-breathe",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 px-4 text-xs rounded-lg",
        lg: "h-13 px-8 text-base rounded-2xl",
        xl: "h-14 px-10 text-lg rounded-2xl",
        icon: "h-10 w-10 rounded-xl",
        "icon-sm": "h-8 w-8 rounded-lg",
        "icon-lg": "h-12 w-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {/* Ripple effect overlay */}
        <span className="absolute inset-0 overflow-hidden rounded-inherit">
          <span className="absolute inset-0 rounded-inherit bg-white/0 hover:bg-white/5 transition-colors duration-300" />
        </span>
        
        {/* Content */}
        <span className="relative flex items-center justify-center gap-2">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : leftIcon ? (
            <span className="transition-transform duration-300 group-hover:-translate-x-0.5">
              {leftIcon}
            </span>
          ) : null}
          
          {children}
          
          {rightIcon && !loading && (
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">
              {rightIcon}
            </span>
          )}
        </span>
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
