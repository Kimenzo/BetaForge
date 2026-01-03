"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Sparkles,
  Briefcase,
  MapPin,
  Clock,
  ArrowRight,
  Heart,
  Zap,
  Globe,
  Users,
  Coffee,
  Laptop,
  GraduationCap,
  Plane,
  DollarSign,
  Shield,
  ChevronDown,
  Building2,
  Code,
  Megaphone,
  HeadphonesIcon,
  BarChart3,
} from "lucide-react";
import { Footer } from "@/components/layout";

const benefits = [
  {
    icon: DollarSign,
    title: "Competitive Compensation",
    description: "Top-tier salary, equity, and annual bonuses",
  },
  {
    icon: Shield,
    title: "Health & Wellness",
    description: "100% covered medical, dental, and vision",
  },
  {
    icon: Plane,
    title: "Unlimited PTO",
    description: "Take time off when you need it",
  },
  {
    icon: Laptop,
    title: "Remote First",
    description: "Work from anywhere in the world",
  },
  {
    icon: GraduationCap,
    title: "Learning Budget",
    description: "$3,000 annual education stipend",
  },
  {
    icon: Coffee,
    title: "Home Office Setup",
    description: "$2,000 for your ideal workspace",
  },
  {
    icon: Users,
    title: "Team Retreats",
    description: "Annual all-company gatherings worldwide",
  },
  {
    icon: Heart,
    title: "Parental Leave",
    description: "16 weeks fully paid for all parents",
  },
];

const departments = [
  { name: "All", icon: Building2 },
  { name: "Engineering", icon: Code },
  { name: "Product", icon: Zap },
  { name: "Design", icon: Sparkles },
  { name: "Marketing", icon: Megaphone },
  { name: "Sales", icon: BarChart3 },
  { name: "Customer Success", icon: HeadphonesIcon },
];

const jobs = [
  {
    id: 1,
    title: "Senior Full Stack Engineer",
    department: "Engineering",
    location: "Remote (US/EU)",
    type: "Full-time",
    description: "Build and scale our AI testing platform using Next.js, TypeScript, and Python.",
  },
  {
    id: 2,
    title: "AI/ML Engineer",
    department: "Engineering",
    location: "Remote (Worldwide)",
    type: "Full-time",
    description: "Develop and improve our AI agent capabilities using LLMs and machine learning.",
  },
  {
    id: 3,
    title: "Staff Backend Engineer",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    description: "Design and implement scalable backend systems for high-throughput testing.",
  },
  {
    id: 4,
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Remote (US)",
    type: "Full-time",
    description: "Build and maintain our cloud infrastructure and CI/CD pipelines.",
  },
  {
    id: 5,
    title: "Senior Product Manager",
    department: "Product",
    location: "San Francisco, CA",
    type: "Full-time",
    description: "Drive product strategy and roadmap for our enterprise testing features.",
  },
  {
    id: 6,
    title: "Product Designer",
    department: "Design",
    location: "Remote (US/EU)",
    type: "Full-time",
    description: "Design intuitive user experiences for complex testing workflows.",
  },
  {
    id: 7,
    title: "Growth Marketing Manager",
    department: "Marketing",
    location: "Remote (US)",
    type: "Full-time",
    description: "Lead acquisition and conversion optimization across all channels.",
  },
  {
    id: 8,
    title: "Content Marketing Lead",
    department: "Marketing",
    location: "Remote (Worldwide)",
    type: "Full-time",
    description: "Create compelling content that educates developers about AI testing.",
  },
  {
    id: 9,
    title: "Enterprise Account Executive",
    department: "Sales",
    location: "New York, NY",
    type: "Full-time",
    description: "Close enterprise deals and build relationships with Fortune 500 companies.",
  },
  {
    id: 10,
    title: "Solutions Engineer",
    department: "Sales",
    location: "Remote (US)",
    type: "Full-time",
    description: "Partner with sales to provide technical expertise and custom solutions.",
  },
  {
    id: 11,
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "Remote (US/EU)",
    type: "Full-time",
    description: "Ensure customer success and drive adoption of BetaForge across organizations.",
  },
  {
    id: 12,
    title: "Technical Support Engineer",
    department: "Customer Success",
    location: "Remote (Worldwide)",
    type: "Full-time",
    description: "Provide world-class technical support to our growing customer base.",
  },
];

const values = [
  {
    icon: Zap,
    title: "Move Fast",
    description: "We ship quickly and iterate based on feedback. Perfect is the enemy of good.",
  },
  {
    icon: Users,
    title: "Customers First",
    description: "Every decision starts with how it impacts our customers' success.",
  },
  {
    icon: Globe,
    title: "Think Global",
    description: "We build for the world with a diverse, distributed team.",
  },
  {
    icon: Heart,
    title: "Be Human",
    description: "We treat everyone with empathy, respect, and kindness.",
  },
];

