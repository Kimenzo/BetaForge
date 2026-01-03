"use client";

import Link from "next/link";
import { use } from "react";
import {
  Sparkles,
  ChevronRight,
  Construction,
  ArrowLeft,
  BookOpen,
} from "lucide-react";
import { Footer } from "@/components/layout";

export default function DocPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = use(params);

  // Format the title from the slug
  // e.g. ['agents', 'personas'] -> "Personas" (or specific logic if preferred)
  // Let's make it show the full hierarchy or just the last part. 
  // For "Agents Personas", it's better.
  const title = slug[slug.length - 1]
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const breadcrumbs = slug.map((part) =>
    part
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );

  return (
    <div className="min-h-screen bg-void-black">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 mesh-bg opacity-30" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neural/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-electric-cyan/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-void-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-neural-bright to-electric-cyan flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">
                  BetaForge
                </span>
              </Link>
              <nav className="hidden md:flex items-center">
                <Link
                  href="/docs"
                  className="text-phantom-gray hover:text-ghost-white text-sm transition-colors px-3 py-2"
                >
                  Docs
                </Link>
                {breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center">
                    <ChevronRight className="w-4 h-4 text-mist-gray" />
                    <span
                      className={`text-sm px-3 py-2 ${
                        index === breadcrumbs.length - 1
                          ? "text-ghost-white"
                          : "text-phantom-gray"
                      }`}
                    >
                      {crumb}
                    </span>
                  </div>
                ))}
              </nav>
            </div>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-lg bg-neural/20 text-ghost-white text-sm font-medium hover:bg-neural/30 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-phantom-gray mb-6">
            <Link
              href="/docs"
              className="hover:text-ghost-white transition-colors"
            >
              Documentation
            </Link>
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4" />
                <span
                  className={
                    index === breadcrumbs.length - 1
                      ? "text-ghost-white"
                      : "text-phantom-gray"
                  }
                >
                  {crumb}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-neural/20 to-electric-cyan/20 border border-neural/20">
              <BookOpen className="w-8 h-8 text-neural-bright" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-ghost-white">
                {title}
              </h1>
              <p className="mt-2 text-lg text-phantom-gray">
                Documentation for {title}
              </p>
            </div>
          </div>

          {/* Coming Soon Content */}
          <div className="p-12 bg-void-elevated border border-white/5 rounded-3xl text-center">
            <div className="inline-flex p-4 rounded-full bg-void-black border border-white/10 mb-6">
              <Construction className="w-8 h-8 text-electric-cyan animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-ghost-white mb-4">
              Documentation In Progress
            </h2>
            <p className="text-phantom-gray max-w-lg mx-auto mb-8">
              We are currently writing the comprehensive documentation for{" "}
              <span className="text-neural-bright">{title}</span>. This page will be
              updated shortly with detailed guides, examples, and API references.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/docs"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-ghost-white font-medium transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Docs
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-neural to-electric-cyan text-white font-semibold hover:shadow-glow transition-all"
              >
                Request Priority Access
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
