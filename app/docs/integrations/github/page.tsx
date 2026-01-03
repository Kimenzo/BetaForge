"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronRight,
  Sparkles,
  Copy,
  Check,
  ArrowLeft,
  Shield,
  Zap,
  Clock,
  GitPullRequest,
  GitBranch,
  GitMerge,
  Terminal,
  FileCode,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Settings,
  Key,
  Eye,
  EyeOff,
  ExternalLink,
  BookOpen,
  Code2,
  Workflow,
  RefreshCw,
  Bell,
  Filter,
  Layers,
  Bug,
} from "lucide-react";
import { Footer } from "@/components/layout";

// Code examples for different scenarios
const codeExamples = {
  basic: `# .github/workflows/betaforge.yml
name: BetaForge AI Testing

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  ai-testing:
    name: Run AI-Powered Tests
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run BetaForge Tests
        id: betaforge
        run: |
          response=$(curl -s -w "\\n%{http_code}" -X POST https://api.betaforge.ai/v1/sessions \\
            -H "Authorization: Bearer ${"$"}{{ secrets.BETAFORGE_API_KEY }}" \\
            -H "Content-Type: application/json" \\
            -d '{
              "projectId": "'${"$"}{{ secrets.BETAFORGE_PROJECT_ID }}'",
              "testUrl": "https://staging.myapp.com",
              "agents": ["sarah", "marcus", "diego"],
              "waitForResults": true,
              "failOnCritical": true
            }')
          
          http_code=$(echo "$response" | tail -1)
          body=$(echo "$response" | sed '$d')
          
          echo "$body" | jq .
          echo "dashboard_url=$(echo $body | jq -r '.dashboardUrl')" >> $GITHUB_OUTPUT
          
          # Exit with error if API returned failure (422 = critical bugs found)
          if [ "$http_code" -eq 422 ]; then
            echo "::error::Critical bugs found by BetaForge"
            exit 1
          elif [ "$http_code" -ge 400 ]; then
            echo "::error::BetaForge API error: $body"
            exit 1
          fi
          
      - name: Comment on PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '✅ BetaForge AI Testing complete! [View Results](${"$"}{{ steps.betaforge.outputs.dashboard_url }})'
            })`,

  advanced: `# .github/workflows/betaforge-advanced.yml
name: BetaForge Comprehensive Testing

on:
  push:
    branches: [main, develop, 'release/**']
  pull_request:
    types: [opened, synchronize, reopened]
  schedule:
    # Run daily at 2 AM UTC
    - cron: '0 2 * * *'
  workflow_dispatch:
    inputs:
      test_url:
        description: 'Custom URL to test'
        required: false
        type: string
      agents:
        description: 'JSON array of agent IDs'
        required: false
        default: '["sarah","marcus","diego"]'

env:
  BETAFORGE_API_KEY: ${"$"}{{ secrets.BETAFORGE_API_KEY }}
  BETAFORGE_PROJECT_ID: ${"$"}{{ secrets.BETAFORGE_PROJECT_ID }}

jobs:
  # Build and deploy to staging first
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    outputs:
      url: ${"$"}{{ steps.deploy.outputs.url }}
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Staging
        id: deploy
        run: |
          # Your deployment logic here
          echo "url=https://staging-${"$"}{{ github.sha }}.yourapp.com" >> $GITHUB_OUTPUT

  # Run BetaForge AI Testing
  ai-testing:
    name: AI Testing Suite
    needs: deploy-staging
    runs-on: ubuntu-latest
    steps:
      - name: Run BetaForge Tests
        id: betaforge
        run: |
          TEST_URL="${"$"}{{ inputs.test_url || needs.deploy-staging.outputs.url }}"
          AGENTS='${"$"}{{ inputs.agents || '["sarah","marcus","diego","ahmed"]' }}'
          
          response=$(curl -s -w "\\n%{http_code}" -X POST https://api.betaforge.ai/v1/sessions \\
            -H "Authorization: Bearer ${"$"}{{ env.BETAFORGE_API_KEY }}" \\
            -H "Content-Type: application/json" \\
            -d '{
              "projectId": "'${"$"}{{ env.BETAFORGE_PROJECT_ID }}'",
              "testUrl": "'"$TEST_URL"'",
              "agents": '"$AGENTS"',
              "waitForResults": true,
              "failOnCritical": true,
              "timeout": 1800
            }')
          
          http_code=$(echo "$response" | tail -1)
          body=$(echo "$response" | sed '$d')
          
          echo "$body" | jq .
          echo "session_id=$(echo $body | jq -r '.sessionId')" >> $GITHUB_OUTPUT
          echo "dashboard_url=$(echo $body | jq -r '.dashboardUrl')" >> $GITHUB_OUTPUT
          echo "critical_count=$(echo $body | jq -r '.summary.critical // 0')" >> $GITHUB_OUTPUT
          echo "total_bugs=$(echo $body | jq -r '.summary.total // 0')" >> $GITHUB_OUTPUT
          
          if [ "$http_code" -eq 422 ]; then
            echo "::error::Critical bugs found by BetaForge"
            exit 1
          elif [ "$http_code" -ge 400 ]; then
            echo "::error::BetaForge API error"
            exit 1
          fi
          
      - name: Comment on PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const criticalCount = '${"$"}{{ steps.betaforge.outputs.critical_count }}';
            const totalBugs = '${"$"}{{ steps.betaforge.outputs.total_bugs }}';
            const dashboardUrl = '${"$"}{{ steps.betaforge.outputs.dashboard_url }}';
            
            const emoji = criticalCount > 0 ? '🚨' : totalBugs > 0 ? '⚠️' : '✅';
            const status = criticalCount > 0 ? 'Critical bugs found!' : 
                          totalBugs > 0 ? 'Some issues found' : 'All tests passed!';
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: emoji + ' **BetaForge AI Testing**: ' + status + '\\n\\n' +
                    '- Total bugs: ' + totalBugs + '\\n- Critical: ' + criticalCount + '\\n\\n' +
                    '[View Full Report](' + dashboardUrl + ')'
            })
            
      - name: Post to Slack on failure
        if: failure()
        run: |
          curl -X POST ${"$"}{{ secrets.SLACK_WEBHOOK_URL }} \\
            -H "Content-Type: application/json" \\
            -d '{
              "text": "🚨 BetaForge found critical bugs in ${"$"}{{ github.repository }}",
              "blocks": [
                {"type": "section", "text": {"type": "mrkdwn", "text": "*BetaForge Alert*\\nCritical bugs found in <${"$"}{{ github.server_url }}/${"$"}{{ github.repository }}|'${"$"}{{ github.repository }}'>"}},
                {"type": "section", "text": {"type": "mrkdwn", "text": "<${"$"}{{ steps.betaforge.outputs.dashboard_url }}|View Report>"}}
              ]
            }'`,

  monorepo: `# .github/workflows/betaforge-monorepo.yml
name: BetaForge Monorepo Testing

on:
  push:
    branches: [main]
  pull_request:

jobs:
  detect-changes:
    name: Detect Changed Apps
    runs-on: ubuntu-latest
    outputs:
      apps: ${"$"}{{ steps.filter.outputs.changes }}
    steps:
      - uses: actions/checkout@v4
      - uses: dorny/paths-filter@v3
        id: filter
        with:
          filters: |
            web:
              - 'apps/web/**'
            dashboard:
              - 'apps/dashboard/**'
            mobile-web:
              - 'apps/mobile-web/**'

  test-apps:
    name: Test ${"$"}{{ matrix.app }}
    needs: detect-changes
    if: needs.detect-changes.outputs.apps != '[]'
    runs-on: ubuntu-latest
    strategy:
      matrix:
        app: ${"$"}{{ fromJson(needs.detect-changes.outputs.apps) }}
    steps:
      - uses: actions/checkout@v4
      
      - name: Get App Config
        id: config
        run: |
          case "${"$"}{{ matrix.app }}" in
            web)
              echo "project-id=proj_web_123" >> $GITHUB_OUTPUT
              echo "url=https://staging.example.com" >> $GITHUB_OUTPUT
              ;;
            dashboard)
              echo "project-id=proj_dash_456" >> $GITHUB_OUTPUT
              echo "url=https://dashboard-staging.example.com" >> $GITHUB_OUTPUT
              ;;
            mobile-web)
              echo "project-id=proj_mobile_789" >> $GITHUB_OUTPUT
              echo "url=https://m-staging.example.com" >> $GITHUB_OUTPUT
              ;;
          esac
          
      - name: Run BetaForge Tests
        run: |
          curl -s -X POST https://api.betaforge.ai/v1/sessions \\
            -H "Authorization: Bearer ${"$"}{{ secrets.BETAFORGE_API_KEY }}" \\
            -H "Content-Type: application/json" \\
            -d '{
              "projectId": "'${"$"}{{ steps.config.outputs.project-id }}'",
              "testUrl": "'${"$"}{{ steps.config.outputs.url }}'",
              "agents": ["sarah", "marcus", "diego"],
              "waitForResults": true,
              "failOnCritical": true
            }' | jq .`,

  previewDeployments: `# .github/workflows/betaforge-preview.yml
name: Test Preview Deployments

on:
  deployment_status:

jobs:
  test-preview:
    name: Test Preview Deployment
    runs-on: ubuntu-latest
    if: github.event.deployment_status.state == 'success'
    
    steps:
      - name: Run BetaForge on Preview
        id: betaforge
        run: |
          response=$(curl -s -X POST https://api.betaforge.ai/v1/sessions \\
            -H "Authorization: Bearer ${"$"}{{ secrets.BETAFORGE_API_KEY }}" \\
            -H "Content-Type: application/json" \\
            -d '{
              "projectId": "'${"$"}{{ secrets.BETAFORGE_PROJECT_ID }}'",
              "testUrl": "'${"$"}{{ github.event.deployment_status.target_url }}'",
              "agents": ["sarah", "marcus", "diego"],
              "waitForResults": true,
              "timeout": 600
            }')
          echo "$response" | jq .
          echo "dashboard_url=$(echo $response | jq -r '.dashboardUrl')" >> $GITHUB_OUTPUT
          
      - name: Update Deployment Status
        uses: actions/github-script@v7
        with:
          script: |
            await github.rest.repos.createCommitStatus({
              owner: context.repo.owner,
              repo: context.repo.repo,
              sha: context.sha,
              state: 'success',
              context: 'BetaForge AI Testing',
              description: 'All AI tests passed',
              target_url: '${"$"}{{ steps.betaforge.outputs.dashboard-url }}'
            })`,
};

