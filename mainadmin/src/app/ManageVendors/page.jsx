"use client";

import { CheckCircle, Clock, Store, XCircle, TrendingUp, Building2, Phone, MapPin, FileText } from "lucide-react";
import { AdminFeaturePage } from "../components/AdminFeaturePage";
import { apiRequest } from "../lib/api";
import { useMainAdminData } from "../lib/useMainAdminData";

const normalizeStatus = (status) => String(status || "").toLowerCase();

export default function ManageVendors() {
  const { rows, setRows, loading, error, refresh } = useMainAdminData("/mainadmin/restaurants");

  const handleRowAction = async (action, row) => {
    if (!["approve", "reject"].includes(action)) return;

    await apiRequest(`/mainadmin/restaurants/${row.id}/approval`, {
      method: "PATCH",
      body: JSON.stringify({ action }),
    });

    setRows((current) =>
      current.map((item) =>
        item.id === row.id
          ? { ...item, status: action === "approve" ? "Approved" : "Rejected", isOpen: action === "approve" }
          : item
      )
    );
  };

  // Calculate stats with trend indicators
  const totalRestaurants = rows.length;
  const approvedCount = rows.filter((row) => normalizeStatus(row.status) === "approved").length;
  const pendingCount = rows.filter((row) => normalizeStatus(row.status) === "pending").length;
  const rejectedCount = rows.filter((row) => normalizeStatus(row.status) === "rejected").length;

  const approvalRate = totalRestaurants > 0 ? Math.round((approvedCount / totalRestaurants) * 100) : 0;

  const stats = [
    { 
      label: "Total Restaurants", 
      value: totalRestaurants, 
      icon: Store,
      change: "+12% this month",
      gradient: "from-blue-500 to-blue-600"
    },
    { 
      label: "Approved", 
      value: approvedCount, 
      icon: CheckCircle,
      change: `${approvalRate}% approval rate`,
      gradient: "from-emerald-500 to-emerald-600"
    },
    { 
      label: "Pending Review", 
      value: pendingCount, 
      icon: Clock,
      change: pendingCount > 0 ? `${pendingCount} waiting` : "All reviewed",
      gradient: "from-amber-500 to-amber-600"
    },
    { 
      label: "Rejected", 
      value: rejectedCount, 
      icon: XCircle,
      change: `${rejectedCount} applications`,
      gradient: "from-rose-500 to-rose-600"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50">
      <AdminFeaturePage
        title="Restaurant Management"
        description="Live restaurant data from the backend. Review vendors, approval status, GST details, and contact information."
        stats={stats}
        rows={rows}
        filters={["All", "Approved", "Pending", "Rejected"]}
        columns={[
          { key: "name", label: "Restaurant", icon: Store },
          { key: "owner", label: "Owner", icon: Building2 },
          { key: "phone", label: "Phone", icon: Phone },
          { key: "city", label: "Location", icon: MapPin },
          { key: "status", label: "Status", badge: true },
          { key: "documents", label: "Documents" },
          { key: "gstin", label: "GSTIN", icon: FileText },
        ]}
        loading={loading}
        error={error}
        onRefresh={refresh}
        onRowAction={handleRowAction}
        actionLoadingId={null}
      >
        {/* Custom content above the table - Quick Stats Bar */}
        {!loading && rows.length > 0 && (
          <div className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-sm">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Quick Stats</p>
                  <p className="text-sm font-medium text-slate-700">
                    {approvedCount} approved • {pendingCount} pending • {rejectedCount} rejected
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden items-center gap-2 sm:flex">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-xs text-slate-500">Approved</span>
                </div>
                <div className="hidden items-center gap-2 sm:flex">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-xs text-slate-500">Pending</span>
                </div>
                <div className="hidden items-center gap-2 sm:flex">
                  <div className="h-2 w-2 rounded-full bg-rose-500" />
                  <span className="text-xs text-slate-500">Rejected</span>
                </div>
                <div className="h-6 w-px bg-slate-200 hidden sm:block" />
                <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                  <span className="text-xs font-medium text-slate-600">Approval Rate</span>
                  <span className="text-xs font-bold text-emerald-600">{approvalRate}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State Enhancement */}
        {!loading && rows.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
            <div className="mb-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 p-4">
              <Store className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">No restaurants found</h3>
            <p className="mt-1 text-sm text-slate-500">Restaurant applications will appear here once submitted.</p>
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
