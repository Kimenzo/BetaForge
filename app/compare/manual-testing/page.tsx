"use client";

import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Check,
  X,
  Clock,
  DollarSign,
  Users,
  Zap,
  Target,
  TrendingUp,
  Brain,
  Eye,
  Repeat,
  MousePointer,
  AlertTriangle,
  Bot,
} from "lucide-react";
import { Footer } from "@/components/layout";

const comparisonTable = [
  {
    feature: "Test Execution Speed",
    betaforge: "Runs 100s of tests in parallel, 24/7",
    manual: "Limited by human speed and working hours",
    winner: "betaforge",
  },
  {
    feature: "Coverage Depth",
    betaforge: "6 AI personas cover diverse user behaviors",
    manual: "Limited perspectives from individual testers",
    winner: "betaforge",
  },
  {
    feature: "Consistency",
    betaforge: "100% consistent execution every time",
    manual: "Human error and fatigue impact results",
    winner: "betaforge",
  },
  {
    feature: "Cost Efficiency",
    betaforge: "Fixed monthly cost, unlimited tests",
    manual: "$50-150/hour per QA engineer",
    winner: "betaforge",
  },
  {
    feature: "Creative Thinking",
    betaforge: "AI explores unexpected edge cases",
    manual: "Human intuition finds unusual issues",
    winner: "tie",
  },
  {
    feature: "User Empathy",
    betaforge: "Simulates diverse user personas",
    manual: "Real human perspective and feedback",
    winner: "manual",
  },
  {
    feature: "Scalability",
    betaforge: "Instantly scale to any workload",
    manual: "Requires hiring and training",
    winner: "betaforge",
  },
  {
    feature: "Report Quality",
    betaforge: "Detailed, structured, reproducible reports",
    manual: "Varies by tester experience",
    winner: "betaforge",
  },
  {
    feature: "Setup Time",
    betaforge: "Minutes to start testing",
    manual: "Days/weeks to onboard QA team",
    winner: "betaforge",
  },
  {
    feature: "Regression Testing",
    betaforge: "Automated, runs on every deployment",
    manual: "Time-consuming and often skipped",
    winner: "betaforge",
  },
];

const metrics = [
  { label: "Faster Bug Discovery", value: "10x", icon: Zap },
  { label: "Cost Reduction", value: "75%", icon: DollarSign },
  { label: "More Test Coverage", value: "40x", icon: Target },
  { label: "Fewer Escaped Bugs", value: "90%", icon: AlertTriangle },
];

const useCases = [
  {
    title: "Regression Testing",
    description:
      "BetaForge runs comprehensive regression suites on every commit while your team focuses on new features.",
    icon: Repeat,
  },
  {
    title: "Exploratory Testing",
    description:
      "AI agents explore your app like real users, finding edge cases human testers might miss.",
    icon: Eye,
  },
  {
    title: "Load & Scale Testing",
    description:
      "Simulate thousands of concurrent users without managing a large QA team.",
    icon: Users,
  },
  {
    title: "Continuous Monitoring",
    description:
      "24/7 testing catches issues during off-hours when manual testers aren't available.",
    icon: Clock,
  },
];

const testimonials = [
  {
    quote:
      "We replaced 80% of our manual regression testing with BetaForge. Our QA team now focuses on strategic testing while AI handles the repetitive work.",
    author: "Jennifer Walsh",
    role: "Director of QA, FinanceApp",
    result: "50% faster releases",
  },
  {
    quote:
      "BetaForge finds bugs our manual testers miss. The AI agents think differently and explore paths humans don't consider.",
    author: "Michael Torres",
    role: "VP Engineering, RetailCloud",
    result: "70% fewer production bugs",
  },
];

