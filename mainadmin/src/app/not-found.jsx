"use client";

import Link from "next/link";
import { LayoutDashboard, ArrowLeft, ShieldAlert } from "lucide-react";

export default function SuperadminNotFound() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-8 text-white">
        <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/30">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-red-400 bg-red-950/80 px-2.5 py-1 rounded-full border border-red-800/50">
          Error 404
        </span>
        <h1 className="text-2xl font-bold text-white mt-4 mb-2">
          Management Page Not Found
        </h1>
        <p className="text-sm text-slate-400 mb-6">
          The requested administrative resource, log view, or portal route could not be found.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-all min-h-[44px]"
          >
            <LayoutDashboard className="w-4 h-4" />
            Super Dashboard
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
