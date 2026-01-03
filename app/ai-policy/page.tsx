"use client";

import Link from "next/link";
import {
  Sparkles,
  Brain,
  FileText,
  Shield,
  Eye,
  Lock,
  Users,
  Scale,
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Zap,
  Globe,
} from "lucide-react";
import { Footer } from "@/components/layout";

const principles = [
  {
    title: "Transparency",
    description: "We are open about when and how AI is used in our services. Users always know when they're interacting with AI-generated content.",
    icon: Eye,
  },
  {
    title: "Privacy First",
    description: "Your data is never used to train AI models without explicit consent. We implement strict data isolation and protection measures.",
    icon: Lock,
  },
  {
    title: "Human Oversight",
    description: "AI augments human capabilities but doesn't replace human judgment. Critical decisions always involve human review.",
    icon: Users,
  },
  {
    title: "Fairness & Safety",
    description: "We actively work to prevent bias and ensure our AI systems are safe, reliable, and beneficial for all users.",
    icon: Shield,
  },
];

const dataCommitments = [
  {
    commitment: "Your application data is processed only to provide testing services",
    fulfilled: true,
  },
  {
    commitment: "Test data is encrypted in transit and at rest",
    fulfilled: true,
  },
  {
    commitment: "Your data is never used to train third-party AI models",
    fulfilled: true,
  },
  {
    commitment: "You retain full ownership of all testing results",
    fulfilled: true,
  },
  {
    commitment: "Data is deleted according to your retention settings",
    fulfilled: true,
  },
  {
    commitment: "We maintain SOC 2 Type II certification",
    fulfilled: true,
  },
];

const useCases = [
  {
    title: "Autonomous Testing Agents",
    description: "Our AI agents navigate and test your applications autonomously, simulating real user behavior.",
    details: [
      "Agents use Claude AI to understand UI elements and user flows",
      "Each agent has a unique testing persona with different behaviors",
      "Agents generate human-readable bug reports",
      "Testing actions are logged for reproducibility",
    ],
  },
  {
    title: "Bug Report Generation",
    description: "AI generates detailed, actionable bug reports based on testing observations.",
    details: [
      "Reports include reproduction steps and severity ratings",
      "Screenshots and session recordings are attached",
      "AI suggests potential fixes when applicable",
      "Reports are formatted for easy integration with issue trackers",
    ],
  },
  {
    title: "Test Recommendations",
    description: "AI analyzes your application to suggest testing strategies and coverage areas.",
    details: [
      "Identifies high-risk areas based on complexity",
      "Recommends agent personas for your use case",
      "Suggests testing frequency based on change patterns",
      "Prioritizes tests based on business impact",
    ],
  },
];

const doAndDont = {
  do: [
    "Use BetaForge to test applications you own or have authorization to test",
    "Review AI-generated reports and validate findings",
    "Provide feedback to help improve AI accuracy",
    "Export and retain your test data as needed",
    "Configure retention settings according to your needs",
  ],
  dont: [
    "Test applications without proper authorization",
    "Rely solely on AI for security-critical testing",
    "Submit sensitive personal data not required for testing",
    "Attempt to extract or reverse-engineer AI models",
    "Use testing capabilities for malicious purposes",
  ],
};

