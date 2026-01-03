"use client";

import { useState } from "react";
import {
  SlidersHorizontal,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  Database,
  FileJson,
  Clock,
  RefreshCw,
  Check,
  Archive,
  Zap,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

export default function AdvancedSettingsPage() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [exportLoading, setExportLoading] = useState(false);
  const [settings, setSettings] = useState({
    autoArchive: true,
    autoArchiveDays: 30,
    parallelAgents: true,
    detailedLogs: false,
    betaFeatures: false,
    webhookRetries: 3,
    sessionTimeout: 60,
  });

  const handleExportData = () => {
    setExportLoading(true);
    setTimeout(() => {
      setExportLoading(false);
      // Would trigger download
    }, 2000);
  };

  const handleDeleteWorkspace = () => {
    if (deleteConfirmText === "delete my workspace") {
      // Would call API to delete
      console.log("Deleting workspace...");
    }
  };

  const toggleSetting = (key: keyof typeof settings) => {
    if (typeof settings[key] === "boolean") {
      setSettings({ ...settings, [key]: !settings[key] });
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      {/* Section Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-white mb-2">Advanced</h1>
        <p className="text-phantom-gray">
          Configure advanced settings and data management
        </p>
      </div>

      {/* Performance Settings */}
      <section className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10 animate-fade-in-up stagger-1">
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-5 h-5 text-neural-bright" />
          <h3 className="text-lg font-semibold text-white">Performance</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <div>
              <h4 className="text-white font-medium mb-1">
                Parallel Agent Execution
              </h4>
              <p className="text-sm text-phantom-gray">
                Run multiple agents simultaneously for faster testing
              </p>
            </div>
            <button
              onClick={() => toggleSetting("parallelAgents")}
              className="text-2xl"
            >
              {settings.parallelAgents ? (
                <ToggleRight className="w-8 h-8 text-quantum-green" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-phantom-gray" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <div>
              <h4 className="text-white font-medium mb-1">Detailed Logging</h4>
              <p className="text-sm text-phantom-gray">
                Enable verbose logging for debugging (may impact performance)
              </p>
            </div>
            <button
              onClick={() => toggleSetting("detailedLogs")}
              className="text-2xl"
            >
              {settings.detailedLogs ? (
                <ToggleRight className="w-8 h-8 text-quantum-green" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-phantom-gray" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <div>
              <h4 className="text-white font-medium mb-1">Session Timeout</h4>
              <p className="text-sm text-phantom-gray">
                Maximum duration for a single test session
              </p>
            </div>
            <select
              value={settings.sessionTimeout}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  sessionTimeout: parseInt(e.target.value),
                })
              }
              className="h-10 px-4 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-neural transition-all appearance-none cursor-pointer"
            >
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
              <option value={240}>4 hours</option>
            </select>
          </div>
        </div>
      </section>

      {/* Data Management */}
      <section className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10 animate-fade-in-up stagger-2">
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-5 h-5 text-neural-bright" />
          <h3 className="text-lg font-semibold text-white">Data Management</h3>
        </div>

        <div className="space-y-4">
          {/* Auto Archive */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <div>
              <h4 className="text-white font-medium mb-1">
                Auto-Archive Old Reports
              </h4>
              <p className="text-sm text-phantom-gray">
                Automatically archive bug reports older than specified days
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={settings.autoArchiveDays}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    autoArchiveDays: parseInt(e.target.value),
                  })
                }
                disabled={!settings.autoArchive}
                className="h-10 px-4 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-neural transition-all appearance-none cursor-pointer disabled:opacity-50"
              >
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={30}>30 days</option>
                <option value={60}>60 days</option>
                <option value={90}>90 days</option>
              </select>
              <button
                onClick={() => toggleSetting("autoArchive")}
                className="text-2xl"
              >
                {settings.autoArchive ? (
                  <ToggleRight className="w-8 h-8 text-quantum-green" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-phantom-gray" />
                )}
              </button>
            </div>
          </div>

          {/* Export Data */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-white font-medium mb-1">Export All Data</h4>
                <p className="text-sm text-phantom-gray">
                  Download all your projects, sessions, and reports as JSON
                </p>
              </div>
              <button
                onClick={handleExportData}
                disabled={exportLoading}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {exportLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Export
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Import Data */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-white font-medium mb-1">Import Data</h4>
                <p className="text-sm text-phantom-gray">
                  Import projects and settings from a JSON export
                </p>
              </div>
              <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Import
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Beta Features */}
      <section className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-neural/10 to-electric-cyan/10 border border-neural/20 animate-fade-in-up stagger-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-neural-bright" />
            <div>
              <h3 className="text-lg font-semibold text-white">Beta Features</h3>
              <p className="text-sm text-phantom-gray">
                Try experimental features before they're released
              </p>
            </div>
          </div>
          <button
            onClick={() => toggleSetting("betaFeatures")}
            className="text-2xl"
          >
            {settings.betaFeatures ? (
              <ToggleRight className="w-8 h-8 text-neural-bright" />
            ) : (
              <ToggleLeft className="w-8 h-8 text-phantom-gray" />
            )}
          </button>
        </div>
        {settings.betaFeatures && (
          <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-500/80">
              Beta features may be unstable or change without notice. Use at
              your own risk.
            </p>
          </div>
        )}
      </section>

      {/* Webhook Settings */}
      <section className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10 animate-fade-in-up stagger-4">
        <div className="flex items-center gap-3 mb-6">
          <RefreshCw className="w-5 h-5 text-neural-bright" />
          <h3 className="text-lg font-semibold text-white">Webhooks</h3>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
          <div>
            <h4 className="text-white font-medium mb-1">
              Webhook Retry Attempts
            </h4>
            <p className="text-sm text-phantom-gray">
              Number of times to retry failed webhook deliveries
            </p>
          </div>
          <select
            value={settings.webhookRetries}
            onChange={(e) =>
              setSettings({
                ...settings,
                webhookRetries: parseInt(e.target.value),
              })
            }
            className="h-10 px-4 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-neural transition-all appearance-none cursor-pointer"
          >
            <option value={0}>No retries</option>
            <option value={1}>1 retry</option>
            <option value={3}>3 retries</option>
            <option value={5}>5 retries</option>
          </select>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="p-6 rounded-2xl bg-plasma-pink/5 border border-plasma-pink/20 animate-fade-in-up stagger-5">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-5 h-5 text-plasma-pink" />
          <h3 className="text-lg font-semibold text-plasma-pink">Danger Zone</h3>
        </div>

        <div className="p-4 rounded-xl bg-plasma-pink/5 border border-plasma-pink/20">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-white font-medium mb-1">Delete Workspace</h4>
              <p className="text-sm text-phantom-gray">
                Permanently delete your workspace and all associated data. This
                action cannot be undone.
              </p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 rounded-lg border border-plasma-pink/30 text-plasma-pink font-medium hover:bg-plasma-pink/10 transition-all flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </section>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100]">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
          <div className="relative w-full max-w-md p-6 bg-void-elevated rounded-2xl border border-white/10 pointer-events-auto">
            <div className="w-12 h-12 rounded-xl bg-plasma-pink/20 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-plasma-pink" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Delete Workspace?
            </h3>
            <p className="text-phantom-gray mb-4">
              This will permanently delete your workspace, including:
            </p>
            <ul className="text-sm text-phantom-gray mb-4 space-y-1">
              <li>• All projects and test sessions</li>
              <li>• All bug reports and analytics data</li>
              <li>• All API keys and integrations</li>
              <li>• All team members will lose access</li>
            </ul>
            <p className="text-sm text-phantom-gray mb-4">
              Type{" "}
              <span className="text-plasma-pink font-medium">
                delete my workspace
              </span>{" "}
              to confirm:
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="delete my workspace"
              className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white mb-6 focus:outline-none focus:border-plasma-pink transition-all"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText("");
                }}
                className="flex-1 py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteWorkspace}
                disabled={deleteConfirmText !== "delete my workspace"}
                className="flex-1 py-3 rounded-xl bg-plasma-pink text-white font-medium hover:bg-plasma-pink/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Permanently
              </button>
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}
