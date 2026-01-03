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
  AlertCircle,
  Wrench,
  Bot,
  FileCode,
  Layers,
  Play,
  Monitor,
  Globe,
  Smartphone,
} from "lucide-react";
import { Footer } from "@/components/layout";

const comparisonTable = [
  {
    feature: "Setup Time",
    betaforge: "5 minutes - just provide URL",
    cypress: "Hours to configure and write tests",
    winner: "betaforge",
  },
  {
    feature: "Test Maintenance",
    betaforge: "Zero - AI adapts automatically",
    cypress: "Moderate - less brittle than Selenium",
    winner: "betaforge",
  },
  {
    feature: "Code Required",
    betaforge: "No code needed",
    cypress: "JavaScript/TypeScript required",
    winner: "betaforge",
  },
  {
    feature: "Test Discovery",
    betaforge: "AI explores and finds issues autonomously",
    cypress: "Only tests what you explicitly write",
    winner: "betaforge",
  },
  {
    feature: "Browser Support",
    betaforge: "Chrome, Firefox, Safari, Edge",
    cypress: "Chrome, Firefox, Edge (Safari limited)",
    winner: "betaforge",
  },
  {
    feature: "Developer Experience",
    betaforge: "Dashboard-based, visual feedback",
    cypress: "Excellent DX with time travel debugging",
    winner: "cypress",
  },
  {
    feature: "Parallel Execution",
    betaforge: "Built-in, unlimited agents",
    cypress: "Paid feature (Cypress Cloud)",
    winner: "betaforge",
  },
  {
    feature: "Cross-Origin Testing",
    betaforge: "Full support, no restrictions",
    cypress: "Limited, requires workarounds",
    winner: "betaforge",
  },
  {
    feature: "Mobile Testing",
    betaforge: "Native mobile app testing",
    cypress: "Web viewport only, no native",
    winner: "betaforge",
  },
  {
    feature: "Open Source",
    betaforge: "Proprietary SaaS",
    cypress: "MIT License (core)",
    winner: "cypress",
  },
  {
    feature: "CI/CD Integration",
    betaforge: "Native webhooks for all platforms",
    cypress: "Excellent CI integration",
    winner: "tie",
  },
  {
    feature: "Visual Testing",
    betaforge: "Built-in visual regression",
    cypress: "Requires plugins or Cypress Cloud",
    winner: "betaforge",
  },
];

const metrics = [
  { label: "Faster Setup", value: "50x", icon: Zap },
  { label: "Browser Coverage", value: "100%", icon: Globe },
  { label: "Mobile Support", value: "Full", icon: Smartphone },
  { label: "Less Maintenance", value: "85%", icon: Wrench },
];

const cypressLimitations = [
  {
    title: "Single Tab Limitation",
    description: "Cypress can't test multi-tab workflows. BetaForge agents handle complex multi-window scenarios naturally.",
    icon: Layers,
  },
  {
    title: "Cross-Origin Restrictions",
    description: "Testing across different domains requires workarounds in Cypress. BetaForge has no such limitations.",
    icon: Globe,
  },
  {
    title: "No Native Mobile",
    description: "Cypress only tests mobile viewports, not actual mobile apps. BetaForge tests native iOS and Android.",
    icon: Smartphone,
  },
  {
    title: "Code-First Approach",
    description: "Every test requires JavaScript expertise. BetaForge's natural language goals let anyone create tests.",
    icon: Code2,
  },
];

const codeComparison = {
  cypress: `// Cypress test
describe('Login Flow', () => {
  it('should login successfully', () => {
    cy.visit('/login')
    
    cy.get('[data-testid="email"]')
      .type('user@example.com')
    
    cy.get('[data-testid="password"]')
      .type('password123')
    
    cy.get('[data-testid="submit"]')
      .click()
    
    cy.url().should('include', '/dashboard')
    cy.get('[data-testid="welcome"]')
      .should('contain', 'Welcome')
  })
  
  it('should show error on invalid login', () => {
    cy.visit('/login')
    cy.get('[data-testid="email"]').type('bad')
    cy.get('[data-testid="submit"]').click()
    cy.get('.error').should('be.visible')
  })
})`,
  betaforge: `// BetaForge configuration
{
  "url": "https://app.example.com",
  "goals": [
    "Test login with valid credentials",
    "Test login with invalid inputs",
    "Explore error handling",
    "Check accessibility"
  ],
  "agents": ["sarah", "diego", "ahmed"]
}

// AI agents automatically:
// - Find the login form
// - Test edge cases you didn't think of
// - Verify accessibility
// - Generate detailed reports`,
};

const testimonials = [
  {
    quote: "We love Cypress for component testing, but BetaForge catches things our Cypress E2E tests miss. The AI explores paths we never thought to script.",
    author: "Amanda Foster",
    role: "Frontend Lead, SaaS Platform",
    result: "30% more bugs caught",
  },
  {
    quote: "Cypress is great but the maintenance was killing us. Adding BetaForge for exploratory testing let us focus Cypress on critical paths only.",
    author: "Chris Martinez",
    role: "QA Manager, E-commerce Co",
    result: "60% less test code",
  },
];

