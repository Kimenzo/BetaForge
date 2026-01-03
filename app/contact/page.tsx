"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Sparkles,
  Mail,
  MessageSquare,
  MapPin,
  Phone,
  Send,
  Building2,
  HeadphonesIcon,
  FileText,
  Users,
  ArrowRight,
  CheckCircle2,
  Clock,
  Globe,
  Twitter,
  Linkedin,
  Github,
} from "lucide-react";
import { Footer } from "@/components/layout";

const contactReasons = [
  { id: "general", label: "General Inquiry", icon: MessageSquare },
  { id: "sales", label: "Sales & Pricing", icon: Building2 },
  { id: "support", label: "Technical Support", icon: HeadphonesIcon },
  { id: "enterprise", label: "Enterprise Solutions", icon: Users },
  { id: "partnership", label: "Partnership", icon: FileText },
];

const offices = [
  {
    city: "San Francisco",
    address: "548 Market Street #83833",
    country: "United States",
    timezone: "PST (UTC-8)",
    type: "Headquarters",
  },
  {
    city: "London",
    address: "71-75 Shelton Street",
    country: "United Kingdom",
    timezone: "GMT (UTC+0)",
    type: "EMEA Office",
  },
  {
    city: "Singapore",
    address: "80 Robinson Road #10-01",
    country: "Singapore",
    timezone: "SGT (UTC+8)",
    type: "APAC Office",
  },
];

