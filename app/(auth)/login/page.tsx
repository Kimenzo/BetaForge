import Link from "next/link";
import { Bot, ArrowRight, SkipForward } from "lucide-react";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-void-black flex items-center justify-center p-6">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-electric-cyan/10 via-void-black to-neural/5" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-electric-cyan/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-neural/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 w-full max-w-md text-center">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neural to-electric-cyan flex items-center justify-center">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">BetaForge</span>
        </Link>

        {/* Card */}
        <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <h1 className="text-2xl font-bold text-white mb-2">Welcome back!</h1>
          <p className="text-phantom-gray mb-8">Sign in to access your dashboard and AI agents.</p>

          {/* Kinde Login Button */}
          <LoginLink className="w-full h-14 rounded-xl bg-gradient-to-r from-neural to-electric-cyan text-white font-semibold hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 mb-4">
            Sign In
            <ArrowRight className="w-4 h-4" />
          </LoginLink>

          {/* Maybe Later - Guest Access */}
          <Link
            href="/dashboard"
            className="w-full h-12 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 text-phantom-gray hover:text-white"
          >
            <SkipForward className="w-4 h-4" />
            Maybe later - Continue as guest
          </Link>
        </div>

        {/* Sign Up Link */}
        <p className="text-sm text-phantom-gray mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-neural hover:text-neural-bright transition-colors font-medium">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}
