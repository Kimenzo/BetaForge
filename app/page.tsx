import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { Footer } from "@/components/layout";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { HeroSection } from "@/components/landing/HeroSection";
import { SocialProof } from "@/components/landing/SocialProof";
import { ProblemSolution } from "@/components/landing/ProblemSolution";
import { FeatureDeepDive } from "@/components/landing/FeatureDeepDive";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden selection:bg-orange-100 selection:text-orange-900">
      {/* Background Gradients (Global) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-gradient-to-br from-orange-50/80 via-amber-50/50 to-transparent rounded-full blur-[100px] opacity-60 animate-blob" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-50/60 via-purple-50/30 to-transparent rounded-full blur-[100px] opacity-60 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-40 left-20 w-[600px] h-[600px] bg-gradient-to-tr from-pink-50/50 via-rose-50/30 to-transparent rounded-full blur-[100px] opacity-50 animate-blob animation-delay-4000" />
      </div>

      <LandingHeader />

      <main className="relative z-10">
        <HeroSection />
        <SocialProof />
        <ProblemSolution />
        <FeatureDeepDive />
        <HowItWorks />
        <Testimonials />
        <FAQ />

        {/* Final CTA */}
        <section className="py-32 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gray-900 z-0">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
              Ready to build the <br />
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-600 pb-1">
                future of software?
              </span>
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Stop letting bugs reach production. Deploy your autonomous QA team
              today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-gray-900 font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-xl shadow-white/10 flex items-center justify-center gap-2"
              >
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-gray-400 mt-4 sm:mt-0">
                No credit card required
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
