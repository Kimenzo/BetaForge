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
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Key,
  ExternalLink,
  BookOpen,
  Code2,
  Webhook,
  RefreshCw,
  Lock,
  Send,
  Filter,
  Bell,
  Server,
  Hash,
  FileJson,
  ArrowRight,
  Eye,
  Settings,
} from "lucide-react";
import { Footer } from "@/components/layout";

const webhookEvents = [
  {
    name: "session.started",
    description: "Fired when a new test session begins",
    payload: `{
  "event": "session.started",
  "timestamp": "2026-01-03T10:30:00Z",
  "data": {
    "session_id": "sess_abc123xyz",
    "project_id": "proj_def456",
    "project_name": "My App",
    "test_url": "https://staging.myapp.com",
    "agents": ["sarah", "marcus", "diego"],
    "initiated_by": "api",
    "metadata": {
      "commit_sha": "a1b2c3d4",
      "branch": "feature/new-checkout",
      "pull_request": 42
    }
  }
}`,
  },
  {
    name: "session.completed",
    description: "Fired when all agents complete testing",
    payload: `{
  "event": "session.completed",
  "timestamp": "2026-01-03T10:45:00Z",
  "data": {
    "session_id": "sess_abc123xyz",
    "project_id": "proj_def456",
    "status": "completed",
    "duration_seconds": 892,
    "summary": {
      "total_bugs": 7,
      "critical": 0,
      "high": 2,
      "medium": 3,
      "low": 2
    },
    "agents_completed": 3,
    "dashboard_url": "https://app.betaforge.ai/sessions/sess_abc123xyz"
  }
}`,
  },
  {
    name: "bug.found",
    description: "Fired for each bug discovered (real-time)",
    payload: `{
  "event": "bug.found",
  "timestamp": "2026-01-03T10:35:22Z",
  "data": {
    "bug_id": "bug_xyz789",
    "session_id": "sess_abc123xyz",
    "agent": {
      "id": "diego",
      "name": "Diego - Chaos Tester",
      "persona": "chaos"
    },
    "severity": "high",
    "title": "Form submission fails silently on slow network",
    "description": "When submitting the checkout form on a 3G connection, the form appears to submit but no confirmation is shown. The order is not created.",
    "category": "functionality",
    "steps_to_reproduce": [
      "Go to /checkout with items in cart",
      "Enable network throttling (Slow 3G)",
      "Fill out payment form",
      "Click 'Complete Purchase'",
      "Observe no feedback and order not created"
    ],
    "expected_behavior": "Loading indicator should appear and order should complete or show error",
    "actual_behavior": "Button becomes disabled briefly, then re-enables with no feedback",
    "screenshot_url": "https://cdn.betaforge.ai/screenshots/bug_xyz789.png",
    "video_url": "https://cdn.betaforge.ai/videos/bug_xyz789.mp4",
    "page_url": "https://staging.myapp.com/checkout",
    "viewport": { "width": 1920, "height": 1080 },
    "browser": { "name": "Chrome", "version": "120.0" }
  }
}`,
  },
  {
    name: "agent.completed",
    description: "Fired when an individual agent finishes testing",
    payload: `{
  "event": "agent.completed",
  "timestamp": "2026-01-03T10:38:45Z",
  "data": {
    "session_id": "sess_abc123xyz",
    "agent": {
      "id": "sarah",
      "name": "Sarah - Cautious Explorer",
      "persona": "cautious"
    },
    "duration_seconds": 524,
    "pages_visited": 12,
    "actions_performed": 47,
    "bugs_found": 3,
    "bugs_by_severity": {
      "critical": 0,
      "high": 1,
      "medium": 1,
      "low": 1
    }
  }
}`,
  },
  {
    name: "session.failed",
    description: "Fired if session encounters an error",
    payload: `{
  "event": "session.failed",
  "timestamp": "2026-01-03T10:31:05Z",
  "data": {
    "session_id": "sess_abc123xyz",
    "project_id": "proj_def456",
    "error": {
      "code": "URL_UNREACHABLE",
      "message": "Unable to connect to https://staging.myapp.com - Connection refused",
      "retries_attempted": 3
    },
    "partial_results": false
  }
}`,
  },
];

