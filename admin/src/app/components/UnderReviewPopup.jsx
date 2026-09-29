"use client";

import { Clock3, FileCheck2, ShieldCheck, Store, X } from "lucide-react";

const steps = [
  { label: "Application received", icon: Store },
  { label: "Documents in review", icon: FileCheck2 },
  { label: "Approval notification next", icon: ShieldCheck },
];

export default function UnderReviewPopup({
  open,
  onClose,
  title = "Account under review",
  message = "Your restaurant account is being reviewed by our admin team. You can login after approval.",
  primaryLabel = "Okay, got it",
  onPrimary,
  showClose = true,
}) {
  if (!open) return null;

  const handlePrimary = () => {
    if (onPrimary) onPrimary();
    else if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-md">
      <div className="review-pop relative w-full max-w-md overflow-hidden rounded-3xl border border-red-200/20 bg-white text-slate-950 shadow-2xl">
        <div className="h-1.5 bg-gradient-to-r from-red-600 via-amber-400 to-emerald-500" />

        {showClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <div className="p-6 text-center sm:p-8">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 text-red-600 shadow-inner">
            <div className="rounded-2xl bg-white p-4 shadow-sm animate-pulse">
              <Clock3 className="h-9 w-9" />
            </div>
          </div>

          <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-red-500">
            Pending approval
          </p>
          <h2 className="text-2xl font-black tracking-normal text-slate-950">
            {title}
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-600">
            {message}
          </p>

          <div className="mt-6 space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800">{step.label}</p>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-red-500 to-amber-400"
                        style={{ width: `${index === 0 ? 100 : index === 1 ? 68 : 28}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handlePrimary}
            className="mt-6 w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            {primaryLabel}
          </button>
        </div>
      </div>

      <style jsx>{`
        .review-pop {
          animation: review-pop-in 280ms ease-out both;
        }

        @keyframes review-pop-in {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
