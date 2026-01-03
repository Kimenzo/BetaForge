import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = createServerClient();

    // Get current user (in real app, from auth session)
    // For now, get first user or use hardcoded ID
    const { data: users } = await supabase
      .from("users")
      .select("id")
      .limit(1)
      .single();

    if (!users) {
      return NextResponse.json({ subscription: null, paymentMethod: null });
    }

    // Get subscription
    const { data: subscription, error: subError } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", users.id)
      .single();

    if (subError && subError.code !== "PGRST116") {
      // PGRST116 is "not found" which is ok
      throw subError;
    }

    // Get payment method from metadata if exists
    const metadata = subscription?.metadata as Record<string, unknown> | null;
    const paymentMethod = metadata?.payment_method || null;

    return NextResponse.json({
      subscription,
      paymentMethod,
    });
  } catch (error) {
    console.error("Get subscription error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createServerClient();
    const body = await request.json();
    const { planId, billingInterval, paymentMethod } = body;

    // Get current user
    const { data: users } = await supabase
      .from("users")
      .select("id")
      .limit(1)
      .single();

    if (!users) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate amount based on plan
    const planPricing: Record<string, { monthly: number; yearly: number }> = {
      free: { monthly: 0, yearly: 0 },
      pro: { monthly: 49, yearly: 470 }, // 20% off yearly
      team: { monthly: 99, yearly: 950 },
      enterprise: { monthly: 299, yearly: 2870 },
    };

    const planPrices = planPricing[planId as keyof typeof planPricing];
    const amount =
      planPrices?.[billingInterval as keyof typeof planPrices] || 0;

    // Check if subscription exists
    const { data: existingSub } = await supabase
      .from("user_subscriptions")
      .select("id")
      .eq("user_id", users.id)
      .single();

    const now = new Date();
    const periodEnd = new Date(now);
    if (billingInterval === "monthly") {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    }

    const subscriptionData = {
      user_id: users.id,
      provider: "dodo",
      provider_subscription_id: `sub_${Date.now()}_${Math.random()
        .toString(36)
        .substring(7)}`,
      plan_id: planId as string,
      status: "active",
      current_period_start: now.toISOString(),
      current_period_end: periodEnd.toISOString(),
      cancel_at_period_end: false,
      metadata: {
        payment_method: paymentMethod,
        billing_interval: billingInterval,
        amount,
        currency: "USD",
      },
      updated_at: now.toISOString(),
    };

    let subscription;

    if (existingSub) {
      // Update existing subscription
      const { data, error } = await supabase
        .from("user_subscriptions")
        .update(subscriptionData)
        .eq("id", existingSub.id)
        .select()
        .single();

      if (error) throw error;
      subscription = data;
    } else {
      // Create new subscription
      const { data, error } = await supabase
        .from("user_subscriptions")
        .insert([subscriptionData])
        .select()
        .single();

      if (error) throw error;
      subscription = data;
    }

    // Create payment record
    if (amount > 0) {
      const { error: paymentError } = await supabase.from("payments").insert([
        {
          user_id: users.id,
          subscription_id: subscription.id,
          provider: "dodo",
          provider_payment_id: `pay_${Date.now()}`,
          amount,
          currency: "USD",
          status: "succeeded",
          description: `${planId} plan - ${billingInterval}`,
        },
      ]);

      if (paymentError) throw paymentError;

      // Create invoice
      const invoiceNumber = `INV-${Date.now()}`;
      const { error: invoiceError } = await supabase.from("invoices").insert([
        {
          user_id: users.id,
          subscription_id: subscription.id,
          provider: "dodo",
          invoice_number: invoiceNumber,
          amount,
          tax_amount: 0,
          total_amount: amount,
          currency: "USD",
          status: "paid",
          billing_reason: "subscription_create",
          period_start: now.toISOString(),
          period_end: periodEnd.toISOString(),
          paid_at: now.toISOString(),
        },
      ]);

      if (invoiceError) throw invoiceError;
    }

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error("Create/update subscription error:", error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const supabase = createServerClient();

    // Get current user
    const { data: users } = await supabase
      .from("users")
      .select("id")
      .limit(1)
      .single();

    if (!users) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update subscription to cancel at period end
    const { data, error } = await supabase
      .from("user_subscriptions")
      .update({
        cancel_at_period_end: true,
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", users.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ subscription: data });
  } catch (error) {
    console.error("Cancel subscription error:", error);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}
