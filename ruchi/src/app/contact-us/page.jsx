"use client";

import React, { useState } from "react";
import LegalPageLayout from "../components/LegalPageLayout";
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, CheckCircle2, Headphones, AlertCircle } from "lucide-react";

export default function ContactUsPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    orderId: "",
    category: "Order Support",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setTicketId(`RB-${Math.floor(100000 + Math.random() * 900000)}`);
    setFormSubmitted(true);
  };

  return (
    <LegalPageLayout
      title="Contact Us"
      subtitle="We are here to assist you 24/7. Reach our customer care, merchant support desk, or delivery fleet operations."
      badge="CUSTOMER CARE & SUPPORT"
      lastUpdated="September 2026"
    >
      <div className="space-y-8 text-sm sm:text-base leading-relaxed">
        {/* Support Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-red-50/60 border border-red-100 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center mb-3">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Phone Helpline</h3>
              <p className="text-xs text-slate-600 mt-1">Toll-free customer support</p>
            </div>
            <div className="mt-4">
              <a href="tel:1800123456" className="text-red-600 font-extrabold text-lg block hover:underline">
                1800-123-456
              </a>
              <span className="text-[11px] text-slate-500">Available 8:00 AM – 11:00 PM</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-orange-50/60 border border-orange-100 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center mb-3">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Email Support</h3>
              <p className="text-xs text-slate-600 mt-1">Direct ticketing &amp; refunds</p>
            </div>
            <div className="mt-4">
              <a href="mailto:support@ruchibazaar.in" className="text-orange-600 font-bold text-sm block hover:underline truncate">
                support@ruchibazaar.in
              </a>
              <span className="text-[11px] text-slate-500">24/7 Response within 2 hours</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-100 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-3">
                <Headphones className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Live Order Chat</h3>
              <p className="text-xs text-slate-600 mt-1">Real-time rider coordination</p>
            </div>
            <div className="mt-4">
              <a href="/Orders" className="text-amber-700 font-bold text-sm block hover:underline">
                Chat via &quot;My Orders&quot; →
              </a>
              <span className="text-[11px] text-slate-500">Instant connection during active deliveries</span>
            </div>
          </div>
        </div>

        {/* Corporate Address & Operating Hours */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl border border-slate-200 bg-slate-50/50">
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600" />
              Registered Corporate Address
            </h3>
            <div className="text-xs sm:text-sm text-slate-700 space-y-1">
              <p className="font-semibold text-slate-900">Ruchi Bazaar Technologies Private Limited</p>
              <p>Corporate Tower B, 4th Floor, Tech Park Avenue</p>
              <p>Bandra Kurla Complex (BKC), Mumbai, Maharashtra 400051</p>
              <p>CIN: U74999MH2025PTC123456</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-600" />
              Operating &amp; Support Hours
            </h3>
            <div className="text-xs sm:text-sm text-slate-700 space-y-1">
              <p><strong>Platform Deliveries:</strong> 24 Hours, 7 Days a Week (subject to merchant hours)</p>
              <p><strong>Voice Helpline:</strong> Monday to Sunday, 8:00 AM – 11:00 PM IST</p>
              <p><strong>Emergency Order Support:</strong> 24/7 in-app ticket tracking</p>
              <p><strong>Grievance Office:</strong> Mon–Fri, 10:00 AM – 6:00 PM IST</p>
            </div>
          </div>
        </section>

        {/* Interactive Send Message Form */}
        <section className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <MessageSquare className="w-5 h-5 text-red-600" />
            <h2>Send Us a Message</h2>
          </div>
          <p className="text-slate-600 text-xs sm:text-sm">
            Have a question about an order, partnership inquiry, or general feedback? Fill out the form below:
          </p>

          {formSubmitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-fadeIn">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-emerald-900">Thank You! Your Message is Received.</h3>
              <p className="text-sm text-emerald-800 max-w-md mx-auto">
                Ticket #{ticketId} has been created. Our customer support executive will reply to your registered email within 2 hours.
              </p>
              <button
                type="button"
                onClick={() => setFormSubmitted(false)}
                className="mt-3 text-xs font-semibold text-emerald-700 underline"
              >
                Submit another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. rahul@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Order ID (if applicable)</label>
                  <input
                    type="text"
                    value={formData.orderId}
                    onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                    placeholder="e.g. #ORD-84920"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Inquiry Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm bg-white"
                >
                  <option value="Order Support">Order Status, Missing or Delayed Items</option>
                  <option value="Refund & Billing">Payment, Invoicing &amp; Refund Inquiries</option>
                  <option value="Restaurant Partnership">Restaurant Onboarding &amp; Vendor Queries</option>
                  <option value="Delivery Partner">Delivery Rider Applications &amp; Payouts</option>
                  <option value="Technical Bug">App Glitch, Website Bug, or Account Access</option>
                  <option value="Feedback">General Feedback &amp; Suggestions</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Message *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your inquiry or order issue in detail..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold hover:from-red-700 hover:to-orange-700 transition-all shadow-md active:scale-95 text-sm"
              >
                <Send className="w-4 h-4" />
                Submit Inquiry
              </button>
            </form>
          )}
        </section>
      </div>
    </LegalPageLayout>
  );
}
