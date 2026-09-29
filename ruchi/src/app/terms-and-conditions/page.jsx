import React from "react";
import LegalPageLayout from "../components/LegalPageLayout";
import { FileText, CheckCircle2, AlertTriangle, ShieldAlert, Scale, ShoppingBag, Truck, CreditCard } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions governing the use of Ruchi Bazaar for customers, ordering rules, payments, cancellations, and platform liability.",
};

export default function TermsAndConditionsPage() {
  return (
    <LegalPageLayout
      title="Terms & Conditions"
      subtitle="Please read these Terms and Conditions carefully before ordering through Ruchi Bazaar. By using our platform, you agree to these legal obligations."
      badge="USER AGREEMENT"
      lastUpdated="September 2026"
    >
      <div className="space-y-8 text-sm sm:text-base leading-relaxed">
        {/* Preamble */}
        <section className="bg-red-50/60 border border-red-100 rounded-xl p-5 text-slate-800">
          <p className="font-semibold text-slate-900 mb-1">Agreement to Terms</p>
          <p className="text-slate-700">
            These Terms &amp; Conditions constitute a legally binding agreement between you (&quot;Customer&quot;, &quot;User&quot;, &quot;You&quot;) and Ruchi Bazaar. 
            Ruchi Bazaar operates an online technology platform connecting customers with merchant food establishments (&quot;Restaurants&quot;, &quot;Vendors&quot;) 
            and independent delivery partners (&quot;Riders&quot;).
          </p>
        </section>

        {/* 1. Account Usage */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <FileText className="w-5 h-5 text-red-600" />
            <h2>1. Account Registration &amp; Security</h2>
          </div>
          <ul className="list-disc pl-6 space-y-1.5 text-slate-700">
            <li>You must be at least 18 years of age or possess legal parental/guardian consent to create an account and place orders.</li>
            <li>You are responsible for maintaining the confidentiality of your login OTPs, passwords, and mobile device credentials.</li>
            <li>All activities performed through your registered account are deemed to be authorized by you.</li>
            <li>You agree to provide true, accurate, current, and complete registration and delivery details.</li>
          </ul>
        </section>

        {/* 2. Ordering Rules */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <ShoppingBag className="w-5 h-5 text-red-600" />
            <h2>2. Ordering Rules &amp; Acceptance</h2>
          </div>
          <p className="text-slate-700">
            When you place an order on Ruchi Bazaar:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-slate-700">
            <li>An order placed is an offer by you to purchase the selected items from the respective merchant restaurant.</li>
            <li>The contract of sale is finalized once the restaurant partner accepts your order in their kitchen dashboard.</li>
            <li>Menu prices, dish availability, and dietary descriptions are maintained directly by restaurant partners and may fluctuate.</li>
            <li>Special cooking requests (e.g., &quot;less spicy&quot;) are submitted to the merchant on a best-effort basis and are not guaranteed.</li>
          </ul>
        </section>

        {/* 3. Roles and Responsibilities */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <Scale className="w-5 h-5 text-red-600" />
            <h2>3. Responsibilities of Parties</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Restaurant Responsibilities
              </h3>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-1.5 list-disc pl-4">
                <li>Ensuring absolute food hygiene, preparation, and FSSAI standards.</li>
                <li>Secure, tamper-evident food packaging.</li>
                <li>Timely food preparation according to estimated prep timers.</li>
                <li>Accurate portion sizes and ingredient disclosures.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Customer Responsibilities
              </h3>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-1.5 list-disc pl-4">
                <li>Providing accurate delivery addresses, door numbers, and landmarks.</li>
                <li>Ensuring phone availability to answer calls from delivery riders.</li>
                <li>Receiving the order at the specified address within 10 minutes of rider arrival.</li>
                <li>Paying the complete billed amount for Cash on Delivery (COD) orders upon delivery.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4. Payments */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <CreditCard className="w-5 h-5 text-red-600" />
            <h2>4. Payments &amp; Invoicing</h2>
          </div>
          <p className="text-slate-700">
            Prices displayed include applicable Goods and Services Tax (GST) unless indicated otherwise. Billed totals comprise:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-slate-700">
            <li>Item food prices set by the restaurant partner.</li>
            <li>Restaurant packaging and container charges (if levied by merchant).</li>
            <li>Delivery charges based on distance, peak demand surge, or weather conditions.</li>
            <li>Nominal platform services fee for application maintenance and support.</li>
          </ul>
        </section>

        {/* 5. Cancellation & Refunds */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h2>5. Cancellation &amp; Refunds Summary</h2>
          </div>
          <p className="text-slate-700">
            Customers may cancel an order free of penalty before the restaurant partner accepts it. Once food preparation has begun, 
            a 100% cancellation fee applies because perishable food cannot be resold. For complete terms, visit our dedicated{" "}
            <a href="/refund-policy" className="text-red-600 font-semibold underline">
              Refund &amp; Cancellation Policy
            </a>.
          </p>
        </section>

        {/* 6. Delivery */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <Truck className="w-5 h-5 text-red-600" />
            <h2>6. Delivery Terms</h2>
          </div>
          <p className="text-slate-700">
            Delivery timelines (e.g., 30–45 mins) are estimates and may vary due to kitchen volume, heavy traffic, inclement weather, 
            or road closures. In the event of an unreachable customer, the rider will wait up to 10 minutes before the order is marked failed, 
            with no refund eligible for perishable items.
          </p>
        </section>

        {/* 7. Prohibited Activities */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <h2>7. Prohibited Activities</h2>
          </div>
          <p className="text-slate-700">Users agree not to:</p>
          <ul className="list-disc pl-6 space-y-1.5 text-slate-700">
            <li>Place fraudulent, frivolous, or test orders with no intention of paying or receiving.</li>
            <li>Harass, abuse, threaten, or discriminate against delivery partners or support executives.</li>
            <li>Reverse engineer, scrape, bypass security, or exploit vulnerabilities on the platform.</li>
            <li>Attempt coupon exploitation through fake multiple accounts.</li>
          </ul>
        </section>

        {/* 8. Limitation of Liability */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <Scale className="w-5 h-5 text-red-600" />
            <h2>8. Platform Liability &amp; Disclaimers</h2>
          </div>
          <p className="text-slate-700">
            Ruchi Bazaar acts as an intermediary technology aggregator. We do not cook, package, or warrant food products directly. 
            All claims regarding food safety, allergens, taste, ingredients, or dietary preferences reside primarily with the merchant restaurant. 
            In all events, Ruchi Bazaar&apos;s maximum cumulative liability shall not exceed the order amount paid for the transaction in dispute.
          </p>
        </section>
      </div>
    </LegalPageLayout>
  );
}
