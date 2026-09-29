"use client";

import { 
  CreditCard, 
  ReceiptText, 
  RotateCcw, 
  Wallet,
  Banknote,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  Building2,
  Smartphone,
  Landmark,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  Search
} from "lucide-react";
import { AdminFeaturePage } from "../components/AdminFeaturePage";
import { money, parseCurrency } from "../data/mainAdmin";
import { useMainAdminData } from "../lib/useMainAdminData";

export default function Payments() {
  const { rows, data, loading, error, refresh } = useMainAdminData("/mainadmin/payments");
  const summary = data?.summary || {};
  
  // Calculate payment metrics
  const approvedPayments = rows.filter((row) => row.status === "Approved");
  const pendingPayments = rows.filter((row) => row.status === "Pending");
  const failedPayments = rows.filter((row) => row.status === "Rejected" || row.status === "Failed");
  
  const capturedAmount = approvedPayments.reduce((sum, row) => sum + parseCurrency(row.amount), 0);
  const pendingAmount = pendingPayments.reduce((sum, row) => sum + parseCurrency(row.amount), 0);
  const failedAmount = failedPayments.reduce((sum, row) => sum + parseCurrency(row.amount), 0);
  
  // Payment method distribution
  const methodDistribution = {};
  rows.forEach(row => {
    const method = row.method || "Unknown";
    methodDistribution[method] = (methodDistribution[method] || 0) + 1;
  });
  
  // Settlement status
  const settledCount = rows.filter(row => row.settlement === "Settled").length;
  const pendingSettlementCount = rows.filter(row => row.settlement === "Pending").length;
  const settlementRate = rows.length > 0 ? Math.round((settledCount / rows.length) * 100) : 0;
  
  // Success rate
  const successRate = rows.length > 0 ? Math.round((approvedPayments.length / rows.length) * 100) : 0;

  const stats = [
    { 
      label: "Captured Amount", 
      value: money(capturedAmount),
      change: `${successRate}% success rate`,
      icon: CreditCard,
      gradient: "from-emerald-500 to-emerald-600"
    },
    { 
      label: "Pending Amount", 
      value: money(pendingAmount),
      change: `${pendingPayments.length} transactions`,
      icon: Wallet,
      gradient: "from-amber-500 to-amber-600"
    },
    { 
      label: "Refund / Failed", 
      value: money(failedAmount),
      change: `${failedPayments.length} transactions`,
      icon: RotateCcw,
      gradient: "from-rose-500 to-rose-600"
    },
    { 
      label: "Total Transactions", 
      value: rows.length, 
      change: `${settlementRate}% settled`,
      icon: ReceiptText,
      gradient: "from-blue-500 to-blue-600"
    },
  ];

  // Helper to get payment method icon
  const getPaymentIcon = (method) => {
    if (!method) return CreditCard;
    const methodLower = method.toLowerCase();
    if (methodLower.includes("card")) return CreditCard;
    if (methodLower.includes("upi")) return Smartphone;
    if (methodLower.includes("netbanking")) return Landmark;
    if (methodLower.includes("wallet")) return Wallet;
    return CreditCard;
  };

  // Helper to get amount trend
  const AmountWithTrend = ({ amount }) => {
    const numAmount = parseCurrency(amount);
    const isPositive = numAmount > 0;
    return (
      <div className="flex items-center gap-1">
        {isPositive ? (
          <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
        ) : (
          <ArrowDownRight className="h-3.5 w-3.5 text-rose-500" />
        )}
        <span className={`font-semibold ${isPositive ? "text-emerald-600" : "text-rose-600"}`}>
          {money(Math.abs(numAmount))}
        </span>
      </div>
    );
  };

  // Enhanced columns with custom rendering
  const enhancedColumns = [
    { 
      key: "id", 
      label: "Payment ID",
      render: (row) => (
        <div>
          <p className="font-mono text-xs font-medium text-slate-700">{String(row.id || "").slice(-8) || "N/A"}</p>
          <p className="text-[10px] text-slate-400 uppercase">{row.type || "payment"}</p>
        </div>
      )
    },
    { 
      key: "order", 
      label: "Order",
      render: (row) => (
        <div className="flex items-center gap-2">
          <ReceiptText className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-sm font-medium text-slate-700">#{row.order || "N/A"}</span>
        </div>
      )
    },
    { 
      key: "method", 
      label: "Method",
      render: (row) => {
        const Icon = getPaymentIcon(row.method);
        return (
          <div className="flex items-center gap-1.5">
            <Icon className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-sm text-slate-700">{row.method || "Not specified"}</span>
          </div>
        );
      }
    },
    { 
      key: "amount", 
      label: "Amount",
      render: (row) => <AmountWithTrend amount={row.amount} />
    },
    { 
      key: "status", 
      label: "Status", 
      badge: true,
      render: (row) => {
        const statusConfig = {
          Approved: { color: "emerald", icon: CheckCircle2, label: "Success" },
          Pending: { color: "amber", icon: Clock, label: "Pending" },
          Rejected: { color: "rose", icon: XCircle, label: "Failed" },
          Failed: { color: "rose", icon: XCircle, label: "Failed" }
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
    { 
      key: "settlement", 
      label: "Settlement",
      render: (row) => {
        const isSettled = row.settlement === "Settled";
        return (
          <div className="flex items-center gap-1.5">
            <div className={`h-1.5 w-1.5 rounded-full ${isSettled ? "bg-emerald-500" : "bg-amber-500"}`} />
            <span className={`text-xs font-medium ${isSettled ? "text-emerald-600" : "text-amber-600"}`}>
              {row.settlement || "Pending"}
            </span>
          </div>
        );
      }
    },
  ];

  // Payment Method Distribution Component
  const PaymentMethodDistribution = () => {
    if (loading || rows.length === 0) return null;

    const methods = Object.entries(methodDistribution);
    const total = rows.length;

    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">Payment Methods</h3>
            <p className="text-xs text-slate-500">Distribution by transaction type</p>
          </div>
          <CreditCard className="h-4 w-4 text-slate-400" />
        </div>
        <div className="space-y-3">
          {methods.map(([method, count]) => {
            const percentage = ((count / total) * 100).toFixed(1);
            const Icon = getPaymentIcon(method);
            return (
              <div key={method}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 text-slate-500" />
                    <span className="font-medium text-slate-700">{method}</span>
                  </div>
                  <span className="text-xs text-slate-500">{percentage}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="mt-1 text-xs font-semibold text-slate-600">{count} transactions</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Settlement Summary Component
  const SettlementSummary = () => {
    if (loading || rows.length === 0) return null;

    const avgSettlementTime = summary.avgSettlementTime || "2-3";
    
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">Settlement Overview</h3>
            <p className="text-xs text-slate-500">Payment settlement status</p>
          </div>
          <Building2 className="h-4 w-4 text-slate-400" />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Settled</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-emerald-600">{settledCount}</span>
              <span className="text-xs text-slate-400">transactions</span>
            </div>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all"
              style={{ width: `${settlementRate}%` }}
            />
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-xs text-slate-500">Avg. settlement time</span>
            </div>
            <span className="text-sm font-medium text-slate-700">{avgSettlementTime} days</span>
          </div>
          {pendingSettlementCount > 0 && (
            <div className="rounded-lg bg-amber-50 p-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                <p className="text-xs text-amber-700">
                  {pendingSettlementCount} payments pending settlement
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Transaction Summary Cards
  const TransactionSummary = () => {
    if (loading || rows.length === 0) return null;

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-emerald-50/50 to-white p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-emerald-100 p-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Success Rate</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-600">{successRate}%</p>
          <p className="text-xs text-slate-500">{approvedPayments.length} successful payments</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50/50 to-white p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-100 p-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">Avg. Transaction</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-600">
            {money(capturedAmount / (approvedPayments.length || 1))}
          </p>
          <p className="text-xs text-slate-500">Per successful payment</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-purple-50/50 to-white p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-purple-100 p-2">
              <Calendar className="h-4 w-4 text-purple-600" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-purple-600">This Month</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-purple-600">
            {money(summary.monthlyVolume)}
          </p>
          <p className="text-xs text-slate-500">Transaction volume</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-amber-50/50 to-white p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-amber-100 p-2">
              <Banknote className="h-4 w-4 text-amber-600" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-amber-600">Gateway Fee</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-600">
            {money(summary.totalGatewayFee)}
          </p>
          <p className="text-xs text-slate-500">Total processing fees</p>
        </div>
      </div>
    );
  };

  // Quick Actions Bar
  const QuickActionsBar = () => {
    if (loading || rows.length === 0) return null;

    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm p-3">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-slate-100 p-2">
            <ReceiptText className="h-4 w-4 text-slate-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Payment Overview</p>
            <p className="text-xs text-slate-500">
              {approvedPayments.length} successful • {pendingPayments.length} pending • {failedPayments.length} failed
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-all hover:bg-slate-50">
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-slate-900">
            <Filter className="h-3.5 w-3.5" />
            Filter
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50">
      <AdminFeaturePage
        title="Payments"
        description="Live payment and settlement records from backend orders. Track transactions, monitor success rates, and manage settlements."
        stats={stats}
        rows={rows}
        filters={["All", "Approved", "Pending", "Rejected"]}
        columns={enhancedColumns}
        loading={loading}
        error={error}
        onRefresh={refresh}
      >
        {/* Analytics Section */}
        {!loading && rows.length > 0 && (
          <div className="space-y-4">
            <TransactionSummary />
            <div className="grid gap-4 lg:grid-cols-2">
              <PaymentMethodDistribution />
              <SettlementSummary />
            </div>
            <QuickActionsBar />
          </div>
        )}

        {/* Empty State */}
        {!loading && rows.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
            <div className="mb-4 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 p-4">
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">No payment records found</h3>
            <p className="mt-1 text-sm text-slate-500">Payment transactions will appear here once orders are placed.</p>
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
