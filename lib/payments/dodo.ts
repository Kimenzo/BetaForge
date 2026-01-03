// ========================
// Dodo Payments Provider (Global)
// ========================

import { dodoConfig } from './config';
import {
  CustomerInfo,
  CreateCheckoutResponse,
  BillingInterval,
} from './types';

interface DodoCheckoutSession {
  session_id: string;
  checkout_url: string;
}

interface DodoPaymentResponse {
  payment_id: string;
  payment_link?: string;
  status: string;
  amount: number;
  currency: string;
}

interface DodoSubscriptionResponse {
  subscription_id: string;
  status: string;
  customer_id: string;
  product_id: string;
  next_billing_date: string;
}

// Direct checkout URL (no API call needed)
const DODO_CHECKOUT_BASE_URL = 'https://checkout.dodopayments.com/buy';

// Generate direct checkout URL as fallback
export function getDodoDirectCheckoutUrl(
  productId: string,
  quantity: number = 1
): string {
  return `${DODO_CHECKOUT_BASE_URL}/${productId}?quantity=${quantity}`;
}

// Create a checkout session (recommended approach)
export async function createDodoCheckoutSession(
  productId: string,
  customer: CustomerInfo,
  returnUrl: string,
  quantity: number = 1,
  trialDays?: number
): Promise<CreateCheckoutResponse> {
  // Set a 5-second timeout (not 5 minutes - that's too long for UX)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`${dodoConfig.baseUrl}/checkouts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${dodoConfig.apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        product_cart: [
          {
            product_id: productId,
            quantity,
          },
        ],
        customer: customer.email ? {
          email: customer.email,
          name: customer.companyName || customer.name || undefined,
        } : undefined,
        return_url: returnUrl,
        // B2B Tax ID for VAT reverse charge
        ...(customer.taxId && { tax_id: customer.taxId }),
        ...(trialDays && {
          subscription_data: {
            trial_period_days: trialDays,
          },
        }),
        metadata: {
          user_id: customer.userId,
          country: customer.country,
          is_b2b: customer.isB2B ? 'true' : 'false',
          company_name: customer.companyName,
        },
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const text = await response.text();
      let errorMessage = `HTTP ${response.status}: Failed to create checkout`;
      try {
        if (text) {
          const errorData = JSON.parse(text);
          errorMessage = errorData.message || errorData.error || errorMessage;
        }
      } catch {
        // Response wasn't JSON, use status text
        errorMessage = `HTTP ${response.status}: ${response.statusText || 'Failed to create checkout'}`;
      }
      return {
        success: false,
        error: errorMessage,
      };
    }

    const data: DodoCheckoutSession = await response.json();

    return {
      success: true,
      checkoutUrl: data.checkout_url,
      sessionId: data.session_id,
      provider: 'dodo',
    };
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Fallback to direct checkout URL on timeout or fetch failure
    console.warn('Dodo API failed, using direct checkout URL:', error);
    const fallbackUrl = getDodoDirectCheckoutUrl(productId, quantity);
    
    return {
      success: true,
      checkoutUrl: fallbackUrl,
      sessionId: `fallback_${Date.now()}`,
      provider: 'dodo',
    };
  }
}

// Create a one-time payment
export async function createDodoPayment(
  productId: string,
  customer: CustomerInfo,
  returnUrl: string,
  metadata?: Record<string, unknown>
): Promise<CreateCheckoutResponse> {
  try {
    const response = await fetch(`${dodoConfig.baseUrl}/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${dodoConfig.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payment_link: true,
        billing: {
          city: 'Unknown',
          country: customer.country || 'US',
          state: 'Unknown',
          street: 'Unknown',
          zipcode: 0,
        },
        customer: {
          email: customer.email,
          name: customer.name || 'Customer',
        },
        product_cart: [
          {
            product_id: productId,
            quantity: 1,
          },
        ],
        return_url: returnUrl,
        metadata: {
          user_id: customer.userId,
          ...metadata,
        },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      let errorMessage = `HTTP ${response.status}: Failed to create payment`;
      try {
        if (text) {
          const errorData = JSON.parse(text);
          errorMessage = errorData.message || errorData.error || errorMessage;
        }
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText || 'Failed to create payment'}`;
      }
      return {
        success: false,
        error: errorMessage,
      };
    }

    const data: DodoPaymentResponse = await response.json();

    return {
      success: true,
      checkoutUrl: data.payment_link,
      sessionId: data.payment_id,
      provider: 'dodo',
    };
  } catch (error) {
    console.error('Dodo payment error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create payment',
    };
  }
}

