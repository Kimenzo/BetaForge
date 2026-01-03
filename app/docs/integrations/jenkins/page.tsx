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
  Play,
  RefreshCw,
  Clock,
  Layers,
  Box,
  FileCode,
  Server,
  Lock,
} from "lucide-react";
import { Footer } from "@/components/layout";

const pipelineExamples = {
  declarative: `pipeline {
    agent any
    
    environment {
        BETAFORGE_API_KEY = credentials('betaforge-api-key')
        BETAFORGE_PROJECT_ID = 'proj_your_id'
    }
    
    stages {
        stage('Build') {
            steps {
                sh 'npm ci'
                sh 'npm run build'
            }
        }
        
        stage('Deploy to Staging') {
            steps {
                sh './scripts/deploy-staging.sh'
            }
        }
        
        stage('BetaForge AI Testing') {
            steps {
                script {
                    def response = sh(
                        script: """
                            curl -s -X POST https://api.betaforge.ai/v1/sessions \\
                                -H "Authorization: Bearer \${BETAFORGE_API_KEY}" \\
                                -H "Content-Type: application/json" \\
                                -d '{
                                    "projectId": "\${BETAFORGE_PROJECT_ID}",
                                    "testUrl": "https://staging.myapp.com",
                                    "agents": ["sarah", "marcus", "diego"],
                                    "waitForResults": true,
                                    "timeout": 600
                                }'
                        """,
                        returnStdout: true
                    ).trim()
                    
                    def result = readJSON text: response
                    
                    if (result.criticalBugs > 0) {
                        error "BetaForge found \${result.criticalBugs} critical bugs!"
                    }
                    
                    echo "BetaForge completed: \${result.totalBugs} bugs found"
                }
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                sh './scripts/deploy-production.sh'
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline completed'
        }
        failure {
            slackSend channel: '#deployments', message: 'Pipeline failed!'
        }
    }
}`,

  scripted: `node {
    def betaforgeResult
    
    stage('Checkout') {
        checkout scm
    }
    
    stage('Build') {
        sh 'npm ci && npm run build'
    }
    
    stage('Deploy Staging') {
        sh './deploy-staging.sh'
    }
    
    stage('BetaForge Testing') {
        withCredentials([string(credentialsId: 'betaforge-api-key', variable: 'BETAFORGE_KEY')]) {
            betaforgeResult = sh(
                script: """
                    curl -s -X POST https://api.betaforge.ai/v1/sessions \\
                        -H "Authorization: Bearer \${BETAFORGE_KEY}" \\
                        -H "Content-Type: application/json" \\
                        -d '{
                            "projectId": "proj_xxx",
                            "testUrl": "https://staging.myapp.com",
                            "agents": ["sarah", "marcus", "ahmed"],
                            "waitForResults": true,
                            "failOnCritical": true
                        }'
                """,
                returnStdout: true
            ).trim()
        }
        
        def result = readJSON text: betaforgeResult
        
        // Archive results
        writeFile file: 'betaforge-results.json', text: betaforgeResult
        archiveArtifacts artifacts: 'betaforge-results.json'
        
        // Fail on critical bugs
        if (result.summary?.critical > 0) {
            currentBuild.result = 'FAILURE'
            error("Critical bugs found: \${result.summary.critical}")
        }
    }
    
    stage('Deploy Production') {
        if (env.BRANCH_NAME == 'main') {
            sh './deploy-production.sh'
        }
    }
}`,

  sharedLibrary: `// vars/betaforgeTest.groovy - Shared Library
def call(Map config = [:]) {
    def apiKey = config.apiKey ?: env.BETAFORGE_API_KEY
    def projectId = config.projectId ?: env.BETAFORGE_PROJECT_ID
    def testUrl = config.testUrl
    def agents = config.agents ?: ['sarah', 'marcus']
    def failOnCritical = config.failOnCritical != false
    
    echo "Running BetaForge tests on \${testUrl}"
    
    def response = httpRequest(
        httpMode: 'POST',
        url: 'https://api.betaforge.ai/v1/sessions',
        customHeaders: [[name: 'Authorization', value: "Bearer \${apiKey}"]],
        contentType: 'APPLICATION_JSON',
        requestBody: groovy.json.JsonOutput.toJson([
            projectId: projectId,
            testUrl: testUrl,
            agents: agents,
            waitForResults: true
        ])
    )
    
    def result = readJSON text: response.content
    
    // Publish HTML report link
    echo "View full report: \${result.dashboardUrl}"
    
    // Set build description
    currentBuild.description = "BetaForge: \${result.summary.total} bugs"
    
    if (failOnCritical && result.summary.critical > 0) {
        error("BetaForge found \${result.summary.critical} critical bugs")
    }
    
    return result
}

// Usage in Jenkinsfile:
// @Library('my-shared-library') _
// 
// pipeline {
//     stages {
//         stage('Test') {
//             steps {
//                 betaforgeTest(
//                     testUrl: 'https://staging.myapp.com',
//                     agents: ['sarah', 'diego'],
//                     failOnCritical: true
//                 )
//             }
//         }
//     }
// }`,

  blueOcean: `// Jenkinsfile for Blue Ocean compatibility
pipeline {
    agent any
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }
    
    environment {
        BETAFORGE_API_KEY = credentials('betaforge-api-key')
    }
    
    stages {
        stage('Build & Deploy') {
            parallel {
                stage('Build Frontend') {
                    steps {
                        sh 'npm run build:frontend'
                    }
                }
                stage('Build Backend') {
                    steps {
                        sh 'npm run build:backend'
                    }
                }
            }
        }
        
        stage('Deploy Staging') {
            steps {
                sh './deploy-staging.sh'
                // Wait for deployment to be ready
                sh 'sleep 30'
            }
        }
        
        stage('AI Testing') {
            steps {
                script {
                    // Run BetaForge in background and poll for results
                    def sessionId = sh(
                        script: '''
                            curl -s -X POST https://api.betaforge.ai/v1/sessions \\
                                -H "Authorization: Bearer $BETAFORGE_API_KEY" \\
                                -H "Content-Type: application/json" \\
                                -d '{"projectId":"proj_xxx","testUrl":"https://staging.myapp.com","agents":["sarah","marcus","diego"]}' \\
                                | jq -r '.sessionId'
                        ''',
                        returnStdout: true
                    ).trim()
                    
                    echo "Started BetaForge session: \${sessionId}"
                    
                    // Poll for completion
                    def maxAttempts = 60
                    def attempt = 0
                    def status = 'running'
                    
                    while (status == 'running' && attempt < maxAttempts) {
                        sleep(10)
                        status = sh(
                            script: """
                                curl -s https://api.betaforge.ai/v1/sessions/\${sessionId} \\
                                    -H "Authorization: Bearer \${BETAFORGE_API_KEY}" \\
                                    | jq -r '.status'
                            """,
                            returnStdout: true
                        ).trim()
                        attempt++
                    }
                    
                    if (status != 'completed') {
                        error("BetaForge session timed out or failed")
                    }
                }
            }
        }
        
        stage('Approve Production') {
            when {
                branch 'main'
            }
            steps {
                input message: 'Deploy to production?', ok: 'Deploy'
            }
        }
        
        stage('Deploy Production') {
            when {
                branch 'main'
            }
            steps {
                sh './deploy-production.sh'
            }
        }
    }
    
    post {
        success {
            slackSend color: 'good', message: "Build \${env.BUILD_NUMBER} passed!"
        }
        failure {
            slackSend color: 'danger', message: "Build \${env.BUILD_NUMBER} failed!"
        }
    }
}`,
};

