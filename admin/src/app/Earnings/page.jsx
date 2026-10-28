"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  DollarSign,
  Calendar,
  Download,
  Filter,
  BarChart3,
  Wallet,
  CreditCard,
  Banknote,
  ArrowUpRight,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Building,
  Clock,
  ShieldCheck,
  X,
  FileSpreadsheet,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000/api";

const formatINR = (val) =>
  `₹${Number(val || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const useSidebar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => isMobile && setSidebarOpen(false);
  const openSidebar = () => isMobile && setSidebarOpen(true);

  return { isMobile, sidebarOpen, toggleSidebar, closeSidebar, openSidebar };
};

export default function EarningsPage() {
  const router = useRouter();
  const { isMobile, sidebarOpen, toggleSidebar, closeSidebar } = useSidebar();

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [earningsData, setEarningsData] = useState({
    summary: {
      todayEarnings: 0,
      weekEarnings: 0,
      monthEarnings: 0,
      grossFoodSales: 0,
      totalCommission: 0,
      netEarnings: 0,
      availableBalance: 0,
      pendingSettlement: 0,
      totalPaidOut: 0,
    },
    bankDetails: {
      accountHolderName: "",
      bankName: "",
      accountNumberMasked: "",
      hasFullAccount: false,
      ifscCode: "",
      upiId: "",
    },
    ordersBreakdown: [],
    payoutHistory: [],
  });

  const [activeTab, setActiveTab] = useState("orders"); // "orders" | "payouts"
  const [timeFilter, setTimeFilter] = useState("all");
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutInputAmount, setPayoutInputAmount] = useState("");
  const [submittingPayout, setSubmittingPayout] = useState(false);

  const fetchEarnings = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/Login");
        return;
      }

      const res = await fetch(`${API_URL}/partner/earnings`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.clear();
          router.push("/Login");
          return;
        }
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to load financial records");
      }

      const data = await res.json();
      if (data.success) {
        setEarningsData(data);
      }
    } catch (err) {
      console.error("Fetch earnings error:", err);
      setError(err.message || "Unable to retrieve earnings ledger.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    fetchEarnings();
  }, [fetchEarnings]);

  const handleRequestPayout = async (e) => {
    e.preventDefault();
    const reqAmount = Number(payoutInputAmount);

    if (!reqAmount || reqAmount < 100) {
      setError("Minimum payout request is ₹100");
      return;
    }

    if (reqAmount > earningsData.summary.availableBalance) {
      setError(`Cannot request more than your available balance of ${formatINR(earningsData.summary.availableBalance)}`);
      return;
    }

    setSubmittingPayout(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/partner/payout-request`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: reqAmount }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Payout request failed");
      }

      setSuccessMessage(`Payout request ${data.payout?.payoutNumber || ""} submitted successfully!`);
      setShowPayoutModal(false);
      setPayoutInputAmount("");
      fetchEarnings(true);

      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      setError(err.message || "Failed to submit payout request");
    } finally {
      setSubmittingPayout(false);
    }
  };

  const exportCSV = () => {
    const rows = [
      [
        "Order ID",
        "Date",
        "Customer",
        "Food Subtotal",
        "Discount",
        "Commission Rate (%)",
        "Commission Deducted",
        "Net Restaurant Earning",
        "Earning Status",
      ],
      ...earningsData.ordersBreakdown.map((item) => [
        item.orderNumber,
        new Date(item.date).toLocaleDateString("en-IN"),
        `"${item.customerName}"`,
        item.grossFoodSales,
        item.discountAmount,
        `${item.commissionRate}%`,
        item.commissionDeducted,
        item.netRestaurantEarning,
        item.status,
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ruchi_bazaar_earnings_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = earningsData.ordersBreakdown.filter((order) => {
    if (timeFilter === "all") return true;
    const orderDate = new Date(order.date);
    const now = new Date();
    if (timeFilter === "today") {
      return orderDate.toDateString() === now.toDateString();
    }
    if (timeFilter === "week") {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return orderDate >= oneWeekAgo;
    }
    if (timeFilter === "month") {
      return (
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getFullYear() === now.getFullYear()
      );
    }
    return true;
  });

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar
        sidebarOpen={sidebarOpen}
        closeSidebar={closeSidebar}
        isMobile={isMobile}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header toggleSidebar={toggleSidebar} />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Restaurant Earnings & Settlements
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Real-time financial ledger, net payout calculations, and bank settlements
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchEarnings(true)}
                disabled={isRefreshing}
                className="p-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2 text-sm font-medium"
                title="Refresh Financials"
              >
                <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <button
                onClick={exportCSV}
                className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2 text-sm font-medium"
              >
                <Download size={16} />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => {
                  setPayoutInputAmount(
                    earningsData.summary.availableBalance > 0
                      ? String(earningsData.summary.availableBalance)
                      : "100"
                  );
                  setShowPayoutModal(true);
                }}
                disabled={earningsData.summary.availableBalance < 100}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-medium shadow-md shadow-emerald-200 hover:from-emerald-700 hover:to-green-700 transition-all disabled:opacity-50 flex items-center gap-2 text-sm"
              >
                <Wallet size={16} />
                <span>Request Payout</span>
              </button>
            </div>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-sm">
              <AlertCircle size={18} className="flex-shrink-0" />
              <div className="flex-1">{error}</div>
              <button onClick={() => setError("")} className="text-red-500 hover:text-red-700">
                <X size={16} />
              </button>
            </div>
          )}

          {successMessage && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3 text-green-700 text-sm">
              <CheckCircle size={18} className="flex-shrink-0" />
              <div className="flex-1 font-medium">{successMessage}</div>
              <button
                onClick={() => setSuccessMessage("")}
                className="text-green-500 hover:text-green-700"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Available Balance */}
            <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-200/50">
              <div className="flex items-center justify-between">
                <span className="text-emerald-100 text-xs font-semibold uppercase tracking-wider">
                  Available for Payout
                </span>
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Wallet size={20} className="text-white" />
                </div>
              </div>
              <div className="text-3xl font-black mt-3">
                {formatINR(earningsData.summary.availableBalance)}
              </div>
              <p className="text-xs text-emerald-100 mt-2 flex items-center gap-1">
                <span>Accrued net earnings ready for withdrawal</span>
              </p>
            </div>

            {/* Today's Net Earnings */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                  Today's Earnings
                </span>
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <DollarSign size={20} />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mt-3">
                {formatINR(earningsData.summary.todayEarnings)}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                This Week: <span className="font-semibold text-gray-700">{formatINR(earningsData.summary.weekEarnings)}</span>
              </p>
            </div>

            {/* This Month's Net Earnings */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                  This Month
                </span>
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <Calendar size={20} />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mt-3">
                {formatINR(earningsData.summary.monthEarnings)}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Total Net: <span className="font-semibold text-gray-700">{formatINR(earningsData.summary.netEarnings)}</span>
              </p>
            </div>

            {/* Pending Settlements */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                  In Payout / Processing
                </span>
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <Clock size={20} />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mt-3">
                {formatINR(earningsData.summary.pendingSettlement)}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Total Settled: <span className="font-semibold text-gray-700">{formatINR(earningsData.summary.totalPaidOut)}</span>
              </p>
            </div>
          </div>

          {/* Bank Account Verification & Beneficiary Details */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                  <Building size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-gray-900">
                      Registered Payout Beneficiary
                    </h3>
                    {earningsData.bankDetails.accountNumberMasked ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <ShieldCheck size={12} /> Verified Direct Bank
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <AlertCircle size={12} /> Payout Account Needed
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Payouts are transferred directly to this account via NEFT / IMPS / UPI.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div>
                  <span className="text-gray-400 block">Beneficiary Name</span>
                  <span className="font-semibold text-gray-800">
                    {earningsData.bankDetails.accountHolderName || "Restaurant Owner"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">Bank Name</span>
                  <span className="font-semibold text-gray-800">
                    {earningsData.bankDetails.bankName || "State Bank of India"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">Account Number</span>
                  <span className="font-semibold text-gray-800">
                    {earningsData.bankDetails.accountNumberMasked || "Not Set"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">IFSC / UPI</span>
                  <span className="font-semibold text-gray-800">
                    {earningsData.bankDetails.ifscCode || earningsData.bankDetails.upiId || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs (Orders Ledger vs Payout History) */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex-1 sm:flex-none px-6 py-4 text-sm font-semibold border-b-2 transition-all ${
                  activeTab === "orders"
                    ? "border-emerald-600 text-emerald-600 bg-emerald-50/30"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                Order-wise Earnings Ledger ({earningsData.ordersBreakdown.length})
              </button>
              <button
                onClick={() => setActiveTab("payouts")}
                className={`flex-1 sm:flex-none px-6 py-4 text-sm font-semibold border-b-2 transition-all ${
                  activeTab === "payouts"
                    ? "border-emerald-600 text-emerald-600 bg-emerald-50/30"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                Payout & Settlement History ({earningsData.payoutHistory.length})
              </button>
            </div>

            {/* TAB 1: ORDER EARNINGS LEDGER */}
            {activeTab === "orders" && (
              <div>
                <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Itemized Financial Ledger</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Exact breakdown: Subtotal − Commission ({earningsData.restaurant?.commissionRate || 2}%) − Discount = Net Restaurant Earning
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter size={16} className="text-gray-400" />
                    <select
                      value={timeFilter}
                      onChange={(e) => setTimeFilter(e.target.value)}
                      className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="all">All Dates</option>
                      <option value="today">Today</option>
                      <option value="week">Past 7 Days</option>
                      <option value="month">This Month</option>
                    </select>
                  </div>
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="p-12 text-center text-gray-400">
                    <FileSpreadsheet size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="text-base font-medium text-gray-600">No order earnings found</p>
                    <p className="text-xs text-gray-400 mt-1">
                      As soon as customers place orders, earnings will be itemized here.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-gray-50/80 text-gray-600 uppercase text-[11px] font-semibold tracking-wider">
                        <tr>
                          <th className="px-4 sm:px-6 py-3.5">Order & Customer</th>
                          <th className="px-4 sm:px-6 py-3.5">Food Subtotal</th>
                          <th className="px-4 sm:px-6 py-3.5">Discount</th>
                          <th className="px-4 sm:px-6 py-3.5">Platform Commission</th>
                          <th className="px-4 sm:px-6 py-3.5 font-bold text-emerald-800">Net Earning</th>
                          <th className="px-4 sm:px-6 py-3.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredOrders.map((row) => (
                          <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                            <td className="px-4 sm:px-6 py-4">
                              <span className="font-bold text-gray-900 block">{row.orderNumber}</span>
                              <span className="text-xs text-gray-500 block">{row.customerName}</span>
                              <span className="text-[11px] text-gray-400 block">
                                {new Date(row.date).toLocaleString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 font-medium text-gray-800">
                              {formatINR(row.grossFoodSales)}
                            </td>
                            <td className="px-4 sm:px-6 py-4 text-red-600">
                              {row.discountAmount > 0 ? `-${formatINR(row.discountAmount)}` : "₹0.00"}
                            </td>
                            <td className="px-4 sm:px-6 py-4 text-amber-700">
                              <span className="block font-medium">-{formatINR(row.commissionDeducted)}</span>
                              <span className="text-[10px] text-gray-400">({row.commissionRate}%)</span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 font-bold text-emerald-600 text-base">
                              {formatINR(row.netRestaurantEarning)}
                            </td>
                            <td className="px-4 sm:px-6 py-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                                  row.status === "accrued"
                                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                                    : row.status === "settled"
                                    ? "bg-green-50 text-green-700 border border-green-200"
                                    : "bg-red-50 text-red-700 border border-red-200"
                                }`}
                              >
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: PAYOUT HISTORY */}
            {activeTab === "payouts" && (
              <div>
                <div className="p-4 sm:p-6 border-b border-gray-100">
                  <h3 className="text-base font-bold text-gray-900">Payout Requests & Bank Disbursals</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Track the lifecycle of withdrawals from Pending → Approved → Paid (with bank UTR)
                  </p>
                </div>

                {earningsData.payoutHistory.length === 0 ? (
                  <div className="p-12 text-center text-gray-400">
                    <Wallet size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="text-base font-medium text-gray-600">No payout history yet</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Click "Request Payout" above to disburse your accrued balance to your bank.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-gray-50/80 text-gray-600 uppercase text-[11px] font-semibold tracking-wider">
                        <tr>
                          <th className="px-4 sm:px-6 py-3.5">Payout Reference</th>
                          <th className="px-4 sm:px-6 py-3.5">Date Requested</th>
                          <th className="px-4 sm:px-6 py-3.5">Amount</th>
                          <th className="px-4 sm:px-6 py-3.5">Mode</th>
                          <th className="px-4 sm:px-6 py-3.5">Bank UTR / Ref</th>
                          <th className="px-4 sm:px-6 py-3.5">Verification</th>
                          <th className="px-4 sm:px-6 py-3.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {earningsData.payoutHistory.map((payout) => (
                          <tr key={payout.id} className="hover:bg-gray-50/60 transition-colors">
                            <td className="px-4 sm:px-6 py-4 font-bold text-gray-900">
                              {payout.payoutNumber}
                            </td>
                            <td className="px-4 sm:px-6 py-4 text-gray-500">
                              {new Date(payout.createdAt).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </td>
                            <td className="px-4 sm:px-6 py-4 font-bold text-gray-900">
                              {formatINR(payout.approvedAmount || payout.amount)}
                            </td>
                            <td className="px-4 sm:px-6 py-4 font-medium text-gray-700">
                              {payout.paymentMode || "NEFT"}
                            </td>
                            <td className="px-4 sm:px-6 py-4 font-mono text-xs text-gray-800">
                              {payout.utrNumber || (
                                <span className="text-amber-600 italic">Processing transfer</span>
                              )}
                            </td>
                            <td className="px-4 sm:px-6 py-4">
                              {payout.status === "paid" && payout.utrNumber ? (
                                <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                  <ShieldCheck size={12} /> Bank Confirmed
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-md">
                                  Unverified
                                </span>
                              )}
                            </td>
                            <td className="px-4 sm:px-6 py-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
                                  payout.status === "paid"
                                    ? "bg-green-50 text-green-700 border border-green-200"
                                    : payout.status === "approved" || payout.status === "processing"
                                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                                    : payout.status === "failed"
                                    ? "bg-red-50 text-red-700 border border-red-200"
                                    : "bg-amber-50 text-amber-700 border border-amber-200"
                                }`}
                              >
                                {payout.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* REQUEST PAYOUT MODAL */}
      {showPayoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Wallet size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Request Bank Payout</h3>
                  <p className="text-xs text-gray-500">Disburse funds to your registered account</p>
                </div>
              </div>
              <button
                onClick={() => setShowPayoutModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 mb-5">
              <span className="text-xs text-emerald-800 block">Available Balance</span>
              <span className="text-2xl font-black text-emerald-700 block mt-1">
                {formatINR(earningsData.summary.availableBalance)}
              </span>
            </div>

            <form onSubmit={handleRequestPayout} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Payout Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-400 font-bold">₹</span>
                  <input
                    type="number"
                    min="100"
                    max={earningsData.summary.availableBalance}
                    step="0.01"
                    value={payoutInputAmount}
                    onChange={(e) => setPayoutInputAmount(e.target.value)}
                    required
                    placeholder="Enter amount (min ₹100)"
                    className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-base font-bold text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex justify-between text-[11px] text-gray-400 mt-1.5">
                  <span>Minimum: ₹100.00</span>
                  <button
                    type="button"
                    onClick={() =>
                      setPayoutInputAmount(String(earningsData.summary.availableBalance))
                    }
                    className="text-emerald-600 font-semibold hover:underline"
                  >
                    Withdraw All
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 text-xs text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">Account:</span>
                  <span className="font-semibold text-gray-800">
                    {earningsData.bankDetails.accountNumberMasked || "UPI / Direct"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Beneficiary:</span>
                  <span className="font-semibold text-gray-800">
                    {earningsData.bankDetails.accountHolderName || "Restaurant Account"}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPayoutModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPayout}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-200 hover:from-emerald-700 hover:to-green-700 transition-all disabled:opacity-50"
                >
                  {submittingPayout ? "Submitting..." : "Confirm Payout"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
