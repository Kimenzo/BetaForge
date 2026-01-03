"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Globe,
  Smartphone,
  Monitor,
  Sparkles,
  Zap,
  Check,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AGENTS } from "@/lib/agents";

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState<"web" | "mobile" | "desktop">("web");
  const [accessUrl, setAccessUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState<string[]>(
    AGENTS.map((a) => a.id)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          platform: [platform],
          accessUrl,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create project");
      }

      const data = await res.json();
      router.push(`/dashboard/projects/${data.project.id}`);
    } catch (error) {
      console.error("Create project error:", error);
      alert("Failed to create project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleAgent = (id: string) => {
    setSelectedAgents((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-phantom-gray hover:text-ghost-white transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-neural/20 to-electric-cyan/20 border border-white/10">
            <Sparkles className="w-6 h-6 text-neural-bright" />
          </div>
          <h1 className="text-3xl font-bold text-ghost-white">Create New Project</h1>
        </div>
        <p className="text-phantom-gray">
          Add your application details to unleash AI-powered testing.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Project Details Card */}
        <div className="glass rounded-2xl p-6 border border-white/5 animate-fade-in-up stagger-1">
          <h2 className="text-lg font-semibold text-ghost-white mb-6 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neural-bright" />
            Project Details
          </h2>

          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-ghost-white mb-2">
                Project Name
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Awesome App"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-ghost-white mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of your application..."
                rows={3}
                className="w-full px-4 py-3 bg-void-elevated border border-white/5 rounded-xl text-ghost-white placeholder:text-mist-gray focus:outline-none focus:ring-2 focus:ring-neural/50 focus:border-neural/50 transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Platform Selection */}
        <div className="glass rounded-2xl p-6 border border-white/5 animate-fade-in-up stagger-2">
          <h2 className="text-lg font-semibold text-ghost-white mb-6 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-electric-cyan" />
            Platform
          </h2>

          <div className="grid grid-cols-3 gap-4">
            <PlatformOption
              icon={<Globe className="h-6 w-6" />}
              label="Web"
              description="Test web applications"
              selected={platform === "web"}
              onClick={() => setPlatform("web")}
              gradient="from-electric-cyan to-blue-500"
            />
            <PlatformOption
              icon={<Smartphone className="h-6 w-6" />}
              label="Mobile"
              description="Coming soon"
              selected={platform === "mobile"}
              onClick={() => setPlatform("mobile")}
              disabled
              gradient="from-plasma-pink to-rose-500"
            />
            <PlatformOption
              icon={<Monitor className="h-6 w-6" />}
              label="Desktop"
              description="Coming soon"
              selected={platform === "desktop"}
              onClick={() => setPlatform("desktop")}
              disabled
              gradient="from-neural to-purple-600"
            />
          </div>

          {/* URL */}
          {platform === "web" && (
            <div className="mt-6 animate-fade-in-up">
              <label className="block text-sm font-medium text-ghost-white mb-2">
                Application URL
              </label>
              <Input
                type="url"
                value={accessUrl}
                onChange={(e) => setAccessUrl(e.target.value)}
                placeholder="https://your-app.com"
                icon={<Globe className="w-4 h-4" />}
                required
              />
              <p className="text-xs text-mist-gray mt-2 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Make sure the URL is accessible from our testing servers
              </p>
            </div>
          )}
        </div>

        {/* Agent Selection */}
        <div className="glass rounded-2xl p-6 border border-white/5 animate-fade-in-up stagger-3">
          <h2 className="text-lg font-semibold text-ghost-white mb-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-quantum-green" />
            Testing Agents
          </h2>
          <p className="text-sm text-phantom-gray mb-6">
            Select which AI personas will test your application
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {AGENTS.map((agent) => (
              <button
                key={agent.id}
                type="button"
                onClick={() => toggleAgent(agent.id)}
                className={`relative p-4 rounded-xl border transition-all duration-300 text-left group ${
                  selectedAgents.includes(agent.id)
                    ? "border-white/20 bg-void-elevated"
                    : "border-white/5 bg-void-surface/50 hover:border-white/10"
                }`}
              >
                {/* Selection indicator */}
                <div
                  className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedAgents.includes(agent.id)
                      ? "border-quantum-green bg-quantum-green"
                      : "border-mist-gray"
                  }`}
                >
                  {selectedAgents.includes(agent.id) && (
                    <Check className="w-3 h-3 text-void-black" />
                  )}
                </div>

                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3"
                  style={{ backgroundColor: `${agent.color}20` }}
                >
                  {agent.name === "Sarah"
                    ? "🔍"
                    : agent.name === "Marcus"
                    ? "⚡"
                    : agent.name === "Ahmed"
                    ? "♿"
                    : agent.name === "Lin"
                    ? "📱"
                    : agent.name === "Diego"
                    ? "🔥"
                    : "✨"}
                </div>
                <p className="font-medium text-ghost-white">{agent.name}</p>
                <p className="text-xs text-mist-gray mt-1 line-clamp-1">
                  {agent.specialization}
                </p>
              </button>
            ))}
          </div>

          <p className="text-sm text-phantom-gray mt-4">
            {selectedAgents.length} of {AGENTS.length} agents selected
          </p>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-4 animate-fade-in-up stagger-4">
          <Link href="/dashboard">
            <Button variant="ghost">Cancel</Button>
          </Link>
          <Button type="submit" loading={loading} size="lg">
            <Zap className="w-4 h-4" />
            Create Project
          </Button>
        </div>
      </form>
    </div>
  );
}

function PlatformOption({
  icon,
  label,
  description,
  selected,
  onClick,
  disabled,
  gradient,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  gradient: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative flex flex-col items-center gap-3 p-6 rounded-xl border transition-all duration-300 group ${
        selected
          ? "border-white/20 bg-void-elevated"
          : disabled
          ? "border-white/5 bg-void-surface/30 opacity-50 cursor-not-allowed"
          : "border-white/5 bg-void-surface/50 hover:border-white/10 hover:bg-void-elevated/50"
      }`}
    >
      {/* Glow effect when selected */}
      {selected && (
        <div
          className={`absolute inset-0 rounded-xl bg-gradient-to-br ${gradient} opacity-10`}
        />
      )}

      <div
        className={`relative p-3 rounded-xl bg-gradient-to-br ${gradient} ${
          selected ? "opacity-100" : "opacity-50"
        } transition-opacity group-hover:opacity-75`}
      >
        <div className="text-white">{icon}</div>
      </div>
      <div className="relative text-center">
        <span className="block font-medium text-ghost-white">{label}</span>
        <span className="text-xs text-mist-gray">{description}</span>
      </div>

      {/* Selected checkmark */}
      {selected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-quantum-green flex items-center justify-center">
          <Check className="w-3 h-3 text-void-black" />
        </div>
      )}
    </button>
  );
}
