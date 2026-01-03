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
  Terminal,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Key,
  ExternalLink,
  Code2,
  Bell,
  Settings,
  Filter,
  Hash,
  MessageSquare,
  Users,
  AtSign,
  Send,
  Eye,
} from "lucide-react";
import { Footer } from "@/components/layout";

const notificationExamples = {
  bugFound: `🐛 *New Bug Found*

*Project:* My App
*Severity:* 🔴 High
*Agent:* Diego - Chaos Tester

*Title:* Form validation bypassed with special characters

*Description:*
When entering \`<script>alert('xss')</script>\` into the name field, the form accepts it without sanitization.

<https://app.betaforge.ai/bugs/bug_xyz789|View Full Report>`,

  sessionComplete: `✅ *Test Session Complete*

*Project:* My App
*Duration:* 8 minutes
*Agents:* Sarah, Marcus, Diego

📊 *Summary:*
• Total bugs: 5
• 🔴 Critical: 0
• 🟠 High: 2
• 🟡 Medium: 2
• 🟢 Low: 1

<https://app.betaforge.ai/sessions/sess_abc123|View Dashboard>`,

  criticalAlert: `🚨 *CRITICAL BUG DETECTED*

*Project:* My App
*Agent:* Sarah - Cautious Explorer

*Title:* Payment form exposes credit card numbers in URL

*Immediate Action Required*
Credit card details are being passed as URL query parameters, visible in browser history and server logs.

<https://app.betaforge.ai/bugs/bug_critical123|View Details> | <https://app.betaforge.ai/bugs/bug_critical123/fix|Suggested Fix>`,
};

const setupCode = `// Incoming Webhook URL from Slack
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

// Example: Send notification for critical bugs
async function notifySlack(bugData) {
  const message = {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "🚨 Critical Bug Found",
          emoji: true
        }
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: \`*Project:*\\n\${bugData.projectName}\`
          },
          {
            type: "mrkdwn", 
            text: \`*Agent:*\\n\${bugData.agentName}\`
          }
        ]
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: \`*\${bugData.title}*\\n\${bugData.description}\`
        }
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "View Report"
            },
            url: bugData.dashboardUrl,
            style: "primary"
          }
        ]
      }
    ]
  };
  
  await fetch(SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message)
  });
}`;

