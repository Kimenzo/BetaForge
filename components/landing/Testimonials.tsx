"use client";

import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Alex Rivera",
    role: "CTO @ TechFlow",
    text: "BetaForge caught a critical race condition that our manual QA team missed for weeks. It paid for itself in one day.",
    avatar: "AR"
  },
  {
    name: "Sarah Chen",
    role: "Lead Dev @ StartUp",
    text: "The 'Diego' agent is terrifyingly good at finding security holes. Better he finds them than a hacker.",
    avatar: "SC"
  },
  {
    name: "James Wilson",
    role: "Product Manager",
    text: "I love the clean reports. I just forward them to the dev team and they know exactly what to fix.",
    avatar: "JW"
  },
  {
    name: "Emily Davis",
    role: "Frontend Engineer",
    text: "Finally, I can push code on Fridays without fear. BetaForge checks everything in 5 minutes.",
    avatar: "ED"
  },
  {
    name: "Michael Chang",
    role: "Founder",
    text: "It's like hiring a team of senior QA engineers for the price of a lunch.",
    avatar: "MC"
  }
];

export function Testimonials() {
  return (
    <section className="py-24 overflow-hidden bg-white">
      <div className="text-center mb-16 px-6">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
          Engineers ❤️ BetaForge
        </h2>
        <p className="text-xl text-gray-500">
          Join hundreds of teams shipping bug-free code.
        </p>
      </div>

      {/* Marquee Container */}
      <div className="relative w-full overflow-hidden mask-gradient">
        {/* Gradient Masks */}
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10" />

        {/* Scrolling Content */}
        <div className="flex gap-6 animate-marquee w-max px-6">
          {[...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
            <div
              key={i}
              className="w-[350px] p-8 rounded-2xl bg-gray-50 border border-gray-100/50 flex flex-col gap-6 hover:bg-orange-50/30 transition-colors"
            >
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed font-medium">"{t.text}"</p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500 text-sm">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{t.name}</h4>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Inline styles for custom marquee if not in globals */}
      <style jsx>{`
        .mask-gradient {
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.33%); } /* Adjust based on duplication count */
        }
        .animate-marquee {
            animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
            animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
