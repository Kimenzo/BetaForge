"use client";

import { X, Check, Clock, Bug, UserX, AlertTriangle, Zap, ShieldCheck } from "lucide-react";

export function ProblemSolution() {
  return (
    <section className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Stop Shipping <span className="text-red-500 line-through decoration-4 decoration-red-500/30">Bugs</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Manual testing is slow, expensive, and error-prone. Upgrade to autonomous intelligence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Problem Card */}
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <UserX className="w-48 h-48 text-red-500" />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-sm font-medium mb-6">
                <AlertTriangle className="w-4 h-4" />
                <span>The Old Way</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Manual QA Testing</h3>
              <ul className="space-y-4">
                {[
                  "Bottleneck for every release",
                  "Inconsistent test coverage",
                  "Expensive to scale teams",
                  "Misses edge cases & race conditions",
                  "Boring, repetitive work for humans"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600">
                    <X className="w-5 h-5 text-red-500 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Solution Card */}
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-orange-100 shadow-xl shadow-orange-500/5 relative overflow-hidden group ring-1 ring-orange-100">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
               <Zap className="w-48 h-48 text-orange-500" />
             </div>
             <div className="relative z-10">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-6">
                 <ShieldCheck className="w-4 h-4" />
                 <span>The BetaForge Way</span>
               </div>
               <h3 className="text-2xl font-bold text-gray-900 mb-6">Autonomous AI Agents</h3>
               <ul className="space-y-4">
                 {[
                   "Instant scalability on demand",
                   "100% consistent execution",
                   "Tests 24/7 without sleep",
                   "Finds deeply buried logic bugs",
                   "Designated agents for security & performance"
                 ].map((item, i) => (
                   <li key={i} className="flex items-start gap-3 text-gray-900 font-medium">
                     <Check className="w-5 h-5 text-green-500 mt-0.5" />
                     <span>{item}</span>
                   </li>
                 ))}
               </ul>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
