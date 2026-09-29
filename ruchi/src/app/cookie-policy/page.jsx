import React from "react";
import LegalPageLayout from "../components/LegalPageLayout";
import { Cookie, Shield, CheckCircle2, Lock, Settings, Info } from "lucide-react";

export const metadata = {
  title: "Cookie Policy",
  description: "Learn how Ruchi Bazaar uses cookies and tracking technologies to keep your session secure, retain shopping carts, and personalize your experience.",
};

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout
      title="Cookie Policy"
      subtitle="Understand what cookies, local storage tokens, and web beacons Ruchi Bazaar uses, why we use them, and how you can manage your preferences."
      badge="COOKIES & TRACKING TECHNOLOGIES"
      lastUpdated="September 2026"
    >
      <div className="space-y-8 text-sm sm:text-base leading-relaxed">
        {/* Intro */}
        <section className="bg-orange-50/70 border border-orange-200 rounded-xl p-5 text-orange-950">
          <div className="flex items-center gap-2 font-bold mb-1">
            <Cookie className="w-5 h-5 text-orange-600" />
            <span>Why Ruchi Bazaar Uses Cookies</span>
          </div>
          <p className="text-xs sm:text-sm text-orange-900">
            Cookies are small text files stored on your browser or device. They enable our food and grocery platform to remember your active session, preserve items in your shopping cart, and deliver personalized local restaurant menus.
          </p>
        </section>

        {/* 1. Categories of Cookies */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <Shield className="w-5 h-5 text-red-600" />
            <h2>1. Types of Cookies We Utilize</h2>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                Strictly Necessary Cookies (Always Active)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Essential for the website to function. They store authentication tokens (session IDs, JWTs), maintain your active cart (e.g. cartId), and handle CSRF protection during checkout. Disabling these will break the ordering experience.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                Functionality &amp; Preference Cookies
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Remember your selected city, delivery landmark, language preferences, and filter settings (e.g., pure-veg toggle, sort by rating) between visits.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                Performance &amp; Analytics Cookies
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Collect aggregated, anonymized metrics on page loading speed, most-visited restaurant categories, and checkout drop-off rates so we can continually optimize app performance.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Cookie Inventory Table */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <Info className="w-5 h-5 text-red-600" />
            <h2>2. Specific Platform Storage Keys</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border border-slate-200 rounded-xl overflow-hidden text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Key / Cookie Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Purpose</th>
                  <th className="p-3">Lifespan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-3 font-mono font-medium text-slate-900">token / auth_jwt</td>
                  <td className="p-3">Necessary</td>
                  <td className="p-3">Secure encrypted user login session</td>
                  <td className="p-3">30 Days</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-medium text-slate-900">cartId</td>
                  <td className="p-3">Necessary</td>
                  <td className="p-3">Synchronizes dishes added to shopping cart</td>
                  <td className="p-3">7 Days</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-medium text-slate-900">userLocation</td>
                  <td className="p-3">Functional</td>
                  <td className="p-3">Remembers delivery neighborhood for nearby dishes</td>
                  <td className="p-3">Persistent</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-medium text-slate-900">theme / dark_mode</td>
                  <td className="p-3">Preference</td>
                  <td className="p-3">Saves light or dark theme display preferences</td>
                  <td className="p-3">1 Year</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. Managing Cookies */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <Settings className="w-5 h-5 text-red-600" />
            <h2>3. How to Manage or Disable Cookies</h2>
          </div>
          <p className="text-slate-700">
            You can configure your browser to block or alert you about cookies:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-slate-700">
            <li><strong>Google Chrome:</strong> Settings → Privacy and Security → Cookies and other site data.</li>
            <li><strong>Mozilla Firefox:</strong> Options → Privacy &amp; Security → Cookies and Site Data.</li>
            <li><strong>Apple Safari:</strong> Preferences → Privacy → Block all cookies.</li>
            <li><strong>Microsoft Edge:</strong> Settings → Cookies and site permissions.</li>
          </ul>
          <p className="text-xs sm:text-sm text-slate-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
            Note: Disabling strictly necessary cookies or local storage will prevent user login and cart persistence on Ruchi Bazaar.
          </p>
        </section>
      </div>
    </LegalPageLayout>
  );
}
