"use client";

import { useState } from "react";
import {
  Shield,
  Check,
  X,
  Eye,
  EyeOff,
  Smartphone,
  MessageSquare,
  AlertTriangle,
  Monitor,
  Laptop,
  Info,
} from "lucide-react";

export default function SecuritySettingsPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [saved, setSaved] = useState(false);

  const securityScore = 75;
  const sessions = [
    {
      id: 1,
      device: 'MacBook Pro 16"',
      icon: Laptop,
      location: "San Francisco, CA",
      browser: "Chrome",
      lastActive: "Now",
      current: true,
    },
    {
      id: 2,
      device: "iPhone 14 Pro",
      icon: Smartphone,
      location: "San Francisco, CA",
      browser: "Safari",
      lastActive: "2 hours ago",
      current: false,
    },
    {
      id: 3,
      device: "Windows Desktop",
      icon: Monitor,
      location: "New York, NY",
      browser: "Firefox",
      lastActive: "3 days ago",
      current: false,
    },
  ];

  // Password strength
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const newPasswordStrength = getPasswordStrength(passwords.new);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8 max-w-4xl">
      {/* Section Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-white mb-2">Security</h1>
        <p className="text-phantom-gray">
          Manage your account security and privacy
        </p>
      </div>

      {/* Security Score Card */}
      <section className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-neural/10 to-electric-cyan/10 border border-neural/20 animate-fade-in-up stagger-1">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">
              Security Score
            </h3>
            <p className="text-sm text-phantom-gray">
              Your account security health
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-white mb-1">
              {securityScore}%
            </div>
            <p
              className={`text-sm ${
                securityScore >= 80
                  ? "text-quantum-green"
                  : securityScore >= 50
                  ? "text-yellow-500"
                  : "text-crimson-red"
              }`}
            >
              {securityScore >= 80
                ? "Strong"
                : securityScore >= 50
                ? "Medium"
                : "Weak"}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-4">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${securityScore}%`,
              background:
                securityScore >= 80
                  ? "linear-gradient(to right, #10B981, #06B6D4)"
                  : securityScore >= 50
                  ? "linear-gradient(to right, #EAB308, #10B981)"
                  : "linear-gradient(to right, #DC2626, #EAB308)",
            }}
          />
        </div>

        {/* Recommendations */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-quantum-green" />
            <span className="text-phantom-gray">Strong password enabled</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <span className="text-phantom-gray">
              Enable two-factor authentication
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-quantum-green" />
            <span className="text-phantom-gray">
              Recent login activity reviewed
            </span>
          </div>
        </div>
      </section>

      {/* Change Password */}
      <section className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10 animate-fade-in-up stagger-2">
        <h3 className="text-lg font-semibold text-white mb-4">
          Change Password
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-phantom-gray mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Enter current password"
                value={passwords.current}
                onChange={(e) =>
                  setPasswords({ ...passwords, current: e.target.value })
                }
                className="w-full h-12 px-4 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-neural focus:bg-white/10 transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-phantom-gray hover:text-white transition-colors"
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-phantom-gray mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={passwords.new}
                onChange={(e) =>
                  setPasswords({ ...passwords, new: e.target.value })
                }
                className="w-full h-12 px-4 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-neural focus:bg-white/10 transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-phantom-gray hover:text-white transition-colors"
              >
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Password Strength Meter */}
            {passwords.new && (
              <div className="mt-2">
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${newPasswordStrength}%`,
                      background:
                        newPasswordStrength <= 50
                          ? "linear-gradient(to right, #DC2626, #F97316)"
                          : "linear-gradient(to right, #EAB308, #10B981)",
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-phantom-gray mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={passwords.confirm}
                onChange={(e) =>
                  setPasswords({ ...passwords, confirm: e.target.value })
                }
                className={`w-full h-12 px-4 pr-12 rounded-xl bg-white/5 border text-white placeholder-white/30 focus:outline-none focus:bg-white/10 transition-all duration-300 ${
                  passwords.confirm && passwords.confirm !== passwords.new
                    ? "border-crimson-red focus:border-crimson-red"
                    : passwords.confirm && passwords.confirm === passwords.new
                    ? "border-quantum-green focus:border-quantum-green"
                    : "border-white/10 focus:border-neural"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-phantom-gray hover:text-white transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {passwords.confirm && passwords.confirm !== passwords.new && (
              <p className="text-xs text-crimson-red mt-1 flex items-center gap-1">
                <X className="w-3 h-3" />
                Passwords do not match
              </p>
            )}
          </div>

          <button
            onClick={handleSave}
            className="h-12 px-6 rounded-xl bg-gradient-to-r from-neural to-electric-cyan text-white font-semibold hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all duration-300"
          >
            Update Password
          </button>
        </div>
      </section>

      {/* Two-Factor Authentication */}
      <section className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10 animate-fade-in-up stagger-3">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">
              Two-Factor Authentication
            </h3>
            <p className="text-sm text-phantom-gray">
              Add an extra layer of security to your account
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-500 text-sm font-medium">
            Recommended
          </span>
        </div>

        {/* 2FA Methods */}
        <div className="space-y-3 mb-6">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neural/20 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-neural-bright" />
                </div>
                <div>
                  <p className="font-medium text-white">Authenticator App</p>
                  <p className="text-sm text-phantom-gray">
                    Use Google Authenticator or similar
                  </p>
                </div>
              </div>
              <button className="h-10 px-6 rounded-lg bg-neural text-white font-medium hover:bg-neural-bright transition-all duration-300">
                Enable
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-electric-cyan/20 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-electric-cyan" />
                </div>
                <div>
                  <p className="font-medium text-white">SMS Verification</p>
                  <p className="text-sm text-phantom-gray">
                    Receive codes via text message
                  </p>
                </div>
              </div>
              <button className="h-10 px-6 rounded-lg border border-white/10 text-white font-medium hover:bg-white/5 transition-all duration-300">
                Set Up
              </button>
            </div>
          </div>
        </div>

        {/* Backup Codes */}
        <div className="p-4 rounded-xl bg-neural/5 border border-neural/20">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-neural-bright mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-white mb-1">
                <span className="font-semibold">Don&apos;t lose access!</span>
              </p>
              <p className="text-sm text-phantom-gray">
                After enabling 2FA, download backup codes in case you lose your
                device
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Active Sessions */}
      <section className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10 animate-fade-in-up stagger-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">
              Active Sessions
            </h3>
            <p className="text-sm text-phantom-gray">
              Manage devices where you&apos;re currently signed in
            </p>
          </div>
          <button className="h-10 px-4 rounded-lg text-plasma-pink font-medium hover:bg-plasma-pink/10 transition-all duration-300">
            Sign Out All
          </button>
        </div>

        <div className="space-y-3">
          {sessions.map((session) => {
            const Icon = session.icon;
            return (
              <div
                key={session.id}
                className={`p-4 rounded-xl border ${
                  session.current
                    ? "bg-quantum-green/5 border-quantum-green/20"
                    : "bg-white/5 border-white/10"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        session.current
                          ? "bg-quantum-green/20"
                          : "bg-electric-cyan/20"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          session.current
                            ? "text-quantum-green"
                            : "text-electric-cyan"
                        }`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-white">
                          {session.device}
                        </p>
                        {session.current && (
                          <span className="px-2 py-0.5 rounded-full bg-quantum-green/20 text-quantum-green text-xs font-medium">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-phantom-gray">
                        {session.location} • {session.browser} • Last active:{" "}
                        {session.lastActive}
                      </p>
                    </div>
                  </div>
                  {!session.current && (
                    <button className="text-sm text-plasma-pink font-medium hover:underline">
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Save indicator */}
      {saved && (
        <div className="fixed bottom-8 right-8 px-6 py-3 rounded-xl bg-quantum-green text-void-black font-medium flex items-center gap-2 animate-fade-in-up shadow-lg">
          <Check className="w-5 h-5" />
          Changes saved successfully
        </div>
      )}
    </div>
  );
}
