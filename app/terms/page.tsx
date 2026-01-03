"use client";

import Link from "next/link";
import { Sparkles, FileText, ArrowRight, Scale } from "lucide-react";
import { Footer } from "@/components/layout";

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: `By accessing or using BetaForge's services ("Services"), website, or any related applications, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use our Services.

These Terms apply to all visitors, users, and others who access or use the Services. By using the Services, you represent that you are at least 18 years of age and have the legal capacity to enter into a binding agreement.

We reserve the right to update or modify these Terms at any time without prior notice. Your continued use of the Services following any changes indicates your acceptance of the new Terms. We encourage you to review these Terms periodically.`,
  },
  {
    id: "description",
    title: "2. Description of Services",
    content: `BetaForge provides an AI-powered software testing platform that deploys autonomous AI agents to test web, mobile, and desktop applications. Our Services include:

• **AI Testing Agents**: Automated testing agents powered by artificial intelligence that simulate user behavior and identify bugs, issues, and potential improvements.

• **Dashboard & Reporting**: Web-based interface for managing projects, viewing test sessions, and accessing bug reports.

• **API Access**: Programmatic access to our testing services for integration with your development workflow.

• **Webhook Integrations**: Automated triggers for testing based on CI/CD events.

The specific features available to you depend on your subscription plan. We reserve the right to modify, suspend, or discontinue any aspect of the Services at any time.`,
  },
  {
    id: "accounts",
    title: "3. User Accounts",
    content: `To access certain features of the Services, you must create an account. When creating an account, you agree to:

• Provide accurate, current, and complete information during registration
• Maintain and promptly update your account information
• Keep your password secure and confidential
• Notify us immediately of any unauthorized use of your account
• Accept responsibility for all activities that occur under your account

You may not use another person's account without permission. You may not create accounts using automated methods or false identities. We reserve the right to suspend or terminate accounts that violate these Terms.

**Enterprise Accounts**: Organizations using enterprise plans may designate administrators who can manage team members, permissions, and billing. The organization is responsible for all activities conducted under its enterprise account.`,
  },
  {
    id: "subscription",
    title: "4. Subscription & Billing",
    content: `**Subscription Plans**: BetaForge offers various subscription plans with different features and pricing. Current plans include Free, Pro, Team, and Enterprise tiers. Features and pricing are subject to change.

**Payment**: Paid subscriptions are billed in advance on a monthly or annual basis. You authorize us to charge your designated payment method for all applicable fees.

**Automatic Renewal**: Unless you cancel before the end of your billing period, your subscription will automatically renew at the then-current rate.

**Cancellation**: You may cancel your subscription at any time. Cancellation will take effect at the end of your current billing period. No refunds will be provided for partial billing periods.

**Refunds**: We offer a 14-day money-back guarantee for new Pro and Team subscriptions. Enterprise refund policies are governed by individual contracts.

**Price Changes**: We may change our prices at any time. For existing subscribers, price changes will take effect at the start of your next billing period after notice.`,
  },
  {
    id: "usage",
    title: "5. Acceptable Use Policy",
    content: `When using our Services, you agree NOT to:

• Violate any applicable laws, regulations, or third-party rights
• Test applications without proper authorization from the application owner
• Use the Services to identify vulnerabilities for malicious purposes
• Attempt to gain unauthorized access to any systems or data
• Interfere with or disrupt the Services or servers
• Transmit viruses, malware, or other harmful code
• Use the Services to compete directly with BetaForge
• Resell, redistribute, or sublicense the Services without authorization
• Circumvent any access controls or usage limits
• Use automated methods to extract data from our platform
• Impersonate any person or entity

**Testing Authorization**: You represent and warrant that you have proper authorization to test any applications you submit to our platform. You are solely responsible for ensuring compliance with all applicable laws and terms of service of applications you test.`,
  },
  {
    id: "intellectual-property",
    title: "6. Intellectual Property Rights",
    content: `**Our Intellectual Property**: The Services, including all content, features, functionality, software, code, and documentation, are owned by BetaForge and protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of our Services without express written permission.

**Your Content**: You retain ownership of any content, data, or materials you submit to the Services ("Your Content"). By submitting content, you grant BetaForge a non-exclusive, worldwide, royalty-free license to use, process, and store Your Content solely for the purpose of providing the Services.

**Bug Reports**: Bug reports and testing results generated by our AI agents are considered part of the Services output. You own the rights to use these reports for your internal purposes. We may use anonymized, aggregated data to improve our Services.

**Feedback**: Any feedback, suggestions, or ideas you provide about our Services may be used by BetaForge without restriction or compensation to you.`,
  },
  {
    id: "data-privacy",
    title: "7. Data & Privacy",
    content: `Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the Services, you consent to our data practices as described in the Privacy Policy.

**Application Data**: When testing your applications, our AI agents may access and process data displayed in your application interfaces. You are responsible for ensuring that you have the right to share such data with us and that doing so complies with applicable laws.

**Data Security**: We implement industry-standard security measures to protect your data. However, no method of transmission over the Internet is 100% secure. You acknowledge and accept these inherent risks.

**Data Retention**: We retain your data for as long as your account is active or as needed to provide Services. Upon account termination, we will delete your data in accordance with our data retention policies, typically within 90 days.`,
  },
  {
    id: "disclaimers",
    title: "8. Disclaimers",
    content: `THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

WE DO NOT WARRANT THAT:
• The Services will be uninterrupted or error-free
• The results obtained from using the Services will be accurate or reliable
• Our AI agents will identify all bugs or issues in your applications
• The Services will meet your specific requirements

**AI Limitations**: Our AI testing agents, while advanced, may not catch all bugs or may occasionally produce false positives. The Services are intended to supplement, not replace, human quality assurance processes.

**Third-Party Applications**: We are not responsible for the performance, availability, or content of any third-party applications you test using our Services.`,
  },
  {
    id: "liability",
    title: "9. Limitation of Liability",
    content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, BETAFORGE AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND AFFILIATES SHALL NOT BE LIABLE FOR:

• Any indirect, incidental, special, consequential, or punitive damages
• Any loss of profits, revenue, data, or business opportunities
• Any damages resulting from unauthorized access to your account
• Any damages resulting from bugs or issues not detected by our Services

OUR TOTAL LIABILITY FOR ANY CLAIMS ARISING FROM OR RELATED TO THESE TERMS OR THE SERVICES SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.

Some jurisdictions do not allow the exclusion or limitation of certain damages. In such jurisdictions, our liability shall be limited to the maximum extent permitted by law.`,
  },
  {
    id: "indemnification",
    title: "10. Indemnification",
    content: `You agree to indemnify, defend, and hold harmless BetaForge and its officers, directors, employees, agents, and affiliates from and against any claims, damages, losses, costs, and expenses (including reasonable attorneys' fees) arising from:

• Your use of the Services
• Your violation of these Terms
• Your violation of any third-party rights
• Testing of applications without proper authorization
• Any content or data you submit to the Services
• Your violation of any applicable laws or regulations

We reserve the right to assume exclusive defense and control of any matter subject to indemnification, in which case you agree to cooperate with our defense.`,
  },
  {
    id: "termination",
    title: "11. Termination",
    content: `**Termination by You**: You may terminate your account at any time by contacting us or using the account settings. Termination does not entitle you to a refund of any fees paid.

**Termination by Us**: We may suspend or terminate your account immediately, without prior notice, if:
• You violate these Terms
• Your use of the Services poses a security risk
• We are required to do so by law
• We discontinue the Services

**Effect of Termination**: Upon termination:
• Your right to use the Services immediately ceases
• We may delete your data in accordance with our data retention policies
• Sections that by their nature should survive termination shall survive

**Data Export**: Before termination, you may export your data using our API or dashboard features. We are not obligated to maintain or provide your data after termination.`,
  },
  {
    id: "general",
    title: "12. General Provisions",
    content: `**Governing Law**: These Terms shall be governed by the laws of the State of California, without regard to conflict of law principles.

**Dispute Resolution**: Any disputes arising from these Terms shall first be attempted to be resolved through good-faith negotiation. If negotiation fails, disputes shall be resolved through binding arbitration in San Francisco, California, in accordance with the American Arbitration Association rules.

**Class Action Waiver**: You agree to resolve disputes with us on an individual basis and waive any right to participate in class action lawsuits or class-wide arbitration.

**Severability**: If any provision of these Terms is found unenforceable, the remaining provisions shall continue in full force and effect.

**Entire Agreement**: These Terms, together with our Privacy Policy and any other policies referenced herein, constitute the entire agreement between you and BetaForge.

**Assignment**: You may not assign or transfer these Terms without our prior written consent. We may assign these Terms without restriction.

**No Waiver**: Our failure to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision.`,
  },
  {
    id: "contact",
    title: "13. Contact Information",
    content: `If you have any questions about these Terms of Service, please contact us:

**BetaForge, Inc.**
548 Market Street, Suite 35000
San Francisco, CA 94104
United States

**Email**: legal@betaforge.ai
**Support**: support@betaforge.ai

For urgent legal matters, please contact our legal department directly at legal@betaforge.ai.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-void-black">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 mesh-bg opacity-30" />
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-neural/10 rounded-full blur-[120px]" />
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
              <Link href="/privacy" className="text-phantom-gray hover:text-ghost-white text-sm transition-colors">
                Privacy
              </Link>
              <Link href="/contact" className="text-phantom-gray hover:text-ghost-white text-sm transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-neural/20 mb-6">
            <Scale className="w-4 h-4 text-neural-bright" />
            <span className="text-sm text-phantom-gray">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-ghost-white">Terms of </span>
            <span className="gradient-text">Service</span>
          </h1>
          <p className="text-lg text-phantom-gray mb-4">
            Last updated: January 15, 2026
          </p>
          <p className="text-phantom-gray max-w-2xl mx-auto">
            These Terms of Service govern your use of BetaForge's AI-powered testing
            platform. Please read them carefully before using our services.
          </p>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="relative py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="p-6 bg-void-elevated border border-white/10 rounded-2xl">
            <h2 className="text-lg font-semibold text-ghost-white mb-4">Table of Contents</h2>
            <div className="grid md:grid-cols-2 gap-2">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-phantom-gray hover:text-neural-bright text-sm transition-colors"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="relative py-8 px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {sections.map((section) => (
              <div key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-ghost-white mb-4">
                  {section.title}
                </h2>
                <div className="prose prose-invert max-w-none">
                  {section.content.split("\n\n").map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-phantom-gray leading-relaxed mb-4"
                      dangerouslySetInnerHTML={{
                        __html: paragraph
                          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-ghost-white">$1</strong>')
                          .replace(/• /g, '<span class="text-neural-bright">•</span> '),
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Documents */}
      <section className="relative py-12 px-6 bg-void-elevated/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-ghost-white mb-6">Related Documents</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/privacy"
              className="p-4 bg-void-black border border-white/10 rounded-xl hover:border-neural/30 transition-all group"
            >
              <FileText className="w-6 h-6 text-neural-bright mb-2" />
              <h3 className="font-semibold text-ghost-white group-hover:text-neural-bright transition-colors">
                Privacy Policy
              </h3>
              <p className="text-sm text-phantom-gray">How we handle your data</p>
            </Link>
            <Link
              href="/cookies"
              className="p-4 bg-void-black border border-white/10 rounded-xl hover:border-neural/30 transition-all group"
            >
              <FileText className="w-6 h-6 text-neural-bright mb-2" />
              <h3 className="font-semibold text-ghost-white group-hover:text-neural-bright transition-colors">
                Cookie Policy
              </h3>
              <p className="text-sm text-phantom-gray">Our use of cookies</p>
            </Link>
            <Link
              href="/ai-policy"
              className="p-4 bg-void-black border border-white/10 rounded-xl hover:border-neural/30 transition-all group"
            >
              <FileText className="w-6 h-6 text-neural-bright mb-2" />
              <h3 className="font-semibold text-ghost-white group-hover:text-neural-bright transition-colors">
                AI Usage Policy
              </h3>
              <p className="text-sm text-phantom-gray">Our AI principles</p>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
