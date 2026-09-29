import React from "react";
import LegalPageLayout from "../components/LegalPageLayout";
import { Bike, IndianRupee, ShieldCheck, Clock, FileCheck, CheckCircle2, ArrowRight, Smartphone, HeartHandshake } from "lucide-react";

export const metadata = {
  title: "Delivery Partner | Drive & Earn with Ruchi Bazaar",
  description: "Join the Ruchi Bazaar delivery fleet. Enjoy flexible working hours, weekly payouts, attractive milestone bonuses, and insurance coverage.",
};

export default function DeliveryPartnerPage() {
  return (
    <LegalPageLayout
      title="Ride &amp; Earn with Ruchi Bazaar"
      subtitle="Deliver fresh food and groceries across your city with total flexibility, industry-leading payout rates, and weekly direct bank transfers."
      badge="DELIVERY PARTNER PROGRAM"
      lastUpdated="September 2026"
    >
      <div className="space-y-8 text-sm sm:text-base leading-relaxed">
        {/* Hero CTA Box */}
        <section className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
          <div className="relative z-10 space-y-4 max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider">
              Earn Up to ₹35,000 / Month
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              Be Your Own Boss. Flexible Hours.
            </h2>
            <p className="text-sm sm:text-base text-emerald-100">
              Work part-time or full-time. Choose your own shifts, earn per delivery, receive surge incentives, and enjoy weekly guaranteed payouts.
            </p>
            <div className="pt-2">
              <a
                href="http://localhost:3002/signup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-emerald-700 font-bold hover:bg-emerald-50 transition-all shadow-md active:scale-95"
              >
                Sign Up as Delivery Partner
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* 1. Benefits */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <IndianRupee className="w-5 h-5 text-red-600" />
            <h2>1. Why Deliver with Ruchi Bazaar?</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <Clock className="w-6 h-6 text-emerald-600 mb-2" />
              <h3 className="font-semibold text-slate-900 mb-1">Total Flexibility</h3>
              <p className="text-xs text-slate-600">
                Log in and log out whenever you want. Work morning shifts, lunch rush, dinner peaks, or late nights.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <IndianRupee className="w-6 h-6 text-emerald-600 mb-2" />
              <h3 className="font-semibold text-slate-900 mb-1">Weekly Bank Payouts</h3>
              <p className="text-xs text-slate-600">
                Earnings are credited directly into your verified bank account every Tuesday morning without delay.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <ShieldCheck className="w-6 h-6 text-emerald-600 mb-2" />
              <h3 className="font-semibold text-slate-900 mb-1">Insurance &amp; Support</h3>
              <p className="text-xs text-slate-600">
                Active accidental medical insurance coverage up to ₹2,00,000 while delivering on the platform.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Eligibility & Documents */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <FileCheck className="w-5 h-5 text-red-600" />
            <h2>2. Eligibility &amp; Required Documents</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <h3 className="font-semibold text-slate-900 text-sm">Eligibility Criteria:</h3>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-1.5 list-disc pl-4">
                <li>Minimum 18 years of age.</li>
                <li>Motorcycle, scooter, electric bike, or geared bicycle in good working condition.</li>
                <li>Android smartphone (Android version 8.0 or above) with active internet data.</li>
                <li>Clean background check with no criminal records.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <h3 className="font-semibold text-slate-900 text-sm">Required Documents:</h3>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-1.5 list-disc pl-4">
                <li><strong>Aadhaar Card:</strong> Proof of identity and address.</li>
                <li><strong>PAN Card:</strong> For taxation (TDS) and banking.</li>
                <li><strong>Driving License (DL):</strong> Valid two-wheeler commercial or private license.</li>
                <li><strong>Registration Certificate (RC Book):</strong> Vehicle registration and insurance copy.</li>
                <li><strong>Bank Passbook / Cancelled Cheque:</strong> For payout deposits.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 3. How Deliveries Work */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <Smartphone className="w-5 h-5 text-red-600" />
            <h2>3. How the Delivery Partner App Works</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="font-bold text-slate-900 mb-1">1. Go Online</div>
              <p className="text-slate-600">Open the rider app and switch status to Online in your preferred zone.</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="font-bold text-slate-900 mb-1">2. Accept Order</div>
              <p className="text-slate-600">Receive delivery tickets with payout estimate, restaurant, and customer distance.</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="font-bold text-slate-900 mb-1">3. Pick Up</div>
              <p className="text-slate-600">Follow in-app GPS to the restaurant and pick up the hygienically packed food bag.</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="font-bold text-slate-900 mb-1">4. Deliver &amp; Earn</div>
              <p className="text-slate-600">Deliver to customer doorstep, verify delivery via OTP/photo, and pocket your payout.</p>
            </div>
          </div>
        </section>

        {/* 4. Partner Responsibilities */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <ShieldCheck className="w-5 h-5 text-red-600" />
            <h2>4. Safety &amp; Professional Standards</h2>
          </div>
          <p className="text-slate-700">All delivery riders agree to uphold:</p>
          <ul className="list-disc pl-6 space-y-1.5 text-slate-700">
            <li><strong>Mandatory Helmet &amp; Safety Gear:</strong> Strictly wearing helmets at all times during transit.</li>
            <li><strong>Insulated Delivery Bag:</strong> Keeping the Ruchi Bazaar thermal delivery box clean and zipped shut.</li>
            <li><strong>Courteous Customer Interaction:</strong> Respectful, professional communication at drop-off.</li>
            <li><strong>Traffic Compliance:</strong> Strict adherence to all municipal traffic rules and speed limits.</li>
          </ul>
        </section>

        {/* Support Help */}
        <section className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 space-y-1">
          <p className="font-bold text-slate-900">Delivery Fleet Helpdesk</p>
          <p className="text-xs sm:text-sm">
            Have questions about onboarding or rider payouts? Email <strong>riders@ruchibazaar.in</strong> or visit our City Fleet Hub.
          </p>
        </section>
      </div>
    </LegalPageLayout>
  );
}
