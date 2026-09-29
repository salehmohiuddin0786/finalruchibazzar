import React from "react";
import LegalPageLayout from "../components/LegalPageLayout";
import { Sparkles, ShieldCheck, CheckCircle2, AlertCircle, FileCheck, Thermometer, Package, HeartHandshake } from "lucide-react";

export const metadata = {
  title: "Food Safety & Quality Policy",
  description: "Learn about Ruchi Bazaar food safety standards, FSSAI compliance, hygiene inspections, and insulated packaging.",
};

export default function FoodSafetyPage() {
  return (
    <LegalPageLayout
      title="Food Safety &amp; Hygiene Standards"
      subtitle="Ensuring every meal and grocery item reaching your family is fresh, authentic, hygienically prepared, and strictly FSSAI certified."
      badge="SAFETY & QUALITY ASSURANCE"
      lastUpdated="September 2026"
    >
      <div className="space-y-8 text-sm sm:text-base leading-relaxed">
        {/* Intro */}
        <section className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-5 text-emerald-950">
          <div className="flex items-center gap-2 font-bold mb-1">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Zero Tolerance for Substandard Hygiene</span>
          </div>
          <p className="text-xs sm:text-sm text-emerald-900">
            Food safety is paramount at Ruchi Bazaar. We work strictly with certified food operators and enforce rigorous guidelines spanning preparation, packaging, and transit.
          </p>
        </section>

        {/* 1. FSSAI Compliance */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <FileCheck className="w-5 h-5 text-red-600" />
            <h2>1. Mandatory FSSAI Certification</h2>
          </div>
          <p className="text-slate-700">
            In accordance with the Food Safety and Standards Act of 2006:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-slate-700">
            <li>Every restaurant, cloud kitchen, and grocery supplier must hold an active, valid FSSAI registration/license.</li>
            <li>Merchant FSSAI license numbers are displayed directly on restaurant menu pages on our platform.</li>
            <li>Merchants with lapsed or revoked licenses are automatically de-listed from customer visibility immediately.</li>
          </ul>
        </section>

        {/* 2. Packaging Standards */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <Package className="w-5 h-5 text-red-600" />
            <h2>2. Tamper-Evident Packaging &amp; Sealing</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Hygiene Safety Seals
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Merchants are mandated to seal meal bags with tamper-evident stickers or heat-sealed zip pouches before handing over to the rider.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Food-Grade Containers
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                All hot curries, gravies, and beverages must be packaged inside high-grade, leak-proof, microwave-safe, BPA-free containers.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Insulated Transit */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <Thermometer className="w-5 h-5 text-red-600" />
            <h2>3. Thermal-Controlled Fleet Transit</h2>
          </div>
          <p className="text-slate-700">
            To prevent food degradation or bacterial growth during transit:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-slate-700">
            <li>Delivery partners are equipped with insulated thermal delivery boxes that preserve warmth and food temperature.</li>
            <li>Cold items (ice creams, dairy, frozen items) are partitioned separately to avoid condensation and temperature transfer.</li>
            <li>Delivery boxes are sanitized daily at partner hub stations.</li>
          </ul>
        </section>

        {/* 4. Fresh Groceries Guarantee */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <Sparkles className="w-5 h-5 text-red-600" />
            <h2>4. Grocery Freshness Guarantee</h2>
          </div>
          <p className="text-slate-700">
            For fresh vegetables, fruits, dairy, and meat items delivered via Ruchi Bazaar:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-slate-700">
            <li>Farm produce undergoes daily quality grading and sorting.</li>
            <li>Packaged food items carry a minimum guaranteed remaining shelf life of at least 30% prior to expiry.</li>
            <li>Dairy items are stored in commercial cold rooms maintained below 4°C.</li>
          </ul>
        </section>

        {/* 5. Reporting Substandard Food */}
        <section className="p-5 rounded-xl bg-red-50 border border-red-200 text-slate-800 space-y-2">
          <h3 className="font-bold text-red-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            Reporting Food Safety Concerns
          </h3>
          <p className="text-xs sm:text-sm text-slate-700">
            If you ever receive food that smells off, has broken hygiene seals, or contains foreign matter, <strong>do not consume it</strong>. 
            Report it immediately via &quot;My Orders&quot; or email our dedicated quality team at <strong>safety@ruchibazaar.in</strong> with photos. 
            We initiate an immediate full refund and dispatch an audit team to inspect the merchant kitchen.
          </p>
        </section>
      </div>
    </LegalPageLayout>
  );
}
