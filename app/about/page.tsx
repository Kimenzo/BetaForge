"use client";

import Link from "next/link";
import {
  Sparkles,
  Target,
  Heart,
  Lightbulb,
  Users,
  Globe,
  Rocket,
  ArrowRight,
  MapPin,
  Linkedin,
  Twitter,
  Github,
  Award,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { Footer } from "@/components/layout";

const stats = [
  { value: "2023", label: "Founded" },
  { value: "50+", label: "Team Members" },
  { value: "500+", label: "Enterprise Customers" },
  { value: "10M+", label: "Bugs Discovered" },
];

const values = [
  {
    icon: Target,
    title: "Quality Obsession",
    description:
      "We believe in finding every bug before your users do. Our AI agents are relentless in pursuing software quality.",
  },
  {
    icon: Lightbulb,
    title: "Innovation First",
    description:
      "We push the boundaries of what AI can do for software testing, constantly improving our technology.",
  },
  {
    icon: Heart,
    title: "Customer Success",
    description:
      "Your success is our success. We're committed to helping you ship better software, faster.",
  },
  {
    icon: Users,
    title: "Inclusive by Design",
    description:
      "We build tools that help create more accessible software for everyone, regardless of ability.",
  },
];

const timeline = [
  {
    year: "2023",
    title: "BetaForge Founded",
    description: "Started with a vision to revolutionize software testing using AI agents.",
  },
  {
    year: "2024",
    title: "Seed Funding",
    description: "Raised $5M seed round to accelerate product development and team growth.",
  },
  {
    year: "2024",
    title: "Public Launch",
    description: "Launched publicly with 6 AI agent personas and full CI/CD integration.",
  },
  {
    year: "2025",
    title: "Series A",
    description: "Raised $25M Series A to expand enterprise offerings and global reach.",
  },
  {
    year: "2025",
    title: "500+ Customers",
    description: "Reached 500+ enterprise customers across 40+ countries worldwide.",
  },
  {
    year: "2026",
    title: "The Future",
    description: "Continuing to innovate and shape the future of AI-powered testing.",
  },
];

const leadership = [
  {
    name: "Alex Chen",
    role: "CEO & Co-Founder",
    bio: "Former VP of Engineering at Stripe. 15+ years building developer tools.",
    image: "AC",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Sarah Mitchell",
    role: "CTO & Co-Founder",
    bio: "PhD in AI from Stanford. Previously led AI research at Google DeepMind.",
    image: "SM",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Marcus Johnson",
    role: "VP of Engineering",
    bio: "Built engineering teams at Figma and Notion. Passionate about developer experience.",
    image: "MJ",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Emily Rodriguez",
    role: "VP of Product",
    bio: "Former Product Lead at GitHub. Expert in developer tools and workflows.",
    image: "ER",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "David Kim",
    role: "VP of Sales",
    bio: "Built enterprise sales at Datadog. Helped scale from $50M to $1B ARR.",
    image: "DK",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Lisa Wang",
    role: "VP of Customer Success",
    bio: "Customer success leader from Twilio. Obsessed with customer outcomes.",
    image: "LW",
    linkedin: "#",
    twitter: "#",
  },
];

const investors = [
  { name: "Sequoia Capital", logo: "SEQ" },
  { name: "Andreessen Horowitz", logo: "a16z" },
  { name: "Accel", logo: "ACC" },
  { name: "Y Combinator", logo: "YC" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-void-black">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 mesh-bg opacity-30" />
        <div className="absolute top-0 right-1/3 w-[600px] h-[600px] bg-neural/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-plasma-pink/10 rounded-full blur-[100px]" />
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
              <Link href="/careers" className="text-phantom-gray hover:text-ghost-white text-sm transition-colors">
                Careers
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-neural/20 mb-6">
            <Globe className="w-4 h-4 text-neural-bright" />
            <span className="text-sm text-phantom-gray">About BetaForge</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-ghost-white">We&apos;re Building the Future of </span>
            <span className="gradient-text">Software Testing</span>
          </h1>
          <p className="text-lg text-phantom-gray max-w-2xl mx-auto mb-12">
            Our mission is to help every software team ship better products by harnessing
            the power of AI to find bugs before users do.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="p-6 bg-void-elevated border border-white/5 rounded-2xl">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-phantom-gray">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Story */}
      <section className="relative py-20 px-6 bg-void-elevated/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-ghost-white mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-phantom-gray">
                <p>
                  BetaForge was born from a simple observation: traditional testing can&apos;t keep
                  up with modern software development. As companies ship faster, the gap between
                  development speed and testing capability continues to widen.
                </p>
                <p>
                  Our founders, having experienced this firsthand at companies like Stripe and Google,
                  set out to build something different—AI agents that could test software the way
                  humans do, but with tireless persistence and diverse perspectives.
                </p>
                <p>
                  Today, BetaForge&apos;s AI agents have discovered over 10 million bugs for companies
                  ranging from early-stage startups to Fortune 500 enterprises. We&apos;re just getting
                  started.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-neural/10 to-plasma-pink/10 rounded-3xl blur-2xl" />
              <div className="relative p-8 bg-void-black border border-white/10 rounded-3xl">
                <div className="flex items-center gap-4 mb-6">
                  <Rocket className="w-10 h-10 text-neural-bright" />
                  <div>
                    <h3 className="text-xl font-bold text-ghost-white">Our Mission</h3>
                    <p className="text-phantom-gray">Why we exist</p>
                  </div>
                </div>
                <p className="text-lg text-ghost-white italic">
                  &ldquo;To empower every software team to ship exceptional products by making
                  comprehensive testing accessible, intelligent, and effortless.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-ghost-white mb-4">
              Our Values
            </h2>
            <p className="text-lg text-phantom-gray max-w-2xl mx-auto">
              The principles that guide everything we do.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="p-6 bg-void-elevated border border-white/5 rounded-2xl hover:border-neural/30 transition-all group"
              >
                <div className="p-3 rounded-xl bg-gradient-to-br from-neural/20 to-electric-cyan/20 text-neural-bright w-fit mb-4 group-hover:scale-110 transition-transform">
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-ghost-white mb-2">
                  {value.title}
                </h3>
                <p className="text-phantom-gray text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="relative py-20 px-6 bg-void-elevated/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-ghost-white text-center mb-12">
            Our Journey
          </h2>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-neural via-electric-cyan to-plasma-pink" />
            
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className="relative flex gap-8">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-void-black border-2 border-neural flex items-center justify-center">
                    <span className="text-xs font-bold text-neural-bright">{item.year}</span>
                  </div>
                  <div className="pt-3">
                    <h3 className="text-lg font-semibold text-ghost-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-phantom-gray">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-ghost-white mb-4">
              Leadership Team
            </h2>
            <p className="text-lg text-phantom-gray max-w-2xl mx-auto">
              Experienced leaders from world-class technology companies.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leadership.map((person, index) => (
              <div
                key={index}
                className="p-6 bg-void-elevated border border-white/5 rounded-2xl hover:border-neural/30 transition-all group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neural to-electric-cyan flex items-center justify-center text-white font-bold text-xl">
                    {person.image}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-ghost-white">
                      {person.name}
                    </h3>
                    <p className="text-sm text-neural-bright">{person.role}</p>
                  </div>
                </div>
                <p className="text-sm text-phantom-gray mb-4">{person.bio}</p>
                <div className="flex items-center gap-3">
                  <a
                    href={person.linkedin}
                    className="p-2 rounded-lg bg-void-black text-phantom-gray hover:text-ghost-white hover:bg-white/5 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href={person.twitter}
                    className="p-2 rounded-lg bg-void-black text-phantom-gray hover:text-ghost-white hover:bg-white/5 transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investors */}
      <section className="relative py-20 px-6 bg-void-elevated/50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-ghost-white mb-4">
            Backed by the Best
          </h2>
          <p className="text-lg text-phantom-gray mb-12">
            We&apos;re fortunate to partner with world-class investors who share our vision.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {investors.map((investor, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-20 h-20 rounded-2xl bg-void-black border border-white/10 flex items-center justify-center text-xl font-bold text-ghost-white">
                  {investor.logo}
                </div>
                <span className="text-sm text-phantom-gray">{investor.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <MapPin className="w-12 h-12 text-neural-bright mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-ghost-white mb-4">
            Where We Are
          </h2>
          <p className="text-lg text-phantom-gray mb-8">
            Headquartered in San Francisco with a globally distributed team.
          </p>
          <div className="p-8 bg-void-elevated border border-white/5 rounded-2xl">
            <p className="text-ghost-white font-medium mb-2">BetaForge, Inc.</p>
            <p className="text-phantom-gray">548 Market Street #83833</p>
            <p className="text-phantom-gray">San Francisco, CA 94104</p>
            <p className="text-phantom-gray mt-4">United States</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-12 rounded-3xl overflow-hidden text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-neural/20 to-electric-cyan/20" />
            <div className="absolute inset-0 border border-neural/30 rounded-3xl" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-ghost-white mb-4">
                Join Our Team
              </h2>
              <p className="text-lg text-phantom-gray mb-8 max-w-xl mx-auto">
                We&apos;re always looking for talented people who share our passion
                for building exceptional software.
              </p>
              <Link
                href="/careers"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-neural to-electric-cyan text-white font-semibold hover:shadow-glow transition-all"
              >
                View Open Positions
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
