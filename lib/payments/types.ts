// ========================
// Payment Types & Configuration
// ========================

export type PaymentProvider = 'paystack' | 'dodo';
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'on_hold' | 'trialing';
export type BillingInterval = 'monthly' | 'yearly';

// Pricing Plans
export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number | null;
    yearly: number | null;
  };
  features: PlanFeature[];
  limits: PlanLimits;
  popular?: boolean;
  // Provider-specific product IDs
  paystackProductId?: string;
  dodoProductId?: string;
}

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface PlanLimits {
  projects: number | null; // null = unlimited
  sessionsPerMonth: number | null;
  agentsPerSession: number;
  reportRetentionDays: number | null;
  customAgents: number;
  apiAccess: boolean;
  cicdIntegrations: boolean;
  sso: boolean;
}

// African countries supported by Paystack
export const PAYSTACK_COUNTRIES = [
  'NG', // Nigeria
  'GH', // Ghana
  'ZA', // South Africa
  'KE', // Kenya
  'CI', // Côte d'Ivoire
] as const;

export type PaystackCountry = typeof PAYSTACK_COUNTRIES[number];

// Paystack currencies
export const PAYSTACK_CURRENCIES: Record<PaystackCountry, string> = {
  NG: 'NGN',
  GH: 'GHS',
  ZA: 'ZAR',
  KE: 'KES',
  CI: 'XOF',
};

// Customer Information
export interface CustomerInfo {
  email: string;
  name?: string;
  country?: string;
  userId?: string;
  taxId?: string; // VAT/Tax ID for B2B customers (EU VAT, GST, etc.)
  companyName?: string; // Business name for B2B
  isB2B?: boolean; // Whether this is a business purchase
  metadata?: Record<string, unknown>;
}

// Checkout Session
export interface CheckoutSession {
  id: string;
  provider: PaymentProvider;
  planId: string;
  billingInterval: BillingInterval;
  customer: CustomerInfo;
  amount: number;
  currency: string;
  checkoutUrl: string;
  returnUrl: string;
  status: 'pending' | 'completed' | 'expired';
  createdAt: Date;
  expiresAt: Date;
}

// Payment Record
export interface PaymentRecord {
  id: string;
  provider: PaymentProvider;
  providerPaymentId: string;
  userId: string;
  planId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  billingInterval: BillingInterval;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  paidAt?: Date;
}

// Subscription Record
export interface SubscriptionRecord {
  id: string;
  provider: PaymentProvider;
  providerSubscriptionId: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  billingInterval: BillingInterval;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Webhook Events
export interface PaymentWebhookEvent {
  provider: PaymentProvider;
  type: string;
  data: unknown;
  timestamp: Date;
}

// Checkout Request
export interface CreateCheckoutRequest {
  planId: string;
  billingInterval: BillingInterval;
  customer: CustomerInfo;
  successUrl: string;
  cancelUrl: string;
}

// Checkout Response
export interface CreateCheckoutResponse {
  success: boolean;
  checkoutUrl?: string;
  sessionId?: string;
  provider?: PaymentProvider;
  error?: string;
}

// Provider Configuration
export interface PaystackConfig {
  secretKey: string;
  publicKey: string;
  baseUrl: string;
}

export interface DodoConfig {
  apiKey: string;
  environment: 'test_mode' | 'live_mode';
  baseUrl: string;
}