const apiParameters = [
  {
    name: "projectId",
    type: "string",
    required: true,
    description: "Your BetaForge project ID. Store as a GitHub secret.",
    example: "proj_abc123",
  },
  {
    name: "testUrl",
    type: "string",
    required: true,
    description: "URL to test. Must be publicly accessible.",
    example: "https://staging.myapp.com",
  },
  {
    name: "agents",
    type: "array",
    required: false,
    description: "Array of agent IDs to use.",
    example: '["sarah", "marcus", "diego"]',
    default: "All enabled agents",
  },
  {
    name: "waitForResults",
    type: "boolean",
    required: false,
    description: "Wait for tests to complete before returning.",
    default: "true",
  },
  {
    name: "timeout",
    type: "number",
    required: false,
    description: "Maximum seconds to wait (max 1800).",
    default: "600",
  },
  {
    name: "failOnCritical",
    type: "boolean",
    required: false,
    description: "Return 422 status if critical bugs are found.",
    default: "true",
  },
  {
    name: "failOnHigh",
    type: "boolean",
    required: false,
    description: "Return 422 status if high-severity bugs are found.",
    default: "false",
  },
];

const apiResponse = [
  {
    name: "success",
    type: "boolean",
    description:
      "Whether the test completed without critical bugs (when failOnCritical is true).",
  },
  {
    name: "sessionId",
    type: "string",
    description: "Unique ID of the test session for API queries.",
  },
  {
    name: "dashboardUrl",
    type: "string",
    description: "Direct link to the test results in BetaForge dashboard.",
  },
  {
    name: "status",
    type: "string",
    description: "Session status: 'completed', 'failed', or 'error'.",
  },
  {
    name: "summary.total",
    type: "number",
    description: "Total number of bugs found across all agents.",
  },
  {
    name: "summary.critical",
    type: "number",
    description: "Number of critical severity bugs.",
  },
  {
    name: "summary.high",
    type: "number",
    description: "Number of high severity bugs.",
  },
  {
    name: "summary.medium",
    type: "number",
    description: "Number of medium severity bugs.",
  },
  {
    name: "summary.low",
    type: "number",
    description: "Number of low severity bugs.",
  },
  {
    name: "duration",
    type: "number",
    description: "Total test duration in seconds.",
  },
  {
    name: "bugs",
    type: "array",
    description: "Array of bug objects with details.",
  },
];

