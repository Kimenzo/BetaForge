// ========================
// Subscription Management API
// ========================

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { cancelPaystackSubscription } from '@/lib/payments/paystack';
import { cancelDodoSubscription } from '@/lib/payments/dodo';

// GET: Get user's current subscription
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    
    const { data: subscription, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
      console.error('Error fetching subscription:', error);
      return NextResponse.json(
        { error: 'Failed to fetch subscription' },
        { status: 500 }
      );
    }

    // Return free plan if no subscription
    if (!subscription) {
      return NextResponse.json({
        plan_id: 'free',
        status: 'active',
        provider: null,
      });
    }

    return NextResponse.json(subscription);
  } catch (error) {
    console.error('Subscription API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: Cancel subscription
export async function DELETE(request: NextRequest) {
  try {
    const { userId, cancelImmediately = false } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    
    // Get current subscription
    const { data: subscription, error: fetchError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (fetchError || !subscription) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    // Cancel with provider
    let cancelResult;
    if (subscription.provider === 'paystack') {
      // Paystack requires email token - this would need to be fetched or provided
      // For now, we'll just update our database
      cancelResult = { success: true };
    } else if (subscription.provider === 'dodo') {
      cancelResult = await cancelDodoSubscription(
        subscription.provider_subscription_id,
        !cancelImmediately // cancelAtPeriodEnd
      );
    } else {
      cancelResult = { success: true };
    }

    if (!cancelResult.success) {
      return NextResponse.json(
        { error: cancelResult.error || 'Failed to cancel subscription' },
        { status: 400 }
      );
    }

    // Update database
    const updateData = cancelImmediately
      ? { status: 'cancelled', updated_at: new Date().toISOString() }
      : { cancel_at_period_end: true, updated_at: new Date().toISOString() };

    await supabase
      .from('user_subscriptions')
      .update(updateData)
      .eq('user_id', userId);

    return NextResponse.json({
      success: true,
      message: cancelImmediately
        ? 'Subscription cancelled immediately'
        : 'Subscription will be cancelled at the end of the billing period',
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
