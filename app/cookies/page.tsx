"use client";

import Link from "next/link";
import { Sparkles, Cookie, FileText, Settings, Shield, BarChart3, Target, Info } from "lucide-react";
import { Footer } from "@/components/layout";

const cookieTypes = [
  {
    type: "Essential Cookies",
    description: "Required for the website to function properly. Cannot be disabled.",
    icon: Shield,
    examples: [
      { name: "session_id", purpose: "Maintains your login session", duration: "Session" },
      { name: "csrf_token", purpose: "Protects against cross-site request forgery", duration: "Session" },
      { name: "cookie_consent", purpose: "Remembers your cookie preferences", duration: "1 year" },
    ],
    required: true,
  },
  {
    type: "Functional Cookies",
    description: "Enable enhanced functionality and personalization features.",
    icon: Settings,
    examples: [
      { name: "user_preferences", purpose: "Stores your dashboard preferences", duration: "1 year" },
      { name: "theme", purpose: "Remembers your dark/light mode preference", duration: "1 year" },
      { name: "language", purpose: "Stores your language preference", duration: "1 year" },
    ],
    required: false,
  },
  {
    type: "Analytics Cookies",
    description: "Help us understand how visitors interact with our website.",
    icon: BarChart3,
    examples: [
      { name: "_ga", purpose: "Google Analytics - distinguishes users", duration: "2 years" },
      { name: "_gid", purpose: "Google Analytics - distinguishes users", duration: "24 hours" },
      { name: "mp_*", purpose: "Mixpanel - tracks usage patterns", duration: "1 year" },
    ],
    required: false,
  },
  {
    type: "Marketing Cookies",
    description: "Used to track visitors across websites for advertising purposes.",
    icon: Target,
    examples: [
      { name: "_fbp", purpose: "Facebook - tracks visits across websites", duration: "3 months" },
      { name: "_gcl_au", purpose: "Google Ads - conversion tracking", duration: "3 months" },
      { name: "li_sugr", purpose: "LinkedIn - advertising tracking", duration: "3 months" },
    ],
    required: false,
  },
];

const thirdPartyServices = [
  {
    name: "Google Analytics",
    purpose: "Website analytics and usage insights",
    link: "https://policies.google.com/privacy",
  },
  {
    name: "Mixpanel",
    purpose: "Product analytics and user behavior",
    link: "https://mixpanel.com/legal/privacy-policy/",
  },
  {
    name: "Intercom",
    purpose: "Customer support and messaging",
    link: "https://www.intercom.com/legal/privacy",
  },
  {
    name: "Stripe",
    purpose: "Payment processing",
    link: "https://stripe.com/privacy",
  },
  {
    name: "HubSpot",
    purpose: "Marketing automation and CRM",
    link: "https://legal.hubspot.com/privacy-policy",
  },
];

