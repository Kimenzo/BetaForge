"use client";

import { Github, Settings, FileText } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: Github,
      title: "Connect Your Repo",
      desc: "One-click integration with GitHub, GitLab, or Bitbucket. We auto-detect your stack.",
      color: "bg-gray-900 text-white",
    },
    {
      icon: Settings,
      title: "Select Agents",
      desc: "Choose the perfect personas for your testing needs. From UI explorers to security experts.",
      color: "bg-orange-500 text-white",
    },
    {
      icon: FileText,
      title: "Get Actionable Reports",
      desc: "Receive clear, human-readable bug reports with reproduction steps and video proof.",
      color: "bg-blue-600 text-white",
    },
  ];

  return (
    <section className="py-24 bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-orange-600 font-semibold tracking-wider text-sm uppercase">Workflow</span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mt-3 mb-6">
            From Code to Confidence <br className="hidden md:block"/> in 3 Steps
          </h2>
        </div>

        <div className="relative grid md:grid-cols-3 gap-12">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-200">
            <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-orange-400 to-transparent w-1/3 animate-shimmer" />
          </div>

          {steps.map((step, i) => (
            <div key={i} className="relative flex flex-col items-center text-center group">
              {/* Icon Circle */}
              <div
                className={`w-24 h-24 rounded-3xl ${step.color} flex items-center justify-center shadow-xl mb-8 relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3`}
              >
                <step.icon className="w-10 h-10" />
                {/* Number Badge */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center font-bold text-gray-900 text-sm shadow-md">
                    {i + 1}
                </div>
              </div>

              {/* Text */}
              <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
              <p className="text-gray-500 leading-relaxed max-w-sm">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
