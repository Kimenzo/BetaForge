"use client";

import Link from "next/link";
import {
  Sparkles,
  Newspaper,
  Download,
  ExternalLink,
  Mail,
  Image,
  FileText,
  Quote,
  ArrowRight,
  Calendar,
  Building2,
  Users,
  Globe,
  Award,
  TrendingUp,
} from "lucide-react";
import { Footer } from "@/components/layout";

const companyFacts = [
  { label: "Founded", value: "2023" },
  { label: "Headquarters", value: "San Francisco, CA" },
  { label: "Employees", value: "50+" },
  { label: "Customers", value: "500+" },
  { label: "Funding", value: "$30M" },
  { label: "Countries", value: "40+" },
];

const pressReleases = [
  {
    date: "January 2, 2026",
    title: "BetaForge Launches Mobile Testing and Agent Memory Features",
    excerpt:
      "New capabilities enable AI agents to test mobile applications and maintain context across testing sessions.",
  },
  {
    date: "November 28, 2025",
    title: "BetaForge Raises $25M Series A to Accelerate AI Testing Innovation",
    excerpt:
      "Funding led by Sequoia Capital will be used to expand team and develop new enterprise features.",
  },
  {
    date: "October 20, 2025",
    title: "BetaForge 2.0: Complete Platform Redesign with New AI Engine",
    excerpt:
      "Major release introduces 6 unique AI agent personas powered by Claude for more human-like testing.",
  },
  {
    date: "August 15, 2025",
    title: "BetaForge Achieves SOC 2 Type II Certification",
    excerpt:
      "Security milestone enables enterprise customers to adopt AI-powered testing with confidence.",
  },
  {
    date: "March 10, 2024",
    title: "BetaForge Launches from Stealth with $5M Seed Funding",
    excerpt:
      "Y Combinator-backed startup introduces autonomous AI agents for software beta testing.",
  },
];

const mediaCoverage = [
  {
    publication: "TechCrunch",
    title: "BetaForge uses AI agents to find bugs before your users do",
    date: "November 2025",
  },
  {
    publication: "The Verge",
    title: "The future of software testing is AI-powered agents",
    date: "October 2025",
  },
  {
    publication: "Wired",
    title: "How autonomous AI is revolutionizing QA",
    date: "September 2025",
  },
  {
    publication: "Forbes",
    title: "30 Under 30: BetaForge founders making waves in AI",
    date: "August 2025",
  },
  {
    publication: "VentureBeat",
    title: "BetaForge raises $25M to expand AI testing platform",
    date: "November 2025",
  },
];

const logos = [
  { name: "Primary Logo", description: "Full color on dark background", format: "SVG, PNG" },
  { name: "White Logo", description: "For dark backgrounds", format: "SVG, PNG" },
  { name: "Icon Only", description: "App icon and favicons", format: "SVG, PNG, ICO" },
  { name: "Wordmark", description: "Text-only version", format: "SVG, PNG" },
];

const boilerplate = `BetaForge is an AI-powered beta testing platform that deploys autonomous AI agents to test web, mobile, and desktop applications. Founded in 2023, BetaForge's unique approach uses six distinct AI personas, each with specialized testing behaviors, to find bugs that traditional testing misses. Powered by Claude AI, BetaForge agents generate detailed, human-readable bug reports with reproduction steps, severity ratings, and suggested fixes. Over 500 companies worldwide use BetaForge to ship better software faster.`;

const leadership = [
  {
    name: "Alex Chen",
    role: "CEO & Co-Founder",
    bio: "Former VP of Engineering at Stripe with 15+ years building developer tools.",
    image: "AC",
  },
  {
    name: "Sarah Mitchell",
    role: "CTO & Co-Founder",
    bio: "PhD in AI from Stanford. Previously led AI research at Google DeepMind.",
    image: "SM",
  },
];

