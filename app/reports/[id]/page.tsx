import Link from "next/link";
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  ImageIcon,
  Terminal,
  Globe,
  Clock,
  User,
  Copy,
  ExternalLink,
} from "lucide-react";

interface ReportPageProps {
  params: Promise<{ id: string }>;
}

export default async function ReportDetailPage({ params }: ReportPageProps) {
  const { id } = await params;

  // TODO: Fetch report from database
  const report = {
    id,
    title: "Form validation error not displayed",
    severity: "high" as const,
    status: "open",
    description:
      "When submitting the signup form with an invalid email, no error message is shown to the user. The form appears to do nothing, leaving the user confused.",
    reproductionSteps: [
      "Navigate to /signup",
      "Enter 'test' in the email field (invalid format)",
      "Enter a valid password",
      "Click the 'Sign Up' button",
      "Observe: No error message appears",
    ],
    expectedBehavior: "An error message should appear indicating the email format is invalid.",
    actualBehavior: "The form does nothing. No error message, no loading state, no feedback.",
    agent: "Sarah",
    agentColor: "#8B5CF6",
    project: "E-commerce App",
    environment: {
      browser: "Chrome 120",
      os: "Windows 11",
      viewport: "1920x1080",
    },
    consoleErrors: [
      { type: "error", message: "Uncaught TypeError: Cannot read property 'value' of null at validateForm (form.js:42)" },
    ],
    createdAt: "2 hours ago",
  };

  const severityConfig = {
    critical: {
      label: "CRITICAL",
      color: "text-crimson-red",
      bg: "bg-crimson-red/10",
      border: "border-crimson-red/20",
      icon: <AlertTriangle className="w-5 h-5" />,
    },
    high: {
      label: "HIGH",
      color: "text-ember-orange",
      bg: "bg-ember-orange/10",
      border: "border-ember-orange/20",
      icon: <AlertTriangle className="w-5 h-5" />,
    },
    medium: {
      label: "MEDIUM",
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
      icon: <AlertTriangle className="w-5 h-5" />,
    },
    low: {
      label: "LOW",
      color: "text-mist-gray",
      bg: "bg-mist-gray/10",
      border: "border-mist-gray/20",
      icon: <AlertTriangle className="w-5 h-5" />,
    },
  };

  const severity = severityConfig[report.severity];

  return (
    <div className="min-h-screen bg-void-black">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-ember-orange/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-neural/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto p-8">
        {/* Back Link */}
        <Link
          href="/dashboard/reports"
          className="inline-flex items-center gap-2 text-phantom-gray hover:text-ghost-white transition-colors group mb-8"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Reports
        </Link>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8 animate-fade-in-up">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold ${severity.bg} ${severity.color} ${severity.border} border`}
              >
                {severity.icon}
                {severity.label}
              </span>
              <span
                className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                  report.status === "open"
                    ? "bg-crimson-red/10 text-crimson-red border border-crimson-red/20"
                    : "bg-quantum-green/10 text-quantum-green border border-quantum-green/20"
                }`}
              >
                {report.status.toUpperCase()}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-ghost-white mb-4">{report.title}</h1>
            
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-phantom-gray">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
                  style={{ backgroundColor: `${report.agentColor}20` }}
                >
                  🔍
                </div>
                <span>Reported by <span className="text-ghost-white">{report.agent}</span></span>
              </div>
              <span className="w-1 h-1 rounded-full bg-mist-gray" />
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{report.createdAt}</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-mist-gray" />
              <span className="text-neural-bright">{report.project}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 rounded-xl bg-void-elevated border border-white/5 text-phantom-gray hover:text-ghost-white hover:border-white/10 transition-all">
              <Copy className="w-4 h-4" />
            </button>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-quantum-green text-void-black font-semibold hover:bg-quantum-green/90 transition-all">
              <CheckCircle2 className="w-4 h-4" />
              Mark as Fixed
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <section className="glass rounded-2xl p-6 border border-white/5 animate-fade-in-up stagger-1">
              <h2 className="text-lg font-semibold text-ghost-white mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-neural-bright" />
                Description
              </h2>
              <p className="text-phantom-gray leading-relaxed">{report.description}</p>
            </section>

            {/* Reproduction Steps */}
            <section className="glass rounded-2xl p-6 border border-white/5 animate-fade-in-up stagger-2">
              <h2 className="text-lg font-semibold text-ghost-white mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-electric-cyan" />
                Reproduction Steps
              </h2>
              <ol className="space-y-3">
                {report.reproductionSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-void-elevated flex items-center justify-center text-xs font-medium text-phantom-gray">
                      {i + 1}
                    </span>
                    <span className="text-phantom-gray pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            {/* Expected vs Actual */}
            <div className="grid md:grid-cols-2 gap-4 animate-fade-in-up stagger-3">
              <div className="glass rounded-2xl p-5 border border-quantum-green/20">
                <h3 className="font-semibold text-quantum-green mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Expected Behavior
                </h3>
                <p className="text-sm text-phantom-gray">{report.expectedBehavior}</p>
              </div>
              <div className="glass rounded-2xl p-5 border border-crimson-red/20">
                <h3 className="font-semibold text-crimson-red mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Actual Behavior
                </h3>
                <p className="text-sm text-phantom-gray">{report.actualBehavior}</p>
              </div>
            </div>

            {/* Screenshots */}
            <section className="glass rounded-2xl p-6 border border-white/5 animate-fade-in-up stagger-4">
              <h2 className="text-lg font-semibold text-ghost-white mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-mist-gray" />
                Screenshots
              </h2>
              <div className="rounded-xl bg-void-elevated border border-white/5 p-8 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-void-surface flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-mist-gray" />
                </div>
                <p className="text-sm text-phantom-gray">Screenshots will appear here when available.</p>
              </div>
            </section>

            {/* Console Errors */}
            <section className="glass rounded-2xl p-6 border border-white/5 animate-fade-in-up stagger-5">
              <h2 className="text-lg font-semibold text-ghost-white mb-4 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-mist-gray" />
                Console Errors
              </h2>
              <div className="rounded-xl bg-void-black border border-white/5 p-4 font-mono text-sm overflow-x-auto">
                {report.consoleErrors.map((err, i) => (
                  <div key={i} className="text-crimson-red flex items-start gap-2">
                    <span className="text-mist-gray select-none">[{err.type}]</span>
                    <span>{err.message}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Environment */}
            <section className="glass rounded-2xl p-6 border border-white/5 animate-fade-in-up stagger-2">
              <h2 className="text-lg font-semibold text-ghost-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-mist-gray" />
                Environment
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-mist-gray uppercase tracking-wider mb-1">Browser</p>
                  <p className="text-ghost-white">{report.environment.browser}</p>
                </div>
                <div>
                  <p className="text-xs text-mist-gray uppercase tracking-wider mb-1">Operating System</p>
                  <p className="text-ghost-white">{report.environment.os}</p>
                </div>
                <div>
                  <p className="text-xs text-mist-gray uppercase tracking-wider mb-1">Viewport</p>
                  <p className="text-ghost-white font-mono">{report.environment.viewport}</p>
                </div>
              </div>
            </section>

            {/* Agent Info */}
            <section className="glass rounded-2xl p-6 border border-white/5 animate-fade-in-up stagger-3">
              <h2 className="text-lg font-semibold text-ghost-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-mist-gray" />
                Discovered By
              </h2>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                  style={{ backgroundColor: `${report.agentColor}20` }}
                >
                  🔍
                </div>
                <div>
                  <p className="font-medium text-ghost-white">{report.agent}</p>
                  <p className="text-sm text-phantom-gray">The Cautious Explorer</p>
                </div>
              </div>
            </section>

            {/* Quick Actions */}
            <section className="glass rounded-2xl p-6 border border-white/5 animate-fade-in-up stagger-4">
              <h2 className="text-lg font-semibold text-ghost-white mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-void-elevated hover:bg-void-elevated/80 transition-colors text-left">
                  <ExternalLink className="w-4 h-4 text-phantom-gray" />
                  <span className="text-ghost-white">Open in Project</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-void-elevated hover:bg-void-elevated/80 transition-colors text-left">
                  <Copy className="w-4 h-4 text-phantom-gray" />
                  <span className="text-ghost-white">Copy Report Link</span>
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
