"use client";

import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Check,
  X,
  Code2,
  Zap,
  Target,
  TrendingUp,
  Brain,
  Settings,
  Clock,
  AlertCircle,
  Wrench,
  RefreshCw,
  Bot,
  FileCode,
  DollarSign,
  Gauge,
} from "lucide-react";
import { Footer } from "@/components/layout";

const comparisonTable = [
  {
    feature: "Setup Time",
    betaforge: "5 minutes - just provide URL",
    selenium: "Days/weeks to write test scripts",
    winner: "betaforge",
  },
  {
    feature: "Maintenance",
    betaforge: "Zero - AI adapts to UI changes",
    selenium: "High - brittle selectors break often",
    winner: "betaforge",
  },
  {
    feature: "Code Required",
    betaforge: "No code - natural language goals",
    selenium: "Java/Python/C#/JS expertise needed",
    winner: "betaforge",
  },
  {
    feature: "Test Coverage",
    betaforge: "Exploratory + goal-driven testing",
    selenium: "Only tests what you explicitly script",
    winner: "betaforge",
  },
  {
    feature: "Browser Support",
    betaforge: "Chrome, Firefox, Safari, Edge",
    selenium: "All major browsers",
    winner: "tie",
  },
  {
    feature: "Parallel Execution",
    betaforge: "Built-in, unlimited parallel agents",
    selenium: "Requires Selenium Grid setup",
    winner: "betaforge",
  },
  {
    feature: "Bug Discovery",
    betaforge: "Finds unexpected issues autonomously",
    selenium: "Only validates scripted assertions",
    winner: "betaforge",
  },
  {
    feature: "Report Quality",
    betaforge: "Human-readable with context & steps",
    selenium: "Technical pass/fail logs",
    winner: "betaforge",
  },
  {
    feature: "Flaky Tests",
    betaforge: "AI handles timing & dynamic content",
    selenium: "Common issue, requires explicit waits",
    winner: "betaforge",
  },
  {
    feature: "Open Source",
    betaforge: "Proprietary SaaS",
    selenium: "Free and open source",
    winner: "selenium",
  },
  {
    feature: "Customization",
    betaforge: "Persona-based testing strategies",
    selenium: "Unlimited customization via code",
    winner: "selenium",
  },
  {
    feature: "Learning Curve",
    betaforge: "Minimal - anyone can use it",
    selenium: "Steep - requires programming skills",
    winner: "betaforge",
  },
];

const metrics = [
  { label: "Faster Setup", value: "100x", icon: Zap },
  { label: "Less Maintenance", value: "90%", icon: Wrench },
  { label: "No Code Needed", value: "0", icon: Code2 },
  { label: "More Coverage", value: "5x", icon: Target },
];

const painPoints = [
  {
    title: "Flaky Tests",
    description:
      "Selenium tests break constantly due to timing issues, dynamic content, and brittle selectors. BetaForge's AI handles these automatically.",
    icon: AlertCircle,
  },
  {
    title: "High Maintenance",
    description:
      "Every UI change requires updating test scripts. BetaForge adapts to changes without any maintenance required.",
    icon: Wrench,
  },
  {
    title: "Limited Coverage",
    description:
      "You can only test what you explicitly script. BetaForge explores your app and finds issues you didn't anticipate.",
    icon: Target,
  },
  {
    title: "Slow Development",
    description:
      "Writing Selenium tests takes weeks. BetaForge is ready to test in minutes with just a URL.",
    icon: Clock,
  },
];

const codeComparison = {
  selenium: `// Selenium WebDriver test
@Test
public void testLogin() {
  WebDriver driver = new ChromeDriver();
  driver.get("https://app.example.com");
  
  WebDriverWait wait = new WebDriverWait(driver, 10);
  
  WebElement username = wait.until(
    ExpectedConditions.visibilityOfElementLocated(
      By.id("username")
    )
  );
  username.sendKeys("test@example.com");
  
  WebElement password = driver.findElement(
    By.id("password")
  );
  password.sendKeys("password123");
  
  WebElement loginBtn = driver.findElement(
    By.cssSelector("button[type='submit']")
  );
  loginBtn.click();
  
  // Assert dashboard loaded
  wait.until(
    ExpectedConditions.urlContains("/dashboard")
  );
  
  driver.quit();
}`,
  betaforge: `// BetaForge configuration
{
  "url": "https://app.example.com",
  "goals": [
    "Log in with test credentials",
    "Verify dashboard loads correctly",
    "Test all navigation links",
    "Check for accessibility issues"
  ],
  "agents": ["sarah", "marcus", "ahmed"]
}

// That's it! AI agents handle the rest.`,
};

const testimonials = [
  {
    quote:
      "We spent 6 months building a Selenium suite that broke constantly. BetaForge replaced it in a week and hasn't needed maintenance since.",
    author: "David Kim",
    role: "QA Lead, CloudStack",
    result: "95% less test maintenance",
  },
  {
    quote:
      "Our team didn't have Selenium expertise. BetaForge let us achieve professional-grade testing without hiring specialists.",
    author: "Rachel Green",
    role: "Engineering Manager, StartupXYZ",
    result: "Zero code testing",
  },
];

