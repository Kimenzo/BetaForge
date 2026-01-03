"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Book,
  Code,
  Rocket,
  Puzzle,
  Search,
  ChevronRight,
  FileText,
  Terminal,
  Zap,
  Shield,
  Users,
  Settings,
  ArrowRight,
  BookOpen,
  Sparkles,
  Globe,
  Cpu,
  Database,
  Lock,
  Webhook,
  PlayCircle,
} from "lucide-react";
import { Footer } from "@/components/layout";

const quickStartGuides = [
  {
    icon: Rocket,
    title: "Getting Started",
    description:
      "Set up BetaForge and run your first AI-powered test in under 5 minutes",
    href: "/docs/getting-started",
    time: "5 min",
  },
  {
    icon: Code,
    title: "API Reference",
    description:
      "Complete API documentation with examples in multiple languages",
    href: "/docs/api",
    time: "Reference",
  },
  {
    icon: Puzzle,
    title: "Integrations",
    description:
      "Connect BetaForge with your CI/CD pipeline and development tools",
    href: "/docs/integrations",
    time: "10 min",
  },
  {
    icon: Users,
    title: "Agent Configuration",
    description: "Customize AI agent personas and testing behaviors",
    href: "/docs/agents",
    time: "8 min",
  },
];

const docCategories = [
  {
    title: "Fundamentals",
    icon: BookOpen,
    color: "from-neural to-electric-cyan",
    items: [
      { title: "Introduction to BetaForge", href: "/docs/introduction" },
      { title: "Core Concepts", href: "/docs/concepts" },
      { title: "Architecture Overview", href: "/docs/architecture" },
      { title: "Quick Start Guide", href: "/docs/getting-started" },
    ],
  },
  {
    title: "AI Agents",
    icon: Cpu,
    color: "from-electric-cyan to-plasma-pink",
    items: [
      { title: "Understanding Agents", href: "/docs/agents" },
      { title: "Agent Personas", href: "/docs/agents/personas" },
      {
        title: "Custom Agent Configuration",
        href: "/docs/agents/configuration",
      },
      { title: "Agent Behaviors", href: "/docs/agents/behaviors" },
    ],
  },
  {
    title: "Test Sessions",
    icon: PlayCircle,
    color: "from-plasma-pink to-quantum-green",
    items: [
      { title: "Creating Test Sessions", href: "/docs/sessions/create" },
      { title: "Real-time Monitoring", href: "/docs/sessions/monitoring" },
      { title: "Session Reports", href: "/docs/sessions/reports" },
      { title: "Parallel Testing", href: "/docs/sessions/parallel" },
    ],
  },
  {
    title: "API & SDK",
    icon: Code,
    color: "from-quantum-green to-neural",
    items: [
      { title: "API Reference", href: "/docs/api" },
      { title: "Authentication", href: "/docs/api/authentication" },
      { title: "Webhooks", href: "/docs/api/webhooks" },
      { title: "SDK Libraries", href: "/docs/api/sdk" },
    ],
  },
  {
    title: "Integrations",
    icon: Puzzle,
    color: "from-neural to-plasma-pink",
    items: [
      { title: "CI/CD Integration", href: "/docs/integrations" },
      { title: "GitHub Actions", href: "/docs/integrations/github" },
      { title: "GitLab CI", href: "/docs/integrations/gitlab" },
      { title: "Jenkins", href: "/docs/integrations/jenkins" },
    ],
  },
  {
    title: "Security",
    icon: Shield,
    color: "from-electric-cyan to-quantum-green",
    items: [
      { title: "Security Overview", href: "/docs/security" },
      { title: "Data Privacy", href: "/docs/security/privacy" },
      { title: "Compliance", href: "/docs/security/compliance" },
      { title: "Best Practices", href: "/docs/security/best-practices" },
    ],
  },
];

