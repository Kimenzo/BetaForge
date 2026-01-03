"use client";

import { useState } from "react";
import { Check, Sun, Moon, Monitor } from "lucide-react";

export default function GeneralSettingsPage() {
  const [workspaceName, setWorkspaceName] = useState("Sarah's Workspace");
  const [selectedTheme, setSelectedTheme] = useState<"dark" | "light" | "auto">(
    "dark"
  );
  const [language, setLanguage] = useState("en-US");
  const [timezone, setTimezone] = useState("America/New_York");
  const [notifications, setNotifications] = useState({
    email: true,
    browser: false,
    criticalOnly: false,
    weeklySummary: true,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const themes = [
    { id: "dark" as const, label: "Dark", icon: Moon },
    { id: "light" as const, label: "Light", icon: Sun },
    { id: "auto" as const, label: "Auto", icon: Monitor },
  ];

  return (
    <div className="p-8 max-w-4xl">
      {/* Section Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-white mb-2">General Settings</h1>
        <p className="text-phantom-gray">
          Manage your workspace and preferences
        </p>
      </div>

      {/* Workspace Name */}
      <section className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10 animate-fade-in-up stagger-1">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-1">
            Workspace Name
          </h3>
          <p className="text-sm text-phantom-gray">
            This will be displayed across your dashboard
          </p>
        </div>
        <input
          type="text"
          value={workspaceName}
          onChange={(e) => setWorkspaceName(e.target.value)}
          className="w-full max-w-md h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-neural focus:bg-white/10 transition-all duration-300"
        />
      </section>

      {/* Theme Selection */}
      <section className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10 animate-fade-in-up stagger-2">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-1">Theme</h3>
          <p className="text-sm text-phantom-gray">
            Choose your interface appearance
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {themes.map((theme) => {
            const Icon = theme.icon;
            return (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`relative p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                  selectedTheme === theme.id
                    ? "border-neural bg-neural/5"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <div
                  className={`aspect-video rounded-lg mb-3 flex items-center justify-center ${
                    theme.id === "dark"
                      ? "bg-gradient-to-br from-void-black to-void-elevated border border-white/10"
                      : theme.id === "light"
                      ? "bg-gradient-to-br from-white to-gray-100 border border-gray-200"
                      : "bg-gradient-to-r from-void-black via-gray-500 to-white border border-white/10"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      theme.id === "dark"
                        ? "text-neural-bright"
                        : theme.id === "light"
                        ? "text-gray-600"
                        : "text-gray-400"
                    }`}
                  />
                </div>
                <p className="text-sm font-medium text-white text-center">
                  {theme.label}
                </p>

                {selectedTheme === theme.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-neural flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Language & Region */}
      <section className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10 animate-fade-in-up stagger-3">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-1">
            Language & Region
          </h3>
          <p className="text-sm text-phantom-gray">
            Set your preferred language and time zone
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-phantom-gray mb-2">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-neural transition-all duration-300 appearance-none cursor-pointer"
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="ja">Japanese</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-phantom-gray mb-2">
              Time Zone
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-neural transition-all duration-300 appearance-none cursor-pointer"
            >
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="America/Los_Angeles">
                America/Los_Angeles (PST)
              </option>
              <option value="Europe/London">Europe/London (GMT)</option>
              <option value="Europe/Paris">Europe/Paris (CET)</option>
              <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
              <option value="Australia/Sydney">Australia/Sydney (AEST)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10 animate-fade-in-up stagger-4">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-1">
            Notifications
          </h3>
          <p className="text-sm text-phantom-gray">
            Choose what updates you want to receive
          </p>
        </div>

        <div className="space-y-4">
          {/* Email Notifications */}
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-white">Email Notifications</p>
              <p className="text-sm text-phantom-gray">
                Receive test results and bug reports via email
              </p>
            </div>
            <button
              onClick={() =>
                setNotifications({
                  ...notifications,
                  email: !notifications.email,
                })
              }
              className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${
                notifications.email ? "bg-neural" : "bg-white/20"
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                  notifications.email ? "right-0.5" : "left-0.5"
                }`}
              />
            </button>
          </div>

          {/* Browser Notifications */}
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-white">Browser Notifications</p>
              <p className="text-sm text-phantom-gray">
                Get notified in your browser when tests complete
              </p>
            </div>
            <button
              onClick={() =>
                setNotifications({
                  ...notifications,
                  browser: !notifications.browser,
                })
              }
              className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${
                notifications.browser ? "bg-neural" : "bg-white/20"
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                  notifications.browser ? "right-0.5" : "left-0.5"
                }`}
              />
            </button>
          </div>

          {/* Critical Only */}
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-white">Critical Bugs Only</p>
              <p className="text-sm text-phantom-gray">
                Only notify me about critical severity bugs
              </p>
            </div>
            <button
              onClick={() =>
                setNotifications({
                  ...notifications,
                  criticalOnly: !notifications.criticalOnly,
                })
              }
              className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${
                notifications.criticalOnly ? "bg-neural" : "bg-white/20"
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                  notifications.criticalOnly ? "right-0.5" : "left-0.5"
                }`}
              />
            </button>
          </div>

          {/* Weekly Summary */}
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-white">Weekly Summary</p>
              <p className="text-sm text-phantom-gray">
                Receive a weekly digest of all testing activity
              </p>
            </div>
            <button
              onClick={() =>
                setNotifications({
                  ...notifications,
                  weeklySummary: !notifications.weeklySummary,
                })
              }
              className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${
                notifications.weeklySummary ? "bg-neural" : "bg-white/20"
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                  notifications.weeklySummary ? "right-0.5" : "left-0.5"
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Save Changes */}
      <div className="sticky bottom-0 left-0 right-0 pt-6 pb-4 bg-gradient-to-t from-void-black via-void-black to-transparent">
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            className="h-12 px-8 rounded-xl bg-gradient-to-r from-neural to-electric-cyan text-white font-semibold hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:scale-[1.02] transition-all duration-300"
          >
            Save Changes
          </button>
          <button className="h-12 px-8 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-all duration-300">
            Cancel
          </button>

          {/* Autosave indicator */}
          {saved && (
            <span className="ml-auto text-sm text-phantom-gray flex items-center gap-2 animate-fade-in-up">
              <Check className="w-4 h-4 text-quantum-green" />
              All changes saved
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
