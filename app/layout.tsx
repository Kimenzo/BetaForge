import type { Metadata, Viewport } from "next";
import "./globals.css";
import {
  PWAProvider,
  OfflineIndicator,
  UpdateAvailableToast,
  InstallPrompt,
} from "@/components/pwa";

// ===========================================
// 🚀 OPTIMIZED METADATA FOR SEO & PERFORMANCE
// ===========================================
export const metadata: Metadata = {
  title: {
    default: "BetaForge - AI-Powered Beta Testing",
    template: "%s | BetaForge",
  },
  description:
    "Autonomous AI agents that test your apps like real humans and deliver detailed bug reports.",
  keywords: [
    "AI testing",
    "beta testing",
    "QA automation",
    "bug detection",
    "Claude AI",
  ],
  authors: [{ name: "BetaForge" }],
  creator: "BetaForge",
  manifest: "/manifest.json",
  applicationName: "BetaForge",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BetaForge",
    startupImage: [
      {
        url: "/splash/apple-splash-2048-2732.png",
        media:
          "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/splash/apple-splash-1668-2388.png",
        media:
          "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/splash/apple-splash-1536-2048.png",
        media:
          "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/splash/apple-splash-1290-2796.png",
        media:
          "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/splash/apple-splash-1179-2556.png",
        media:
          "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/splash/apple-splash-1170-2532.png",
        media:
          "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/splash/apple-splash-1125-2436.png",
        media:
          "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/splash/apple-splash-750-1334.png",
        media:
          "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
    ],
  },
  formatDetection: {
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "BetaForge",
    title: "BetaForge - AI-Powered Beta Testing",
    description: "Autonomous AI agents that test your apps like real humans.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BetaForge - AI-Powered Beta Testing",
    description: "Autonomous AI agents that test your apps like real humans.",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "msapplication-TileColor": "#F97316",
    "msapplication-config": "/browserconfig.xml",
    "msapplication-tap-highlight": "no",
  },
};

// ===========================================
// 🚀 VIEWPORT OPTIMIZATION
// ===========================================
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0F" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* 🚀 PRECONNECT TO CRITICAL ORIGINS */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* 🚀 DNS PREFETCH FOR EXTERNAL RESOURCES */}
        <link rel="dns-prefetch" href="https://api.anthropic.com" />

        {/* 🚀 PREFETCH CRITICAL ROUTES */}
        <link rel="prefetch" href="/dashboard" as="document" />

        {/* 🚀 RESOURCE HINTS */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />

        {/* ============================================ */}
        {/* 📱 PWA - APPLE TOUCH ICONS */}
        {/* ============================================ */}
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icons/icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/icon-180x180.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="/icons/icon-167x167.png"
        />

        {/* 📱 PWA - FAVICON */}
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/favicon-16x16.png"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />

        {/* 📱 PWA - MASK ICON FOR SAFARI */}
        <link
          rel="mask-icon"
          href="/icons/safari-pinned-tab.svg"
          color="#F97316"
        />

        {/* 📱 PWA - WINDOWS TILES */}
        <meta
          name="msapplication-TileImage"
          content="/icons/icon-144x144.png"
        />
      </head>
      <body
        className="font-sans antialiased"
        suppressHydrationWarning
      >
        <PWAProvider>
          <OfflineIndicator />
          {children}
          <UpdateAvailableToast />
          <InstallPrompt variant="toast" />
        </PWAProvider>
      </body>
    </html>
  );
}
