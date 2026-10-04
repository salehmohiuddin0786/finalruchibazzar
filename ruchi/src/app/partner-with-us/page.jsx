import React from "react";
import LegalPageLayout from "../components/LegalPageLayout";
import { Store, TrendingUp, ShieldCheck, FileCheck, CheckCircle2, ArrowRight, IndianRupee, Clock, HelpCircle } from "lucide-react";

export const metadata = {
  title: "Partner With Us | Become a Restaurant Partner",
  description: "Grow your food business with Ruchi Bazaar. Expand customer reach, enjoy low commission rates, and receive fast weekly payouts.",
};

export default function PartnerWithUsPage() {
  return (
    <LegalPageLayout
      title="Grow Your Restaurant Business"
      subtitle="Join hundreds of premier restaurants, cafes, and cloud kitchens reaching thousands of hungry customers every day on Ruchi Bazaar."
      badge="RESTAURANT ONBOARDING"
      lastUpdated="September 2026"
    >
      <div className="space-y-8 text-sm sm:text-base leading-relaxed">
        {/* Hero CTA Box */}
        <section className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
          <div className="relative z-10 space-y-4 max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider">
              Express 24-Hour Approval
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              Ready to Expand Your Reach?
            </h2>
            <p className="text-sm sm:text-base text-red-100">
              List your restaurant menu on Ruchi Bazaar, manage live tickets seamlessly with the Partner Dashboard, and unlock rapid business growth.
            </p>
            <div className="pt-2">
              <a
                href={process.env.NEXT_PUBLIC_ADMIN_URL ? `${process.env.NEXT_PUBLIC_ADMIN_URL}/register` : "http://localhost:4001/register"}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-red-600 font-bold hover:bg-red-50 transition-all shadow-md active:scale-95"
              >
                Register as Restaurant Partner
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* 1. Benefits */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <TrendingUp className="w-5 h-5 text-red-600" />
            <h2>1. Why Partner with Ruchi Bazaar?</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 mb-1">Massive Hyperlocal Reach</h3>
              <p className="text-xs text-slate-600">
                Connect with thousands of daily active users living within 7–10 km of your kitchen.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 mb-1">Competitive Low Commission</h3>
              <p className="text-xs text-slate-600">
                Fair, transparent commission starting from as low as 12% to 18%, preserving your profit margins.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 mb-1">Fast, Automated Payouts</h3>
              <p className="text-xs text-slate-600">
                Weekly automated direct bank deposits with comprehensive GST settlement invoices and reports.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 mb-1">Intuitive Partner Dashboard</h3>
              <p className="text-xs text-slate-600">
                Accept orders with one tap, toggle dish availability, update prices, and launch promotional coupons easily.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 mb-1">Dedicated Delivery Fleet</h3>
              <p className="text-xs text-slate-600">
                No need to hire your own drivers. Our trained delivery fleet handles pickups and door deliveries reliably.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 mb-1">Marketing &amp; Promotions</h3>
              <p className="text-xs text-slate-600">
                Get featured on our home screen banners, category highlights, and seasonal discount carnivals.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Documents Required */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <FileCheck className="w-5 h-5 text-red-600" />
            <h2>2. Mandatory Documents Required</h2>
          </div>
          <p className="text-slate-700">
            To comply with food safety authorities (FSSAI) and taxation laws, prepare digital copies of:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>FSSAI Registration / License:</strong> Valid Food Safety and Standards Authority of India certificate.
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>GSTIN Certificate:</strong> Goods and Services Tax identification number (mandatory for taxable merchants).
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>PAN Card:</strong> Business entity PAN card or proprietor PAN card.
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Bank Account Proof:</strong> Cancelled cheque or bank statement showing account number and IFSC code.
              </div>
            </div>
          </div>
        </section>

        {/* 3. Onboarding Steps */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <Clock className="w-5 h-5 text-red-600" />
            <h2>3. Simple 4-Step Onboarding Process</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-white">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Submit Application Online</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Fill in your basic restaurant profile, address, operating hours, and upload your documents.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-white">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Verification in 24 Hours</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Our compliance team reviews your FSSAI certificate, bank account details, and kitchen location.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-white">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 font-bold flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Digital Menu Setup</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Our menu digitization team helps upload your dishes, prices, descriptions, and appetizing photos.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-white">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 font-bold flex items-center justify-center flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Go Live &amp; Start Earning</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Turn on your kitchen status in the Partner Dashboard and start receiving real customer orders!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Partners Desk */}
        <section className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 space-y-1">
          <p className="font-bold text-slate-900">Have questions about partnering with us?</p>
          <p className="text-xs sm:text-sm">
            Contact our Merchant Onboarding Desk at <strong>partners@ruchibazaar.in</strong> or call <strong>+91 98765 43210</strong>.
          </p>
        </section>
      </div>
    </LegalPageLayout>
  );
}
