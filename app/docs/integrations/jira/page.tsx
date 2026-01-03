"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronRight,
  Sparkles,
  Copy,
  Check,
  Shield,
  Zap,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Key,
  ExternalLink,
  Code2,
  Settings,
  Filter,
  ArrowRightLeft,
  GitBranch,
  Tag,
  Layers,
  RefreshCw,
  Users,
  ListTodo,
  FileText,
  Link2,
} from "lucide-react";
import { Footer } from "@/components/layout";

const jiraIssueExample = `{
  "fields": {
    "project": {
      "key": "MYAPP"
    },
    "summary": "Form validation bypassed with special characters",
    "description": {
      "type": "doc",
      "version": 1,
      "content": [
        {
          "type": "heading",
          "attrs": { "level": 2 },
          "content": [{ "type": "text", "text": "Bug Description" }]
        },
        {
          "type": "paragraph",
          "content": [{
            "type": "text",
            "text": "When entering <script>alert('xss')</script> into the name field, the form accepts it without sanitization."
          }]
        },
        {
          "type": "heading",
          "attrs": { "level": 2 },
          "content": [{ "type": "text", "text": "Steps to Reproduce" }]
        },
        {
          "type": "orderedList",
          "content": [
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Navigate to /signup" }]
              }]
            },
            {
              "type": "listItem", 
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Enter malicious script in name field" }]
              }]
            }
          ]
        },
        {
          "type": "heading",
          "attrs": { "level": 2 },
          "content": [{ "type": "text", "text": "Environment" }]
        },
        {
          "type": "bulletList",
          "content": [
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Browser: Chrome 120" }]
              }]
            },
            {
              "type": "listItem",
              "content": [{
                "type": "paragraph",
                "content": [{ "type": "text", "text": "OS: macOS Sonoma" }]
              }]
            }
          ]
        }
      ]
    },
    "issuetype": {
      "name": "Bug"
    },
    "priority": {
      "name": "High"
    },
    "labels": ["betaforge", "xss", "security"],
    "customfield_10001": "sess_abc123",
    "customfield_10002": "Diego - Chaos Tester"
  }
}`;

const integrationCode = `import Anthropic from '@anthropic-ai/sdk';

// Sync BetaForge bugs to Jira automatically
async function syncBugToJira(bugData) {
  const jira = new JiraClient({
    host: process.env.JIRA_HOST,
    email: process.env.JIRA_EMAIL,
    token: process.env.JIRA_API_TOKEN
  });
  
  // Check for duplicates first
  const existingIssues = await jira.searchJql(
    \`project = "\${bugData.projectKey}" AND labels = "betaforge" AND summary ~ "\${bugData.title}"\`
  );
  
  if (existingIssues.total > 0) {
    console.log('Similar issue already exists:', existingIssues.issues[0].key);
    return { action: 'skipped', existing: existingIssues.issues[0].key };
  }
  
  // Create the issue
  const issue = await jira.createIssue({
    fields: {
      project: { key: bugData.projectKey },
      summary: bugData.title,
      description: formatDescription(bugData),
      issuetype: { name: 'Bug' },
      priority: { name: mapSeverity(bugData.severity) },
      labels: ['betaforge', bugData.agentName.toLowerCase().replace(' ', '-')],
      components: detectComponents(bugData.url),
    }
  });
  
  // Attach screenshots
  if (bugData.screenshots?.length) {
    for (const screenshot of bugData.screenshots) {
      await jira.addAttachment(issue.key, screenshot);
    }
  }
  
  // Link back to BetaForge
  await jira.addRemoteLink(issue.key, {
    globalId: \`betaforge-\${bugData.id}\`,
    object: {
      url: \`https://app.betaforge.ai/bugs/\${bugData.id}\`,
      title: 'View in BetaForge',
      icon: { url16x16: 'https://betaforge.ai/favicon.ico' }
    }
  });
  
  return { action: 'created', key: issue.key };
}

function mapSeverity(severity) {
  const map = {
    critical: 'Highest',
    high: 'High', 
    medium: 'Medium',
    low: 'Low',
    info: 'Lowest'
  };
  return map[severity] || 'Medium';
}`;