export default function CompareManualTestingPage() {
  const betaforgeWins = comparisonTable.filter(
    (row) => row.winner === "betaforge"
  ).length;
  const manualWins = comparisonTable.filter(
    (row) => row.winner === "manual"
  ).length;
  const ties = comparisonTable.filter((row) => row.winner === "tie").length;

  return (
    <div className="min-h-screen bg-void-black">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 mesh-bg opacity-30" />
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-neural/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-quantum-green/10 rounded-full blur-[100px]" />
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
            <Link
              href="/pricing"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-neural to-electric-cyan text-white text-sm font-medium hover:shadow-glow transition-all"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-neural/20 mb-6">
            <Target className="w-4 h-4 text-neural-bright" />
            <span className="text-sm text-phantom-gray">Comparison</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-ghost-white">BetaForge vs </span>
            <span className="gradient-text">Manual Testing</span>
          </h1>
          <p className="text-lg text-phantom-gray max-w-3xl mx-auto mb-8">
            See how AI-powered testing compares to traditional manual QA.
            BetaForge doesn't replace your QA team—it supercharges them by
            handling repetitive work so they can focus on what humans do best.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-neural/20 flex items-center justify-center">
                <Bot className="w-8 h-8 text-neural-bright" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-ghost-white">
                  {betaforgeWins}
                </div>
                <div className="text-sm text-phantom-gray">BetaForge Wins</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-plasma-pink/20 flex items-center justify-center">
                <MousePointer className="w-8 h-8 text-plasma-pink" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-ghost-white">
                  {manualWins}
                </div>
                <div className="text-sm text-phantom-gray">Manual Wins</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-quantum-green/20 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-quantum-green" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-ghost-white">
                  {ties}
                </div>
                <div className="text-sm text-phantom-gray">Ties</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="relative py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="p-6 bg-void-elevated border border-white/5 rounded-2xl text-center"
              >
                <metric.icon className="w-8 h-8 text-neural-bright mx-auto mb-3" />
                <div className="text-3xl font-bold gradient-text mb-1">
                  {metric.value}
                </div>
                <div className="text-sm text-phantom-gray">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="relative py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-ghost-white text-center mb-12">
            Feature-by-Feature Comparison
          </h2>
          <div className="bg-void-elevated border border-white/10 rounded-3xl overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-3 gap-4 p-6 border-b border-white/10 bg-void-black/50">
              <div className="text-phantom-gray font-medium">Feature</div>
              <div className="text-center">
                <div className="inline-flex items-center gap-2">
                  <Bot className="w-5 h-5 text-neural-bright" />
                  <span className="font-semibold text-ghost-white">
                    BetaForge
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center gap-2">
                  <MousePointer className="w-5 h-5 text-plasma-pink" />
                  <span className="font-semibold text-ghost-white">
                    Manual Testing
                  </span>
                </div>
              </div>
            </div>
            {/* Table Rows */}
            {comparisonTable.map((row, index) => (
              <div
                key={index}
                className={`grid grid-cols-3 gap-4 p-6 ${
                  index !== comparisonTable.length - 1
                    ? "border-b border-white/5"
                    : ""
                }`}
              >
                <div className="text-ghost-white font-medium">
                  {row.feature}
                </div>
                <div className="text-center">
                  <div
                    className={`inline-flex items-center gap-2 ${
                      row.winner === "betaforge"
                        ? "text-quantum-green"
                        : "text-phantom-gray"
                    }`}
                  >
                    {row.winner === "betaforge" && (
                      <Check className="w-5 h-5" />
                    )}
                    <span className="text-sm">{row.betaforge}</span>
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className={`inline-flex items-center gap-2 ${
                      row.winner === "manual"
                        ? "text-quantum-green"
                        : "text-phantom-gray"
                    }`}
                  >
                    {row.winner === "manual" && <Check className="w-5 h-5" />}
                    <span className="text-sm">{row.manual}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="relative py-16 px-6 bg-void-elevated/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-ghost-white text-center mb-4">
            When BetaForge Shines
          </h2>
          <p className="text-phantom-gray text-center mb-12 max-w-2xl mx-auto">
            AI testing excels in these scenarios, freeing your QA team for
            higher-value work.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="p-6 bg-void-black border border-white/10 rounded-2xl"
              >
                <useCase.icon className="w-10 h-10 text-neural-bright mb-4" />
                <h3 className="text-xl font-semibold text-ghost-white mb-2">
                  {useCase.title}
                </h3>
                <p className="text-phantom-gray">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Better Together */}
      <section className="relative py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="p-8 md:p-12 bg-gradient-to-r from-neural/10 to-electric-cyan/10 border border-neural/30 rounded-3xl">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 mb-4">
                  <Brain className="w-6 h-6 text-neural-bright" />
                  <span className="text-neural-bright font-medium">
                    Better Together
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-ghost-white mb-4">
                  AI + Human = Unstoppable QA
                </h2>
                <p className="text-phantom-gray mb-6">
                  The best testing strategy combines AI efficiency with human
                  creativity. Let BetaForge handle regression testing,
                  exploratory coverage, and 24/7 monitoring while your QA team
                  focuses on usability, strategic testing, and customer
                  experience.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-ghost-white">
                    <Check className="w-5 h-5 text-quantum-green" />
                    AI handles 80% of repetitive testing
                  </li>
                  <li className="flex items-center gap-2 text-ghost-white">
                    <Check className="w-5 h-5 text-quantum-green" />
                    Humans focus on strategic quality initiatives
                  </li>
                  <li className="flex items-center gap-2 text-ghost-white">
                    <Check className="w-5 h-5 text-quantum-green" />
                    Combined approach catches more bugs
                  </li>
                </ul>
              </div>
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-2xl bg-neural/20 flex items-center justify-center">
                  <Bot className="w-12 h-12 text-neural-bright" />
                </div>
                <div className="flex items-center text-3xl text-mist-gray">
                  +
                </div>
                <div className="w-24 h-24 rounded-2xl bg-plasma-pink/20 flex items-center justify-center">
                  <Users className="w-12 h-12 text-plasma-pink" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-16 px-6 bg-void-elevated/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-ghost-white text-center mb-12">
            What QA Leaders Say
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 bg-void-black border border-white/10 rounded-2xl"
              >
                <div className="inline-block px-3 py-1 rounded-full bg-quantum-green/20 text-quantum-green text-sm mb-4">
                  {testimonial.result}
                </div>
                <p className="text-ghost-white text-lg mb-4">
                  "{testimonial.quote}"
                </p>
                <div>
                  <div className="font-semibold text-ghost-white">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-phantom-gray">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-ghost-white mb-4">
            Ready to Supercharge Your QA?
          </h2>
          <p className="text-lg text-phantom-gray mb-8 max-w-2xl mx-auto">
            Start with a free trial and see how AI testing can transform your
            quality process.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-neural to-electric-cyan text-white font-semibold hover:shadow-glow transition-all"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/10 text-ghost-white font-semibold hover:border-neural/30 transition-all"
            >
              Watch Demo
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