const faqs = [
  {
    question: "How quickly do you respond to inquiries?",
    answer:
      "We aim to respond to all inquiries within 24 hours during business days. Enterprise and support requests are typically answered within 4 hours.",
  },
  {
    question: "What's the best way to get technical support?",
    answer:
      "For technical support, we recommend using our in-app support chat or emailing support@betaforge.ai. Pro and Enterprise customers have access to priority support channels.",
  },
  {
    question: "Do you offer product demos?",
    answer:
      "Yes! You can schedule a personalized demo with our team. We'll show you how BetaForge can work for your specific use case and answer all your questions.",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    reason: "general",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
  };

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
              <Link href="/docs" className="text-phantom-gray hover:text-ghost-white text-sm transition-colors">
                Documentation
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-lg bg-neural/20 text-ghost-white text-sm font-medium hover:bg-neural/30 transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-neural/20 mb-6">
            <Mail className="w-4 h-4 text-neural-bright" />
            <span className="text-sm text-phantom-gray">Get in Touch</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-ghost-white">We&apos;d Love to </span>
            <span className="gradient-text">Hear From You</span>
          </h1>
          <p className="text-lg text-phantom-gray max-w-2xl mx-auto">
            Have questions about BetaForge? Want to learn more about our enterprise solutions?
            Our team is here to help.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="relative py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="p-12 bg-void-elevated border border-quantum-green/20 rounded-3xl text-center">
                  <div className="w-16 h-16 rounded-full bg-quantum-green/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-quantum-green" />
                  </div>
                  <h2 className="text-2xl font-bold text-ghost-white mb-4">
                    Message Sent!
                  </h2>
                  <p className="text-phantom-gray mb-6">
                    Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        company: "",
                        reason: "general",
                        message: "",
                      });
                    }}
                    className="text-neural-bright hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-8 bg-void-elevated border border-white/5 rounded-3xl">
                  <h2 className="text-2xl font-bold text-ghost-white mb-6">
                    Send Us a Message
                  </h2>

                  {/* Reason Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-ghost-white mb-3">
                      What can we help you with?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {contactReasons.map((reason) => (
                        <button
                          key={reason.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, reason: reason.id })}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                            formData.reason === reason.id
                              ? "bg-neural/20 text-ghost-white border border-neural/30"
                              : "bg-void-black text-phantom-gray border border-white/10 hover:border-white/20"
                          }`}
                        >
                          <reason.icon className="w-4 h-4" />
                          {reason.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-ghost-white mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-void-black border border-white/10 rounded-xl text-ghost-white placeholder:text-mist-gray focus:outline-none focus:border-neural/50 transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ghost-white mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-void-black border border-white/10 rounded-xl text-ghost-white placeholder:text-mist-gray focus:outline-none focus:border-neural/50 transition-colors"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-ghost-white mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 bg-void-black border border-white/10 rounded-xl text-ghost-white placeholder:text-mist-gray focus:outline-none focus:border-neural/50 transition-colors"
                      placeholder="Your company name"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-ghost-white mb-2">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-void-black border border-white/10 rounded-xl text-ghost-white placeholder:text-mist-gray focus:outline-none focus:border-neural/50 transition-colors resize-none"
                      placeholder="Tell us how we can help..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-neural to-electric-cyan text-white font-semibold hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Contact */}
              <div className="p-6 bg-void-elevated border border-white/5 rounded-2xl">
                <h3 className="text-lg font-semibold text-ghost-white mb-4">
                  Quick Contact
                </h3>
                <div className="space-y-4">
                  <a
                    href="mailto:hello@betaforge.ai"
                    className="flex items-center gap-3 text-phantom-gray hover:text-ghost-white transition-colors"
                  >
                    <Mail className="w-5 h-5 text-neural-bright" />
                    hello@betaforge.ai
                  </a>
                  <a
                    href="mailto:support@betaforge.ai"
                    className="flex items-center gap-3 text-phantom-gray hover:text-ghost-white transition-colors"
                  >
                    <HeadphonesIcon className="w-5 h-5 text-electric-cyan" />
                    support@betaforge.ai
                  </a>
                  <a
                    href="mailto:sales@betaforge.ai"
                    className="flex items-center gap-3 text-phantom-gray hover:text-ghost-white transition-colors"
                  >
                    <Building2 className="w-5 h-5 text-plasma-pink" />
                    sales@betaforge.ai
                  </a>
                </div>
              </div>

              {/* Response Time */}
              <div className="p-6 bg-void-elevated border border-white/5 rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-quantum-green" />
                  <h3 className="text-lg font-semibold text-ghost-white">
                    Response Time
                  </h3>
                </div>
                <p className="text-phantom-gray text-sm">
                  We typically respond within 24 hours. Enterprise customers receive
                  priority support with 4-hour response time.
                </p>
              </div>

              {/* Social Links */}
              <div className="p-6 bg-void-elevated border border-white/5 rounded-2xl">
                <h3 className="text-lg font-semibold text-ghost-white mb-4">
                  Follow Us
                </h3>
                <div className="flex items-center gap-3">
                  <a
                    href="https://twitter.com/betaforge"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-void-black text-phantom-gray hover:text-ghost-white hover:bg-white/5 transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href="https://linkedin.com/company/betaforge"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-void-black text-phantom-gray hover:text-ghost-white hover:bg-white/5 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="https://github.com/betaforge"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-void-black text-phantom-gray hover:text-ghost-white hover:bg-white/5 transition-colors"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-ghost-white mb-4">
              Our Offices
            </h2>
            <p className="text-lg text-phantom-gray">
              Global presence with teams around the world.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offices.map((office, index) => (
              <div
                key={index}
                className="p-6 bg-void-elevated border border-white/5 rounded-2xl hover:border-neural/30 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-ghost-white">
                    {office.city}
                  </h3>
                  <span className="px-2 py-0.5 text-xs bg-neural/20 text-neural-bright rounded-full">
                    {office.type}
                  </span>
                </div>
                <div className="space-y-2 text-phantom-gray text-sm">
                  <p className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-mist-gray" />
                    {office.address}
                  </p>
                  <p className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-mist-gray" />
                    {office.country}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-mist-gray" />
                    {office.timezone}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-20 px-6 bg-void-elevated/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-ghost-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="p-6 bg-void-black border border-white/10 rounded-xl"
              >
                <h3 className="text-lg font-semibold text-ghost-white mb-2">
                  {faq.question}
                </h3>
                <p className="text-phantom-gray">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
