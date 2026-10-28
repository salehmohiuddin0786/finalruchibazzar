"use client";

import { useState } from "react";
import { 
  CalendarClock, 
  Landmark, 
  Store, 
  Truck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  IndianRupee, 
  Calendar, 
  Banknote, 
  Building2, 
  Download, 
  Filter, 
  ShieldCheck, 
  X, 
  FileCheck, 
  ArrowRight,
  RefreshCw,
  AlertTriangle
} from "lucide-react";
import { AdminFeaturePage } from "../components/AdminFeaturePage";
import { money, parseCurrency } from "../data/mainAdmin";
import { useMainAdminData } from "../lib/useMainAdminData";
import { apiRequest } from "../lib/api";

export default function Payouts() {
  const { rows, data, loading, error, refresh } = useMainAdminData("/mainadmin/payouts");
  
  // State for Payout Actions Modal
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [utrNumber, setUtrNumber] = useState("");
  const [paymentMode, setPaymentMode] = useState("NEFT");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  // State for Reconciliation Report Modal
  const [showReconModal, setShowReconModal] = useState(false);
  const [reconData, setReconData] = useState(null);
  const [loadingRecon, setLoadingRecon] = useState(false);

  // Calculate payout metrics
  const restaurantPayouts = rows.filter((row) => row.type === "Restaurant");
  const partnerPayouts = rows.filter((row) => row.type === "Delivery Partner");
  const pendingPayouts = rows.filter((row) => row.rawStatus === "pending" || row.status === "Pending" || row.status === "Pending Review");
  const approvedPayouts = rows.filter((row) => row.rawStatus === "approved" || row.status === "Approved" || row.status === "Paid");
  
  const totalPendingAmount = pendingPayouts.reduce((sum, row) => sum + parseCurrency(row.pending || row.amount), 0);
  const totalApprovedAmount = approvedPayouts.reduce((sum, row) => sum + parseCurrency(row.pending || row.amount), 0);
  const totalRestaurantAmount = restaurantPayouts.reduce((sum, row) => sum + parseCurrency(row.pending || row.amount), 0);
  const totalPartnerAmount = partnerPayouts.reduce((sum, row) => sum + parseCurrency(row.pending || row.amount), 0);
  
  // Approval rate
  const approvalRate = rows.length > 0 ? Math.round((approvedPayouts.length / rows.length) * 100) : 0;
  const pendingRate = rows.length > 0 ? Math.round((pendingPayouts.length / rows.length) * 100) : 0;

  const stats = [
    { 
      label: "Total Payouts", 
      value: rows.length, 
      change: `${approvalRate}% completed`,
      icon: Landmark,
      gradient: "from-blue-500 to-blue-600"
    },
    { 
      label: "Restaurant Liabilities", 
      value: money(totalRestaurantAmount),
      change: `${restaurantPayouts.length} accounts`,
      icon: Store,
      gradient: "from-emerald-500 to-emerald-600"
    },
    { 
      label: "Partner Settlements", 
      value: money(totalPartnerAmount),
      change: `${partnerPayouts.length} accounts`,
      icon: Truck,
      gradient: "from-amber-500 to-amber-600"
    },
    { 
      label: "Pending Payout Requests", 
      value: pendingPayouts.length, 
      change: money(totalPendingAmount),
      icon: CalendarClock,
      gradient: "from-rose-500 to-rose-600"
    },
  ];

  const handleApprove = async (row) => {
    setActionError("");
    setIsSubmitting(true);
    try {
      await apiRequest(`/payouts/admin/${row.id}/approve`, {
        method: "PUT",
        body: JSON.stringify({ approvedAmount: row.amountRaw || parseCurrency(row.pending) }),
      });
      setActionSuccess(`Payout #${row.payoutNumber || row.id} approved.`);
      refresh();
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err) {
      setActionError(err.message || "Approval failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDisbursal = async (e) => {
    e.preventDefault();
    if (!utrNumber || utrNumber.trim() === "") {
      setActionError("UTR Number / Bank Transfer Reference is strictly required.");
      return;
    }
    setActionError("");
    setIsSubmitting(true);
    try {
      await apiRequest(`/payouts/admin/${selectedPayout.id}/confirm`, {
        method: "PUT",
        body: JSON.stringify({ utrNumber: utrNumber.trim(), paymentMode }),
      });
      setActionSuccess(`Payout confirmed as PAID with UTR: ${utrNumber}`);
      setSelectedPayout(null);
      setUtrNumber("");
      refresh();
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err) {
      setActionError(err.message || "Failed to confirm bank transfer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchReconciliationReport = async () => {
    setLoadingRecon(true);
    setShowReconModal(true);
    try {
      const result = await apiRequest("/payouts/admin/reconciliation");
      setReconData(result);
    } catch (err) {
      console.error("Reconciliation fetch error:", err);
    } finally {
      setLoadingRecon(false);
    }
  };

  const enhancedColumns = [
    { 
      key: "account", 
      label: "Restaurant / Recipient",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-sm font-semibold text-white shadow-md">
            {row.account?.charAt(0) || "R"}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{row.account || "Not specified"}</p>
            <p className="text-xs text-slate-500 font-mono">{row.payoutNumber || `ID: ${row.id}`}</p>
          </div>
        </div>
      )
    },
    { 
      key: "pending", 
      label: "Amount",
      render: (row) => {
        const amount = row.amountRaw || parseCurrency(row.pending || row.amount);
        return (
          <div className="flex items-center gap-1 font-bold text-emerald-600">
            <IndianRupee className="h-3.5 w-3.5 text-emerald-500" />
            <span>{money(amount)}</span>
          </div>
        );
      }
    },
    { 
      key: "beneficiary", 
      label: "Bank Account (Masked)",
      render: (row) => (
        <div>
          <p className="text-xs font-semibold text-slate-800">{row.accountNumberMasked || "UPI / Direct"}</p>
          <p className="text-[11px] text-slate-400">{row.ifscCode ? `IFSC: ${row.ifscCode}` : "Direct settlement"}</p>
        </div>
      )
    },
    { 
      key: "utrNumber", 
      label: "Bank UTR / Reference",
      render: (row) => (
        <div>
          <span className="font-mono text-xs text-slate-700 block">{row.utrNumber || "—"}</span>
          {row.rawStatus === "paid" && row.utrNumber ? (
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <ShieldCheck className="h-3 w-3" /> Bank Confirmed
            </span>
          ) : (
            <span className="text-[10px] text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Unverified
            </span>
          )}
        </div>
      )
    },
    { 
      key: "status", 
      label: "Status", 
      badge: true,
      render: (row) => {
        const statusConfig = {
          Paid: { color: "emerald", icon: CheckCircle2, label: "Paid" },
          Approved: { color: "blue", icon: CheckCircle2, label: "Approved" },
          Pending: { color: "amber", icon: Clock, label: "Pending" },
          Failed: { color: "rose", icon: AlertCircle, label: "Failed" },
        };
        const config = statusConfig[row.status] || statusConfig.Pending;
        const StatusIcon = config.icon;
        
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium bg-${config.color}-50 text-${config.color}-700 border border-${config.color}-200`}>
            <StatusIcon className="h-3 w-3" />
            {config.label}
          </span>
        );
      }
    },
    { 
      key: "actions", 
      label: "FinTech Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          {(row.rawStatus === "pending" || row.status === "Pending") && (
            <button
              onClick={() => handleApprove(row)}
              disabled={isSubmitting}
              className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              Approve
            </button>
          )}

          {(row.rawStatus === "approved" || row.status === "Approved") && (
            <button
              onClick={() => {
                setSelectedPayout(row);
                setUtrNumber("");
              }}
              className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-1"
            >
              <span>Disburse (Enter UTR)</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          )}

          {row.rawStatus === "paid" && (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Disbursed
            </span>
          )}
        </div>
      )
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50">
      {/* Alert Banners */}
      {actionError && (
        <div className="p-4 bg-rose-50 border-b border-rose-200 text-rose-700 text-sm flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError("")}><X className="h-4 w-4" /></button>
        </div>
      )}

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border-b border-emerald-200 text-emerald-700 text-sm flex items-center justify-between px-6">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="h-4 w-4" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess("")}><X className="h-4 w-4" /></button>
        </div>
      )}

      <AdminFeaturePage
        title="Restaurant Settlements & Payouts"
        description="Verify restaurant earnings, approve withdrawal requests, and confirm bank transfers with verified UTR reference numbers."
        stats={stats}
        rows={rows}
        filters={["All", "Pending", "Approved", "Paid"]}
        columns={enhancedColumns}
        loading={loading}
        error={error}
        onRefresh={refresh}
      >
        {/* Quick Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Double-Entry Reconciliation Audit</h4>
              <p className="text-xs text-slate-500">Scan database for cash shortfalls, unpaid orders, or missing UTRs</p>
            </div>
          </div>

          <button
            onClick={fetchReconciliationReport}
            className="px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl text-xs font-semibold hover:shadow-md transition-all flex items-center gap-2"
          >
            <FileCheck className="h-4 w-4 text-emerald-400" />
            <span>Run Reconciliation Audit</span>
          </button>
        </div>

        {/* Empty State */}
        {!loading && rows.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
            <div className="mb-4 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 p-4">
              <Landmark className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">No payout records found</h3>
            <p className="mt-1 text-sm text-slate-500">Payout transactions will appear here when restaurants submit withdrawal requests.</p>
          </div>
        )}
      </AdminFeaturePage>

      {/* MODAL 1: ENTER UTR NUMBER FOR BANK CONFIRMATION */}
      {selectedPayout && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Banknote className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Confirm Bank Disbursal</h3>
                  <p className="text-xs text-slate-500">Enter Bank UTR / Transfer Reference</p>
                </div>
              </div>
              <button onClick={() => setSelectedPayout(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Recipient:</span>
                <span className="font-bold text-slate-800">{selectedPayout.account}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount:</span>
                <span className="font-bold text-emerald-600 text-sm">
                  {money(selectedPayout.amountRaw || selectedPayout.amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Account:</span>
                <span className="font-mono text-slate-700">{selectedPayout.accountNumberMasked || "Direct UPI"}</span>
              </div>
            </div>

            <form onSubmit={handleConfirmDisbursal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Bank UTR / Transaction Reference *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HDFC000192837482"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Required by FinTech compliance rules to mark payout as Bank Confirmed.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Transfer Mode
                </label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="NEFT">NEFT (National Electronic Funds Transfer)</option>
                  <option value="IMPS">IMPS (Immediate Payment Service)</option>
                  <option value="RTGS">RTGS (Real Time Gross Settlement)</option>
                  <option value="UPI">UPI (Unified Payments Interface)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedPayout(null)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? "Confirming..." : "Confirm & Save UTR"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: RECONCILIATION AUDIT REPORT */}
      {showReconModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Reconciliation Audit Report</h3>
                  <p className="text-xs text-slate-500">Cross-checking Orders, Payments, Earnings & Payouts</p>
                </div>
              </div>
              <button onClick={() => setShowReconModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {loadingRecon ? (
                <div className="p-12 text-center text-slate-400">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-indigo-600" />
                  <p className="text-sm font-medium text-slate-600">Auditing all financial records...</p>
                </div>
              ) : reconData ? (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                      <span className="text-xs text-slate-400 block">Orders Audited</span>
                      <span className="text-lg font-bold text-slate-800">{reconData.totalAuditedOrders}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                      <span className="text-xs text-slate-400 block">Total Discrepancies</span>
                      <span className={`text-lg font-bold ${reconData.totalDiscrepancies > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                        {reconData.totalDiscrepancies}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                      <span className="text-xs text-slate-400 block">Critical Flags</span>
                      <span className={`text-lg font-bold ${reconData.criticalCount > 0 ? "text-rose-600" : "text-slate-800"}`}>
                        {reconData.criticalCount}
                      </span>
                    </div>
                  </div>

                  {reconData.discrepancies?.length === 0 ? (
                    <div className="p-8 text-center text-emerald-700 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <CheckCircle2 className="h-10 w-10 mx-auto mb-2 text-emerald-600" />
                      <p className="font-bold text-base">Perfect Reconciliation</p>
                      <p className="text-xs text-emerald-600 mt-1">
                        All orders, payments, and payout records match external bank criteria. Zero leaks detected.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Detected Discrepancies ({reconData.discrepancies.length})
                      </h4>
                      {reconData.discrepancies.map((disc, idx) => (
                        <div key={idx} className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-100 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-rose-800">{disc.type}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-200 text-rose-900">
                              {disc.severity}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700">{disc.description}</p>
                          <div className="p-2 bg-white/80 rounded-lg text-[11px] text-slate-600 mt-1">
                            <span className="font-bold text-indigo-700">Recommended Resolution: </span>
                            {disc.recommendedAction}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="p-8 text-center text-slate-400">Failed to load reconciliation data.</div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 text-right">
              <button
                onClick={() => setShowReconModal(false)}
                className="px-5 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
