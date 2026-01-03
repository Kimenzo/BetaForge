"use client";

import { useEffect } from "react";
import { getPWAManager } from "@/lib/pwa";

/**
 * PWA Provider Component
 * 
 * This component initializes the PWA features and should be
 * placed in the root layout to ensure PWA is set up on app load.
 */
export function PWAProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize PWA on mount
    const initPWA = async () => {
      const manager = getPWAManager();
      await manager.initialize();

      // Register for periodic background sync if supported
      if (manager.sync) {
        await manager.sync.registerPeriodicSync('check-test-status', 60 * 60 * 1000); // 1 hour
        await manager.sync.registerPeriodicSync('refresh-dashboard', 30 * 60 * 1000); // 30 mins
      }

      // Log PWA capabilities for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('[PWA] Capabilities:', manager.getCapabilities());
      }
    };

    initPWA();
  }, []);

  return <>{children}</>;
}