export default function JenkinsIntegrationPage() {
  const [activeExample, setActiveExample] = useState<"declarative" | "scripted" | "sharedLibrary" | "blueOcean">("declarative");
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
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px]" />
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
                <span className="text-xl font-bold gradient-text">BetaForge</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/docs/integrations" className="text-phantom-gray hover:text-ghost-white text-sm transition-colors">
                All Integrations
              </Link>
              <Link href="/dashboard" className="px-4 py-2 rounded-lg bg-neural/20 text-ghost-white text-sm font-medium hover:bg-neural/30 transition-colors">
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
            <Link href="/docs" className="hover:text-ghost-white transition-colors">Docs</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/docs/integrations" className="hover:text-ghost-white transition-colors">Integrations</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-ghost-white">Jenkins</span>
          </div>

          <div className="flex items-start gap-6 mb-12">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 border border-red-500/30">
              <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.41 16.09V19c0 .55-.45 1-1 1h-.18c-.55 0-1-.45-1-1v-.91c-.93-.24-1.76-.73-2.37-1.41-.34-.38-.3-.96.1-1.29l.17-.14c.34-.28.83-.23 1.13.12.44.52 1.07.84 1.78.84.97 0 1.76-.79 1.76-1.76s-.79-1.76-1.76-1.76c-1.94 0-3.51-1.57-3.51-3.51s1.57-3.51 3.51-3.51V5c0-.55.45-1 1-1h.18c.55 0 1 .45 1 1v.93c.88.26 1.66.75 2.24 1.41.33.38.28.95-.11 1.28l-.18.15c-.33.27-.81.22-1.12-.12-.4-.45-.98-.74-1.63-.74-.97 0-1.76.79-1.76 1.76s.79 1.76 1.76 1.76c1.94 0 3.51 1.57 3.51 3.51 0 1.76-1.3 3.21-3 3.46v.91c0 .55-.45 1-1 1h-.18c-.55 0-1-.45-1-1v-.93c-.09-.01-.18-.04-.27-.06z"/>
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-ghost-white">Jenkins</h1>
                <span className="px-2 py-1 text-xs bg-neural/20 text-neural-bright rounded-full">Enterprise</span>
              </div>
              <p className="text-lg text-phantom-gray mb-6">
                Integrate BetaForge AI testing into your Jenkins pipelines with declarative or scripted 
                syntax. Perfect for enterprise CI/CD workflows.
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
                  href="https://www.jenkins.io/doc/book/pipeline/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-ghost-white font-medium hover:border-neural/30 transition-all"
                >
                  Jenkins Docs
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="p-4 bg-void-elevated border border-white/5 rounded-xl">
              <Layers className="w-6 h-6 text-red-400 mb-2" />
              <h3 className="font-semibold text-ghost-white text-sm">Pipeline Support</h3>
              <p className="text-xs text-phantom-gray">Declarative & Scripted</p>
            </div>
            <div className="p-4 bg-void-elevated border border-white/5 rounded-xl">
              <Server className="w-6 h-6 text-blue-400 mb-2" />
              <h3 className="font-semibold text-ghost-white text-sm">Shared Libraries</h3>
              <p className="text-xs text-phantom-gray">Reusable components</p>
            </div>
            <div className="p-4 bg-void-elevated border border-white/5 rounded-xl">
              <Lock className="w-6 h-6 text-quantum-green mb-2" />
              <h3 className="font-semibold text-ghost-white text-sm">Credentials</h3>
              <p className="text-xs text-phantom-gray">Secure key storage</p>
            </div>
            <div className="p-4 bg-void-elevated border border-white/5 rounded-xl">
              <RefreshCw className="w-6 h-6 text-plasma-pink mb-2" />
              <h3 className="font-semibold text-ghost-white text-sm">Polling/Async</h3>
              <p className="text-xs text-phantom-gray">Flexible execution</p>
            </div>
          </div>
        </div>
      </section>

      {/* Prerequisites */}
      <section className="relative py-12 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-ghost-white mb-8 flex items-center gap-3">
            <Settings className="w-6 h-6 text-electric-cyan" />
            Prerequisites
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-void-elevated border border-white/5 rounded-xl">
              <h3 className="text-lg font-semibold text-ghost-white mb-4">Required Plugins</h3>
              <ul className="space-y-3">
                {[
                  { name: "Pipeline", desc: "Core pipeline functionality" },
                  { name: "Credentials Binding", desc: "Secure credential access" },
                  { name: "HTTP Request", desc: "For API calls (optional)" },
                  { name: "Pipeline Utility Steps", desc: "JSON parsing helpers" },
                ].map((plugin) => (
                  <li key={plugin.name} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-quantum-green flex-shrink-0" />
                    <div>
                      <span className="text-sm text-ghost-white font-medium">{plugin.name}</span>
                      <p className="text-xs text-phantom-gray">{plugin.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-void-elevated border border-white/5 rounded-xl">
              <h3 className="text-lg font-semibold text-ghost-white mb-4">Setting Up Credentials</h3>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-neural/20 text-neural-bright flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                  <span className="text-sm text-phantom-gray">Go to Jenkins → Manage Jenkins → Credentials</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-neural/20 text-neural-bright flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                  <span className="text-sm text-phantom-gray">Add Credentials → Secret text</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-neural/20 text-neural-bright flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                  <span className="text-sm text-phantom-gray">Enter your BetaForge API key as the secret</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-neural/20 text-neural-bright flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                  <span className="text-sm text-phantom-gray">Set ID to <code className="text-electric-cyan">betaforge-api-key</code></span>
                </li>
              </ol>
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
              { id: "declarative", label: "Declarative", icon: FileCode },
              { id: "scripted", label: "Scripted", icon: Terminal },
              { id: "sharedLibrary", label: "Shared Library", icon: Layers },
              { id: "blueOcean", label: "Blue Ocean", icon: Play },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveExample(tab.id as typeof activeExample)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeExample === tab.id
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
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
              <span className="text-sm text-phantom-gray font-mono">Jenkinsfile</span>
              <button
                onClick={() => copyCode(pipelineExamples[activeExample], activeExample)}
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
            {activeExample === "declarative" && (
              <div>
                <h3 className="font-semibold text-ghost-white mb-2">Declarative Pipeline</h3>
                <p className="text-sm text-phantom-gray">
                  The recommended approach for most use cases. Uses a clean, structured syntax with stages and steps.
                  This example includes deployment stages, BetaForge testing with failure detection, and Slack notifications.
                </p>
              </div>
            )}
            {activeExample === "scripted" && (
              <div>
                <h3 className="font-semibold text-ghost-white mb-2">Scripted Pipeline</h3>
                <p className="text-sm text-phantom-gray">
                  Full Groovy flexibility for complex workflows. Uses the BetaForge CLI for cleaner integration 
                  and archives test results as build artifacts.
                </p>
              </div>
            )}
            {activeExample === "sharedLibrary" && (
              <div>
                <h3 className="font-semibold text-ghost-white mb-2">Shared Library</h3>
                <p className="text-sm text-phantom-gray">
                  Create a reusable <code className="text-electric-cyan">betaforgeTest</code> step that can be used across 
                  all your Jenkins pipelines. Perfect for enforcing consistent testing practices across teams.
                </p>
              </div>
            )}
            {activeExample === "blueOcean" && (
              <div>
                <h3 className="font-semibold text-ghost-white mb-2">Blue Ocean Compatible</h3>
                <p className="text-sm text-phantom-gray">
                  Optimized for Blue Ocean visualization with parallel stages, manual approval gates, 
                  and polling-based status checks for long-running tests.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Environment Variables */}
      <section className="relative py-12 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-ghost-white mb-8 flex items-center gap-3">
            <Terminal className="w-6 h-6 text-quantum-green" />
            Environment Variables
          </h2>

          <div className="bg-void-elevated border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 bg-void-black/50">
                  <th className="text-left px-4 py-3 text-sm font-medium text-phantom-gray">Variable</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-phantom-gray">Description</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-phantom-gray">Required</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "BETAFORGE_API_KEY", desc: "Your BetaForge API key (use credentials binding)", required: true },
                  { name: "BETAFORGE_PROJECT_ID", desc: "The project ID to test against", required: true },
                  { name: "BETAFORGE_TEST_URL", desc: "The URL to test (defaults to staging URL)", required: false },
                  { name: "BETAFORGE_AGENTS", desc: "Comma-separated list of agent names", required: false },
                  { name: "BETAFORGE_TIMEOUT", desc: "Maximum wait time in seconds (default: 600)", required: false },
                  { name: "BETAFORGE_FAIL_ON_CRITICAL", desc: "Fail build on critical bugs (default: true)", required: false },
                ].map((env, i, arr) => (
                  <tr key={env.name} className={i < arr.length - 1 ? "border-b border-white/5" : ""}>
                    <td className="px-4 py-3">
                      <code className="text-xs bg-neural/20 text-neural-bright px-2 py-1 rounded font-mono">{env.name}</code>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-phantom-gray">{env.desc}</span>
                    </td>
                    <td className="px-4 py-3">
                      {env.required ? (
                        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">Required</span>
                      ) : (
                        <span className="text-xs bg-void-black text-phantom-gray px-2 py-1 rounded">Optional</span>
                      )}
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
            <AlertTriangle className="w-6 h-6 text-yellow-400" />
            Troubleshooting
          </h2>

          <div className="space-y-4">
            {[
              {
                problem: "Credentials not found",
                solution: "Ensure the credential ID matches exactly. Check that the credential scope includes your pipeline's folder. Use `withCredentials` block for proper binding.",
              },
              {
                problem: "curl command fails",
                solution: "Make sure `curl` and `jq` are installed on your Jenkins agents. Consider using the HTTP Request plugin instead for better error handling.",
              },
              {
                problem: "Pipeline times out",
                solution: "BetaForge tests can take 5-15 minutes. Increase your stage timeout or use async mode with polling to avoid blocking the executor.",
              },
              {
                problem: "JSON parsing errors",
                solution: "Install the Pipeline Utility Steps plugin for `readJSON`. Alternatively, use `jq` in shell commands to extract values.",
              },
              {
                problem: "Tests not starting",
                solution: "Verify your staging environment is accessible from Jenkins agents. Check firewall rules and DNS resolution.",
              },
            ].map((item) => (
              <div key={item.problem} className="p-4 bg-void-elevated border border-white/5 rounded-xl">
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-ghost-white mb-1">{item.problem}</h3>
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
