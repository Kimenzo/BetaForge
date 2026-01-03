// ========================
// Checkout API Route
// ========================

import { NextRequest, NextResponse } from 'next/server';
import {
  createCheckout,
  detectPaymentProvider,
  getCurrencyForCountry,
  detectCountryFromRequest,
  getPlanById,
  isPaymentsConfigured,
} from '@/lib/payments';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, billingInterval, email, name, country, userId, taxId, companyName, isB2B } = body;

    // Validate required fields
    if (!planId || !billingInterval || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: planId, billingInterval, email' },
        { status: 400 }
      );
    }

    // Validate plan exists
    const plan = getPlanById(planId);
    if (!plan) {
      return NextResponse.json(
        { error: `Invalid plan: ${planId}` },
        { status: 400 }
      );
    }

    // Enterprise plans require sales contact
    if (planId === 'enterprise') {
      return NextResponse.json(
        { error: 'Enterprise plans require contacting sales', contactUrl: '/contact?type=enterprise' },
        { status: 400 }
      );
    }

    // Free plan - just redirect to success
    if (planId === 'free') {
      return NextResponse.json({
        success: true,
        checkoutUrl: '/dashboard?plan=free',
        provider: null,
        message: 'Free plan activated',
      });
    }

    // Check if payments are configured
    const config = isPaymentsConfigured();
    
    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Checkout] Payment config check:', {
        paystackConfigured: config.paystack,
        dodoConfigured: config.dodo,
        hasPaystackSecret: !!process.env.PAYSTACK_SECRET_KEY,
        hasPaystackPublic: !!process.env.PAYSTACK_PUBLIC_KEY,
        hasDodoKey: !!process.env.DODO_PAYMENTS_API_KEY,
      });
    }
    
    // Detect country from request headers or body
    const detectedCountry = country || detectCountryFromRequest(request.headers) || 'US';
    let provider = detectPaymentProvider(detectedCountry);

    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log('[Checkout] Provider detection:', { detectedCountry, provider });
    }

    // Fallback: If Paystack is needed but not configured, try Dodo instead
    if (provider === 'paystack' && !config.paystack) {
      if (config.dodo) {
        console.log('[Checkout] Paystack not configured, falling back to Dodo Payments');
        provider = 'dodo';
      } else {
        return NextResponse.json(
          { error: 'Payment provider not configured. Please contact support or add PAYSTACK_SECRET_KEY and PAYSTACK_PUBLIC_KEY to your environment.' },
          { status: 503 }
        );
      }
    }

    // Check if Dodo is configured when needed
    if (provider === 'dodo' && !config.dodo) {
      return NextResponse.json(
        { error: 'Dodo Payments not configured. Please add DODO_PAYMENTS_API_KEY to your environment.' },
        { status: 503 }
      );
    }

    // Build URLs
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const successUrl = `${baseUrl}/dashboard?payment=success&plan=${planId}`;
    const cancelUrl = `${baseUrl}/pricing?payment=cancelled`;

    // Create checkout
    const result = await createCheckout(
      planId,
      billingInterval,
      {
        email,
        name,
        country: detectedCountry,
        userId,
        // B2B fields for VAT exemption
        taxId,
        companyName,
        isB2B,
      },
      successUrl,
      cancelUrl
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      checkoutUrl: result.checkoutUrl,
      sessionId: result.sessionId,
      provider: result.provider,
      currency: getCurrencyForCountry(detectedCountry),
    });
  } catch (error) {
    console.error('Checkout API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to check provider for a country
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country') || detectCountryFromRequest(request.headers) || 'US';

  const provider = detectPaymentProvider(country);
  const currency = getCurrencyForCountry(country);
  const config = isPaymentsConfigured();

  return NextResponse.json({
    country,
    provider,
    currency,
    configured: provider === 'paystack' ? config.paystack : config.dodo,
  });
}
