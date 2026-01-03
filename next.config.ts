import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // ===========================================
  // 🚀 BETAFORGE PERFORMANCE OPTIMIZATION
  // Targeting top 1% app performance
  // ===========================================

  turbopack: {
    root: path.resolve(__dirname),
  },

  // ===========================================
  // EXPERIMENTAL FEATURES FOR MAXIMUM SPEED
  // ===========================================
  experimental: {
    // Optimize package imports - tree shake heavy libraries
    optimizePackageImports: [
      "lucide-react",
      "@supabase/supabase-js",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
    ],
    // Optimized CSS bundling
    optimizeCss: true,
    // Server Actions optimization
    serverActions: {
      bodySizeLimit: "2mb",
    },
    // Staleness tracking for better caching
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },

  // ===========================================
  // IMAGE OPTIMIZATION
  // ===========================================
  images: {
    // Use modern formats
    formats: ["image/avif", "image/webp"],
    // Optimize device sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // Enable minimumCacheTTL for edge caching
    minimumCacheTTL: 31536000, // 1 year
    // Remote patterns for external images
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // ===========================================
  // COMPILER OPTIMIZATIONS
  // ===========================================
  compiler: {
    // Remove console.log in production
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  // ===========================================
  // HEADERS FOR OPTIMAL CACHING & PERFORMANCE
  // ===========================================
  async headers() {
    return [
      {
        // Cache static assets aggressively
        source: "/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache JS/CSS with long TTL
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Security and performance headers for all routes
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // ===========================================
  // BUNDLE OPTIMIZATION
  // ===========================================
  poweredByHeader: false, // Remove X-Powered-By header

  // Enable compression
  compress: true,

  // Generate ETags for caching
  generateEtags: true,

  // Strict mode for better performance patterns
  reactStrictMode: true,

  // Output optimization
  output: "standalone",

  // Webpack optimization for production
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev) {
      // Enable module concatenation
      config.optimization = {
        ...config.optimization,
        moduleIds: "deterministic",
        splitChunks: {
          chunks: "all",
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            // Vendor chunk for heavy dependencies
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              chunks: "all",
              priority: 10,
            },
            // Common chunk for shared code
            common: {
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    // Enable tree shaking for Lucide icons
    config.resolve.alias = {
      ...config.resolve.alias,
      "lucide-react": "lucide-react/dist/esm/lucide-react",
    };

    return config;
  },
};

export default nextConfig;
