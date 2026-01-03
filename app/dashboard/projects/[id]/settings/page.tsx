"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Settings,
  Globe,
  Users,
  Bell,
  Shield,
  Trash2,
  Save,
  Check,
  AlertTriangle,
  Smartphone,
  Monitor,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AGENTS } from "@/lib/agents";

export default function ProjectSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Form state
  const [name, setName] = useState("My Project");
  const [description, setDescription] = useState("A web application for testing");
  const [accessUrl, setAccessUrl] = useState("https://my-app.com");
  const [platform, setPlatform] = useState<"web" | "mobile" | "desktop">("web");
  const [selectedAgents, setSelectedAgents] = useState<string[]>(
    AGENTS.map((a) => a.id)
  );
  const [notifyOnCritical, setNotifyOnCritical] = useState(true);
  const [notifyOnComplete, setNotifyOnComplete] = useState(true);
  const [autoTest, setAutoTest] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    // Simulate delete
    await new Promise((resolve) => setTimeout(resolve, 500));
    router.push("/dashboard/projects");
  };

  const toggleAgent = (id: string) => {
    setSelectedAgents((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Back Link */}
      <Link
        href={`/dashboard/projects/${projectId}`}
        className="inline-flex items-center gap-2 text-phantom-gray hover:text-ghost-white transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Project
      </Link>

      {/* Header */}
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-gradient-to-br from-electric-cyan/20 to-blue-500/20 border border-white/10">
            <Settings className="w-6 h-6 text-electric-cyan" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-ghost-white">Project Settings</h1>
            <p className="text-phantom-gray">
              Update settings, agents, and test parameters
            </p>
          </div>
        </div>
      </div>

      {/* General Settings */}
      <section className="glass rounded-2xl p-6 border border-white/5 animate-fade-in-up stagger-1">
        <h2 className="text-lg font-semibold text-ghost-white mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-electric-cyan" />
          General Settings
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ghost-white mb-2">
              Project Name
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Project"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ghost-white mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of your application..."
              className="w-full px-4 py-3 rounded-xl bg-void-elevated border border-white/10 text-ghost-white placeholder:text-mist-gray focus:border-neural/50 focus:ring-1 focus:ring-neural/30 transition-all resize-none"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ghost-white mb-2">
              Platform
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setPlatform("web")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  platform === "web"
                    ? "border-electric-cyan bg-electric-cyan/10 text-electric-cyan"
                    : "border-white/10 text-phantom-gray hover:border-white/20"
                }`}
              >
                <Globe className="w-4 h-4" />
                Web
              </button>
              <button
                onClick={() => setPlatform("mobile")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  platform === "mobile"
                    ? "border-plasma-pink bg-plasma-pink/10 text-plasma-pink"
                    : "border-white/10 text-phantom-gray hover:border-white/20"
                }`}
              >
                <Smartphone className="w-4 h-4" />
                Mobile
              </button>
              <button
                onClick={() => setPlatform("desktop")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  platform === "desktop"
                    ? "border-neural-bright bg-neural/10 text-neural-bright"
                    : "border-white/10 text-phantom-gray hover:border-white/20"
                }`}
              >
                <Monitor className="w-4 h-4" />
                Desktop
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ghost-white mb-2">
              Application URL
            </label>
            <Input
              type="url"
              value={accessUrl}
              onChange={(e) => setAccessUrl(e.target.value)}
              placeholder="https://your-app.com"
              icon={<Globe className="w-4 h-4" />}
            />
          </div>
        </div>
      </section>

      {/* Agent Configuration */}
      <section className="glass rounded-2xl p-6 border border-white/5 animate-fade-in-up stagger-2">
        <h2 className="text-lg font-semibold text-ghost-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-neural-bright" />
          Testing Agents
        </h2>
        <p className="text-sm text-phantom-gray mb-4">
          Select which AI personas will test your application
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {AGENTS.map((agent) => (
            <button
              key={agent.id}
              onClick={() => toggleAgent(agent.id)}
              className={`relative p-4 rounded-xl border transition-all text-left ${
                selectedAgents.includes(agent.id)
                  ? "border-white/20 bg-void-elevated"
                  : "border-white/5 bg-void-surface/50 hover:border-white/10"
              }`}
            >
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
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg mb-2"
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
              <p className="text-xs text-mist-gray">{agent.archetype}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Notifications */}
      <section className="glass rounded-2xl p-6 border border-white/5 animate-fade-in-up stagger-3">
        <h2 className="text-lg font-semibold text-ghost-white mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-ember-orange" />
          Notifications
        </h2>
        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 rounded-xl bg-void-elevated border border-white/5 cursor-pointer hover:border-white/10 transition-all">
            <div>
              <p className="font-medium text-ghost-white">Critical Bug Alerts</p>
              <p className="text-sm text-phantom-gray">
                Get notified immediately when critical bugs are found
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifyOnCritical}
              onChange={(e) => setNotifyOnCritical(e.target.checked)}
              className="w-5 h-5 rounded border-white/20 bg-void-black text-neural-bright focus:ring-neural/30"
            />
          </label>
          <label className="flex items-center justify-between p-4 rounded-xl bg-void-elevated border border-white/5 cursor-pointer hover:border-white/10 transition-all">
            <div>
              <p className="font-medium text-ghost-white">Test Completion</p>
              <p className="text-sm text-phantom-gray">
                Get notified when test sessions complete
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifyOnComplete}
              onChange={(e) => setNotifyOnComplete(e.target.checked)}
              className="w-5 h-5 rounded border-white/20 bg-void-black text-neural-bright focus:ring-neural/30"
            />
          </label>
        </div>
      </section>

      {/* Automation */}
      <section className="glass rounded-2xl p-6 border border-white/5 animate-fade-in-up stagger-4">
        <h2 className="text-lg font-semibold text-ghost-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-quantum-green" />
          Automation
        </h2>
        <label className="flex items-center justify-between p-4 rounded-xl bg-void-elevated border border-white/5 cursor-pointer hover:border-white/10 transition-all">
          <div>
            <p className="font-medium text-ghost-white">Auto-test on Deploy</p>
            <p className="text-sm text-phantom-gray">
              Automatically run tests when new deployments are detected via webhook
            </p>
          </div>
          <input
            type="checkbox"
            checked={autoTest}
            onChange={(e) => setAutoTest(e.target.checked)}
            className="w-5 h-5 rounded border-white/20 bg-void-black text-neural-bright focus:ring-neural/30"
          />
        </label>
      </section>

      {/* Danger Zone */}
      <section className="glass rounded-2xl p-6 border border-crimson-red/30 animate-fade-in-up stagger-5">
        <h2 className="text-lg font-semibold text-crimson-red mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Danger Zone
        </h2>
        <div className="flex items-center justify-between p-4 rounded-xl bg-crimson-red/10 border border-crimson-red/20">
          <div>
            <p className="font-medium text-ghost-white">Delete Project</p>
            <p className="text-sm text-phantom-gray">
              Permanently delete this project and all its data
            </p>
          </div>
          <button
            onClick={handleDelete}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              deleteConfirm
                ? "bg-crimson-red text-white"
                : "bg-crimson-red/20 text-crimson-red hover:bg-crimson-red/30"
            }`}
          >
            <Trash2 className="w-4 h-4" />
            {deleteConfirm ? "Confirm Delete" : "Delete"}
          </button>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <Link
          href={`/dashboard/projects/${projectId}`}
          className="px-6 py-3 rounded-xl border border-white/10 text-phantom-gray font-medium hover:text-ghost-white hover:border-white/20 transition-all"
        >
          Cancel
        </Link>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-neural to-electric-cyan text-white font-semibold hover:shadow-glow transition-all flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <Check className="w-4 h-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
