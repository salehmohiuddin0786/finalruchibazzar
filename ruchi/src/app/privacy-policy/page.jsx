import React from "react";
import LegalPageLayout from "../components/LegalPageLayout";
import { Shield, Lock, Eye, Server, UserCheck, FileCheck, PhoneCall, Cookie } from "lucide-react";

export const metadata = {
  title: "Privacy Policy",
  description: "Learn how Ruchi Bazaar collects, uses, protects, and handles your personal data, location, and payment information.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      subtitle="Your privacy is critical to us. Discover how Ruchi Bazaar safeguards your personal information, delivery data, and digital footprint."
      badge="PRIVACY & DATA PROTECTION"
      lastUpdated="September 2026"
    >
      <div className="space-y-8 text-sm sm:text-base leading-relaxed">
        {/* Intro */}
        <section className="bg-red-50/60 border border-red-100 rounded-xl p-5 text-slate-800">
          <p className="font-medium text-slate-900 mb-2">Commitment to Your Privacy</p>
          <p className="text-slate-700">
            Ruchi Bazaar (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the Ruchi Bazaar food and grocery delivery platform. 
            This Privacy Policy explains how we collect, store, process, and protect your information when you access or use our customer web 
            application, mobile applications, and associated services.
          </p>
        </section>

        {/* 1. Data We Collect */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <Shield className="w-5 h-5 text-red-600" />
            <h2>1. Customer Data We Collect</h2>
          </div>
          <p className="text-slate-700">
            To provide lightning-fast, seamless deliveries and maintain platform safety, we collect the following categories of information:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Phone Number &amp; OTP Authentication
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Your mobile phone number is used for primary account creation, secure one-time password (OTP) verification, order confirmations, and delivery updates.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                Personal &amp; Contact Details
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Full name, email address, secondary contact numbers, saved delivery addresses (home, office, other), and landmark specifications.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Location &amp; Delivery Tracking
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Precise GPS location data and IP geolocation to show nearby restaurants, accurate delivery times, optimal routing, and live rider tracking.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Payment Information
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Payment preferences (UPI IDs, card brands, netbanking options). Note: Full credit/debit card numbers and CVVs are processed directly by RBI-certified payment gateways and are never stored on our servers.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Cookies */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <Cookie className="w-5 h-5 text-red-600" />
            <h2>2. Cookies and Tracking Technologies</h2>
          </div>
          <p className="text-slate-700">
            We use essential cookies, browser local storage, and session tokens to:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-slate-700">
            <li>Keep you securely authenticated across sessions without repeated logins.</li>
            <li>Retain items in your active shopping cart even if you refresh or switch tabs.</li>
            <li>Remember selected delivery locations and search preferences.</li>
            <li>Analyze traffic, detect errors, and enhance user experience.</li>
          </ul>
        </section>

        {/* 3. Storage and Usage */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <Server className="w-5 h-5 text-red-600" />
            <h2>3. How Data is Stored &amp; Used</h2>
          </div>
          <p className="text-slate-700">
            We apply industry-standard AES-256 encryption at rest and TLS 1.3 encryption in transit. Your data is used strictly for:
          </p>
          <div className="space-y-2">
            <div className="flex items-start gap-2.5">
              <FileCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span><strong>Order Fulfillment:</strong> Communicating your items and delivery address to partner restaurants and delivery riders.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <FileCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span><strong>Service Notifications:</strong> Sending automated order receipts, live status alerts, dispatch messages, and refund notices.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <FileCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span><strong>Fraud Prevention &amp; Safety:</strong> Verifying identities, detecting fraudulent orders, and preventing account takeovers.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <FileCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span><strong>Customer Support:</strong> Resolving order disputes, missing items, cancellations, and quality complaints.</span>
            </div>
          </div>
        </section>

        {/* 4. Third-Party Sharing */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <Lock className="w-5 h-5 text-red-600" />
            <h2>4. Third-Party Service Providers</h2>
          </div>
          <p className="text-slate-700">
            We do not sell, rent, or trade your personal data. We share only necessary data with trusted third parties:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-slate-700">
            <li><strong>Restaurant Partners:</strong> Receive order contents, recipient first name, and cooking instructions.</li>
            <li><strong>Delivery Partners:</strong> Receive delivery address, contact phone number, and location coordinates to complete the drop-off.</li>
            <li><strong>Payment Gateways:</strong> Encrypted transaction processing via RBI-compliant aggregators.</li>
            <li><strong>Cloud &amp; Infrastructure:</strong> Encrypted databases and secure content delivery networks.</li>
          </ul>
        </section>

        {/* 5. User Rights */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <UserCheck className="w-5 h-5 text-red-600" />
            <h2>5. Your Rights &amp; Choices</h2>
          </div>
          <p className="text-slate-700">You have full control over your personal data:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong>Right to Access &amp; Portability:</strong> Request an export of your stored personal profile and order history.
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong>Right to Correction:</strong> Update or edit your name, address book, and contact info at any time in Profile Settings.
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong>Right to Erasure:</strong> Request the deletion of your account and personal identifiers, subject to statutory tax and financial retention laws.
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong>Opt-out of Marketing:</strong> Unsubscribe from promotional SMS and email communications at any time.
            </div>
          </div>
        </section>

        {/* 6. Contact & Grievance */}
        <section className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-red-600" />
            6. Contact Our Data Protection Team
          </h2>
          <p className="text-slate-700">
            For questions regarding this policy or to exercise your privacy rights, contact our Data Protection Officer:
          </p>
          <div className="text-xs sm:text-sm text-slate-700 space-y-1 pt-1">
            <p><strong>Email:</strong> privacy@ruchibazaar.in</p>
            <p><strong>Grievance Desk:</strong> grievance@ruchibazaar.in</p>
            <p><strong>Helpline:</strong> 1800-123-456 (9:00 AM – 7:00 PM IST)</p>
          </div>
        </section>
      </div>
    </LegalPageLayout>
  );
}
