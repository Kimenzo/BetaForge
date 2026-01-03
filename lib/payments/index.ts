// ========================
// Payment Module Exports
// ========================

// Types
export * from './types';

// Configuration
export * from './config';

// Provider Detection
export * from './provider-detection';

// Providers
export * from './paystack';
export * from './dodo';

// Unified Payment Service
import {
  PaymentProvider,
  CustomerInfo,
  CreateCheckoutResponse,
  BillingInterval,
} from './types';
import { getPlanById, getPlanPrice } from './config';
import { detectPaymentProvider, getCurrencyForCountry, convertCurrency } from './provider-detection';
import { createPaystackCheckout, createPaystackSubscription } from './paystack';
import { createDodoCheckoutSession } from './dodo';

// Generate unique reference
function generateReference(prefix: string = 'bf'): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}`;
}

// Unified checkout creation
export async function createCheckout(
  planId: string,
  billingInterval: BillingInterval,
  customer: CustomerInfo,
  successUrl: string,
  cancelUrl: string
): Promise<CreateCheckoutResponse> {
  // Get the plan
  const plan = getPlanById(planId);
  if (!plan) {
    return {
      success: false,
      error: `Plan not found: ${planId}`,
    };
  }

  // Enterprise plans require contact
  if (plan.id === 'enterprise') {
    return {
      success: false,
      error: 'Enterprise plans require contacting sales',
    };
  }

  // Free plan doesn't need payment
  if (plan.id === 'free') {
    return {
      success: true,
      checkoutUrl: successUrl,
      provider: 'dodo', // placeholder
    };
  }

  // Detect provider based on customer country
  const country = customer.country || 'US';
  const provider = detectPaymentProvider(country);
  const currency = getCurrencyForCountry(country);
  const amount = getPlanPrice(plan, billingInterval);
  
  // Calculate yearly amount if applicable
  const totalAmountUSD = billingInterval === 'yearly' ? amount * 12 : amount;
  
  // Convert to local currency for Paystack
  const totalAmount = provider === 'paystack' && currency !== 'USD'
    ? convertCurrency(totalAmountUSD, currency)
    : totalAmountUSD;

  if (provider === 'paystack') {
    // Use Paystack for African countries
    if (plan.paystackProductId) {
      // Subscription flow
      return createPaystackSubscription(
        plan.paystackProductId,
        customer,
        successUrl
      );
    } else {
      // One-time payment (first month)
      const reference = generateReference('ps');
      return createPaystackCheckout(
        totalAmount,
        currency,
        customer,
        reference,
        successUrl,
        {
          plan_id: planId,
          billing_interval: billingInterval,
        }
      );
    }
  } else {
    // Use Dodo for rest of world
    const productId = billingInterval === 'yearly' 
      ? (plan.dodoProductId?.replace('monthly', 'yearly') || plan.dodoProductId)
      : plan.dodoProductId;

    if (!productId) {
      // Fallback: create payment without product ID
      // In production, you'd create products in Dodo dashboard first
      return {
        success: false,
        error: 'Product not configured. Please contact support.',
      };
    }

    return createDodoCheckoutSession(
      productId,
      customer,
      successUrl,
      1,
      14 // 14-day trial
    );
  }
}

// Check if payments are properly configured
export function isPaymentsConfigured(): {
  paystack: boolean;
  dodo: boolean;
} {
  return {
    paystack: !!(process.env.PAYSTACK_SECRET_KEY && process.env.PAYSTACK_PUBLIC_KEY),
    dodo: !!process.env.DODO_PAYMENTS_API_KEY,
  };
}
