// ============================================
// BetaForge PWA Utilities
// Next-Gen Progressive Web App Features
// ============================================

/**
 * Check if running in browser environment
 */
const isBrowser = typeof window !== 'undefined' && typeof navigator !== 'undefined';

/**
 * PWA Feature Detection (SSR-safe)
 */
export const pwaCapabilities = {
  serviceWorker: isBrowser && 'serviceWorker' in navigator,
  pushManager: isBrowser && 'PushManager' in window,
  notifications: isBrowser && 'Notification' in window,
  backgroundSync: isBrowser && 'sync' in (window.ServiceWorkerRegistration?.prototype || {}),
  periodicSync: isBrowser && 'periodicSync' in (window.ServiceWorkerRegistration?.prototype || {}),
  badging: isBrowser && 'setAppBadge' in navigator,
  share: isBrowser && 'share' in navigator,
  shareTarget: isBrowser && 'shareTarget' in navigator,
  wakeLock: isBrowser && 'wakeLock' in navigator,
  bluetooth: isBrowser && 'bluetooth' in navigator,
  usb: isBrowser && 'usb' in navigator,
  fileSystem: isBrowser && 'showOpenFilePicker' in window,
  clipboard: isBrowser && 'clipboard' in navigator,
  storage: isBrowser && 'storage' in navigator,
  persistentStorage: isBrowser && 'persist' in (navigator.storage || {}),
  indexedDB: isBrowser && 'indexedDB' in window,
  caches: isBrowser && 'caches' in window,
  credentials: isBrowser && 'credentials' in navigator,
  payment: isBrowser && 'PaymentRequest' in window,
  geolocation: isBrowser && 'geolocation' in navigator,
  mediaDevices: isBrowser && 'mediaDevices' in navigator,
  screenCapture: isBrowser && 'getDisplayMedia' in (navigator.mediaDevices || {}),
  pictureInPicture: isBrowser && typeof document !== 'undefined' && 'pictureInPictureEnabled' in document,
  windowControlsOverlay: isBrowser && 'windowControlsOverlay' in navigator,
  launchHandler: isBrowser && 'launchQueue' in window,
  protocol: isBrowser && 'registerProtocolHandler' in navigator,
};

/**
 * Service Worker Registration & Management
 */
export class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private updateCallback: (() => void) | null = null;

  async register(): Promise<ServiceWorkerRegistration | null> {
    if (!pwaCapabilities.serviceWorker) {
      console.warn('[PWA] Service Worker not supported');
      return null;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      });

      console.log('[PWA] Service Worker registered:', this.registration.scope);

      // Check for updates on page load
      this.registration.addEventListener('updatefound', () => {
        this.handleUpdate();
      });

      // Listen for controller changes (new SW activated)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('[PWA] New Service Worker activated');
      });

      // Listen for messages from SW
      navigator.serviceWorker.addEventListener('message', (event) => {
        this.handleMessage(event.data);
      });

      return this.registration;
    } catch (error) {
      console.error('[PWA] Service Worker registration failed:', error);
      return null;
    }
  }

  private handleUpdate() {
    const newWorker = this.registration?.installing;
    if (!newWorker) return;

    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        console.log('[PWA] New version available');
        this.updateCallback?.();
      }
    });
  }

  private handleMessage(data: { type: string; [key: string]: unknown }) {
    switch (data.type) {
      case 'SW_ACTIVATED':
        console.log('[PWA] SW activated, version:', data.version);
        break;
      case 'SHARE_TARGET':
        window.dispatchEvent(new CustomEvent('pwa:share', { detail: data.data }));
        break;
      case 'NAVIGATE':
        if (typeof data.url === 'string') {
          window.location.href = data.url;
        }
        break;
    }
  }

  onUpdateAvailable(callback: () => void) {
    this.updateCallback = callback;
  }

  async update(): Promise<void> {
    await this.registration?.update();
  }

  async skipWaiting(): Promise<void> {
    const waiting = this.registration?.waiting;
    if (waiting) {
      waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }

  async getVersion(): Promise<string | null> {
    return new Promise((resolve) => {
      const channel = new MessageChannel();
      channel.port1.onmessage = (event) => resolve(event.data?.version || null);
      
      navigator.serviceWorker.controller?.postMessage(
        { type: 'GET_VERSION' },
        [channel.port2]
      );

      setTimeout(() => resolve(null), 1000);
    });
  }

  async clearCache(): Promise<boolean> {
    return new Promise((resolve) => {
      const channel = new MessageChannel();
      channel.port1.onmessage = (event) => resolve(event.data?.success || false);
      
      navigator.serviceWorker.controller?.postMessage(
        { type: 'CLEAR_CACHE' },
        [channel.port2]
      );

      setTimeout(() => resolve(false), 5000);
    });
  }
}

/**
 * Push Notifications Manager
 */
export class PushNotificationManager {
  private registration: ServiceWorkerRegistration | null = null;