export default function CompareSeleniumPage() {
  const betaforgeWins = comparisonTable.filter(
    (row) => row.winner === "betaforge"
  ).length;
  const seleniumWins = comparisonTable.filter(
    (row) => row.winner === "selenium"
  ).length;
  const ties = comparisonTable.filter((row) => row.winner === "tie").length;

  return (
    <div className="min-h-screen bg-void-black">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 mesh-bg opacity-30" />
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-neural/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-plasma-pink/10 rounded-full blur-[100px]" />
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
            <span className="gradient-text">Selenium</span>
          </h1>
          <p className="text-lg text-phantom-gray max-w-3xl mx-auto mb-8">
            Tired of maintaining brittle Selenium scripts? See how AI-powered
            testing eliminates flaky tests, reduces maintenance to zero, and
            finds bugs your scripts would never catch.
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
              <div className="w-16 h-16 rounded-2xl bg-[#43B02A]/20 flex items-center justify-center">
                <FileCode className="w-8 h-8 text-[#43B02A]" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-ghost-white">
                  {seleniumWins}
                </div>
                <div className="text-sm text-phantom-gray">Selenium Wins</div>
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

      {/* Code Comparison */}
      <section className="relative py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-ghost-white text-center mb-4">
            See the Difference
          </h2>
          <p className="text-phantom-gray text-center mb-12 max-w-2xl mx-auto">
            50+ lines of fragile Selenium code vs 10 lines of simple BetaForge
            configuration.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileCode className="w-5 h-5 text-[#43B02A]" />
                <span className="font-semibold text-ghost-white">Selenium</span>
                <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400">
                  Complex
                </span>
              </div>
              <div className="p-4 bg-void-elevated border border-white/10 rounded-2xl overflow-auto">
                <pre className="text-xs text-phantom-gray font-mono leading-relaxed">
                  {codeComparison.selenium}
                </pre>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Bot className="w-5 h-5 text-neural-bright" />
                <span className="font-semibold text-ghost-white">
                  BetaForge
                </span>
                <span className="text-xs px-2 py-1 rounded bg-quantum-green/20 text-quantum-green">
                  Simple
                </span>
              </div>
              <div className="p-4 bg-void-elevated border border-neural/30 rounded-2xl overflow-auto">
                <pre className="text-xs text-neural-bright font-mono leading-relaxed">
                  {codeComparison.betaforge}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="relative py-16 px-6 bg-void-elevated/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-ghost-white text-center mb-4">
            Selenium Pain Points We Solve
          </h2>
          <p className="text-phantom-gray text-center mb-12 max-w-2xl mx-auto">
            Every Selenium user knows these frustrations. BetaForge eliminates
            them.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {painPoints.map((point, index) => (
              <div
                key={index}
                className="p-6 bg-void-black border border-white/10 rounded-2xl"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <point.icon className="w-5 h-5 text-red-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-ghost-white">
                    {point.title}
                  </h3>
                </div>
                <p className="text-phantom-gray">{point.description}</p>
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
                  <FileCode className="w-5 h-5 text-[#43B02A]" />
                  <span className="font-semibold text-ghost-white">
                    Selenium
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
                      row.winner === "selenium"
                        ? "text-quantum-green"
                        : "text-phantom-gray"
                    }`}
                  >
                    {row.winner === "selenium" && <Check className="w-5 h-5" />}
                    <span className="text-sm">{row.selenium}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Migration Path */}
      <section className="relative py-16 px-6 bg-void-elevated/50">
        <div className="max-w-5xl mx-auto">
          <div className="p-8 md:p-12 bg-gradient-to-r from-neural/10 to-electric-cyan/10 border border-neural/30 rounded-3xl">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 mb-4">
                  <RefreshCw className="w-6 h-6 text-neural-bright" />
                  <span className="text-neural-bright font-medium">
                    Easy Migration
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-ghost-white mb-4">
                  Keep Selenium, Add BetaForge
                </h2>
                <p className="text-phantom-gray mb-6">
                  You don't have to choose. Run BetaForge alongside your
                  existing Selenium tests. Use Selenium for critical path
                  validation while BetaForge handles exploratory testing and
                  regression coverage.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-ghost-white">
                    <Check className="w-5 h-5 text-quantum-green" />
                    No migration required - add BetaForge today
                  </li>
                  <li className="flex items-center gap-2 text-ghost-white">
                    <Check className="w-5 h-5 text-quantum-green" />
                    Gradually reduce Selenium maintenance burden
                  </li>
                  <li className="flex items-center gap-2 text-ghost-white">
                    <Check className="w-5 h-5 text-quantum-green" />
                    Same CI/CD integration points
                  </li>
                </ul>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-[#43B02A]/20 flex items-center justify-center mb-2">
                    <FileCode className="w-10 h-10 text-[#43B02A]" />
                  </div>
                  <span className="text-sm text-phantom-gray">Selenium</span>
                </div>
                <ArrowRight className="w-6 h-6 text-mist-gray" />
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-neural/20 flex items-center justify-center mb-2">
                    <Bot className="w-10 h-10 text-neural-bright" />
                  </div>
                  <span className="text-sm text-phantom-gray">BetaForge</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-ghost-white text-center mb-12">
            From Selenium Users
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
            Ready to Escape Selenium Maintenance?
          </h2>
          <p className="text-lg text-phantom-gray mb-8 max-w-2xl mx-auto">
            Start with a free trial and see how AI testing can transform your
            workflow.
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
