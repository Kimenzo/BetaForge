"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Code,
  ChevronRight,
  Sparkles,
  Copy,
  Check,
  Lock,
  Key,
  Globe,
  FileJson,
  Webhook,
  AlertCircle,
  CheckCircle2,
  Clock,
  BookOpen,
  Zap,
  ArrowRight,
  Play,
  FileCode,
} from "lucide-react";
import { Footer } from "@/components/layout";

const endpoints = [
  {
    category: "Projects",
    description: "Manage your testing projects",
    items: [
      { method: "GET", path: "/v1/projects", description: "List all projects" },
      { method: "POST", path: "/v1/projects", description: "Create a new project" },
      { method: "GET", path: "/v1/projects/:id", description: "Get a specific project" },
      { method: "PUT", path: "/v1/projects/:id", description: "Update a project" },
      { method: "DELETE", path: "/v1/projects/:id", description: "Delete a project" },
    ],
  },
  {
    category: "Test Sessions",
    description: "Create and manage test sessions",
    items: [
      { method: "GET", path: "/v1/sessions", description: "List all sessions" },
      { method: "POST", path: "/v1/sessions", description: "Start a new test session" },
      { method: "GET", path: "/v1/sessions/:id", description: "Get session details" },
      { method: "GET", path: "/v1/sessions/:id/stream", description: "Stream real-time updates (SSE)" },
      { method: "POST", path: "/v1/sessions/:id/stop", description: "Stop a running session" },
    ],
  },
  {
    category: "Bug Reports",
    description: "Access and manage bug reports",
    items: [
      { method: "GET", path: "/v1/reports", description: "List all bug reports" },
      { method: "GET", path: "/v1/reports/:id", description: "Get a specific report" },
      { method: "PUT", path: "/v1/reports/:id", description: "Update report status" },
      { method: "GET", path: "/v1/sessions/:id/reports", description: "Get reports for a session" },
    ],
  },
  {
    category: "Agents",
    description: "Configure AI testing agents",
    items: [
      { method: "GET", path: "/v1/agents", description: "List available agents" },
      { method: "GET", path: "/v1/agents/:id", description: "Get agent details" },
      { method: "PUT", path: "/v1/agents/:id/config", description: "Update agent configuration" },
    ],
  },
  {
    category: "Webhooks",
    description: "Manage webhook integrations",
    items: [
      { method: "GET", path: "/v1/webhooks", description: "List configured webhooks" },
      { method: "POST", path: "/v1/webhooks", description: "Create a webhook" },
      { method: "DELETE", path: "/v1/webhooks/:id", description: "Delete a webhook" },
    ],
  },
];

const codeExamples = {
  curl: `curl -X POST https://api.betaforge.ai/v1/sessions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "projectId": "proj_abc123",
    "agents": ["sarah", "marcus", "diego"],
    "testUrl": "https://staging.myapp.com",
    "duration": 30
  }'`,
  javascript: `const response = await fetch('https://api.betaforge.ai/v1/sessions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    projectId: 'proj_abc123',
    agents: ['sarah', 'marcus', 'diego'],
    testUrl: 'https://staging.myapp.com',
    duration: 30
  })
});

const session = await response.json();`,
  python: `import requests

response = requests.post(
    'https://api.betaforge.ai/v1/sessions',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    json={
        'projectId': 'proj_abc123',
        'agents': ['sarah', 'marcus', 'diego'],
        'testUrl': 'https://staging.myapp.com',
        'duration': 30
    }
)

session = response.json()`,
};

const methodColors: Record<string, string> = {
  GET: "text-quantum-green bg-quantum-green/10",
  POST: "text-neural-bright bg-neural/10",
  PUT: "text-electric-cyan bg-electric-cyan/10",
  DELETE: "text-red-400 bg-red-400/10",
};

