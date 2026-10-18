"use client";

import Link from "next/link";
import { LayoutDashboard, ArrowLeft, Bike } from "lucide-react";

export default function DeliveryNotFound() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-8 text-white">
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
          <Bike className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800/50">
          Error 404
        </span>
        <h1 className="text-2xl font-bold text-white mt-4 mb-2">
          Rider Route Not Found
        </h1>
        <p className="text-sm text-slate-400 mb-6">
          The delivery route, active trip details, or order page you were searching for does not exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all min-h-[44px]"
          >
            <LayoutDashboard className="w-4 h-4" />
            Rider Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-sm font-semibold transition-all min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
