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
  Clock,
  Terminal,
  FileCode,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Key,
  ExternalLink,
  BookOpen,
  Code2,
  Workflow,
  GitMerge,
  Layers,
  Eye,
  Settings,
  Variable,
  Lock,
  RefreshCw,
} from "lucide-react";
import { Footer } from "@/components/layout";

const codeExamples = {
  basic: `# .gitlab-ci.yml
stages:
  - build
  - test
  - betaforge

# Your existing build job
build:
  stage: build
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/

# BetaForge AI Testing
betaforge:
  stage: betaforge
  image: curlimages/curl:latest
  variables:
    BETAFORGE_API_KEY: $BETAFORGE_API_KEY
    BETAFORGE_PROJECT_ID: $BETAFORGE_PROJECT_ID
  script:
    - |
      response=$(curl -s -w "\\n%{http_code}" -X POST https://api.betaforge.ai/v1/sessions \\
        -H "Authorization: Bearer $BETAFORGE_API_KEY" \\
        -H "Content-Type: application/json" \\
        -d '{
          "projectId": "'$BETAFORGE_PROJECT_ID'",
          "testUrl": "'$CI_ENVIRONMENT_URL'",
          "agents": ["sarah", "marcus", "diego"],
          "waitForResults": true,
          "failOnCritical": true
        }')
      http_code=$(echo "$response" | tail -1)
      body=$(echo "$response" | sed '$d')
      echo "$body"
      test "$http_code" -lt 400
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH`,

  advanced: `# .gitlab-ci.yml - Advanced Configuration
stages:
  - build
  - deploy
  - test
  - report

variables:
  BETAFORGE_API_KEY: $BETAFORGE_API_KEY
  BETAFORGE_PROJECT_ID: $BETAFORGE_PROJECT_ID

# Deploy to Review Environment
deploy_review:
  stage: deploy
  environment:
    name: review/$CI_COMMIT_REF_SLUG
    url: https://$CI_COMMIT_REF_SLUG.review.example.com
    on_stop: stop_review
  script:
    - deploy_to_review_environment
  rules:
    - if: $CI_MERGE_REQUEST_IID

# Stop Review Environment
stop_review:
  stage: deploy
  environment:
    name: review/$CI_COMMIT_REF_SLUG
    action: stop
  script:
    - cleanup_review_environment
  rules:
    - if: $CI_MERGE_REQUEST_IID
      when: manual
  
# BetaForge UX Testing
betaforge:ux:
  stage: test
  image: betaforge/cli:latest
  needs: ["deploy_review"]
  variables:
    AGENT_GROUP: "sarah,emma"
  script:
    - |
      betaforge test \\
        --url "$CI_ENVIRONMENT_URL" \\
        --project-id "$BETAFORGE_PROJECT_ID" \\
        --agents "$AGENT_GROUP" \\
        --label "UX Testing" \\
        --wait \\
        --timeout 20 \\
        --output json > results-ux.json
  artifacts:
    paths:
      - results-ux.json
    reports:
      dotenv: betaforge.env
  rules:
    - if: $CI_MERGE_REQUEST_IID

# BetaForge Accessibility Testing
betaforge:a11y:
  stage: test
  image: betaforge/cli:latest
  needs: ["deploy_review"]
  variables:
    AGENT_GROUP: "ahmed,lin"
  script:
    - |
      betaforge test \\
        --url "$CI_ENVIRONMENT_URL" \\
        --project-id "$BETAFORGE_PROJECT_ID" \\
        --agents "$AGENT_GROUP" \\
        --label "Accessibility" \\
        --viewport mobile,desktop \\
        --wait \\
        --output json > results-a11y.json
  artifacts:
    paths:
      - results-a11y.json
  rules:
    - if: $CI_MERGE_REQUEST_IID

# BetaForge Security & Edge Cases
betaforge:security:
  stage: test
  image: betaforge/cli:latest
  needs: ["deploy_review"]
  variables:
    AGENT_GROUP: "diego,marcus"
  script:
    - |
      betaforge test \\
        --url "$CI_ENVIRONMENT_URL" \\
        --project-id "$BETAFORGE_PROJECT_ID" \\
        --agents "$AGENT_GROUP" \\
        --label "Security & Edge Cases" \\
        --depth comprehensive \\
        --wait \\
        --output json > results-security.json
  artifacts:
    paths:
      - results-security.json
  allow_failure: true  # Security tests are advisory
  rules:
    - if: $CI_MERGE_REQUEST_IID

# Generate Combined Report
betaforge:report:
  stage: report
  image: betaforge/cli:latest
  needs: 
    - betaforge:ux
    - betaforge:a11y
    - betaforge:security
  script:
    - |
      betaforge report combine \\
        --files results-*.json \\
        --output combined-report.html \\
        --format html
    - |
      betaforge report summary \\
        --files results-*.json \\
        --format markdown > summary.md
    - cat summary.md
  artifacts:
    paths:
      - combined-report.html
      - summary.md
    expose_as: "BetaForge Report"
  rules:
    - if: $CI_MERGE_REQUEST_IID`,

  scheduled: `# .gitlab-ci.yml - Scheduled Testing
stages:
  - scheduled_test

# Nightly comprehensive testing
nightly_betaforge:
  stage: scheduled_test
  image: betaforge/cli:latest
  variables:
    BETAFORGE_API_KEY: $BETAFORGE_API_KEY
    BETAFORGE_PROJECT_ID: $BETAFORGE_PROJECT_ID
  script:
    - |
      betaforge test \\
        --url "https://staging.example.com" \\
        --agents all \\
        --depth comprehensive \\
        --viewport mobile,tablet,desktop \\
        --wait \\
        --fail-on critical,high \\
        --notify slack,email \\
        --output json > nightly-results.json
    
    # Post to Slack on failure
    - |
      if [ $? -ne 0 ]; then
        curl -X POST "$SLACK_WEBHOOK_URL" \\
          -H 'Content-Type: application/json' \\
          -d '{"text": "🚨 Nightly BetaForge tests found critical issues!"}'
      fi
  artifacts:
    paths:
      - nightly-results.json
    expire_in: 30 days
  rules:
    - if: $CI_PIPELINE_SOURCE == "schedule"

# Weekly full regression
weekly_regression:
  stage: scheduled_test
  image: betaforge/cli:latest
  script:
    - |
      betaforge test \\
        --url "https://production.example.com" \\
        --project-id "$BETAFORGE_PROJECT_ID" \\
        --agents all \\
        --depth comprehensive \\
        --include-flows checkout,signup,dashboard \\
        --wait \\
        --timeout 60 \\
        --output json > weekly-results.json
  artifacts:
    paths:
      - weekly-results.json
    expire_in: 90 days
  rules:
    - if: $CI_PIPELINE_SOURCE == "schedule"
      variables:
        SCHEDULE_TYPE: weekly`,

  docker: `# Using BetaForge with Docker builds
stages:
  - build
  - test

variables:
  DOCKER_DRIVER: overlay2
  CONTAINER_IMAGE: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

# Build and push Docker image
build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker build -t $CONTAINER_IMAGE .
    - docker push $CONTAINER_IMAGE

# Run container and test with BetaForge
test:
  stage: test
  image: docker:latest
  services:
    - docker:dind
  variables:
    APP_PORT: 3000
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker pull $CONTAINER_IMAGE
    - |
      docker run -d \\
        --name test-app \\
        -p $APP_PORT:$APP_PORT \\
        -e NODE_ENV=test \\
        $CONTAINER_IMAGE
    - sleep 10  # Wait for container to start
  script:
    - |
      docker run --rm \\
        --network host \\
        -e BETAFORGE_API_KEY="$BETAFORGE_API_KEY" \\
        betaforge/cli:latest test \\
          --url "http://localhost:$APP_PORT" \\
          --project-id "$BETAFORGE_PROJECT_ID" \\
          --agents sarah,marcus \\
          --wait
  after_script:
    - docker stop test-app || true
    - docker rm test-app || true`,
};

