// ========================
// Payment Provider Detection
// ========================

import {
  PaymentProvider,
  PAYSTACK_COUNTRIES,
  PaystackCountry,
  PAYSTACK_CURRENCIES,
} from "./types";

// Detect payment provider based on country
export function detectPaymentProvider(countryCode: string): PaymentProvider {
  const upperCode = countryCode.toUpperCase() as PaystackCountry;

  if (
    PAYSTACK_COUNTRIES.includes(
      upperCode as (typeof PAYSTACK_COUNTRIES)[number]
    )
  ) {
    return "paystack";
  }

  return "dodo";
}

// Get currency for country
export function getCurrencyForCountry(countryCode: string): string {
  const upperCode = countryCode.toUpperCase() as PaystackCountry;

  if (PAYSTACK_CURRENCIES[upperCode]) {
    return PAYSTACK_CURRENCIES[upperCode];
  }

  // Default to USD for Dodo Payments
  return "USD";
}

// Country name mapping
const COUNTRY_NAMES: Record<string, string> = {
  NG: "Nigeria",
  GH: "Ghana",
  ZA: "South Africa",
  KE: "Kenya",
  CI: "Côte d'Ivoire",
  US: "United States",
  GB: "United Kingdom",
  CA: "Canada",
  AU: "Australia",
  DE: "Germany",
  FR: "France",
  IN: "India",
  BR: "Brazil",
  // Add more as needed
};

export function getCountryName(countryCode: string): string {
  return COUNTRY_NAMES[countryCode.toUpperCase()] || countryCode;
}

// Check if country is supported for payments
export function isCountrySupported(countryCode: string): boolean {
  // All countries are supported - Paystack for Africa, Dodo for rest
  return true;
}

// Get provider display info
export function getProviderInfo(provider: PaymentProvider): {
  name: string;
  description: string;
  supportedMethods: string[];
} {
  if (provider === "paystack") {
    return {
      name: "Paystack",
      description: "Secure payments for Africa",
      supportedMethods: [
        "Cards (Visa, Mastercard, Verve)",
        "Bank Transfer",
        "USSD",
        "Mobile Money",
        "QR Code",
      ],
    };
  }

  return {
    name: "Dodo Payments",
    description: "Global payments platform",
    supportedMethods: [
      "Credit/Debit Cards",
      "Apple Pay",
      "Google Pay",
      "PayPal",
      "Bank Transfer",
      "Buy Now Pay Later",
    ],
  };
}

// Detect country from request headers (for server-side)
export function detectCountryFromRequest(headers: Headers): string | null {
  // Check Cloudflare header
  const cfCountry = headers.get("cf-ipcountry");
  if (cfCountry && cfCountry !== "XX") {
    return cfCountry;
  }

  // Check Vercel header
  const vercelCountry = headers.get("x-vercel-ip-country");
  if (vercelCountry) {
    return vercelCountry;
  }

  // Check standard geo header
  const geoCountry = headers.get("x-geo-country");
  if (geoCountry) {
    return geoCountry;
  }

  return null;
}

// Convert amount to smallest currency unit (e.g., cents, kobo)
export function toSmallestUnit(amount: number, currency: string): number {
  // Most currencies use 100 subunits
  // XOF has no subunit but Paystack requires multiplying by 100 anyway
  return Math.round(amount * 100);
}

// Currency conversion rates (USD base)
// In production, use a real-time currency API
const CURRENCY_RATES: Record<string, number> = {
  USD: 1,
  NGN: 1550, // Nigerian Naira
  GHS: 15.8, // Ghanaian Cedi
  ZAR: 18.5, // South African Rand
  KES: 128, // Kenyan Shilling
  XOF: 610, // West African CFA franc
  EUR: 0.92, // Euro
  GBP: 0.79, // British Pound
  CAD: 1.36, // Canadian Dollar
  AUD: 1.52, // Australian Dollar
  INR: 83, // Indian Rupee
  SGD: 1.34, // Singapore Dollar
  JPY: 148, // Japanese Yen
};

// Convert USD amount to target currency
export function convertCurrency(
  amountInUSD: number,
  targetCurrency: string
): number {
  const rate = CURRENCY_RATES[targetCurrency] || 1;
  return Math.round(amountInUSD * rate * 100) / 100; // Round to 2 decimal places
}

// Convert from smallest unit to display amount
export function fromSmallestUnit(amount: number, currency: string): number {
  return amount / 100;
}

// Format currency for display
export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
}
