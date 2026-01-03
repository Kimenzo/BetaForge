"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Sparkles,
  Check,
  X,
  Zap,
  Building2,
  Users,
  ArrowRight,
  HelpCircle,
  Shield,
  Clock,
  Headphones,
  ChevronDown,
  Star,
} from "lucide-react";
import { Footer } from "@/components/layout";

const plans = [
  {
    name: "Free",
    description: "Perfect for trying out BetaForge",
    price: { monthly: 0, yearly: 0 },
    popular: false,
    cta: "Get Started Free",
    ctaLink: "/signup",
    features: [
      { text: "1 project", included: true },
      { text: "3 test sessions/month", included: true },
      { text: "2 AI agents per session", included: true },
      { text: "Basic bug reports", included: true },
      { text: "Community support", included: true },
      { text: "7-day report retention", included: true },
      { text: "API access", included: false },
      { text: "CI/CD integrations", included: false },
      { text: "Custom agents", included: false },
      { text: "Priority support", included: false },
    ],
  },
  {
    name: "Pro",
    description: "For growing teams and projects",
    price: { monthly: 49, yearly: 39 },
    popular: true,
    cta: "Start Pro Trial",
    ctaLink: "/signup?plan=pro",
    features: [
      { text: "10 projects", included: true },
      { text: "100 test sessions/month", included: true },
      { text: "6 AI agents per session", included: true },
      { text: "Detailed bug reports with steps", included: true },
      { text: "Email support", included: true },
      { text: "90-day report retention", included: true },
      { text: "Full API access", included: true },
      { text: "GitHub, GitLab, Bitbucket", included: true },
      { text: "Custom agents", included: false },
      { text: "Priority support", included: false },
    ],
  },
  {
    name: "Team",
    description: "For collaborative testing teams",
    price: { monthly: 149, yearly: 119 },
    popular: false,
    cta: "Start Team Trial",
    ctaLink: "/signup?plan=team",
    features: [
      { text: "Unlimited projects", included: true },
      { text: "500 test sessions/month", included: true },
      { text: "6 AI agents per session", included: true },
      { text: "Advanced reports + analytics", included: true },
      { text: "Priority email support", included: true },
      { text: "1-year report retention", included: true },
      { text: "Full API access", included: true },
      { text: "All CI/CD integrations", included: true },
      { text: "3 custom agent personas", included: true },
      { text: "Slack & Jira integration", included: true },
    ],
  },
  {
    name: "Enterprise",
    description: "For large organizations",
    price: { monthly: null, yearly: null },
    popular: false,
    cta: "Contact Sales",
    ctaLink: "/contact?type=enterprise",
    features: [
      { text: "Unlimited everything", included: true },
      { text: "Unlimited test sessions", included: true },
      { text: "Parallel agent execution", included: true },
      { text: "Custom reporting & exports", included: true },
      { text: "24/7 dedicated support", included: true },
      { text: "Unlimited retention", included: true },
      { text: "Custom API limits", included: true },
      { text: "Custom integrations", included: true },
      { text: "Unlimited custom agents", included: true },
      { text: "SSO, SAML, SOC 2", included: true },
    ],
  },
];

const faqs = [
  {
    question: "What counts as a test session?",
    answer:
      "A test session is a single run of AI agents against your application. Each session can include multiple agents testing simultaneously, and generates a comprehensive report with all discovered bugs.",
  },
  {
    question: "Can I change plans at any time?",
    answer:
      "Yes! You can upgrade or downgrade your plan at any time. When upgrading, you'll get immediate access to new features. When downgrading, changes take effect at the end of your billing cycle.",
  },
  {
    question: "What happens if I exceed my session limit?",
    answer:
      "We'll notify you when you're approaching your limit. You can either upgrade your plan or purchase additional session packs. We never stop your testing unexpectedly.",
  },
  {
    question: "Do you offer discounts for startups or non-profits?",
    answer:
      "Yes! We offer 50% off for verified startups (under $5M funding) and 30% off for registered non-profit organizations. Contact us to apply for these discounts.",
  },
  {
    question: "What's included in the free trial?",
    answer:
      "Pro and Team plans come with a 14-day free trial with full access to all features. No credit card required to start. You'll only be charged if you decide to continue after the trial.",
  },
  {
    question: "How does annual billing work?",
    answer:
      "Annual billing saves you 20% compared to monthly billing. You're billed once per year, and you can cancel anytime with a prorated refund for unused months.",
  },
];

