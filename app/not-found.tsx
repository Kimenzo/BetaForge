"use client";

// ============================================================================
// Custom Not Found Page
// ============================================================================
// Displayed when a page or resource is not found (404)
// ============================================================================

import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* 404 Graphic */}
        <div className="relative">
          <div className="text-[150px] font-bold text-zinc-800 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="h-16 w-16 text-zinc-600" />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold">Page not found</h1>
          <p className="text-zinc-400">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="bg-violet-600 hover:bg-violet-500">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Button
            variant="outline"
            className="border-zinc-700"
            onClick={() => typeof window !== "undefined" && window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t border-zinc-800">
          <p className="text-zinc-500 text-sm mb-4">Looking for something?</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              href="/dashboard"
              className="text-sm text-violet-400 hover:text-violet-300"
            >
              Dashboard
            </Link>
            <span className="text-zinc-700">•</span>
            <Link
              href="/docs"
              className="text-sm text-violet-400 hover:text-violet-300"
            >
              Documentation
            </Link>
            <span className="text-zinc-700">•</span>
            <Link
              href="/contact"
              className="text-sm text-violet-400 hover:text-violet-300"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