const whenToUse = [
  {
    tool: "BetaForge",
    useCases: [
      "Exploratory testing at scale",
      "Regression testing on every deploy",
      "Mobile native app testing",
      "Accessibility testing",
      "Teams without dedicated test engineers",
    ],
  },
  {
    tool: "Cypress",
    useCases: [
      "Component-level testing",
      "API testing",
      "Developer-driven TDD workflow",
      "Debugging with time-travel",
      "Custom assertion logic",
    ],
  },
];

export default function CompareCypressPage() {
  const betaforgeWins = comparisonTable.filter((row) => row.winner === "betaforge").length;
  const cypressWins = comparisonTable.filter((row) => row.winner === "cypress").length;
  const ties = comparisonTable.filter((row) => row.winner === "tie").length;

  return (
    <div className="min-h-screen bg-void-black">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 mesh-bg opacity-30" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-neural/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-[#04C38E]/10 rounded-full blur-[100px]" />
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
            <span className="gradient-text">Cypress</span>
          </h1>
          <p className="text-lg text-phantom-gray max-w-3xl mx-auto mb-8">
            Cypress revolutionized frontend testing with its developer experience. BetaForge
            takes it further with AI that explores your app autonomously—no code required.
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
              <div className="w-16 h-16 rounded-2xl bg-[#04C38E]/20 flex items-center justify-center">
                <Play className="w-8 h-8 text-[#04C38E]" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-ghost-white">{cypressWins}</div>
                <div className="text-sm text-phantom-gray">Cypress Wins</div>
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
            Code vs Configuration
          </h2>
          <p className="text-phantom-gray text-center mb-12 max-w-2xl mx-auto">
            Cypress requires well-crafted test code. BetaForge just needs your goals.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Play className="w-5 h-5 text-[#04C38E]" />
                <span className="font-semibold text-ghost-white">Cypress</span>
                <span className="text-xs px-2 py-1 rounded bg-[#04C38E]/20 text-[#04C38E]">JavaScript</span>
              </div>
              <div className="p-4 bg-void-elevated border border-white/10 rounded-2xl overflow-auto max-h-[400px]">
                <pre className="text-xs text-phantom-gray font-mono leading-relaxed">
                  {codeComparison.cypress}
                </pre>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Bot className="w-5 h-5 text-neural-bright" />
                <span className="font-semibold text-ghost-white">BetaForge</span>
                <span className="text-xs px-2 py-1 rounded bg-neural/20 text-neural-bright">No-code</span>
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

      {/* Cypress Limitations */}
      <section className="relative py-16 px-6 bg-void-elevated/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-ghost-white text-center mb-4">
            Cypress Limitations BetaForge Solves
          </h2>
          <p className="text-phantom-gray text-center mb-12 max-w-2xl mx-auto">
            We love Cypress, but these architectural constraints can limit your testing.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {cypressLimitations.map((item, index) => (
              <div
                key={index}
                className="p-6 bg-void-black border border-white/10 rounded-2xl"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-red-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-ghost-white">
                    {item.title}
                  </h3>
                </div>
                <p className="text-phantom-gray">{item.description}</p>
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
                  <span className="font-semibold text-ghost-white">BetaForge</span>
                </div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center gap-2">
                  <Play className="w-5 h-5 text-[#04C38E]" />
                  <span className="font-semibold text-ghost-white">Cypress</span>
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
                    row.winner === "cypress" ? "text-quantum-green" : "text-phantom-gray"
                  }`}>
                    {row.winner === "cypress" && <Check className="w-5 h-5" />}
                    <span className="text-sm">{row.cypress}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* When to Use Each */}
      <section className="relative py-16 px-6 bg-void-elevated/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-ghost-white text-center mb-12">
            When to Use Each Tool
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {whenToUse.map((item, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl ${
                  item.tool === "BetaForge"
                    ? "bg-gradient-to-br from-neural/10 to-electric-cyan/10 border border-neural/30"
                    : "bg-void-black border border-white/10"
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  {item.tool === "BetaForge" ? (
                    <Bot className="w-6 h-6 text-neural-bright" />
                  ) : (
                    <Play className="w-6 h-6 text-[#04C38E]" />
                  )}
                  <h3 className="text-xl font-semibold text-ghost-white">
                    Use {item.tool} for:
                  </h3>
                </div>
                <ul className="space-y-2">
                  {item.useCases.map((useCase, i) => (
                    <li key={i} className="flex items-center gap-2 text-phantom-gray">
                      <Check className="w-4 h-4 text-quantum-green" />
                      {useCase}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-ghost-white text-center mb-12">
            From Cypress Users
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
            Complement Your Cypress Tests
          </h2>
          <p className="text-lg text-phantom-gray mb-8 max-w-2xl mx-auto">
            Add AI-powered exploratory testing to your existing Cypress workflow.
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
