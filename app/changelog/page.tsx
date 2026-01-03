"use client";

import Link from "next/link";
import {
  Sparkles,
  ChevronRight,
  Calendar,
  Tag,
  Zap,
  Bug,
  Shield,
  Rocket,
  Star,
  ArrowUp,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  GitCommit,
} from "lucide-react";
import { Footer } from "@/components/layout";

const releases = [
  {
    version: "2.4.0",
    date: "January 2, 2026",
    tag: "Latest",
    tagColor: "bg-quantum-green text-quantum-green",
    highlights: [
      "New mobile testing capabilities with device emulation",
      "Enhanced AI agent memory for better context retention",
      "Real-time collaboration features for team testing",
    ],
    changes: {
      new: [
        "Mobile device emulation for iOS and Android testing",
        "Agent memory system for cross-session context",
        "Team workspace with real-time collaboration",
        "Custom test scenarios with natural language input",
        "Export bug reports to PDF and Markdown",
      ],
      improved: [
        "50% faster test session initialization",
        "More accurate accessibility detection",
        "Better screenshot capture for visual bugs",
        "Enhanced error boundary testing",
      ],
      fixed: [
        "Session timeout issues on long-running tests",
        "Webhook delivery retries now work correctly",
        "Fixed SSE connection drops on slow networks",
      ],
    },
  },
  {
    version: "2.3.0",
    date: "December 15, 2025",
    tag: null,
    highlights: [
      "Parallel testing with multiple agents",
      "Advanced filtering for bug reports",
      "GitLab CI integration",
    ],
    changes: {
      new: [
        "Run up to 6 agents in parallel per session",
        "Advanced bug report filtering and search",
        "GitLab CI/CD integration",
        "Scheduled test sessions (cron-based)",
        "Bug severity auto-classification with AI",
      ],
      improved: [
        "Agent personas now have distinct testing patterns",
        "Dashboard performance optimizations",
        "API rate limits increased for Pro plans",
      ],
      fixed: [
        "Duplicate bug reports from concurrent agents",
        "Authentication edge cases with SSO",
        "Timezone issues in session scheduling",
      ],
    },
  },
  {
    version: "2.2.0",
    date: "November 28, 2025",
    tag: null,
    highlights: [
      "Jira integration for automatic ticket creation",
      "Enhanced security testing capabilities",
      "Performance metrics in bug reports",
    ],
    changes: {
      new: [
        "Jira integration with auto-ticket creation",
        "Security testing focus for Diego agent",
        "Performance metrics (LCP, FID, CLS) in reports",
        "Custom webhook payloads",
        "Bulk actions for bug management",
      ],
      improved: [
        "More detailed reproduction steps",
        "Better error message categorization",
        "Faster real-time streaming",
      ],
      fixed: [
        "Memory leaks in long test sessions",
        "GitHub Actions integration timeout",
        "Report export formatting issues",
      ],
    },
  },
  {
    version: "2.1.0",
    date: "November 10, 2025",
    tag: null,
    highlights: [
      "Slack notifications for test results",
      "Session comparison feature",
      "Improved accessibility testing",
    ],
    changes: {
      new: [
        "Slack integration for real-time notifications",
        "Compare test sessions side-by-side",
        "WCAG 2.2 compliance checking",
        "Agent configuration presets",
        "Test session templates",
      ],
      improved: [
        "Ahmed agent now detects more ARIA issues",
        "Faster initial page analysis",
        "Better handling of SPAs",
      ],
      fixed: [
        "False positives in form validation testing",
        "Screenshot capture on dynamic content",
        "API key rotation issues",
      ],
    },
  },
  {
    version: "2.0.0",
    date: "October 20, 2025",
    tag: "Major",
    tagColor: "bg-neural text-neural-bright",
    highlights: [
      "Complete platform redesign",
      "New AI agent architecture with Claude",
      "Enterprise features and SOC 2 compliance",
    ],
    changes: {
      new: [
        "Complete UI/UX redesign with dark theme",
        "New AI engine powered by Claude",
        "6 unique agent personas with distinct behaviors",
        "Enterprise SSO and SAML support",
        "SOC 2 Type II compliance",
        "GraphQL API (alongside REST)",
        "Bitbucket Pipelines integration",
      ],
      improved: [
        "10x faster bug detection",
        "More human-like testing patterns",
        "Comprehensive API documentation",
        "Better onboarding experience",
      ],
      breaking: [
        "API v1 deprecated (sunset in 6 months)",
        "Webhook payload format changed",
        "Agent IDs renamed for consistency",
      ],
    },
  },
  {
    version: "1.5.0",
    date: "September 5, 2025",
    tag: null,
    highlights: [
      "GitHub Actions integration",
      "Webhook support",
      "Bug report comments",
    ],
    changes: {
      new: [
        "GitHub Actions marketplace action",
        "Webhook notifications",
        "Comments on bug reports",
        "Test session notes",
      ],
      improved: [
        "Agent response time",
        "Dashboard loading speed",
        "Error handling",
      ],
      fixed: [
        "Session status not updating",
        "Email notification delays",
      ],
    },
  },
];

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  new: Rocket,
  improved: ArrowUp,
  fixed: Bug,
  breaking: AlertTriangle,
};

