"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  ShieldCheck,
  FileText,
  IndianRupee,
  Sparkles,
  Clock,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Mail,
  Building2,
  HelpCircle
} from "lucide-react";

export default function PartnerPoliciesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("terms");

  const tabs = [
    { id: "terms", label: "Partner Terms", icon: FileText },
    { id: "payouts", label: "Commission & Payouts", icon: IndianRupee },
    { id: "safety", label: "Food Safety & FSSAI", icon: Sparkles },
    { id: "sla", label: "Order SLA & Rejections", icon: Clock },
    { id: "grievance", label: "Grievance & Support", icon: Scale },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
              <div className="relative z-10 space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Merchant Compliance &amp; Guidelines
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold">
                  Restaurant Partner Policies &amp; Terms
                </h1>
                <p className="text-sm text-red-100 max-w-2xl leading-relaxed">
                  Clear, transparent operational standards, payout schedules, commission breakdowns, food safety requirements, and merchant grievance protocols.
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
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
                        ? "bg-red-600 text-white shadow-sm"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Content Container */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-sm">
              {/* Tab 1: Terms */}
              {activeTab === "terms" && (
                <div className="space-y-6 text-sm sm:text-base text-gray-700 leading-relaxed">
                  <div className="flex items-center gap-2 text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
                    <FileText className="w-5 h-5 text-red-600" />
                    <h2>Merchant Partner Agreement &amp; Code of Conduct</h2>
                  </div>

                  <p>
                    By registering as a Merchant Partner on Ruchi Bazaar, you agree to comply with the platform terms and conditions:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
                      <h3 className="font-bold text-gray-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Menu &amp; Pricing Parity
                      </h3>
                      <p className="text-gray-600">
                        Dishes, prices, portion sizes, and descriptions listed on Ruchi Bazaar should generally reflect fair dine-in or takeaway rates without inflated artificial markups.
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
                      <h3 className="font-bold text-gray-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Timely Order Acceptance
                      </h3>
                      <p className="text-gray-600">
                        Orders must be accepted within <strong>2 minutes</strong> of receipt on the dashboard to prevent customer drop-off and delivery SLA breaches.
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
                      <h3 className="font-bold text-gray-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Tamper-Evident Packaging
                      </h3>
                      <p className="text-gray-600">
                        All containers and meal packets must be sealed with tamper-proof safety tape or stickers before being handed over to delivery partners.
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
                      <h3 className="font-bold text-gray-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Dietary Accuracy
                      </h3>
                      <p className="text-gray-600">
                        Strict segregation of Vegetarian, Non-Vegetarian, and Halal preparation is required. Delivery of a non-veg item marked as veg attracts heavy penalties.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Payouts */}
              {activeTab === "payouts" && (
                <div className="space-y-6 text-sm sm:text-base text-gray-700 leading-relaxed">
                  <div className="flex items-center gap-2 text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
                    <IndianRupee className="w-5 h-5 text-red-600" />
                    <h2>Commission Structure &amp; Weekly Payouts</h2>
                  </div>

                  <p>
                    We maintain clear, transparent payout calculation with zero hidden fees:
                  </p>

                  <div className="space-y-3 text-xs sm:text-sm">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <h3 className="font-bold text-gray-900 mb-1">Standard Commission Rates</h3>
                      <p className="text-gray-600">
                        Platform commission ranges from <strong>12% to 18%</strong> of the net food bill (excluding GST), depending on order volume and exclusive promotional tier.
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <h3 className="font-bold text-gray-900 mb-1">Weekly Payout Settlement Cycle</h3>
                      <p className="text-gray-600">
                        Payouts are calculated every Monday for the preceding week (Monday to Sunday) and credited directly via NEFT/IMPS to your registered bank account by <strong>Wednesday morning</strong>.
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <h3 className="font-bold text-gray-900 mb-1">GST &amp; TCS Compliance</h3>
                      <p className="text-gray-600">
                        As per Section 52 of the CGST Act, Tax Collected at Source (TCS) of 1% is deducted and deposited with the government against your GSTIN. Monthly GST invoices are downloadable under the Earnings tab.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Safety */}
              {activeTab === "safety" && (
                <div className="space-y-6 text-sm sm:text-base text-gray-700 leading-relaxed">
                  <div className="flex items-center gap-2 text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
                    <Sparkles className="w-5 h-5 text-red-600" />
                    <h2>FSSAI Compliance &amp; Kitchen Hygiene Standards</h2>
                  </div>

                  <p>
                    Maintaining highest food hygiene safeguards both our customers and your culinary reputation:
                  </p>

                  <ul className="list-disc pl-6 space-y-2 text-xs sm:text-sm text-gray-700">
                    <li><strong>Active FSSAI License:</strong> Maintain valid registration at all times. Update renewal certificates 30 days prior to expiry in Profile settings.</li>
                    <li><strong>Food Quality Audits:</strong> Periodic surprise kitchen audits and swab testing may be conducted by certified third-party inspection agencies.</li>
                    <li><strong>Fresh Ingredients Only:</strong> No artificial, prohibited colors or expired ingredients may be used. Oils must be tested and refreshed regularly.</li>
                    <li><strong>Staff Hygiene:</strong> Kitchen staff must wear hair nets, aprons, and gloves when packaging cooked food.</li>
                  </ul>
                </div>
              )}

              {/* Tab 4: SLA */}
              {activeTab === "sla" && (
                <div className="space-y-6 text-sm sm:text-base text-gray-700 leading-relaxed">
                  <div className="flex items-center gap-2 text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
                    <Clock className="w-5 h-5 text-red-600" />
                    <h2>Kitchen SLA &amp; Rejection Penalties</h2>
                  </div>

                  <p>
                    Reliable preparation times ensure happy customers and positive ratings:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <h3 className="font-bold text-gray-900 mb-1">Preparation Time Accuracy</h3>
                      <p className="text-gray-600">
                        Set realistic kitchen prep timers (e.g. 15–20 mins). Food must be packed and ready when the delivery rider arrives at your doorstep.
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <h3 className="font-bold text-gray-900 mb-1">Out-of-Stock Item Management</h3>
                      <p className="text-gray-600">
                        Toggle unavailable dishes to &quot;Out of Stock&quot; in the Menu tab immediately to prevent order cancellations.
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <h3 className="font-bold text-gray-900 mb-1">Late Cancellations</h3>
                      <p className="text-gray-600">
                        Merchant-initiated cancellations after 5 minutes of order acceptance damage customer trust and may incur a penalty deduction.
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <h3 className="font-bold text-gray-900 mb-1">Missing Item Deductions</h3>
                      <p className="text-gray-600">
                        Customer refunds resulting from verified missing dishes or sauces will be debited from the merchant payout for that ticket.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: Grievance */}
              {activeTab === "grievance" && (
                <div className="space-y-6 text-sm sm:text-base text-gray-700 leading-relaxed">
                  <div className="flex items-center gap-2 text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
                    <Scale className="w-5 h-5 text-red-600" />
                    <h2>Merchant Grievance Redressal &amp; Support</h2>
                  </div>

                  <p>
                    If you dispute a payout deduction, experience delivery fleet issues, or need help with your menu listing:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                      <h3 className="font-bold text-gray-900 flex items-center gap-1.5">
                        <Phone className="w-4 h-4 text-red-600" />
                        Partner Priority Helpline
                      </h3>
                      <p className="text-gray-600">Dedicated phone line for active kitchen issues:</p>
                      <p className="font-bold text-red-600 text-base">+91 98765 43210</p>
                      <p className="text-gray-500 text-xs">Operating: 8:00 AM – 11:30 PM IST</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                      <h3 className="font-bold text-gray-900 flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-red-600" />
                        Merchant Dispute Email
                      </h3>
                      <p className="text-gray-600">For settlement queries and commission reviews:</p>
                      <p className="font-bold text-red-600 text-base">partnercare@ruchibazaar.in</p>
                      <p className="text-gray-500 text-xs">Turnaround: 24 to 48 hours</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