const popularArticles = [
  { title: "How to set up your first test project", views: "12.4k" },
  { title: "Configuring agent personas for your use case", views: "8.7k" },
  { title: "Integrating with GitHub Actions", views: "7.2k" },
  { title: "Understanding bug report severity levels", views: "6.8k" },
  { title: "Best practices for AI-powered testing", views: "5.9k" },
];

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState("");

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
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  href="/docs"
                  className="text-ghost-white font-medium text-sm"
                >
                  Docs
                </Link>
                <Link
                  href="/docs/api"
                  className="text-phantom-gray hover:text-ghost-white text-sm transition-colors"
                >
                  API
                </Link>
                <Link
                  href="/docs/integrations"
                  className="text-phantom-gray hover:text-ghost-white text-sm transition-colors"
                >
                  Integrations
                </Link>
                <Link
                  href="/changelog"
                  className="text-phantom-gray hover:text-ghost-white text-sm transition-colors"
                >
                  Changelog
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-lg bg-neural/20 text-ghost-white text-sm font-medium hover:bg-neural/30 transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-neural/20 mb-6">
              <Book className="w-4 h-4 text-neural-bright" />
              <span className="text-sm text-phantom-gray">Documentation</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-ghost-white">Learn </span>
              <span className="gradient-text">BetaForge</span>
            </h1>
            <p className="text-lg text-phantom-gray leading-relaxed">
              Everything you need to master AI-powered beta testing. From quick
              starts to advanced configurations, find the guidance you need.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mist-gray" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documentation..."
                className="w-full pl-12 pr-4 py-4 bg-void-elevated border border-white/10 rounded-2xl text-ghost-white placeholder:text-mist-gray focus:outline-none focus:border-neural/50 focus:ring-2 focus:ring-neural/20 transition-all"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-mist-gray">
                <kbd className="px-2 py-1 bg-void-black rounded border border-white/10">
                  ⌘
                </kbd>
                <kbd className="px-2 py-1 bg-void-black rounded border border-white/10">
                  K
                </kbd>
              </div>
            </div>
          </div>

          {/* Quick Start Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
            {quickStartGuides.map((guide, index) => (
              <Link
                key={index}
                href={guide.href}
                className="group p-6 bg-void-elevated border border-white/5 rounded-2xl hover:border-neural/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-neural/20 to-electric-cyan/20 text-neural-bright group-hover:scale-110 transition-transform">
                    <guide.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-mist-gray bg-void-black px-2 py-1 rounded-full">
                    {guide.time}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-ghost-white mb-2 group-hover:text-neural-bright transition-colors">
                  {guide.title}
                </h3>
                <p className="text-sm text-phantom-gray leading-relaxed">
                  {guide.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Categories */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-ghost-white mb-12 text-center">
            Explore by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {docCategories.map((category, index) => (
              <div
                key={index}
                className="group p-6 bg-void-elevated border border-white/5 rounded-2xl hover:border-white/10 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${category.color} text-white`}
                  >
                    <category.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-ghost-white">
                    {category.title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-2 text-phantom-gray hover:text-neural-bright transition-colors group/item"
                      >
                        <ChevronRight className="w-4 h-4 text-mist-gray group-hover/item:text-neural-bright group-hover/item:translate-x-1 transition-all" />
                        <span className="text-sm">{item.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles & Resources */}
      <section className="relative py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Popular Articles */}
            <div>
              <h2 className="text-2xl font-bold text-ghost-white mb-8 flex items-center gap-3">
                <FileText className="w-6 h-6 text-neural-bright" />
                Popular Articles
              </h2>
              <div className="space-y-4">
                {popularArticles.map((article, index) => (
                  <Link
                    key={index}
                    href="#"
                    className="flex items-center justify-between p-4 bg-void-elevated border border-white/5 rounded-xl hover:border-neural/30 transition-all group"
                  >
                    <span className="text-phantom-gray group-hover:text-ghost-white transition-colors">
                      {article.title}
                    </span>
                    <span className="text-xs text-mist-gray">
                      {article.views} views
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Additional Resources */}
            <div>
              <h2 className="text-2xl font-bold text-ghost-white mb-8 flex items-center gap-3">
                <Zap className="w-6 h-6 text-electric-cyan" />
                Resources
              </h2>
              <div className="space-y-4">
                <Link
                  href="/changelog"
                  className="flex items-center gap-4 p-4 bg-void-elevated border border-white/5 rounded-xl hover:border-neural/30 transition-all group"
                >
                  <div className="p-3 rounded-lg bg-neural/20 text-neural-bright">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-ghost-white group-hover:text-neural-bright transition-colors">
                      Changelog
                    </h4>
                    <p className="text-sm text-phantom-gray">
                      Latest updates and releases
                    </p>
                  </div>
                </Link>
                <Link
                  href="/docs/api"
                  className="flex items-center gap-4 p-4 bg-void-elevated border border-white/5 rounded-xl hover:border-neural/30 transition-all group"
                >
                  <div className="p-3 rounded-lg bg-electric-cyan/20 text-electric-cyan">
                    <Code className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-ghost-white group-hover:text-neural-bright transition-colors">
                      API Reference
                    </h4>
                    <p className="text-sm text-phantom-gray">
                      Complete REST API documentation
                    </p>
                  </div>
                </Link>
                <Link
                  href="https://github.com/betaforge"
                  target="_blank"
                  className="flex items-center gap-4 p-4 bg-void-elevated border border-white/5 rounded-xl hover:border-neural/30 transition-all group"
                >
                  <div className="p-3 rounded-lg bg-plasma-pink/20 text-plasma-pink">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-ghost-white group-hover:text-neural-bright transition-colors">
                      GitHub Repository
                    </h4>
                    <p className="text-sm text-phantom-gray">
                      Explore our open-source projects
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-12 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-neural/20 to-electric-cyan/20" />
            <div className="absolute inset-0 border border-neural/30 rounded-3xl" />
            <div className="relative text-center">
              <h2 className="text-3xl font-bold text-ghost-white mb-4">
                Need Help Getting Started?
              </h2>
              <p className="text-phantom-gray mb-8 max-w-xl mx-auto">
                Our team is here to help. Reach out to us for personalized
                guidance or schedule a demo to see BetaForge in action.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-neural to-electric-cyan text-white font-semibold hover:shadow-glow transition-all"
                >
                  Contact Support
                </Link>
                <Link
                  href="/docs/getting-started"
                  className="px-6 py-3 rounded-xl border border-white/10 text-ghost-white font-semibold hover:border-neural/30 transition-all"
                >
                  View Tutorial
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
