"use client";

import Link from "next/link";
import {
  Sparkles,
  Building2,
  Shield,
  Users,
  Zap,
  Lock,
  HeadphonesIcon,
  Globe,
  Server,
  FileCheck,
  BarChart3,
  Settings,
  ArrowRight,
  Check,
  Clock,
  Award,
  Layers,
  Key,
  Cloud,
  CheckCircle2,
} from "lucide-react";
import { Footer } from "@/components/layout";

const features = [
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "SOC 2 Type II certified with end-to-end encryption, SSO/SAML integration, and comprehensive audit logs.",
  },
  {
    icon: Users,
    title: "Unlimited Team Members",
    description:
      "Add your entire organization with role-based access control, team workspaces, and granular permissions.",
  },
  {
    icon: Zap,
    title: "Unlimited Testing",
    description:
      "No limits on test sessions, projects, or agents. Scale your testing as your organization grows.",
  },
  {
    icon: HeadphonesIcon,
    title: "Dedicated Support",
    description:
      "24/7 dedicated support team, custom onboarding, and a dedicated customer success manager.",
  },
  {
    icon: Server,
    title: "On-Premise Option",
    description:
      "Deploy BetaForge in your own infrastructure for complete data control and compliance.",
  },
  {
    icon: Settings,
    title: "Custom Integrations",
    description:
      "Build custom integrations with your existing tools and workflows with our enterprise API.",
  },
];

const securityFeatures = [
  {
    icon: Lock,
    title: "SOC 2 Type II",
    description: "Annually audited security controls",
  },
  {
    icon: Key,
    title: "SSO & SAML",
    description: "Integrate with Okta, Azure AD, and more",
  },
  {
    icon: Shield,
    title: "Data Encryption",
    description: "AES-256 at rest, TLS 1.3 in transit",
  },
  {
    icon: FileCheck,
    title: "GDPR Compliant",
    description: "Full data privacy compliance",
  },
  {
    icon: Globe,
    title: "Data Residency",
    description: "Choose your data storage region",
  },
  {
    icon: BarChart3,
    title: "Audit Logs",
    description: "Complete activity tracking",
  },
];

const testimonials = [
  {
    quote:
      "BetaForge Enterprise transformed our QA process. We found 40% more bugs before production and reduced testing time by 60%.",
    author: "Sarah Chen",
    role: "VP of Engineering",
    company: "TechCorp Inc.",
    logo: "TC",
  },
  {
    quote:
      "The AI agents catch edge cases our team never would have thought of. It's like having a tireless QA team working 24/7.",
    author: "Michael Rodriguez",
    role: "Director of QA",
    company: "FinanceFlow",
    logo: "FF",
  },
  {
    quote:
      "Enterprise support is phenomenal. Our dedicated CSM helped us customize agents for our specific use cases.",
    author: "Emily Watson",
    role: "CTO",
    company: "HealthTech Solutions",
    logo: "HS",
  },
];

const metrics = [
  { value: "500+", label: "Enterprise Customers" },
  { value: "40%", label: "More Bugs Found" },
  { value: "60%", label: "Faster Testing" },
  { value: "99.9%", label: "Uptime SLA" },
];

