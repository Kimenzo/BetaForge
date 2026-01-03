"use client";

import Link from "next/link";
import { ArrowRight, Users, ChevronRight, Search, Eye, TrendingUp, Sparkles, Command, Activity, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Badge */}
        <div className="flex justify-center mb-8 animate-fade-in-up stagger-1">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-200 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-default">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-sm text-orange-700 font-medium">
              Powered by Claude AI
            </span>
            <ChevronRight className="w-4 h-4 text-orange-400" />
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-center text-4xl md:text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-8 animate-fade-in-up stagger-2 text-balance">
          <span className="text-orange-500 italic">AI-Powered Testing:</span>
          <br />
          <span className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent">
            Ship with confidence
          </span>
        </h1>

        <p className="text-center text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 animate-fade-in-up stagger-3 leading-relaxed">
           Deploy autonomous AI agents that explore, test, and break your app before your users do.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-fade-in-up stagger-4">
          <Link href="/signup" className="group flex items-center gap-2 px-8 py-4 rounded-full bg-gray-900 text-white font-medium text-lg transition-all duration-300 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 ring-offset-2 focus:ring-2 ring-gray-900">
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/agents"
            className="flex items-center gap-2 px-8 py-4 rounded-full bg-white border border-gray-200 text-gray-900 font-medium text-lg transition-all duration-300 hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5"
          >
            <Users className="w-5 h-5 text-orange-500" />
            <span>Meet the Agents</span>
          </Link>
        </div>

        {/* Glass Dashboard Preview */}
        <div className="relative mx-auto max-w-5xl animate-fade-in-up stagger-5 perspective-1000">
          <div className="animate-float">
            {/* Dashboard Container - Glassmorphism */}
            <div className="relative rounded-2xl border border-white/50 bg-white/40 backdrop-blur-xl shadow-2xl overflow-hidden transform rotate-x-6 hover:rotate-x-0 transition-all duration-700 ease-out-expo group">
              
              {/* Mock Header */}
              <div className="h-12 border-b border-gray-100/50 flex items-center px-4 gap-4 bg-white/50">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/80 animate-pulse" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/80 animate-pulse delay-75" />
                  <div className="w-3 h-3 rounded-full bg-green-400/80 animate-pulse delay-150" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-gray-100/50 rounded-md px-3 py-1 text-xs text-gray-400 font-mono w-64 text-center">
                     betaforge.app/dashboard
                  </div>
                </div>
              </div>

              {/* Mock Content */}
              <div className="p-6 grid grid-cols-12 gap-6 h-[400px]">
                
                {/* Sidebar */}
                <div className="hidden md:flex col-span-2 flex-col gap-4 border-r border-gray-100/50 pr-4">
                   <div className="h-8 w-24 bg-gray-200/50 rounded-lg animate-pulse" />
                   <div className="space-y-2">
                      {[1, 2, 3, 4].map(i => (
                          <div key={i} className="h-6 w-full bg-gray-100/50 rounded-md" />
                      ))}
                   </div>
                </div>

                {/* Main Area */}
                <div className="col-span-12 md:col-span-10 flex flex-col gap-6">
                   {/* Stats Row */}
                   <div className="grid grid-cols-3 gap-4">
                      {[
                          { label: "Active Agents", val: "6", color: "bg-green-100 text-green-700" },
                          { label: "Bugs Found", val: "24", color: "bg-red-100 text-red-700" },
                          { label: "Test Coverage", val: "92%", color: "bg-blue-100 text-blue-700" }
                      ].map((stat, i) => (
                          <div key={i} className="p-4 rounded-xl bg-white/60 shadow-sm border border-white/60 flex flex-col items-center justify-center transition-transform hover:scale-105 duration-300">
                              <span className="text-sm text-gray-500">{stat.label}</span>
                              <span className={`text-2xl font-bold ${stat.color} px-2 py-0.5 rounded-lg mt-1`}>{stat.val}</span>
                          </div>
                      ))}
                   </div>

                   {/* Activity Feed / Terminal */}
                   <div className="flex-1 rounded-xl bg-gray-900 text-gray-300 p-4 font-mono text-xs overflow-hidden leading-relaxed shadow-inner relative group/terminal">
                      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-gray-900 to-transparent pointer-events-none" />
                      <div className="space-y-2">
                          <div className="flex gap-2"><span className="text-green-400">➜</span> <span>Initialize System...</span></div>
                          <div className="flex gap-2"><span className="text-green-400">✓</span> <span>Agents deployed: Sarah, Marcus, Diego</span></div>
                          <div className="flex gap-2"><span className="text-blue-400">ℹ</span> <span>Sarah is exploring /checkout flow...</span></div>
                          <div className="flex gap-2"><span className="text-yellow-400">⚠</span> <span>Diego injected SQL payload on login inputs</span></div>
                          <div className="flex gap-2"><span className="text-red-400">✖</span> <span>Critical Error detected in Payment Gateway</span></div>
                           <div className="flex gap-2 pl-4 text-red-300/80">
                               TypeError: Cannot read property 'amount' of undefined
                          </div>
                          <div className="flex gap-2"><span className="text-green-400">✓</span> <span>Generating report...</span></div>
                           <div className="animate-pulse text-gray-500">_</div>
                      </div>
                   </div>
                </div>
              </div>

              {/* Reflection Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
            </div>
            
            {/* Shadow/Glow underneath */}
            <div className="absolute -inset-4 bg-orange-500/20 blur-3xl -z-10 rounded-[3rem]" />
          </div>
        </div>
      </div>
    </section>
  );
}
