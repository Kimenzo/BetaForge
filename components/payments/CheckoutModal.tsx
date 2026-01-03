"use client";

import { useState, useEffect } from "react";
import {
  X,
  CreditCard,
  Globe,
  MapPin,
  Loader2,
  Check,
  Shield,
  Building2,
} from "lucide-react";
import {
  useCountryDetection,
  useCheckout,
  formatPrice,
  isAfricanCountry,
} from "@/lib/hooks/use-payments";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    id: string;
    name: string;
    price: { monthly: number; yearly: number };
    description: string;
  };
  billingInterval: "monthly" | "yearly";
}

// Country list for dropdown
const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IN", name: "India" },
  { code: "BR", name: "Brazil" },
  { code: "JP", name: "Japan" },
  // African countries (Paystack)
  { code: "NG", name: "Nigeria", provider: "paystack" },
  { code: "GH", name: "Ghana", provider: "paystack" },
  { code: "ZA", name: "South Africa", provider: "paystack" },
  { code: "KE", name: "Kenya", provider: "paystack" },
  { code: "CI", name: "Côte d'Ivoire", provider: "paystack" },
  // More countries
  { code: "NL", name: "Netherlands" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "MX", name: "Mexico" },
  { code: "SG", name: "Singapore" },
].sort((a, b) => a.name.localeCompare(b.name));

