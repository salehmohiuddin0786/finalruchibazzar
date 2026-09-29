"use client";

import {
  AlertTriangle,
  ArrowRight,
  ClipboardCheck,
  FileBarChart,
  RefreshCw,
  ShieldAlert,
  TrendingUp,
  Users,
  Store,
  ShoppingBag,
  CreditCard,
  FileText,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import SuperLayout from "../SuperLayout/page";
import { StatusBadge } from "../components/AdminFeaturePage";
import { useMainAdminData } from "../lib/useMainAdminData";

// Helper to get icon based on stat label
const getStatIcon = (label) => {
  if (label.includes("Restaurant")) return Store;
  if (label.includes("Customer")) return Users;
  if (label.includes("Delivery")) return Users;
  if (label.includes("Order")) return ShoppingBag;
  if (label.includes("Payout")) return CreditCard;
  if (label.includes("GST")) return FileText;
  if (label.includes("Fraud")) return ShieldAlert;
  if (label.includes("Support")) return AlertCircle;
  return TrendingUp;
};

const cardGradients = [
  "from-blue-500 to-blue-600",
  "from-emerald-500 to-emerald-600",
  "from-amber-500 to-amber-600",
  "from-rose-500 to-rose-600",
  "from-violet-500 to-violet-600",
  "from-cyan-500 to-cyan-600",
];

export default function SuperDashboard() {
  const { data, loading, error, refresh } = useMainAdminData("/mainadmin/dashboard");
  const stats = data?.stats || [];
  const actions = data?.actions || [];
  const restaurants = data?.restaurantApplications || [];
  const auditLogs = data?.auditLogs || [];

  return (
    <SuperLayout>
      <div className="min-w-0 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 rounded-full bg-gradient-to-b from-blue-600 to-cyan-600" />
              <h1 className="break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl xl:text-4xl bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                Main Admin Dashboard
              </h1>
            </div>
            <p className="mt-2 max-w-3xl text-sm text-slate-500 leading-relaxed">
              Live backend overview for restaurants, customers, delivery partners, orders, payouts, GST, fraud, support, and audit history.
            </p>
          </div>
          <button
            onClick={refresh}
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 hover:shadow-md disabled:opacity-60 active:scale-95 sm:w-auto"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="animate-in slide-in-from-top-2 fade-in-0 duration-200 rounded-xl border border-rose-100 bg-gradient-to-r from-rose-50 to-white px-5 py-3.5 text-sm text-rose-700 shadow-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {stats.map((stat, index) => {
            const Icon = getStatIcon(stat.label);
            const gradient = cardGradients[index % cardGradients.length];
            return (
              <div
                key={stat.label}
                className="group relative min-w-0 overflow-hidden rounded-xl bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 border border-slate-100 sm:p-5"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                {/* Animated gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
                
                {/* Decorative circle */}
                <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-gradient-to-br from-slate-100 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                
                <div className="relative z-10">
                  <div className={`inline-flex rounded-xl p-2.5 bg-gradient-to-br ${gradient} shadow-lg`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <p className="mt-3 break-words text-xs font-semibold uppercase tracking-wide text-slate-500">{stat.label}</p>
                  <p className="mt-1 break-words text-2xl font-bold text-slate-900">{stat.value}</p>
                  {stat.change && (
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5">
                      <TrendingUp className="h-3 w-3 text-emerald-600" />
                      <span className="text-xs font-semibold text-emerald-700">{stat.change}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Action Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {actions.map((action, index) => {
            const icons = [ClipboardCheck, ShieldAlert, FileBarChart];
            const Icon = icons[index % icons.length];
            const gradients = ["from-blue-600 to-indigo-600", "from-amber-600 to-orange-600", "from-emerald-600 to-teal-600"];
            
            return (
              <Link
                key={action.href}
                href={action.href}
                className="group relative min-w-0 overflow-hidden rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index]} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
                <div className="relative z-10 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                    <div className={`rounded-xl bg-gradient-to-br ${gradients[index]} p-2.5 shadow-md`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="break-words font-bold text-slate-900">{action.label}</p>
                      <p className="break-words text-2xl font-bold text-slate-700">{action.count}</p>
                    </div>
                  </div>
                  <div className="rounded-full bg-slate-100 p-2 transition-all group-hover:bg-white group-hover:shadow-md">
                    <ArrowRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Two Column Layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Restaurant Approval Queue */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
            <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white px-4 py-4 sm:px-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Restaurant Approval Queue</h2>
                  <p className="text-sm text-slate-500">Latest restaurant registrations pending review</p>
                </div>
                {restaurants.length > 0 && (
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                    {restaurants.length} pending
                  </span>
                )}
              </div>
            </div>
            <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
              {restaurants.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-emerald-50 p-3 mb-3">
                    <ClipboardCheck className="h-6 w-6 text-emerald-600" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">All caught up!</p>
                  <p className="text-xs text-slate-400">No pending restaurant applications</p>
                </div>
              ) : (
                restaurants.map((restaurant, idx) => (
                  <div 
                    key={restaurant.id} 
                    className="flex min-w-0 items-start justify-between gap-4 p-4 transition-all hover:bg-slate-50/80 group"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="break-words font-semibold text-slate-900">{restaurant.name}</p>
                      </div>
                      <p className="mt-1 break-words text-sm text-slate-500">
                        {restaurant.city} • {restaurant.documents}
                      </p>
                    </div>
                    <StatusBadge value={restaurant.status} />
                  </div>
                ))
              )}
            </div>
            {restaurants.length > 0 && (
              <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-3">
                <Link
                  href="/ManageVendors"
                  className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition-all hover:gap-2"
                >
                  View all applications
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Latest Audit Logs */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
            <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white px-4 py-4 sm:px-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Latest Audit Logs</h2>
                  <p className="text-sm text-slate-500">Recent admin activity and system events</p>
                </div>
                <ShieldAlert className="h-5 w-5 text-slate-400" />
              </div>
            </div>
            <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
              {auditLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-slate-100 p-3 mb-3">
                    <AlertTriangle className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">No audit logs available</p>
                  <p className="text-xs text-slate-400">System events will appear here</p>
                </div>
              ) : (
                auditLogs.slice(0, 8).map((log, idx) => (
                  <div 
                    key={log.id} 
                    className="flex min-w-0 items-start gap-4 p-4 transition-all hover:bg-slate-50/80"
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="rounded-lg bg-slate-100 p-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-slate-500" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="break-words font-medium text-slate-900">{log.action}</p>
                        <span className="text-xs text-slate-400 sm:whitespace-nowrap">{log.time}</span>
                      </div>
                      <p className="mt-0.5 break-words text-sm text-slate-500">
                        by <span className="font-medium text-slate-700">{log.admin}</span>
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            {auditLogs.length > 0 && (
              <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-3">
                <Link
                  href="/AuditLogs"
                  className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition-all hover:gap-2"
                >
                  View full audit trail
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </SuperLayout>
  );
}
