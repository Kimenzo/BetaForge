"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Sparkles,
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Search,
  User,
  Tag,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { Footer } from "@/components/layout";

const featuredPost = {
  title: "The Future of Software Testing: How AI Agents Are Changing Everything",
  excerpt:
    "Explore how autonomous AI agents are revolutionizing the way we approach software testing, finding bugs that humans miss, and accelerating release cycles.",
  author: "Sarah Mitchell",
  role: "CTO",
  date: "January 2, 2026",
  readTime: "8 min read",
  category: "AI & Testing",
  image: "gradient-neural",
  slug: "future-of-software-testing-ai-agents",
};

const categories = [
  "All",
  "AI & Testing",
  "Product Updates",
  "Engineering",
  "Best Practices",
  "Case Studies",
  "Company News",
];

const posts = [
  {
    title: "Introducing BetaForge 2.4: Mobile Testing and Agent Memory",
    excerpt:
      "Our biggest release yet brings mobile device emulation, persistent agent memory, and real-time collaboration features.",
    author: "Alex Chen",
    date: "January 2, 2026",
    readTime: "5 min",
    category: "Product Updates",
    slug: "betaforge-2-4-release",
  },
  {
    title: "How TechCorp Reduced Bug Leakage by 40% with AI Testing",
    excerpt:
      "Learn how TechCorp's engineering team integrated BetaForge into their CI/CD pipeline and dramatically improved their release quality.",
    author: "Emily Rodriguez",
    date: "December 28, 2025",
    readTime: "7 min",
    category: "Case Studies",
    slug: "techcorp-case-study",
  },
  {
    title: "Understanding AI Agent Personas: A Deep Dive",
    excerpt:
      "Explore the psychology and design principles behind our six unique AI agent personas and how each brings value to your testing strategy.",
    author: "Sarah Mitchell",
    date: "December 20, 2025",
    readTime: "10 min",
    category: "AI & Testing",
    slug: "understanding-ai-agent-personas",
  },
  {
    title: "Best Practices for Integrating AI Testing in CI/CD Pipelines",
    excerpt:
      "A comprehensive guide to setting up automated AI testing in your continuous integration workflow for maximum effectiveness.",
    author: "Marcus Johnson",
    date: "December 15, 2025",
    readTime: "12 min",
    category: "Best Practices",
    slug: "ai-testing-cicd-best-practices",
  },
  {
    title: "The Role of Accessibility Testing in Modern Software Development",
    excerpt:
      "Why accessibility testing should be a first-class citizen in your QA process and how AI can help identify issues early.",
    author: "Ahmed Patel",
    date: "December 10, 2025",
    readTime: "6 min",
    category: "Best Practices",
    slug: "accessibility-testing-importance",
  },
  {
    title: "Building Resilient Error Boundaries: Lessons from Chaos Testing",
    excerpt:
      "What we've learned from our chaos testing agent Diego and how you can apply these lessons to build more robust applications.",
    author: "David Kim",
    date: "December 5, 2025",
    readTime: "9 min",
    category: "Engineering",
    slug: "resilient-error-boundaries",
  },
  {
    title: "BetaForge Raises $25M Series A to Accelerate AI Testing Innovation",
    excerpt:
      "We're thrilled to announce our Series A funding led by Sequoia Capital to expand our team and product capabilities.",
    author: "Alex Chen",
    date: "November 28, 2025",
    readTime: "4 min",
    category: "Company News",
    slug: "series-a-announcement",
  },
  {
    title: "The Psychology of User Testing: What AI Agents Teach Us",
    excerpt:
      "Insights from analyzing millions of AI-simulated user sessions and what they reveal about human behavior patterns.",
    author: "Lisa Wang",
    date: "November 20, 2025",
    readTime: "8 min",
    category: "AI & Testing",
    slug: "psychology-of-user-testing",
  },
  {
    title: "Comparing AI Testing Tools: BetaForge vs Traditional Automation",
    excerpt:
      "An honest comparison of AI-powered testing versus traditional automation frameworks like Selenium, Cypress, and Playwright.",
    author: "Marcus Johnson",
    date: "November 15, 2025",
    readTime: "11 min",
    category: "Engineering",
    slug: "ai-testing-vs-traditional-automation",
  },
];