const cliCommands = [
  {
    command: "betaforge test",
    description: "Run AI-powered tests against a URL",
    flags: [
      { name: "--url", description: "Target URL to test", required: true },
      {
        name: "--project-id",
        description: "BetaForge project ID",
        required: true,
      },
      {
        name: "--agents",
        description: "Comma-separated agent IDs",
        required: false,
      },
      {
        name: "--wait",
        description: "Wait for results before exiting",
        required: false,
      },
      {
        name: "--timeout",
        description: "Timeout in minutes (default: 30)",
        required: false,
      },
      {
        name: "--fail-on",
        description: "Severity to fail on: critical,high,medium,low",
        required: false,
      },
      {
        name: "--output",
        description: "Output format: json, junit, html",
        required: false,
      },
      {
        name: "--depth",
        description: "Test depth: shallow, standard, comprehensive",
        required: false,
      },
      {
        name: "--viewport",
        description: "Viewport: mobile, tablet, desktop, or custom",
        required: false,
      },
    ],
  },
  {
    command: "betaforge report",
    description: "Generate or combine test reports",
    flags: [
      {
        name: "combine",
        description: "Combine multiple JSON result files",
        required: false,
      },
      {
        name: "summary",
        description: "Generate a summary report",
        required: false,
      },
      {
        name: "--files",
        description: "Input file pattern (glob)",
        required: true,
      },
      { name: "--output", description: "Output filename", required: false },
      {
        name: "--format",
        description: "Output format: json, html, markdown",
        required: false,
      },
    ],
  },
  {
    command: "betaforge auth",
    description: "Authenticate with BetaForge",
    flags: [
      {
        name: "--api-key",
        description: "API key (or use BETAFORGE_API_KEY env)",
        required: false,
      },
      { name: "login", description: "Interactive login flow", required: false },
      {
        name: "status",
        description: "Check authentication status",
        required: false,
      },
    ],
  },
];