// Create a subscription
export async function createDodoSubscription(
  productId: string,
  customer: CustomerInfo,
  returnUrl: string,
  trialDays?: number
): Promise<CreateCheckoutResponse> {
  // Use checkout session for subscriptions (recommended)
  return createDodoCheckoutSession(productId, customer, returnUrl, 1, trialDays);
}

// Retrieve a payment
export async function getDodoPayment(paymentId: string): Promise<{
  success: boolean;
  data?: DodoPaymentResponse;
  error?: string;
}> {
  try {
    const response = await fetch(`${dodoConfig.baseUrl}/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${dodoConfig.apiKey}`,
      },
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: Failed to retrieve payment`,
      };
    }

    const data: DodoPaymentResponse = await response.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Dodo get payment error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve payment',
    };
  }
}

// Retrieve a subscription
export async function getDodoSubscription(subscriptionId: string): Promise<{
  success: boolean;
  data?: DodoSubscriptionResponse;
  error?: string;
}> {
  try {
    const response = await fetch(`${dodoConfig.baseUrl}/subscriptions/${subscriptionId}`, {
      headers: {
        'Authorization': `Bearer ${dodoConfig.apiKey}`,
      },
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: Failed to retrieve subscription`,
      };
    }

    const data: DodoSubscriptionResponse = await response.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Dodo get subscription error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve subscription',
    };
  }
}

// Cancel a subscription
export async function cancelDodoSubscription(
  subscriptionId: string,
  cancelAtPeriodEnd: boolean = true
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${dodoConfig.baseUrl}/subscriptions/${subscriptionId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${dodoConfig.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cancel_at_period_end: cancelAtPeriodEnd,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Failed to cancel subscription',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Dodo subscription cancellation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to cancel subscription',
    };
  }
}

// Validate Dodo webhook signature (Standard Webhooks)
export async function validateDodoWebhook(
  body: string,
  headers: {
    'webhook-id': string;
    'webhook-signature': string;
    'webhook-timestamp': string;
  }
): Promise<boolean> {
  try {
    const webhookSecret = process.env.DODO_WEBHOOK_KEY;
    if (!webhookSecret) {
      console.error('DODO_WEBHOOK_KEY not configured');
      return false;
    }

    // Standard Webhooks verification
    const crypto = require('crypto');
    const signedContent = `${headers['webhook-id']}.${headers['webhook-timestamp']}.${body}`;
    
    // The secret is base64 encoded, decode it
    const secretBytes = Buffer.from(webhookSecret.split('_').pop() || webhookSecret, 'base64');
    
    const expectedSignature = crypto
      .createHmac('sha256', secretBytes)
      .update(signedContent)
      .digest('base64');

    // webhook-signature format: v1,<base64_signature>
    const signatures = headers['webhook-signature'].split(' ');
    for (const sig of signatures) {
      const [version, signature] = sig.split(',');
      if (version === 'v1' && signature === expectedSignature) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('Dodo webhook validation error:', error);
    return false;
  }
}

// Create a refund
export async function createDodoRefund(
  paymentId: string,
  amount?: number,
  reason?: string
): Promise<{ success: boolean; refundId?: string; error?: string }> {
  try {
    const response = await fetch(`${dodoConfig.baseUrl}/refunds`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${dodoConfig.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payment_id: paymentId,
        ...(amount && { amount }),
        ...(reason && { reason }),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Failed to create refund',
      };
    }

    const data = await response.json();

    return {
      success: true,
      refundId: data.refund_id,
    };
  } catch (error) {
    console.error('Dodo refund error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create refund',
    };
  }
}
