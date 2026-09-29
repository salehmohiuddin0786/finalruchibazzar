import React from "react";
import LegalPageLayout from "../components/LegalPageLayout";
import { HeartHandshake, Eye, CheckCircle2, ShieldCheck, Mail, Keyboard, Smartphone } from "lucide-react";

export const metadata = {
  title: "Accessibility Statement",
  description: "Ruchi Bazaar commitment to digital accessibility, WCAG 2.1 Level AA compliance, and accessible food ordering for all users.",
};

export default function AccessibilityPage() {
  return (
    <LegalPageLayout
      title="Accessibility Statement"
      subtitle="Ensuring our digital food and grocery shopping experience is universally accessible to all individuals, including people with disabilities."
      badge="INCLUSIVITY & ACCESSIBILITY"
      lastUpdated="September 2026"
    >
      <div className="space-y-8 text-sm sm:text-base leading-relaxed">
        {/* Commitment Banner */}
        <section className="bg-red-50/70 border border-red-200 rounded-xl p-5 text-slate-800">
          <div className="flex items-center gap-2 font-bold mb-1 text-slate-900">
            <HeartHandshake className="w-5 h-5 text-red-600" />
            <span>Universal Access for Every Customer</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700">
            Ruchi Bazaar believes that delicious food and daily essentials should be effortlessly accessible to everyone. 
            We strive to conform to the <strong>Web Content Accessibility Guidelines (WCAG) 2.1, Level AA standards</strong> across our web and mobile applications.
          </p>
        </section>

        {/* Accessibility Features */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <Eye className="w-5 h-5 text-red-600" />
            <h2>Accessibility Implementations</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-2 font-semibold text-slate-900 mb-1.5">
                <Keyboard className="w-4 h-4 text-emerald-600" />
                <h3>Keyboard Navigation</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                All buttons, links, search inputs, modal dialogs, and checkout flows are fully navigable via standard keyboard controls (Tab, Enter, Space, Escape, Arrow keys) with visible focus indicators.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-2 font-semibold text-slate-900 mb-1.5">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <h3>Screen Reader Optimization</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                Semantic HTML elements (nav, main, header, article, section) and descriptive ARIA labels ensure screen readers (NVDA, JAWS, VoiceOver, TalkBack) announce buttons, dish prices, and cart counts accurately.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-2 font-semibold text-slate-900 mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3>High Contrast &amp; Legibility</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                Text and interactive elements meet or exceed WCAG AA contrast ratio thresholds (at least 4.5:1 for normal text), ensuring readability under varying lighting conditions.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-2 font-semibold text-slate-900 mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3>Responsive Zoom &amp; Scaling</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                Users can zoom text up to 200% on desktop browsers and mobile devices without loss of functionality, broken layouts, or truncated checkout buttons.
              </p>
            </div>
          </div>
        </section>

        {/* Continuous Audits */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <ShieldCheck className="w-5 h-5 text-red-600" />
            <h2>Continuous Improvement &amp; Testing</h2>
          </div>
          <p className="text-slate-700">
            Our engineering team conducts regular automated and manual accessibility audits using Lighthouse, axe Core, and assistive screen reader technology to eliminate barriers and optimize user flows for everyone.
          </p>
        </section>

        {/* Feedback Channel */}
        <section className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 space-y-2">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Mail className="w-4 h-4 text-red-600" />
            Accessibility Feedback &amp; Assistance
          </h3>
          <p className="text-xs sm:text-sm text-slate-700">
            Encountered an accessibility barrier on our website or app? We welcome your feedback and will work quickly to assist you:
          </p>
          <div className="text-xs sm:text-sm text-slate-700 space-y-1 pt-1">
            <p><strong>Email:</strong> accessibility@ruchibazaar.in</p>
            <p><strong>Toll-Free Voice Helpline:</strong> 1800-123-456</p>
          </div>
        </section>
      </div>
    </LegalPageLayout>
  );
}