const securityExample = `const crypto = require('crypto');

// Your webhook secret from BetaForge dashboard
const WEBHOOK_SECRET = process.env.BETAFORGE_WEBHOOK_SECRET;

function verifySignature(payload, signature) {
  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload, 'utf8')
    .digest('hex');
  
  const expectedSig = \`sha256=\${expectedSignature}\`;
  
  // Use timing-safe comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSig)
  );
}

// Express.js example
app.post('/webhooks/betaforge', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-betaforge-signature'];
  const payload = req.body.toString();
  
  if (!verifySignature(payload, signature)) {
    console.error('Invalid webhook signature');
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  const event = JSON.parse(payload);
  
  // Process the webhook
  switch (event.event) {
    case 'session.completed':
      handleSessionCompleted(event.data);
      break;
    case 'bug.found':
      handleBugFound(event.data);
      break;
    // ... handle other events
  }
  
  // Always return 200 quickly to acknowledge receipt
  res.status(200).json({ received: true });
});`;

const languageExamples = {
  node: `// Node.js / Express
const express = require('express');
const crypto = require('crypto');
const app = express();

const WEBHOOK_SECRET = process.env.BETAFORGE_WEBHOOK_SECRET;

app.post('/webhooks/betaforge', 
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    // Verify signature
    const signature = req.headers['x-betaforge-signature'];
    const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
    const digest = 'sha256=' + hmac.update(req.body).digest('hex');
    
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))) {
      return res.status(401).send('Invalid signature');
    }
    
    const event = JSON.parse(req.body);
    console.log('Received:', event.event);
    
    // Handle event
    if (event.event === 'bug.found' && event.data.severity === 'critical') {
      await notifyTeam(event.data);
    }
    
    res.json({ received: true });
  }
);

app.listen(3000);`,

  python: `# Python / FastAPI
from fastapi import FastAPI, Request, HTTPException
import hmac
import hashlib
import os

app = FastAPI()
WEBHOOK_SECRET = os.environ.get("BETAFORGE_WEBHOOK_SECRET")

def verify_signature(payload: bytes, signature: str) -> bool:
    expected = hmac.new(
        WEBHOOK_SECRET.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature)

@app.post("/webhooks/betaforge")
async def handle_webhook(request: Request):
    payload = await request.body()
    signature = request.headers.get("x-betaforge-signature", "")
    
    if not verify_signature(payload, signature):
        raise HTTPException(status_code=401, detail="Invalid signature")
    
    event = await request.json()
    event_type = event.get("event")
    
    if event_type == "session.completed":
        await handle_session_completed(event["data"])
    elif event_type == "bug.found":
        await handle_bug_found(event["data"])
    
    return {"received": True}`,

  go: `// Go
package main

import (
    "crypto/hmac"
    "crypto/sha256"
    "encoding/hex"
    "encoding/json"
    "io"
    "net/http"
    "os"
)

var webhookSecret = os.Getenv("BETAFORGE_WEBHOOK_SECRET")

func verifySignature(payload []byte, signature string) bool {
    mac := hmac.New(sha256.New, []byte(webhookSecret))
    mac.Write(payload)
    expected := "sha256=" + hex.EncodeToString(mac.Sum(nil))
    return hmac.Equal([]byte(signature), []byte(expected))
}

func webhookHandler(w http.ResponseWriter, r *http.Request) {
    payload, _ := io.ReadAll(r.Body)
    signature := r.Header.Get("X-BetaForge-Signature")
    
    if !verifySignature(payload, signature) {
        http.Error(w, "Invalid signature", http.StatusUnauthorized)
        return
    }
    
    var event map[string]interface{}
    json.Unmarshal(payload, &event)
    
    eventType := event["event"].(string)
    switch eventType {
    case "session.completed":
        handleSessionCompleted(event["data"])
    case "bug.found":
        handleBugFound(event["data"])
    }
    
    w.Header().Set("Content-Type", "application/json")
    w.Write([]byte(\`{"received": true}\`))
}

func main() {
    http.HandleFunc("/webhooks/betaforge", webhookHandler)
    http.ListenAndServe(":3000", nil)
}`,

  php: `<?php
// PHP / Laravel

namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;

class BetaForgeWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $payload = $request->getContent();
        $signature = $request->header('X-BetaForge-Signature');
        $secret = config('services.betaforge.webhook_secret');
        
        // Verify signature
        $expected = 'sha256=' . hash_hmac('sha256', $payload, $secret);
        
        if (!hash_equals($expected, $signature)) {
            return response()->json(['error' => 'Invalid signature'], 401);
        }
        
        $event = json_decode($payload, true);
        
        switch ($event['event']) {
            case 'session.completed':
                $this->handleSessionCompleted($event['data']);
                break;
            case 'bug.found':
                $this->handleBugFound($event['data']);
                break;
        }
        
        return response()->json(['received' => true]);
    }
    
    private function handleBugFound($data)
    {
        if ($data['severity'] === 'critical') {
            // Create Jira ticket, send Slack alert, etc.
            \\Notification::send(
                $this->getTeam(),
                new CriticalBugFound($data)
            );
        }
    }
}`,
};

