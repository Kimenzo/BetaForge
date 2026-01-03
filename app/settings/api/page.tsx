"use client";

import { useState } from "react";
import {
  Code2,
  Key,
  Copy,
  Check,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  RefreshCw,
  Github,
  GitBranch,
  Webhook,
  ExternalLink,
  Shield,
  Clock,
  AlertTriangle,
} from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  lastUsed: string | null;
  createdAt: string;
  permissions: string[];
}

interface Integration {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  connected: boolean;
  connectedAt?: string;
  status?: "active" | "error";
}

export default function ApiSettingsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showKeyId, setShowKeyId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>([
    "read",
  ]);

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "1",
      name: "Production API Key",
      key: "bf_live_sk_1234567890abcdef1234567890abcdef",
      lastUsed: "2 hours ago",
      createdAt: "2025-10-15",
      permissions: ["read", "write", "test"],
    },
    {
      id: "2",
      name: "CI/CD Integration",
      key: "bf_live_sk_abcdef1234567890abcdef1234567890",
      lastUsed: "5 minutes ago",
      createdAt: "2025-11-20",
      permissions: ["read", "test"],
    },
  ]);

  const integrations: Integration[] = [
    {
      id: "github",
      name: "GitHub",
      icon: Github,
      description: "Run tests on push, PR, or release events",
      connected: true,
      connectedAt: "2025-09-10",
      status: "active",
    },
    {
      id: "gitlab",
      name: "GitLab",
      icon: GitBranch,
      description: "Integrate with GitLab CI/CD pipelines",
      connected: false,
    },
    {
      id: "bitbucket",
      name: "Bitbucket",
      icon: GitBranch,
      description: "Connect to Bitbucket repositories",
      connected: false,
    },
    {
      id: "webhooks",
      name: "Webhooks",
      icon: Webhook,
      description: "Receive real-time notifications",
      connected: true,
      connectedAt: "2025-11-05",
      status: "active",
    },
  ];

  const handleCopyKey = (id: string, key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateKey = () => {
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `bf_live_sk_${Math.random().toString(36).substring(2, 34)}`,
      lastUsed: null,
      createdAt: new Date().toISOString().split("T")[0],
      permissions: newKeyPermissions,
    };
    setApiKeys([...apiKeys, newKey]);
    setShowCreateModal(false);
    setNewKeyName("");
    setNewKeyPermissions(["read"]);
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys(apiKeys.filter((key) => key.id !== id));
  };

  const togglePermission = (permission: string) => {
    if (newKeyPermissions.includes(permission)) {
      setNewKeyPermissions(newKeyPermissions.filter((p) => p !== permission));
    } else {
      setNewKeyPermissions([...newKeyPermissions, permission]);
    }
  };

  const maskKey = (key: string) => {
    return key.substring(0, 12) + "•".repeat(24) + key.substring(key.length - 4);
  };

  return (
    <div className="p-8 max-w-4xl">
      {/* Section Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-white mb-2">
          API & Integrations
        </h1>
        <p className="text-phantom-gray">
          Manage API keys and connect external services
        </p>
      </div>

      {/* API Documentation Link */}
      <section className="mb-8 p-4 rounded-xl bg-gradient-to-br from-neural/10 to-electric-cyan/10 border border-neural/20 flex items-center justify-between animate-fade-in-up stagger-1">
        <div className="flex items-center gap-3">
          <Code2 className="w-5 h-5 text-neural-bright" />
          <span className="text-white">
            Need help with the API?{" "}
            <a href="/docs/api" className="text-neural-bright hover:underline">
              Read the documentation
            </a>
          </span>
        </div>
        <a
          href="/docs/api"
          className="px-4 py-2 rounded-lg bg-white/5 text-white text-sm hover:bg-white/10 transition-all flex items-center gap-2"
        >
          View Docs
          <ExternalLink className="w-4 h-4" />
        </a>
      </section>

      {/* API Keys */}
      <section className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10 animate-fade-in-up stagger-2">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">API Keys</h3>
            <p className="text-sm text-phantom-gray">
              Create and manage your API keys for programmatic access
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-neural to-electric-cyan text-white font-medium hover:shadow-glow transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Key
          </button>
        </div>

        <div className="space-y-4">
          {apiKeys.map((apiKey) => (
            <div
              key={apiKey.id}
              className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Key className="w-4 h-4 text-neural-bright" />
                    <h4 className="text-white font-medium">{apiKey.name}</h4>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-phantom-gray">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {apiKey.lastUsed
                        ? `Last used ${apiKey.lastUsed}`
                        : "Never used"}
                    </span>
                    <span>Created {apiKey.createdAt}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {apiKey.permissions.map((perm) => (
                    <span
                      key={perm}
                      className="px-2 py-1 rounded-lg bg-white/5 text-xs text-phantom-gray capitalize"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 h-10 px-4 rounded-lg bg-void-black border border-white/10 flex items-center font-mono text-sm text-phantom-gray overflow-hidden">
                  {showKeyId === apiKey.id ? apiKey.key : maskKey(apiKey.key)}
                </div>
                <button
                  onClick={() =>
                    setShowKeyId(showKeyId === apiKey.id ? null : apiKey.id)
                  }
                  className="h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-phantom-gray hover:bg-white/10 transition-all"
                >
                  {showKeyId === apiKey.id ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => handleCopyKey(apiKey.id, apiKey.key)}
                  className={`h-10 px-3 rounded-lg border transition-all flex items-center gap-2 ${
                    copiedId === apiKey.id
                      ? "bg-quantum-green/20 border-quantum-green/30 text-quantum-green"
                      : "bg-white/5 border-white/10 text-phantom-gray hover:bg-white/10"
                  }`}
                >
                  {copiedId === apiKey.id ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => handleDeleteKey(apiKey.id)}
                  className="h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-plasma-pink hover:bg-plasma-pink/10 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-3">
          <Shield className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-500 font-medium text-sm">Security Note</p>
            <p className="text-sm text-yellow-500/80">
              Keep your API keys secure. Never commit them to version control or
              share them publicly.
            </p>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="p-6 rounded-2xl bg-white/5 border border-white/10 animate-fade-in-up stagger-3">
        <h3 className="text-lg font-semibold text-white mb-6">Integrations</h3>
        <div className="grid grid-cols-2 gap-4">
          {integrations.map((integration) => {
            const Icon = integration.icon;
            return (
              <div
                key={integration.id}
                className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">
                        {integration.name}
                      </h4>
                      {integration.connected && (
                        <span className="text-xs text-quantum-green">
                          Connected
                        </span>
                      )}
                    </div>
                  </div>
                  {integration.status === "error" && (
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  )}
                </div>
                <p className="text-sm text-phantom-gray mb-4">
                  {integration.description}
                </p>
                <button
                  className={`w-full py-2 rounded-lg font-medium text-sm transition-all ${
                    integration.connected
                      ? "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                      : "bg-gradient-to-r from-neural to-electric-cyan text-white hover:shadow-glow"
                  }`}
                >
                  {integration.connected ? "Configure" : "Connect"}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Create Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100]">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
          <div className="relative w-full max-w-md p-6 bg-void-elevated rounded-2xl border border-white/10 pointer-events-auto">
            <h3 className="text-xl font-bold text-white mb-2">
              Create API Key
            </h3>
            <p className="text-phantom-gray text-sm mb-6">
              Generate a new API key for your integrations
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-phantom-gray mb-2">
                  Key Name *
                </label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g., Production API Key"
                  className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-neural transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-phantom-gray mb-2">
                  Permissions
                </label>
                <div className="flex gap-2">
                  {["read", "write", "test", "admin"].map((perm) => (
                    <button
                      key={perm}
                      onClick={() => togglePermission(perm)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium capitalize transition-all ${
                        newKeyPermissions.includes(perm)
                          ? "bg-neural/20 border-neural/30 text-white"
                          : "bg-white/5 border-white/10 text-phantom-gray hover:bg-white/10"
                      }`}
                    >
                      {perm}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateKey}
                disabled={!newKeyName || newKeyPermissions.length === 0}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-neural to-electric-cyan text-white font-medium hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Key
              </button>
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}
