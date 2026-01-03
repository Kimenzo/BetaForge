"use client";

import Link from "next/link";
import { Sparkles, Linkedin, Github, Twitter } from "lucide-react";

const footerLinks = {
  resources: {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "API Reference", href: "/docs/api" },
      { label: "Getting Started", href: "/docs/getting-started" },
      { label: "Integrations", href: "/docs/integrations" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  product: {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Agents", href: "/agents" },
      { label: "Pricing", href: "/pricing" },
      { label: "Enterprise", href: "/enterprise" },
      { label: "Security", href: "/security" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
      { label: "Press Kit", href: "/press" },
    ],
  },
  compare: {
    title: "Compare",
    links: [
      { label: "vs Manual Testing", href: "/compare/manual-testing" },
      { label: "vs Selenium", href: "/compare/selenium" },
      { label: "vs Cypress", href: "/compare/cypress" },
      { label: "vs Playwright", href: "/compare/playwright" },
    ],
  },
};

const legalLinks = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookies", href: "/cookies" },
  { label: "AI Policy", href: "/ai-policy" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/5 bg-void-darker">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 group mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-neural-bright/30 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-neural-bright to-electric-cyan flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold gradient-text">BetaForge</span>
            </Link>
            
            <div className="space-y-3 text-phantom-gray text-sm mb-6">
              <p>BetaForge Inc.</p>
              <p>548 Market Street #83833</p>
              <p>San Francisco, CA 94104</p>
            </div>

            <div className="flex items-center gap-3">
              <a 
                href="https://github.com/betaforge" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl text-phantom-gray hover:text-ghost-white hover:bg-void-elevated border border-transparent hover:border-neural/20 transition-all duration-300"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com/betaforge" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl text-phantom-gray hover:text-ghost-white hover:bg-void-elevated border border-transparent hover:border-neural/20 transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com/company/betaforge" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl text-phantom-gray hover:text-ghost-white hover:bg-void-elevated border border-transparent hover:border-neural/20 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="text-ghost-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-phantom-gray hover:text-ghost-white text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Copyright & Legal */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-phantom-gray">
              <p>© {currentYear} BetaForge Inc. All rights reserved.</p>
              <span className="hidden sm:inline text-mist-gray">•</span>
              <p className="text-mist-gray text-xs text-center sm:text-left">
                Registered in Delaware, USA
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {legalLinks.map((link, index) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-phantom-gray hover:text-ghost-white text-sm transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 pt-6 border-t border-white/5">
            <p className="text-mist-gray text-xs text-center lg:text-left leading-relaxed">
              DISCLAIMER: BetaForge uses AI agents powered by Claude to simulate user testing. 
              AI-generated bug reports should be verified by human testers. BetaForge makes no 
              guarantees regarding the completeness of bug detection. Use of this service is 
              subject to our Terms of Service and AI Policy.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
