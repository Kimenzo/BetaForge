"use client";

import Link from "next/link";
import {
  Sparkles,
  Shield,
  Lock,
  Key,
  Eye,
  Server,
  Globe,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Users,
  Clock,
  RefreshCw,
  Database,
  Fingerprint,
  ShieldCheck,
  Building2,
  Mail,
} from "lucide-react";
import { Footer } from "@/components/layout";

const securityPrinciples = [
  {
    icon: Lock,
    title: "Encryption Everywhere",
    description:
      "All data is encrypted at rest using AES-256 and in transit using TLS 1.3. Your test data and bug reports are always protected.",
  },
  {
    icon: Key,
    title: "Secure Authentication",
    description:
      "Support for SSO, SAML 2.0, and multi-factor authentication. API keys are hashed and can be rotated at any time.",
  },
  {
    icon: Eye,
    title: "Privacy by Design",
    description:
      "We collect only essential data. Your application source code is never stored. Test sessions access only public-facing URLs.",
  },
  {
    icon: Server,
    title: "Infrastructure Security",
    description:
      "Hosted on SOC 2 compliant cloud infrastructure with 24/7 monitoring, automated backups, and disaster recovery.",
  },
];

const certifications = [
  {
    name: "SOC 2 Type II",
    description:
      "Comprehensive security audit covering security, availability, and confidentiality",
    icon: ShieldCheck,
    status: "Certified",
  },
  {
    name: "GDPR",
    description: "Full compliance with EU data protection regulations",
    icon: Globe,
    status: "Compliant",
  },
  {
    name: "CCPA",
    description: "California Consumer Privacy Act compliance",
    icon: FileCheck,
    status: "Compliant",
  },
  {
    name: "ISO 27001",
    description: "International standard for information security management",
    icon: Shield,
    status: "In Progress",
  },
];

const securityFeatures = [
  {
    category: "Data Protection",
    items: [
      "AES-256 encryption at rest",
      "TLS 1.3 encryption in transit",
      "Customer-managed encryption keys (Enterprise)",
      "Automatic data backup with point-in-time recovery",
      "Secure data deletion upon request",
    ],
  },
  {
    category: "Access Control",
    items: [
      "Role-based access control (RBAC)",
      "Single Sign-On (SSO) with SAML 2.0",
      "Multi-factor authentication (MFA)",
      "Session timeout and management",
      "IP allowlisting (Enterprise)",
    ],
  },
  {
    category: "Infrastructure",
    items: [
      "SOC 2 compliant cloud hosting",
      "99.9% uptime SLA",
      "DDoS protection",
      "Web Application Firewall (WAF)",
      "Isolated tenant environments",
    ],
  },
  {
    category: "Monitoring & Response",
    items: [
      "24/7 security monitoring",
      "Real-time threat detection",
      "Comprehensive audit logs",
      "Incident response procedures",
      "Regular penetration testing",
    ],
  },
];

const dataHandling = [
  {
    icon: Database,
    title: "What We Store",
    items: [
      "Test session metadata and configurations",
      "Bug reports and screenshots",
      "User account information",
      "API usage logs",
    ],
  },
  {
    icon: Eye,
    title: "What We Don't Store",
    items: [
      "Your application source code",
      "User credentials or passwords from tested apps",
      "Personal data of your end users",
      "Payment card information (handled by Stripe)",
    ],
  },
];

