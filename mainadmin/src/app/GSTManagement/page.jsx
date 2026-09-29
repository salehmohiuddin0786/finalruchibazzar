"use client";

import { useMemo, useState } from "react";
import {
  Calculator,
  Download,
  FileSpreadsheet,
  ReceiptText,
  Settings2,
  ShieldCheck,
  Building2,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  IndianRupee,
  Percent,
  FileText,
  Banknote,
  RefreshCw
} from "lucide-react";
import { AdminFeaturePage } from "../components/AdminFeaturePage";
import { money, parseCurrency } from "../data/mainAdmin";
import { useMainAdminData } from "../lib/useMainAdminData";

const downloadCsv = (rows) => {
  const headers = [
    "Restaurant",
    "GSTIN",
    "GST Enabled",
    "GST Percentage",
    "GST Type",
    "Tax Category",
    "Monthly GST",
    "Pending Settlement",
    "Status",
  ];
  const lines = rows.map((row) =>
    [
      row.restaurant,
      row.gstin,
      row.gstEnabled,
      row.gst,
      row.gstType,
      row.taxCategory,
      row.monthlyTax,
      row.pendingSettlement,
      row.status,
    ]
      .map((field) => `"${String(field ?? "").replace(/"/g, '""')}"`)
      .join(",")
  );
  const blob = new Blob([[headers.join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "gst-report.csv";
  link.click();
  URL.revokeObjectURL(url);
};

export default function GSTManagement() {
  const { rows, data, loading, error, refresh } = useMainAdminData("/mainadmin/gst");
  const [config, setConfig] = useState({
    gstEnabled: "Yes",
    gstPercentage: "5",
    gstType: "Exclusive",
    restaurantGstin: "",
    taxCategory: "Food",
  });
  const [calculation, setCalculation] = useState({
    foodAmount: 500,
    deliveryFee: 30,
    platformFee: 10,
  });

  const selectedGstin = config.restaurantGstin || rows.find((row) => row.gstin && row.gstin !== "Not submitted")?.gstin || "Auto saved";
  const gstRate = Number(config.gstPercentage) || 0;
  const foodAmount = Number(calculation.foodAmount) || 0;
  const deliveryFee = Number(calculation.deliveryFee) || 0;
  const platformFee = Number(calculation.platformFee) || 0;
  const gstAmount =
    config.gstEnabled === "Yes"
      ? config.gstType === "Inclusive"
        ? foodAmount - foodAmount / (1 + gstRate / 100)
        : foodAmount * (gstRate / 100)
      : 0;
  const totalAmount =
    config.gstType === "Inclusive"
      ? foodAmount + deliveryFee + platformFee
      : foodAmount + gstAmount + deliveryFee + platformFee;

  const computedSummary = useMemo(() => {
    const totalGst = rows.reduce((sum, row) => sum + parseCurrency(row.monthlyTax), 0);
    const pending = rows.reduce((sum, row) => sum + parseCurrency(row.pendingSettlement), 0);
    return {
      totalGstCollected: data?.summary?.totalGstCollected ?? money(totalGst),
      gstCollectedToday: data?.summary?.gstCollectedToday ?? money(0),
      gstCollectedThisMonth: data?.summary?.gstCollectedThisMonth ?? money(totalGst),
      gstPendingSettlement: data?.summary?.gstPendingSettlement ?? money(pending),
    };
  }, [data, rows]);

  // Calculate GST compliance rate
  const verifiedCount = rows.filter(row => row.status === "Verified").length;
  const pendingCount = rows.filter(row => row.status === "Pending").length;
  const complianceRate = rows.length > 0 ? Math.round((verifiedCount / rows.length) * 100) : 0;

  const stats = [
    { 
      label: "Total GST Collected", 
      value: computedSummary.totalGstCollected, 
      change: `${complianceRate}% compliance`,
      icon: ReceiptText,
      gradient: "from-blue-500 to-blue-600"
    },
    { 
      label: "GST Collected Today", 
      value: computedSummary.gstCollectedToday, 
      change: "Today's collection",
      icon: ShieldCheck,
      gradient: "from-emerald-500 to-emerald-600"
    },
    { 
      label: "GST Collected This Month", 
      value: computedSummary.gstCollectedThisMonth, 
      change: "Monthly total",
      icon: FileSpreadsheet,
      gradient: "from-purple-500 to-purple-600"
    },
    { 
      label: "GST Pending Settlement", 
      value: computedSummary.gstPendingSettlement, 
      change: `${pendingCount} restaurants pending`,
      icon: Download,
      gradient: "from-amber-500 to-amber-600"
    },
  ];

  // Enhanced columns with custom rendering
  const enhancedColumns = [
    { 
      key: "restaurant", 
      label: "Restaurant",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-semibold text-white">
            {row.restaurant?.charAt(0) || "R"}
          </div>
          <div>
            <p className="font-medium text-slate-900">{row.restaurant}</p>
            <p className="text-xs text-slate-500">ID: {String(row.id || "").slice(-6) || "N/A"}</p>
          </div>
        </div>
      )
    },
    { 
      key: "gstin", 
      label: "GSTIN",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5 text-slate-400" />
          <span className="font-mono text-xs text-slate-700">{row.gstin || "Not submitted"}</span>
        </div>
      )
    },
    { 
      key: "gstEnabled", 
      label: "Enabled",
      render: (row) => (
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
          row.gstEnabled === "Yes" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
        }`}>
          {row.gstEnabled === "Yes" ? "Active" : "Inactive"}
        </span>
      )
    },
    { 
      key: "gst", 
      label: "GST %",
      render: (row) => (
        <div className="flex items-center gap-1">
          <Percent className="h-3 w-3 text-slate-400" />
          <span className="font-medium text-slate-700">{row.gst}%</span>
        </div>
      )
    },
    { 
      key: "gstType", 
      label: "Type",
      render: (row) => (
        <span className="text-sm text-slate-700">{row.gstType}</span>
      )
    },
    { 
      key: "taxCategory", 
      label: "Category",
      render: (row) => {
        const categoryColors = {
          Food: "bg-emerald-100 text-emerald-700",
          Beverage: "bg-blue-100 text-blue-700",
          Service: "bg-purple-100 text-purple-700"
        };
        const colorClass = categoryColors[row.taxCategory] || "bg-slate-100 text-slate-700";
        return (
          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${colorClass}`}>
            {row.taxCategory}
          </span>
        );
      }
    },
    { 
      key: "monthlyTax", 
      label: "Monthly GST",
      render: (row) => (
        <div className="flex items-center gap-1">
          <IndianRupee className="h-3.5 w-3.5 text-emerald-500" />
          <span className="font-semibold text-emerald-600">{row.monthlyTax}</span>
        </div>
      )
    },
    { 
      key: "status", 
      label: "Status", 
      badge: true,
      render: (row) => {
        const statusConfig = {
          Verified: { color: "emerald", icon: CheckCircle2, label: "Verified" },
          Pending: { color: "amber", icon: Clock, label: "Pending" }
        };
        const config = statusConfig[row.status] || statusConfig.Pending;
        const StatusIcon = config.icon;
        
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium bg-${config.color}-50 text-${config.color}-700`}>
            <StatusIcon className="h-3 w-3" />
            {config.label}
          </span>
        );
      }
    },
  ];

  // GST Summary Cards
  const GSTSummary = () => {
    if (loading || rows.length === 0) return null;

    const averageGstRate = rows.reduce((sum, row) => sum + Number(row.gst || 0), 0) / (rows.length || 1);

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50/50 to-white p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-100 p-2">
              <Building2 className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">Registered Restaurants</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-600">{rows.length}</p>
          <p className="text-xs text-slate-500">{verifiedCount} with verified GSTIN</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-emerald-50/50 to-white p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-emerald-100 p-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Compliance Rate</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-600">{complianceRate}%</p>
          <p className="text-xs text-slate-500">GST compliant restaurants</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-purple-50/50 to-white p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-purple-100 p-2">
              <Percent className="h-4 w-4 text-purple-600" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-purple-600">Avg. GST Rate</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-purple-600">{averageGstRate.toFixed(1)}%</p>
          <p className="text-xs text-slate-500">Across all restaurants</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-amber-50/50 to-white p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-amber-100 p-2">
              <TrendingUp className="h-4 w-4 text-amber-600" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-amber-600">Monthly Trend</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-600">{computedSummary.gstCollectedThisMonth}</p>
          <p className="text-xs text-slate-500">vs last month</p>
        </div>
      </div>
    );
  };

  // GST Configuration Card
  const GSTConfiguration = () => {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-2">
                <Settings2 className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Restaurant GST Configuration</h2>
                <p className="text-xs text-slate-500">Set the tax behavior for restaurant orders</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => downloadCsv(rows)}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>
        <div className="p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <ShieldCheck className="h-3 w-3" />
                GST Enabled
              </label>
              <select
                value={config.gstEnabled}
                onChange={(event) => setConfig((current) => ({ ...current, gstEnabled: event.target.value }))}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
              >
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <Percent className="h-3 w-3" />
                GST Percentage
              </label>
              <select
                value={config.gstPercentage}
                onChange={(event) => setConfig((current) => ({ ...current, gstPercentage: event.target.value }))}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
              >
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <Calculator className="h-3 w-3" />
                GST Type
              </label>
              <select
                value={config.gstType}
                onChange={(event) => setConfig((current) => ({ ...current, gstType: event.target.value }))}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
              >
                <option>Exclusive</option>
                <option>Inclusive</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <FileText className="h-3 w-3" />
                Tax Category
              </label>
              <select
                value={config.taxCategory}
                onChange={(event) => setConfig((current) => ({ ...current, taxCategory: event.target.value }))}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
              >
                <option>Food</option>
                <option>Beverage</option>
                <option>Service</option>
              </select>
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <Building2 className="h-3 w-3" />
                Restaurant GSTIN
              </label>
              <div className="relative">
                <input
                  value={selectedGstin}
                  onChange={(event) => setConfig((current) => ({ ...current, restaurantGstin: event.target.value }))}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-sm text-slate-600 outline-none transition-all focus:border-slate-400 focus:bg-white focus:ring-1 focus:ring-slate-400"
                  placeholder="Enter GSTIN number"
                />
                {selectedGstin !== "Auto saved" && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-400">Sample GSTIN: 22AAAAA0000A1Z</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // GST Calculator Card
  const GSTCalculator = () => {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 p-2">
              <Calculator className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Automatic GST Calculation</h2>
              <p className="text-xs text-slate-500">Real-time tax calculation based on order values</p>
            </div>
          </div>
        </div>
        <div className="p-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Food Amount</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  min="0"
                  value={calculation.foodAmount}
                  onChange={(event) => setCalculation((current) => ({ ...current, foodAmount: event.target.value }))}
                  className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2.5 text-sm outline-none transition-all focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Delivery Fee</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  min="0"
                  value={calculation.deliveryFee}
                  onChange={(event) => setCalculation((current) => ({ ...current, deliveryFee: event.target.value }))}
                  className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2.5 text-sm outline-none transition-all focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Platform Fee</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  min="0"
                  value={calculation.platformFee}
                  onChange={(event) => setCalculation((current) => ({ ...current, platformFee: event.target.value }))}
                  className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2.5 text-sm outline-none transition-all focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                />
              </div>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white">
            <div className="divide-y divide-slate-100">
              <div className="flex items-center justify-between p-4">
                <span className="text-sm text-slate-600">Food Amount</span>
                <span className="font-semibold text-slate-900">{money(foodAmount)}</span>
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">GST ({gstRate}%)</span>
                  <span className={`text-xs ${config.gstType === "Inclusive" ? "text-amber-600" : "text-emerald-600"}`}>
                    ({config.gstType})
                  </span>
                </div>
                <span className="font-semibold text-emerald-600">{money(gstAmount)}</span>
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="text-sm text-slate-600">Delivery Fee</span>
                <span className="font-semibold text-slate-900">{money(deliveryFee)}</span>
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="text-sm text-slate-600">Platform Fee</span>
                <span className="font-semibold text-slate-900">{money(platformFee)}</span>
              </div>
              <div className="flex items-center justify-between rounded-b-xl bg-gradient-to-r from-slate-100 to-slate-50 p-4">
                <span className="text-base font-bold text-slate-900">Total Amount</span>
                <span className="text-xl font-bold text-emerald-600">{money(totalAmount)}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-blue-50 p-3">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <p className="text-xs text-blue-700">
              Tax invoice values are calculated from food amount, GST setup ({gstRate}% {config.gstType.toLowerCase()}), delivery fee, and platform fee.
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Quick Stats Bar
  const QuickStatsBar = () => {
    if (loading || rows.length === 0) return null;

    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm p-3">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-slate-100 p-2">
            <ReceiptText className="h-4 w-4 text-slate-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">GST Summary</p>
            <p className="text-xs text-slate-500">
              {verifiedCount} verified • {pendingCount} pending • {complianceRate}% compliant
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={refresh}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-all hover:bg-slate-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50">
      <AdminFeaturePage
        title="GST Management"
        description="GST dashboard, restaurant tax setup, report downloads, and automatic order GST calculation."
        primaryAction="Download Reports"
        stats={stats}
        rows={rows}
        filters={["All", "Verified", "Pending"]}
        columns={enhancedColumns}
        loading={loading}
        error={error}
        onRefresh={refresh}
      >
        {/* Analytics Section */}
        {!loading && rows.length > 0 && (
          <div className="space-y-4">
            <GSTSummary />
            <QuickStatsBar />
            <div className="grid gap-6 xl:grid-cols-2">
              <GSTConfiguration />
              <GSTCalculator />
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && rows.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
            <div className="mb-4 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 p-4">
              <ReceiptText className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">No GST records found</h3>
            <p className="mt-1 text-sm text-slate-500">GST data will appear here once restaurants are onboarded.</p>
            <button
              onClick={refresh}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg"
            >
              Refresh
            </button>
          </div>
        )}
      </AdminFeaturePage>
    </div>
  );
}
