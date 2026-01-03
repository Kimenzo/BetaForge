"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Puzzle,
  ChevronRight,
  Sparkles,
  Copy,
  Check,
  GitBranch,
  GitMerge,
  Webhook,
  Zap,
  ArrowRight,
  CheckCircle2,
  Settings,
  Play,
  RefreshCw,
  Shield,
  Terminal,
  Clock,
  FileCode,
  Github,
  CircleDot,
  Box,
  Cloud,
} from "lucide-react";
import { Footer } from "@/components/layout";

const integrations = [
  {
    id: "github",
    name: "GitHub Actions",
    icon: Github,
    description:
      "Run BetaForge tests automatically on every pull request and push to main.",
    category: "CI/CD",
    color: "from-gray-700 to-gray-900",
    iconBg: "bg-gray-800",
    popular: true,
    setup: `name: BetaForge Testing

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  beta-test:
    runs-on: ubuntu-latest
    steps:
      - name: Run BetaForge Tests
        uses: betaforge/action@v2
        with:
          api-key: \${{ secrets.BETAFORGE_API_KEY }}
          project-id: \${{ secrets.BETAFORGE_PROJECT_ID }}
          test-url: https://staging.myapp.com
          agents: sarah,marcus,diego
          wait-for-results: true
          fail-on-critical: true`,
  },
  {
    id: "gitlab",
    name: "GitLab CI",
    icon: CircleDot,
    description:
      "Integrate BetaForge into your GitLab CI/CD pipelines seamlessly.",
    category: "CI/CD",
    color: "from-orange-600 to-orange-800",
    iconBg: "bg-orange-600",
    popular: true,
    setup: `stages:
  - test

betaforge_test:
  stage: test
  image: betaforge/cli:latest
  script:
    - betaforge test \\
        --api-key $BETAFORGE_API_KEY \\
        --project-id $BETAFORGE_PROJECT_ID \\
        --url $CI_ENVIRONMENT_URL \\
        --agents sarah,marcus,ahmed \\
        --wait
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH`,
  },
  {
    id: "jenkins",
    name: "Jenkins",
    icon: Box,
    description: "Add BetaForge testing to your Jenkins build pipeline.",
    category: "CI/CD",
    color: "from-red-600 to-red-800",
    iconBg: "bg-red-600",
    popular: false,
    setup: `pipeline {
    agent any
    
    environment {
        BETAFORGE_API_KEY = credentials('betaforge-api-key')
    }
    
    stages {
        stage('Deploy to Staging') {
            steps {
                // Your deployment steps
            }
        }
        
        stage('BetaForge Testing') {
            steps {
                sh '''
                    curl -X POST https://api.betaforge.ai/v1/sessions \\
                        -H "Authorization: Bearer $BETAFORGE_API_KEY" \\
                        -H "Content-Type: application/json" \\
                        -d '{
                            "projectId": "your-project-id",
                            "testUrl": "https://staging.myapp.com",
                            "agents": ["sarah", "marcus"],
                            "waitForResults": true
                        }'
                '''
            }
        }
    }
}`,
  },
  {
    id: "bitbucket",
    name: "Bitbucket Pipelines",
    icon: GitBranch,
    description:
      "Run automated AI testing in your Bitbucket Pipelines workflow.",
    category: "CI/CD",
    color: "from-blue-600 to-blue-800",
    iconBg: "bg-blue-600",
    popular: false,
    setup: `image: node:18

pipelines:
  pull-requests:
    '**':
      - step:
          name: BetaForge Testing
          script:
            - pipe: betaforge/betaforge-pipe:1.0.0
              variables:
                API_KEY: $BETAFORGE_API_KEY
                PROJECT_ID: $BETAFORGE_PROJECT_ID
                TEST_URL: 'https://staging.myapp.com'
                AGENTS: 'sarah,marcus,diego'
                FAIL_ON_CRITICAL: 'true'`,
  },
  {
    id: "slack",
    name: "Slack",
    icon: Zap,
    description:
      "Get real-time notifications about test results and critical bugs.",
    category: "Notifications",
    color: "from-purple-600 to-purple-800",
    iconBg: "bg-purple-600",
    popular: true,
    setup: `// Webhook configuration in BetaForge Dashboard
{
  "type": "slack",
  "webhookUrl": "https://hooks.slack.com/services/xxx/yyy/zzz",
  "events": [
    "session.completed",
    "bug.critical",
    "bug.high"
  ],
  "channel": "#qa-alerts"
}`,
  },
  {
    id: "jira",
    name: "Jira",
    icon: Box,
    description:
      "Automatically create Jira tickets from BetaForge bug reports.",
    category: "Issue Tracking",
    color: "from-blue-500 to-blue-700",
    iconBg: "bg-blue-500",
    popular: true,
    setup: `// Jira integration settings
{
  "type": "jira",
  "baseUrl": "https://yourcompany.atlassian.net",
  "projectKey": "WEBAPP",
  "apiToken": "your-jira-api-token",
  "email": "your-email@company.com",
  "issueType": "Bug",
  "autoCreate": {
    "critical": true,
    "high": true,
    "medium": false,
    "low": false
  },
  "customFields": {
    "environment": "Staging",
    "foundBy": "BetaForge AI"
  }
}`,
  },
  {
    id: "vercel",
    name: "Vercel",
    icon: Cloud,
    description: "Test preview deployments automatically on every push.",
    category: "Deployment",
    color: "from-gray-800 to-black",
    iconBg: "bg-black",
    popular: false,
    setup: `// vercel.json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "github": {
    "autoJobCancelation": true
  }
}

// Add to your deploy hook or use Vercel Integration
// BetaForge automatically detects preview URLs`,
  },
  {
    id: "webhook",
    name: "Custom Webhooks",
    icon: Webhook,
    description:
      "Send test results to any endpoint with customizable payloads.",
    category: "Custom",
    color: "from-neural to-electric-cyan",
    iconBg: "bg-neural",
    popular: false,
    setup: `// Custom webhook payload example
{
  "url": "https://your-api.com/betaforge-webhook",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer your-webhook-secret"
  },
  "events": ["*"],
  "payload": {
    "source": "betaforge",
    "sessionId": "{{session.id}}",
    "status": "{{session.status}}",
    "bugsFound": "{{session.bugCount}}",
    "criticalBugs": "{{session.criticalCount}}"
  }
}`,
  },
];

