"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getPWAManager, pwaCapabilities, type PWAManager } from "./pwa-manager";

/**
 * Hook to initialize and access the PWA Manager
 */
export function usePWA() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const managerRef = useRef<PWAManager | null>(null);

  useEffect(() => {
    // Initialize on mount
    const init = async () => {
      const manager = getPWAManager();
      managerRef.current = manager;
      await manager.initialize();
      setIsInitialized(true);
    };

    init();

    // Online/offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return {
    manager: managerRef.current,
    isInitialized,
    isOnline,
    capabilities: pwaCapabilities,
  };
}

/**
 * Hook for PWA install prompt
 */
export function useInstallPrompt() {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const managerRef = useRef<PWAManager | null>(null);

  useEffect(() => {
    const manager = getPWAManager();
    managerRef.current = manager;

    // Check if already installed
    setIsInstalled(manager.install.isInstalled());

    // Listen for install availability
    manager.install.onInstallAvailable(() => {
      setCanInstall(true);
    });

    // Listen for display mode changes
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleChange = (e: MediaQueryListEvent) => {
      setIsInstalled(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!managerRef.current) return null;
    const result = await managerRef.current.install.prompt();
    if (result === "accepted") {
      setCanInstall(false);
    }
    return result;
  }, []);

  return {
    canInstall,
    isInstalled,
    promptInstall,
  };
}

/**
 * Hook for push notifications
 */
export function usePushNotifications() {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [isSupported, setIsSupported] = useState(false);
  const managerRef = useRef<PWAManager | null>(null);

  useEffect(() => {
    const init = async () => {
      const manager = getPWAManager();
      await manager.initialize();
      managerRef.current = manager;

      setIsSupported(
        pwaCapabilities.notifications && pwaCapabilities.pushManager
      );

      if (pwaCapabilities.notifications) {
        setPermission(Notification.permission);
      }

      if (manager.push) {
        const sub = await manager.push.getSubscription();
        setSubscription(sub);
      }
    };

    init();
  }, []);

  const requestPermission = useCallback(async () => {
    if (!managerRef.current?.push) return "denied" as NotificationPermission;
    const perm = await managerRef.current.push.requestPermission();
    setPermission(perm);
    return perm;
  }, []);

  const subscribe = useCallback(async (vapidPublicKey: string) => {
    if (!managerRef.current?.push) return null;
    const sub = await managerRef.current.push.subscribe(vapidPublicKey);
    setSubscription(sub);
    return sub;
  }, []);

  const unsubscribe = useCallback(async () => {
    if (!managerRef.current?.push) return false;
    const result = await managerRef.current.push.unsubscribe();
    if (result) {
      setSubscription(null);
    }
    return result;
  }, []);

  return {
    permission,
    subscription,
    isSupported,
    requestPermission,
    subscribe,
    unsubscribe,
  };
}

/**
 * Hook for background sync
 */
export function useBackgroundSync() {
  const [isSupported, setIsSupported] = useState(false);
  const managerRef = useRef<PWAManager | null>(null);

  useEffect(() => {
    const init = async () => {
      const manager = getPWAManager();
      await manager.initialize();
      managerRef.current = manager;
      setIsSupported(pwaCapabilities.backgroundSync);
    };

    init();
  }, []);

  const registerSync = useCallback(async (tag: string) => {
    if (!managerRef.current?.sync) return false;
    return managerRef.current.sync.registerSync(tag);
  }, []);

  const registerPeriodicSync = useCallback(
    async (tag: string, minInterval?: number) => {
      if (!managerRef.current?.sync) return false;
      return managerRef.current.sync.registerPeriodicSync(tag, minInterval);
    },
    []
  );

  return {
    isSupported,
    registerSync,
    registerPeriodicSync,
  };
}

/**
 * Hook for app badge
 */
export function useAppBadge() {
  const [isSupported] = useState(pwaCapabilities.badging);
  const managerRef = useRef<PWAManager | null>(null);

  useEffect(() => {
    managerRef.current = getPWAManager();
  }, []);

  const setBadge = useCallback(async (count?: number) => {
    if (!managerRef.current) return false;
    return managerRef.current.badge.setBadge(count);
  }, []);

  const clearBadge = useCallback(async () => {
    if (!managerRef.current) return false;
    return managerRef.current.badge.clearBadge();
  }, []);

  return {
    isSupported,
    setBadge,
    clearBadge,
  };
}

/**
 * Hook for web share
 */
export function useWebShare() {
  const [isSupported] = useState(pwaCapabilities.share);
  const managerRef = useRef<PWAManager | null>(null);

  useEffect(() => {
    managerRef.current = getPWAManager();
  }, []);

  const share = useCallback(async (data: ShareData) => {
    if (!managerRef.current) return false;
    return managerRef.current.share.share(data);
  }, []);

  const canShare = useCallback((data?: ShareData) => {
    if (!managerRef.current) return false;
    return managerRef.current.share.canShare(data);
  }, []);

  return {
    isSupported,
    share,
    canShare,
  };
}

/**
 * Hook for screen wake lock
 */
export function useWakeLock() {
  const [isActive, setIsActive] = useState(false);
  const [isSupported] = useState(pwaCapabilities.wakeLock);
  const managerRef = useRef<PWAManager | null>(null);

  useEffect(() => {
    managerRef.current = getPWAManager();

    // Auto-reacquire on visibility change
    const cleanup = managerRef.current.wakeLock.setupAutoReacquire();

    return cleanup;
  }, []);

  const requestWakeLock = useCallback(async () => {
    if (!managerRef.current) return false;
    const result = await managerRef.current.wakeLock.request();
    setIsActive(result);
    return result;
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (!managerRef.current) return;
    await managerRef.current.wakeLock.release();
    setIsActive(false);
  }, []);

  return {
    isSupported,
    isActive,
    requestWakeLock,
    releaseWakeLock,
  };
}

/**
 * Hook for SW updates
 */
export function useServiceWorkerUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const managerRef = useRef<PWAManager | null>(null);

  useEffect(() => {
    const manager = getPWAManager();
    managerRef.current = manager;

    manager.sw.onUpdateAvailable(() => {
      setUpdateAvailable(true);
    });
  }, []);

  const applyUpdate = useCallback(async () => {
    if (!managerRef.current) return;
    await managerRef.current.sw.skipWaiting();
    window.location.reload();
  }, []);

  const checkForUpdate = useCallback(async () => {
    if (!managerRef.current) return;
    await managerRef.current.sw.update();
  }, []);

  return {
    updateAvailable,
    applyUpdate,
    checkForUpdate,
  };
}

/**
 * Hook for storage management
 */
export function useStorageManager() {
  const [isPersisted, setIsPersisted] = useState(false);
  const [storageEstimate, setStorageEstimate] = useState<{
    usage: number;
    quota: number;
  } | null>(null);
  const managerRef = useRef<PWAManager | null>(null);

  useEffect(() => {
    const init = async () => {
      const manager = getPWAManager();
      await manager.initialize();
      managerRef.current = manager;

      const persisted = await manager.storage.isPersistedStorage();
      setIsPersisted(persisted);

      const estimate = await manager.storage.getStorageEstimate();
      setStorageEstimate(estimate);
    };

    init();
  }, []);

  const requestPersistence = useCallback(async () => {
    if (!managerRef.current) return false;
    const result = await managerRef.current.storage.requestPersistence();
    setIsPersisted(result);
    return result;
  }, []);

  const refreshEstimate = useCallback(async () => {
    if (!managerRef.current) return;
    const estimate = await managerRef.current.storage.getStorageEstimate();
    setStorageEstimate(estimate);
  }, []);

  return {
    isPersisted,
    storageEstimate,
    requestPersistence,
    refreshEstimate,
  };
}