export default function GitHubIntegrationPage() {
  const [activeTab, setActiveTab] = useState<
    "basic" | "advanced" | "monorepo" | "previewDeployments"
  >("basic");
  const [copied, setCopied] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);

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
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-gray-600/10 rounded-full blur-[120px]" />
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
          {/* Breadcrumb */}
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
            <span className="text-ghost-white">GitHub Actions</span>
          </div>

          {/* Hero */}
          <div className="flex items-start gap-6 mb-12">
            <div className="p-4 rounded-2xl bg-gray-800 border border-gray-700">
              <svg
                className="w-10 h-10 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-ghost-white">
                  GitHub Actions
                </h1>
                <span className="px-2 py-1 text-xs bg-quantum-green/20 text-quantum-green rounded-full">
                  Official
                </span>
              </div>
              <p className="text-lg text-phantom-gray mb-6">
                Run AI-powered tests automatically on every pull request, push,
                or schedule. Get detailed bug reports directly in your PRs with
                automatic issue creation.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="/docs/api"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-neural to-electric-cyan text-white font-semibold hover:shadow-glow transition-all"
                >
                  API Documentation
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href="/docs/getting-started"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-ghost-white font-medium hover:border-neural/30 transition-all"
                >
                  Getting Started
                  <Code2 className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="p-4 bg-void-elevated border border-white/5 rounded-xl text-center">
              <div className="text-2xl font-bold text-ghost-white">v1.0</div>
              <div className="text-sm text-phantom-gray">API Version</div>
            </div>
            <div className="p-4 bg-void-elevated border border-white/5 rounded-xl text-center">
              <div className="text-2xl font-bold text-ghost-white">REST</div>
              <div className="text-sm text-phantom-gray">Protocol</div>
            </div>
            <div className="p-4 bg-void-elevated border border-white/5 rounded-xl text-center">
              <div className="text-2xl font-bold text-quantum-green">99.9%</div>
              <div className="text-sm text-phantom-gray">Uptime</div>
            </div>
            <div className="p-4 bg-void-elevated border border-white/5 rounded-xl text-center">
              <div className="text-2xl font-bold text-ghost-white">
                &lt;5min
              </div>
              <div className="text-sm text-phantom-gray">Avg Test Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="relative py-12 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-ghost-white mb-8 flex items-center gap-3">
            <Zap className="w-6 h-6 text-electric-cyan" />
            Quick Start
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Step 1 */}
            <div className="relative p-6 bg-void-elevated border border-white/5 rounded-xl">
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-neural flex items-center justify-center text-white font-bold text-sm">
                1
              </div>
              <Key className="w-8 h-8 text-neural-bright mb-4" />
              <h3 className="text-lg font-semibold text-ghost-white mb-2">
                Get API Key
              </h3>
              <p className="text-sm text-phantom-gray mb-4">
                Generate an API key from your BetaForge dashboard settings.
              </p>
              <Link
                href="/settings/api"
                className="text-sm text-neural-bright hover:underline inline-flex items-center gap-1"
              >
                Go to Settings <ArrowLeft className="w-3 h-3 rotate-180" />
              </Link>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 bg-void-elevated border border-white/5 rounded-xl">
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-neural flex items-center justify-center text-white font-bold text-sm">
                2
              </div>
              <Shield className="w-8 h-8 text-neural-bright mb-4" />
              <h3 className="text-lg font-semibold text-ghost-white mb-2">
                Add Secrets
              </h3>
              <p className="text-sm text-phantom-gray mb-4">
                Add{" "}
                <code className="px-1.5 py-0.5 bg-void-black rounded text-electric-cyan">
                  BETAFORGE_API_KEY
                </code>{" "}
                and{" "}
                <code className="px-1.5 py-0.5 bg-void-black rounded text-electric-cyan">
                  BETAFORGE_PROJECT_ID
                </code>{" "}
                to your repo secrets.
              </p>
              <a
                href="https://docs.github.com/en/actions/security-guides/encrypted-secrets"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-neural-bright hover:underline inline-flex items-center gap-1"
              >
                GitHub Docs <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 bg-void-elevated border border-white/5 rounded-xl">
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-neural flex items-center justify-center text-white font-bold text-sm">
                3
              </div>
              <FileCode className="w-8 h-8 text-neural-bright mb-4" />
              <h3 className="text-lg font-semibold text-ghost-white mb-2">
                Create Workflow
              </h3>
              <p className="text-sm text-phantom-gray mb-4">
                Add the workflow file below to{" "}
                <code className="px-1.5 py-0.5 bg-void-black rounded text-electric-cyan">
                  .github/workflows/
                </code>
              </p>
              <button
                onClick={() => copyCode(codeExamples.basic, "quick")}
                className="text-sm text-neural-bright hover:underline inline-flex items-center gap-1"
              >
                {copied === "quick" ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                Copy Example
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Examples */}
      <section className="relative py-12 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-ghost-white mb-8 flex items-center gap-3">
            <Workflow className="w-6 h-6 text-plasma-pink" />
            Workflow Examples
          </h2>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { id: "basic", label: "Basic Setup", icon: Terminal },
              { id: "advanced", label: "Advanced Pipeline", icon: Layers },
              { id: "monorepo", label: "Monorepo", icon: GitBranch },
              {
                id: "previewDeployments",
                label: "Preview Deployments",
                icon: Eye,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-neural/20 text-ghost-white border border-neural/30"
                    : "bg-void-elevated text-phantom-gray border border-white/5 hover:border-white/10"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Code Block */}
          <div className="relative bg-void-elevated border border-white/5 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-void-black/50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                <span className="ml-3 text-sm text-phantom-gray font-mono">
                  .github/workflows/betaforge.yml
                </span>
              </div>
              <button
                onClick={() => copyCode(codeExamples[activeTab], activeTab)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-phantom-gray hover:text-ghost-white transition-colors rounded-lg hover:bg-white/5"
              >
                {copied === activeTab ? (
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
            <pre className="p-6 overflow-x-auto max-h-[600px]">
              <code className="text-sm text-phantom-gray font-mono whitespace-pre">
                {codeExamples[activeTab]}
              </code>
            </pre>
          </div>

          {/* Example descriptions */}
          <div className="mt-6 p-4 bg-neural/5 border border-neural/20 rounded-xl">
            {activeTab === "basic" && (
              <p className="text-sm text-phantom-gray">
                <strong className="text-ghost-white">Basic Setup:</strong> A
                minimal workflow that runs BetaForge tests on every push to
                main/develop and on pull requests. Perfect for getting started
                quickly.
              </p>
            )}
            {activeTab === "advanced" && (
              <p className="text-sm text-phantom-gray">
                <strong className="text-ghost-white">Advanced Pipeline:</strong>{" "}
                Full-featured workflow with matrix testing (multiple agent
                groups run in parallel), PR comments, automatic issue creation,
                Slack notifications, and scheduled daily runs.
              </p>
            )}
            {activeTab === "monorepo" && (
              <p className="text-sm text-phantom-gray">
                <strong className="text-ghost-white">Monorepo Setup:</strong>{" "}
                Detects which apps changed and only runs tests for those apps.
                Each app can have its own BetaForge project with different
                configurations.
              </p>
            )}
            {activeTab === "previewDeployments" && (
              <p className="text-sm text-phantom-gray">
                <strong className="text-ghost-white">
                  Preview Deployments:
                </strong>{" "}
                Automatically tests Vercel/Netlify preview deployments. Triggers
                when a deployment succeeds and tests the preview URL.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* API Reference */}
      <section className="relative py-12 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-ghost-white mb-8 flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-quantum-green" />
            API Reference
          </h2>

          {/* Request Parameters */}
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-ghost-white mb-4">
              Request Parameters (POST /api/v1/sessions)
            </h3>
            <div className="bg-void-elevated border border-white/5 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5 bg-void-black/50">
                    <th className="text-left px-4 py-3 text-sm font-medium text-phantom-gray">
                      Name
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-phantom-gray">
                      Type
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-phantom-gray">
                      Required
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-phantom-gray">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {apiParameters.map((input, index) => (
                    <tr
                      key={input.name}
                      className={
                        index !== apiParameters.length - 1
                          ? "border-b border-white/5"
                          : ""
                      }
                    >
                      <td className="px-4 py-3">
                        <code className="text-sm text-electric-cyan">
                          {input.name}
                        </code>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-mist-gray">
                          {input.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {input.required ? (
                          <span className="text-xs px-2 py-0.5 bg-plasma-pink/20 text-plasma-pink rounded">
                            Required
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 bg-white/10 text-mist-gray rounded">
                            Optional
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-phantom-gray">
                          {input.description}
                        </p>
                        {input.default && (
                          <p className="text-xs text-mist-gray mt-1">
                            Default:{" "}
                            <code className="text-electric-cyan">
                              {input.default}
                            </code>
                          </p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Response Fields */}
          <div>
            <h3 className="text-lg font-semibold text-ghost-white mb-4">
              Response Fields
            </h3>
            <div className="bg-void-elevated border border-white/5 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5 bg-void-black/50">
                    <th className="text-left px-4 py-3 text-sm font-medium text-phantom-gray">
                      Name
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-phantom-gray">
                      Type
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-phantom-gray">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {apiResponse.map((output, index) => (
                    <tr
                      key={output.name}
                      className={
                        index !== apiResponse.length - 1
                          ? "border-b border-white/5"
                          : ""
                      }
                    >
                      <td className="px-4 py-3">
                        <code className="text-sm text-electric-cyan">
                          {output.name}
                        </code>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-mist-gray">
                          {output.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-phantom-gray">
                          {output.description}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* PR Comments Feature */}
      <section className="relative py-12 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-ghost-white mb-8 flex items-center gap-3">
            <GitPullRequest className="w-6 h-6 text-electric-cyan" />
            Pull Request Integration
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-ghost-white mb-4">
                Automatic PR Comments
              </h3>
              <p className="text-phantom-gray mb-6">
                BetaForge automatically comments on pull requests with a summary
                of test results, including bugs found, their severity, and
                direct links to detailed reports.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-quantum-green mt-0.5" />
                  <div>
                    <p className="text-ghost-white font-medium">Test Summary</p>
                    <p className="text-sm text-phantom-gray">
                      Bug counts by severity with pass/fail status
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-quantum-green mt-0.5" />
                  <div>
                    <p className="text-ghost-white font-medium">
                      Agent Reports
                    </p>
                    <p className="text-sm text-phantom-gray">
                      Individual findings from each AI agent
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-quantum-green mt-0.5" />
                  <div>
                    <p className="text-ghost-white font-medium">Screenshots</p>
                    <p className="text-sm text-phantom-gray">
                      Visual evidence embedded in comments
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-quantum-green mt-0.5" />
                  <div>
                    <p className="text-ghost-white font-medium">
                      Commit Status
                    </p>
                    <p className="text-sm text-phantom-gray">
                      Updates GitHub commit status checks
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* PR Comment Preview */}
            <div className="bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-[#30363d] flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neural to-electric-cyan flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-[#c9d1d9]">betaforge</span>
                <span className="text-[#8b949e]">bot</span>
                <span className="text-[#8b949e] text-sm">
                  commented just now
                </span>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#3fb950]" />
                  <span className="font-semibold text-[#c9d1d9]">
                    BetaForge AI Testing
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-sm">
                  <div className="p-2 bg-[#161b22] rounded">
                    <div className="text-[#f85149] font-bold">0</div>
                    <div className="text-[#8b949e] text-xs">Critical</div>
                  </div>
                  <div className="p-2 bg-[#161b22] rounded">
                    <div className="text-[#d29922] font-bold">2</div>
                    <div className="text-[#8b949e] text-xs">High</div>
                  </div>
                  <div className="p-2 bg-[#161b22] rounded">
                    <div className="text-[#58a6ff] font-bold">5</div>
                    <div className="text-[#8b949e] text-xs">Medium</div>
                  </div>
                  <div className="p-2 bg-[#161b22] rounded">
                    <div className="text-[#8b949e] font-bold">3</div>
                    <div className="text-[#8b949e] text-xs">Low</div>
                  </div>
                </div>
                <div className="text-sm text-[#8b949e]">
                  <p className="mb-2">
                    <strong className="text-[#c9d1d9]">🔍 Top Issues:</strong>
                  </p>
                  <ul className="space-y-1 ml-4">
                    <li>• Form validation error on mobile viewport</li>
                    <li>• Missing alt text on hero image</li>
                  </ul>
                </div>
                <a href="#" className="text-sm text-[#58a6ff] hover:underline">
                  View full report →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="relative py-12 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-ghost-white mb-8 flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            Troubleshooting
          </h2>

          <div className="space-y-4">
            {[
              {
                error: "Error: Invalid API key",
                solution:
                  "Verify your API key is correct and hasn't expired. Generate a new key from Settings → API Keys if needed.",
              },
              {
                error: "Error: Project not found",
                solution:
                  "Check that BETAFORGE_PROJECT_ID matches a project in your account. You can find project IDs in the dashboard URL or project settings.",
              },
              {
                error: "Timeout waiting for results",
                solution:
                  "Increase timeout-minutes value or check if your test URL is accessible from GitHub Actions runners. Consider using test-depth: shallow for faster results.",
              },
              {
                error: "Cannot connect to test URL",
                solution:
                  "Ensure your staging/preview URL is publicly accessible. For private URLs, use our CLI with a self-hosted runner or set up a secure tunnel.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-4 bg-void-elevated border border-white/5 rounded-xl"
              >
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-plasma-pink mt-0.5" />
                  <div>
                    <p className="font-mono text-sm text-plasma-pink mb-2">
                      {item.error}
                    </p>
                    <p className="text-sm text-phantom-gray">{item.solution}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Integrations */}
      <section className="relative py-12 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-ghost-white mb-8">
            Related Integrations
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/docs/integrations/gitlab"
              className="p-5 bg-void-elevated border border-white/5 rounded-xl hover:border-neural/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center mb-3">
                <GitMerge className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-ghost-white mb-1 group-hover:text-neural-bright transition-colors">
                GitLab CI
              </h3>
              <p className="text-sm text-phantom-gray">
                Integrate with GitLab pipelines
              </p>
            </Link>

            <Link
              href="/docs/integrations/slack"
              className="p-5 bg-void-elevated border border-white/5 rounded-xl hover:border-neural/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#4A154B] flex items-center justify-center mb-3">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-ghost-white mb-1 group-hover:text-neural-bright transition-colors">
                Slack
              </h3>
              <p className="text-sm text-phantom-gray">
                Get real-time notifications
              </p>
            </Link>

            <Link
              href="/docs/integrations/jira"
              className="p-5 bg-void-elevated border border-white/5 rounded-xl hover:border-neural/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center mb-3">
                <Bug className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-ghost-white mb-1 group-hover:text-neural-bright transition-colors">
                Jira
              </h3>
              <p className="text-sm text-phantom-gray">
                Auto-create issues for bugs
              </p>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
