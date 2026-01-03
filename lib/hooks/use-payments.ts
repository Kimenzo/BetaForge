// ========================
// Payment Hooks for Client
// ========================

"use client";

import { useState, useEffect, useCallback } from "react";

interface PaymentProvider {
  country: string;
  provider: "paystack" | "dodo";
  currency: string;
  configured: boolean;
}

interface CheckoutResult {
  success: boolean;
  checkoutUrl?: string;
  sessionId?: string;
  provider?: string;
  error?: string;
}

interface Subscription {
  plan_id: string;
  status: string;
  provider: string | null;
  current_period_end?: string;
  cancel_at_period_end?: boolean;
}

// Detect user's country
export function useCountryDetection() {
  const [country, setCountry] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function detectCountry() {
      try {
        // Try multiple detection methods
        // 1. Check browser timezone
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        // 2. Try IP geolocation (free service)
        const response = await fetch("https://ipapi.co/json/", {
          cache: "force-cache",
        });

        if (response.ok) {
          const data = await response.json();
          setCountry(data.country_code || "US");
        } else {
          // Fallback based on timezone
          const countryFromTimezone = getCountryFromTimezone(timezone);
          setCountry(countryFromTimezone);
        }
      } catch {
        // Default to US on error
        setCountry("US");
      } finally {
        setLoading(false);
      }
    }

    detectCountry();
  }, []);

  return { country, loading, setCountry };
}

// Get payment provider info for a country
export function usePaymentProvider(country: string | null) {
  const [provider, setProvider] = useState<PaymentProvider | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProvider() {
      if (!country) return;

      setLoading(true);
      try {
        const response = await fetch(
          `/api/payments/checkout?country=${country}`
        );
        if (response.ok) {
          const data = await response.json();
          setProvider(data);
        }
      } catch (error) {
        console.error("Failed to fetch payment provider:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProvider();
  }, [country]);

  return { provider, loading };
}

// Create checkout session
export function useCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCheckout = useCallback(
    async (
      planId: string,
      billingInterval: "monthly" | "yearly",
      email: string,
      name?: string,
      country?: string,
      taxId?: string,
      companyName?: string,
      userId?: string
    ): Promise<CheckoutResult> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/payments/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            planId,
            billingInterval,
            email,
            name,
            country,
            userId,
            // B2B fields
            taxId: taxId || undefined,
            companyName: companyName || undefined,
            isB2B: !!(taxId || companyName),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to create checkout");
          return { success: false, error: data.error };
        }

        // Redirect to checkout
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        }

        return {
          success: true,
          checkoutUrl: data.checkoutUrl,
          sessionId: data.sessionId,
          provider: data.provider,
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Checkout failed";
        setError(message);
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { createCheckout, loading, error };
}

// Get current subscription
export function useSubscription(userId: string | null) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    if (!userId) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/payments/subscription?userId=${userId}`
      );
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      } else {
        setError("Failed to fetch subscription");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch subscription"
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const cancelSubscription = useCallback(
    async (cancelImmediately = false) => {
      if (!userId) return { success: false, error: "No user ID" };

      try {
        const response = await fetch("/api/payments/subscription", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, cancelImmediately }),
        });

        const data = await response.json();

        if (response.ok) {
          await fetchSubscription(); // Refresh
          return { success: true, message: data.message };
        } else {
          return { success: false, error: data.error };
        }
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : "Failed to cancel",
        };
      }
    },
    [userId, fetchSubscription]
  );

  return {
    subscription,
    loading,
    error,
    cancelSubscription,
    refresh: fetchSubscription,
  };
}

// Helper: Get country from timezone
function getCountryFromTimezone(timezone: string): string {
  const timezoneCountryMap: Record<string, string> = {
    "Africa/Lagos": "NG",
    "Africa/Accra": "GH",
    "Africa/Johannesburg": "ZA",
    "Africa/Nairobi": "KE",
    "Africa/Abidjan": "CI",
    "America/New_York": "US",
    "America/Los_Angeles": "US",
    "America/Chicago": "US",
    "America/Denver": "US",
    "Europe/London": "GB",
    "Europe/Paris": "FR",
    "Europe/Berlin": "DE",
    "Asia/Kolkata": "IN",
    "Asia/Tokyo": "JP",
    "Australia/Sydney": "AU",
    // Add more as needed
  };

  return timezoneCountryMap[timezone] || "US";
}

// Format price for display
export function formatPrice(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Get provider display name
export function getProviderDisplayName(provider: "paystack" | "dodo"): string {
  return provider === "paystack" ? "Paystack" : "Dodo Payments";
}

// Check if country is in Africa (Paystack)
export function isAfricanCountry(countryCode: string): boolean {
  const africanCountries = ["NG", "GH", "ZA", "KE", "CI"];
  return africanCountries.includes(countryCode.toUpperCase());
}
