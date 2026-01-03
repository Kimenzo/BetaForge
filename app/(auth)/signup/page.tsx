import Link from "next/link";
import { Bot, ArrowRight, SkipForward, Check } from "lucide-react";
import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-void-black flex items-center justify-center p-6">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-neural/10 via-void-black to-electric-cyan/5" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neural/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-electric-cyan/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
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
          <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-phantom-gray mb-6">Start testing with AI agents in under 60 seconds.</p>

          {/* Benefits */}
          <div className="flex flex-col gap-2 mb-8 text-left">
            {[
              "6 AI agents with unique testing personas",
              "Unlimited test sessions on free tier",
              "Real-time bug reports with reproduction steps",
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-phantom-gray">
                <Check className="w-4 h-4 text-quantum-green flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          {/* Kinde Register Button */}
          <RegisterLink className="w-full h-14 rounded-xl bg-gradient-to-r from-neural to-electric-cyan text-white font-semibold hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 mb-4">
            Create Account
            <ArrowRight className="w-4 h-4" />
          </RegisterLink>

          {/* Maybe Later - Guest Access */}
          <Link
            href="/dashboard"
            className="w-full h-12 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 text-phantom-gray hover:text-white"
          >
            <SkipForward className="w-4 h-4" />
            Maybe later - Explore as guest
          </Link>
        </div>

        {/* Sign In Link */}
        <p className="text-sm text-phantom-gray mt-6">
          Already have an account?{" "}
          <LoginLink className="text-neural hover:text-neural-bright transition-colors font-medium">
            Sign in
          </LoginLink>
        </p>
      </div>
    </div>
  );
}
