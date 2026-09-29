import React from "react";
import LegalPageLayout from "../components/LegalPageLayout";
import { Truck, MapPin, Clock, IndianRupee, ShieldCheck, AlertTriangle, UserCheck, PackageCheck } from "lucide-react";

export const metadata = {
  title: "Delivery Policy",
  description: "Ruchi Bazaar delivery policy detailing service areas, delivery timelines, charges, contactless delivery options, and failed delivery protocols.",
};

export default function DeliveryPolicyPage() {
  return (
    <LegalPageLayout
      title="Delivery Policy"
      subtitle="How our express food and grocery logistics fleet gets your orders to your doorstep fresh, safe, and on time."
      badge="LOGISTICS & FULFILLMENT"
      lastUpdated="September 2026"
    >
      <div className="space-y-8 text-sm sm:text-base leading-relaxed">
        {/* Intro Highlight */}
        <section className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-5 text-orange-950">
          <div className="flex items-center gap-2 font-bold mb-1">
            <Truck className="w-5 h-5 text-orange-600" />
            <span>30–45 Minute Express Delivery Standard</span>
          </div>
          <p className="text-xs sm:text-sm text-orange-900">
            Ruchi Bazaar utilizes smart hyperlocal routing and insulated thermal carrier bags to ensure meals arrive piping hot and groceries crisp and fresh.
          </p>
        </section>

        {/* 1. Serviceable Areas */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <MapPin className="w-5 h-5 text-red-600" />
            <h2>1. Serviceable Delivery Areas</h2>
          </div>
          <p className="text-slate-700">
            We currently deliver across metropolitan and suburban zones in Tier 1 and Tier 2 cities. 
            Before browsing, enter your delivery address or allow GPS geolocation on the home page to view merchants that actively deliver to your exact pincode.
          </p>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700">
            <strong>Out of Range Delivery:</strong> Restaurants and grocery stores typically operate within a radius of <strong>7 to 10 kilometers</strong>. Long-distance deliveries may feature special extended delivery partners and slightly increased delivery times.
          </div>
        </section>

        {/* 2. Estimated Timelines */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <Clock className="w-5 h-5 text-red-600" />
            <h2>2. Estimated Delivery Times</h2>
          </div>
          <p className="text-slate-700">
            Delivery timelines shown on the app are calculated dynamically based on:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-slate-700">
            <li><strong>Restaurant Preparation Time:</strong> 15 to 25 minutes depending on the culinary complexity of dishes.</li>
            <li><strong>Rider Transit Time:</strong> Distance, live traffic conditions, weather alerts, and building elevation.</li>
            <li><strong>Standard Food Delivery:</strong> Typically completed in <strong>30 to 45 minutes</strong>.</li>
            <li><strong>Instant Groceries &amp; Essentials:</strong> Delivered within <strong>15 to 30 minutes</strong> from nearest dark store/hub.</li>
          </ul>
        </section>

        {/* 3. Delivery Charges */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <IndianRupee className="w-5 h-5 text-red-600" />
            <h2>3. Delivery Charges &amp; Free Delivery</h2>
          </div>
          <div className="space-y-2 text-slate-700">
            <p>
              Delivery charges are itemized transparently on the checkout screen prior to payment authorization:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li><strong>Base Delivery Fee:</strong> Starts at ₹25 for the first 3 kilometers.</li>
              <li><strong>Distance Increment:</strong> ₹10 per additional kilometer beyond the base perimeter.</li>
              <li><strong>Free Delivery Offers:</strong> Available during promotional campaigns or on orders surpassing specific cart thresholds (e.g., Free Delivery over ₹299).</li>
              <li><strong>Surge Pricing:</strong> During torrential rain, festivals, or high rider shortages, a modest weather/demand surge may temporarily apply to compensate riders.</li>
            </ul>
          </div>
        </section>

        {/* 4. Delays & Unforeseen Events */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h2>4. Weather Delays &amp; Peak Hours</h2>
          </div>
          <p className="text-slate-700">
            While our riders prioritize prompt delivery, safety is non-negotiable. Deliveries may experience delays during:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-slate-700">
            <li>Heavy rains, waterlogging, or severe meteorological warnings.</li>
            <li>Peak traffic jams, VIP road cordons, or civic marathons.</li>
            <li>Festive peak rushes (Diwali, Eid, New Year) where kitchen queues expand.</li>
          </ul>
          <p className="text-xs sm:text-sm text-slate-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
            Whenever a delay is anticipated, our system proactively sends notifications and updates your live tracking ETA.
          </p>
        </section>

        {/* 5. Address Issues & Failed Delivery */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <UserCheck className="w-5 h-5 text-red-600" />
            <h2>5. Failed Delivery &amp; Address Difficulties</h2>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-slate-700">
            <p>
              Our delivery riders are instructed to execute the following protocol upon reaching your location:
            </p>
            <ol className="list-decimal pl-5 space-y-1 text-xs sm:text-sm text-slate-600">
              <li>Ring the doorbell and place up to <strong>3 phone calls</strong> to the customer registered number.</li>
              <li>Wait for a mandatory minimum duration of <strong>10 minutes</strong> at the specified address.</li>
              <li>If the customer remains unreachable, door remains unanswered, or entry is prohibited by society security without customer pass, the order is declared a <strong>Failed Delivery</strong>.</li>
              <li>Because cooked food and temperature-sensitive groceries cannot be returned or resold, no refund will be issued for failed deliveries caused by customer unreachability.</li>
            </ol>
          </div>
        </section>

        {/* 6. Contactless Delivery */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <PackageCheck className="w-5 h-5 text-red-600" />
            <h2>6. Contactless Delivery Option</h2>
          </div>
          <p className="text-slate-700">
            To opt for 100% contactless drop-off:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-slate-700">
            <li>Choose online prepaid payment (UPI, Credit/Debit card, Netbanking).</li>
            <li>Select <strong>&quot;Leave order at my door or with security&quot;</strong> in delivery instructions at checkout.</li>
            <li>The rider will place your package upon a clean surface at your door, step back to a safe distance, and send an in-app confirmation photo.</li>
          </ul>
        </section>
      </div>
    </LegalPageLayout>
  );
}