const faq = [
  {
    question: "How does BetaForge access my application?",
    answer:
      "BetaForge agents access your application through publicly accessible URLs that you provide, similar to how a real user would. We never require access to your source code, internal networks, or production databases.",
  },
  {
    question: "Where is my data stored?",
    answer:
      "Data is stored in secure, SOC 2 compliant data centers. By default, data is stored in the US, but enterprise customers can choose their preferred data residency region (US, EU, or APAC).",
  },
  {
    question: "Can I delete my data?",
    answer:
      "Yes. You can delete individual test sessions, bug reports, or your entire account at any time. Data is permanently removed within 30 days of deletion request, in compliance with data retention regulations.",
  },
  {
    question: "Do you share data with third parties?",
    answer:
      "We do not sell or share your data with third parties for marketing purposes. Data is only shared with service providers essential to operating BetaForge (e.g., cloud hosting), and all providers are contractually bound to our security standards.",
  },
  {
    question: "How do you handle security incidents?",
    answer:
      "We have a comprehensive incident response plan. In the event of a security incident affecting your data, we will notify affected customers within 72 hours with details about the incident and remediation steps.",
  },
];

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-void-black">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 mesh-bg opacity-30" />
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-quantum-green/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-neural/10 rounded-full blur-[100px]" />
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
                href="/enterprise"
                className="text-phantom-gray hover:text-ghost-white text-sm transition-colors"
              >
                Enterprise
              </Link>
              <Link
                href="/contact"
                className="px-4 py-2 rounded-lg bg-neural/20 text-ghost-white text-sm font-medium hover:bg-neural/30 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-quantum-green/20 mb-6">
            <Shield className="w-4 h-4 text-quantum-green" />
            <span className="text-sm text-phantom-gray">
              Security & Privacy
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-ghost-white">Your Security is Our </span>
            <span className="gradient-text">Top Priority</span>
          </h1>
          <p className="text-lg text-phantom-gray max-w-2xl mx-auto mb-8">
            BetaForge is built with enterprise-grade security from the ground
            up. We protect your data with industry-leading practices and
            certifications.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="#certifications"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neural to-electric-cyan text-white font-semibold hover:shadow-glow transition-all"
            >
              View Certifications
            </Link>
            <Link
              href="/contact?type=security"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-ghost-white font-semibold hover:border-neural/30 transition-all"
            >
              Security Questionnaire
            </Link>
          </div>
        </div>
      </section>

      {/* Security Principles */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityPrinciples.map((principle, index) => (
              <div
                key={index}
                className="p-6 bg-void-elevated border border-white/5 rounded-2xl hover:border-quantum-green/30 transition-all group"
              >
                <div className="p-3 rounded-xl bg-quantum-green/10 text-quantum-green w-fit mb-4 group-hover:scale-110 transition-transform">
                  <principle.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-ghost-white mb-2">
                  {principle.title}
                </h3>
                <p className="text-phantom-gray text-sm">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section
        id="certifications"
        className="relative py-20 px-6 bg-void-elevated/50"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-ghost-white mb-4">
              Compliance & Certifications
            </h2>
            <p className="text-lg text-phantom-gray">
              We maintain rigorous security standards to protect your data.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-6 bg-void-black border border-white/10 rounded-2xl"
              >
                <div className="p-3 rounded-xl bg-quantum-green/10 text-quantum-green">
                  <cert.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-semibold text-ghost-white">
                      {cert.name}
                    </h3>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        cert.status === "Certified" ||
                        cert.status === "Compliant"
                          ? "bg-quantum-green/20 text-quantum-green"
                          : "bg-yellow-500/20 text-yellow-500"
                      }`}
                    >
                      {cert.status}
                    </span>
                  </div>
                  <p className="text-sm text-phantom-gray">
                    {cert.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features Grid */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-ghost-white text-center mb-12">
            Comprehensive Security Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityFeatures.map((category, index) => (
              <div
                key={index}
                className="p-6 bg-void-elevated border border-white/5 rounded-2xl"
              >
                <h3 className="text-lg font-semibold text-ghost-white mb-4">
                  {category.category}
                </h3>
                <ul className="space-y-3">
                  {category.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-phantom-gray"
                    >
                      <CheckCircle2 className="w-4 h-4 text-quantum-green mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Handling */}
      <section className="relative py-20 px-6 bg-void-elevated/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-ghost-white text-center mb-12">
            How We Handle Your Data
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {dataHandling.map((section, index) => (
              <div
                key={index}
                className="p-6 bg-void-black border border-white/10 rounded-2xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <section.icon className="w-6 h-6 text-neural-bright" />
                  <h3 className="text-xl font-semibold text-ghost-white">
                    {section.title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {section.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-phantom-gray"
                    >
                      <span className="text-neural-bright">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-ghost-white text-center mb-12">
            Security FAQ
          </h2>
          <div className="space-y-4">
            {faq.map((item, index) => (
              <div
                key={index}
                className="p-6 bg-void-elevated border border-white/5 rounded-xl"
              >
                <h3 className="text-lg font-semibold text-ghost-white mb-2">
                  {item.question}
                </h3>
                <p className="text-phantom-gray">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Report Vulnerability */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-8 md:p-12 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-quantum-green/10 to-electric-cyan/10" />
            <div className="absolute inset-0 border border-quantum-green/20 rounded-3xl" />
            <div className="relative flex flex-col md:flex-row items-center gap-8">
              <div className="p-4 rounded-2xl bg-quantum-green/10">
                <AlertTriangle className="w-12 h-12 text-quantum-green" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-ghost-white mb-2">
                  Found a Security Vulnerability?
                </h2>
                <p className="text-phantom-gray mb-4">
                  We take security seriously. If you&apos;ve discovered a
                  vulnerability, please report it responsibly and we&apos;ll
                  work with you to address it quickly.
                </p>
                <Link
                  href="mailto:security@betaforge.ai"
                  className="inline-flex items-center gap-2 text-quantum-green hover:underline"
                >
                  <Mail className="w-4 h-4" />
                  security@betaforge.ai
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
