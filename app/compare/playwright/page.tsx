"use client";

import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Check,
  Code2,
  Zap,
  Target,
  TrendingUp,
  Brain,
  Clock,
  Wrench,
  Bot,
  FileCode,
  Layers,
  Monitor,
  Globe,
  Smartphone,
  Terminal,
  Settings,
  GitBranch,
  Video,
  Camera,
} from "lucide-react";
import { Footer } from "@/components/layout";

const comparisonTable = [
  {
    feature: "Setup Complexity",
    betaforge: "5 minutes - just provide URL",
    playwright: "Moderate - CLI install, config setup",
    winner: "betaforge",
  },
  {
    feature: "Test Maintenance",
    betaforge: "Zero - AI adapts to changes",
    playwright: "Moderate - better than Selenium",
    winner: "betaforge",
  },
  {
    feature: "Programming Required",
    betaforge: "No code needed",
    playwright: "TypeScript/JavaScript/Python/C#/.NET",
    winner: "betaforge",
  },
  {
    feature: "Autonomous Exploration",
    betaforge: "AI explores and discovers issues",
    playwright: "Only executes scripted tests",
    winner: "betaforge",
  },
  {
    feature: "Browser Support",
    betaforge: "Chrome, Firefox, Safari, Edge",
    playwright: "Chrome, Firefox, Safari, Edge",
    winner: "tie",
  },
  {
    feature: "Parallel Execution",
    betaforge: "Built-in, unlimited agents",
    playwright: "Built-in, excellent parallelism",
    winner: "tie",
  },
  {
    feature: "Auto-Waiting",
    betaforge: "AI handles naturally",
    playwright: "Excellent built-in auto-wait",
    winner: "tie",
  },
  {
    feature: "Code Generation",
    betaforge: "Not needed - AI tests autonomously",
    playwright: "Excellent codegen tool",
    winner: "playwright",
  },
  {
    feature: "Mobile Testing",
    betaforge: "Native iOS/Android apps",
    playwright: "Mobile browser emulation only",
    winner: "betaforge",
  },
  {
    feature: "Multi-Tab/Multi-Origin",
    betaforge: "Full support",
    playwright: "Full support",
    winner: "tie",
  },
  {
    feature: "Trace Viewer",
    betaforge: "Session recordings with AI insights",
    playwright: "Excellent trace viewer",
    winner: "tie",
  },
  {
    feature: "Open Source",
    betaforge: "Proprietary SaaS",
    playwright: "Apache 2.0 License",
    winner: "playwright",
  },
];

const metrics = [
  { label: "Faster Setup", value: "20x", icon: Zap },
  { label: "Less Code", value: "100%", icon: Code2 },
  { label: "Native Mobile", value: "Yes", icon: Smartphone },
  { label: "AI Discovery", value: "∞", icon: Brain },
];

const playwrightStrengths = [
  {
    title: "Code Generation",
    description: "Playwright's codegen records your actions and generates test code. Great for developers who want to script.",
    icon: Terminal,
  },
  {
    title: "Trace Viewer",
    description: "Time-travel debugging with snapshots, network logs, and console output at every step.",
    icon: Video,
  },
  {
    title: "Multi-Language",
    description: "Write tests in TypeScript, JavaScript, Python, .NET, or Java—whatever your team prefers.",
    icon: FileCode,
  },
  {
    title: "Open Source",
    description: "Backed by Microsoft, Playwright is free and open source with an active community.",
    icon: GitBranch,
  },
];

const betaforgeAdvantages = [
  {
    title: "Zero Code Required",
    description: "Define testing goals in natural language. No programming expertise needed.",
    icon: Brain,
  },
  {
    title: "Autonomous Discovery",
    description: "AI agents explore your app and find bugs you never thought to test for.",
    icon: Target,
  },
  {
    title: "Native Mobile Apps",
    description: "Test actual iOS and Android applications, not just mobile viewports.",
    icon: Smartphone,
  },
  {
    title: "Human-Like Reports",
    description: "Bug reports read like they came from a human tester, not a test framework.",
    icon: FileCode,
  },
];

