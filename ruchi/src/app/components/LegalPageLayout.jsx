"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {
  ShieldCheck,
  FileText,
  RefreshCw,
  Truck,
  Cookie,
  Tag,
  HeartHandshake,
  AlertCircle,
  HelpCircle,
  Building2,
  Phone,
  Mail,
  Clock,
  MapPin,
  ChevronRight,
  Sparkles,
  Store,
  Bike,
  Scale
} from "lucide-react";

const NAV_GROUPS = [
  {
    title: "Legal & Policies",
    items: [
      { label: "Privacy Policy", href: "/privacy-policy", icon: ShieldCheck },
      { label: "Terms & Conditions", href: "/terms-and-conditions", icon: FileText },
      { label: "Refund & Cancellation", href: "/refund-policy", icon: RefreshCw },
      { label: "Delivery Policy", href: "/delivery-policy", icon: Truck },
      { label: "Cookie Policy", href: "/cookie-policy", icon: Cookie },
      { label: "Offers & Coupon Terms", href: "/offers-terms", icon: Tag },
    ],
  },
  {
    title: "Safety, Trust & Compliance",
    items: [
      { label: "Food Safety & Quality", href: "/food-safety", icon: Sparkles },
      { label: "Grievance Redressal", href: "/grievance", icon: Scale },
      { label: "Accessibility Statement", href: "/accessibility", icon: HeartHandshake },
    ],
  },
  {
    title: "Company & Support",
    items: [
      { label: "About Us", href: "/about-us", icon: Building2 },
      { label: "Contact Us", href: "/contact-us", icon: Phone },
      { label: "FAQ", href: "/faq", icon: HelpCircle },
    ],
  },
  {
    title: "Partner Programs",
    items: [
      { label: "Become a Restaurant Partner", href: "/partner-with-us", icon: Store },
      { label: "Become a Delivery Partner", href: "/delivery-partner", icon: Bike },
    ],
  },
];

export default function LegalPageLayout({
  title,
  subtitle,
  badge = "LEGAL & COMPLIANCE",
  lastUpdated = "September 2026",
  children,
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-red-500 selection:text-white">
      <Navbar />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 text-white py-12 md:py-16">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-xs md:text-sm text-red-100 mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-70" />
            <span className="text-white font-medium truncate">{title}</span>
          </nav>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold tracking-wider uppercase mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-200" />
            <span>{badge}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-3 text-sm sm:text-base md:text-lg text-red-100 max-w-3xl leading-relaxed">
              {subtitle}
            </p>
          )}

          <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm text-amber-100">
            <Clock className="w-4 h-4" />
            <span>Last reviewed & updated: {lastUpdated}</span>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-4 xl:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm sticky top-24">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">
                Knowledge & Policies Hub
              </h3>

              <div className="space-y-6">
                {NAV_GROUPS.map((group, groupIdx) => (
                  <div key={groupIdx}>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">
                      {group.title}
                    </p>
                    <ul className="space-y-1">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                                isActive
                                  ? "bg-red-50 text-red-600 font-semibold shadow-xs"
                                  : "text-slate-700 hover:text-red-600 hover:bg-slate-50"
                              }`}
                            >
                              <Icon
                                className={`w-4 h-4 flex-shrink-0 ${
                                  isActive ? "text-red-600" : "text-slate-400"
                                }`}
                              />
                              <span className="truncate">{item.label}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Quick Support Box */}
              <div className="mt-6 pt-5 border-t border-slate-100 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200/60">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-xs mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Need Immediate Assistance?</span>
                </div>
                <p className="text-xs text-amber-900/80 leading-relaxed mb-3">
                  Our customer care and grievance team is active 24/7 to resolve queries.
                </p>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-red-500" />
                    <span className="font-semibold">1800-123-456</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-red-500" />
                    <span>support@ruchibazaar.in</span>
                  </div>
                </div>
                <Link
                  href="/contact-us"
                  className="mt-3 block text-center text-xs font-semibold text-white bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 py-2 rounded-lg transition-all shadow-sm"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <article className="lg:col-span-8 xl:col-span-9 bg-white rounded-2xl p-6 sm:p-8 md:p-10 border border-slate-200/80 shadow-sm leading-relaxed text-slate-700">
            {children}
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
