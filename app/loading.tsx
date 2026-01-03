// ============================================================================
// Global Loading State
// ============================================================================
// Displayed during page transitions and initial loads
// ============================================================================

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Loader2 className="h-10 w-10 text-violet-500 animate-spin" />
          <div className="absolute inset-0 h-10 w-10 rounded-full bg-violet-500/20 animate-ping" />
        </div>
        <p className="text-zinc-400 text-sm animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
