import { cn } from "@/lib/utils";
import { forwardRef, InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, error, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-phantom-gray pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-12 w-full rounded-xl border bg-void-surface/50 px-4 py-3 text-sm text-ghost-white placeholder:text-mist-gray transition-all duration-300",
            "focus:outline-none focus:ring-2 focus:ring-neural/50 focus:border-neural/50 focus:bg-void-surface",
            "hover:border-white/20 hover:bg-void-surface/80",
            "disabled:cursor-not-allowed disabled:opacity-50",
            icon && "pl-11",
            error
              ? "border-crimson-red/50 focus:ring-crimson-red/50 focus:border-crimson-red/50"
              : "border-white/10",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
