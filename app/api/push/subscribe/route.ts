import { NextRequest, NextResponse } from "next/server";

// ============================================
// Push Notifications API
// ============================================
// Note: Requires web-push package and push_subscriptions table
// This is a stub implementation that returns 503 when not configured

// VAPID keys configuration
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "";

// Check if push notifications are configured
function isPushConfigured(): boolean {
  return !!(VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY);
}

// Subscribe to push notifications
export async function POST(request: NextRequest) {
  if (!isPushConfigured()) {
    return NextResponse.json(
      {
        error: "Push notifications not configured",
        message:
          "Set NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY environment variables",
      },
      { status: 503 }
    );
  }

  try {
    const { subscription, userId } = await request.json();

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: "Invalid subscription" },
        { status: 400 }
      );
    }

    // Note: Requires push_subscriptions table in Supabase
    // For now, return success to indicate the endpoint works
    console.log(
      "[Push] Subscription received for user:",
      userId,
      "endpoint:",
      subscription.endpoint
    );

    return NextResponse.json({
      success: true,
      message: "Push notifications require database table setup",
    });
  } catch (error) {
    console.error("[Push] Subscription error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Unsubscribe from push notifications
export async function DELETE(request: NextRequest) {
  if (!isPushConfigured()) {
    return NextResponse.json(
      { error: "Push notifications not configured" },
      { status: 503 }
    );
  }

  try {
    const { endpoint } = await request.json();

    if (!endpoint) {
      return NextResponse.json({ error: "Endpoint required" }, { status: 400 });
    }

    console.log("[Push] Unsubscribe requested for endpoint:", endpoint);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Push] Unsubscribe error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get VAPID public key for client subscription
export async function GET() {
  return NextResponse.json({
    publicKey: VAPID_PUBLIC_KEY || null,
    configured: isPushConfigured(),
  });
}
