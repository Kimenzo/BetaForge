import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Legacy mapping
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        destructive: "var(--destructive)",
        border: "var(--border)",
        ring: "var(--ring)",

        // New Neural Color System
        void: {
          black: "#0A0A0F",
          darker: "#050508",
          surface: "#0D0D14",
          elevated: "#12121A",
        },
        neural: {
          DEFAULT: "#8B5CF6",
          bright: "#A78BFA",
          dim: "#7C3AED",
          deep: "#5B21B6",
        },
        electric: {
          cyan: "#06B6D4",
        },
        plasma: {
          pink: "#EC4899",
        },
        quantum: {
          green: "#10B981",
        },
        photon: {
          yellow: "#F59E0B",
        },
        ember: {
          orange: "#F97316",
        },
        crimson: {
          red: "#EF4444",
        },
        ghost: {
          white: "#F8FAFC",
        },
        phantom: {
          gray: "#94A3B8",
        },
        mist: {
          gray: "#64748B",
        },
        shadow: {
          gray: "#475569",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
        "2xl": "1.5rem",
      },
      fontFamily: {
        sans: ["var(--font-primary)", "system-ui", "sans-serif"],
        display: ["var(--font-primary)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      fontSize: {
        "fluid-xs": "var(--text-xs)",
        "fluid-sm": "var(--text-sm)",
        "fluid-base": "var(--text-base)",
        "fluid-lg": "var(--text-lg)",
        "fluid-xl": "var(--text-xl)",
        "fluid-2xl": "var(--text-2xl)",
        "fluid-3xl": "var(--text-3xl)",
        "fluid-4xl": "var(--text-4xl)",
        "fluid-5xl": "var(--text-5xl)",
        "fluid-6xl": "var(--text-6xl)",
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out forwards",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
        "slide-in-left": "slide-in-left 0.4s ease-out forwards",
        "slide-in-right": "slide-in-right 0.4s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        "glow-breathe": "glow-breathe 3s ease-in-out infinite",
        "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
        shimmer: "shimmer 1.5s infinite",
        "pulse-ring": "pulse-ring 2s ease-out infinite",
        "mesh-float": "mesh-float 20s ease-in-out infinite",
        "spin-slow": "spin-slow 3s linear infinite",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(30px) scale(0.95)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.9)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "glow-breathe": {
          "0%, 100%": {
            boxShadow:
              "0 0 20px rgba(139, 92, 246, 0.2), 0 0 40px rgba(139, 92, 246, 0.1)",
          },
          "50%": {
            boxShadow:
              "0 0 30px rgba(139, 92, 246, 0.4), 0 0 60px rgba(139, 92, 246, 0.2)",
          },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "1" },
          "100%": { transform: "scale(2)", opacity: "0" },
        },
        "mesh-float": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "mesh-gradient": `
          radial-gradient(at 20% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
          radial-gradient(at 80% 70%, rgba(6, 182, 212, 0.15) 0%, transparent 50%),
          radial-gradient(at 50% 50%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)
        `,
        "neural-gradient": "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)",
        "void-gradient": "linear-gradient(180deg, #0A0A0F 0%, #050508 100%)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.2)",
        "glow-intense":
          "0 0 30px rgba(139, 92, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.3)",
        "glow-cyan":
          "0 0 20px rgba(6, 182, 212, 0.3), 0 0 40px rgba(6, 182, 212, 0.2)",
        "glow-pink":
          "0 0 20px rgba(236, 72, 153, 0.3), 0 0 40px rgba(236, 72, 153, 0.2)",
        "glow-green":
          "0 0 20px rgba(16, 185, 129, 0.3), 0 0 40px rgba(16, 185, 129, 0.2)",
        "inner-glow": "inset 0 0 20px rgba(139, 92, 246, 0.1)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "out-back": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "in-out-circ": "cubic-bezier(0.85, 0, 0.15, 1)",
        "spring": "cubic-bezier(0.34, 1.2, 0.64, 1)",
      },
      backdropBlur: {
        xs: "2px",
      },
      // GPU-accelerated animation presets
      transitionProperty: {
        "gpu": "transform, opacity",
        "colors-gpu": "color, background-color, border-color, opacity",
      },
      // Performance-optimized durations
      transitionDuration: {
        "instant": "50ms",
        "fast": "150ms",
        "normal": "300ms",
        "slow": "500ms",
      },
    },
  },
  // ===========================================
  // 🚀 PERFORMANCE OPTIMIZATIONS
  // ===========================================
  future: {
    hoverOnlyWhenSupported: true, // Reduces CSS for touch devices
  },
  plugins: [],
} satisfies Config;
