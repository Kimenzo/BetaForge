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
  Settings,
  GitBranch,
  GitPullRequest,
  Clock,
  RefreshCw,
  Lock,
  Tag,
  Play,
} from "lucide-react";
import { Footer } from "@/components/layout";

const pipelineExamples = {
  basic: `# bitbucket-pipelines.yml
image: node:18

definitions:
  steps:
    - step: &betaforge-test
        name: BetaForge AI Testing
        image: curlimages/curl:latest
        script:
          - |
            response=$(curl -s -w "\\n%{http_code}" -X POST https://api.betaforge.ai/v1/sessions \\
              -H "Authorization: Bearer $BETAFORGE_API_KEY" \\
              -H "Content-Type: application/json" \\
              -d '{
                "projectId": "'$BETAFORGE_PROJECT_ID'",
                "testUrl": "'$TEST_URL'",
                "agents": ["sarah", "marcus", "diego"],
                "waitForResults": true,
                "failOnCritical": true
              }')
            http_code=$(echo "$response" | tail -1)
            body=$(echo "$response" | sed '$d')
            echo "$body"
            test "$http_code" -lt 400

pipelines:
  pull-requests:
    '**':
      - step:
          name: Build
          script:
            - npm ci
            - npm run build
      - step: *betaforge-test

  branches:
    develop:
      - step:
          name: Build
          script:
            - npm ci
            - npm run build
      - step:
          name: Deploy Staging
          deployment: staging
          script:
            - ./scripts/deploy-staging.sh
      - step: *betaforge-test`,

  pipeArtifacts: `# Using Bitbucket Pipes with artifacts
image: node:18

definitions:
  steps:
    - step: &build
        name: Build
        caches:
          - node
        script:
          - npm ci
          - npm run build
          - npm run test:unit
        artifacts:
          - dist/**
          - node_modules/**

    - step: &betaforge-test
        name: BetaForge Testing
        script:
          - pipe: betaforge/betaforge-pipe:1.0.0
            variables:
              API_KEY: $BETAFORGE_API_KEY
              PROJECT_ID: $BETAFORGE_PROJECT_ID
              TEST_URL: $STAGING_URL
              AGENTS: 'sarah,marcus,ahmed,diego'
              WAIT_FOR_RESULTS: 'true'
              FAIL_ON_CRITICAL: 'true'
              TIMEOUT: '600'
        artifacts:
          - betaforge-report.json
          - betaforge-screenshots/**

pipelines:
  pull-requests:
    '**':
      - step: *build
      - step: *betaforge-test
      
  branches:
    main:
      - step: *build
      - step:
          name: Deploy Staging
          deployment: staging
          script:
            - ./deploy-staging.sh
      - step: *betaforge-test
      - step:
          name: Deploy Production
          deployment: production
          trigger: manual
          script:
            - ./deploy-production.sh`,

  parallelAgents: `# Run agents in parallel for faster testing
image: node:18

definitions:
  steps:
    - step: &deploy-staging
        name: Deploy to Staging
        deployment: staging
        script:
          - npm ci
          - npm run build
          - ./scripts/deploy-staging.sh

pipelines:
  pull-requests:
    '**':
      - step: *deploy-staging
      - parallel:
          - step:
              name: Sarah - Cautious Explorer
              script:
                - pipe: betaforge/betaforge-pipe:1.0.0
                  variables:
                    API_KEY: $BETAFORGE_API_KEY
                    PROJECT_ID: $BETAFORGE_PROJECT_ID
                    TEST_URL: $STAGING_URL
                    AGENTS: 'sarah'
                    WAIT_FOR_RESULTS: 'true'
          - step:
              name: Marcus - Power User
              script:
                - pipe: betaforge/betaforge-pipe:1.0.0
                  variables:
                    API_KEY: $BETAFORGE_API_KEY
                    PROJECT_ID: $BETAFORGE_PROJECT_ID
                    TEST_URL: $STAGING_URL
                    AGENTS: 'marcus'
                    WAIT_FOR_RESULTS: 'true'
          - step:
              name: Diego - Chaos Tester
              script:
                - pipe: betaforge/betaforge-pipe:1.0.0
                  variables:
                    API_KEY: $BETAFORGE_API_KEY
                    PROJECT_ID: $BETAFORGE_PROJECT_ID
                    TEST_URL: $STAGING_URL
                    AGENTS: 'diego'
                    WAIT_FOR_RESULTS: 'true'
      - step:
          name: Aggregate Results
          script:
            - |
              echo "Collecting all agent results..."
              # Results from parallel steps are in artifacts
              cat betaforge-sarah.json betaforge-marcus.json betaforge-diego.json | jq -s 'add'`,

  monorepo: `# Monorepo configuration with conditional testing
image: node:18

definitions:
  caches:
    npm: ~/.npm
    
  steps:
    - step: &test-frontend
        name: Test Frontend
        condition:
          changesets:
            includePaths:
              - "apps/frontend/**"
              - "packages/ui/**"
        script:
          - cd apps/frontend
          - npm ci
          - npm run build
          - pipe: betaforge/betaforge-pipe:1.0.0
            variables:
              API_KEY: $BETAFORGE_API_KEY
              PROJECT_ID: $BETAFORGE_PROJECT_ID_FRONTEND
              TEST_URL: $STAGING_FRONTEND_URL
              AGENTS: 'sarah,lin,emma'

    - step: &test-admin
        name: Test Admin Panel
        condition:
          changesets:
            includePaths:
              - "apps/admin/**"
              - "packages/ui/**"
        script:
          - cd apps/admin
          - npm ci
          - npm run build
          - pipe: betaforge/betaforge-pipe:1.0.0
            variables:
              API_KEY: $BETAFORGE_API_KEY
              PROJECT_ID: $BETAFORGE_PROJECT_ID_ADMIN
              TEST_URL: $STAGING_ADMIN_URL
              AGENTS: 'marcus,ahmed'

    - step: &test-api
        name: Test API Docs
        condition:
          changesets:
            includePaths:
              - "apps/api/**"
              - "packages/api-client/**"
        script:
          - cd apps/api
          - npm ci
          - npm run build
          - pipe: betaforge/betaforge-pipe:1.0.0
            variables:
              API_KEY: $BETAFORGE_API_KEY
              PROJECT_ID: $BETAFORGE_PROJECT_ID_API
              TEST_URL: $STAGING_API_DOCS_URL
              AGENTS: 'marcus,ahmed'

pipelines:
  pull-requests:
    '**':
      - parallel:
          - step: *test-frontend
          - step: *test-admin
          - step: *test-api`,
};

