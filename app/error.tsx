"use client";

// ============================================================================
// Page-Level Error Boundary
// ============================================================================
// Handles errors within page segments without unmounting the entire app
// ============================================================================

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-zinc-900/50 border-zinc-800">
        <CardContent className="pt-8 pb-6 px-6">
          <div className="text-center space-y-5">
            {/* Error Icon */}
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-amber-500/10 ring-1 ring-amber-500/20">
                <AlertTriangle className="h-8 w-8 text-amber-500" />
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Something went wrong</h2>
              <p className="text-zinc-400 text-sm">
                We encountered an error loading this page. Please try again.
              </p>
            </div>

            {/* Dev Error Details */}
            {process.env.NODE_ENV === "development" && (
              <div className="bg-zinc-950 rounded-lg p-3 text-left">
                <p className="text-red-400 text-xs font-mono break-all">
                  {error.message}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-center">
              <Button
                onClick={reset}
                size="sm"
                className="bg-violet-600 hover:bg-violet-500"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.history.back()}
                className="border-zinc-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
