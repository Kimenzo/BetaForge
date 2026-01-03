// ========================
// Dodo Payments Webhook Handler
// ========================

import { NextRequest, NextResponse } from 'next/server';
import { validateDodoWebhook } from '@/lib/payments/dodo';
import { createServerClient } from '@/lib/supabase';

// Dodo webhook event types
interface DodoWebhookEvent {
  business_id: string;
  timestamp: string;
  type: string;
  data: {
    payment_id?: string;
    subscription_id?: string;
    customer_id?: string;
    product_id?: string;
    amount?: number;
    currency?: string;
    status?: string;
    metadata?: {
      user_id?: string;
      plan_id?: string;
    };
    [key: string]: unknown;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    
    // Get webhook headers
    const webhookId = request.headers.get('webhook-id') || '';
    const webhookSignature = request.headers.get('webhook-signature') || '';
    const webhookTimestamp = request.headers.get('webhook-timestamp') || '';

    // Validate webhook signature
    const isValid = await validateDodoWebhook(body, {
      'webhook-id': webhookId,
      'webhook-signature': webhookSignature,
      'webhook-timestamp': webhookTimestamp,
    });

    if (!isValid) {
      console.error('Invalid Dodo webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event: DodoWebhookEvent = JSON.parse(body);
    console.log(`Dodo webhook received: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      // Payment events
      case 'payment.succeeded':
        await handlePaymentSucceeded(event.data);
        break;

      case 'payment.failed':
        await handlePaymentFailed(event.data);
        break;

      // Subscription events
      case 'subscription.active':
        await handleSubscriptionActive(event.data);
        break;

      case 'subscription.renewed':
        await handleSubscriptionRenewed(event.data);
        break;

      case 'subscription.on_hold':
        await handleSubscriptionOnHold(event.data);
        break;

      case 'subscription.cancelled':
        await handleSubscriptionCancelled(event.data);
        break;

      case 'subscription.failed':
        await handleSubscriptionFailed(event.data);
        break;

      case 'subscription.updated':
        await handleSubscriptionUpdated(event.data);
        break;

      // Refund events
      case 'refund.succeeded':
        await handleRefundSucceeded(event.data);
        break;

      case 'refund.failed':
        await handleRefundFailed(event.data);
        break;

      // Dispute events
      case 'dispute.created':
        await handleDisputeCreated(event.data);
        break;

      default:
        console.log(`Unhandled Dodo event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Dodo webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSucceeded(data: DodoWebhookEvent['data']) {
  console.log(`Payment succeeded: ${data.payment_id}`);
  
  const supabase = createServerClient();
  const userId = data.metadata?.user_id;

  if (!data.payment_id || !userId) {
    console.log('Missing payment_id or user_id');
    return;
  }

  // Record payment
  await supabase.from('payments').insert({
    provider: 'dodo' as const,
    provider_payment_id: data.payment_id,
    user_id: userId,
    plan_id: data.metadata?.plan_id || data.product_id || null,
    amount: data.amount || 0,
    currency: data.currency || 'USD',
    status: 'succeeded',
  });

  console.log(`Payment recorded for user ${userId}`);
}

async function handlePaymentFailed(data: DodoWebhookEvent['data']) {
  console.log(`Payment failed: ${data.payment_id}`);
  
  const supabase = createServerClient();
  const userId = data.metadata?.user_id;

  if (!data.payment_id || !userId) {
    console.log('Missing payment_id or user_id');
    return;
  }

  await supabase.from('payments').insert({
    provider: 'dodo' as const,
    provider_payment_id: data.payment_id,
    user_id: userId,
    plan_id: data.metadata?.plan_id || null,
    amount: data.amount || 0,
    currency: data.currency || 'USD',
    status: 'failed',
  });

  // TODO: Send failure notification email
}

async function handleSubscriptionActive(data: DodoWebhookEvent['data']) {
  console.log(`Subscription active: ${data.subscription_id}`);
  
  const supabase = createServerClient();
  const userId = data.metadata?.user_id;

  if (!userId || !data.subscription_id) return;

  await supabase.from('user_subscriptions').upsert({
    user_id: userId,
    provider: 'dodo' as const,
    provider_subscription_id: data.subscription_id,
    plan_id: data.product_id || 'unknown',
    status: 'active',
    current_period_start: new Date().toISOString(),
    current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  });

  console.log(`Subscription activated for user ${userId}`);
}

async function handleSubscriptionRenewed(data: DodoWebhookEvent['data']) {
  console.log(`Subscription renewed: ${data.subscription_id}`);
  
  const supabase = createServerClient();

  if (!data.subscription_id) return;

  await supabase
    .from('user_subscriptions')
    .update({
      status: 'active',
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('provider_subscription_id', data.subscription_id);
}

async function handleSubscriptionOnHold(data: DodoWebhookEvent['data']) {
  console.log(`Subscription on hold: ${data.subscription_id}`);
  
  const supabase = createServerClient();

  if (!data.subscription_id) return;

  await supabase
    .from('user_subscriptions')
    .update({
      status: 'past_due',
      updated_at: new Date().toISOString(),
    })
    .eq('provider_subscription_id', data.subscription_id);

  // TODO: Send notification to update payment method
}

async function handleSubscriptionCancelled(data: DodoWebhookEvent['data']) {
  console.log(`Subscription cancelled: ${data.subscription_id}`);
  
  const supabase = createServerClient();

  if (!data.subscription_id) return;

  await supabase
    .from('user_subscriptions')
    .update({
      status: 'cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('provider_subscription_id', data.subscription_id);
}

async function handleSubscriptionFailed(data: DodoWebhookEvent['data']) {
  console.log(`Subscription failed: ${data.subscription_id}`);
  
  const supabase = createServerClient();
  const userId = data.metadata?.user_id;

  if (!userId) return;

  // Subscription creation failed - notify user
  // Log the failure
  console.log(`Subscription creation failed for user ${userId}`);
  // TODO: Send failure notification
}

async function handleSubscriptionUpdated(data: DodoWebhookEvent['data']) {
  console.log(`Subscription updated: ${data.subscription_id}`);
  
  // Handle plan changes, etc.
  const supabase = createServerClient();

  if (!data.subscription_id) return;

  await supabase
    .from('user_subscriptions')
    .update({
      plan_id: data.product_id,
      updated_at: new Date().toISOString(),
    })
    .eq('provider_subscription_id', data.subscription_id);
}

async function handleRefundSucceeded(data: DodoWebhookEvent['data']) {
  console.log(`Refund succeeded: ${data.payment_id}`);
  
  const supabase = createServerClient();

  if (!data.payment_id) return;

  await supabase
    .from('payments')
    .update({
      status: 'refunded',
      updated_at: new Date().toISOString(),
    })
    .eq('provider_payment_id', data.payment_id);
}

async function handleRefundFailed(data: DodoWebhookEvent['data']) {
  console.log(`Refund failed: ${data.payment_id}`);
  // Log for manual review
}

async function handleDisputeCreated(data: DodoWebhookEvent['data']) {
  console.log(`Dispute created for payment: ${data.payment_id}`);
  // TODO: Alert team about dispute
}