export function CheckoutModal({
  isOpen,
  onClose,
  plan,
  billingInterval,
}: CheckoutModalProps) {
  const { country: detectedCountry, loading: detectingCountry } =
    useCountryDetection();
  const { createCheckout, loading: checkoutLoading, error } = useCheckout();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [formError, setFormError] = useState("");

  // B2B fields for Team/Enterprise plans
  const [isB2B, setIsB2B] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [taxId, setTaxId] = useState("");

  // Determine if this is a B2B plan (Team or Enterprise)
  const isB2BPlan = plan.id === "team" || plan.id === "enterprise";
  // Set country when detected
  useEffect(() => {
    if (detectedCountry && !selectedCountry) {
      setSelectedCountry(detectedCountry);
    }
  }, [detectedCountry, selectedCountry]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Calculate price
  const price =
    billingInterval === "yearly" ? plan.price.yearly : plan.price.monthly;
  const yearlyTotal = price * 12;
  const monthlySavings = plan.price.monthly - plan.price.yearly;
  const yearlySavings = monthlySavings * 12;

  // Estimate VAT based on country (approximate rates)
  const vatRates: Record<string, { rate: number; name: string }> = {
    // EU countries
    DE: { rate: 0.19, name: "VAT" },
    FR: { rate: 0.2, name: "VAT" },
    GB: { rate: 0.2, name: "VAT" },
    IT: { rate: 0.22, name: "VAT" },
    ES: { rate: 0.21, name: "VAT" },
    NL: { rate: 0.21, name: "VAT" },
    BE: { rate: 0.21, name: "VAT" },
    AT: { rate: 0.2, name: "VAT" },
    PL: { rate: 0.23, name: "VAT" },
    SE: { rate: 0.25, name: "VAT" },
    DK: { rate: 0.25, name: "VAT" },
    FI: { rate: 0.24, name: "VAT" },
    IE: { rate: 0.23, name: "VAT" },
    PT: { rate: 0.23, name: "VAT" },
    // Other regions
    AU: { rate: 0.1, name: "GST" },
    NZ: { rate: 0.15, name: "GST" },
    CA: { rate: 0.13, name: "HST" },
    IN: { rate: 0.18, name: "GST" },
    SG: { rate: 0.09, name: "GST" },
    JP: { rate: 0.1, name: "JCT" },
    // African countries
    NG: { rate: 0.075, name: "VAT" },
    ZA: { rate: 0.15, name: "VAT" },
    KE: { rate: 0.16, name: "VAT" },
    GH: { rate: 0.15, name: "VAT" },
  };

  const countryVat = selectedCountry ? vatRates[selectedCountry] : null;
  const vatRate = countryVat?.rate || 0;
  const vatName = countryVat?.name || "Tax";

  // B2B with valid tax ID = no VAT (reverse charge)
  const hasVatExemption = (isB2B || isB2BPlan) && taxId && taxId.length > 5;
  const effectiveVatRate = hasVatExemption ? 0 : vatRate;

  // Calculate estimated amounts
  const chargeToday = billingInterval === "yearly" ? yearlyTotal : price;
  const estimatedVat = chargeToday * effectiveVatRate;
  const estimatedTotal = chargeToday + estimatedVat;

  // Determine provider
  const isAfrica = isAfricanCountry(selectedCountry);
  const provider = isAfrica ? "Paystack" : "Dodo Payments";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Validation
    if (!email) {
      setFormError("Email is required");
      return;
    }
    if (!email.includes("@")) {
      setFormError("Please enter a valid email");
      return;
    }
    if (!selectedCountry) {
      setFormError("Please select your country");
      return;
    }

    await createCheckout(
      plan.id,
      billingInterval,
      email,
      name || undefined,
      selectedCountry,
      isB2B || isB2BPlan ? taxId : undefined,
      isB2B || isB2BPlan ? companyName : undefined
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - covers entire viewport */}
      <div
        className="fixed top-0 left-0 right-0 bottom-0 bg-black/90 backdrop-blur-md"
        style={{ zIndex: 99998 }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal - centered in viewport */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto bg-void-elevated rounded-2xl border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.8)]"
        style={{ zIndex: 99999 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold text-ghost-white">
              Subscribe to {plan.name}
            </h2>
            <p className="text-sm text-phantom-gray mt-1">{plan.description}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close checkout modal"
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5 text-phantom-gray" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Price Summary */}
          <div className="p-4 rounded-xl bg-void-black border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-phantom-gray">
                {plan.name} Plan ({billingInterval})
              </span>
              <span className="text-ghost-white font-semibold">
                ${price}/mo
              </span>
            </div>
            {billingInterval === "yearly" && (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-phantom-gray">Billed annually</span>
                  <span className="text-ghost-white">${yearlyTotal}/year</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-quantum-green">You save</span>
                  <span className="text-quantum-green font-medium">
                    ${yearlySavings}/year
                  </span>
                </div>
              </>
            )}

            {/* Tax estimate - only show when country is selected */}
            {selectedCountry && (
              <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
                {/* Subtotal */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-phantom-gray">Subtotal</span>
                  <span className="text-ghost-white">
                    ${chargeToday.toFixed(2)}
                  </span>
                </div>

                {/* VAT/Tax line */}
                {effectiveVatRate > 0 ? (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-phantom-gray">
                      {vatName} ({(effectiveVatRate * 100).toFixed(0)}%)
                    </span>
                    <span className="text-ghost-white">
                      ${estimatedVat.toFixed(2)}
                    </span>
                  </div>
                ) : hasVatExemption ? (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-quantum-green">
                      {vatName} (Reverse Charge)
                    </span>
                    <span className="text-quantum-green">$0.00</span>
                  </div>
                ) : countryVat ? (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-phantom-gray">
                      {vatName} ({(vatRate * 100).toFixed(0)}%)
                    </span>
                    <span className="text-ghost-white">
                      ${estimatedVat.toFixed(2)}
                    </span>
                  </div>
                ) : null}

                {/* Total */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-ghost-white font-semibold">
                    Charge today
                  </span>
                  <span className="text-ghost-white font-bold text-lg">
                    ${estimatedTotal.toFixed(2)}
                  </span>
                </div>

                {/* Tax disclaimer */}
                <p className="text-xs text-mist-gray mt-2">
                  {hasVatExemption
                    ? `VAT reverse charge applied for business with Tax ID`
                    : `Estimated ${
                        vatName || "tax"
                      } based on your location. Final amount calculated at checkout.`}
                </p>
              </div>
            )}

            {/* Show generic message if no country selected */}
            {!selectedCountry && (
              <div className="mt-3 pt-3 border-t border-white/5">
                <p className="text-xs text-mist-gray">
                  Select your country to see estimated taxes
                </p>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-ghost-white mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full px-4 py-3 rounded-xl bg-void-black border border-white/10 text-ghost-white placeholder:text-mist-gray focus:border-neural/50 focus:outline-none focus:ring-1 focus:ring-neural/50 transition-all"
              required
            />
          </div>

          {/* Name (optional) */}
          <div>
            <label className="block text-sm font-medium text-ghost-white mb-2">
              Full Name (optional)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-xl bg-void-black border border-white/10 text-ghost-white placeholder:text-mist-gray focus:border-neural/50 focus:outline-none focus:ring-1 focus:ring-neural/50 transition-all"
            />
          </div>

          {/* B2B Toggle - Show for non-B2B plans, auto-enabled for B2B plans */}
          {!isB2BPlan && (
            <div className="flex items-center justify-between p-4 rounded-xl bg-void-black border border-white/10">
              <label
                htmlFor="b2b-toggle"
                className="text-sm text-ghost-white font-medium cursor-pointer"
              >
                I&apos;m purchasing for a business
              </label>
              <button
                id="b2b-toggle"
                type="button"
                onClick={() => setIsB2B(!isB2B)}
                role="switch"
                aria-checked={isB2B}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                  isB2B
                    ? "bg-neural shadow-[0_0_10px_rgba(139,92,246,0.3)]"
                    : "bg-white/10"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-lg ${
                    isB2B ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          )}

          {/* B2B Fields - Company Name & Tax ID */}
          {(isB2B || isB2BPlan) && (
            <div className="space-y-4 p-4 rounded-xl bg-neural/5 border border-neural/20">
              <div className="flex items-center gap-2 text-sm text-neural-bright mb-2">
                <Building2 className="w-4 h-4" />
                <span>Business Information</span>
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-ghost-white mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme Inc."
                  className="w-full px-4 py-3 rounded-xl bg-void-black border border-white/10 text-ghost-white placeholder:text-mist-gray focus:border-neural/50 focus:outline-none focus:ring-1 focus:ring-neural/50 transition-all"
                />
              </div>

              {/* Tax ID / VAT Number */}
              <div>
                <label className="block text-sm font-medium text-ghost-white mb-2">
                  VAT / Tax ID (optional)
                </label>
                <input
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  placeholder="e.g., EU123456789, GB123456789"
                  className="w-full px-4 py-3 rounded-xl bg-void-black border border-white/10 text-ghost-white placeholder:text-mist-gray focus:border-neural/50 focus:outline-none focus:ring-1 focus:ring-neural/50 transition-all"
                />
                <p className="text-xs text-mist-gray mt-2">
                  EU businesses with valid VAT numbers may qualify for VAT
                  exemption (reverse charge)
                </p>
              </div>
            </div>
          )}

          {/* Country */}
          <div>
            <label
              htmlFor="country-select"
              className="block text-sm font-medium text-ghost-white mb-2"
            >
              Country *
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-phantom-gray" />
              <select
                id="country-select"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-void-black border border-white/10 text-ghost-white focus:border-neural/50 focus:outline-none focus:ring-1 focus:ring-neural/50 transition-all appearance-none cursor-pointer"
                required
              >
                <option value="">Select your country</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Provider Info */}
          {selectedCountry && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-neural/10 border border-neural/20">
              <Globe className="w-5 h-5 text-neural-bright" />
              <div className="text-sm">
                <span className="text-phantom-gray">Payment processed by </span>
                <span className="text-ghost-white font-medium">{provider}</span>
                {isAfrica && (
                  <span className="text-phantom-gray"> (Africa)</span>
                )}
              </div>
            </div>
          )}

          {/* Error */}
          {(formError || error) && (
            <div className="p-3 rounded-lg bg-alert-red/10 border border-alert-red/20 text-alert-red text-sm">
              {formError || error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={checkoutLoading || !selectedCountry}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-neural to-electric-cyan text-white font-semibold hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-2"
          >
            {checkoutLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Redirecting to checkout...
              </>
            ) : !selectedCountry ? (
              <>
                <MapPin className="w-5 h-5" />
                Select country to continue
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Continue to Payment
              </>
            )}
          </button>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 text-xs text-mist-gray">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>Secure checkout</span>
            </div>
            <div className="flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