const codeComparison = {
  playwright: `// Playwright test
import { test, expect } from '@playwright/test';

test('user can complete checkout', async ({ page }) => {
  await page.goto('https://shop.example.com');
  
  // Add product to cart
  await page.click('[data-testid="product-1"]');
  await page.click('[data-testid="add-to-cart"]');
  
  // Go to checkout
  await page.click('[data-testid="cart-icon"]');
  await page.click('[data-testid="checkout-btn"]');
  
  // Fill shipping info
  await page.fill('#address', '123 Main St');
  await page.fill('#city', 'San Francisco');
  await page.selectOption('#state', 'CA');
  
  // Complete purchase
  await page.click('[data-testid="place-order"]');
  
  await expect(page.locator('.confirmation'))
    .toContainText('Order confirmed');
});`,
  betaforge: `// BetaForge configuration
{
  "url": "https://shop.example.com",
  "goals": [
    "Complete a product purchase",
    "Test checkout with various inputs",
    "Explore error handling",
    "Test on mobile viewport"
  ],
  "agents": ["sarah", "lin", "diego"]
}

// AI agents will:
// - Navigate the entire shopping flow
// - Test edge cases like empty cart
// - Try invalid inputs
// - Test responsive behavior
// - Generate detailed bug reports`,
};

const testimonials = [
  {
    quote: "Playwright is our go-to for E2E testing, but BetaForge finds issues our scripted tests miss. We use both—Playwright for critical paths, BetaForge for exploration.",
    author: "James Liu",
    role: "Principal Engineer, TechCorp",
    result: "45% more coverage",
  },
  {
    quote: "Our team doesn't have time to write Playwright tests for every feature. BetaForge gives us broad coverage while we focus critical test automation.",
    author: "Nina Patel",
    role: "Engineering Director, HealthTech",
    result: "2x faster releases",
  },
];

const integrationFlow = [
  { step: 1, title: "Playwright", description: "Critical path tests" },
  { step: 2, title: "BetaForge", description: "Exploratory & regression" },
  { step: 3, title: "CI/CD", description: "Both run on every push" },
  { step: 4, title: "Reports", description: "Unified quality dashboard" },
];

