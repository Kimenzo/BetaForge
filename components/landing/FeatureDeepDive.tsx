"use client";

import { AGENTS } from "@/lib/agents";
import { Terminal, GitBranch, Cpu, Code2, Globe, Lock } from "lucide-react";

export function FeatureDeepDive() {
  return (
    <section className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
             Complete Coverage. <br/>
             <span className="text-gray-400">Zero Effort.</span>
          </h2>
          <p className="text-xl text-gray-500">
            Our multi-agent system covers every aspect of your application, from UI interactions to security vulnerabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-2 gap-6 h-auto md:h-[800px]">
          
          {/* Card 1: Agent Swarm (Large Square) */}
          <div className="col-span-1 md:col-span-4 row-span-2 rounded-3xl bg-gray-50 border border-gray-100 p-8 md:p-12 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <Cpu className="w-96 h-96 animate-spin-slow" />
             </div>
             
             <div className="relative z-10 h-full flex flex-col">
                <div className="mb-auto">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                        <UsersIcon className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">Intelligent Agent Swarm</h3>
                    <p className="text-gray-500 text-lg max-w-md">
                        Each agent has a unique persona and testing strategy. They coordinate to cover more ground than any human team.
                    </p>
                </div>

                {/* Agent Cards Visual */}
                <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {AGENTS.slice(0, 6).map((agent, i) => (
                        <div key={agent.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:scale-105 hover:shadow-md transition-all duration-300 cursor-default">
                             <div className="text-4xl mb-3 animate-bounce-subtle" style={{ animationDelay: `${i * 0.2}s` }}>{["🔍", "⚡", "♿", "📱", "🔥", "✨"][i]}</div>
                             <div className="font-semibold text-gray-900 text-sm">{agent.name}</div>
                             <div className="text-xs text-gray-400 mt-1">{agent.specialization.split(' ')[0]}</div>
                        </div>
                    ))}
                </div>
             </div>
          </div>

          {/* Card 2: Live Debugging (Tall) */}
          <div className="col-span-1 md:col-span-2 row-span-1 rounded-3xl bg-gray-900 text-white p-8 relative overflow-hidden flex flex-col group">
             <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4 text-gray-400">
                    <Terminal className="w-4 h-4" />
                    <span className="text-sm font-mono">Live Logs</span>
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse ml-auto" />
                </div>
                <h3 className="text-xl font-bold mb-4">Real-time Execution</h3>
                <div className="font-mono text-xs space-y-2 text-green-400 opacity-80 group-hover:opacity-100 transition-opacity">
                    <p> {'>'} initializing_agents...</p>
                    <p> {'>'} connected to localhost:3000</p>
                    <p> {'>'} sarah: element_found #btn-submit</p>
                    <p className="text-blue-400"> {'>'} marcus: performance_check_passed (12ms)</p>
                    <p className="text-red-400"> {'>'} diego: injection_attempt_blocked 🛡️</p>
                    <span className="inline-block w-2 h-4 bg-green-500 animate-pulse" />
                </div>
             </div>
          </div>

          {/* Card 3: CI/CD (Wide) */}
          <div className="col-span-1 md:col-span-2 row-span-1 rounded-3xl bg-blue-50 border border-blue-100 p-8 relative overflow-hidden group">
             <div className="relative z-10">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <GitBranch className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Zero-Config CI/CD</h3>
                <p className="text-sm text-gray-500 mb-6">
                    Connect your repo and let BetaForge run on every PR.
                </p>
                {/* Branch Visual */}
                <div className="flex items-center gap-2">
                    <div className="h-8 px-3 rounded bg-white border border-gray-200 flex items-center gap-2 text-xs font-mono text-gray-600">
                        <GitBranch className="w-3 h-3" />
                        main
                    </div>
                    <div className="h-px bg-gray-300 w-8" />
                    <div className="h-8 px-3 rounded bg-green-100 border border-green-200 flex items-center gap-2 text-xs font-mono text-green-700 animate-pulse">
                        <CheckCircle className="w-3 h-3" />
                        Passed
                    </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function UsersIcon({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    );
}

function CheckCircle({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    )
}
