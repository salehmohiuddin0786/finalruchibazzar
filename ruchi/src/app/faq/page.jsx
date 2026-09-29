"use client";

import React, { useState } from "react";
import LegalPageLayout from "../components/LegalPageLayout";
import { HelpCircle, ChevronDown, Search, ShoppingBag, Truck, RefreshCw, Store, Bike, CreditCard } from "lucide-react";

const FAQ_DATA = [
  {
    category: "Ordering & Delivery",
    icon: ShoppingBag,
    questions: [
      {
        q: "How do I place an order on Ruchi Bazaar?",
        a: "Browse restaurants or grocery sections on our home page or search for specific dishes. Click 'Add to Cart', customize your preferences, navigate to your Cart, enter your delivery address, apply any coupons, and click 'Proceed to Checkout'. Choose between online prepayment or Cash on Delivery.",
      },
      {
        q: "How can I track my active order in real time?",
        a: "Once your order is placed, visit 'My Orders' from the navigation bar. You will see a live status timeline tracking 'Order Received', 'Kitchen Preparing', 'Rider Assigned', and 'Out for Delivery' with live rider coordinates and ETA.",
      },
      {
        q: "What are your delivery hours and average delivery time?",
        a: "Ruchi Bazaar operates 24/7, subject to the opening hours of local merchant kitchens. Our average delivery time ranges from 30 to 45 minutes for prepared food, and 15 to 30 minutes for express groceries.",
      },
      {
        q: "Is there a minimum order value (MOV)?",
        a: "There is no platform-wide minimum order. However, specific restaurants may set an individual minimum threshold (e.g., ₹99), and orders under ₹149 may incur a nominal small-order fulfillment fee.",
      },
    ],
  },
  {
    category: "Cancellations & Refunds",
    icon: RefreshCw,
    questions: [
      {
        q: "How do I cancel my order?",
        a: "You can cancel free of penalty directly from the order screen within 60 seconds of placing it, provided the restaurant has not yet accepted and started food preparation. Once food preparation begins, orders cannot be cancelled as cooked food cannot be resold.",
      },
      {
        q: "How do refunds work and when will I get my money back?",
        a: "Refunds for approved cancellations or missing items are credited back to your original payment method. Ruchi Wallet credits are instant (0–15 mins), UPI payments take 1–2 business days, and Credit/Debit cards take 4–7 business days.",
      },
      {
        q: "What should I do if an item is missing or spoiled?",
        a: "Open 'My Orders', select the order, tap 'Help with this Order', and choose 'Missing Item' or 'Spilled/Damaged Food'. Attach a photo of the received package within 2 hours of delivery for instant resolution and credit.",
      },
    ],
  },
  {
    category: "Payments & Offers",
    icon: CreditCard,
    questions: [
      {
        q: "What payment methods are supported?",
        a: "We support UPI (Google Pay, PhonePe, Paytm, BHIM), all major Credit and Debit Cards (Visa, MasterCard, RuPay), Net Banking across 50+ banks, Ruchi Wallet, and Cash on Delivery (COD).",
      },
      {
        q: "Why is my coupon code not applying?",
        a: "Coupons require minimum cart values (e.g., ₹299), may be limited to first-time customers, or may exclude specific discounted combo items. Check the 'Offers & Coupon Terms' page for full details.",
      },
    ],
  },
  {
    category: "Partnerships",
    icon: Store,
    questions: [
      {
        q: "How do I become a Restaurant Partner?",
        a: "Visit our 'Partner with Us' page and submit your restaurant name, contact details, FSSAI registration certificate, GSTIN, and menu card. Our onboarding team verifies your kitchen within 24–48 hours to activate your digital storefront.",
      },
      {
        q: "How do I become a Delivery Partner / Rider?",
        a: "Visit our 'Delivery Partner' page or download the partner app. You must be at least 18 years old, possess a valid vehicle (bike/scooter) or bicycle, a valid Driving License, Aadhaar card, and an Android smartphone. Start delivering within 24 hours of document approval.",
      },
    ],
  },
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredCategories = FAQ_DATA.map((cat) => {
    const matchingQuestions = cat.questions.filter(
      (item) =>
        item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.a.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return { ...cat, questions: matchingQuestions };
  }).filter((cat) => cat.questions.length > 0);

  return (
    <LegalPageLayout
      title="Frequently Asked Questions (FAQ)"
      subtitle="Find quick, comprehensive answers to common questions about ordering, delivery tracking, cancellations, refunds, and partner onboarding."
      badge="HELP & ASSISTANCE"
      lastUpdated="September 2026"
    >
      <div className="space-y-8 text-sm sm:text-base leading-relaxed">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search FAQs (e.g. refund, track order, cancel, partner)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm shadow-xs"
          />
        </div>

        {/* Categories */}
        <div className="space-y-8">
          {filteredCategories.map((category, catIdx) => {
            const Icon = category.icon;

            return (
              <div key={catIdx} className="space-y-3">
                <div className="flex items-center gap-2 text-base sm:text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
                  <Icon className="w-5 h-5 text-red-600" />
                  <h2>{category.category}</h2>
                </div>

                <div className="space-y-2.5">
                  {category.questions.map((faq, qIdx) => {
                    const key = `${catIdx}-${qIdx}`;
                    const isOpen = openItems[key];

                    return (
                      <div
                        key={qIdx}
                        className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 transition-colors"
                      >
                        <button
                          type="button"
                          onClick={() => toggleItem(catIdx, qIdx)}
                          className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 hover:text-red-600 text-xs sm:text-sm"
                        >
                          <span>{faq.q}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-500 transition-transform flex-shrink-0 ${
                              isOpen ? "rotate-180 text-red-600" : ""
                            }`}
                          />
                        </button>

                        {isOpen && (
                          <div className="px-4 pb-4 text-xs sm:text-sm text-slate-600 border-t border-slate-200/60 pt-3 bg-white leading-relaxed">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {filteredCategories.length === 0 && (
            <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <HelpCircle className="w-10 h-10 mx-auto text-slate-400 mb-2" />
              <p className="font-semibold text-slate-800">No matching questions found.</p>
              <p className="text-xs text-slate-500 mt-1">Try another keyword or contact our 24/7 support desk.</p>
            </div>
          )}
        </div>
      </div>
    </LegalPageLayout>
  );
}