export default function ComparePlaywrightPage() {
  const betaforgeWins = comparisonTable.filter((row) => row.winner === "betaforge").length;
  const playwrightWins = comparisonTable.filter((row) => row.winner === "playwright").length;
  const ties = comparisonTable.filter((row) => row.winner === "tie").length;

  return (
    <div className="min-h-screen bg-void-black">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 mesh-bg opacity-30" />
        <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-neural/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#2EAD33]/10 rounded-full blur-[100px]" />
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
            <span className="gradient-text">Playwright</span>
          </h1>
          <p className="text-lg text-phantom-gray max-w-3xl mx-auto mb-8">
            Playwright is the modern standard for E2E testing. BetaForge complements it with
            AI-powered exploration that finds bugs before you even know to test for them.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-neural/20 flex items-center justify-center">
                <Bot className="w-8 h-8 text-neural-bright" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-ghost-white">{betaforgeWins}</div>
                <div className="text-sm text-phantom-gray">BetaForge Wins</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-[#2EAD33]/20 flex items-center justify-center">
                <Monitor className="w-8 h-8 text-[#2EAD33]" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-ghost-white">{playwrightWins}</div>
                <div className="text-sm text-phantom-gray">Playwright Wins</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-quantum-green/20 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-quantum-green" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-ghost-white">{ties}</div>
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
                <div className="text-3xl font-bold gradient-text mb-1">{metric.value}</div>
                <div className="text-sm text-phantom-gray">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Comparison */}
      <section className="relative py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-ghost-white text-center mb-4">
            Different Approaches, Same Goal
          </h2>
          <p className="text-phantom-gray text-center mb-12 max-w-2xl mx-auto">
            Playwright gives you precise control. BetaForge gives you autonomous exploration.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Monitor className="w-5 h-5 text-[#2EAD33]" />
                <span className="font-semibold text-ghost-white">Playwright</span>
                <span className="text-xs px-2 py-1 rounded bg-[#2EAD33]/20 text-[#2EAD33]">Code-based</span>
              </div>
              <div className="p-4 bg-void-elevated border border-white/10 rounded-2xl overflow-auto max-h-[400px]">
                <pre className="text-xs text-phantom-gray font-mono leading-relaxed">
                  {codeComparison.playwright}
                </pre>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Bot className="w-5 h-5 text-neural-bright" />
                <span className="font-semibold text-ghost-white">BetaForge</span>
                <span className="text-xs px-2 py-1 rounded bg-neural/20 text-neural-bright">AI-powered</span>
              </div>
              <div className="p-4 bg-void-elevated border border-neural/30 rounded-2xl overflow-auto max-h-[400px]">
                <pre className="text-xs text-neural-bright font-mono leading-relaxed">
                  {codeComparison.betaforge}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strengths Side by Side */}
      <section className="relative py-16 px-6 bg-void-elevated/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-ghost-white text-center mb-12">
            Each Tool Shines Differently
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Playwright Column */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#2EAD33]/20 flex items-center justify-center">
                  <Monitor className="w-5 h-5 text-[#2EAD33]" />
                </div>
                <h3 className="text-xl font-semibold text-ghost-white">Playwright Strengths</h3>
              </div>
              <div className="space-y-4">
                {playwrightStrengths.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-void-black border border-white/10 rounded-xl"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <item.icon className="w-5 h-5 text-[#2EAD33]" />
                      <h4 className="font-semibold text-ghost-white">{item.title}</h4>
                    </div>
                    <p className="text-sm text-phantom-gray">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* BetaForge Column */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-neural/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-neural-bright" />
                </div>
                <h3 className="text-xl font-semibold text-ghost-white">BetaForge Advantages</h3>
              </div>
              <div className="space-y-4">
                {betaforgeAdvantages.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-r from-neural/10 to-electric-cyan/10 border border-neural/30 rounded-xl"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <item.icon className="w-5 h-5 text-neural-bright" />
                      <h4 className="font-semibold text-ghost-white">{item.title}</h4>
                    </div>
                    <p className="text-sm text-phantom-gray">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
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
                  <span className="font-semibold text-ghost-white">BetaForge</span>
                </div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-[#2EAD33]" />
                  <span className="font-semibold text-ghost-white">Playwright</span>
                </div>
              </div>
            </div>
            {/* Table Rows */}
            {comparisonTable.map((row, index) => (
              <div
                key={index}
                className={`grid grid-cols-3 gap-4 p-6 ${
                  index !== comparisonTable.length - 1 ? "border-b border-white/5" : ""
                }`}
              >
                <div className="text-ghost-white font-medium">{row.feature}</div>
                <div className="text-center">
                  <div className={`inline-flex items-center gap-2 ${
                    row.winner === "betaforge" ? "text-quantum-green" : "text-phantom-gray"
                  }`}>
                    {row.winner === "betaforge" && <Check className="w-5 h-5" />}
                    <span className="text-sm">{row.betaforge}</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className={`inline-flex items-center gap-2 ${
                    row.winner === "playwright" ? "text-quantum-green" : "text-phantom-gray"
                  }`}>
                    {row.winner === "playwright" && <Check className="w-5 h-5" />}
                    <span className="text-sm">{row.playwright}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Flow */}
      <section className="relative py-16 px-6 bg-void-elevated/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-ghost-white text-center mb-4">
            Better Together
          </h2>
          <p className="text-phantom-gray text-center mb-12 max-w-2xl mx-auto">
            The best teams use both. Here's how they fit into your workflow.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4">
            {integrationFlow.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-void-black border border-white/10 flex items-center justify-center mb-2">
                    <span className="text-2xl font-bold gradient-text">{item.step}</span>
                  </div>
                  <div className="text-sm font-semibold text-ghost-white">{item.title}</div>
                  <div className="text-xs text-phantom-gray">{item.description}</div>
                </div>
                {index < integrationFlow.length - 1 && (
                  <ArrowRight className="w-6 h-6 text-mist-gray" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-ghost-white text-center mb-12">
            From Playwright Users
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 bg-void-elevated border border-white/10 rounded-2xl"
              >
                <div className="inline-block px-3 py-1 rounded-full bg-quantum-green/20 text-quantum-green text-sm mb-4">
                  {testimonial.result}
                </div>
                <p className="text-ghost-white text-lg mb-4">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold text-ghost-white">{testimonial.author}</div>
                  <div className="text-sm text-phantom-gray">{testimonial.role}</div>
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
            Enhance Your Playwright Strategy
          </h2>
          <p className="text-lg text-phantom-gray mb-8 max-w-2xl mx-auto">
            Add AI-powered exploration to your existing test automation.
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
