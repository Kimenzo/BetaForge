"use client";

import { useState, useEffect } from "react";
import { X, Download, Sparkles, Smartphone, Monitor, Zap, Bell } from "lucide-react";
import { useInstallPrompt } from "@/lib/pwa";

interface InstallPromptProps {
  variant?: "banner" | "modal" | "toast";
  onDismiss?: () => void;
}

export function InstallPrompt({ variant = "toast", onDismiss }: InstallPromptProps) {
  const { canInstall, isInstalled, promptInstall } = useInstallPrompt();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has dismissed before
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      // Show again after 7 days
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
        setIsDismissed(true);
      }
    }

    // Delay showing the prompt
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    onDismiss?.();
  };

  const handleInstall = async () => {
    const result = await promptInstall();
    if (result === 'accepted') {
      setIsDismissed(true);
    }
  };

  if (!canInstall || isInstalled || isDismissed || !isVisible) {
    return null;
  }

  if (variant === "banner") {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-600 to-amber-500 text-white px-4 py-3 shadow-lg animate-slide-up">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold">Install BetaForge</p>
              <p className="text-sm text-white/80">Get quick access from your home screen</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDismiss}
              className="px-4 py-2 text-sm font-medium hover:bg-white/10 rounded-lg transition-colors"
            >
              Not now
            </button>
            <button
              onClick={handleInstall}
              className="px-4 py-2 text-sm font-semibold bg-white text-orange-600 rounded-lg hover:bg-white/90 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Install
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "modal") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div className="relative w-full max-w-md bg-[#0D0D14] border border-white/10 rounded-2xl p-6 shadow-2xl animate-scale-in">
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>

          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mb-4">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Install BetaForge</h2>
            <p className="text-gray-400">
              Add BetaForge to your device for a faster, app-like experience
            </p>
          </div>

          <div className="space-y-3 mb-6">
            {[
              { icon: Zap, text: "Instant access from your home screen" },
              { icon: Bell, text: "Get notified when tests complete" },
              { icon: Monitor, text: "Works offline with cached data" },
              { icon: Smartphone, text: "Native app experience" },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <feature.icon className="w-4 h-4 text-orange-500" />
                </div>
                {feature.text}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDismiss}
              className="flex-1 px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              Maybe later
            </button>
            <button
              onClick={handleInstall}
              className="flex-1 px-4 py-3 text-sm font-semibold bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Install App
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Toast variant (default)
  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-[#0D0D14] border border-white/10 rounded-2xl p-4 shadow-2xl animate-slide-up">
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1 rounded-lg hover:bg-white/5 transition-colors"
      >
        <X className="w-4 h-4 text-gray-400" />
      </button>

      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-white mb-1">Install BetaForge</h3>
          <p className="text-sm text-gray-400">
            Add to your device for quick access and offline support
          </p>
        </div>
      </div>

      <button
        onClick={handleInstall}
        className="w-full px-4 py-2.5 text-sm font-semibold bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
      >
        <Download className="w-4 h-4" />
        Install App
      </button>
    </div>
  );
}

/**
 * Update Available Toast
 */
export function UpdateAvailableToast() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Import dynamically to avoid SSR issues
    import("@/lib/pwa").then(({ getPWAManager }) => {
      const manager = getPWAManager();
      manager.sw.onUpdateAvailable(() => {
        setUpdateAvailable(true);
      });
    });
  }, []);

  const handleUpdate = async () => {
    const { getPWAManager } = await import("@/lib/pwa");
    const manager = getPWAManager();
    await manager.sw.skipWaiting();
    window.location.reload();
  };

  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-[#0D0D14] border border-white/10 rounded-xl p-4 shadow-2xl animate-slide-up max-w-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
          <Zap className="w-5 h-5 text-blue-500" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-white text-sm">Update available</p>
          <p className="text-xs text-gray-400">A new version is ready</p>
        </div>
        <button
          onClick={handleUpdate}
          className="px-3 py-1.5 text-xs font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Update
        </button>
      </div>
    </div>
  );
}

/**
 * Offline Indicator
 */
export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-yellow-500 text-yellow-900 text-center py-2 text-sm font-medium">
      You&apos;re offline. Some features may be limited.
    </div>
  );
}