const features = [
  {
    icon: RefreshCw,
    title: "Automatic Triggers",
    description:
      "Tests run automatically on every deployment, PR, or scheduled interval.",
  },
  {
    icon: Shield,
    title: "Secure Credentials",
    description:
      "API keys and secrets are encrypted and never exposed in logs.",
  },
  {
    icon: Clock,
    title: "Async & Sync Modes",
    description:
      "Wait for results to block pipelines, or continue asynchronously.",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description:
      "Get instant notifications via Slack, email, or custom webhooks.",
  },
];

export default function IntegrationsPage() {
  const [selectedIntegration, setSelectedIntegration] = useState(
    integrations[0]
  );
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(selectedIntegration.setup);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categories = [...new Set(integrations.map((i) => i.category))];

  return (
    <div className="min-h-screen bg-void-black">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 mesh-bg opacity-30" />
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-plasma-pink/10 rounded-full blur-[120px]" />
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
              <nav className="hidden md:flex items-center">
                <Link
                  href="/docs"
                  className="text-phantom-gray hover:text-ghost-white text-sm transition-colors px-3 py-2"
                >
                  Docs
                </Link>
                <ChevronRight className="w-4 h-4 text-mist-gray" />
                <span className="text-ghost-white text-sm px-3 py-2">
                  Integrations
                </span>
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
            <Link
              href="/docs"
              className="hover:text-ghost-white transition-colors"
            >
              Documentation
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-ghost-white">Integrations</span>
          </div>

          <div className="flex items-start gap-6 mb-8">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-plasma-pink/20 to-neural/20 border border-plasma-pink/20">
              <Puzzle className="w-8 h-8 text-plasma-pink" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-ghost-white mb-4">
                Integrations
              </h1>
              <p className="text-lg text-phantom-gray max-w-2xl">
                Connect BetaForge to your development workflow. Automate testing
                in CI/CD pipelines, get notifications in Slack, and sync bugs to
                your issue tracker.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-5 bg-void-elevated border border-white/5 rounded-xl"
              >
                <feature.icon className="w-6 h-6 text-neural-bright mb-3" />
                <h3 className="font-semibold text-ghost-white mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-phantom-gray">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Grid */}
      <section className="relative py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-ghost-white mb-8">
            Available Integrations
          </h2>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <span
                key={category}
                className="px-3 py-1.5 text-sm bg-void-elevated border border-white/10 rounded-full text-phantom-gray"
              >
                {category}
              </span>
            ))}
          </div>

          {/* Integration Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {integrations.map((integration) => (
              <button
                key={integration.id}
                onClick={() => setSelectedIntegration(integration)}
                className={`relative p-5 text-left bg-void-elevated border rounded-xl transition-all ${
                  selectedIntegration.id === integration.id
                    ? "border-neural/50 ring-1 ring-neural/30"
                    : "border-white/5 hover:border-white/10"
                }`}
              >
                {integration.popular && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 text-xs bg-quantum-green/20 text-quantum-green rounded-full">
                    Popular
                  </span>
                )}
                <div
                  className={`w-10 h-10 rounded-lg ${integration.iconBg} flex items-center justify-center mb-3`}
                >
                  <integration.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-ghost-white mb-1">
                  {integration.name}
                </h3>
                <p className="text-xs text-mist-gray">{integration.category}</p>
              </button>
            ))}
          </div>

          {/* Selected Integration Details */}
          <div className="bg-void-elevated border border-white/5 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl ${selectedIntegration.iconBg} flex items-center justify-center`}
                >
                  <selectedIntegration.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-ghost-white mb-1">
                    {selectedIntegration.name}
                  </h3>
                  <p className="text-phantom-gray">
                    {selectedIntegration.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Setup Instructions */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-ghost-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-neural-bright" />
                  Setup Configuration
                </h4>
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
              <pre className="p-4 bg-void-black rounded-xl border border-white/10 overflow-x-auto">
                <code className="text-sm text-phantom-gray font-mono whitespace-pre">
                  {selectedIntegration.setup}
                </code>
              </pre>
            </div>

            {/* Steps */}
            <div className="p-6 border-t border-white/5">
              <h4 className="font-semibold text-ghost-white mb-4">
                Quick Setup Steps
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-neural/20 text-neural-bright flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <p className="text-phantom-gray text-sm">
                    Get your API key from the{" "}
                    <Link
                      href="/dashboard/settings"
                      className="text-neural-bright hover:underline"
                    >
                      Dashboard Settings
                    </Link>
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-neural/20 text-neural-bright flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <p className="text-phantom-gray text-sm">
                    Add the API key as a secret in your CI/CD platform
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-neural/20 text-neural-bright flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <p className="text-phantom-gray text-sm">
                    Copy the configuration above and add it to your project
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-neural/20 text-neural-bright flex items-center justify-center text-xs font-bold">
                    4
                  </div>
                  <p className="text-phantom-gray text-sm">
                    Push changes and watch BetaForge run automatically!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-12 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-neural/20 to-plasma-pink/20" />
            <div className="absolute inset-0 border border-neural/30 rounded-3xl" />
            <div className="relative text-center">
              <h2 className="text-3xl font-bold text-ghost-white mb-4">
                Need a Custom Integration?
              </h2>
              <p className="text-phantom-gray mb-8 max-w-xl mx-auto">
                We&apos;re always adding new integrations. Contact us if you
                need support for a specific tool or platform.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-neural to-electric-cyan text-white font-semibold hover:shadow-glow transition-all"
                >
                  Request Integration
                </Link>
                <Link
                  href="/docs/api/webhooks"
                  className="px-6 py-3 rounded-xl border border-white/10 text-ghost-white font-semibold hover:border-neural/30 transition-all"
                >
                  Use Webhooks
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