  constructor(registration: ServiceWorkerRegistration | null) {
    this.registration = registration;
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!pwaCapabilities.notifications) {
      console.warn('[PWA] Notifications not supported');
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    console.log('[PWA] Notification permission:', permission);
    return permission;
  }

  async subscribe(vapidPublicKey: string): Promise<PushSubscription | null> {
    if (!this.registration || !pwaCapabilities.pushManager) {
      console.warn('[PWA] Push not supported');
      return null;
    }

    try {
      // Check existing subscription
      let subscription = await this.registration.pushManager.getSubscription();
      
      if (subscription) {
        console.log('[PWA] Existing push subscription found');
        return subscription;
      }

      // Create new subscription
      subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey),
      });

      console.log('[PWA] Push subscription created');
      return subscription;
    } catch (error) {
      console.error('[PWA] Push subscription failed:', error);
      return null;
    }
  }

  async unsubscribe(): Promise<boolean> {
    if (!this.registration) return false;

    try {
      const subscription = await this.registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        console.log('[PWA] Push unsubscribed');
        return true;
      }
      return false;
    } catch (error) {
      console.error('[PWA] Unsubscribe failed:', error);
      return false;
    }
  }

  async getSubscription(): Promise<PushSubscription | null> {
    if (!this.registration) return null;
    return this.registration.pushManager.getSubscription();
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

/**
 * Background Sync Manager
 */
export class BackgroundSyncManager {
  private registration: ServiceWorkerRegistration | null = null;

  constructor(registration: ServiceWorkerRegistration | null) {
    this.registration = registration;
  }

  async registerSync(tag: string): Promise<boolean> {
    if (!this.registration || !pwaCapabilities.backgroundSync) {
      console.warn('[PWA] Background sync not supported');
      return false;
    }

    try {
      await (this.registration as unknown as { sync: { register: (tag: string) => Promise<void> } }).sync.register(tag);
      console.log('[PWA] Background sync registered:', tag);
      return true;
    } catch (error) {
      console.error('[PWA] Background sync registration failed:', error);
      return false;
    }
  }

  async registerPeriodicSync(tag: string, minInterval: number = 12 * 60 * 60 * 1000): Promise<boolean> {
    if (!this.registration || !pwaCapabilities.periodicSync) {
      console.warn('[PWA] Periodic sync not supported');
      return false;
    }

    try {
      const status = await navigator.permissions.query({
        name: 'periodic-background-sync' as PermissionName,
      });

      if (status.state !== 'granted') {
        console.warn('[PWA] Periodic sync permission not granted');
        return false;
      }

      await (this.registration as unknown as { periodicSync: { register: (tag: string, options: { minInterval: number }) => Promise<void> } }).periodicSync.register(tag, { minInterval });
      console.log('[PWA] Periodic sync registered:', tag);
      return true;
    } catch (error) {
      console.error('[PWA] Periodic sync registration failed:', error);
      return false;
    }
  }
}

/**
 * App Badging API
 */
export class BadgeManager {
  async setBadge(count?: number): Promise<boolean> {
    if (!pwaCapabilities.badging) {
      console.warn('[PWA] Badging not supported');
      return false;
    }

    try {
      if (count !== undefined) {
        await navigator.setAppBadge(count);
      } else {
        await navigator.setAppBadge();
      }
      return true;
    } catch (error) {
      console.error('[PWA] Set badge failed:', error);
      return false;
    }
  }

  async clearBadge(): Promise<boolean> {
    if (!pwaCapabilities.badging) {
      return false;
    }

    try {
      await navigator.clearAppBadge();
      return true;
    } catch (error) {
      console.error('[PWA] Clear badge failed:', error);
      return false;
    }
  }
}

/**
 * Web Share API
 */
export class ShareManager {
  canShare(data?: ShareData): boolean {
    if (!pwaCapabilities.share) return false;
    if (data && 'canShare' in navigator) {
      return navigator.canShare(data);
    }
    return true;
  }

  async share(data: ShareData): Promise<boolean> {
    if (!this.canShare(data)) {
      console.warn('[PWA] Sharing not supported for this data');
      return false;
    }

    try {
      await navigator.share(data);
      return true;
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('[PWA] Share failed:', error);
      }
      return false;
    }
  }

  async shareFile(files: File[], data?: Omit<ShareData, 'files'>): Promise<boolean> {
    if (!navigator.canShare?.({ files })) {
      console.warn('[PWA] File sharing not supported');
      return false;
    }

    try {
      await navigator.share({ ...data, files });
      return true;
    } catch (error) {
      console.error('[PWA] File share failed:', error);
      return false;
    }
  }
}

/**
 * Screen Wake Lock API
 */
export class WakeLockManager {
  private wakeLock: WakeLockSentinel | null = null;