const comparisonFeatures = [
  { name: "Projects", free: "1", pro: "10", team: "Unlimited", enterprise: "Unlimited" },
  { name: "Test Sessions/Month", free: "3", pro: "100", team: "500", enterprise: "Unlimited" },
  { name: "Agents per Session", free: "2", pro: "6", team: "6", enterprise: "Unlimited" },
  { name: "Report Retention", free: "7 days", pro: "90 days", team: "1 year", enterprise: "Unlimited" },
  { name: "API Access", free: "—", pro: "✓", team: "✓", enterprise: "Custom" },
  { name: "CI/CD Integrations", free: "—", pro: "✓", team: "✓", enterprise: "✓" },
  { name: "Custom Agents", free: "—", pro: "—", team: "3", enterprise: "Unlimited" },
  { name: "SSO/SAML", free: "—", pro: "—", team: "—", enterprise: "✓" },
  { name: "Support", free: "Community", pro: "Email", team: "Priority", enterprise: "24/7 Dedicated" },
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-void-black">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 mesh-bg opacity-30" />
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-neural/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-electric-cyan/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-void-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-neural-bright to-electric-cyan flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">BetaForge</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-phantom-gray hover:text-ghost-white text-sm transition-colors">
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-lg bg-neural/20 text-ghost-white text-sm font-medium hover:bg-neural/30 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-neural/20 mb-6">
            <Zap className="w-4 h-4 text-neural-bright" />
            <span className="text-sm text-phantom-gray">Simple, transparent pricing</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-ghost-white">Choose Your </span>
            <span className="gradient-text">Testing Power</span>
          </h1>
          <p className="text-lg text-phantom-gray max-w-2xl mx-auto mb-10">
            Start free and scale as you grow. All plans include our full suite of AI agents
            and comprehensive bug reports.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-1.5 bg-void-elevated rounded-xl border border-white/10">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                !isYearly
                  ? "bg-neural/20 text-ghost-white"
                  : "text-phantom-gray hover:text-ghost-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                isYearly
                  ? "bg-neural/20 text-ghost-white"
                  : "text-phantom-gray hover:text-ghost-white"
              }`}
            >
              Yearly
              <span className="px-2 py-0.5 bg-quantum-green/20 text-quantum-green text-xs rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="relative py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-6 rounded-2xl border transition-all ${
                  plan.popular
                    ? "bg-gradient-to-b from-neural/10 to-void-elevated border-neural/30 ring-1 ring-neural/20"
                    : "bg-void-elevated border-white/5 hover:border-white/10"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-neural to-electric-cyan rounded-full text-xs font-semibold text-white flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-ghost-white mb-1">{plan.name}</h3>
                  <p className="text-sm text-phantom-gray">{plan.description}</p>
                </div>

                <div className="mb-6">
                  {plan.price.monthly !== null ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-ghost-white">
                        ${isYearly ? plan.price.yearly : plan.price.monthly}
                      </span>
                      <span className="text-phantom-gray">/month</span>
                    </div>
                  ) : (
                    <div className="text-2xl font-bold text-ghost-white">Custom Pricing</div>
                  )}
                  {isYearly && plan.price.monthly !== null && plan.price.monthly > 0 && (
                    <p className="text-sm text-quantum-green mt-1">
                      Save ${(plan.price.monthly - plan.price.yearly) * 12}/year
                    </p>
                  )}
                </div>

                <Link
                  href={plan.ctaLink}
                  className={`block w-full py-3 rounded-xl font-semibold text-center transition-all mb-6 ${
                    plan.popular
                      ? "bg-gradient-to-r from-neural to-electric-cyan text-white hover:shadow-glow"
                      : "bg-void-black border border-white/10 text-ghost-white hover:border-neural/30"
                  }`}
                >
                  {plan.cta}
                </Link>

                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className={`flex items-start gap-3 text-sm ${
                        feature.included ? "text-phantom-gray" : "text-mist-gray"
                      }`}
                    >
                      {feature.included ? (
                        <Check className="w-4 h-4 text-quantum-green mt-0.5 flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-mist-gray mt-0.5 flex-shrink-0" />
                      )}
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="relative py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-ghost-white text-center mb-12">
            Compare Plans
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-phantom-gray font-medium">Feature</th>
                  <th className="text-center py-4 px-4 text-ghost-white font-semibold">Free</th>
                  <th className="text-center py-4 px-4 text-ghost-white font-semibold">Pro</th>
                  <th className="text-center py-4 px-4 text-ghost-white font-semibold">Team</th>
                  <th className="text-center py-4 px-4 text-ghost-white font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <tr key={index} className="border-b border-white/5">
                    <td className="py-4 px-4 text-phantom-gray">{feature.name}</td>
                    <td className="py-4 px-4 text-center text-phantom-gray">{feature.free}</td>
                    <td className="py-4 px-4 text-center text-phantom-gray">{feature.pro}</td>
                    <td className="py-4 px-4 text-center text-phantom-gray">{feature.team}</td>
                    <td className="py-4 px-4 text-center text-phantom-gray">{feature.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="relative py-12 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-6 bg-void-elevated border border-white/5 rounded-xl">
              <Shield className="w-10 h-10 text-quantum-green" />
              <div>
                <h4 className="font-semibold text-ghost-white">SOC 2 Compliant</h4>
                <p className="text-sm text-phantom-gray">Enterprise-grade security</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 bg-void-elevated border border-white/5 rounded-xl">
              <Clock className="w-10 h-10 text-electric-cyan" />
              <div>
                <h4 className="font-semibold text-ghost-white">14-Day Free Trial</h4>
                <p className="text-sm text-phantom-gray">No credit card required</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 bg-void-elevated border border-white/5 rounded-xl">
              <Headphones className="w-10 h-10 text-plasma-pink" />
              <div>
                <h4 className="font-semibold text-ghost-white">Expert Support</h4>
                <p className="text-sm text-phantom-gray">We're here to help</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-ghost-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-white/5 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left bg-void-elevated hover:bg-void-elevated/80 transition-colors"
                >
                  <span className="font-medium text-ghost-white">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-phantom-gray transition-transform ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5 text-phantom-gray">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-12 rounded-3xl overflow-hidden text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-neural/20 to-electric-cyan/20" />
            <div className="absolute inset-0 border border-neural/30 rounded-3xl" />
            <div className="relative">
              <Building2 className="w-12 h-12 text-neural-bright mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-ghost-white mb-4">
                Need Enterprise Features?
              </h2>
              <p className="text-phantom-gray mb-8 max-w-xl mx-auto">
                Get custom pricing, dedicated support, SSO, and advanced security features
                tailored to your organization&apos;s needs.
              </p>
              <Link
                href="/enterprise"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-neural to-electric-cyan text-white font-semibold hover:shadow-glow transition-all"
              >
                Learn About Enterprise
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
