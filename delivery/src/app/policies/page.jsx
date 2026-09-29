"use client";

import { useState } from "react";
import SuperLayout from "../SuperLayout/page";
import {
  ShieldCheck,
  FileText,
  IndianRupee,
  Bike,
  Clock,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Mail,
  Heart,
  HelpCircle,
} from "lucide-react";

export default function DeliveryPoliciesPage() {
  const [activeTab, setActiveTab] = useState("conduct");

  const tabs = [
    { id: "conduct", label: "Code of Conduct", icon: FileText },
    { id: "payouts", label: "Earnings & Incentives", icon: IndianRupee },
    { id: "safety", label: "Safety & Emergency", icon: Bike },
    { id: "dropoff", label: "Drop-off & Waiting SLA", icon: Clock },
    { id: "support", label: "Helpline & Grievance", icon: Scale },
  ];

  return (
    <SuperLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              Delivery Fleet Standards
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              Delivery Partner Policies &amp; Rider Guide
            </h1>
            <p className="text-sm text-emerald-100 max-w-2xl leading-relaxed">
              Rules of the road, payout transparent formulas, surge incentive milestones, safety protocols, and 24/7 rider assistance.
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-sm">
          {activeTab === "conduct" && (
            <div className="space-y-6 text-sm sm:text-base text-gray-700 leading-relaxed">
              <div className="flex items-center gap-2 text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h2>Rider Professionalism &amp; Code of Conduct</h2>
              </div>

              <p>
                As the face of Ruchi Bazaar on the streets, delivery partners are expected to represent our core values with pride:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-1.5">
                  <h3 className="font-bold text-gray-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Customer Courtesy
                  </h3>
                  <p className="text-gray-600">
                    Greet customers politely, confirm the customer name or delivery OTP before handover, and ensure order contents remain upright.
                  </p>
                </div>

                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-1.5">
                  <h3 className="font-bold text-gray-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Clean Delivery Box
                  </h3>
                  <p className="text-gray-600">
                    Keep your insulated delivery bag clean, odor-free, and securely zipped at all times during transit.
                  </p>
                </div>

                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-1.5">
                  <h3 className="font-bold text-gray-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Zero Food Tampering
                  </h3>
                  <p className="text-gray-600">
                    Never open or break the restaurant hygiene seal. Any food tampering leads to immediate contract termination and blacklist.
                  </p>
                </div>

                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-1.5">
                  <h3 className="font-bold text-gray-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Traffic Discipline
                  </h3>
                  <p className="text-gray-600">
                    Always observe traffic signals, one-way paths, and speed limits. Reckless driving for speed is strictly forbidden.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "payouts" && (
            <div className="space-y-6 text-sm sm:text-base text-gray-700 leading-relaxed">
              <div className="flex items-center gap-2 text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
                <IndianRupee className="w-5 h-5 text-emerald-600" />
                <h2>How Rider Earnings &amp; Incentives Work</h2>
              </div>

              <p>Your total weekly payout consists of four clear components:</p>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-1">1. Base Delivery Pay</h3>
                  <p className="text-gray-600">₹25 to ₹35 guaranteed for completing the pickup and first 2 km of delivery.</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-1">2. Distance Pay</h3>
                  <p className="text-gray-600">₹8 to ₹12 per additional kilometer calculated via actual shortest road routing.</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-1">3. Peak Surge &amp; Bad Weather Incentives</h3>
                  <p className="text-gray-600">Extra ₹15 to ₹40 per order during lunch/dinner rushes, festivals, or monsoon rain showers.</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-1">4. Weekly Milestone Bonuses</h3>
                  <p className="text-gray-600">Complete 60 orders in a week: extra ₹1,200 bonus. Complete 100 orders: extra ₹2,500 bonus.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "safety" && (
            <div className="space-y-6 text-sm sm:text-base text-gray-700 leading-relaxed">
              <div className="flex items-center gap-2 text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
                <Bike className="w-5 h-5 text-emerald-600" />
                <h2>Rider Safety, Helmet &amp; Insurance Policy</h2>
              </div>

              <p>Your life and health are always more important than delivery speed:</p>

              <ul className="list-disc pl-6 space-y-2 text-xs sm:text-sm text-gray-700">
                <li><strong>Mandatory Helmet Rule:</strong> Always wear a certified ISI-mark helmet fastened securely.</li>
                <li><strong>Night Visibility:</strong> Wear the reflective Ruchi Bazaar vest during shifts past 7:00 PM.</li>
                <li><strong>Accidental Insurance:</strong> All active delivery partners are covered up to ₹2,00,000 for emergency medical hospitalization and ₹5,00,000 accidental cover.</li>
                <li><strong>Emergency SOS:</strong> Use the red SOS button on your app to alert the local fleet manager and emergency response team immediately.</li>
              </ul>
            </div>
          )}

          {activeTab === "dropoff" && (
            <div className="space-y-6 text-sm sm:text-base text-gray-700 leading-relaxed">
              <div className="flex items-center gap-2 text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
                <Clock className="w-5 h-5 text-emerald-600" />
                <h2>Drop-off Procedure &amp; 10-Minute Waiting Rule</h2>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-1">Arrival at Location</h3>
                  <p className="text-gray-600">Mark &quot;Reached Customer Location&quot; on your app. Ring doorbell and call customer.</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-1">Customer Unreachable Protocol</h3>
                  <p className="text-gray-600">
                    If customer does not answer, trigger in-app &quot;Customer Unreachable&quot; timer. The app starts a <strong>10-minute countdown</strong> while support attempts to call. 
                    If still unreachable at 0:00, order is marked failed and you receive your full delivery payout for the trip.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-1">Contactless Drop-off</h3>
                  <p className="text-gray-600">
                    If instructed, place food upon a clean surface at the doorstep, step back 2 meters, take a clear photo through the app, and ring the bell once before departing.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "support" && (
            <div className="space-y-6 text-sm sm:text-base text-gray-700 leading-relaxed">
              <div className="flex items-center gap-2 text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
                <Scale className="w-5 h-5 text-emerald-600" />
                <h2>Rider Support Helpline &amp; Grievances</h2>
              </div>

              <p>For payout discrepancies, wrong GPS coordinates, or restaurant delays:</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                  <h3 className="font-bold text-gray-900 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    Fleet SOS Helpline
                  </h3>
                  <p className="text-gray-600">Active during your delivery shift:</p>
                  <p className="font-bold text-emerald-700 text-base">1800-123-789</p>
                  <p className="text-gray-500 text-xs">Available 24/7 for live route support</p>
                </div>

                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                  <h3 className="font-bold text-gray-900 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-emerald-600" />
                    Rider Payout Desk
                  </h3>
                  <p className="text-gray-600">For banking and incentive reviews:</p>
                  <p className="font-bold text-emerald-700 text-base">riders@ruchibazaar.in</p>
                  <p className="text-gray-500 text-xs">Resolutions within 24 hours</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </SuperLayout>
  );
}
