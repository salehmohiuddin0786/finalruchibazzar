"use client";

import { 
  ShoppingBag, 
  ShieldOff, 
  UserCheck, 
  Users, 
  TrendingUp, 
  Award, 
  AlertCircle,
  Star,
  Calendar,
  IndianRupee,
  Activity,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { AdminFeaturePage } from "../components/AdminFeaturePage";
import { money, parseCurrency } from "../data/mainAdmin";
import { apiRequest } from "../lib/api";
import { useMainAdminData } from "../lib/useMainAdminData";

export default function ManageCustomers() {
  const { rows, setRows, loading, error, refresh } = useMainAdminData("/mainadmin/customers");

  const handleRowAction = async (action, row) => {
    if (!["approve", "reject"].includes(action)) return;
    const statusAction = action === "approve" ? "activate" : "block";
    await apiRequest(`/mainadmin/customers/${row.id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ action: statusAction }),
    });

    setRows((current) =>
      current.map((item) =>
        item.id === row.id ? { ...item, status: statusAction === "activate" ? "Active" : "Blocked" } : item
      )
    );
  };

  // Calculate enhanced metrics
  const totalCustomers = rows.length;
  const activeCount = rows.filter((row) => row.status === "Active").length;
  const blockedCount = rows.filter((row) => row.status === "Blocked").length;
  const totalOrders = rows.reduce((sum, row) => sum + Number(row.orders || 0), 0);
  const totalSpent = rows.reduce((sum, row) => sum + parseCurrency(row.spent), 0);
  const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
  const activeRate = totalCustomers > 0 ? Math.round((activeCount / totalCustomers) * 100) : 0;
  
  // Find top customer
  const topCustomer = rows.reduce((top, row) => {
    const spent = parseCurrency(row.spent);
    return spent > parseCurrency(top?.spent) ? row : top;
  }, null);

  // Recent customers (last 7 days)
  const recentCustomers = rows.filter(row => {
    const createdDate = new Date(row.createdAt || row.joinedDate);
    const daysAgo = (new Date() - createdDate) / (1000 * 60 * 60 * 24);
    return daysAgo <= 7;
  }).length;

  const stats = [
    { 
      label: "Total Customers", 
      value: totalCustomers, 
      change: `+${recentCustomers} this week`,
      icon: Users,
      gradient: "from-blue-500 to-blue-600"
    },
    { 
      label: "Active", 
      value: activeCount, 
      change: `${activeRate}% of total`,
      icon: UserCheck,
      gradient: "from-emerald-500 to-emerald-600"
    },
    { 
      label: "Blocked", 
      value: blockedCount, 
      change: blockedCount > 0 ? `${blockedCount} accounts` : "No blocks",
      icon: ShieldOff,
      gradient: "from-rose-500 to-rose-600"
    },
    { 
      label: "Total Orders", 
      value: totalOrders, 
      change: `${totalOrders} orders placed`,
      icon: ShoppingBag,
      gradient: "from-violet-500 to-violet-600"
    },
  ];

  // Enhanced columns with custom rendering
  const enhancedColumns = [
    { 
      key: "name", 
      label: "Customer",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 font-semibold text-slate-600">
            {row.name?.charAt(0) || "U"}
          </div>
          <div>
            <p className="font-medium text-slate-900">{row.name || "Not provided"}</p>
            <p className="text-xs text-slate-500">ID: {String(row.id || "").slice(-6) || "N/A"}</p>
          </div>
        </div>
      )
    },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { 
      key: "orders", 
      label: "Orders",
      render: (row) => (
        <div className="flex items-center gap-1">
          <ShoppingBag className="h-3.5 w-3.5 text-slate-400" />
          <span className="font-medium text-slate-700">{row.orders || 0}</span>
        </div>
      )
    },
    { 
      key: "spent", 
      label: "Total Spent",
      render: (row) => (
        <div className="flex items-center gap-1">
          <IndianRupee className="h-3.5 w-3.5 text-emerald-500" />
          <span className="font-semibold text-emerald-600">{money(row.spent)}</span>
        </div>
      )
    },
    { 
      key: "status", 
      label: "Status", 
      badge: true,
      render: (row) => {
        const isActive = row.status === "Active";
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
            isActive 
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
              : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
            {row.status}
          </span>
        );
      }
    },
  ];

  // Customer insights component
  const CustomerInsights = () => {
    if (loading || rows.length === 0) return null;

    const highValueCustomers = rows.filter(row => parseCurrency(row.spent) > 10000).length;
    const frequentCustomers = rows.filter(row => Number(row.orders || 0) > 10).length;

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-amber-50/50 to-white p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-amber-100 p-2">
              <Award className="h-4 w-4 text-amber-600" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-amber-600">VIP Customers</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{highValueCustomers}</p>
          <p className="text-xs text-slate-500">Spent &gt; ₹10,000</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50/50 to-white p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-100 p-2">
              <Star className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">Frequent Buyers</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{frequentCustomers}</p>
          <p className="text-xs text-slate-500">10+ orders</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-emerald-50/50 to-white p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-emerald-100 p-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Avg. Order Value</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-600">{money(avgOrderValue)}</p>
          <p className="text-xs text-slate-500">Per transaction</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-purple-50/50 to-white p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-purple-100 p-2">
              <Activity className="h-4 w-4 text-purple-600" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-purple-600">Active Rate</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-purple-600">{activeRate}%</p>
          <p className="text-xs text-slate-500">of total customers</p>
        </div>
      </div>
    );
  };

  // Top customer highlight
  const TopCustomerHighlight = () => {
    if (!topCustomer || loading || rows.length === 0) return null;

    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white">
        <div className="border-b border-slate-100 bg-gradient-to-r from-amber-50 to-transparent px-5 py-3">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-600" />
            <h3 className="text-sm font-semibold text-slate-900">🏆 Top Customer</h3>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-lg font-bold text-white shadow-lg">
              {topCustomer.name?.charAt(0) || "T"}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{topCustomer.name || "Customer"}</p>
              <p className="text-sm text-slate-500">{topCustomer.email}</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-xs text-slate-500">Total Orders</p>
              <p className="text-xl font-bold text-slate-900">{topCustomer.orders || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500">Total Spent</p>
              <p className="text-xl font-bold text-emerald-600">{money(topCustomer.spent)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50">
      <AdminFeaturePage
        title="Customer Management"
        description="Manage customer accounts, track order history, monitor spending, and handle account status changes."
        stats={stats}
        rows={rows}
        filters={["All", "Active", "Blocked"]}
        columns={enhancedColumns}
        loading={loading}
        error={error}
        onRefresh={refresh}
        onRowAction={handleRowAction}
        actionLoadingId={null}
      >
        {/* Customer Insights Section */}
        {!loading && rows.length > 0 && (
          <div className="space-y-4">
            <CustomerInsights />
            <TopCustomerHighlight />
          </div>
        )}

        {/* Quick Actions Bar */}
        {!loading && rows.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm p-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-slate-100 p-2">
                  <AlertCircle className="h-4 w-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Quick Stats</p>
                  <p className="text-xs text-slate-500">
                    {activeCount} active • {blockedCount} blocked • {recentCustomers} new this week
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1">
                  <ThumbsUp className="h-3 w-3 text-emerald-600" />
                  <span className="text-xs font-medium text-emerald-700">Active</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1">
                  <ThumbsDown className="h-3 w-3 text-rose-600" />
                  <span className="text-xs font-medium text-rose-700">Blocked</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && rows.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
            <div className="mb-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 p-4">
              <Users className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">No customers found</h3>
            <p className="mt-1 text-sm text-slate-500">Customer data will appear here once users register.</p>
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