  async request(): Promise<boolean> {
    if (!pwaCapabilities.wakeLock) {
      console.warn('[PWA] Wake Lock not supported');
      return false;
    }

    try {
      this.wakeLock = await navigator.wakeLock.request('screen');
      
      this.wakeLock.addEventListener('release', () => {
        console.log('[PWA] Wake Lock released');
        this.wakeLock = null;
      });

      console.log('[PWA] Wake Lock acquired');
      return true;
    } catch (error) {
      console.error('[PWA] Wake Lock request failed:', error);
      return false;
    }
  }

  async release(): Promise<void> {
    if (this.wakeLock) {
      await this.wakeLock.release();
      this.wakeLock = null;
    }
  }

  isActive(): boolean {
    return this.wakeLock !== null && !this.wakeLock.released;
  }

  // Re-acquire wake lock on visibility change
  setupAutoReacquire(): () => void {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && this.wakeLock === null) {
        await this.request();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }
}

/**
 * Install Prompt Manager
 */
export class InstallPromptManager {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private installCallback: (() => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        this.deferredPrompt = e as BeforeInstallPromptEvent;
        this.installCallback?.();
      });

      window.addEventListener('appinstalled', () => {
        console.log('[PWA] App installed');
        this.deferredPrompt = null;
      });
    }
  }

  canInstall(): boolean {
    return this.deferredPrompt !== null;
  }

  onInstallAvailable(callback: () => void) {
    this.installCallback = callback;
    if (this.deferredPrompt) {
      callback();
    }
  }

  async prompt(): Promise<'accepted' | 'dismissed' | null> {
    if (!this.deferredPrompt) {
      return null;
    }

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    this.deferredPrompt = null;
    return outcome;
  }

  isInstalled(): boolean {
    // Check if running in standalone mode
    if (typeof window !== 'undefined') {
      return (
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as Navigator & { standalone?: boolean }).standalone === true ||
        document.referrer.includes('android-app://')
      );
    }
    return false;
  }
}

/**
 * Persistent Storage Manager
 */
export class StorageManager {
  async requestPersistence(): Promise<boolean> {
    if (!pwaCapabilities.persistentStorage) {
      console.warn('[PWA] Persistent storage not supported');
      return false;
    }

    try {
      const isPersisted = await navigator.storage.persist();
      console.log('[PWA] Persistent storage:', isPersisted ? 'granted' : 'denied');
      return isPersisted;
    } catch (error) {
      console.error('[PWA] Persistence request failed:', error);
      return false;
    }
  }

  async isPersistedStorage(): Promise<boolean> {
    if (!pwaCapabilities.persistentStorage) return false;
    return navigator.storage.persisted();
  }

  async getStorageEstimate(): Promise<{ usage: number; quota: number } | null> {
    if (!pwaCapabilities.storage) return null;

    try {
      const estimate = await navigator.storage.estimate();
      return {
        usage: estimate.usage || 0,
        quota: estimate.quota || 0,
      };
    } catch (error) {
      console.error('[PWA] Storage estimate failed:', error);
      return null;
    }
  }
}

/**
 * Protocol Handler
 */
export function registerProtocolHandler(): void {
  if (!pwaCapabilities.protocol) {
    console.warn('[PWA] Protocol handler not supported');
    return;
  }

  try {
    navigator.registerProtocolHandler(
      'web+betaforge',
      `${window.location.origin}/protocol?type=%s`,
      'BetaForge'
    );
    console.log('[PWA] Protocol handler registered');
  } catch (error) {
    console.error('[PWA] Protocol handler registration failed:', error);
  }
}

/**
 * Types for PWA APIs
 */
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
  prompt(): Promise<void>;
}

declare global {
  interface Navigator {
    setAppBadge(contents?: number): Promise<void>;
    clearAppBadge(): Promise<void>;
  }
}

/**
 * Main PWA Manager - Combines all features
 */
export class PWAManager {
  public sw: ServiceWorkerManager;
  public push: PushNotificationManager | null = null;
  public sync: BackgroundSyncManager | null = null;
  public badge: BadgeManager;
  public share: ShareManager;
  public wakeLock: WakeLockManager;
  public install: InstallPromptManager;
  public storage: StorageManager;

  private initialized = false;

  constructor() {
    this.sw = new ServiceWorkerManager();
    this.badge = new BadgeManager();
    this.share = new ShareManager();
    this.wakeLock = new WakeLockManager();
    this.install = new InstallPromptManager();
    this.storage = new StorageManager();
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    const registration = await this.sw.register();
    
    if (registration) {
      this.push = new PushNotificationManager(registration);
      this.sync = new BackgroundSyncManager(registration);
    }

    // Request persistent storage
    await this.storage.requestPersistence();

    this.initialized = true;
    console.log('[PWA] Manager initialized');
    console.log('[PWA] Capabilities:', pwaCapabilities);
  }

  getCapabilities() {
    return pwaCapabilities;
  }
}

// Singleton instance
let pwaManager: PWAManager | null = null;

export function getPWAManager(): PWAManager {
  if (!pwaManager) {
    pwaManager = new PWAManager();
  }
  return pwaManager;
}