export default function WebhooksIntegrationPage() {
  const [selectedEvent, setSelectedEvent] = useState(webhookEvents[0]);
  const [selectedLanguage, setSelectedLanguage] = useState<
    "node" | "python" | "go" | "php"
  >("node");
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
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-neural/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-electric-cyan/10 rounded-full blur-[100px]" />
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
            <span className="text-ghost-white">Webhooks</span>
          </div>

          {/* Hero */}
          <div className="flex items-start gap-6 mb-12">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-neural to-electric-cyan border border-neural/30">
              <Webhook className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-ghost-white">
                  Webhooks
                </h1>
              </div>
              <p className="text-lg text-phantom-gray mb-6">
                Receive real-time notifications when test sessions complete,
                bugs are found, or errors occur. Build custom integrations with
                any system using our webhook API.
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="/settings/api"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-neural to-electric-cyan text-white font-semibold hover:shadow-glow transition-all"
                >
                  Configure Webhooks
                  <Settings className="w-4 h-4" />
                </Link>
                <Link
                  href="/docs/api"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-ghost-white font-medium hover:border-neural/30 transition-all"
                >
                  API Reference
                  <Code2 className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="p-4 bg-void-elevated border border-white/5 rounded-xl">
              <Zap className="w-6 h-6 text-electric-cyan mb-2" />
              <h3 className="font-semibold text-ghost-white text-sm">
                Real-time
              </h3>
              <p className="text-xs text-phantom-gray">
                Events delivered instantly
              </p>
            </div>
            <div className="p-4 bg-void-elevated border border-white/5 rounded-xl">
              <Shield className="w-6 h-6 text-quantum-green mb-2" />
              <h3 className="font-semibold text-ghost-white text-sm">
                HMAC Signed
              </h3>
              <p className="text-xs text-phantom-gray">
                SHA-256 signature verification
              </p>
            </div>
            <div className="p-4 bg-void-elevated border border-white/5 rounded-xl">
              <RefreshCw className="w-6 h-6 text-neural-bright mb-2" />
              <h3 className="font-semibold text-ghost-white text-sm">
                Auto Retry
              </h3>
              <p className="text-xs text-phantom-gray">
                Exponential backoff on failure
              </p>
            </div>
            <div className="p-4 bg-void-elevated border border-white/5 rounded-xl">
              <Filter className="w-6 h-6 text-plasma-pink mb-2" />
              <h3 className="font-semibold text-ghost-white text-sm">
                Event Filtering
              </h3>
              <p className="text-xs text-phantom-gray">
                Subscribe to specific events
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Setup */}
      <section className="relative py-12 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-ghost-white mb-8 flex items-center gap-3">
            <Zap className="w-6 h-6 text-electric-cyan" />
            Quick Setup
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="relative p-5 bg-void-elevated border border-white/5 rounded-xl">
              <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-neural flex items-center justify-center text-white font-bold text-xs">
                1
              </div>
              <Server className="w-6 h-6 text-neural-bright mb-3" />
              <h3 className="font-semibold text-ghost-white mb-1">
                Create Endpoint
              </h3>
              <p className="text-xs text-phantom-gray">
                Set up an HTTPS endpoint on your server to receive webhooks
              </p>
            </div>

            <div className="relative p-5 bg-void-elevated border border-white/5 rounded-xl">
              <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-neural flex items-center justify-center text-white font-bold text-xs">
                2
              </div>
              <Settings className="w-6 h-6 text-neural-bright mb-3" />
              <h3 className="font-semibold text-ghost-white mb-1">
                Configure Webhook
              </h3>
              <p className="text-xs text-phantom-gray">
                Add your URL in Settings → API → Webhooks
              </p>
            </div>

            <div className="relative p-5 bg-void-elevated border border-white/5 rounded-xl">
              <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-neural flex items-center justify-center text-white font-bold text-xs">
                3
              </div>
              <Key className="w-6 h-6 text-neural-bright mb-3" />
              <h3 className="font-semibold text-ghost-white mb-1">
                Copy Secret
              </h3>
              <p className="text-xs text-phantom-gray">
                Save the signing secret to verify webhook authenticity
              </p>
            </div>

            <div className="relative p-5 bg-void-elevated border border-white/5 rounded-xl">
              <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-neural flex items-center justify-center text-white font-bold text-xs">
                4
              </div>
              <CheckCircle2 className="w-6 h-6 text-neural-bright mb-3" />
              <h3 className="font-semibold text-ghost-white mb-1">Test & Go</h3>
              <p className="text-xs text-phantom-gray">
                Use the test button to send a sample payload
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Webhook Events */}
      <section className="relative py-12 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-ghost-white mb-8 flex items-center gap-3">
            <Bell className="w-6 h-6 text-plasma-pink" />
            Webhook Events
          </h2>

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Event List */}
            <div className="lg:col-span-2 space-y-2">
              {webhookEvents.map((event) => (
                <button
                  key={event.name}
                  onClick={() => setSelectedEvent(event)}
                  className={`w-full p-4 text-left rounded-xl border transition-all ${
                    selectedEvent.name === event.name
                      ? "bg-neural/10 border-neural/30"
                      : "bg-void-elevated border-white/5 hover:border-white/10"
                  }`}
                >
                  <code className="text-sm text-electric-cyan">
                    {event.name}
                  </code>
                  <p className="text-xs text-phantom-gray mt-1">
                    {event.description}
                  </p>
                </button>
              ))}
            </div>

            {/* Payload Preview */}
            <div className="lg:col-span-3 bg-void-elevated border border-white/5 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-void-black/50">
                <div className="flex items-center gap-2">
                  <FileJson className="w-4 h-4 text-phantom-gray" />
                  <span className="text-sm text-ghost-white font-mono">
                    {selectedEvent.name}
                  </span>
                </div>
                <button
                  onClick={() =>
                    copyCode(selectedEvent.payload, selectedEvent.name)
                  }
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-phantom-gray hover:text-ghost-white transition-colors rounded-lg hover:bg-white/5"
                >
                  {copied === selectedEvent.name ? (
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
              <pre className="p-4 overflow-x-auto max-h-[500px]">
                <code className="text-xs text-phantom-gray font-mono whitespace-pre">
                  {selectedEvent.payload}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="relative py-12 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-ghost-white mb-8 flex items-center gap-3">
            <Shield className="w-6 h-6 text-quantum-green" />
            Security & Verification
          </h2>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-ghost-white mb-4">
                HMAC Signature Verification
              </h3>
              <p className="text-phantom-gray mb-4">
                Every webhook request includes an{" "}
                <code className="px-1.5 py-0.5 bg-void-black rounded text-electric-cyan">
                  X-BetaForge-Signature
                </code>{" "}
                header containing an HMAC-SHA256 signature of the payload.
                Always verify this signature before processing webhooks.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-quantum-green mt-0.5" />
                  <p className="text-sm text-phantom-gray">
                    Use timing-safe comparison to prevent timing attacks
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-quantum-green mt-0.5" />
                  <p className="text-sm text-phantom-gray">
                    Reject requests with missing or invalid signatures
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-quantum-green mt-0.5" />
                  <p className="text-sm text-phantom-gray">
                    Store your webhook secret securely (env vars, secrets
                    manager)
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-quantum-green mt-0.5" />
                  <p className="text-sm text-phantom-gray">
                    Rotate secrets periodically for enhanced security
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-ghost-white mb-4">
                Request Headers
              </h3>
              <div className="bg-void-elevated border border-white/5 rounded-xl overflow-hidden">
                <table className="w-full">
                  <tbody>
                    {[
                      {
                        name: "X-BetaForge-Signature",
                        value: "sha256=abc123...",
                        desc: "HMAC signature",
                      },
                      {
                        name: "X-BetaForge-Event",
                        value: "session.completed",
                        desc: "Event type",
                      },
                      {
                        name: "X-BetaForge-Delivery",
                        value: "dlv_xyz789",
                        desc: "Unique delivery ID",
                      },
                      {
                        name: "X-BetaForge-Timestamp",
                        value: "1704276600",
                        desc: "Unix timestamp",
                      },
                      {
                        name: "Content-Type",
                        value: "application/json",
                        desc: "Always JSON",
                      },
                    ].map((header, i) => (
                      <tr
                        key={header.name}
                        className={i < 4 ? "border-b border-white/5" : ""}
                      >
                        <td className="px-4 py-2">
                          <code className="text-xs text-electric-cyan">
                            {header.name}
                          </code>
                        </td>
                        <td className="px-4 py-2">
                          <code className="text-xs text-mist-gray">
                            {header.value}
                          </code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="relative py-12 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-ghost-white mb-8 flex items-center gap-3">
            <Code2 className="w-6 h-6 text-electric-cyan" />
            Implementation Examples
          </h2>

          {/* Language Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { id: "node", label: "Node.js" },
              { id: "python", label: "Python" },
              { id: "go", label: "Go" },
              { id: "php", label: "PHP" },
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() =>
                  setSelectedLanguage(lang.id as typeof selectedLanguage)
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedLanguage === lang.id
                    ? "bg-neural/20 text-ghost-white border border-neural/30"
                    : "bg-void-elevated text-phantom-gray border border-white/5 hover:border-white/10"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* Code Block */}
          <div className="relative bg-void-elevated border border-white/5 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-void-black/50">
              <span className="text-sm text-phantom-gray font-mono">
                webhook-handler.
                {selectedLanguage === "node"
                  ? "js"
                  : selectedLanguage === "python"
                  ? "py"
                  : selectedLanguage === "go"
                  ? "go"
                  : "php"}
              </span>
              <button
                onClick={() =>
                  copyCode(
                    languageExamples[selectedLanguage],
                    `lang-${selectedLanguage}`
                  )
                }
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-phantom-gray hover:text-ghost-white transition-colors rounded-lg hover:bg-white/5"
              >
                {copied === `lang-${selectedLanguage}` ? (
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
                {languageExamples[selectedLanguage]}
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* Retry Policy */}
      <section className="relative py-12 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-ghost-white mb-8 flex items-center gap-3">
            <RefreshCw className="w-6 h-6 text-neural-bright" />
            Retry Policy
          </h2>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="p-6 bg-void-elevated border border-white/5 rounded-xl">
              <h3 className="font-semibold text-ghost-white mb-4">
                Automatic Retries
              </h3>
              <p className="text-sm text-phantom-gray mb-4">
                If your endpoint returns a non-2xx status code or times out,
                we'll automatically retry the webhook with exponential backoff.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-sm text-phantom-gray">Retry 1</span>
                  <span className="text-sm text-ghost-white">
                    After 1 minute
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-sm text-phantom-gray">Retry 2</span>
                  <span className="text-sm text-ghost-white">
                    After 5 minutes
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-sm text-phantom-gray">Retry 3</span>
                  <span className="text-sm text-ghost-white">
                    After 30 minutes
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-sm text-phantom-gray">Retry 4</span>
                  <span className="text-sm text-ghost-white">
                    After 2 hours
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-phantom-gray">
                    Retry 5 (final)
                  </span>
                  <span className="text-sm text-ghost-white">
                    After 24 hours
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-void-elevated border border-white/5 rounded-xl">
              <h3 className="font-semibold text-ghost-white mb-4">
                Best Practices
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-electric-cyan mt-0.5" />
                  <div>
                    <p className="text-sm text-ghost-white font-medium">
                      Respond quickly
                    </p>
                    <p className="text-xs text-phantom-gray">
                      Return 200 within 30 seconds to avoid timeouts
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Terminal className="w-5 h-5 text-electric-cyan mt-0.5" />
                  <div>
                    <p className="text-sm text-ghost-white font-medium">
                      Process asynchronously
                    </p>
                    <p className="text-xs text-phantom-gray">
                      Queue webhooks for background processing if needed
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Hash className="w-5 h-5 text-electric-cyan mt-0.5" />
                  <div>
                    <p className="text-sm text-ghost-white font-medium">
                      Handle duplicates
                    </p>
                    <p className="text-xs text-phantom-gray">
                      Use delivery ID for idempotency checks
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Eye className="w-5 h-5 text-electric-cyan mt-0.5" />
                  <div>
                    <p className="text-sm text-ghost-white font-medium">
                      Monitor delivery
                    </p>
                    <p className="text-xs text-phantom-gray">
                      Check webhook logs in dashboard for failures
                    </p>
                  </div>
                </div>
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
                error: "Webhook not received",
                solution:
                  "Check that your endpoint is publicly accessible over HTTPS. Local development servers (localhost) won't work - use a tunneling service like ngrok for testing.",
              },
              {
                error: "Signature verification failed",
                solution:
                  "Ensure you're using the raw request body (not parsed JSON) when computing the HMAC. Check that your webhook secret matches exactly (no extra whitespace).",
              },
              {
                error: "Timeouts on delivery",
                solution:
                  "Your endpoint must respond within 30 seconds. Acknowledge the webhook immediately with 200, then process the payload asynchronously.",
              },
              {
                error: "Missing events",
                solution:
                  "Check your event filter settings in the dashboard. By default, all events are sent. Verify the webhook is enabled and not paused.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-4 bg-void-elevated border border-white/5 rounded-xl"
              >
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-plasma-pink mt-0.5" />
                  <div>
                    <p className="font-medium text-ghost-white mb-2">
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