const sections = [
  {
    id: "what-are-cookies",
    title: "What Are Cookies?",
    content: `Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work efficiently, provide analytics information, and enable personalized experiences.

Cookies can be "session" cookies (which are deleted when you close your browser) or "persistent" cookies (which remain on your device for a set period or until you delete them).

Cookies can be set by the website you're visiting ("first-party cookies") or by third parties whose services are integrated into the website ("third-party cookies").`,
  },
  {
    id: "how-we-use",
    title: "How We Use Cookies",
    content: `BetaForge uses cookies for several purposes:

**Essential Operations:**
• Keeping you signed in to your account
• Maintaining security and preventing fraud
• Remembering items in your shopping cart (if applicable)
• Ensuring the website functions correctly

**Improving Your Experience:**
• Remembering your preferences and settings
• Providing personalized content and features
• Optimizing website performance

**Analytics and Insights:**
• Understanding how visitors use our website
• Identifying popular content and features
• Measuring the effectiveness of our marketing

**Advertising:**
• Delivering relevant advertisements
• Measuring ad campaign effectiveness
• Limiting how often you see the same ad`,
  },
  {
    id: "managing-cookies",
    title: "Managing Your Cookie Preferences",
    content: `You have several options for managing cookies:

**Cookie Preference Center:**
Use our cookie preference center (accessible via the cookie banner or settings) to enable or disable non-essential cookies. Essential cookies cannot be disabled as they are required for the website to function.

**Browser Settings:**
Most web browsers allow you to control cookies through their settings. You can typically:
• View what cookies are stored and delete them individually
• Block third-party cookies
• Block all cookies
• Delete all cookies when you close your browser

Note: Blocking all cookies may impact your experience on our website and prevent certain features from working.

**Browser-Specific Instructions:**
• **Chrome**: Settings > Privacy and security > Cookies
• **Firefox**: Settings > Privacy & Security > Cookies
• **Safari**: Preferences > Privacy > Cookies
• **Edge**: Settings > Privacy & services > Cookies

**Do Not Track:**
Some browsers include a "Do Not Track" (DNT) feature. Our website currently does not respond to DNT signals, but you can use the cookie preference center to manage your preferences.

**Mobile Devices:**
On mobile devices, you can manage cookies through your browser settings. For app tracking, use your device's privacy settings (iOS: Settings > Privacy > Tracking; Android: Settings > Privacy).`,
  },
  {
    id: "data-retention",
    title: "Cookie Data Retention",
    content: `Different cookies have different lifespans:

**Session Cookies:**
These temporary cookies are deleted when you close your browser. They are used for essential functions like maintaining your login session.

**Persistent Cookies:**
These cookies remain on your device for a set period:
• **Short-term** (up to 24 hours): Used for temporary preferences
• **Medium-term** (up to 30 days): Used for remembering recent activity
• **Long-term** (up to 2 years): Used for analytics and preferences

You can delete persistent cookies at any time through your browser settings or our cookie preference center.`,
  },
  {
    id: "updates",
    title: "Updates to This Policy",
    content: `We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons.

**Notification of Changes:**
When we make significant changes, we will:
• Update the "Last Updated" date at the top of this policy
• Display a cookie banner on our website
• For material changes, notify you via email if you have an account

We encourage you to review this policy periodically to stay informed about our use of cookies.`,
  },
  {
    id: "contact",
    title: "Contact Us",
    content: `If you have questions about our use of cookies or this Cookie Policy, please contact us:

**Email:** privacy@betaforge.ai

**Mailing Address:**
BetaForge, Inc.
Attn: Privacy Team
548 Market Street, Suite 35000
San Francisco, CA 94104
United States

For general privacy inquiries, please see our Privacy Policy.`,
  },
];

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-void-black">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 mesh-bg opacity-30" />
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-neural/10 rounded-full blur-[120px]" />
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
              <Link href="/terms" className="text-phantom-gray hover:text-ghost-white text-sm transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-neural/20 mb-6">
            <Cookie className="w-4 h-4 text-neural-bright" />
            <span className="text-sm text-phantom-gray">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-ghost-white">Cookie </span>
            <span className="gradient-text">Policy</span>
          </h1>
          <p className="text-lg text-phantom-gray mb-4">
            Last updated: January 15, 2026
          </p>
          <p className="text-phantom-gray max-w-2xl mx-auto">
            This Cookie Policy explains how BetaForge uses cookies and similar
            technologies to recognize you when you visit our website.
          </p>
        </div>
      </section>

      {/* Cookie Preferences CTA */}
      <section className="relative py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="p-6 bg-gradient-to-r from-neural/10 to-electric-cyan/10 border border-neural/30 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Settings className="w-10 h-10 text-neural-bright" />
              <div>
                <h2 className="text-lg font-semibold text-ghost-white">Manage Your Preferences</h2>
                <p className="text-sm text-phantom-gray">Control which cookies are stored on your device</p>
              </div>
            </div>
            <button className="px-6 py-3 rounded-xl bg-neural/20 text-ghost-white font-medium hover:bg-neural/30 transition-colors">
              Cookie Settings
            </button>
          </div>
        </div>
      </section>

      {/* Cookie Types */}
      <section className="relative py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-ghost-white mb-8">
            Types of Cookies We Use
          </h2>
          <div className="space-y-6">
            {cookieTypes.map((category, index) => (
              <div
                key={index}
                className="p-6 bg-void-elevated border border-white/10 rounded-2xl"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neural/20 flex items-center justify-center">
                      <category.icon className="w-5 h-5 text-neural-bright" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-ghost-white">
                        {category.type}
                      </h3>
                      <p className="text-sm text-phantom-gray">{category.description}</p>
                    </div>
                  </div>
                  {category.required ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-neural/20 text-neural-bright text-sm">
                      Always Active
                    </span>
                  ) : (
                    <label className="inline-flex items-center cursor-pointer">
                      <div className="relative">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-void-black rounded-full peer peer-checked:bg-neural/50 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                      </div>
                    </label>
                  )}
                </div>
                <div className="mt-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-2 text-phantom-gray font-medium">Cookie Name</th>
                        <th className="text-left py-2 text-phantom-gray font-medium">Purpose</th>
                        <th className="text-left py-2 text-phantom-gray font-medium">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.examples.map((cookie, i) => (
                        <tr key={i} className="border-b border-white/5">
                          <td className="py-2 font-mono text-neural-bright">{cookie.name}</td>
                          <td className="py-2 text-ghost-white">{cookie.purpose}</td>
                          <td className="py-2 text-phantom-gray">{cookie.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Third-Party Services */}
      <section className="relative py-12 px-6 bg-void-elevated/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-ghost-white mb-8">
            Third-Party Services
          </h2>
          <p className="text-phantom-gray mb-6">
            We use the following third-party services that may set cookies on your device:
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {thirdPartyServices.map((service, index) => (
              <div
                key={index}
                className="p-4 bg-void-black border border-white/10 rounded-xl"
              >
                <h3 className="font-semibold text-ghost-white mb-1">{service.name}</h3>
                <p className="text-sm text-phantom-gray mb-2">{service.purpose}</p>
                <a
                  href={service.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-neural-bright hover:underline"
                >
                  Privacy Policy →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="relative py-12 px-6">
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

      {/* Info Box */}
      <section className="relative py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="p-6 bg-void-elevated border border-white/10 rounded-2xl flex items-start gap-4">
            <Info className="w-6 h-6 text-neural-bright flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-ghost-white mb-2">Need More Information?</h3>
              <p className="text-phantom-gray text-sm">
                For more detailed information about how we process your personal data,
                please refer to our{" "}
                <Link href="/privacy" className="text-neural-bright hover:underline">
                  Privacy Policy
                </Link>
                . For questions about your rights or to make a data subject request,
                contact us at{" "}
                <a href="mailto:privacy@betaforge.ai" className="text-neural-bright hover:underline">
                  privacy@betaforge.ai
                </a>
                .
              </p>
            </div>
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
