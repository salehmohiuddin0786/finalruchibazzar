"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Phone, ShieldCheck, AlertCircle, Loader, LogOut } from "lucide-react";

export default function PhoneVerificationModal() {
  const { user, updateUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    (typeof window !== "undefined" && window.location.hostname.includes("ruchibazaar.in")
      ? "https://api.ruchibazaar.in/api"
      : "http://localhost:7000/api");

  const isInvalidPhone = (phone) => {
    if (!phone) return true;
    const clean = String(phone).replace(/\D/g, "");
    return clean.length !== 10 || !/^[6-9]\d{9}$/.test(clean);
  };

  useEffect(() => {
    if (!user) {
      setIsOpen(false);
      return;
    }

    // Only customers need mobile verification
    if (user.role && user.role !== "customer") {
      setIsOpen(false);
      return;
    }

    // Check if user is missing phone or has fake placeholder phone
    if (user.needsPhone || isInvalidPhone(user.phone)) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const clean = phoneNumber.replace(/\D/g, "");
    if (clean.length !== 10 || !/^[6-9]\d{9}$/.test(clean)) {
      setError("Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9)");
      return;
    }

    setLoading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch(`${apiUrl}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ phone: clean }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update mobile number");
      }

      if (updateUser) {
        updateUser({ phone: clean, needsPhone: false });
      } else if (typeof window !== "undefined") {
        const stored = localStorage.getItem("user");
        if (stored) {
          const parsed = JSON.parse(stored);
          localStorage.setItem("user", JSON.stringify({ ...parsed, phone: clean, needsPhone: false }));
        }
      }

      setIsOpen(false);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-orange-100 text-center relative animate-scaleUp">
        {/* Header Icon */}
        <div className="w-16 h-16 bg-gradient-to-tr from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/20 text-white">
          <Phone className="w-8 h-8" />
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Mobile Number Required
        </h3>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          Please enter your active 10-digit mobile number to complete your profile, receive live order updates, and delivery OTP.
        </p>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="flex rounded-2xl border border-gray-300 overflow-hidden focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200 transition-all">
              <span className="inline-flex items-center px-4 bg-gray-50 border-r border-gray-300 text-gray-600 font-semibold text-sm select-none">
                🇮🇳 +91
              </span>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={phoneNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setPhoneNumber(val);
                  setError("");
                }}
                placeholder="Enter 10-digit number"
                className="w-full px-4 py-3.5 text-gray-900 font-medium text-base outline-none tracking-wider placeholder:tracking-normal placeholder:font-normal"
                autoFocus
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || phoneNumber.length !== 10}
            className="w-full py-3.5 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Saving Number...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>Save & Continue</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center">
          <button
            type="button"
            onClick={() => {
              if (logout) logout();
              else {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.reload();
              }
            }}
            className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign in with another account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
