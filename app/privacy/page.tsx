"use client";

import Link from "next/link";
import { Sparkles, Shield, FileText, Lock, Eye, Database, Globe, Mail, Users } from "lucide-react";
import { Footer } from "@/components/layout";

const sections = [
  {
    id: "introduction",
    title: "1. Introduction",
    icon: Shield,
    content: `BetaForge, Inc. ("BetaForge", "we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered testing platform and related services (the "Services").

This Privacy Policy applies to all users of our Services, including visitors to our website, registered users, and enterprise customers. By using our Services, you consent to the data practices described in this policy.

We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. Your continued use of the Services after any changes indicates your acceptance of the updated policy.

**Questions?** If you have questions about this Privacy Policy, please contact our Data Protection Officer at privacy@betaforge.ai.`,
  },
  {
    id: "information-collected",
    title: "2. Information We Collect",
    icon: Database,
    content: `We collect several types of information to provide and improve our Services:

**Information You Provide Directly:**
• **Account Information**: Name, email address, password, company name, and job title when you create an account
• **Payment Information**: Credit card details, billing address, and payment history (processed by our payment provider)
• **Project Information**: Application URLs, testing configurations, and project settings
• **Communications**: Messages, feedback, and support requests you send to us
• **User Content**: Any files, screenshots, or data you upload to the platform

**Information Collected Automatically:**
• **Usage Data**: Pages visited, features used, test sessions initiated, and interactions with our platform
• **Device Information**: Browser type, operating system, device identifiers, and IP address
• **Log Data**: Server logs, error reports, and performance metrics
• **Cookies and Tracking**: Information collected through cookies and similar technologies (see our Cookie Policy)

**Information from Testing:**
• **Application Data**: When our AI agents test your applications, they may access and process data displayed in your application interfaces, including text, images, and user interface elements
• **Test Results**: Bug reports, screenshots, session recordings, and testing artifacts generated during test sessions

**Information from Third Parties:**
• **Single Sign-On**: If you log in using Google or GitHub, we receive profile information from those services
• **Integrations**: Data from CI/CD systems, issue trackers, or other tools you connect to BetaForge`,
  },
  {
    id: "how-we-use",
    title: "3. How We Use Your Information",
    icon: Eye,
    content: `We use the information we collect for the following purposes:

**Providing Services:**
• Operating and maintaining our AI testing platform
• Processing your test requests and generating bug reports
• Managing your account and subscription
• Providing customer support and responding to inquiries

**Improving Services:**
• Analyzing usage patterns to improve our platform
• Training and improving our AI models (using anonymized data only)
• Developing new features and capabilities
• Identifying and fixing bugs in our own platform

**Communications:**
• Sending service-related notifications and updates
• Providing product announcements and feature releases
• Sending marketing communications (with your consent)
• Responding to your support requests

**Security & Compliance:**
• Detecting, preventing, and addressing fraud and abuse
• Enforcing our Terms of Service
• Complying with legal obligations
• Protecting the rights and safety of users

**Analytics & Research:**
• Generating aggregate statistics about platform usage
• Conducting research to improve AI testing capabilities
• Creating industry benchmarks (using anonymized data only)`,
  },
  {
    id: "data-sharing",
    title: "4. How We Share Your Information",
    icon: Users,
    content: `We do not sell your personal information. We may share your information in the following circumstances:

**Service Providers:**
We work with third-party companies that help us operate our Services:
• **Cloud Infrastructure**: AWS, Google Cloud (data hosting and processing)
• **Payment Processing**: Stripe (payment handling)
• **Analytics**: Mixpanel, Amplitude (usage analytics)
• **Communication**: Intercom, SendGrid (customer support and email)
• **AI Services**: Anthropic (AI model provider for testing agents)

These providers are contractually obligated to protect your information and use it only for the services they provide to us.

**Team Members:**
If you use BetaForge as part of an organization, your information may be shared with:
• Team administrators who manage your organization's account
• Other team members on shared projects
• Your organization's IT or security personnel

**Legal Requirements:**
We may disclose your information when required to:
• Comply with applicable laws, regulations, or legal processes
• Respond to lawful requests from government authorities
• Protect our rights, privacy, safety, or property
• Enforce our Terms of Service

**Business Transfers:**
If BetaForge is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction. We will notify you of any such change.

**With Your Consent:**
We may share your information with your explicit consent for purposes not described in this policy.`,
  },
  {
    id: "data-security",
    title: "5. Data Security",
    icon: Lock,
    content: `We implement comprehensive security measures to protect your information:

**Technical Safeguards:**
• **Encryption**: All data is encrypted in transit (TLS 1.3) and at rest (AES-256)
• **Access Controls**: Role-based access with multi-factor authentication
• **Network Security**: Firewalls, intrusion detection, and DDoS protection
• **Secure Development**: Regular security audits, code reviews, and penetration testing

**Organizational Safeguards:**
• **Employee Training**: All employees receive security and privacy training
• **Access Limitations**: Access to personal data is limited to authorized personnel
• **Vendor Management**: Third-party vendors are evaluated for security practices
• **Incident Response**: Documented procedures for detecting and responding to breaches

**Certifications & Compliance:**
• SOC 2 Type II certified
• GDPR compliant
• CCPA compliant
• Regular third-party security audits

**Important Note:**
While we implement robust security measures, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security of your information.

**Data Breach Notification:**
In the event of a data breach affecting your personal information, we will notify you and relevant authorities as required by applicable laws.`,
  },
  {
    id: "data-retention",
    title: "6. Data Retention",
    icon: Database,
    content: `We retain your information for as long as necessary to fulfill the purposes described in this policy:

**Account Data:**
• Retained while your account is active
• Deleted within 90 days of account termination
• Some data may be retained longer for legal compliance

**Test Data & Results:**
• Retained according to your plan settings (default: 90 days)
• Enterprise customers can configure custom retention periods
• Deleted permanently when retention period expires

**Usage & Analytics Data:**
• Retained for up to 24 months
• Anonymized data may be retained indefinitely for research

**Billing Records:**
• Retained for 7 years as required by tax laws
• Payment card details are not stored on our servers

**Legal Holds:**
We may retain data longer if required for legal proceedings or regulatory compliance.

**Deletion Requests:**
You can request deletion of your data at any time. We will process deletion requests within 30 days, subject to legal retention requirements.`,
  },
  {
    id: "your-rights",
    title: "7. Your Privacy Rights",
    icon: Shield,
    content: `Depending on your location, you may have the following rights regarding your personal information:

**Access & Portability:**
• Request a copy of the personal information we hold about you
• Receive your data in a structured, machine-readable format
• Transfer your data to another service provider

**Correction & Deletion:**
• Request correction of inaccurate personal information
• Request deletion of your personal information
• Request that we stop processing your data

**Objection & Restriction:**
• Object to processing based on legitimate interests
• Request restriction of processing in certain circumstances
• Withdraw consent at any time (where processing is based on consent)

**Marketing:**
• Opt out of marketing communications at any time
• Unsubscribe from emails using the link in each message
• Manage notification preferences in your account settings

**California Residents (CCPA):**
• Right to know what personal information we collect
• Right to delete personal information
• Right to opt-out of "sale" of personal information (we do not sell data)
• Right to non-discrimination for exercising privacy rights

**EU/UK Residents (GDPR):**
• All rights listed above plus right to lodge a complaint with supervisory authorities
• Data Protection Officer contact: dpo@betaforge.ai

**Exercising Your Rights:**
To exercise any of these rights, contact us at privacy@betaforge.ai or use the privacy controls in your account settings.`,
  },
  {
    id: "international",
    title: "8. International Data Transfers",
    icon: Globe,
    content: `BetaForge is headquartered in the United States, and our Services are hosted on servers located in the US and other countries.

**Data Transfer Mechanisms:**
For transfers of personal data from the European Economic Area (EEA), United Kingdom, or Switzerland to the United States, we rely on:

• **Standard Contractual Clauses (SCCs)**: EU-approved contractual terms that provide adequate data protection
• **Data Processing Agreements**: Contracts with our sub-processors that ensure compliance
• **Adequacy Decisions**: Transfers to countries with adequate data protection as determined by relevant authorities

**Sub-Processor Locations:**
Our primary sub-processors are located in:
• United States (AWS, Anthropic, Stripe)
• European Union (some analytics and support services)

**Your Consent:**
By using our Services, you consent to the transfer of your information to the United States and other countries where we operate. We will take all steps reasonably necessary to ensure your data is treated securely.

**Questions:**
If you have questions about international data transfers, contact our Data Protection Officer at dpo@betaforge.ai.`,
  },
  {
    id: "children",
    title: "9. Children's Privacy",
    content: `Our Services are not intended for children under the age of 16. We do not knowingly collect personal information from children under 16.

If you are a parent or guardian and believe your child has provided us with personal information, please contact us at privacy@betaforge.ai. If we discover that we have collected personal information from a child under 16, we will delete that information promptly.

For users between 16 and 18, we recommend parental or guardian supervision when using our Services.`,
  },
  {
    id: "third-party",
    title: "10. Third-Party Links & Services",
    content: `Our Services may contain links to third-party websites, applications, or services that are not operated by us. This Privacy Policy does not apply to third-party services.

**Third-Party Integrations:**
When you connect third-party services to BetaForge (such as GitHub, GitLab, or CI/CD platforms), those services have their own privacy policies. We encourage you to review the privacy policies of any third-party services you connect.

**Embedded Content:**
Some content on our website may be embedded from third parties (such as videos or social media widgets). These third parties may collect information about you according to their own privacy policies.

**AI Model Providers:**
Our AI testing agents are powered by Anthropic's Claude AI. Test data processed by our AI agents may be sent to Anthropic's servers. Anthropic's privacy practices are governed by their privacy policy, but they are contractually prohibited from using your data to train their models.`,
  },
  {
    id: "contact",
    title: "11. Contact Us",
    icon: Mail,
    content: `If you have questions, concerns, or requests regarding this Privacy Policy, please contact us:

**General Privacy Inquiries:**
Email: privacy@betaforge.ai

**Data Protection Officer:**
Email: dpo@betaforge.ai

**Mailing Address:**
BetaForge, Inc.
Attn: Privacy Team
548 Market Street, Suite 35000
San Francisco, CA 94104
United States

**Response Time:**
We aim to respond to all privacy-related inquiries within 30 days. For urgent matters, please indicate "URGENT" in your subject line.

**EU Representative:**
For EU data subjects, our EU representative can be contacted at:
eu-representative@betaforge.ai

**Complaints:**
If you are not satisfied with our response, you have the right to lodge a complaint with your local data protection authority.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-void-black">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 mesh-bg opacity-30" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-neural/10 rounded-full blur-[120px]" />
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
              <Link href="/terms" className="text-phantom-gray hover:text-ghost-white text-sm transition-colors">
                Terms
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
            <Shield className="w-4 h-4 text-neural-bright" />
            <span className="text-sm text-phantom-gray">Privacy</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-ghost-white">Privacy </span>
            <span className="gradient-text">Policy</span>
          </h1>
          <p className="text-lg text-phantom-gray mb-4">
            Last updated: January 15, 2026
          </p>
          <p className="text-phantom-gray max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how BetaForge collects,
            uses, and protects your personal information.
          </p>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="relative py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="p-6 bg-gradient-to-r from-neural/10 to-electric-cyan/10 border border-neural/30 rounded-2xl">
            <h2 className="text-lg font-semibold text-ghost-white mb-4">Privacy at a Glance</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-neural-bright mt-1" />
                <div>
                  <h3 className="font-medium text-ghost-white">Data Security</h3>
                  <p className="text-sm text-phantom-gray">SOC 2 certified, encrypted in transit and at rest</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-neural-bright mt-1" />
                <div>
                  <h3 className="font-medium text-ghost-white">No Data Sales</h3>
                  <p className="text-sm text-phantom-gray">We never sell your personal information</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Eye className="w-5 h-5 text-neural-bright mt-1" />
                <div>
                  <h3 className="font-medium text-ghost-white">Your Control</h3>
                  <p className="text-sm text-phantom-gray">Access, export, or delete your data anytime</p>
                </div>
              </div>
            </div>
          </div>
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
                <div className="flex items-center gap-3 mb-4">
                  {section.icon && <section.icon className="w-6 h-6 text-neural-bright" />}
                  <h2 className="text-2xl font-bold text-ghost-white">
                    {section.title}
                  </h2>
                </div>
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
              href="/terms"
              className="p-4 bg-void-black border border-white/10 rounded-xl hover:border-neural/30 transition-all group"
            >
              <FileText className="w-6 h-6 text-neural-bright mb-2" />
              <h3 className="font-semibold text-ghost-white group-hover:text-neural-bright transition-colors">
                Terms of Service
              </h3>
              <p className="text-sm text-phantom-gray">Service agreement</p>
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
