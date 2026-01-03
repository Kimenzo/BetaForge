"use client";

import { useState, useEffect } from "react";
import { MonitorOff, Monitor, Loader2 } from "lucide-react";
import { useWakeLock } from "@/lib/pwa";

interface WakeLockToggleProps {
  onStatusChange?: (isActive: boolean) => void;
}

/**
 * Wake Lock Toggle Component
 *
 * Keeps the screen awake during long-running test sessions.
 * Useful when monitoring real-time test progress.
 */
export function WakeLockToggle({ onStatusChange }: WakeLockToggleProps) {
  const { isSupported, isActive, requestWakeLock, releaseWakeLock } =
    useWakeLock();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    onStatusChange?.(isActive);
  }, [isActive, onStatusChange]);

  if (!isSupported) {
    return null;
  }

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      if (isActive) {
        await releaseWakeLock();
      } else {
        await requestWakeLock();
      }
    } catch (error) {
      console.error("Wake lock toggle failed:", error);
    }
    setIsLoading(false);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
        isActive
          ? "bg-orange-500/10 text-orange-500 border border-orange-500/20"
          : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
      }`}
      title={isActive ? "Screen will stay on" : "Keep screen awake"}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isActive ? (
        <Monitor className="w-4 h-4" />
      ) : (
        <MonitorOff className="w-4 h-4" />
      )}
      <span className="hidden sm:inline">
        {isActive ? "Screen On" : "Keep Awake"}
      </span>
    </button>
  );
}

/**
 * Auto Wake Lock Hook
 *
 * Automatically enables wake lock when a test session is running
 */
export function useAutoWakeLock(isTestRunning: boolean) {
  const { isSupported, isActive, requestWakeLock, releaseWakeLock } =
    useWakeLock();

  useEffect(() => {
    if (!isSupported) return;

    if (isTestRunning && !isActive) {
      requestWakeLock();
    } else if (!isTestRunning && isActive) {
      releaseWakeLock();
    }
  }, [isTestRunning, isSupported, isActive, requestWakeLock, releaseWakeLock]);

  return { isActive, isSupported };
}
