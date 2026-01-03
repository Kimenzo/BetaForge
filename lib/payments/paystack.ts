// ========================
// Paystack Payment Provider (Africa)
// ========================

import { paystackConfig } from "./config";
import {
  CustomerInfo,
  CreateCheckoutResponse,
  BillingInterval,
  PaystackCountry,
  PAYSTACK_CURRENCIES,
} from "./types";
import { toSmallestUnit } from "./provider-detection";

interface PaystackTransactionResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    status: string;
    reference: string;
    amount: number;
    currency: string;
    customer: {
      email: string;
      customer_code: string;
    };
    paid_at: string;
    channel: string;
    metadata?: Record<string, unknown>;
  };
}

interface PaystackPlanResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    plan_code: string;
    amount: number;
    interval: string;
    currency: string;
  };
}

// Create a one-time payment checkout
export async function createPaystackCheckout(
  amount: number,
  currency: string,
  customer: CustomerInfo,
  reference: string,
  callbackUrl: string,
  metadata?: Record<string, unknown>
): Promise<CreateCheckoutResponse> {
  try {
    const response = await fetch(
      `${paystackConfig.baseUrl}/transaction/initialize`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paystackConfig.secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: customer.email,
          amount: toSmallestUnit(amount, currency),
          currency,
          reference,
          callback_url: callbackUrl,
          metadata: {
            ...metadata,
            customer_name: customer.name,
            user_id: customer.userId,
          },
        }),
      }
    );

    const data: PaystackTransactionResponse = await response.json();

    if (!data.status) {
      return {
        success: false,
        error: data.message || "Failed to initialize Paystack transaction",
      };
    }

    return {
      success: true,
      checkoutUrl: data.data.authorization_url,
      sessionId: data.data.reference,
      provider: "paystack",
    };
  } catch (error) {
    console.error("Paystack checkout error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create checkout",
    };
  }
}

// Create a subscription checkout
export async function createPaystackSubscription(
  planCode: string,
  customer: CustomerInfo,
  callbackUrl: string
): Promise<CreateCheckoutResponse> {
  try {
    // First, create or get customer
    const customerResponse = await fetch(`${paystackConfig.baseUrl}/customer`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackConfig.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: customer.email,
        first_name: customer.name?.split(" ")[0],
        last_name: customer.name?.split(" ").slice(1).join(" "),
        metadata: {
          user_id: customer.userId,
        },
      }),
    });

    const customerData = await customerResponse.json();

    if (!customerData.status && !customerData.data?.customer_code) {
      // Try to fetch existing customer
      const existingCustomer = await fetch(
        `${paystackConfig.baseUrl}/customer/${encodeURIComponent(
          customer.email
        )}`,
        {
          headers: {
            Authorization: `Bearer ${paystackConfig.secretKey}`,
          },
        }
      );
      const existingData = await existingCustomer.json();
      if (!existingData.status) {
        return {
          success: false,
          error: "Failed to create or find customer",
        };
      }
    }

    // Initialize subscription transaction
    const response = await fetch(
      `${paystackConfig.baseUrl}/transaction/initialize`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paystackConfig.secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: customer.email,
          plan: planCode,
          callback_url: callbackUrl,
          metadata: {
            user_id: customer.userId,
          },
        }),
      }
    );

    const data: PaystackTransactionResponse = await response.json();

    if (!data.status) {
      return {
        success: false,
        error: data.message || "Failed to initialize subscription",
      };
    }

    return {
      success: true,
      checkoutUrl: data.data.authorization_url,
      sessionId: data.data.reference,
      provider: "paystack",
    };
  } catch (error) {
    console.error("Paystack subscription error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create subscription",
    };
  }
}

// Verify a transaction
export async function verifyPaystackTransaction(reference: string): Promise<{
  success: boolean;
  data?: PaystackVerifyResponse["data"];
  error?: string;
}> {
  try {
    const response = await fetch(
      `${paystackConfig.baseUrl}/transaction/verify/${encodeURIComponent(
        reference
      )}`,
      {
        headers: {
          Authorization: `Bearer ${paystackConfig.secretKey}`,
        },
      }
    );

    const data: PaystackVerifyResponse = await response.json();

    if (!data.status || data.data.status !== "success") {
      return {
        success: false,
        error: data.message || "Transaction verification failed",
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error("Paystack verification error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Verification failed",
    };
  }
}

// Create a subscription plan (admin function)
export async function createPaystackPlan(
  name: string,
  amount: number,
  interval: "monthly" | "annually",
  currency: string = "NGN"
): Promise<{ success: boolean; planCode?: string; error?: string }> {
  try {
    const response = await fetch(`${paystackConfig.baseUrl}/plan`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackConfig.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        amount: toSmallestUnit(amount, currency),
        interval,
        currency,
      }),
    });

    const data: PaystackPlanResponse = await response.json();

    if (!data.status) {
      return {
        success: false,
        error: data.message || "Failed to create plan",
      };
    }

    return {
      success: true,
      planCode: data.data.plan_code,
    };
  } catch (error) {
    console.error("Paystack plan creation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create plan",
    };
  }
}

// Cancel a subscription
export async function cancelPaystackSubscription(
  subscriptionCode: string,
  emailToken: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(
      `${paystackConfig.baseUrl}/subscription/disable`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paystackConfig.secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: subscriptionCode,
          token: emailToken,
        }),
      }
    );

    const data = await response.json();

    if (!data.status) {
      return {
        success: false,
        error: data.message || "Failed to cancel subscription",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Paystack subscription cancellation error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to cancel subscription",
    };
  }
}

// Validate Paystack webhook signature
export function validatePaystackWebhook(
  body: string,
  signature: string
): boolean {
  const crypto = require("crypto");
  const hash = crypto
    .createHmac("sha512", paystackConfig.secretKey)
    .update(body)
    .digest("hex");

  return hash === signature;
}

// Get exchange rate estimate (NGN to USD for display)
export function getPaystackCurrencySymbol(
  countryCode: PaystackCountry
): string {
  const symbols: Record<PaystackCountry, string> = {
    NG: "₦",
    GH: "₵",
    ZA: "R",
    KE: "KSh",
    CI: "CFA",
  };
  return symbols[countryCode] || "$";
}
