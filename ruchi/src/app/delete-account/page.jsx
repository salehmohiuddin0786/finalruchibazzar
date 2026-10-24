"use client";

import React, { useState } from "react";
import LegalPageLayout from "../components/LegalPageLayout";
import { useAuth } from "../context/AuthContext.jsx";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.ruchibazaar.in/api";
import {
  Trash2,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Info,
  Clock,
  UserCheck,
} from "lucide-react";

export default function DeleteAccountPage() {
  const { user, token, logout, isAuthenticated } = useAuth();
  const [identifier, setIdentifier] = useState(user?.email || user?.phone || "");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  // In-app / authenticated immediate deletion
  const handleImmediateDeletion = async () => {
    if (!confirmed) {
      setError("Please check the confirmation box before deleting your account.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete account");
      }

      setSubmitted(true);
      setTimeout(() => {
        logout();
      }, 2500);
    } catch (err) {
      setError(err.message || "An unexpected error occurred while deleting your account.");
    } finally {
      setLoading(false);
    }
  };

  // Web request deletion (unauthenticated / web form)
  const handleWebRequest = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError("Please provide your registered phone number or email address.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE_URL}/api/users/delete-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier: identifier.trim(), reason }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit request");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Unable to submit deletion request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LegalPageLayout
      title="Delete Account & Data"
      subtitle="Google Play Data Safety & User Privacy: Transparent instructions and tools to permanently delete your Ruchi Bazaar account and personal data."
      badge="USER PRIVACY & COMPLIANCE"
      lastUpdated="October 2026"
    >
      <div className="space-y-8 text-sm sm:text-base leading-relaxed text-slate-700">
        {/* Intro Banner */}
        <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 flex gap-4">
          <Info className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <h3 className="font-bold text-amber-900 text-sm sm:text-base">Your Right to Data Deletion</h3>
            <p className="mt-1 text-amber-800">
              In full compliance with Google Play Store User Data &amp; Account Deletion policies, you have complete control over your account. You can delete your account directly inside the app, from this web page, or by contacting our Data Protection Officer.
            </p>
          </div>
        </div>

        {/* Step-by-Step Data Handling Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-500" /> What Data Is Permanently Deleted
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
              <li>Your personal profile (Full Name, Email address, Phone number).</li>
              <li>Saved delivery addresses and GPS coordinates.</li>
              <li>Authentication tokens, passwords, and linked Google login credentials.</li>
              <li>Active cart items, shopping preferences, and app configurations.</li>
              <li>Support tickets and in-app chat conversations.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" /> Retention &amp; Legal Compliance
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
              <li>Past financial invoices and tax transaction receipts are retained in an anonymized form strictly to satisfy statutory tax obligations under Indian law (GST/Income Tax).</li>
              <li>Account deletion requests submitted via this web form are processed within 24 to 48 business hours.</li>
              <li>In-app deletion is applied immediately upon confirmation.</li>
            </ul>
          </div>
        </div>

        {/* Action Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Account Deletion Request Registered</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Your account and associated personal data are queued for permanent deletion. All active sessions have been terminated.
              </p>
            </div>
          ) : isAuthenticated ? (
            /* Logged in user */
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Instant Account Deletion</span>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                  Delete Account for {user?.name || "Active User"} ({user?.email || user?.phone})
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  This action is permanent and cannot be undone. All your saved addresses, vouchers, and profile information will be wiped immediately.
                </p>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <label className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
                />
                <span className="text-xs sm:text-sm text-slate-700">
                  I understand that deleting my account is irreversible and that all my personal data, saved addresses, and active orders will be deleted.
                </span>
              </label>

              <button
                type="button"
                onClick={handleImmediateDeletion}
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-200 flex items-center justify-center gap-2 transition disabled:opacity-60"
              >
                <Trash2 className="w-4 h-4" />
                {loading ? "Deleting Account..." : "Permanently Delete My Account"}
              </button>
            </div>
          ) : (
            /* Unauthenticated web request form */
            <form onSubmit={handleWebRequest} className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Web Deletion Request</span>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                  Submit an Account Deletion Request
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  If you have uninstalled the app or cannot log in, submit your registered phone or email below to request permanent deletion.
                </p>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Registered Mobile Number or Email Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. +919876543210 or yourname@gmail.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Reason for Deletion (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Let us know how we can improve..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-200 flex items-center justify-center gap-2 transition disabled:opacity-60"
                >
                  <ShieldAlert className="w-4 h-4" />
                  {loading ? "Submitting..." : "Submit Deletion Request"}
                </button>

                <span className="text-xs text-slate-400">
                  Or email directly to{" "}
                  <a href="mailto:privacy@ruchibazaar.in" className="text-rose-600 font-semibold underline">
                    privacy@ruchibazaar.in
                  </a>
                </span>
              </div>
            </form>
          )}
        </div>

        {/* In-app instructions */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <h4 className="font-bold text-slate-900 text-sm">How to delete your account inside the Android App:</h4>
          <ol className="list-decimal pl-5 space-y-1 text-xs sm:text-sm text-slate-600">
            <li>Open the <strong>Ruchi Bazaar</strong> app on your Android device.</li>
            <li>Tap on your <strong>Profile</strong> tab in the bottom navigation bar.</li>
            <li>Scroll down to the <strong>Account Settings &amp; Security</strong> section.</li>
            <li>Tap <strong>Delete Account</strong> and confirm your request.</li>
          </ol>
        </div>
      </div>
    </LegalPageLayout>
  );
}
