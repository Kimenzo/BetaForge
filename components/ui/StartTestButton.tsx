"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, Loader2 } from "lucide-react";

interface StartTestButtonProps {
  projectId: string;
  variant?: "primary" | "secondary";
  className?: string;
}

export function StartTestButton({
  projectId,
  variant = "primary",
  className = "",
}: StartTestButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleStartTest = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to start test");
      }

      const data = await response.json();
      
      // Navigate to the session page or refresh the current page
      if (data.sessionId) {
        router.push(`/sessions/${data.sessionId}`);
      } else {
        // Refresh the page to show the new session
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      console.error("Failed to start test:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const baseClasses = "inline-flex items-center gap-2 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "px-6 py-3 rounded-xl bg-gradient-to-r from-neural to-neural-bright text-white hover:shadow-glow",
    secondary: "px-4 py-2 rounded-lg bg-neural/10 text-neural-bright hover:bg-neural/20",
  };

  return (
    <div className="relative">
      <button
        onClick={handleStartTest}
        disabled={isLoading}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Starting...</span>
          </>
        ) : (
          <>
            <Zap className="w-5 h-5" />
            <span>{variant === "primary" ? "Run Test" : "Start Testing"}</span>
          </>
        )}
      </button>
      
      {error && (
        <p className="absolute top-full left-0 mt-2 text-sm text-crimson-red">
          {error}
        </p>
      )}
    </div>
  );
}