const trendingPosts = [
  "The Future of Software Testing: How AI Agents Are Changing Everything",
  "Understanding AI Agent Personas: A Deep Dive",
  "Best Practices for Integrating AI Testing in CI/CD Pipelines",
  "How TechCorp Reduced Bug Leakage by 40% with AI Testing",
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-void-black">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 mesh-bg opacity-30" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-neural/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-electric-cyan/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-void-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-neural-bright to-electric-cyan flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">BetaForge</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/about" className="text-phantom-gray hover:text-ghost-white text-sm transition-colors">
                About
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-lg bg-neural/20 text-ghost-white text-sm font-medium hover:bg-neural/30 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-neural/20 mb-6">
              <BookOpen className="w-4 h-4 text-neural-bright" />
              <span className="text-sm text-phantom-gray">BetaForge Blog</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="text-ghost-white">Insights on </span>
              <span className="gradient-text">AI & Testing</span>
            </h1>
            <p className="text-lg text-phantom-gray max-w-2xl mx-auto">
              Stories, tutorials, and insights from the BetaForge team on AI-powered
              testing, software quality, and engineering best practices.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mist-gray" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-12 pr-4 py-3 bg-void-elevated border border-white/10 rounded-xl text-ghost-white placeholder:text-mist-gray focus:outline-none focus:border-neural/50 transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="relative pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <Link
            href={`/blog/${featuredPost.slug}`}
            className="block group"
          >
            <div className="relative p-8 md:p-12 bg-void-elevated border border-white/5 rounded-3xl overflow-hidden hover:border-neural/30 transition-all">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-neural/20 to-transparent opacity-50" />
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neural/20 text-neural-bright text-sm mb-4">
                    Featured
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-ghost-white mb-4 group-hover:text-neural-bright transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-phantom-gray mb-6">{featuredPost.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-mist-gray">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {featuredPost.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {featuredPost.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime}
                    </span>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="aspect-video rounded-2xl bg-gradient-to-br from-neural/30 to-electric-cyan/30 flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-neural-bright opacity-50" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="relative pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? "bg-neural/20 text-ghost-white border border-neural/30"
                    : "bg-void-elevated text-phantom-gray border border-white/5 hover:border-white/10"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="relative py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Posts */}
            <div className="lg:col-span-2">
              <div className="grid gap-6">
                {filteredPosts.map((post, index) => (
                  <Link
                    key={index}
                    href={`/blog/${post.slug}`}
                    className="group p-6 bg-void-elevated border border-white/5 rounded-2xl hover:border-neural/30 transition-all"
                  >
                    <div className="flex items-start gap-2 mb-3">
                      <span className="px-2 py-0.5 text-xs rounded-full bg-void-black text-phantom-gray border border-white/10">
                        {post.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-ghost-white mb-2 group-hover:text-neural-bright transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-phantom-gray text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-mist-gray">
                      <div className="flex items-center gap-4">
                        <span>{post.author}</span>
                        <span>{post.date}</span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {filteredPosts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-phantom-gray">No articles found matching your criteria.</p>
                </div>
              )}

              {/* Load More */}
              <div className="mt-8 text-center">
                <button className="px-6 py-3 bg-void-elevated border border-white/10 rounded-xl text-phantom-gray hover:text-ghost-white hover:border-white/20 transition-all">
                  Load More Articles
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Trending */}
              <div className="p-6 bg-void-elevated border border-white/5 rounded-2xl">
                <h3 className="text-lg font-semibold text-ghost-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-neural-bright" />
                  Trending
                </h3>
                <div className="space-y-4">
                  {trendingPosts.map((title, index) => (
                    <Link
                      key={index}
                      href="#"
                      className="block text-sm text-phantom-gray hover:text-ghost-white transition-colors"
                    >
                      <span className="text-neural-bright mr-2">{index + 1}.</span>
                      {title}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="p-6 bg-gradient-to-br from-neural/10 to-electric-cyan/10 border border-neural/20 rounded-2xl">
                <h3 className="text-lg font-semibold text-ghost-white mb-2">
                  Subscribe to Our Newsletter
                </h3>
                <p className="text-sm text-phantom-gray mb-4">
                  Get the latest articles and updates delivered to your inbox.
                </p>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 bg-void-black border border-white/10 rounded-lg text-ghost-white placeholder:text-mist-gray focus:outline-none focus:border-neural/50 mb-3"
                />
                <button className="w-full py-2 bg-gradient-to-r from-neural to-electric-cyan text-white font-semibold rounded-lg hover:shadow-glow transition-all">
                  Subscribe
                </button>
              </div>

              {/* CTA */}
              <div className="p-6 bg-void-elevated border border-white/5 rounded-2xl">
                <h3 className="text-lg font-semibold text-ghost-white mb-2">
                  Try BetaForge Free
                </h3>
                <p className="text-sm text-phantom-gray mb-4">
                  Start testing with AI agents today. No credit card required.
                </p>
                <Link
                  href="/signup"
                  className="flex items-center justify-center gap-2 w-full py-2 border border-neural/30 text-neural-bright rounded-lg hover:bg-neural/10 transition-all"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
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
