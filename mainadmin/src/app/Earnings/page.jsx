"use client";

import { 
  IndianRupee, 
  Store, 
  TrendingUp, 
  Truck, 
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Activity,
  PieChart,
  CreditCard,
  Banknote,
  AlertCircle,
  BarChart3,
  Download,
  Filter
} from "lucide-react";
import { AdminFeaturePage } from "../components/AdminFeaturePage";
import { money, parseCurrency } from "../data/mainAdmin";
import { useMainAdminData } from "../lib/useMainAdminData";

export default function Earnings() {
  const { rows, data, loading, error, refresh } = useMainAdminData("/mainadmin/earnings");
  const summary = data?.summary || {};
  const monthlyTrend = data?.monthlyTrend || [];
  const categoryBreakdown = data?.categoryBreakdown || [];

  // Calculate growth percentages
  const calculateGrowth = (current, previous) => {
    if (!previous || previous === 0) return null;
    const growth = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(growth).toFixed(1),
      isPositive: growth > 0,
      isNegative: growth < 0
    };
  };

  const revenueGrowth = calculateGrowth(summary.totalRevenue, summary.previousRevenue);
  const commissionGrowth = calculateGrowth(summary.platformFee, summary.previousPlatformFee);

  const stats = [
    { 
      label: "Total Revenue", 
      value: money(summary.totalRevenue), 
      change: revenueGrowth ? `${revenueGrowth.isPositive ? "+" : "-"}${revenueGrowth.value}%` : "vs last month",
      icon: IndianRupee,
      gradient: "from-emerald-500 to-emerald-600",
      trend: revenueGrowth?.isPositive ? "up" : revenueGrowth?.isNegative ? "down" : "neutral"
    },
    { 
      label: "Platform Commission", 
      value: money(summary.platformFee), 
      change: commissionGrowth ? `${commissionGrowth.isPositive ? "+" : "-"}${commissionGrowth.value}%` : "platform earnings",
      icon: Wallet,
      gradient: "from-blue-500 to-blue-600",
      trend: commissionGrowth?.isPositive ? "up" : commissionGrowth?.isNegative ? "down" : "neutral"
    },
    { 
      label: "Vendor Payout", 
      value: money(summary.vendorPayout), 
      change: `${summary.vendorCount || 0} active vendors`,
      icon: Store,
      gradient: "from-purple-500 to-purple-600"
    },
    { 
      label: "Delivery Payout", 
      value: money(summary.deliveryPartnerPayout), 
      change: `${summary.deliveryPartnerCount || 0} active partners`,
      icon: Truck,
      gradient: "from-amber-500 to-amber-600"
    },
  ];

  // Enhanced columns with custom rendering
  const enhancedColumns = [
    { 
      key: "id", 
      label: "Transaction ID",
      render: (row) => (
        <div>
          <p className="font-mono text-xs font-medium text-slate-700">{String(row.id || "").slice(-8) || "N/A"}</p>
          <p className="text-[10px] text-slate-400 uppercase">{row.type || "transaction"}</p>
        </div>
      )
    },
    { 
      key: "date", 
      label: "Date",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-sm text-slate-700">{row.date}</span>
        </div>
      )
    },
    { key: "description", label: "Description" },
    { 
      key: "amount", 
      label: "Amount",
      render: (row) => {
        const isNegative = row.amount?.toString().startsWith("-");
        return (
          <div className="flex items-center gap-1">
            {isNegative ? (
              <ArrowDownRight className="h-3.5 w-3.5 text-rose-500" />
            ) : (
              <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
            )}
            <span className={`font-semibold ${isNegative ? "text-rose-600" : "text-emerald-600"}`}>
              {money(row.amount)}
            </span>
          </div>
        );
      }
    },
    { 
      key: "category", 
      label: "Category",
      render: (row) => {
        const categoryColors = {
          "Commission": "bg-blue-100 text-blue-700",
          "Payout": "bg-purple-100 text-purple-700",
          "Refund": "bg-rose-100 text-rose-700",
          "Bonus": "bg-emerald-100 text-emerald-700"
        };
        const colorClass = categoryColors[row.category] || "bg-slate-100 text-slate-700";
        return (
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
            {row.category}
          </span>
        );
      }
    },
    { 
      key: "status", 
      label: "Status", 
      badge: true,
      render: (row) => {
        const statusConfig = {
          Success: { color: "emerald", icon: TrendingUp },
          Pending: { color: "amber", icon: AlertCircle },
          Failed: { color: "rose", icon: AlertCircle }
        };
        const config = statusConfig[row.status] || statusConfig.Pending;
        const StatusIcon = config.icon;
        
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium bg-${config.color}-50 text-${config.color}-700`}>
            <StatusIcon className="h-3 w-3" />
            {row.status}
          </span>
        );
      }
    },
  ];

  // Monthly Trend Chart Component
  const MonthlyTrend = () => {
    if (loading || monthlyTrend.length === 0) return null;

    const maxRevenue = Math.max(...monthlyTrend.map((month) => parseCurrency(month.revenue)), 1);
    
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">Monthly Revenue Trend</h3>
            <p className="text-xs text-slate-500">Last 6 months performance</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5">
            <BarChart3 className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-xs font-medium text-slate-600">vs previous period</span>
          </div>
        </div>
        <div className="flex items-end justify-between gap-2">
          {monthlyTrend.map((month, idx) => {
            const height = (parseCurrency(month.revenue) / maxRevenue) * 100;
            return (
              <div key={idx} className="flex flex-1 flex-col items-center gap-2">
                <div 
                  className="w-full max-w-[60px] rounded-t-lg bg-gradient-to-t from-emerald-500 to-emerald-400 transition-all hover:from-emerald-600 hover:to-emerald-500"
                  style={{ height: `${Math.max(height, 5)}px`, minHeight: "30px" }}
                />
                <div className="text-center">
                  <p className="text-xs font-semibold text-slate-700">{money(month.revenue)}</p>
                  <p className="text-[10px] text-slate-400">{month.month}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Category Breakdown Component
  const CategoryBreakdown = () => {
    if (loading || categoryBreakdown.length === 0) return null;

    const total = categoryBreakdown.reduce((sum, cat) => sum + parseCurrency(cat.value), 0);
    
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">Revenue Breakdown</h3>
            <p className="text-xs text-slate-500">By category</p>
          </div>
          <PieChart className="h-4 w-4 text-slate-400" />
        </div>
        <div className="space-y-3">
          {categoryBreakdown.map((category) => {
            const percentage = total > 0 ? ((parseCurrency(category.value) / total) * 100).toFixed(1) : "0.0";
            return (
              <div key={category.name}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{category.name}</span>
                  <span className="text-xs text-slate-500">{percentage}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="mt-1 text-xs font-semibold text-slate-600">{money(category.value)}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Top Vendors Component with enhanced styling
  const TopVendors = () => {
    const topVendors = data?.topVendors || [];
    if (loading || topVendors.length === 0) return null;

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">Top Performing Vendors</h3>
            <p className="text-xs text-slate-500">Highest revenue contributors</p>
          </div>
          <TrendingUp className="h-4 w-4 text-emerald-500" />
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {topVendors.slice(0, 3).map((vendor, idx) => (
            <div 
              key={vendor.name} 
              className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="absolute right-0 top-0 rounded-bl-xl bg-gradient-to-br from-emerald-100 to-emerald-200 px-2 py-1 text-xs font-bold text-emerald-700">
                #{idx + 1}
              </div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-sm font-bold text-white">
                      {vendor.name?.charAt(0) || "V"}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{vendor.name}</p>
                      <p className="text-xs text-slate-500">{vendor.orders} orders</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-emerald-600">{money(vendor.revenue)}</p>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-slate-500">Commission</span>
                  <span className="font-semibold text-slate-700">{money(vendor.commission)}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                    style={{ width: `${topVendors[0]?.revenue ? (parseCurrency(vendor.revenue) / parseCurrency(topVendors[0].revenue)) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Quick Stats Summary
  const QuickStatsSummary = () => {
    if (loading) return null;
    
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-slate-100 p-2">
              <Activity className="h-4 w-4 text-slate-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Financial Summary</p>
              <p className="text-xs text-slate-500">
                Total Transactions: {summary.totalTransactions || 0} • Success Rate: {summary.successRate || 0}%
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1">
              <Banknote className="h-3 w-3 text-emerald-600" />
              <span className="text-xs font-medium text-emerald-700">Net Profit: {money(summary.netProfit)}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1">
              <CreditCard className="h-3 w-3 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">Avg Order: {money(summary.averageOrderValue)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50">
      <AdminFeaturePage
        title="Earnings & Analytics"
        description="Live revenue, commission, payout, and transaction data from backend orders and earning records."
        stats={stats}
        rows={rows}
        filters={["All", "Success", "Pending", "Failed"]}
        columns={enhancedColumns}
        loading={loading}
        error={error}
        onRefresh={refresh}
      >
        {/* Analytics Grid */}
        {!loading && rows.length > 0 && (
          <div className="space-y-4">
            <QuickStatsSummary />
            <div className="grid gap-4 lg:grid-cols-2">
              <MonthlyTrend />
              <CategoryBreakdown />
            </div>
            <TopVendors />
          </div>
        )}

        {/* Export Actions Bar */}
        {!loading && rows.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3">
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-slate-500" />
              <span className="text-sm text-slate-600">Export financial data</span>
            </div>
            <div className="flex gap-2">
              <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-all hover:bg-slate-50">
                CSV
              </button>
              <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-all hover:bg-slate-50">
                PDF
              </button>
              <button className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-slate-900">
                Generate Report
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && rows.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
            <div className="mb-4 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 p-4">
              <IndianRupee className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">No earnings data found</h3>
            <p className="mt-1 text-sm text-slate-500">Transaction data will appear here once orders are processed.</p>
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
