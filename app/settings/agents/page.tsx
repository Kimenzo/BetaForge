"use client";

import { useState } from "react";
import {
  Bot,
  Plus,
  Edit3,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Smartphone,
  Monitor,
  Globe,
  Zap,
  Shield,
  Eye,
  MousePointer,
  Accessibility,
  Bug,
  User,
  X,
  Check,
  Sparkles,
} from "lucide-react";

interface CustomAgent {
  id: string;
  name: string;
  personality: string;
  testingStrategy: string;
  enabled: boolean;
  devicePreference: "mobile" | "desktop" | "tablet";
  traits: string[];
  testsRun: number;
  bugsFound: number;
}

const defaultAgents = [
  {
    id: "sarah",
    name: "Sarah",
    subtitle: "Cautious Explorer",
    icon: Eye,
    color: "from-pink-500 to-rose-500",
    builtIn: true,
  },
  {
    id: "marcus",
    name: "Marcus",
    subtitle: "Power User",
    icon: Zap,
    color: "from-orange-500 to-amber-500",
    builtIn: true,
  },
  {
    id: "ahmed",
    name: "Ahmed",
    subtitle: "Accessibility Advocate",
    icon: Accessibility,
    color: "from-blue-500 to-indigo-500",
    builtIn: true,
  },
  {
    id: "lin",
    name: "Lin",
    subtitle: "Mobile-First User",
    icon: Smartphone,
    color: "from-green-500 to-emerald-500",
    builtIn: true,
  },
  {
    id: "diego",
    name: "Diego",
    subtitle: "Chaos Tester",
    icon: Bug,
    color: "from-red-500 to-pink-500",
    builtIn: true,
  },
  {
    id: "emma",
    name: "Emma",
    subtitle: "Average User",
    icon: User,
    color: "from-purple-500 to-violet-500",
    builtIn: true,
  },
];