export default function CareersPage() {
  const [activeDepartment, setActiveDepartment] = useState("All");

  const filteredJobs = jobs.filter(
    (job) => activeDepartment === "All" || job.department === activeDepartment
  );

  return (
    <div className="min-h-screen bg-void-black">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 mesh-bg opacity-30" />
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-plasma-pink/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-neural/10 rounded-full blur-[100px]" />
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
              <Link href="/about" className="text-phantom-gray hover:text-ghost-white text-sm transition-colors">
                About
              </Link>
              <Link
                href="#positions"
                className="px-4 py-2 rounded-lg bg-neural/20 text-ghost-white text-sm font-medium hover:bg-neural/30 transition-colors"
              >
                View Positions
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-plasma-pink/20 mb-6">
            <Briefcase className="w-4 h-4 text-plasma-pink" />
            <span className="text-sm text-phantom-gray">We&apos;re Hiring</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-ghost-white">Build the Future of </span>
            <span className="gradient-text">Software Testing</span>
          </h1>
          <p className="text-lg text-phantom-gray max-w-2xl mx-auto mb-8">
            Join our mission to help every software team ship exceptional products.
            We&apos;re looking for passionate people to help us revolutionize testing with AI.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="#positions"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neural to-electric-cyan text-white font-semibold hover:shadow-glow transition-all"
            >
              See Open Roles
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-ghost-white font-semibold hover:border-neural/30 transition-all"
            >
              Learn About Us
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {[
              { value: "50+", label: "Team Members" },
              { value: "15+", label: "Countries" },
              { value: "4.8", label: "Glassdoor Rating" },
              { value: "12", label: "Open Positions" },
            ].map((stat, index) => (
              <div key={index} className="p-4 bg-void-elevated border border-white/5 rounded-xl">
                <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-phantom-gray">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative py-20 px-6 bg-void-elevated/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-ghost-white mb-4">
              Our Values
            </h2>
            <p className="text-lg text-phantom-gray max-w-2xl mx-auto">
              The principles that guide how we work together.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="p-6 bg-void-black border border-white/10 rounded-2xl hover:border-neural/30 transition-all group"
              >
                <div className="p-3 rounded-xl bg-gradient-to-br from-neural/20 to-plasma-pink/20 text-neural-bright w-fit mb-4 group-hover:scale-110 transition-transform">
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

      {/* Benefits */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-ghost-white mb-4">
              Benefits & Perks
            </h2>
            <p className="text-lg text-phantom-gray max-w-2xl mx-auto">
              We take care of our team so they can focus on doing their best work.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="p-6 bg-void-elevated border border-white/5 rounded-2xl"
              >
                <benefit.icon className="w-8 h-8 text-electric-cyan mb-4" />
                <h3 className="text-lg font-semibold text-ghost-white mb-1">
                  {benefit.title}
                </h3>
                <p className="text-sm text-phantom-gray">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="positions" className="relative py-20 px-6 bg-void-elevated/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-ghost-white mb-4">
              Open Positions
            </h2>
            <p className="text-lg text-phantom-gray">
              Find your next role at BetaForge.
            </p>
          </div>

          {/* Department Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {departments.map((dept) => (
              <button
                key={dept.name}
                onClick={() => setActiveDepartment(dept.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeDepartment === dept.name
                    ? "bg-neural/20 text-ghost-white border border-neural/30"
                    : "bg-void-black text-phantom-gray border border-white/10 hover:border-white/20"
                }`}
              >
                <dept.icon className="w-4 h-4" />
                {dept.name}
              </button>
            ))}
          </div>

          {/* Job Listings */}
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <Link
                key={job.id}
                href={`/careers/${job.id}`}
                className="block group p-6 bg-void-black border border-white/10 rounded-2xl hover:border-neural/30 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-ghost-white group-hover:text-neural-bright transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-sm text-phantom-gray mt-1">{job.description}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-mist-gray">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-mist-gray group-hover:text-neural-bright group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
              </Link>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-phantom-gray">No positions in this department right now.</p>
              <p className="text-sm text-mist-gray mt-2">
                Check back soon or explore other departments.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-12 rounded-3xl overflow-hidden text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-neural/20 to-plasma-pink/20" />
            <div className="absolute inset-0 border border-neural/30 rounded-3xl" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-ghost-white mb-4">
                Don&apos;t See Your Role?
              </h2>
              <p className="text-lg text-phantom-gray mb-8 max-w-xl mx-auto">
                We&apos;re always looking for exceptional people. Send us your resume
                and tell us how you can contribute.
              </p>
              <Link
                href="mailto:careers@betaforge.ai"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-neural to-electric-cyan text-white font-semibold hover:shadow-glow transition-all"
              >
                Send Your Resume
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