const sections = [
  {
    id: "overview",
    title: "Overview",
    content: `BetaForge uses artificial intelligence to power our autonomous testing agents. This AI Usage Policy explains how we deploy AI technology, what data is processed, and your rights regarding AI-driven testing.

Our AI systems are designed to augment software testing by simulating diverse user behaviors, identifying bugs, and generating actionable reports. We believe in responsible AI development and deployment, with strong commitments to transparency, privacy, and user control.

**Key Points:**
• AI agents test your applications on your behalf
• Your data is never used to train AI models
• You maintain full ownership of testing results
• Human oversight is maintained for critical functions`,
  },
  {
    id: "ai-provider",
    title: "Our AI Technology Partner",
    content: `BetaForge's testing agents are powered by Anthropic's Claude AI. Anthropic is a leading AI safety company focused on building reliable and interpretable AI systems.

**About Claude:**
Claude is a next-generation AI assistant built by Anthropic. It's designed to be helpful, harmless, and honest. Claude powers our agents' ability to understand user interfaces, navigate applications, and generate human-like bug reports.

**Data Handling with Anthropic:**
• Test data is sent to Anthropic's servers for processing
• Anthropic is contractually prohibited from using your data for training
• All data transmission is encrypted using TLS 1.3
• Data is not retained by Anthropic after processing
• Anthropic maintains SOC 2 Type II certification

**Why Anthropic:**
We chose Anthropic because of their commitment to AI safety, their transparency about model capabilities and limitations, and their strong data protection practices.`,
  },
  {
    id: "data-processing",
    title: "How AI Processes Your Data",
    content: `When you run tests with BetaForge, here's how your data flows through our AI systems:

**During Testing:**
1. You provide a URL and testing configuration
2. Our agents navigate to your application
3. UI elements, text, and images are captured
4. Data is sent to Claude for analysis and decision-making
5. Claude returns testing actions and observations
6. Results are stored in your BetaForge account

**Data Types Processed:**
• **UI Elements**: Buttons, forms, text, images visible on screen
• **Page Content**: Text and structure of your application pages
• **User Flows**: Navigation paths and interaction sequences
• **Error Messages**: Any errors or warnings displayed

**Data NOT Processed:**
• Backend database contents (unless displayed in UI)
• Server-side code or configurations
• User credentials (unless explicitly provided for testing)
• Data from pages not visited during testing

**Data Retention:**
Test data and AI-generated reports are retained according to your plan settings. Default retention is 90 days. You can export data at any time and request deletion.`,
  },
  {
    id: "limitations",
    title: "AI Limitations & Risks",
    content: `While our AI agents are highly capable, they have limitations. Understanding these helps you use BetaForge effectively.

**Limitations:**
• **Not 100% Coverage**: AI may not find all bugs in your application
• **False Positives**: AI may occasionally report issues that aren't actual bugs
• **Context Gaps**: AI may misunderstand domain-specific functionality
• **Dynamic Content**: Rapidly changing content may cause inconsistent results
• **Authentication**: Complex multi-factor auth flows may require configuration

**Not a Replacement For:**
• Human security testing and penetration testing
• Compliance and regulatory audits
• Usability testing with real users
• Performance and load testing at scale
• Accessibility testing with actual assistive technology users

**Risk Mitigation:**
• Always review AI-generated reports before acting
• Use BetaForge alongside (not instead of) human QA
• Configure test environments appropriately
• Validate critical findings manually`,
  },
  {
    id: "your-rights",
    title: "Your Rights Regarding AI",
    content: `You have specific rights regarding how AI is used in testing your applications:

**Right to Information:**
• Know when AI is making decisions
• Understand how AI processes your data
• Access logs of AI actions during testing

**Right to Control:**
• Configure which agents test your application
• Set data retention periods
• Disable specific AI features
• Export all AI-generated content

**Right to Challenge:**
• Report inaccurate AI findings
• Request human review of bug reports
• Provide feedback to improve AI accuracy

**Right to Opt-Out:**
While AI is core to BetaForge's functionality, you can:
• Choose not to use certain AI features
• Request manual review of findings
• Delete your account and all AI-generated data

To exercise these rights, contact us at privacy@betaforge.ai.`,
  },
  {
    id: "enterprise",
    title: "Enterprise AI Governance",
    content: `Enterprise customers have additional controls for AI governance:

**Custom AI Policies:**
• Configure which AI models can process your data
• Set geographic restrictions on data processing
• Define custom data retention policies

**Audit & Compliance:**
• Access detailed AI decision logs
• Export audit trails for compliance
• Receive SOC 2 reports and security assessments

**Dedicated Support:**
• Named AI governance contact
• Custom training for your security team
• Priority response for AI-related concerns

**Data Isolation:**
• Dedicated infrastructure available
• Private cloud deployment options
• Custom data processing agreements

Contact enterprise@betaforge.ai for more information.`,
  },
  {
    id: "future",
    title: "Our Commitment to Responsible AI",
    content: `AI technology evolves rapidly. We're committed to keeping our practices aligned with the latest standards and best practices.

**Ongoing Initiatives:**
• Regular AI safety audits
• Bias detection and mitigation
• Transparency reporting
• Community feedback integration

**Industry Engagement:**
• Member of the Partnership on AI
• Contributor to AI safety research
• Participant in responsible AI frameworks

**Updates to This Policy:**
We'll update this policy as our AI capabilities and practices evolve. Significant changes will be communicated via email and platform notifications.

**Your Feedback:**
We welcome feedback on our AI practices. Contact us at ai-feedback@betaforge.ai with suggestions, concerns, or questions.`,
  },
];