const typeLabels: Record<string, string> = {
  new: "New Features",
  improved: "Improvements",
  fixed: "Bug Fixes",
  breaking: "Breaking Changes",
};

const typeColors: Record<string, string> = {
  new: "text-quantum-green",
  improved: "text-electric-cyan",
  fixed: "text-plasma-pink",
  breaking: "text-amber-500",
};

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-void-black">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 mesh-bg opacity-30" />
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-neural/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-quantum-green/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-void-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-neural-bright to-electric-cyan flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">BetaForge</span>
              </Link>
              <nav className="hidden md:flex items-center">
                <Link href="/docs" className="text-phantom-gray hover:text-ghost-white text-sm transition-colors px-3 py-2">
                  Docs
                </Link>
                <ChevronRight className="w-4 h-4 text-mist-gray" />
                <span className="text-ghost-white text-sm px-3 py-2">Changelog</span>
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
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-neural/20 mb-6">
              <GitCommit className="w-4 h-4 text-neural-bright" />
              <span className="text-sm text-phantom-gray">Product Updates</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-ghost-white mb-4">
              Changelog
            </h1>
            <p className="text-lg text-phantom-gray max-w-xl mx-auto">
              Stay up to date with the latest features, improvements, and fixes
              we&apos;re shipping to make BetaForge better every day.
            </p>
          </div>

          {/* Subscribe */}
          <div className="flex items-center justify-center gap-4 mb-16">
            <Link
              href="#"
              className="flex items-center gap-2 px-4 py-2 bg-void-elevated border border-white/10 rounded-lg text-sm text-phantom-gray hover:text-ghost-white hover:border-white/20 transition-all"
            >
              <Star className="w-4 h-4" />
              Subscribe to updates
            </Link>
            <Link
              href="https://github.com/betaforge/betaforge/releases"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-void-elevated border border-white/10 rounded-lg text-sm text-phantom-gray hover:text-ghost-white hover:border-white/20 transition-all"
            >
              <Tag className="w-4 h-4" />
              View on GitHub
            </Link>
          </div>
        </div>
      </section>

      {/* Releases Timeline */}
      <section className="relative pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {releases.map((release, index) => (
              <article
                key={release.version}
                className="relative pl-8 border-l-2 border-white/10"
              >
                {/* Timeline Dot */}
                <div
                  className={`absolute left-0 top-0 w-4 h-4 -translate-x-[9px] rounded-full ${
                    index === 0
                      ? "bg-quantum-green ring-4 ring-quantum-green/20"
                      : "bg-void-elevated border-2 border-white/20"
                  }`}
                />

                {/* Version Header */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <h2 className="text-2xl font-bold text-ghost-white">
                    v{release.version}
                  </h2>
                  {release.tag && (
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full bg-opacity-20 ${release.tagColor}`}
                    >
                      {release.tag}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-sm text-mist-gray">
                    <Calendar className="w-4 h-4" />
                    {release.date}
                  </span>
                </div>

                {/* Highlights */}
                <div className="p-4 bg-void-elevated border border-white/5 rounded-xl mb-6">
                  <h3 className="text-sm font-medium text-phantom-gray mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-neural-bright" />
                    Highlights
                  </h3>
                  <ul className="space-y-2">
                    {release.highlights.map((highlight, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-ghost-white"
                      >
                        <CheckCircle2 className="w-4 h-4 text-quantum-green mt-0.5 flex-shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Detailed Changes */}
                <div className="space-y-4">
                  {Object.entries(release.changes).map(([type, items]) => {
                    const Icon = typeIcons[type];
                    return (
                      <div key={type}>
                        <h4
                          className={`text-sm font-semibold mb-2 flex items-center gap-2 ${typeColors[type]}`}
                        >
                          <Icon className="w-4 h-4" />
                          {typeLabels[type]}
                        </h4>
                        <ul className="space-y-1 ml-6">
                          {items.map((item: string, i: number) => (
                            <li
                              key={i}
                              className="text-sm text-phantom-gray list-disc"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-12 text-center">
            <button className="px-6 py-3 bg-void-elevated border border-white/10 rounded-xl text-phantom-gray hover:text-ghost-white hover:border-white/20 transition-all">
              Load older releases
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
