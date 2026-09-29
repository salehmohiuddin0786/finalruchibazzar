import React from "react";
import LegalPageLayout from "../components/LegalPageLayout";
import { RefreshCw, Clock, AlertCircle, CheckCircle, XCircle, CreditCard, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Refund & Cancellation Policy",
  description: "Ruchi Bazaar refund and cancellation policy, including eligibility, cancellation windows, failed payments, missing items, and refund turnaround timelines.",
};

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout
      title="Refund & Cancellation Policy"
      subtitle="Clear, fair, and transparent guidelines on order cancellations, payment refunds, missing items, and resolution timelines."
      badge="CUSTOMER PROTECTION"
      lastUpdated="September 2026"
    >
      <div className="space-y-8 text-sm sm:text-base leading-relaxed">
        {/* Highlight Banner */}
        <section className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-5 text-emerald-900">
          <div className="flex items-center gap-2 font-bold mb-1">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Customer First Refund Commitment</span>
          </div>
          <p className="text-xs sm:text-sm text-emerald-800">
            At Ruchi Bazaar, we stand behind our food and grocery quality. If you experience missing dishes, spoiled produce, or payment failures, our dedicated customer desk will make it right quickly.
          </p>
        </section>

        {/* 1. Cancellation Windows */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <Clock className="w-5 h-5 text-red-600" />
            <h2>1. Order Cancellation Guidelines</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <div className="flex items-center gap-2 font-semibold text-slate-900 mb-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <h3>Customer Cancellation</h3>
              </div>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-1.5 list-disc pl-4">
                <li><strong>Within 60 Seconds:</strong> Free cancellation with 100% immediate refund if the restaurant has not yet accepted your order.</li>
                <li><strong>After Restaurant Acceptance:</strong> If the kitchen has commenced cooking your meal, a 100% cancellation charge applies as food is perishable and cannot be salvaged.</li>
                <li><strong>Delivery En Route:</strong> Once assigned to a rider and dispatched, orders cannot be cancelled.</li>
              </ul>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <div className="flex items-center gap-2 font-semibold text-slate-900 mb-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <h3>Restaurant Cancellation</h3>
              </div>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-1.5 list-disc pl-4">
                <li>If a restaurant is out of stock of an ordered dish.</li>
                <li>If the kitchen experiences sudden operational bottlenecks or unexpected surge.</li>
                <li>In such cases, customers receive a <strong>100% immediate refund</strong> plus an apology discount voucher for their next order.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 2. Refund Eligibility */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <RefreshCw className="w-5 h-5 text-red-600" />
            <h2>2. Refund Eligibility Criteria</h2>
          </div>
          <p className="text-slate-700">
            You are fully eligible for a replacement, wallet credit, or source-account refund under the following circumstances:
          </p>

          <div className="space-y-2.5">
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">✓</div>
              <div>
                <strong className="text-slate-900">Wrong Items Delivered:</strong>
                <p className="text-xs sm:text-sm text-slate-600">You received an entirely different dish or non-vegetarian item instead of vegetarian.</p>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">✓</div>
              <div>
                <strong className="text-slate-900">Missing Items:</strong>
                <p className="text-xs sm:text-sm text-slate-600">Specific dishes, combo items, or grocery packets were omitted from your delivered package.</p>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">✓</div>
              <div>
                <strong className="text-slate-900">Damaged, Spilled, or Spoiled Food:</strong>
                <p className="text-xs sm:text-sm text-slate-600">Containers broke during transit or groceries/produce arrived spoiled or expired. Photo proof requested within 2 hours of delivery.</p>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">✓</div>
              <div>
                <strong className="text-slate-900">Severe Unexplained Delay:</strong>
                <p className="text-xs sm:text-sm text-slate-600">Order delivered more than 60 minutes past the estimated delivery window without force majeure circumstances.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Failed Payments */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <CreditCard className="w-5 h-5 text-red-600" />
            <h2>3. Failed Payments &amp; Deducted Amounts</h2>
          </div>
          <p className="text-slate-700">
            If your bank account or UPI app was debited but the order shows as <strong>&quot;Payment Failed&quot;</strong> or was not generated on Ruchi Bazaar:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-slate-700">
            <li>This occurs when bank gateway handshakes fail or time out.</li>
            <li>Bank systems automatically reverse the transaction to your source account within <strong>24 to 48 hours</strong>.</li>
            <li>If the amount does not reflect after 48 hours, share the 12-digit UPI reference number (UTR) with support@ruchibazaar.in for instant trace.</li>
          </ul>
        </section>

        {/* 4. Processing Time */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <Clock className="w-5 h-5 text-red-600" />
            <h2>4. Refund Turnaround Time (TAT)</h2>
          </div>
          <p className="text-slate-700">
            Once approved by our support team, refunds are processed according to banking network schedules:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border border-slate-200 rounded-xl overflow-hidden text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Payment Mode</th>
                  <th className="p-3">Refund Destination</th>
                  <th className="p-3">Typical Processing Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-3 font-medium text-slate-900">Ruchi Wallet / Credits</td>
                  <td className="p-3">Ruchi Bazaar In-App Wallet</td>
                  <td className="p-3 text-emerald-700 font-bold">Instant (0–15 mins)</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-900">UPI (Google Pay, PhonePe, Paytm)</td>
                  <td className="p-3">Original Bank Account linked to UPI</td>
                  <td className="p-3">1 to 2 business days</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-900">Net Banking</td>
                  <td className="p-3">Source Bank Account</td>
                  <td className="p-3">2 to 4 business days</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-900">Credit / Debit Cards</td>
                  <td className="p-3">Issuing Card Bank</td>
                  <td className="p-3">4 to 7 business days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 5. How to Request */}
        <section className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
          <h2 className="font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            5. How to Raise a Refund or Missing Item Request
          </h2>
          <p className="text-slate-700 text-xs sm:text-sm">
            1. Open <a href="/Orders" className="text-red-600 font-semibold underline">My Orders</a> and select the specific order.<br />
            2. Click on <strong>&quot;Help with this Order&quot;</strong> or <strong>&quot;Report an Issue&quot;</strong>.<br />
            3. Choose the issue (Missing items, Spilled food, Wrong order) and upload a quick photo.<br />
            4. Our automated dispute desk reviews the case within 15 minutes.
          </p>
        </section>
      </div>
    </LegalPageLayout>
  );
}