const processSteps = [
  {
    step: 1,
    title: "Discovery Call",
    description:
      "We learn about your testing needs, team structure, and security requirements.",
  },
  {
    step: 2,
    title: "Custom Demo",
    description:
      "See BetaForge in action with a demo tailored to your specific use cases.",
  },
  {
    step: 3,
    title: "Proof of Concept",
    description:
      "Run a pilot project to measure real impact on your testing workflow.",
  },
  {
    step: 4,
    title: "Deployment",
    description:
      "Custom onboarding with dedicated support to ensure successful adoption.",
  },
];

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-void-black">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 mesh-bg opacity-30" />
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-neural/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-electric-cyan/10 rounded-full blur-[100px]" />
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
              <Link
                href="/pricing"
                className="text-phantom-gray hover:text-ghost-white text-sm transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/contact?type=enterprise"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-neural to-electric-cyan text-white text-sm font-medium hover:shadow-glow transition-all"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-neural/20 mb-6">
                <Building2 className="w-4 h-4 text-neural-bright" />
                <span className="text-sm text-phantom-gray">
                  Enterprise Solutions
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="text-ghost-white">AI Testing at </span>
                <span className="gradient-text">Enterprise Scale</span>
              </h1>
              <p className="text-lg text-phantom-gray mb-8 leading-relaxed">
                Empower your organization with unlimited AI-powered beta
                testing. Get enterprise-grade security, dedicated support, and
                custom solutions tailored to your needs.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact?type=enterprise"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neural to-electric-cyan text-white font-semibold hover:shadow-glow transition-all"
                >
                  Talk to Sales
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="#demo"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-ghost-white font-semibold hover:border-neural/30 transition-all"
                >
                  Schedule Demo
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-neural/20 to-electric-cyan/20 rounded-3xl blur-3xl" />
              <div className="relative p-8 bg-void-elevated border border-white/10 rounded-3xl">
                <div className="grid grid-cols-2 gap-6">
                  {metrics.map((metric, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                        {metric.value}
                      </div>
                      <div className="text-sm text-phantom-gray">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="relative py-12 px-6 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-sm text-mist-gray mb-8">
            TRUSTED BY ENGINEERING TEAMS AT
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50">
            {[
              "TechCorp",
              "FinanceFlow",
              "HealthTech",
              "DataSys",
              "CloudNine",
              "DevOps Pro",
            ].map((company) => (
              <div key={company} className="text-xl font-bold text-ghost-white">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-ghost-white mb-4">
              Enterprise-Grade Features
            </h2>
            <p className="text-lg text-phantom-gray max-w-2xl mx-auto">
              Everything you need to run AI-powered testing at scale with the
              security and support your organization requires.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-void-elevated border border-white/5 rounded-2xl hover:border-neural/30 transition-all"
              >
                <div className="p-3 rounded-xl bg-gradient-to-br from-neural/20 to-electric-cyan/20 text-neural-bright w-fit mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-ghost-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-phantom-gray">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="relative py-20 px-6 bg-void-elevated/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-quantum-green/10 text-quantum-green text-sm mb-4">
                <Shield className="w-4 h-4" />
                Security & Compliance
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-ghost-white mb-4">
                Security You Can Trust
              </h2>
              <p className="text-lg text-phantom-gray mb-8">
                BetaForge Enterprise meets the highest security standards. Your
                data is protected with enterprise-grade encryption and
                compliance certifications.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {securityFeatures.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-quantum-green/10 text-quantum-green">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-ghost-white text-sm">
                        {item.title}
                      </h4>
                      <p className="text-xs text-phantom-gray">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-quantum-green/10 to-electric-cyan/10 rounded-3xl blur-2xl" />
              <div className="relative p-8 bg-void-black border border-white/10 rounded-3xl">
                <div className="flex items-center gap-4 mb-6">
                  <Award className="w-12 h-12 text-quantum-green" />
                  <div>
                    <h3 className="text-xl font-bold text-ghost-white">
                      SOC 2 Type II
                    </h3>
                    <p className="text-phantom-gray">Certified Compliant</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {[
                    "Annual third-party security audits",
                    "Continuous monitoring and alerting",
                    "Incident response procedures",
                    "Employee security training",
                    "Vendor risk management",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-phantom-gray"
                    >
                      <CheckCircle2 className="w-4 h-4 text-quantum-green" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-ghost-white text-center mb-12">
            Trusted by Industry Leaders
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 bg-void-elevated border border-white/5 rounded-2xl"
              >
                <p className="text-phantom-gray mb-6 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neural to-electric-cyan flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.logo}
                  </div>
                  <div>
                    <p className="font-semibold text-ghost-white">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-mist-gray">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="demo" className="relative py-20 px-6 bg-void-elevated/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-ghost-white mb-4">
              Getting Started is Easy
            </h2>
            <p className="text-lg text-phantom-gray">
              Our enterprise team will guide you through every step of the
              process.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-neural/50 to-transparent z-0" />
                )}
                <div className="relative p-6 bg-void-black border border-white/10 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neural to-electric-cyan flex items-center justify-center text-white font-bold mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold text-ghost-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-phantom-gray">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-12 rounded-3xl overflow-hidden text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-neural/30 to-electric-cyan/30" />
            <div className="absolute inset-0 border border-neural/30 rounded-3xl" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-ghost-white mb-4">
                Ready to Transform Your Testing?
              </h2>
              <p className="text-lg text-phantom-gray mb-8 max-w-xl mx-auto">
                Join 500+ enterprise teams using BetaForge to ship better
                software faster. Let&apos;s discuss how we can help your
                organization.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/contact?type=enterprise"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-neural to-electric-cyan text-white font-semibold hover:shadow-glow transition-all"
                >
                  Contact Sales
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/10 text-ghost-white font-semibold hover:border-neural/30 transition-all"
                >
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
