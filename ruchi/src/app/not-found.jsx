"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, UtensilsCrossed, ShoppingBag, Tag, PhoneCall, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const quickLinks = [
    { name: "Explore Restaurants", href: "/Restaurants", icon: UtensilsCrossed, desc: "Order from top dining spots" },
    { name: "Shop Groceries", href: "/Groceries", icon: ShoppingBag, desc: "Fresh produce & essentials" },
    { name: "Special Offers", href: "/offers", icon: Tag, desc: "Deals & promotional discounts" },
    { name: "Contact Support", href: "/contact-us", icon: PhoneCall, desc: "We're here to help 24/7" },
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8 bg-gradient-to-b from-orange-50/40 via-white to-amber-50/20">
      <div className="max-w-2xl w-full text-center">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-6"
        >
          <span>Error 404</span>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          <span>Page Not Found</span>
        </motion.div>

        {/* Large 404 illustration text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-7xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 tracking-tight select-none"
        >
          404
        </motion.h1>

        {/* Heading & Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 space-y-3"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Looks like this plate is empty!
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto leading-relaxed">
            The page you are looking for might have been moved, renamed, or devoured. Don&apos;t worry, delicious food is just a tap away.
          </p>
        </motion.div>

        {/* Primary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm sm:text-base shadow-lg shadow-orange-600/25 hover:shadow-orange-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 min-h-[44px]"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm sm:text-base border border-gray-200 shadow-sm hover:border-gray-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous Page
          </button>
        </motion.div>

        {/* Quick Discovery Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 pt-8 border-t border-gray-200/70 text-left"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 text-center mb-4">
            Popular Destinations
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-start gap-3.5 p-3.5 rounded-xl bg-white/80 hover:bg-white border border-gray-100 hover:border-orange-200 shadow-xs hover:shadow-md transition-all duration-200"
                >
                  <div className="p-2 rounded-lg bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">{item.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