const pipeVariables = [
  { name: "API_KEY", desc: "Your BetaForge API key", required: true },
  { name: "PROJECT_ID", desc: "The project ID to test", required: true },
  { name: "TEST_URL", desc: "The URL to test", required: true },
  {
    name: "AGENTS",
    desc: "Comma-separated list of agents (default: all)",
    required: false,
  },
  {
    name: "WAIT_FOR_RESULTS",
    desc: "Block until tests complete (default: true)",
    required: false,
  },
  {
    name: "FAIL_ON_CRITICAL",
    desc: "Fail pipeline on critical bugs (default: true)",
    required: false,
  },
  {
    name: "FAIL_ON_HIGH",
    desc: "Fail pipeline on high severity bugs (default: false)",
    required: false,
  },
  {
    name: "TIMEOUT",
    desc: "Max wait time in seconds (default: 600)",
    required: false,
  },
  {
    name: "DEBUG",
    desc: "Enable verbose logging (default: false)",
    required: false,
  },
];

export default function BitbucketIntegrationPage() {
  const [activeExample, setActiveExample] = useState<
    "basic" | "pipeArtifacts" | "parallelAgents" | "monorepo"
  >("basic");
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
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
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
            <span className="text-ghost-white">Bitbucket Pipelines</span>
          </div>

          <div className="flex items-start gap-6 mb-12">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 border border-blue-500/30">
              <svg
                className="w-10 h-10 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M.778 1.211a.768.768 0 00-.768.892l3.263 19.81c.084.5.515.868 1.022.873H19.95a.772.772 0 00.77-.646l3.27-20.03a.768.768 0 00-.768-.891zM14.52 15.53H9.522L8.17 8.466h7.561z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-ghost-white">
                  Bitbucket Pipelines
                </h1>
              </div>
              <p className="text-lg text-phantom-gray mb-6">
                Run BetaForge AI testing in your Bitbucket Pipelines with our
                official pipe or the BetaForge CLI. Perfect for teams using
                Atlassian&apos;s ecosystem.
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="/settings/api"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-neural to-electric-cyan text-white font-semibold hover:shadow-glow transition-all"
                >
                  Get API Key
                  <Key className="w-4 h-4" />
                </Link>
                <a
                  href="https://support.atlassian.com/bitbucket-cloud/docs/get-started-with-bitbucket-pipelines/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-ghost-white font-medium hover:border-neural/30 transition-all"
                >
                  Pipelines Docs
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="p-4 bg-void-elevated border border-white/5 rounded-xl">
              <GitPullRequest className="w-6 h-6 text-blue-400 mb-2" />
              <h3 className="font-semibold text-ghost-white text-sm">
                PR Testing
              </h3>
              <p className="text-xs text-phantom-gray">
                Test every pull request
              </p>
            </div>
            <div className="p-4 bg-void-elevated border border-white/5 rounded-xl">
              <Zap className="w-6 h-6 text-quantum-green mb-2" />
              <h3 className="font-semibold text-ghost-white text-sm">
                Official Pipe
              </h3>
              <p className="text-xs text-phantom-gray">One-line integration</p>
            </div>
            <div className="p-4 bg-void-elevated border border-white/5 rounded-xl">
              <RefreshCw className="w-6 h-6 text-plasma-pink mb-2" />
              <h3 className="font-semibold text-ghost-white text-sm">
                Parallel Steps
              </h3>
              <p className="text-xs text-phantom-gray">
                Run agents concurrently
              </p>
            </div>
            <div className="p-4 bg-void-elevated border border-white/5 rounded-xl">
              <Lock className="w-6 h-6 text-electric-cyan mb-2" />
              <h3 className="font-semibold text-ghost-white text-sm">
                Secure Variables
              </h3>
              <p className="text-xs text-phantom-gray">
                Encrypted repository vars
              </p>
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

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-void-elevated border border-white/5 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-quantum-green/20 flex items-center justify-center">
                  <span className="text-quantum-green font-bold">1</span>
                </div>
                <h3 className="text-lg font-semibold text-ghost-white">
                  Add Repository Variables
                </h3>
              </div>
              <p className="text-sm text-phantom-gray mb-4">
                Go to Repository Settings → Repository Variables and add:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <code className="text-electric-cyan">BETAFORGE_API_KEY</code>
                  <span className="text-red-400">(secured)</span>
                </li>
                <li className="flex items-center gap-2">
                  <code className="text-electric-cyan">
                    BETAFORGE_PROJECT_ID
                  </code>
                </li>
                <li className="flex items-center gap-2">
                  <code className="text-electric-cyan">STAGING_URL</code>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-void-elevated border border-white/5 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-quantum-green/20 flex items-center justify-center">
                  <span className="text-quantum-green font-bold">2</span>
                </div>
                <h3 className="text-lg font-semibold text-ghost-white">
                  Add Pipeline Step
                </h3>
              </div>
              <p className="text-sm text-phantom-gray mb-4">
                Add this step to your{" "}
                <code className="text-electric-cyan">
                  bitbucket-pipelines.yml
                </code>
                :
              </p>
              <div className="bg-void-black p-3 rounded-lg">
                <pre className="text-xs text-phantom-gray font-mono">
                  {`- step:
    name: BetaForge Test
    script:
      - pipe: betaforge/betaforge-pipe:1.0.0
        variables:
          API_KEY: $BETAFORGE_API_KEY
          PROJECT_ID: $BETAFORGE_PROJECT_ID
          TEST_URL: $STAGING_URL`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pipeline Examples */}
      <section className="relative py-12 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-ghost-white mb-8 flex items-center gap-3">
            <Code2 className="w-6 h-6 text-plasma-pink" />
            Pipeline Examples
          </h2>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { id: "basic", label: "Basic", icon: Play },
              { id: "pipeArtifacts", label: "With Artifacts", icon: Tag },
              {
                id: "parallelAgents",
                label: "Parallel Agents",
                icon: RefreshCw,
              },
              { id: "monorepo", label: "Monorepo", icon: GitBranch },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveExample(tab.id as typeof activeExample)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeExample === tab.id
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "bg-void-elevated text-phantom-gray hover:text-ghost-white border border-white/5"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Code Block */}
          <div className="bg-void-elevated border border-white/5 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-void-black/50">
              <span className="text-sm text-phantom-gray font-mono">
                bitbucket-pipelines.yml
              </span>
              <button
                onClick={() =>
                  copyCode(pipelineExamples[activeExample], activeExample)
                }
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-phantom-gray hover:text-ghost-white transition-colors rounded-lg hover:bg-white/5"
              >
                {copied === activeExample ? (
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
                {pipelineExamples[activeExample]}
              </code>
            </pre>
          </div>

          {/* Example descriptions */}
          <div className="mt-6 p-4 bg-void-elevated border border-white/5 rounded-xl">
            {activeExample === "basic" && (
              <div>
                <h3 className="font-semibold text-ghost-white mb-2">
                  Basic Configuration
                </h3>
                <p className="text-sm text-phantom-gray">
                  A straightforward setup using YAML anchors for reusability.
                  Tests run on all PRs and after deploying to staging on the
                  develop branch.
                </p>
              </div>
            )}
            {activeExample === "pipeArtifacts" && (
              <div>
                <h3 className="font-semibold text-ghost-white mb-2">
                  With Artifacts
                </h3>
                <p className="text-sm text-phantom-gray">
                  Uses build caching and artifact passing between steps.
                  BetaForge results and screenshots are stored as pipeline
                  artifacts for later review.
                </p>
              </div>
            )}
            {activeExample === "parallelAgents" && (
              <div>
                <h3 className="font-semibold text-ghost-white mb-2">
                  Parallel Agents
                </h3>
                <p className="text-sm text-phantom-gray">
                  Runs each AI agent in a separate parallel step for faster
                  testing. Results are aggregated in a final step. Great for
                  comprehensive testing without increasing pipeline duration.
                </p>
              </div>
            )}
            {activeExample === "monorepo" && (
              <div>
                <h3 className="font-semibold text-ghost-white mb-2">
                  Monorepo
                </h3>
                <p className="text-sm text-phantom-gray">
                  Uses changeset conditions to only test apps that have changed.
                  Each app has its own BetaForge project with appropriate
                  agents. Perfect for large codebases.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pipe Variables */}
      <section className="relative py-12 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-ghost-white mb-8 flex items-center gap-3">
            <Settings className="w-6 h-6 text-quantum-green" />
            Pipe Variables
          </h2>

          <div className="bg-void-elevated border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 bg-void-black/50">
                  <th className="text-left px-4 py-3 text-sm font-medium text-phantom-gray">
                    Variable
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-phantom-gray">
                    Description
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-phantom-gray">
                    Required
                  </th>
                </tr>
              </thead>
              <tbody>
                {pipeVariables.map((variable, i, arr) => (
                  <tr
                    key={variable.name}
                    className={
                      i < arr.length - 1 ? "border-b border-white/5" : ""
                    }
                  >
                    <td className="px-4 py-3">
                      <code className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded font-mono">
                        {variable.name}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-phantom-gray">
                        {variable.desc}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {variable.required ? (
                        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">
                          Required
                        </span>
                      ) : (
                        <span className="text-xs bg-void-black text-phantom-gray px-2 py-1 rounded">
                          Optional
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PR Status Checks */}
      <section className="relative py-12 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-ghost-white mb-8 flex items-center gap-3">
            <GitPullRequest className="w-6 h-6 text-electric-cyan" />
            Pull Request Integration
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-void-elevated border border-white/5 rounded-xl">
              <h3 className="text-lg font-semibold text-ghost-white mb-4">
                Status Checks
              </h3>
              <p className="text-sm text-phantom-gray mb-4">
                When BetaForge finds bugs, the pipeline status is reported to
                your PR:
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">
                    0 bugs - Pipeline passes
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-yellow-400">
                    Low/Medium bugs - Warning (configurable)
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-red-400">
                    Critical/High bugs - Pipeline fails
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-void-elevated border border-white/5 rounded-xl">
              <h3 className="text-lg font-semibold text-ghost-white mb-4">
                Build Insights
              </h3>
              <p className="text-sm text-phantom-gray mb-4">
                BetaForge results appear in Bitbucket Build Insights:
              </p>
              <ul className="space-y-2 text-sm text-phantom-gray">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-quantum-green mt-0.5" />
                  Bug count and severity breakdown
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-quantum-green mt-0.5" />
                  Direct links to full bug reports
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-quantum-green mt-0.5" />
                  Agent-specific results
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-quantum-green mt-0.5" />
                  Test duration and performance metrics
                </li>
              </ul>
            </div>
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
                problem: "Variable not found",
                solution:
                  "Ensure variables are set in Repository Settings → Repository Variables. For secured variables, they won't show in logs but will be available to pipes.",
              },
              {
                problem: "Pipeline times out",
                solution:
                  "BetaForge tests typically take 5-15 minutes. Increase the step's max-time if needed: `max-time: 20`",
              },
              {
                problem: "Pipe version not found",
                solution:
                  "Make sure you're using the correct pipe format: `betaforge/betaforge-pipe:1.0.0`. Check Bitbucket Pipes for the latest version.",
              },
              {
                problem: "Parallel steps failing independently",
                solution:
                  "Each parallel step is isolated. If you need shared data, use artifacts. Make sure each step has its own BetaForge session.",
              },
              {
                problem: "Changesets not triggering correctly",
                solution:
                  "Changeset conditions require Pipelines to fetch full git history. Add `clone: depth: full` to your pipeline if needed.",
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