export default function SlackIntegrationPage() {
  const [activeExample, setActiveExample] = useState<
    "bugFound" | "sessionComplete" | "criticalAlert"
  >("bugFound");
  const [copied, setCopied] = useState<string | null>(null);

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
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#4A154B]/20 rounded-full blur-[120px]" />
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
            <span className="text-ghost-white">Slack</span>
          </div>

          <div className="flex items-start gap-6 mb-12">
            <div className="p-4 rounded-2xl bg-[#4A154B] border border-[#611f69]">
              <svg
                className="w-10 h-10 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-ghost-white">Slack</h1>
                <span className="px-2 py-1 text-xs bg-quantum-green/20 text-quantum-green rounded-full">
                  Popular
                </span>
              </div>
              <p className="text-lg text-phantom-gray mb-6">
                Get instant notifications in your team&apos;s Slack channels
                when tests complete, bugs are found, or critical issues require
                attention.
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="/settings/api"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-neural to-electric-cyan text-white font-semibold hover:shadow-glow transition-all"
                >
                  Connect Slack
                  <Settings className="w-4 h-4" />
                </Link>
                <a
                  href="https://api.slack.com/messaging/webhooks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-ghost-white font-medium hover:border-neural/30 transition-all"
                >
                  Slack Docs
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="p-4 bg-void-elevated border border-white/5 rounded-xl">
              <Bell className="w-6 h-6 text-[#E01E5A] mb-2" />
              <h3 className="font-semibold text-ghost-white text-sm">
                Real-time Alerts
              </h3>
              <p className="text-xs text-phantom-gray">
                Instant bug notifications
              </p>
            </div>
            <div className="p-4 bg-void-elevated border border-white/5 rounded-xl">
              <Filter className="w-6 h-6 text-[#36C5F0] mb-2" />
              <h3 className="font-semibold text-ghost-white text-sm">
                Smart Filtering
              </h3>
              <p className="text-xs text-phantom-gray">
                By severity or project
              </p>
            </div>
            <div className="p-4 bg-void-elevated border border-white/5 rounded-xl">
              <Hash className="w-6 h-6 text-[#2EB67D] mb-2" />
              <h3 className="font-semibold text-ghost-white text-sm">
                Channel Routing
              </h3>
              <p className="text-xs text-phantom-gray">
                Route to specific channels
              </p>
            </div>
            <div className="p-4 bg-void-elevated border border-white/5 rounded-xl">
              <AtSign className="w-6 h-6 text-[#ECB22E] mb-2" />
              <h3 className="font-semibold text-ghost-white text-sm">
                User Mentions
              </h3>
              <p className="text-xs text-phantom-gray">Tag team members</p>
            </div>
          </div>
        </div>
      </section>

      {/* Setup Steps */}
      <section className="relative py-12 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-ghost-white mb-8 flex items-center gap-3">
            <Zap className="w-6 h-6 text-electric-cyan" />
            Quick Setup
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Option 1: Built-in */}
            <div className="p-6 bg-void-elevated border border-white/5 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-quantum-green/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-quantum-green" />
                </div>
                <h3 className="text-lg font-semibold text-ghost-white">
                  Option 1: Built-in Integration
                </h3>
              </div>
              <p className="text-sm text-phantom-gray mb-6">
                The easiest way - connect directly from BetaForge settings with
                OAuth.
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
                    Click &quot;Connect to Slack&quot;
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-neural/20 text-neural-bright flex items-center justify-center text-xs font-bold flex-shrink-0">
                    3
                  </span>
                  <span className="text-sm text-phantom-gray">
                    Authorize BetaForge in your workspace
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-neural/20 text-neural-bright flex items-center justify-center text-xs font-bold flex-shrink-0">
                    4
                  </span>
                  <span className="text-sm text-phantom-gray">
                    Select channels and notification preferences
                  </span>
                </li>
              </ol>
            </div>

            {/* Option 2: Webhook */}
            <div className="p-6 bg-void-elevated border border-white/5 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-neural/20 flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-neural-bright" />
                </div>
                <h3 className="text-lg font-semibold text-ghost-white">
                  Option 2: Incoming Webhook
                </h3>
              </div>
              <p className="text-sm text-phantom-gray mb-6">
                More control - use Slack&apos;s Incoming Webhooks with our
                webhook events.
              </p>
              <ol className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-neural/20 text-neural-bright flex items-center justify-center text-xs font-bold flex-shrink-0">
                    1
                  </span>
                  <span className="text-sm text-phantom-gray">
                    Create an{" "}
                    <a
                      href="https://api.slack.com/messaging/webhooks"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neural-bright hover:underline"
                    >
                      Incoming Webhook
                    </a>{" "}
                    in Slack
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-neural/20 text-neural-bright flex items-center justify-center text-xs font-bold flex-shrink-0">
                    2
                  </span>
                  <span className="text-sm text-phantom-gray">
                    Set up a{" "}
                    <Link
                      href="/docs/integrations/webhooks"
                      className="text-neural-bright hover:underline"
                    >
                      BetaForge webhook
                    </Link>{" "}
                    to your server
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-neural/20 text-neural-bright flex items-center justify-center text-xs font-bold flex-shrink-0">
                    3
                  </span>
                  <span className="text-sm text-phantom-gray">
                    Forward events to Slack with custom formatting
                  </span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Message Examples */}
      <section className="relative py-12 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-ghost-white mb-8 flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-plasma-pink" />
            Notification Examples
          </h2>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Tabs */}
            <div className="space-y-2">
              {[
                { id: "bugFound", label: "Bug Found", icon: AlertTriangle },
                {
                  id: "sessionComplete",
                  label: "Session Complete",
                  icon: CheckCircle2,
                },
                { id: "criticalAlert", label: "Critical Alert", icon: Bell },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveExample(tab.id as typeof activeExample)
                  }
                  className={`w-full p-4 text-left rounded-xl border transition-all flex items-center gap-3 ${
                    activeExample === tab.id
                      ? "bg-[#4A154B]/20 border-[#4A154B]/50"
                      : "bg-void-elevated border-white/5 hover:border-white/10"
                  }`}
                >
                  <tab.icon
                    className={`w-5 h-5 ${
                      activeExample === tab.id
                        ? "text-[#E01E5A]"
                        : "text-phantom-gray"
                    }`}
                  />
                  <span
                    className={
                      activeExample === tab.id
                        ? "text-ghost-white"
                        : "text-phantom-gray"
                    }
                  >
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Preview */}
            <div className="lg:col-span-2">
              <div className="bg-[#1a1d21] rounded-xl overflow-hidden border border-[#3f4145]">
                <div className="px-4 py-3 border-b border-[#3f4145] flex items-center gap-2">
                  <Hash className="w-4 h-4 text-[#9a9b9e]" />
                  <span className="text-[#9a9b9e] text-sm">
                    betaforge-alerts
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-neural to-electric-cyan flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white text-sm">
                          BetaForge
                        </span>
                        <span className="px-1.5 py-0.5 text-xs bg-[#4A154B] text-white rounded">
                          APP
                        </span>
                        <span className="text-xs text-[#9a9b9e]">10:32 AM</span>
                      </div>
                      <pre className="text-sm text-[#d1d2d3] whitespace-pre-wrap font-sans">
                        {notificationExamples[activeExample]}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Configuration Options */}
      <section className="relative py-12 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-ghost-white mb-8 flex items-center gap-3">
            <Settings className="w-6 h-6 text-quantum-green" />
            Configuration Options
          </h2>

          <div className="bg-void-elevated border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 bg-void-black/50">
                  <th className="text-left px-4 py-3 text-sm font-medium text-phantom-gray">
                    Setting
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-phantom-gray">
                    Description
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-phantom-gray">
                    Default
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    name: "Channel",
                    desc: "Which Slack channel to post to",
                    default: "#betaforge",
                  },
                  {
                    name: "Notify on bug found",
                    desc: "Send message for each bug discovered",
                    default: "High & Critical only",
                  },
                  {
                    name: "Notify on session complete",
                    desc: "Summary when all agents finish",
                    default: "Enabled",
                  },
                  {
                    name: "Notify on session failed",
                    desc: "Alert when tests fail to run",
                    default: "Enabled",
                  },
                  {
                    name: "Include screenshots",
                    desc: "Attach bug screenshots to messages",
                    default: "Enabled",
                  },
                  {
                    name: "Mention users",
                    desc: "@ mention specific users for critical bugs",
                    default: "Disabled",
                  },
                  {
                    name: "Quiet hours",
                    desc: "Suppress non-critical alerts during specified hours",
                    default: "None",
                  },
                ].map((setting, i, arr) => (
                  <tr
                    key={setting.name}
                    className={
                      i < arr.length - 1 ? "border-b border-white/5" : ""
                    }
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm text-ghost-white font-medium">
                        {setting.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-phantom-gray">
                        {setting.desc}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs text-electric-cyan">
                        {setting.default}
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Custom Integration Code */}
      <section className="relative py-12 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-ghost-white mb-8 flex items-center gap-3">
            <Code2 className="w-6 h-6 text-electric-cyan" />
            Custom Integration
          </h2>

          <p className="text-phantom-gray mb-6">
            For advanced use cases, you can build a custom integration using
            BetaForge webhooks and Slack&apos;s Block Kit.
          </p>

          <div className="bg-void-elevated border border-white/5 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-void-black/50">
              <span className="text-sm text-phantom-gray font-mono">
                slack-notifier.js
              </span>
              <button
                onClick={() => copyCode(setupCode, "custom")}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-phantom-gray hover:text-ghost-white transition-colors rounded-lg hover:bg-white/5"
              >
                {copied === "custom" ? (
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
            <pre className="p-6 overflow-x-auto">
              <code className="text-sm text-phantom-gray font-mono whitespace-pre">
                {setupCode}
              </code>
            </pre>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
