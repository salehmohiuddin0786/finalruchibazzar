import React from "react";
import LegalPageLayout from "../components/LegalPageLayout";
import { Sparkles, Utensils, Heart, Award, ShieldCheck, Zap, Users, Store, Bike, Globe } from "lucide-react";

export const metadata = {
  title: "About Us",
  description: "Discover Ruchi Bazaar - India's favorite hyperlocal food and grocery delivery platform. Learn about our mission, technology, and values.",
};

export default function AboutUsPage() {
  return (
    <LegalPageLayout
      title="About Ruchi Bazaar"
      subtitle="Connecting culinary passion, fresh local groceries, and fast reliable delivery with neighborhoods across India."
      badge="WHO WE ARE"
      lastUpdated="September 2026"
    >
      <div className="space-y-8 text-sm sm:text-base leading-relaxed">
        {/* Story Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <Sparkles className="w-5 h-5 text-red-600" />
            <h2>The Ruchi Bazaar Story</h2>
          </div>
          <p className="text-slate-700">
            Founded with a passion for authentic culinary flavors and everyday convenience, <strong>Ruchi Bazaar</strong> was born out of a simple observation: 
            people deserve restaurant-quality food delivered at peak freshness, alongside farm-fresh groceries delivered in minutes—without unreasonable surcharges or cold delays.
          </p>
          <p className="text-slate-700">
            Today, Ruchi Bazaar bridges the gap between beloved neighborhood kitchens, renowned dining establishments, grocery merchants, and hungry customers through an advanced, intuitive hyperlocal commerce ecosystem.
          </p>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
          <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-red-600">500+</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">Restaurant Partners</div>
          </div>
          <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-orange-600">100k+</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">Orders Delivered</div>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">30 Mins</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">Average Delivery Time</div>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">4.8 ★</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">Customer Rating</div>
          </div>
        </section>

        {/* How It Works */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <Zap className="w-5 h-5 text-red-600" />
            <h2>How the Platform Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 relative">
              <span className="text-3xl font-black text-red-200 absolute top-2 right-3">01</span>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Discover</h3>
              <p className="text-xs text-slate-600">
                Browse nearby restaurants, trending dishes, seasonal groceries, and verified hygiene-rated kitchens.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 relative">
              <span className="text-3xl font-black text-orange-200 absolute top-2 right-3">02</span>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Select &amp; Pay</h3>
              <p className="text-xs text-slate-600">
                Add mouthwatering items to your cart, apply coupons, and checkout securely via UPI, cards, or Cash on Delivery.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 relative">
              <span className="text-3xl font-black text-amber-200 absolute top-2 right-3">03</span>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Fresh Prep</h3>
              <p className="text-xs text-slate-600">
                The merchant accepts your ticket instantly, preparing your order fresh with tamper-evident hygiene packaging.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 relative">
              <span className="text-3xl font-black text-emerald-200 absolute top-2 right-3">04</span>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Express Delivery</h3>
              <p className="text-xs text-slate-600">
                A nearby delivery partner picks up your order in an insulated thermal pack and delivers it hot &amp; fresh to your door.
              </p>
            </div>
          </div>
        </section>

        {/* Our Pillars */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <Heart className="w-5 h-5 text-red-600" />
            <h2>Our Core Values</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <ShieldCheck className="w-6 h-6 text-red-600 mb-2" />
              <h3 className="font-semibold text-slate-900 text-sm mb-1">Uncompromised Quality</h3>
              <p className="text-xs text-slate-600">
                We mandate FSSAI hygiene registrations, fresh ingredients, and insulated delivery bags for all partners.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <Store className="w-6 h-6 text-orange-600 mb-2" />
              <h3 className="font-semibold text-slate-900 text-sm mb-1">Supporting Local Merchants</h3>
              <p className="text-xs text-slate-600">
                We offer fair, transparent commission rates that help small kitchens and family grocers thrive digitally.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <Bike className="w-6 h-6 text-emerald-600 mb-2" />
              <h3 className="font-semibold text-slate-900 text-sm mb-1">Dignity for Delivery Riders</h3>
              <p className="text-xs text-slate-600">
                Fair distance compensation, medical insurance access, transparent weekly payouts, and safety gear.
              </p>
            </div>
          </div>
        </section>
      </div>
    </LegalPageLayout>
  );
}