export default function ApiReferencePage() {
  const [activeTab, setActiveTab] = useState<"curl" | "javascript" | "python">("javascript");
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(codeExamples[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-void-black">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 mesh-bg opacity-30" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-electric-cyan/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-neural/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-void-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-neural-bright to-electric-cyan flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">BetaForge</span>
              </Link>
              <nav className="hidden md:flex items-center">
                <Link href="/docs" className="text-phantom-gray hover:text-ghost-white text-sm transition-colors px-3 py-2">
                  Docs
                </Link>
                <ChevronRight className="w-4 h-4 text-mist-gray" />
                <span className="text-ghost-white text-sm px-3 py-2">API Reference</span>
              </nav>
            </div>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-lg bg-neural/20 text-ghost-white text-sm font-medium hover:bg-neural/30 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-phantom-gray mb-6">
            <Link href="/docs" className="hover:text-ghost-white transition-colors">
              Documentation
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-ghost-white">API Reference</span>
          </div>

          <div className="flex items-start gap-6 mb-8">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-electric-cyan/20 to-neural/20 border border-electric-cyan/20">
              <Code className="w-8 h-8 text-electric-cyan" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-ghost-white mb-4">
                API Reference
              </h1>
              <p className="text-lg text-phantom-gray max-w-2xl">
                Complete REST API documentation for BetaForge. Integrate AI-powered testing
                into your applications and workflows programmatically.
              </p>
            </div>
          </div>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <div className="p-4 bg-void-elevated border border-white/5 rounded-xl flex items-center gap-4">
              <div className="p-2 rounded-lg bg-neural/20">
                <Globe className="w-5 h-5 text-neural-bright" />
              </div>
              <div>
                <p className="text-sm text-mist-gray">Base URL</p>
                <p className="text-ghost-white font-mono text-sm">api.betaforge.ai</p>
              </div>
            </div>
            <div className="p-4 bg-void-elevated border border-white/5 rounded-xl flex items-center gap-4">
              <div className="p-2 rounded-lg bg-electric-cyan/20">
                <Lock className="w-5 h-5 text-electric-cyan" />
              </div>
              <div>
                <p className="text-sm text-mist-gray">Authentication</p>
                <p className="text-ghost-white font-mono text-sm">Bearer Token</p>
              </div>
            </div>
            <div className="p-4 bg-void-elevated border border-white/5 rounded-xl flex items-center gap-4">
              <div className="p-2 rounded-lg bg-quantum-green/20">
                <FileJson className="w-5 h-5 text-quantum-green" />
              </div>
              <div>
                <p className="text-sm text-mist-gray">Format</p>
                <p className="text-ghost-white font-mono text-sm">JSON</p>
              </div>
            </div>
          </div>

          {/* Authentication Section */}
          <div className="p-6 bg-void-elevated border border-white/5 rounded-2xl mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Key className="w-6 h-6 text-neural-bright" />
              <h2 className="text-xl font-bold text-ghost-white">Authentication</h2>
            </div>
            <p className="text-phantom-gray mb-4">
              All API requests require authentication using a Bearer token. Include your API key
              in the Authorization header of every request.
            </p>
            <div className="p-4 bg-void-black rounded-xl border border-white/10">
              <code className="text-sm text-phantom-gray font-mono">
                Authorization: Bearer YOUR_API_KEY
              </code>
            </div>
            <p className="text-sm text-mist-gray mt-4">
              Get your API key from the{" "}
              <Link href="/dashboard/settings" className="text-neural-bright hover:underline">
                Dashboard Settings
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Example Request */}
      <section className="relative py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-ghost-white mb-6">Quick Example</h2>
          <div className="bg-void-elevated border border-white/5 rounded-2xl overflow-hidden">
            {/* Language Tabs */}
            <div className="flex items-center gap-1 p-2 border-b border-white/5">
              {(["curl", "javascript", "python"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveTab(lang)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === lang
                      ? "bg-neural/20 text-ghost-white"
                      : "text-phantom-gray hover:text-ghost-white"
                  }`}
                >
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </button>
              ))}
              <div className="flex-1" />
              <button
                onClick={copyCode}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-phantom-gray hover:text-ghost-white transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-quantum-green" />
                    <span className="text-quantum-green">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            {/* Code Block */}
            <pre className="p-6 overflow-x-auto">
              <code className="text-sm text-phantom-gray font-mono whitespace-pre">
                {codeExamples[activeTab]}
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* Endpoints */}
      <section className="relative py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-ghost-white mb-8">Endpoints</h2>
          <div className="space-y-8">
            {endpoints.map((category, catIndex) => (
              <div
                key={catIndex}
                className="bg-void-elevated border border-white/5 rounded-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-white/5">
                  <h3 className="text-xl font-bold text-ghost-white mb-1">
                    {category.category}
                  </h3>
                  <p className="text-sm text-phantom-gray">{category.description}</p>
                </div>
                <div className="divide-y divide-white/5">
                  {category.items.map((endpoint, index) => (
                    <div
                      key={index}
                      className="px-6 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors group cursor-pointer"
                    >
                      <span
                        className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                          methodColors[endpoint.method]
                        }`}
                      >
                        {endpoint.method}
                      </span>
                      <code className="text-sm text-ghost-white font-mono flex-1">
                        {endpoint.path}
                      </code>
                      <span className="text-sm text-phantom-gray hidden md:block">
                        {endpoint.description}
                      </span>
                      <ChevronRight className="w-4 h-4 text-mist-gray group-hover:text-ghost-white group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rate Limiting & Errors */}
      <section className="relative py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Rate Limiting */}
            <div className="p-6 bg-void-elevated border border-white/5 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-electric-cyan" />
                <h3 className="text-xl font-bold text-ghost-white">Rate Limiting</h3>
              </div>
              <p className="text-phantom-gray mb-4">
                API requests are rate limited based on your plan tier.
              </p>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-phantom-gray">Free</span>
                  <span className="text-ghost-white">100 requests/hour</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-phantom-gray">Pro</span>
                  <span className="text-ghost-white">1,000 requests/hour</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-phantom-gray">Enterprise</span>
                  <span className="text-ghost-white">Unlimited</span>
                </div>
              </div>
            </div>

            {/* Error Codes */}
            <div className="p-6 bg-void-elevated border border-white/5 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-plasma-pink" />
                <h3 className="text-xl font-bold text-ghost-white">Error Codes</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <code className="text-red-400">400</code>
                  <span className="text-phantom-gray">Bad Request</span>
                </div>
                <div className="flex justify-between text-sm">
                  <code className="text-red-400">401</code>
                  <span className="text-phantom-gray">Unauthorized</span>
                </div>
                <div className="flex justify-between text-sm">
                  <code className="text-red-400">403</code>
                  <span className="text-phantom-gray">Forbidden</span>
                </div>
                <div className="flex justify-between text-sm">
                  <code className="text-red-400">404</code>
                  <span className="text-phantom-gray">Not Found</span>
                </div>
                <div className="flex justify-between text-sm">
                  <code className="text-red-400">429</code>
                  <span className="text-phantom-gray">Rate Limited</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SDKs */}
      <section className="relative py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-ghost-white mb-6">Official SDKs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="#"
              className="group p-6 bg-void-elevated border border-white/5 rounded-2xl hover:border-neural/30 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center text-yellow-500 font-bold text-lg">
                  JS
                </div>
                <div>
                  <h4 className="font-semibold text-ghost-white">JavaScript / Node.js</h4>
                  <p className="text-xs text-mist-gray">npm install @betaforge/sdk</p>
                </div>
              </div>
              <p className="text-sm text-phantom-gray">
                Full-featured SDK for JavaScript and Node.js applications.
              </p>
            </Link>
            <Link
              href="#"
              className="group p-6 bg-void-elevated border border-white/5 rounded-2xl hover:border-neural/30 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-lg">
                  PY
                </div>
                <div>
                  <h4 className="font-semibold text-ghost-white">Python</h4>
                  <p className="text-xs text-mist-gray">pip install betaforge</p>
                </div>
              </div>
              <p className="text-sm text-phantom-gray">
                Python SDK with async support and type hints.
              </p>
            </Link>
            <Link
              href="#"
              className="group p-6 bg-void-elevated border border-white/5 rounded-2xl hover:border-neural/30 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold text-lg">
                  GO
                </div>
                <div>
                  <h4 className="font-semibold text-ghost-white">Go</h4>
                  <p className="text-xs text-mist-gray">go get github.com/betaforge/go-sdk</p>
                </div>
              </div>
              <p className="text-sm text-phantom-gray">
                Lightweight Go client for high-performance integrations.
              </p>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
