"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, Smartphone, Monitor, Bug, CheckCircle, Loader2 } from "lucide-react";
import { usePushNotifications, useInstallPrompt, useStorageManager } from "@/lib/pwa";

interface NotificationSettingsProps {
  vapidPublicKey?: string;
}

export function NotificationSettings({ vapidPublicKey }: NotificationSettingsProps) {
  const { 
    permission, 
    subscription, 
    isSupported, 
    requestPermission, 
    subscribe, 
    unsubscribe 
  } = usePushNotifications();
  
  const { isInstalled } = useInstallPrompt();
  const { isPersisted, requestPersistence, storageEstimate } = useStorageManager();
  
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    testComplete: true,
    bugFound: true,
    criticalOnly: false,
    quietHours: false,
    quietStart: "22:00",
    quietEnd: "08:00",
  });

  useEffect(() => {
    // Load saved preferences
    const saved = localStorage.getItem("notification-preferences");
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, []);

  const handleEnableNotifications = async () => {
    setIsLoading(true);
    try {
      const perm = await requestPermission();
      if (perm === "granted" && vapidPublicKey) {
        const sub = await subscribe(vapidPublicKey);
        if (sub) {
          // Send subscription to server
          await fetch("/api/push/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              subscription: sub.toJSON(),
              userId: "current-user", // Replace with actual user ID
            }),
          });
        }
      }
    } catch (error) {
      console.error("Failed to enable notifications:", error);
    }
    setIsLoading(false);
  };

  const handleDisableNotifications = async () => {
    setIsLoading(true);
    try {
      if (subscription) {
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
      }
      await unsubscribe();
    } catch (error) {
      console.error("Failed to disable notifications:", error);
    }
    setIsLoading(false);
  };

  const savePreferences = (newPrefs: typeof preferences) => {
    setPreferences(newPrefs);
    localStorage.setItem("notification-preferences", JSON.stringify(newPrefs));
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* PWA Status */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">App Status</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
            {isInstalled ? (
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-green-500" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gray-500/10 flex items-center justify-center">
                <Monitor className="w-5 h-5 text-gray-400" />
              </div>
            )}
            <div>
              <p className="text-sm text-gray-400">Installation</p>
              <p className="font-medium text-white">
                {isInstalled ? "Installed" : "Browser"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              permission === "granted" ? "bg-green-500/10" : "bg-gray-500/10"
            }`}>
              {permission === "granted" ? (
                <Bell className="w-5 h-5 text-green-500" />
              ) : (
                <BellOff className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <div>
              <p className="text-sm text-gray-400">Notifications</p>
              <p className="font-medium text-white capitalize">{permission}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isPersisted ? "bg-green-500/10" : "bg-yellow-500/10"
            }`}>
              <CheckCircle className={`w-5 h-5 ${
                isPersisted ? "text-green-500" : "text-yellow-500"
              }`} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Storage</p>
              <p className="font-medium text-white">
                {isPersisted ? "Persistent" : "Temporary"}
              </p>
            </div>
          </div>
        </div>

        {storageEstimate && (
          <div className="mt-4 p-4 bg-white/5 rounded-xl">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Storage Used</span>
              <span className="text-white">
                {formatBytes(storageEstimate.usage)} / {formatBytes(storageEstimate.quota)}
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-500 rounded-full transition-all"
                style={{ 
                  width: `${Math.min((storageEstimate.usage / storageEstimate.quota) * 100, 100)}%` 
                }}
              />
            </div>
          </div>
        )}

        {!isPersisted && (
          <button
            onClick={requestPersistence}
            className="mt-4 text-sm text-orange-500 hover:text-orange-400 transition-colors"
          >
            Request persistent storage →
          </button>
        )}
      </div>

      {/* Notification Settings */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Push Notifications</h3>

        {!isSupported ? (
          <p className="text-gray-400">
            Push notifications are not supported in this browser.
          </p>
        ) : permission === "denied" ? (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400">
              Notifications are blocked. Please enable them in your browser settings.
            </p>
          </div>
        ) : permission === "granted" && subscription ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-green-500" />
                <span className="text-green-400">Notifications enabled</span>
              </div>
              <button
                onClick={handleDisableNotifications}
                disabled={isLoading}
                className="px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Disable"}
              </button>
            </div>

            {/* Notification Preferences */}
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl cursor-pointer">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">Test completed</span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.testComplete}
                  onChange={(e) => savePreferences({ ...preferences, testComplete: e.target.checked })}
                  className="w-5 h-5 rounded accent-orange-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl cursor-pointer">
                <div className="flex items-center gap-3">
                  <Bug className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">Bug found</span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.bugFound}
                  onChange={(e) => savePreferences({ ...preferences, bugFound: e.target.checked })}
                  className="w-5 h-5 rounded accent-orange-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 flex items-center justify-center text-red-500 font-bold text-xs">!</span>
                  <span className="text-gray-300">Critical bugs only</span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.criticalOnly}
                  onChange={(e) => savePreferences({ ...preferences, criticalOnly: e.target.checked })}
                  className="w-5 h-5 rounded accent-orange-500"
                />
              </label>
            </div>
          </div>
        ) : (
          <button
            onClick={handleEnableNotifications}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Bell className="w-5 h-5" />
                Enable Notifications
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
