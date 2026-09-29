import React from "react";
import LegalPageLayout from "../components/LegalPageLayout";
import { Tag, Percent, Clock, AlertCircle, CheckCircle2, ShieldAlert, Sparkles } from "lucide-react";

export const metadata = {
  title: "Offers & Coupons Terms",
  description: "Terms and conditions governing promotional vouchers, coupons, discounts, cashbacks, and promo codes on Ruchi Bazaar.",
};

export default function OffersTermsPage() {
  return (
    <LegalPageLayout
      title="Offers &amp; Coupons Terms"
      subtitle="Standard guidelines and conditions governing promotional codes, discounts, cashback offers, and voucher redemptions."
      badge="PROMOTIONS & DISCOUNT RULES"
      lastUpdated="September 2026"
    >
      <div className="space-y-8 text-sm sm:text-base leading-relaxed">
        {/* Intro */}
        <section className="bg-red-50/60 border border-red-100 rounded-xl p-5 text-slate-800">
          <p className="font-semibold text-slate-900 mb-1">Promotional Integrity</p>
          <p className="text-slate-700">
            Ruchi Bazaar frequently provides promo codes, seasonal vouchers, and restaurant-specific discounts. 
            All discounts are subject to the terms stated below and any specific offer conditions displayed on the offer banner.
          </p>
        </section>

        {/* 1. Core Coupon Rules */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <Tag className="w-5 h-5 text-red-600" />
            <h2>1. General Coupon Rules</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                One Coupon Per Order
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Only one promotional code can be applied per checkout transaction. Promotional coupons cannot be clubbed, stacked, or combined with other vouchers or promo codes.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Minimum Order Value (MOV)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Most discount codes require an order to satisfy a Minimum Order Value threshold (e.g., Minimum cart value of ₹299 excluding delivery and packaging fees).
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Maximum Discount Cap
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Percentage discounts are capped at a maximum limit (e.g., &quot;50% OFF up to ₹100&quot;). The discount will not exceed the stated cap regardless of cart size.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Validity &amp; Expiry
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Every promotional coupon carries an explicit validity period or expiry date. Codes cannot be applied retroactively after expiration.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Welcome & First-User Codes */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <Sparkles className="w-5 h-5 text-red-600" />
            <h2>2. New Customer &amp; First-Order Offers</h2>
          </div>
          <p className="text-slate-700">
            Offers designated as &quot;First Order&quot; or &quot;New User&quot; (e.g. WELCOME50) are valid strictly once per unique customer profile, phone number, and physical device. 
            Attempting to create duplicate accounts to exploit introductory offers is a violation of platform policies.
          </p>
        </section>

        {/* 3. Restaurant-Specific Offers */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <Percent className="w-5 h-5 text-red-600" />
            <h2>3. Merchant-Sponsored Discounts</h2>
          </div>
          <p className="text-slate-700">
            Discounts sponsored directly by a restaurant partner apply only to eligible menu items from that merchant. 
            Certain combo meals, value packs, or pre-discounted promotional dishes may be explicitly excluded from coupon applicability at the merchant&apos;s discretion.
          </p>
        </section>

        {/* 4. Prohibited Exploitation */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <h2>4. Fraud &amp; Abuse Prevention</h2>
          </div>
          <p className="text-slate-700">
            Ruchi Bazaar reserves the right to cancel orders, invalidate applied coupons, or suspend user accounts if unauthorized voucher distribution, bot activity, coupon trafficking, or fraudulent behavior is detected.
          </p>
        </section>
      </div>
    </LegalPageLayout>
  );
}
