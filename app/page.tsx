import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Bug,
  Zap,
  Shield,
  Gauge,
  Users,
  ChevronRight,
  Play,
  Search,
  Eye,
  TrendingUp,
} from "lucide-react";
import { AGENTS } from "@/lib/agents";
import { Footer } from "@/components/layout";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Light Theme Background with Soft Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Soft pastel gradient blobs - searchable.com style */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-amber-100/80 via-orange-100/60 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-purple-100/60 via-pink-100/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-gradient-to-r from-rose-100/40 via-orange-50/30 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Header - Light Theme */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">BetaForge</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {["Features", "Agents", "Pricing", "Docs"].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {item}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <LoginLink
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Login
              </LoginLink>
              <RegisterLink
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-500 text-white font-semibold text-sm transition-all duration-300 hover:bg-orange-600 hover:shadow-lg hover:-translate-y-0.5"
              >
                <span>Start for free</span>
              </RegisterLink>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Light Theme */}
      <main className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-8 animate-fade-in-up stagger-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-200">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-sm text-orange-700 font-medium">
                Powered by Claude AI
              </span>
              <ChevronRight className="w-4 h-4 text-orange-400" />
            </div>
          </div>

          {/* Headline - Orange accent like searchable.com */}
          <h1 className="text-center text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.2] tracking-tight mb-6 animate-fade-in-up stagger-2">
            <span className="text-orange-500 italic">AI-Powered Testing:</span>
            <br />
            <span className="text-gray-900">Ship with confidence</span>
          </h1>

          {/* Feature bullets - searchable.com style */}
          <div className="flex flex-col items-center gap-3 mb-10 animate-fade-in-up stagger-3">
            {[
              { icon: Search, text: "Discover", highlight: "hidden bugs" },
              { icon: Eye, text: "Monitor", highlight: "user journeys" },
              { icon: TrendingUp, text: "Extract", highlight: "actionable insights" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2.5 text-base md:text-lg">
                <item.icon className="w-5 h-5 text-orange-500" />
                <span className="text-gray-900 font-semibold">{item.highlight}</span>
                <span className="text-gray-500">{item.text}</span>
              </div>
            ))}
          </div>

          {/* CTAs - Light theme buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16 animate-fade-in-up stagger-4">
            <RegisterLink
              className="group flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white font-medium text-sm transition-all duration-300 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </RegisterLink>
            <Link
              href="/agents"
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-200 text-gray-900 font-medium text-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5"
            >
              <Users className="w-4 h-4 text-orange-500" />
              <span>Meet the Agents</span>
            </Link>
          </div>

          {/* Agent Showcase - Light cards */}
          <div className="relative mb-20 animate-fade-in-up stagger-5">
            {/* Agent avatars */}
            <div className="relative flex justify-center items-end gap-4 md:gap-6">
              {AGENTS.map((agent, index) => {
                const avatars: Record<string, string> = {
                  sarah: "🔍", marcus: "⚡", ahmed: "♿",
                  lin: "📱", diego: "🔥", emma: "✨",
                };
                const sizes = [60, 80, 100, 100, 80, 60];
                const yOffsets = [20, 10, 0, 0, 10, 20];
                
                return (
                  <div
                    key={agent.id}
                    className="group relative animate-float"
                    style={{
                      width: sizes[index],
                      height: sizes[index],
                      animationDelay: `${index * 0.5}s`,
                      transform: `translateY(${yOffsets[index]}px)`,
                    }}
                  >
                    <div
                      className="relative w-full h-full rounded-2xl flex items-center justify-center text-2xl md:text-3xl border-2 border-gray-100 bg-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:border-gray-200"
                    >
                      {avatars[agent.id]}
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 rounded-xl bg-gray-900 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none z-10">
                      <p className="text-sm font-medium">{agent.name}</p>
                      <p className="text-xs text-gray-400">{agent.specialization}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Features Grid - Light cards */}
          <section id="features" className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Why Teams Choose <span className="text-orange-500">BetaForge</span>
              </h2>
              <p className="text-gray-500 text-base max-w-2xl mx-auto">
                Revolutionary AI testing that thinks, explores, and reports like your best QA engineers.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Users,
                  title: "6 Unique Personas",
                  description: "From cautious explorers to chaos testers, each agent brings a distinct perspective to find bugs others miss.",
                  color: "#8B5CF6",
                },
                {
                  icon: Bug,
                  title: "Human-Like Reports",
                  description: "Detailed bug reports with screenshots, reproduction steps, expected vs actual behavior, and severity ratings.",
                  color: "#EF4444",
                },
                {
                  icon: Zap,
                  title: "Real-Time Monitoring",
                  description: "Watch agents work live. See every click, scroll, and discovery as it happens in your dashboard.",
                  color: "#06B6D4",
                },
                {
                  icon: Shield,
                  title: "Security Testing",
                  description: "Diego, our chaos tester, actively tries to break your app—finding security holes before bad actors do.",
                  color: "#F97316",
                },
                {
                  icon: Gauge,
                  title: "Performance Insights",
                  description: "Marcus tests keyboard shortcuts and performance, ensuring your app works for power users too.",
                  color: "#10B981",
                },
                {
                  icon: Sparkles,
                  title: "CI/CD Integration",
                  description: "Webhook support for GitHub, GitLab, and Bitbucket. Trigger tests automatically on every push.",
                  color: "#EC4899",
                },
              ].map((feature, index) => (
                <div
                  key={feature.title}
                  className="group bg-white rounded-xl p-6 border border-gray-100 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:border-gray-200 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${feature.color}15` }}
                  >
                    <feature.icon
                      className="w-5 h-5"
                      style={{ color: feature.color }}
                    />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section - Light theme */}
          <section className="relative mb-16">
            <div className="relative bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 rounded-2xl p-10 md:p-12 text-center border border-orange-100">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                Ready to Transform Your Testing?
              </h2>
              <p className="text-gray-500 text-sm max-w-xl mx-auto mb-6">
                Join developers who ship faster with AI-powered beta testing.
                No credit card required.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white font-medium text-sm transition-all duration-300 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Start Free Trial</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* Footer - Stays Dark */}
      <Footer />
    </div>
  );
}