export default function PressPage() {
  return (
    <div className="min-h-screen bg-void-black">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 mesh-bg opacity-30" />
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-neural/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-plasma-pink/10 rounded-full blur-[100px]" />
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
                href="/contact"
                className="px-4 py-2 rounded-lg bg-neural/20 text-ghost-white text-sm font-medium hover:bg-neural/30 transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-neural/20 mb-6">
            <Newspaper className="w-4 h-4 text-neural-bright" />
            <span className="text-sm text-phantom-gray">Press & Media</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-ghost-white">Press Kit & </span>
            <span className="gradient-text">Media Resources</span>
          </h1>
          <p className="text-lg text-phantom-gray max-w-2xl mx-auto mb-8">
            Everything you need to tell the BetaForge story. Download brand assets,
            access press releases, and get in touch with our communications team.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neural to-electric-cyan text-white font-semibold hover:shadow-glow transition-all"
            >
              <Download className="w-5 h-5" />
              Download Press Kit
            </a>
            <a
              href="mailto:press@betaforge.ai"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-ghost-white font-semibold hover:border-neural/30 transition-all"
            >
              <Mail className="w-5 h-5" />
              Media Inquiries
            </a>
          </div>
        </div>
      </section>

      {/* Company Facts */}
      <section className="relative py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {companyFacts.map((fact, index) => (
              <div
                key={index}
                className="p-4 bg-void-elevated border border-white/5 rounded-xl text-center"
              >
                <div className="text-2xl font-bold gradient-text mb-1">{fact.value}</div>
                <div className="text-sm text-phantom-gray">{fact.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Boilerplate */}
      <section className="relative py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 bg-void-elevated border border-white/5 rounded-3xl">
            <div className="flex items-center gap-3 mb-6">
              <Quote className="w-8 h-8 text-neural-bright" />
              <h2 className="text-2xl font-bold text-ghost-white">About BetaForge</h2>
            </div>
            <p className="text-lg text-phantom-gray leading-relaxed mb-6">
              {boilerplate}
            </p>
            <button className="flex items-center gap-2 text-neural-bright hover:underline text-sm">
              <FileText className="w-4 h-4" />
              Copy to clipboard
            </button>
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="relative py-16 px-6 bg-void-elevated/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-ghost-white mb-8">
            Press Releases
          </h2>
          <div className="space-y-4">
            {pressReleases.map((release, index) => (
              <Link
                key={index}
                href="#"
                className="block group p-6 bg-void-black border border-white/10 rounded-2xl hover:border-neural/30 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-mist-gray mb-2">
                      <Calendar className="w-4 h-4" />
                      {release.date}
                    </div>
                    <h3 className="text-xl font-semibold text-ghost-white group-hover:text-neural-bright transition-colors mb-2">
                      {release.title}
                    </h3>
                    <p className="text-phantom-gray">{release.excerpt}</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-mist-gray group-hover:text-neural-bright transition-colors flex-shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Media Coverage */}
      <section className="relative py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-ghost-white mb-8">
            Media Coverage
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {mediaCoverage.map((article, index) => (
              <Link
                key={index}
                href="#"
                className="group p-6 bg-void-elevated border border-white/5 rounded-2xl hover:border-neural/30 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-neural-bright">
                    {article.publication}
                  </span>
                  <span className="text-xs text-mist-gray">{article.date}</span>
                </div>
                <h3 className="text-lg font-semibold text-ghost-white group-hover:text-neural-bright transition-colors">
                  {article.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Logos & Brand Assets */}
      <section className="relative py-16 px-6 bg-void-elevated/50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-ghost-white">
              Logos & Brand Assets
            </h2>
            <a
              href="#"
              className="flex items-center gap-2 text-neural-bright hover:underline"
            >
              <Download className="w-4 h-4" />
              Download All
            </a>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {logos.map((logo, index) => (
              <div
                key={index}
                className="p-6 bg-void-black border border-white/10 rounded-2xl"
              >
                <div className="aspect-square bg-gradient-to-br from-neural/10 to-electric-cyan/10 rounded-xl flex items-center justify-center mb-4">
                  <Sparkles className="w-12 h-12 text-neural-bright" />
                </div>
                <h3 className="font-semibold text-ghost-white mb-1">{logo.name}</h3>
                <p className="text-sm text-phantom-gray mb-2">{logo.description}</p>
                <p className="text-xs text-mist-gray">{logo.format}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 p-6 bg-void-black border border-white/10 rounded-2xl">
            <h3 className="font-semibold text-ghost-white mb-2">Brand Guidelines</h3>
            <p className="text-phantom-gray text-sm mb-4">
              Please follow our brand guidelines when using BetaForge assets. Download
              the complete brand book for colors, typography, and usage rules.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-neural-bright hover:underline text-sm"
            >
              <Download className="w-4 h-4" />
              Download Brand Guidelines (PDF)
            </a>
          </div>
        </div>
      </section>

      {/* Executive Bios */}
      <section className="relative py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-ghost-white mb-8">
            Executive Bios
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {leadership.map((person, index) => (
              <div
                key={index}
                className="p-6 bg-void-elevated border border-white/5 rounded-2xl"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neural to-electric-cyan flex items-center justify-center text-white font-bold text-xl">
                    {person.image}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-ghost-white">
                      {person.name}
                    </h3>
                    <p className="text-neural-bright">{person.role}</p>
                  </div>
                </div>
                <p className="text-phantom-gray mb-4">{person.bio}</p>
                <a
                  href="#"
                  className="text-sm text-neural-bright hover:underline flex items-center gap-1"
                >
                  Download headshot
                  <Download className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Contact */}
      <section className="relative py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-12 rounded-3xl overflow-hidden text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-neural/20 to-electric-cyan/20" />
            <div className="absolute inset-0 border border-neural/30 rounded-3xl" />
            <div className="relative">
              <Mail className="w-12 h-12 text-neural-bright mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-ghost-white mb-4">
                Media Inquiries
              </h2>
              <p className="text-lg text-phantom-gray mb-6 max-w-xl mx-auto">
                For press inquiries, interview requests, or additional information,
                please contact our communications team.
              </p>
              <a
                href="mailto:press@betaforge.ai"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-neural to-electric-cyan text-white font-semibold hover:shadow-glow transition-all"
              >
                press@betaforge.ai
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
