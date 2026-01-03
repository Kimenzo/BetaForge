"use client";

// ============================================================================
// Global Error Boundary
// ============================================================================
// Catches unhandled errors in client components
// Provides user-friendly error UI with retry capability
// ============================================================================

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, Home, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log error to monitoring service in production
    console.error("Global error:", error);

    // In production, send to error tracking service
    // e.g., Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === "production") {
      // sendToErrorTracking(error);
    }
  }, [error]);

  const isNetworkError = error.message?.includes("fetch") || error.message?.includes("network");
  const isTimeout = error.message?.includes("timeout");

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 text-white font-sans antialiased">
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-lg w-full bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-8 pb-6 px-6">
              <div className="text-center space-y-6">
                {/* Error Icon */}
                <div className="flex justify-center">
                  <div className="p-4 rounded-full bg-red-500/10 ring-1 ring-red-500/20">
                    <AlertTriangle className="h-12 w-12 text-red-500" />
                  </div>
                </div>

                {/* Error Title */}
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold">Something went wrong</h1>
                  <p className="text-zinc-400 text-sm max-w-sm mx-auto">
                    {isNetworkError
                      ? "Unable to connect to the server. Please check your internet connection."
                      : isTimeout
                      ? "The request took too long to complete. Please try again."
                      : "An unexpected error occurred. Our team has been notified."}
                  </p>
                </div>

                {/* Error Details (dev only) */}
                {process.env.NODE_ENV === "development" && (
                  <div className="bg-zinc-950 rounded-lg p-4 text-left">
                    <div className="flex items-center gap-2 text-red-400 text-sm font-mono mb-2">
                      <Bug className="h-4 w-4" />
                      <span>{error.name}</span>
                    </div>
                    <p className="text-zinc-400 text-xs font-mono break-all">
                      {error.message}
                    </p>
                    {error.digest && (
                      <p className="text-zinc-500 text-xs font-mono mt-2">
                        Error ID: {error.digest}
                      </p>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={reset}
                    className="bg-violet-600 hover:bg-violet-500"
                  >
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => (window.location.href = "/")}
                    className="border-zinc-700 hover:bg-zinc-800"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Go Home
                  </Button>
                </div>

                {/* Support Link */}
                <p className="text-zinc-500 text-xs">
                  If this problem persists,{" "}
                  <a
                    href="/contact"
                    className="text-violet-400 hover:text-violet-300 underline"
                  >
                    contact support
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  );
}
