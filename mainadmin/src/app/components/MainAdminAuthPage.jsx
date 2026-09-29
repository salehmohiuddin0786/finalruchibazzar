"use client";

import Link from "next/link";
import { ShieldCheck, Utensils } from "lucide-react";

export function MainAdminAuthPage({ title, subtitle, children, footerText, footerHref, footerLabel }) {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-[1fr_520px]">
        <section className="relative hidden overflow-hidden lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(34,197,94,0.28),transparent_34%),radial-gradient(circle_at_75%_30%,rgba(249,115,22,0.22),transparent_30%),linear-gradient(135deg,#020617_0%,#111827_48%,#3f1212_100%)]" />
          <div className="relative flex h-full flex-col justify-between p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-slate-950">
                <Utensils className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-bold">Ruchi Bazaar</p>
                <p className="text-sm text-white/60">Main Admin Control</p>
              </div>
            </div>

            <div className="max-w-xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-white/80">
                <ShieldCheck className="h-4 w-4" />
                Secure platform access
              </div>
              <h1 className="text-5xl font-bold leading-tight tracking-normal">
                Manage restaurants, orders, payouts, fraud and support from one command center.
              </h1>
              <p className="mt-5 text-base leading-7 text-white/68">
                Built for operational work: approvals, finance checks, delivery visibility, customer controls, and audit history.
              </p>
            </div>

            <p className="text-sm text-white/45">Main admin sessions are role checked by the backend.</p>
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-8 sm:px-6">
          <div className="w-full max-w-md rounded-lg border border-white/10 bg-white p-6 text-slate-950 shadow-2xl sm:p-8">
            <div className="mb-7">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-950 text-white">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>
            </div>

            {children}

            <p className="mt-6 text-center text-sm text-slate-500">
              {footerText}{" "}
              <Link href={footerHref} className="font-semibold text-slate-950 hover:underline">
                {footerLabel}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
