// ========================
// Payment Configuration
// ========================

import { PricingPlan, PaystackConfig, DodoConfig } from './types';

// Paystack Configuration
export const paystackConfig: PaystackConfig = {
  secretKey: process.env.PAYSTACK_SECRET_KEY || '',
  publicKey: process.env.PAYSTACK_PUBLIC_KEY || '',
  baseUrl: 'https://api.paystack.co',
};

// Dodo Payments Configuration
export const dodoConfig: DodoConfig = {
  apiKey: process.env.DODO_PAYMENTS_API_KEY || '',
  environment: (process.env.DODO_PAYMENTS_ENVIRONMENT as 'test_mode' | 'live_mode') || 'live_mode',
  baseUrl: process.env.DODO_PAYMENTS_ENVIRONMENT === 'test_mode' 
    ? 'https://test.dodopayments.com'
    : 'https://live.dodopayments.com',
};

// Pricing Plans Configuration
export const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for trying out BetaForge',
    price: { monthly: 0, yearly: 0 },
    features: [
      { text: '1 project', included: true },
      { text: '3 test sessions/month', included: true },
      { text: '2 AI agents per session', included: true },
      { text: 'Basic bug reports', included: true },
      { text: 'Community support', included: true },
      { text: '7-day report retention', included: true },
      { text: 'API access', included: false },
      { text: 'CI/CD integrations', included: false },
      { text: 'Custom agents', included: false },
      { text: 'Priority support', included: false },
    ],
    limits: {
      projects: 1,
      sessionsPerMonth: 3,
      agentsPerSession: 2,
      reportRetentionDays: 7,
      customAgents: 0,
      apiAccess: false,
      cicdIntegrations: false,
      sso: false,
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For growing teams and projects',
    price: { monthly: 49, yearly: 39 },
    popular: true,
    // These would be created in Dodo/Paystack dashboards
    dodoProductId: process.env.DODO_PRO_MONTHLY_PRODUCT_ID,
    paystackProductId: process.env.PAYSTACK_PRO_PLAN_CODE,
    features: [
      { text: '10 projects', included: true },
      { text: '100 test sessions/month', included: true },
      { text: '6 AI agents per session', included: true },
      { text: 'Detailed bug reports with steps', included: true },
      { text: 'Email support', included: true },
      { text: '90-day report retention', included: true },
      { text: 'Full API access', included: true },
      { text: 'GitHub, GitLab, Bitbucket', included: true },
      { text: 'Custom agents', included: false },
      { text: 'Priority support', included: false },
    ],
    limits: {
      projects: 10,
      sessionsPerMonth: 100,
      agentsPerSession: 6,
      reportRetentionDays: 90,
      customAgents: 0,
      apiAccess: true,
      cicdIntegrations: true,
      sso: false,
    },
  },
  {
    id: 'team',
    name: 'Team',
    description: 'For collaborative testing teams',
    price: { monthly: 149, yearly: 119 },
    dodoProductId: process.env.DODO_TEAM_MONTHLY_PRODUCT_ID,
    paystackProductId: process.env.PAYSTACK_TEAM_PLAN_CODE,
    features: [
      { text: 'Unlimited projects', included: true },
      { text: '500 test sessions/month', included: true },
      { text: '6 AI agents per session', included: true },
      { text: 'Advanced reports + analytics', included: true },
      { text: 'Priority email support', included: true },
      { text: '1-year report retention', included: true },
      { text: 'Full API access', included: true },
      { text: 'All CI/CD integrations', included: true },
      { text: '3 custom agent personas', included: true },
      { text: 'Slack & Jira integration', included: true },
    ],
    limits: {
      projects: null,
      sessionsPerMonth: 500,
      agentsPerSession: 6,
      reportRetentionDays: 365,
      customAgents: 3,
      apiAccess: true,
      cicdIntegrations: true,
      sso: false,
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations',
    price: { monthly: null, yearly: null },
    features: [
      { text: 'Unlimited everything', included: true },
      { text: 'Unlimited test sessions', included: true },
      { text: 'Parallel agent execution', included: true },
      { text: 'Custom reporting & exports', included: true },
      { text: '24/7 dedicated support', included: true },
      { text: 'Unlimited retention', included: true },
      { text: 'Custom API limits', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'Unlimited custom agents', included: true },
      { text: 'SSO, SAML, SOC 2', included: true },
    ],
    limits: {
      projects: null,
      sessionsPerMonth: null,
      agentsPerSession: 99,
      reportRetentionDays: null,
      customAgents: 99,
      apiAccess: true,
      cicdIntegrations: true,
      sso: true,
    },
  },
];

// Get plan by ID
export function getPlanById(planId: string): PricingPlan | undefined {
  return pricingPlans.find(plan => plan.id === planId);
}

// Calculate price based on billing interval
export function getPlanPrice(plan: PricingPlan, interval: 'monthly' | 'yearly'): number {
  const price = interval === 'yearly' ? plan.price.yearly : plan.price.monthly;
  return price ?? 0;
}

// Calculate annual savings
export function getAnnualSavings(plan: PricingPlan): number {
  if (!plan.price.monthly || !plan.price.yearly) return 0;
  return (plan.price.monthly - plan.price.yearly) * 12;
}
