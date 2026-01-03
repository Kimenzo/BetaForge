"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    q: "How does BetaForge access my application?",
    a: "BetaForge connects to your staging or production environment via any publicly accessible URL. For local development, you can use a tunneling service like ngrok to expose your localhost, or deploy to a preview environment (Vercel, Netlify, etc.).",
  },
  {
    q: "Is it safe to run on production?",
    a: "Yes! You can configure agents effectively 'Read Only' or limit them to specific test user accounts. We recommend running 'Diego' (Chaos Tester) only on staging environments with data backups.",
  },
  {
    q: "Do I need to write test scripts?",
    a: "No. That's the beauty of BetaForge. Our agents use Large Language Models (LLMs) to understand your UI like a human. They explore naturally. You can provide high-level directives like 'Test the checkout flow' if you want specific focus.",
  },
  {
    q: "What tech stacks do you support?",
    a: "Everything. Since we interact with the rendered DOM (like a user), it doesn't matter if you use React, Vue, Angular, Ruby on Rails, or plain HTML. If it runs in a browser, we can test it.",
  },
  {
    q: "How much does it cost?",
    a: "We have a generous free tier for hobbyists. Paid plans start at $49/mo for unlimited agent hours and priority queue jumping.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-semibold text-gray-900 pr-8">
                  {faq.q}
                </span>
                {openIndex === i ? (
                  <Minus className="w-5 h-5 text-orange-500 shrink-0" />
                ) : (
                  <Plus className="w-5 h-5 text-gray-400 shrink-0" />
                )}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === i ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-6 pt-0 text-gray-500 leading-relaxed border-t border-gray-50/50">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