const fieldMappings = [
  {
    betaforge: "title",
    jira: "summary",
    description: "Bug title becomes issue summary",
  },
  {
    betaforge: "description",
    jira: "description",
    description: "Full description with ADF formatting",
  },
  {
    betaforge: "severity",
    jira: "priority",
    description: "Critical→Highest, High→High, etc.",
  },
  {
    betaforge: "agentName",
    jira: "labels",
    description: "Added as a label (e.g., 'diego-chaos-tester')",
  },
  {
    betaforge: "sessionId",
    jira: "customfield_*",
    description: "Linked to custom field if configured",
  },
  {
    betaforge: "url",
    jira: "customfield_*",
    description: "Page URL stored in custom field",
  },
  {
    betaforge: "screenshots",
    jira: "attachments",
    description: "Uploaded as issue attachments",
  },
  {
    betaforge: "stepsToReproduce",
    jira: "description",
    description: "Formatted as numbered list in description",
  },
];

export default function JiraIntegrationPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"cloud" | "server">("cloud");

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-void-black">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 mesh-bg opacity-30" />
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#0052CC]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-neural/10 rounded-full blur-[100px]" />
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
                <span className="text-xl font-bold gradient-text">
                  BetaForge
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/docs/integrations"
                className="text-phantom-gray hover:text-ghost-white text-sm transition-colors"
              >
                All Integrations
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-lg bg-neural/20 text-ghost-white text-sm font-medium hover:bg-neural/30 transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb & Hero */}
      <section className="relative pt-32 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-phantom-gray mb-8">
            <Link
              href="/docs"
              className="hover:text-ghost-white transition-colors"
            >
              Docs
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href="/docs/integrations"
              className="hover:text-ghost-white transition-colors"
            >
              Integrations
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-ghost-white">Jira</span>
          </div>

          <div className="flex items-start gap-6 mb-12">
            <div className="p-4 rounded-2xl bg-[#0052CC] border border-[#0747A6]">
              <svg
                className="w-10 h-10 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005z" />
                <path
                  d="M5.024 5.77v6.744H16.24a5.215 5.215 0 0 0 5.232-5.215V5.027a1.005 1.005 0 0 0-1.005-1.004H6.029A1.005 1.005 0 0 0 5.024 5.77z"
                  opacity=".65"
                />
                <path
                  d="M10.81 0v5.77h11.69a1.005 1.005 0 0 0 1.005-1.005V0H10.81z"
                  opacity=".4"
                />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-ghost-white">Jira</h1>
                <span className="px-2 py-1 text-xs bg-neural/20 text-neural-bright rounded-full">
                  Popular
                </span>
              </div>
              <p className="text-lg text-phantom-gray mb-6">
                Automatically create and sync Jira issues from BetaForge bug
                reports. Two-way sync keeps your development team aligned.
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="/settings/api"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-neural to-electric-cyan text-white font-semibold hover:shadow-glow transition-all"
                >
                  Connect Jira
                  <Settings className="w-4 h-4" />
                </Link>
                <a
                  href="https://developer.atlassian.com/cloud/jira/platform/rest/v3/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-ghost-white font-medium hover:border-neural/30 transition-all"
                >
                  Jira API Docs
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="p-4 bg-void-elevated border border-white/5 rounded-xl">
              <ArrowRightLeft className="w-6 h-6 text-[#0052CC] mb-2" />
              <h3 className="font-semibold text-ghost-white text-sm">
                Two-Way Sync
              </h3>
              <p className="text-xs text-phantom-gray">
                Status synced both ways
              </p>
            </div>
            <div className="p-4 bg-void-elevated border border-white/5 rounded-xl">
              <Filter className="w-6 h-6 text-[#36B37E] mb-2" />
              <h3 className="font-semibold text-ghost-white text-sm">
                Smart Dedup
              </h3>
              <p className="text-xs text-phantom-gray">
                Prevents duplicate issues
              </p>
            </div>
            <div className="p-4 bg-void-elevated border border-white/5 rounded-xl">
              <Tag className="w-6 h-6 text-[#6554C0] mb-2" />
              <h3 className="font-semibold text-ghost-white text-sm">
                Auto Labels
              </h3>
              <p className="text-xs text-phantom-gray">
                Severity, agent, category
              </p>
            </div>
            <div className="p-4 bg-void-elevated border border-white/5 rounded-xl">
              <Link2 className="w-6 h-6 text-[#FF5630] mb-2" />
              <h3 className="font-semibold text-ghost-white text-sm">
                Deep Links
              </h3>
              <p className="text-xs text-phantom-gray">
                Jump to BetaForge reports
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Connection Setup */}
      <section className="relative py-12 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-ghost-white mb-8 flex items-center gap-3">
            <Key className="w-6 h-6 text-electric-cyan" />
            Connection Setup
          </h2>

          {/* Cloud vs Server Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab("cloud")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "cloud"
                  ? "bg-[#0052CC] text-white"
                  : "bg-void-elevated text-phantom-gray hover:text-ghost-white"
              }`}
            >
              Jira Cloud
            </button>
            <button
              onClick={() => setActiveTab("server")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "server"
                  ? "bg-[#0052CC] text-white"
                  : "bg-void-elevated text-phantom-gray hover:text-ghost-white"
              }`}
            >
              Jira Server / Data Center
            </button>
          </div>

          {activeTab === "cloud" ? (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 bg-void-elevated border border-white/5 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-quantum-green/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-quantum-green" />
                  </div>
                  <h3 className="text-lg font-semibold text-ghost-white">
                    OAuth 2.0 (Recommended)
                  </h3>
                </div>
                <p className="text-sm text-phantom-gray mb-6">
                  Secure OAuth flow - no tokens to manage manually.
                </p>
                <ol className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-neural/20 text-neural-bright flex items-center justify-center text-xs font-bold flex-shrink-0">
                      1
                    </span>
                    <span className="text-sm text-phantom-gray">
                      Go to{" "}
                      <Link
                        href="/settings/api"
                        className="text-neural-bright hover:underline"
                      >
                        Settings → Integrations
                      </Link>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-neural/20 text-neural-bright flex items-center justify-center text-xs font-bold flex-shrink-0">
                      2
                    </span>
                    <span className="text-sm text-phantom-gray">
                      Click &quot;Connect Jira Cloud&quot;
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-neural/20 text-neural-bright flex items-center justify-center text-xs font-bold flex-shrink-0">
                      3
                    </span>
                    <span className="text-sm text-phantom-gray">
                      Authorize BetaForge in Atlassian
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-neural/20 text-neural-bright flex items-center justify-center text-xs font-bold flex-shrink-0">
                      4
                    </span>
                    <span className="text-sm text-phantom-gray">
                      Select projects to sync
                    </span>
                  </li>
                </ol>
              </div>

              <div className="p-6 bg-void-elevated border border-white/5 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-neural/20 flex items-center justify-center">
                    <Key className="w-5 h-5 text-neural-bright" />
                  </div>
                  <h3 className="text-lg font-semibold text-ghost-white">
                    API Token
                  </h3>
                </div>
                <p className="text-sm text-phantom-gray mb-6">
                  For self-hosted webhooks or custom integrations.
                </p>
                <ol className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-neural/20 text-neural-bright flex items-center justify-center text-xs font-bold flex-shrink-0">
                      1
                    </span>
                    <span className="text-sm text-phantom-gray">
                      Create an{" "}
                      <a
                        href="https://id.atlassian.com/manage-profile/security/api-tokens"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neural-bright hover:underline"
                      >
                        API token
                      </a>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-neural/20 text-neural-bright flex items-center justify-center text-xs font-bold flex-shrink-0">
                      2
                    </span>
                    <span className="text-sm text-phantom-gray">
                      Enter your Atlassian email and token in Settings
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-neural/20 text-neural-bright flex items-center justify-center text-xs font-bold flex-shrink-0">
                      3
                    </span>
                    <span className="text-sm text-phantom-gray">
                      Provide your site URL (e.g., yourcompany.atlassian.net)
                    </span>
                  </li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-void-elevated border border-white/5 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold text-ghost-white">
                  Jira Server / Data Center
                </h3>
              </div>
              <p className="text-sm text-phantom-gray mb-6">
                For on-premise Jira installations. Requires network access to
                your Jira server.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-ghost-white mb-3">
                    Requirements:
                  </h4>
                  <ul className="space-y-2 text-sm text-phantom-gray">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-quantum-green" />
                      Jira 8.0+ or Data Center 8.0+
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-quantum-green" />
                      HTTPS enabled
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-quantum-green" />
                      Application Link configured
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-ghost-white mb-3">
                    Setup steps:
                  </h4>
                  <ol className="space-y-2 text-sm text-phantom-gray list-decimal list-inside">
                    <li>Create an Application Link in Jira admin</li>
                    <li>Configure incoming authentication</li>
                    <li>Enter credentials in BetaForge</li>
                    <li>Test the connection</li>
                  </ol>
                </div>
              </div>
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-xs text-yellow-400">
                  <strong>Enterprise plan required</strong> for Jira Server/Data
                  Center integration.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Field Mapping */}
      <section className="relative py-12 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-ghost-white mb-8 flex items-center gap-3">
            <Layers className="w-6 h-6 text-plasma-pink" />
            Field Mapping
          </h2>

          <p className="text-phantom-gray mb-6">
            BetaForge automatically maps bug report fields to Jira issue fields.
            Custom field mappings can be configured in Settings.
          </p>

          <div className="bg-void-elevated border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 bg-void-black/50">
                  <th className="text-left px-4 py-3 text-sm font-medium text-phantom-gray">
                    BetaForge Field
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-phantom-gray">
                    Jira Field
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-phantom-gray">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {fieldMappings.map((mapping, i, arr) => (
                  <tr
                    key={mapping.betaforge}
                    className={
                      i < arr.length - 1 ? "border-b border-white/5" : ""
                    }
                  >
                    <td className="px-4 py-3">
                      <code className="text-xs bg-neural/20 text-neural-bright px-2 py-1 rounded">
                        {mapping.betaforge}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs bg-[#0052CC]/20 text-[#4C9AFF] px-2 py-1 rounded">
                        {mapping.jira}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-phantom-gray">
                        {mapping.description}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Sync Behavior */}
      <section className="relative py-12 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-ghost-white mb-8 flex items-center gap-3">
            <RefreshCw className="w-6 h-6 text-quantum-green" />
            Sync Behavior
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-void-elevated border border-white/5 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-quantum-green/20 flex items-center justify-center mb-4">
                <ArrowRightLeft className="w-6 h-6 text-quantum-green" />
              </div>
              <h3 className="text-lg font-semibold text-ghost-white mb-2">
                Two-Way Status Sync
              </h3>
              <p className="text-sm text-phantom-gray mb-4">
                When a Jira issue is marked &quot;Done&quot;, the corresponding
                bug in BetaForge is marked as resolved.
              </p>
              <div className="text-xs text-phantom-gray">
                <strong className="text-ghost-white">Status mapping:</strong>
                <ul className="mt-2 space-y-1">
                  <li>To Do → Open</li>
                  <li>In Progress → Investigating</li>
                  <li>Done → Resolved</li>
                  <li>Won&apos;t Do → Closed (Won&apos;t Fix)</li>
                </ul>
              </div>
            </div>

            <div className="p-6 bg-void-elevated border border-white/5 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-electric-cyan/20 flex items-center justify-center mb-4">
                <Filter className="w-6 h-6 text-electric-cyan" />
              </div>
              <h3 className="text-lg font-semibold text-ghost-white mb-2">
                Smart Deduplication
              </h3>
              <p className="text-sm text-phantom-gray mb-4">
                Before creating an issue, BetaForge searches for existing issues
                with similar titles to prevent duplicates.
              </p>
              <div className="text-xs text-phantom-gray">
                <strong className="text-ghost-white">Dedup criteria:</strong>
                <ul className="mt-2 space-y-1">
                  <li>• Same project</li>
                  <li>• Similar title (fuzzy match)</li>
                  <li>• Open status</li>
                  <li>• Last 30 days</li>
                </ul>
              </div>
            </div>

            <div className="p-6 bg-void-elevated border border-white/5 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-plasma-pink/20 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-plasma-pink" />
              </div>
              <h3 className="text-lg font-semibold text-ghost-white mb-2">
                Comment Sync
              </h3>
              <p className="text-sm text-phantom-gray mb-4">
                Comments added in Jira appear in BetaForge, and vice versa.
                Great for collaboration between QA and dev.
              </p>
              <div className="text-xs text-phantom-gray">
                <strong className="text-ghost-white">What syncs:</strong>
                <ul className="mt-2 space-y-1">
                  <li>• Comments (both ways)</li>
                  <li>• Attachments (BetaForge → Jira)</li>
                  <li>• Status changes (both ways)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Issue Payload */}
      <section className="relative py-12 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-ghost-white mb-8 flex items-center gap-3">
            <Code2 className="w-6 h-6 text-electric-cyan" />
            Issue Payload Example
          </h2>

          <p className="text-phantom-gray mb-6">
            When BetaForge creates a Jira issue, it uses Atlassian Document
            Format (ADF) for rich descriptions with proper formatting.
          </p>

          <div className="bg-void-elevated border border-white/5 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-void-black/50">
              <span className="text-sm text-phantom-gray font-mono">
                jira-issue-payload.json
              </span>
              <button
                onClick={() => copyCode(jiraIssueExample, "payload")}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-phantom-gray hover:text-ghost-white transition-colors rounded-lg hover:bg-white/5"
              >
                {copied === "payload" ? (
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
            <pre className="p-6 overflow-x-auto max-h-[500px]">
              <code className="text-sm text-phantom-gray font-mono whitespace-pre">
                {jiraIssueExample}
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* Custom Integration Code */}
      <section className="relative py-12 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-ghost-white mb-8 flex items-center gap-3">
            <Code2 className="w-6 h-6 text-neural-bright" />
            Custom Integration
          </h2>

          <p className="text-phantom-gray mb-6">
            For advanced workflows, you can build a custom integration using
            BetaForge webhooks and the Jira REST API.
          </p>

          <div className="bg-void-elevated border border-white/5 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-void-black/50">
              <span className="text-sm text-phantom-gray font-mono">
                jira-sync.js
              </span>
              <button
                onClick={() => copyCode(integrationCode, "integration")}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-phantom-gray hover:text-ghost-white transition-colors rounded-lg hover:bg-white/5"
              >
                {copied === "integration" ? (
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
            <pre className="p-6 overflow-x-auto max-h-[500px]">
              <code className="text-sm text-phantom-gray font-mono whitespace-pre">
                {integrationCode}
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="relative py-12 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-ghost-white mb-8 flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-400" />
            Troubleshooting
          </h2>

          <div className="space-y-4">
            {[
              {
                problem: "Issues not being created",
                solution:
                  "Check that your API token has 'Create Issues' permission in the target project. Also verify the project key is correct.",
              },
              {
                problem: "Duplicate issues appearing",
                solution:
                  "Enable 'Smart Deduplication' in integration settings. BetaForge uses fuzzy title matching - ensure bug titles are descriptive.",
              },
              {
                problem: "Attachments not uploading",
                solution:
                  "Verify your Jira instance allows attachments and the file size is under the limit (default 10MB). Check API token permissions.",
              },
              {
                problem: "Two-way sync not working",
                solution:
                  "Ensure the Jira webhook is configured to send events to BetaForge. Check Settings → Webhooks for the correct URL.",
              },
              {
                problem: "Custom fields not mapping",
                solution:
                  "Custom field IDs vary per Jira instance. Use the Jira REST API to find your field IDs, then configure them in BetaForge settings.",
              },
            ].map((item) => (
              <div
                key={item.problem}
                className="p-4 bg-void-elevated border border-white/5 rounded-xl"
              >
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-ghost-white mb-1">
                      {item.problem}
                    </h3>
                    <p className="text-sm text-phantom-gray">{item.solution}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