export default function AIPolicyPage() {
  return (
    <div className="min-h-screen bg-void-black">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 mesh-bg opacity-30" />
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-neural/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-plasma-pink/10 rounded-full blur-[100px]" />
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
              <Link href="/security" className="text-phantom-gray hover:text-ghost-white text-sm transition-colors">
                Security
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-neural/20 mb-6">
            <Brain className="w-4 h-4 text-neural-bright" />
            <span className="text-sm text-phantom-gray">AI Governance</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-ghost-white">AI Usage </span>
            <span className="gradient-text">Policy</span>
          </h1>
          <p className="text-lg text-phantom-gray mb-4">
            Last updated: January 15, 2026
          </p>
          <p className="text-phantom-gray max-w-2xl mx-auto">
            Our commitment to responsible, transparent, and ethical use of artificial
            intelligence in software testing.
          </p>
        </div>
      </section>

      {/* Principles */}
      <section className="relative py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-ghost-white text-center mb-8">
            Our AI Principles
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((principle, index) => (
              <div
                key={index}
                className="p-6 bg-void-elevated border border-white/10 rounded-2xl text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-neural/20 flex items-center justify-center mx-auto mb-4">
                  <principle.icon className="w-6 h-6 text-neural-bright" />
                </div>
                <h3 className="text-lg font-semibold text-ghost-white mb-2">
                  {principle.title}
                </h3>
                <p className="text-sm text-phantom-gray">{principle.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Commitments */}
      <section className="relative py-12 px-6 bg-void-elevated/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-ghost-white text-center mb-8">
            Our Data Commitments
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {dataCommitments.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 bg-void-black border border-white/10 rounded-xl"
              >
                <CheckCircle className="w-5 h-5 text-quantum-green flex-shrink-0" />
                <span className="text-ghost-white">{item.commitment}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How AI is Used */}
      <section className="relative py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-ghost-white text-center mb-8">
            How We Use AI
          </h2>
          <div className="space-y-6">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="p-6 bg-void-elevated border border-white/10 rounded-2xl"
              >
                <h3 className="text-xl font-semibold text-ghost-white mb-2">
                  {useCase.title}
                </h3>
                <p className="text-phantom-gray mb-4">{useCase.description}</p>
                <ul className="grid md:grid-cols-2 gap-2">
                  {useCase.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-ghost-white">
                      <Zap className="w-4 h-4 text-neural-bright flex-shrink-0 mt-0.5" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Do's and Don'ts */}
      <section className="relative py-12 px-6 bg-void-elevated/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-ghost-white text-center mb-8">
            Best Practices
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-void-black border border-quantum-green/30 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-6 h-6 text-quantum-green" />
                <h3 className="text-xl font-semibold text-ghost-white">Do</h3>
              </div>
              <ul className="space-y-3">
                {doAndDont.do.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-phantom-gray">
                    <CheckCircle className="w-4 h-4 text-quantum-green flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 bg-void-black border border-red-500/30 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="w-6 h-6 text-red-400" />
                <h3 className="text-xl font-semibold text-ghost-white">Don't</h3>
              </div>
              <ul className="space-y-3">
                {doAndDont.dont.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-phantom-gray">
                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
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

      {/* Contact CTA */}
      <section className="relative py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 bg-gradient-to-r from-neural/10 to-electric-cyan/10 border border-neural/30 rounded-3xl text-center">
            <Brain className="w-12 h-12 text-neural-bright mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-ghost-white mb-2">
              Questions About Our AI Practices?
            </h2>
            <p className="text-phantom-gray mb-6 max-w-xl mx-auto">
              We're committed to transparency. If you have questions about how AI is
              used in BetaForge, please reach out.
            </p>
            <a
              href="mailto:ai-feedback@betaforge.ai"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neural/20 text-ghost-white font-medium hover:bg-neural/30 transition-colors"
            >
              Contact AI Team
            </a>
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
              href="/security"
              className="p-4 bg-void-black border border-white/10 rounded-xl hover:border-neural/30 transition-all group"
            >
              <FileText className="w-6 h-6 text-neural-bright mb-2" />
              <h3 className="font-semibold text-ghost-white group-hover:text-neural-bright transition-colors">
                Security
              </h3>
              <p className="text-sm text-phantom-gray">Our security practices</p>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
