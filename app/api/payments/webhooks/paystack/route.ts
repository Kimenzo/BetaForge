// ========================
// Paystack Webhook Handler
// ========================

import { NextRequest, NextResponse } from 'next/server';
import { validatePaystackWebhook } from '@/lib/payments/paystack';
import { createServerClient } from '@/lib/supabase';

// Paystack webhook events
type PaystackEvent = {
  event: string;
  data: {
    id: number;
    reference: string;
    status: string;
    amount: number;
    currency: string;
    customer: {
      email: string;
      customer_code: string;
    };
    metadata?: {
      user_id?: string;
      plan_id?: string;
      billing_interval?: string;
    };
    paid_at?: string;
    channel?: string;
    authorization?: {
      authorization_code: string;
      card_type: string;
      last4: string;
      bank: string;
    };
    plan?: {
      plan_code: string;
      name: string;
    };
    subscription_code?: string;
  };
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-paystack-signature');

    // Validate webhook signature
    if (!signature || !validatePaystackWebhook(body, signature)) {
      console.error('Invalid Paystack webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event: PaystackEvent = JSON.parse(body);
    console.log(`Paystack webhook received: ${event.event}`);

    // Handle different event types
    switch (event.event) {
      case 'charge.success':
        await handleChargeSuccess(event.data);
        break;

      case 'subscription.create':
        await handleSubscriptionCreated(event.data);
        break;

      case 'subscription.disable':
        await handleSubscriptionDisabled(event.data);
        break;

      case 'subscription.not_renew':
        await handleSubscriptionNotRenew(event.data);
        break;

      case 'invoice.create':
        await handleInvoiceCreated(event.data);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data);
        break;

      case 'transfer.success':
        // Handle payout success if needed
        break;

      case 'refund.processed':
        await handleRefundProcessed(event.data);
        break;

      default:
        console.log(`Unhandled Paystack event: ${event.event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Paystack webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleChargeSuccess(data: PaystackEvent['data']) {
  console.log(`Payment successful: ${data.reference}`);
  
  const supabase = createServerClient();
  const userId = data.metadata?.user_id;
  const planId = data.metadata?.plan_id;

  if (!userId || !planId) {
    console.log('Missing user_id or plan_id in metadata');
    return;
  }

  // Record payment
  await supabase.from('payments').insert({
    provider: 'paystack' as const,
    provider_payment_id: data.reference,
    user_id: userId,
    plan_id: planId,
    amount: data.amount / 100, // Convert from kobo/pesewas
    currency: data.currency,
    status: 'succeeded',
    metadata: {
      billing_interval: data.metadata?.billing_interval || 'monthly',
      paid_at: data.paid_at,
    },
  });

  // Update user subscription
  await supabase.from('user_subscriptions').upsert({
    user_id: userId,
    plan_id: planId,
    status: 'active',
    provider: 'paystack' as const,
    provider_subscription_id: data.reference,
    current_period_start: new Date().toISOString(),
    current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 days
    updated_at: new Date().toISOString(),
  });

  console.log(`User ${userId} upgraded to ${planId} plan`);
}

async function handleSubscriptionCreated(data: PaystackEvent['data']) {
  console.log(`Subscription created: ${data.subscription_code}`);
  
  const supabase = createServerClient();
  const userId = data.metadata?.user_id;
  const planCode = data.plan?.plan_code;

  if (!userId || !data.subscription_code || !planCode) {
    console.log('Missing required subscription data');
    return;
  }

  await supabase.from('user_subscriptions').upsert({
    user_id: userId,
    provider: 'paystack' as const,
    provider_subscription_id: data.subscription_code,
    plan_id: planCode,
    status: 'active',
    updated_at: new Date().toISOString(),
  });
}

async function handleSubscriptionDisabled(data: PaystackEvent['data']) {
  console.log(`Subscription disabled: ${data.subscription_code}`);
  
  const supabase = createServerClient();

  if (!data.subscription_code) return;

  await supabase
    .from('user_subscriptions')
    .update({
      status: 'cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('provider_subscription_id', data.subscription_code);
}

async function handleSubscriptionNotRenew(data: PaystackEvent['data']) {
  console.log(`Subscription will not renew: ${data.subscription_code}`);
  
  const supabase = createServerClient();

  if (!data.subscription_code) return;

  await supabase
    .from('user_subscriptions')
    .update({
      cancel_at_period_end: true,
      updated_at: new Date().toISOString(),
    })
    .eq('provider_subscription_id', data.subscription_code);
}

async function handleInvoiceCreated(data: PaystackEvent['data']) {
  console.log(`Invoice created for subscription`);
  // Log invoice for record keeping
}

async function handlePaymentFailed(data: PaystackEvent['data']) {
  console.log(`Payment failed: ${data.reference}`);
  
  const supabase = createServerClient();
  const userId = data.metadata?.user_id;

  if (!userId) return;

  // Mark subscription as past_due
  await supabase
    .from('user_subscriptions')
    .update({
      status: 'past_due',
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  // TODO: Send email notification about failed payment
}

async function handleRefundProcessed(data: PaystackEvent['data']) {
  console.log(`Refund processed: ${data.reference}`);
  
  const supabase = createServerClient();

  await supabase
    .from('payments')
    .update({
      status: 'refunded',
      updated_at: new Date().toISOString(),
    })
    .eq('provider_payment_id', data.reference);
}