export default function AgentsSettingsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [customAgents, setCustomAgents] = useState<CustomAgent[]>([
    {
      id: "custom-1",
      name: "Enterprise Tester",
      personality: "Thorough and methodical",
      testingStrategy: "Focus on enterprise workflows and complex data",
      enabled: true,
      devicePreference: "desktop",
      traits: ["Patient", "Detail-oriented", "Security-focused"],
      testsRun: 45,
      bugsFound: 12,
    },
  ]);

  const [newAgent, setNewAgent] = useState<{
    name: string;
    personality: string;
    testingStrategy: string;
    devicePreference: "mobile" | "desktop" | "tablet";
    traits: string[];
  }>({
    name: "",
    personality: "",
    testingStrategy: "",
    devicePreference: "desktop",
    traits: [],
  });
  const [newTrait, setNewTrait] = useState("");

  const handleAddTrait = () => {
    if (newTrait && newAgent.traits.length < 5) {
      setNewAgent({ ...newAgent, traits: [...newAgent.traits, newTrait] });
      setNewTrait("");
    }
  };

  const handleRemoveTrait = (trait: string) => {
    setNewAgent({
      ...newAgent,
      traits: newAgent.traits.filter((t) => t !== trait),
    });
  };

  const handleCreateAgent = () => {
    const agent: CustomAgent = {
      id: `custom-${Date.now()}`,
      name: newAgent.name,
      personality: newAgent.personality,
      testingStrategy: newAgent.testingStrategy,
      enabled: true,
      devicePreference: newAgent.devicePreference,
      traits: newAgent.traits,
      testsRun: 0,
      bugsFound: 0,
    };
    setCustomAgents([...customAgents, agent]);
    setShowCreateModal(false);
    setNewAgent({
      name: "",
      personality: "",
      testingStrategy: "",
      devicePreference: "desktop",
      traits: [],
    });
  };

  const toggleAgent = (id: string) => {
    setCustomAgents(
      customAgents.map((agent) =>
        agent.id === id ? { ...agent, enabled: !agent.enabled } : agent
      )
    );
  };

  const deleteAgent = (id: string) => {
    setCustomAgents(customAgents.filter((agent) => agent.id !== id));
  };

  return (
    <div className="p-8 max-w-4xl">
      {/* Section Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-white mb-2">Agents</h1>
        <p className="text-phantom-gray">
          Configure built-in agents and create custom personas
        </p>
      </div>

      {/* Usage Info */}
      <section className="mb-8 p-4 rounded-xl bg-neural/10 border border-neural/20 flex items-center justify-between animate-fade-in-up stagger-1">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-neural-bright" />
          <span className="text-white">
            <span className="font-semibold">Custom Agents:</span>{" "}
            {customAgents.length}/3 used
          </span>
        </div>
        <span className="text-sm text-phantom-gray">
          Team plan includes 3 custom agents
        </span>
      </section>

      {/* Built-in Agents */}
      <section className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10 animate-fade-in-up stagger-2">
        <h3 className="text-lg font-semibold text-white mb-4">
          Built-in Agents
        </h3>
        <p className="text-sm text-phantom-gray mb-6">
          These AI personas come pre-configured with unique testing behaviors
        </p>
        <div className="grid grid-cols-2 gap-4">
          {defaultAgents.map((agent) => {
            const Icon = agent.icon;
            return (
              <div
                key={agent.id}
                className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-4"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium">{agent.name}</h4>
                  <p className="text-sm text-phantom-gray">{agent.subtitle}</p>
                </div>
                <span className="px-2 py-1 rounded-lg bg-white/5 text-xs text-phantom-gray">
                  Built-in
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Custom Agents */}
      <section className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10 animate-fade-in-up stagger-3">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">
              Custom Agents
            </h3>
            <p className="text-sm text-phantom-gray">
              Create agents with custom testing behaviors
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            disabled={customAgents.length >= 3}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-neural to-electric-cyan text-white font-medium hover:shadow-glow transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Create Agent
          </button>
        </div>

        {customAgents.length === 0 ? (
          <div className="py-12 text-center">
            <Bot className="w-12 h-12 text-phantom-gray mx-auto mb-4" />
            <p className="text-phantom-gray mb-2">No custom agents yet</p>
            <p className="text-sm text-mist-gray">
              Create agents tailored to your specific testing needs
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {customAgents.map((agent) => (
              <div
                key={agent.id}
                className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neural to-electric-cyan flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white font-medium">{agent.name}</h4>
                        {agent.devicePreference === "mobile" && (
                          <Smartphone className="w-4 h-4 text-phantom-gray" />
                        )}
                        {agent.devicePreference === "desktop" && (
                          <Monitor className="w-4 h-4 text-phantom-gray" />
                        )}
                        {agent.devicePreference === "tablet" && (
                          <Globe className="w-4 h-4 text-phantom-gray" />
                        )}
                      </div>
                      <p className="text-sm text-phantom-gray mb-2">
                        {agent.personality}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {agent.traits.map((trait) => (
                          <span
                            key={trait}
                            className="px-2 py-0.5 rounded-lg bg-white/5 text-xs text-phantom-gray"
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right mr-4">
                      <p className="text-sm text-white">
                        {agent.testsRun} tests
                      </p>
                      <p className="text-xs text-quantum-green">
                        {agent.bugsFound} bugs found
                      </p>
                    </div>
                    <button
                      onClick={() => toggleAgent(agent.id)}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      {agent.enabled ? (
                        <ToggleRight className="w-6 h-6 text-quantum-green" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-phantom-gray" />
                      )}
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                      <Edit3 className="w-4 h-4 text-phantom-gray" />
                    </button>
                    <button
                      onClick={() => deleteAgent(agent.id)}
                      className="p-2 rounded-lg hover:bg-plasma-pink/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-plasma-pink" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Create Agent Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100]">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none overflow-y-auto">
            <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-void-elevated rounded-2xl border border-white/10 pointer-events-auto">
              <div className="p-6 border-b border-white/10">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5 text-phantom-gray" />
                </button>
                <h3 className="text-xl font-bold text-white">
                  Create Custom Agent
                </h3>
                <p className="text-phantom-gray text-sm mt-1">
                  Define a new AI testing persona
                </p>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-phantom-gray mb-2">
                    Agent Name *
                  </label>
                  <input
                    type="text"
                    value={newAgent.name}
                    onChange={(e) =>
                      setNewAgent({ ...newAgent, name: e.target.value })
                    }
                    placeholder="e.g., Security Tester"
                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-neural transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-phantom-gray mb-2">
                    Personality *
                  </label>
                  <input
                    type="text"
                    value={newAgent.personality}
                    onChange={(e) =>
                      setNewAgent({ ...newAgent, personality: e.target.value })
                    }
                    placeholder="e.g., Methodical and security-conscious"
                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-neural transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-phantom-gray mb-2">
                    Testing Strategy *
                  </label>
                  <textarea
                    value={newAgent.testingStrategy}
                    onChange={(e) =>
                      setNewAgent({
                        ...newAgent,
                        testingStrategy: e.target.value,
                      })
                    }
                    placeholder="Describe how this agent should approach testing..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-neural transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-phantom-gray mb-2">
                    Device Preference
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      {
                        id: "desktop" as const,
                        icon: Monitor,
                        label: "Desktop",
                      },
                      {
                        id: "mobile" as const,
                        icon: Smartphone,
                        label: "Mobile",
                      },
                      { id: "tablet" as const, icon: Globe, label: "Tablet" },
                    ].map((device) => {
                      const Icon = device.icon;
                      return (
                        <button
                          key={device.id}
                          onClick={() =>
                            setNewAgent({
                              ...newAgent,
                              devicePreference: device.id,
                            })
                          }
                          className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                            newAgent.devicePreference === device.id
                              ? "bg-neural/20 border-neural/30 text-white"
                              : "bg-white/5 border-white/10 text-phantom-gray hover:bg-white/10"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-sm">{device.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-phantom-gray mb-2">
                    Personality Traits (up to 5)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newTrait}
                      onChange={(e) => setNewTrait(e.target.value)}
                      placeholder="e.g., Patient"
                      className="flex-1 h-10 px-4 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-neural transition-all"
                      onKeyPress={(e) => e.key === "Enter" && handleAddTrait()}
                    />
                    <button
                      onClick={handleAddTrait}
                      disabled={!newTrait || newAgent.traits.length >= 5}
                      className="px-4 h-10 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all disabled:opacity-50"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {newAgent.traits.map((trait) => (
                      <span
                        key={trait}
                        className="px-3 py-1 rounded-lg bg-neural/20 text-neural-bright text-sm flex items-center gap-2"
                      >
                        {trait}
                        <button
                          onClick={() => handleRemoveTrait(trait)}
                          className="hover:text-white transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/10 flex gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAgent}
                  disabled={
                    !newAgent.name ||
                    !newAgent.personality ||
                    !newAgent.testingStrategy
                  }
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-neural to-electric-cyan text-white font-medium hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Agent
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