export default function GitLabIntegrationPage() {
  const [activeTab, setActiveTab] = useState<
    "basic" | "advanced" | "scheduled" | "docker"
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
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px]" />
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
            <span className="text-ghost-white">GitLab CI</span>
          </div>

          {/* Hero */}
          <div className="flex items-start gap-6 mb-12">
            <div className="p-4 rounded-2xl bg-orange-600 border border-orange-500">
              <GitMerge className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-ghost-white">
                  GitLab CI/CD
                </h1>
                <span className="px-2 py-1 text-xs bg-quantum-green/20 text-quantum-green rounded-full">
                  Official
                </span>
              </div>
              <p className="text-lg text-phantom-gray mb-6">
                Seamlessly integrate BetaForge into your GitLab CI/CD pipelines.
                Test merge requests, deployments, and run scheduled
                comprehensive tests.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://hub.docker.com/r/betaforge/cli"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-neural to-electric-cyan text-white font-semibold hover:shadow-glow transition-all"
                >
                  Docker Image
                  <ExternalLink className="w-4 h-4" />
                </a>
                <Link
                  href="/docs/cli"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-ghost-white font-medium hover:border-neural/30 transition-all"
                >
                  CLI Reference
                  <Code2 className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="p-4 bg-void-elevated border border-white/5 rounded-xl text-center">
              <div className="text-2xl font-bold text-ghost-white">v2.4.0</div>
              <div className="text-sm text-phantom-gray">CLI Version</div>
            </div>
            <div className="p-4 bg-void-elevated border border-white/5 rounded-xl text-center">
              <div className="text-2xl font-bold text-ghost-white">Alpine</div>
              <div className="text-sm text-phantom-gray">Docker Base</div>
            </div>
            <div className="p-4 bg-void-elevated border border-white/5 rounded-xl text-center">
              <div className="text-2xl font-bold text-quantum-green">45MB</div>
              <div className="text-sm text-phantom-gray">Image Size</div>
            </div>
            <div className="p-4 bg-void-elevated border border-white/5 rounded-xl text-center">
              <div className="text-2xl font-bold text-ghost-white">
                SaaS+Self
              </div>
              <div className="text-sm text-phantom-gray">GitLab Support</div>
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
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-sm">
                1
              </div>
              <Key className="w-8 h-8 text-orange-500 mb-4" />
              <h3 className="text-lg font-semibold text-ghost-white mb-2">
                Get API Key
              </h3>
              <p className="text-sm text-phantom-gray mb-4">
                Generate an API key from your BetaForge dashboard.
              </p>
              <Link
                href="/settings/api"
                className="text-sm text-neural-bright hover:underline"
              >
                Go to Settings →
              </Link>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 bg-void-elevated border border-white/5 rounded-xl">
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-sm">
                2
              </div>
              <Variable className="w-8 h-8 text-orange-500 mb-4" />
              <h3 className="text-lg font-semibold text-ghost-white mb-2">
                Add CI Variables
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
                as CI/CD variables.
              </p>
              <p className="text-xs text-mist-gray">
                Settings → CI/CD → Variables
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 bg-void-elevated border border-white/5 rounded-xl">
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-sm">
                3
              </div>
              <FileCode className="w-8 h-8 text-orange-500 mb-4" />
              <h3 className="text-lg font-semibold text-ghost-white mb-2">
                Update .gitlab-ci.yml
              </h3>
              <p className="text-sm text-phantom-gray mb-4">
                Add the BetaForge job to your pipeline configuration.
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

          {/* Variable Security Note */}
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-500 mt-0.5" />
            <div>
              <p className="text-sm text-ghost-white font-medium mb-1">
                Security Best Practice
              </p>
              <p className="text-sm text-phantom-gray">
                Mark your{" "}
                <code className="text-electric-cyan">BETAFORGE_API_KEY</code> as{" "}
                <strong>Protected</strong> and <strong>Masked</strong> in GitLab
                CI/CD variables to prevent exposure in logs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pipeline Examples */}
      <section className="relative py-12 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-ghost-white mb-8 flex items-center gap-3">
            <Workflow className="w-6 h-6 text-plasma-pink" />
            Pipeline Examples
          </h2>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { id: "basic", label: "Basic Setup", icon: Terminal },
              { id: "advanced", label: "Parallel Testing", icon: Layers },
              { id: "scheduled", label: "Scheduled Jobs", icon: Clock },
              { id: "docker", label: "Docker Builds", icon: RefreshCw },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-orange-600/20 text-ghost-white border border-orange-500/30"
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
                  .gitlab-ci.yml
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
          <div className="mt-6 p-4 bg-orange-600/5 border border-orange-500/20 rounded-xl">
            {activeTab === "basic" && (
              <p className="text-sm text-phantom-gray">
                <strong className="text-ghost-white">Basic Setup:</strong> A
                minimal pipeline that adds BetaForge testing after your build
                stage. Runs on merge requests and default branch pushes.
              </p>
            )}
            {activeTab === "advanced" && (
              <p className="text-sm text-phantom-gray">
                <strong className="text-ghost-white">Parallel Testing:</strong>{" "}
                Run multiple test suites in parallel with different agent
                groups. Each job focuses on specific testing areas (UX,
                accessibility, security) and results are combined into a single
                report.
              </p>
            )}
            {activeTab === "scheduled" && (
              <p className="text-sm text-phantom-gray">
                <strong className="text-ghost-white">Scheduled Jobs:</strong>{" "}
                Set up nightly or weekly comprehensive testing with Slack
                notifications on failures. Perfect for regression testing on
                staging environments.
              </p>
            )}
            {activeTab === "docker" && (
              <p className="text-sm text-phantom-gray">
                <strong className="text-ghost-white">Docker Builds:</strong>{" "}
                Build your app as a Docker container, run it in the CI
                environment, and test with BetaForge. Useful for apps that need
                specific runtime environments.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* CLI Reference */}
      <section className="relative py-12 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-ghost-white mb-8 flex items-center gap-3">
            <Terminal className="w-6 h-6 text-quantum-green" />
            CLI Reference
          </h2>

          <div className="space-y-6">
            {cliCommands.map((cmd) => (
              <div
                key={cmd.command}
                className="bg-void-elevated border border-white/5 rounded-xl overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-white/5 bg-void-black/50 flex items-center justify-between">
                  <code className="text-lg text-electric-cyan font-mono">
                    {cmd.command}
                  </code>
                  <span className="text-sm text-phantom-gray">
                    {cmd.description}
                  </span>
                </div>
                <div className="p-4">
                  <table className="w-full">
                    <tbody>
                      {cmd.flags.map((flag, index) => (
                        <tr
                          key={flag.name}
                          className={
                            index !== cmd.flags.length - 1
                              ? "border-b border-white/5"
                              : ""
                          }
                        >
                          <td className="py-2 pr-4">
                            <code className="text-sm text-neural-bright">
                              {flag.name}
                            </code>
                          </td>
                          <td className="py-2 px-4">
                            <span className="text-sm text-phantom-gray">
                              {flag.description}
                            </span>
                          </td>
                          <td className="py-2 pl-4 text-right">
                            {flag.required ? (
                              <span className="text-xs px-2 py-0.5 bg-plasma-pink/20 text-plasma-pink rounded">
                                Required
                              </span>
                            ) : (
                              <span className="text-xs px-2 py-0.5 bg-white/10 text-mist-gray rounded">
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
            ))}
          </div>
        </div>
      </section>

      {/* Environment Variables */}
      <section className="relative py-12 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-ghost-white mb-8 flex items-center gap-3">
            <Variable className="w-6 h-6 text-electric-cyan" />
            Environment Variables
          </h2>

          <div className="bg-void-elevated border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 bg-void-black/50">
                  <th className="text-left px-4 py-3 text-sm font-medium text-phantom-gray">
                    Variable
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
                {[
                  {
                    name: "BETAFORGE_API_KEY",
                    required: true,
                    description: "Your BetaForge API key for authentication",
                  },
                  {
                    name: "BETAFORGE_PROJECT_ID",
                    required: true,
                    description: "The project ID to run tests against",
                  },
                  {
                    name: "BETAFORGE_BASE_URL",
                    required: false,
                    description: "Custom API URL (for enterprise/self-hosted)",
                  },
                  {
                    name: "BETAFORGE_TIMEOUT",
                    required: false,
                    description: "Default timeout in minutes (default: 30)",
                  },
                  {
                    name: "BETAFORGE_VERBOSE",
                    required: false,
                    description: "Enable verbose logging (true/false)",
                  },
                  {
                    name: "CI_ENVIRONMENT_URL",
                    required: false,
                    description:
                      "GitLab-provided environment URL (auto-detected)",
                  },
                ].map((env, index) => (
                  <tr
                    key={env.name}
                    className={index !== 5 ? "border-b border-white/5" : ""}
                  >
                    <td className="px-4 py-3">
                      <code className="text-sm text-electric-cyan">
                        {env.name}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      {env.required ? (
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
                      <span className="text-sm text-phantom-gray">
                        {env.description}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                error: "Error: BETAFORGE_API_KEY environment variable not set",
                solution:
                  "Add BETAFORGE_API_KEY as a CI/CD variable in Settings → CI/CD → Variables. Make sure it's not limited to protected branches if you're testing on all branches.",
              },
              {
                error: "Error: Unable to connect to target URL",
                solution:
                  "Ensure your deployment is complete before the BetaForge job runs. Use 'needs:' to specify dependencies. For review environments, verify the URL is accessible from the internet.",
              },
              {
                error: "Job timeout after 60 minutes",
                solution:
                  "Comprehensive tests can take time. Either increase the timeout with --timeout flag, use --depth shallow for faster results, or split tests across multiple parallel jobs.",
              },
              {
                error: "Docker image pull failed",
                solution:
                  "Check your GitLab runner has internet access to pull from Docker Hub. For air-gapped environments, mirror the image to your private registry.",
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

      <Footer />
    </div>
  );
}
