import Link from "next/link";
import {
  Sparkles,
  Monitor,
  Chrome,
  ArrowRight,
  Users,
  Zap,
  Target,
  Activity,
} from "lucide-react";
import { AGENTS } from "@/lib/agents";
import { Button } from "@/components/ui/button";

// Agent avatars and colors
const agentMeta: Record<string, { emoji: string; gradient: string }> = {
  sarah: { emoji: "🔍", gradient: "from-violet-500 to-indigo-500" },
  marcus: { emoji: "⚡", gradient: "from-cyan-500 to-blue-500" },
  ahmed: { emoji: "♿", gradient: "from-emerald-500 to-green-500" },
  lin: { emoji: "📱", gradient: "from-pink-500 to-rose-500" },
  diego: { emoji: "🔥", gradient: "from-orange-500 to-red-500" },
  emma: { emoji: "✨", gradient: "from-purple-500 to-violet-500" },
};

export default function AgentsPage() {
  return (
    <div className="min-h-screen bg-void-black overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 mesh-bg opacity-40" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neural/20 rounded-full blur-[100px] animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-electric-cyan/15 rounded-full blur-[100px] animate-float"
          style={{ animationDelay: "-3s" }}
        />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="glass rounded-2xl px-6 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-neural-bright/30 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-neural-bright to-electric-cyan flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold gradient-text">BetaForge</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm text-phantom-gray hover:text-ghost-white transition-colors"
              >
                Dashboard
              </Link>
              <Link href="/dashboard/projects/new">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-neural/20 mb-8 animate-fade-in-up">
              <Users className="w-4 h-4 text-neural-bright" />
              <span className="text-sm text-phantom-gray">
                6 Unique AI Personas
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up stagger-1">
              <span className="text-ghost-white">Meet Your</span>
              <br />
              <span className="gradient-text">AI Testing Team</span>
            </h1>

            <p className="text-xl text-phantom-gray max-w-3xl mx-auto leading-relaxed animate-fade-in-up stagger-2">
              Six unique personas, each bringing a different perspective to find
              bugs others miss. Together, they simulate the diversity of your
              real user base.
            </p>
          </div>

          {/* Agent Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {AGENTS.map((agent, index) => (
              <div
                key={agent.id}
                className="group relative animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Card */}
                <div className="relative glass rounded-2xl p-8 h-full transition-all duration-500 hover:-translate-y-2 hover:shadow-xl overflow-hidden">
                  {/* Gradient glow on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at 50% 0%, ${agent.color}20 0%, transparent 60%)`,
                    }}
                  />

                  {/* Content */}
                  <div className="relative">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-6">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                        style={{
                          background: `linear-gradient(135deg, ${agent.color}40, ${agent.color}20)`,
                        }}
                      >
                        {agentMeta[agent.id]?.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-ghost-white">
                          {agent.name}
                        </h3>
                        <p
                          className="text-sm font-medium"
                          style={{ color: agent.color }}
                        >
                          {agent.specialization}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-phantom-gray">
                          <Activity className="w-3 h-3" />
                          <span>Online</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-quantum-green animate-pulse" />
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-phantom-gray text-sm leading-relaxed mb-6">
                      {agent.description}
                    </p>

                    {/* Traits */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {agent.traits.map((trait) => (
                        <span
                          key={trait}
                          className="px-3 py-1 text-xs rounded-full bg-white/5 text-phantom-gray border border-white/5"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>

                    {/* Environment */}
                    <div className="pt-4 border-t border-white/5">
                      <div className="flex items-center gap-4 text-xs text-mist-gray">
                        <span className="flex items-center gap-1.5">
                          <Monitor className="w-3.5 h-3.5" />
                          {agent.environment.os}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Chrome className="w-3.5 h-3.5" />
                          {agent.environment.browser}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="p-3 rounded-xl bg-void-elevated/50 text-center">
                        <p className="text-lg font-bold text-ghost-white">
                          {Math.floor(Math.random() * 100) + 50}
                        </p>
                        <p className="text-[10px] text-mist-gray uppercase tracking-wider">
                          Tests Run
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-void-elevated/50 text-center">
                        <p className="text-lg font-bold text-ghost-white">
                          {Math.floor(Math.random() * 30) + 10}
                        </p>
                        <p className="text-[10px] text-mist-gray uppercase tracking-wider">
                          Bugs Found
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-neural/10 via-electric-cyan/10 to-plasma-pink/10 rounded-3xl blur-3xl" />
            <div className="relative glass rounded-3xl p-12 md:p-16 text-center border border-neural/20">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-neural/10 flex items-center justify-center">
                <Zap className="w-8 h-8 text-neural-bright" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-ghost-white mb-4">
                Ready to Deploy Your AI Team?
              </h2>
              <p className="text-phantom-gray text-lg max-w-2xl mx-auto mb-8">
                Start testing with all 6 agents immediately. No setup required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/dashboard/projects/new">
                  <Button size="lg">
                    <Target className="w-5 h-5" />
                    Start Testing Now
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="secondary" size="lg">
                    View Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/5 py-8 px-6 text-center">
        <p className="text-phantom-gray text-sm">
          © {new Date().getFullYear()} BetaForge. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
