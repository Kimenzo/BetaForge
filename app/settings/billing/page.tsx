"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CreditCard,
  Download,
  ExternalLink,
  Check,
  AlertTriangle,
  Calendar,
  Receipt,
  Zap,
  ArrowUpRight,
  Clock,
  FileText,
  Sparkles,
  Loader2,
} from "lucide-react";

interface Subscription {
  id: string;
  plan_id: string;
  status: string;
  billing_interval: string;
  amount: number;
  currency: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  metadata?: {
    payment_method?: {
      brand: string;
      last4: string;
      expiryMonth: number;
      expiryYear: number;
    };
  };
}

interface Invoice {
  id: string;
  invoice_number: string;
  created_at: string;
  total_amount: number;
  status: string;
  pdf_url?: string;
}

interface Usage {
  projects: { used: number; limit: number };
  sessions: { used: number; limit: number };
  agents: { used: number; limit: number };
}

export default function BillingSettingsPage() {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<any>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [usage, setUsage] = useState<Usage>({
    projects: { used: 0, limit: 3 },
    sessions: { used: 0, limit: 10 },
    agents: { used: 6, limit: 6 },
  });

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    setLoading(true);
    try {
      // Fetch subscription
      const subRes = await fetch("/api/billing/subscription");
      const subData = await subRes.json();
      setSubscription(subData.subscription);
      setPaymentMethod(subData.paymentMethod);

      // Fetch invoices
      const invRes = await fetch("/api/billing/invoices");
      const invData = await invRes.json();
      setInvoices(invData.invoices || []);

      // Fetch usage
      const usageRes = await fetch("/api/billing/usage");
      const usageData = await usageRes.json();
      setUsage(usageData.usage);
    } catch (error) {
      console.error("Failed to fetch billing data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const res = await fetch("/api/billing/subscription", {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchBillingData();
        setShowCancelModal(false);
      }
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${
      months[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-quantum-green/20 text-quantum-green";
      case "trialing":
        return "bg-neural/20 text-neural-bright";
      case "past_due":
        return "bg-yellow-500/20 text-yellow-500";
      case "cancelled":
        return "bg-plasma-pink/20 text-plasma-pink";
      default:
        return "bg-white/10 text-white";
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      {/* Section Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-white mb-2">Billing</h1>
        <p className="text-phantom-gray">
          Manage your subscription and payment details
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-neural-bright animate-spin" />
        </div>
      ) : (
        <>
          {/* Current Plan */}
          {subscription ? (
            <section className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-neural/10 to-electric-cyan/10 border border-neural/20 animate-fade-in-up stagger-1">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-white capitalize">
                      {subscription.plan_id} Plan
                    </h3>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                        subscription.status
                      )}`}
                    >
                      {subscription.status}
                    </span>
                  </div>
                  <p className="text-phantom-gray">
                    ${subscription.amount}/
                    {subscription.billing_interval === "monthly"
                      ? "month"
                      : "year"}
                    {subscription.billing_interval === "yearly" && (
                      <span className="ml-2 text-quantum-green text-sm">
                        (20% savings)
                      </span>
                    )}
                  </p>
                </div>
                <Link
                  href="/pricing"
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  Change Plan
                </Link>
              </div>

              {/* Billing Cycle */}
              <div className="flex items-center gap-6 p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-neural/20 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-neural-bright" />
                  </div>
                  <div>
                    <p className="text-sm text-phantom-gray">Current Period</p>
                    <p className="text-white font-medium">
                      {formatDate(subscription.current_period_start)} -{" "}
                      {formatDate(subscription.current_period_end)}
                    </p>
                  </div>
                </div>
                <div className="h-10 w-px bg-white/10" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-quantum-green/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-quantum-green" />
                  </div>
                  <div>
                    <p className="text-sm text-phantom-gray">Next Billing</p>
                    <p className="text-white font-medium">
                      {formatDate(subscription.current_period_end)}
                    </p>
                  </div>
                </div>
              </div>

              {subscription.cancel_at_period_end && (
                <div className="mt-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-500 font-medium">
                      Subscription ending
                    </p>
                    <p className="text-sm text-yellow-500/80">
                      Your subscription will end on{" "}
                      {formatDate(subscription.current_period_end)}. You can
                      reactivate anytime before then.
                    </p>
                  </div>
                </div>
              )}
            </section>
          ) : (
            <section className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-neural/10 to-electric-cyan/10 border border-neural/20 animate-fade-in-up stagger-1">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-white">Free Plan</h3>
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-white">
                      Active
                    </span>
                  </div>
                  <p className="text-phantom-gray">$0/month</p>
                </div>
                <Link
                  href="/pricing"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-neural to-electric-cyan text-white font-medium hover:shadow-glow transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Upgrade to Pro
                </Link>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-sm text-phantom-gray mb-3">
                  You're currently on the free plan. Upgrade to unlock more
                  features:
                </p>
                <ul className="space-y-2 text-sm text-phantom-gray">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-quantum-green" />
                    Unlimited projects
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-quantum-green" />
                    Unlimited test sessions
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-quantum-green" />
                    Priority support
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-quantum-green" />
                    Advanced analytics
                  </li>
                </ul>
              </div>
            </section>
          )}

          {/* Usage */}
          <section className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10 animate-fade-in-up stagger-2">
            <h3 className="text-lg font-semibold text-white mb-4">
              Current Usage
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(usage).map(([key, value]) => {
                const percentage =
                  value.limit === -1 ? 0 : (value.used / value.limit) * 100;
                const isNearLimit = percentage >= 80;
                const isUnlimited = value.limit === -1;
                return (
                  <div
                    key={key}
                    className="p-4 rounded-xl bg-white/5 border border-white/5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-phantom-gray capitalize">
                        {key}
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          isNearLimit ? "text-yellow-500" : "text-white"
                        }`}
                      >
                        {value.used}/{isUnlimited ? "∞" : value.limit}
                      </span>
                    </div>
                    {!isUnlimited && (
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isNearLimit
                              ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                              : "bg-gradient-to-r from-neural to-electric-cyan"
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Payment Method */}
          {paymentMethod ? (
            <section className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10 animate-fade-in-up stagger-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Payment Method
                </h3>
                <button className="text-sm text-neural-bright hover:text-neural transition-colors">
                  Update
                </button>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="w-12 h-8 rounded bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">
                    {paymentMethod.brand} •••• {paymentMethod.last4}
                  </p>
                  <p className="text-sm text-phantom-gray">
                    Expires {paymentMethod.expiryMonth}/
                    {paymentMethod.expiryYear}
                  </p>
                </div>
                <span className="px-2 py-1 rounded-lg bg-quantum-green/20 text-quantum-green text-xs font-medium">
                  Default
                </span>
              </div>
            </section>
          ) : (
            <section className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10 animate-fade-in-up stagger-3">
              <h3 className="text-lg font-semibold text-white mb-4">
                Payment Method
              </h3>
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                  <CreditCard className="w-8 h-8 text-phantom-gray" />
                </div>
                <p className="text-phantom-gray mb-4">
                  No payment method added
                </p>
                <button className="px-4 py-2 rounded-xl bg-neural/20 text-neural-bright font-medium hover:bg-neural/30 transition-all">
                  Add Payment Method
                </button>
              </div>
            </section>
          )}

          {/* Billing History */}
          <section className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10 animate-fade-in-up stagger-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Billing History
              </h3>
              {invoices.length > 0 && (
                <button className="text-sm text-neural-bright hover:text-neural transition-colors flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  View All
                </button>
              )}
            </div>
            {invoices.length > 0 ? (
              <div className="space-y-3">
                {invoices.slice(0, 5).map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                        <Receipt className="w-5 h-5 text-phantom-gray" />
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {formatDate(invoice.created_at)}
                        </p>
                        <p className="text-sm text-phantom-gray">
                          Invoice #{invoice.invoice_number}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-white font-medium">
                          ${(invoice.total_amount / 100).toFixed(2)}
                        </p>
                        <p className="text-sm text-quantum-green capitalize">
                          {invoice.status}
                        </p>
                      </div>
                      {invoice.pdf_url && (
                        <a
                          href={invoice.pdf_url}
                          download
                          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <Download className="w-4 h-4 text-phantom-gray" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                  <Receipt className="w-8 h-8 text-phantom-gray" />
                </div>
                <p className="text-phantom-gray">No invoices yet</p>
              </div>
            )}
          </section>

          {/* Danger Zone - Only show if subscribed */}
          {subscription && (
            <section className="p-6 rounded-2xl bg-plasma-pink/5 border border-plasma-pink/20 animate-fade-in-up stagger-5">
              <h3 className="text-lg font-semibold text-white mb-2">
                Cancel Subscription
              </h3>
              <p className="text-sm text-phantom-gray mb-4">
                Cancel your subscription. You'll retain access until the end of
                your current billing period.
              </p>
              <button
                onClick={() => setShowCancelModal(true)}
                className="px-4 py-2 rounded-xl border border-plasma-pink/30 text-plasma-pink font-medium hover:bg-plasma-pink/10 transition-all"
              >
                Cancel Subscription
              </button>
            </section>
          )}

          {/* Cancel Modal */}
          {showCancelModal && (
            <div className="fixed inset-0 z-[100]">
              <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowCancelModal(false)}
              />
              <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
                <div className="relative w-full max-w-md p-6 bg-void-elevated rounded-2xl border border-white/10 pointer-events-auto">
                  <div className="w-12 h-12 rounded-xl bg-plasma-pink/20 flex items-center justify-center mb-4">
                    <AlertTriangle className="w-6 h-6 text-plasma-pink" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Cancel Subscription?
                  </h3>
                  <p className="text-phantom-gray mb-6">
                    You'll lose access to Pro features at the end of your
                    current billing period. Your projects and data will be
                    retained.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowCancelModal(false)}
                      className="flex-1 py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-all"
                    >
                      Keep Subscription
                    </button>
                    <button
                      onClick={handleCancelSubscription}
                      className="flex-1 py-3 rounded-xl bg-plasma-pink text-white font-medium hover:bg-plasma-pink/80 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
