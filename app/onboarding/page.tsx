"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bot,
  Code,
  Users,
  Building2,
  Globe,
  Smartphone,
  Monitor,
  Rocket,
  ChevronRight,
  ChevronLeft,
  Check,
  Sparkles,
} from "lucide-react";
import { AGENTS } from "@/lib/agents";

type Step = 1 | 2 | 3;
type Role = "solo" | "team" | "enterprise" | null;
type Platform = "web" | "mobile" | "desktop";

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>(1);
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [projectName, setProjectName] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("web");
  const [isLaunching, setIsLaunching] = useState(false);

  const handleLaunch = async () => {
    setIsLaunching(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    window.location.href = "/dashboard";
  };

  const roles = [
    {
      id: "solo" as Role,
      icon: <Code className="w-6 h-6" />,
      title: "Solo Developer",
      description: "Building side projects or indie apps",
      color: "neural",
      hoverBorder: "hover:border-neural",
      selectedBorder: "border-neural",
      selectedBg: "bg-neural/10",
      iconBg: "bg-neural/20",
      iconColor: "text-neural-bright",
    },
    {
      id: "team" as Role,
      icon: <Users className="w-6 h-6" />,
      title: "Team Lead",
      description: "Managing a development team",
      color: "electric-cyan",
      hoverBorder: "hover:border-electric-cyan",
      selectedBorder: "border-electric-cyan",
      selectedBg: "bg-electric-cyan/10",
      iconBg: "bg-electric-cyan/20",
      iconColor: "text-electric-cyan",
    },
    {
      id: "enterprise" as Role,
      icon: <Building2 className="w-6 h-6" />,
      title: "Enterprise",
      description: "Large organization or agency",
      color: "quantum-green",
      hoverBorder: "hover:border-quantum-green",
      selectedBorder: "border-quantum-green",
      selectedBg: "bg-quantum-green/10",
      iconBg: "bg-quantum-green/20",
      iconColor: "text-quantum-green",
    },
  ];

  const platforms = [
    {
      id: "web" as Platform,
      icon: <Globe className="w-6 h-6" />,
      label: "Web",
    },
    {
      id: "mobile" as Platform,
      icon: <Smartphone className="w-6 h-6" />,
      label: "Mobile",
    },
    {
      id: "desktop" as Platform,
      icon: <Monitor className="w-6 h-6" />,
      label: "Desktop",
    },
  ];

  const getAgentEmoji = (name: string) => {
    const emojis: Record<string, string> = {
      Sarah: "🔍",
      Marcus: "⚡",
      Ahmed: "♿",
      Lin: "📱",
      Diego: "🔥",
      Emma: "✨",
    };
    return emojis[name] || "🤖";
  };

  return (
    <div className="min-h-screen bg-void-black flex flex-col">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-neural/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-electric-cyan/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-void-black/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neural to-electric-cyan flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">BetaForge</span>
          </Link>

          {/* Progress Dots */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  s === step
                    ? "w-8 bg-gradient-to-r from-neural to-electric-cyan"
                    : s < step
                    ? "bg-neural"
                    : "bg-white/20"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="text-sm text-phantom-gray hover:text-white transition-colors"
          >
            Skip for now
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          {/* Step 1: Role Selection */}
          {step === 1 && (
            <div className="animate-fade-in-up">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neural/10 border border-neural/20 text-neural-bright text-sm mb-6">
                  <Sparkles className="w-4 h-4" />
                  Step 1 of 3
                </div>
                <h1 className="text-3xl font-bold text-white mb-3">
                  What brings you to BetaForge?
                </h1>
                <p className="text-phantom-gray">
                  Help us personalize your experience
                </p>
              </div>

              {/* Role Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 group ${
                      selectedRole === role.id
                        ? `${role.selectedBorder} ${role.selectedBg}`
                        : `border-white/10 bg-white/5 hover:bg-white/10 ${role.hoverBorder}`
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl ${role.iconBg} ${role.iconColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      {role.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {role.title}
                    </h3>
                    <p className="text-sm text-phantom-gray">
                      {role.description}
                    </p>

                    {/* Selected Indicator */}
                    {selectedRole === role.id && (
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-neural flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!selectedRole}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-neural to-electric-cyan text-white font-semibold hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Project Setup */}
          {step === 2 && (
            <div className="animate-fade-in-up">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-electric-cyan/10 border border-electric-cyan/20 text-electric-cyan text-sm mb-6">
                  <Sparkles className="w-4 h-4" />
                  Step 2 of 3
                </div>
                <h1 className="text-3xl font-bold text-white mb-3">
                  Let&apos;s set up your first project
                </h1>
                <p className="text-phantom-gray">
                  We&apos;ll run a test to show you how BetaForge works
                </p>
              </div>

              {/* Project Form */}
              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-phantom-gray mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    placeholder="My Awesome App"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-neural focus:bg-white/10 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-phantom-gray mb-2">
                    App URL (for web apps)
                  </label>
                  <input
                    type="url"
                    placeholder="https://myapp.com"
                    value={projectUrl}
                    onChange={(e) => setProjectUrl(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-neural focus:bg-white/10 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-phantom-gray mb-2">
                    Platform
                  </label>
                  <div className="flex gap-3">
                    {platforms.map((platform) => (
                      <button
                        key={platform.id}
                        onClick={() => setSelectedPlatform(platform.id)}
                        className={`flex-1 h-12 rounded-xl border-2 flex items-center justify-center gap-2 transition-all duration-300 ${
                          selectedPlatform === platform.id
                            ? "border-neural bg-neural/10 text-white"
                            : "border-white/10 bg-white/5 text-phantom-gray hover:bg-white/10 hover:border-white/20"
                        }`}
                      >
                        {platform.icon}
                        {platform.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-all duration-300"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!projectName}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-neural to-electric-cyan text-white font-semibold hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Meet Your Agents */}
          {step === 3 && (
            <div className="animate-fade-in-up">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-quantum-green/10 border border-quantum-green/20 text-quantum-green text-sm mb-6">
                  <Sparkles className="w-4 h-4" />
                  Step 3 of 3
                </div>
                <h1 className="text-3xl font-bold text-white mb-3">
                  Meet your AI testing team
                </h1>
                <p className="text-phantom-gray">
                  These 6 agents will test &quot;{projectName || "your app"}
                  &quot; from different perspectives
                </p>
              </div>

              {/* Agent Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {AGENTS.map((agent, index) => (
                  <div
                    key={agent.id}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 group animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: `${agent.color}20` }}
                    >
                      {getAgentEmoji(agent.name)}
                    </div>
                    <h3 className="font-semibold text-white mb-1">
                      {agent.name}
                    </h3>
                    <p className="text-xs text-phantom-gray line-clamp-2">
                      {agent.specialization || agent.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Launch CTA */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-neural/10 to-electric-cyan/10 border border-neural/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-neural/20 flex items-center justify-center">
                    <Rocket className="w-6 h-6 text-neural-bright" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Ready to test!</h3>
                    <p className="text-sm text-phantom-gray">
                      6 agents will test your app for ~5 minutes
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 h-12 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-all duration-300"
                  >
                    <ChevronLeft className="w-5 h-5 inline mr-2" />
                    Back
                  </button>
                  <button
                    onClick={handleLaunch}
                    disabled={isLaunching}
                    className="flex-[2] h-12 rounded-xl bg-gradient-to-r from-neural to-electric-cyan text-white font-semibold hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all duration-300 relative overflow-hidden group"
                  >
                    {isLaunching ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Launching...
                      </span>
                    ) : (
                      <>
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <Rocket className="w-5 h-5" />
                          Run First Test
                        </span>
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
