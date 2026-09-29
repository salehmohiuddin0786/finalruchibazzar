"use client";

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
  UserCheck,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { AdminFeaturePage } from "../components/AdminFeaturePage";
import { money, parseCurrency } from "../data/mainAdmin";
import { useMainAdminData } from "../lib/useMainAdminData";

export default function Payouts() {
  const { rows, data, loading, error, refresh } = useMainAdminData("/mainadmin/payouts");
  const summary = data?.summary || {};
  
  // Calculate payout metrics
  const restaurantPayouts = rows.filter((row) => row.type === "Restaurant");
  const partnerPayouts = rows.filter((row) => row.type === "Delivery Partner");
  const pendingPayouts = rows.filter((row) => row.status === "Pending");
  const approvedPayouts = rows.filter((row) => row.status === "Approved");
  
  const totalPendingAmount = pendingPayouts.reduce((sum, row) => sum + parseCurrency(row.pending || row.amount), 0);
  const totalApprovedAmount = approvedPayouts.reduce((sum, row) => sum + parseCurrency(row.pending || row.amount), 0);
  const totalRestaurantAmount = restaurantPayouts.reduce((sum, row) => sum + parseCurrency(row.pending || row.amount), 0);
  const totalPartnerAmount = partnerPayouts.reduce((sum, row) => sum + parseCurrency(row.pending || row.amount), 0);
  
  // Payout schedule distribution
  const scheduleDistribution = {};
  rows.forEach(row => {
    const schedule = row.schedule || "Unscheduled";
    scheduleDistribution[schedule] = (scheduleDistribution[schedule] || 0) + 1;
  });
  
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
      label: "Restaurant Settlements", 
      value: restaurantPayouts.length, 
      change: money(totalRestaurantAmount),
      icon: Store,
      gradient: "from-emerald-500 to-emerald-600"
    },
    { 
      label: "Partner Settlements", 
      value: partnerPayouts.length, 
      change: money(totalPartnerAmount),
      icon: Truck,
      gradient: "from-amber-500 to-amber-600"
    },
    { 
      label: "Pending Approval", 
      value: pendingPayouts.length, 
      change: money(totalPendingAmount),
      icon: CalendarClock,
      gradient: "from-rose-500 to-rose-600"
    },
  ];

  // Helper to get type icon and color
  const getTypeConfig = (type) => {
    const configs = {
      "Restaurant": { icon: Store, color: "emerald", bg: "emerald-50", text: "emerald-700" },
      "Delivery Partner": { icon: Truck, color: "amber", bg: "amber-50", text: "amber-700" },
      "Platform": { icon: Building2, color: "blue", bg: "blue-50", text: "blue-700" }
    };
    return configs[type] || { icon: Landmark, color: "slate", bg: "slate-50", text: "slate-700" };
  };

  // Helper to get schedule icon
  const getScheduleIcon = (schedule) => {
    if (!schedule) return Calendar;
    const scheduleLower = schedule.toLowerCase();
    if (scheduleLower.includes("weekly")) return Calendar;
    if (scheduleLower.includes("monthly")) return CalendarClock;
    if (scheduleLower.includes("daily")) return Clock;
    return Calendar;
  };

  // Enhanced columns with custom rendering
  const enhancedColumns = [
    { 
      key: "account", 
      label: "Account",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-${getTypeConfig(row.type).color}-500 to-${getTypeConfig(row.type).color}-600 text-sm font-semibold text-white shadow-md`}>
            {row.account?.charAt(0) || row.type?.charAt(0) || "A"}
          </div>
          <div>
            <p className="font-medium text-slate-900">{row.account || "Not specified"}</p>
            <p className="text-xs text-slate-500">ID: {String(row.id || "").slice(-6) || "N/A"}</p>
          </div>
        </div>
      )
    },
    { 
      key: "type", 
      label: "Type",
      render: (row) => {
        const config = getTypeConfig(row.type);
        const Icon = config.icon;
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium bg-${config.bg} text-${config.text}`}>
            <Icon className="h-3 w-3" />
            {row.type}
          </span>
        );
      }
    },
    { 
      key: "schedule", 
      label: "Schedule",
      render: (row) => {
        const ScheduleIcon = getScheduleIcon(row.schedule);
        return (
          <div className="flex items-center gap-1.5">
            <ScheduleIcon className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-sm text-slate-700">{row.schedule || "Not scheduled"}</span>
          </div>
        );
      }
    },
    { 
      key: "pending", 
      label: "Amount",
      render: (row) => {
        const amount = parseCurrency(row.pending || row.amount);
        return (
          <div className="flex items-center gap-1">
            <IndianRupee className="h-3.5 w-3.5 text-emerald-500" />
            <span className="font-semibold text-emerald-600">{money(amount)}</span>
          </div>
        );
      }
    },
    { 
      key: "status", 
      label: "Status", 
      badge: true,
      render: (row) => {
        const statusConfig = {
          Approved: { color: "emerald", icon: CheckCircle2, label: "Approved" },
          Pending: { color: "amber", icon: Clock, label: "Pending Review" },
          Rejected: { color: "rose", icon: AlertCircle, label: "Rejected" },
          Processed: { color: "blue", icon: CheckCircle2, label: "Processed" }
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

  // Payout Summary Cards
  const PayoutSummary = () => {
    if (loading || rows.length === 0) return null;

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-emerald-50/50 to-white p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-emerald-100 p-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Approval Rate</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-600">{approvalRate}%</p>
          <p className="text-xs text-slate-500">{approvedPayouts.length} payouts approved</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50/50 to-white p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-100 p-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">Total Disbursed</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-600">{money(totalApprovedAmount)}</p>
          <p className="text-xs text-slate-500">Across all payouts</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-amber-50/50 to-white p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-amber-100 p-2">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-amber-600">Pending Rate</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-600">{pendingRate}%</p>
          <p className="text-xs text-slate-500">{pendingPayouts.length} pending</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-purple-50/50 to-white p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-purple-100 p-2">
              <Banknote className="h-4 w-4 text-purple-600" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-purple-600">Avg. Payout</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-purple-600">
            {money(totalApprovedAmount / (approvedPayouts.length || 1))}
          </p>
          <p className="text-xs text-slate-500">Per transaction</p>
        </div>
      </div>
    );
  };

  // Schedule Distribution Component
  const ScheduleDistribution = () => {
    if (loading || rows.length === 0) return null;

    const schedules = Object.entries(scheduleDistribution);
    const total = rows.length;

    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">Payout Schedule</h3>
            <p className="text-xs text-slate-500">Distribution by payout frequency</p>
          </div>
          <CalendarClock className="h-4 w-4 text-slate-400" />
        </div>
        <div className="space-y-3">
          {schedules.map(([schedule, count]) => {
            const percentage = ((count / total) * 100).toFixed(1);
            const ScheduleIcon = getScheduleIcon(schedule);
            return (
              <div key={schedule}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <ScheduleIcon className="h-3.5 w-3.5 text-slate-500" />
                    <span className="font-medium text-slate-700">{schedule}</span>
                  </div>
                  <span className="text-xs text-slate-500">{percentage}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="mt-1 text-xs font-semibold text-slate-600">{count} payouts</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Upcoming Payouts Component
  const UpcomingPayouts = () => {
    if (loading || rows.length === 0) return null;

    const upcoming = rows
      .filter(row => row.status === "Pending")
      .sort((a, b) => new Date(a.scheduleDate) - new Date(b.scheduleDate))
      .slice(0, 4);

    if (upcoming.length === 0) return null;

    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">Upcoming Payouts</h3>
            <p className="text-xs text-slate-500">Scheduled for disbursement</p>
          </div>
          <Calendar className="h-4 w-4 text-slate-400" />
        </div>
        <div className="space-y-3">
          {upcoming.map((payout, idx) => {
            const config = getTypeConfig(payout.type);
            const Icon = config.icon;
            return (
              <div key={payout.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 p-3 transition-all hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg bg-${config.bg} p-2`}>
                    <Icon className={`h-4 w-4 text-${config.text}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{payout.account}</p>
                    <p className="text-xs text-slate-500">{payout.schedule}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600">{money(payout.pending || payout.amount)}</p>
                  <p className="text-xs text-slate-500">{payout.scheduleDate || "TBD"}</p>
                </div>
              </div>
            );
          })}
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
            <Landmark className="h-4 w-4 text-slate-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Payout Overview</p>
            <p className="text-xs text-slate-500">
              {restaurantPayouts.length} restaurants • {partnerPayouts.length} partners • {pendingPayouts.length} pending
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
            Process Payouts
          </button>
        </div>
      </div>
    );
  };

  // Amount Distribution Bar
  const AmountDistribution = () => {
    if (loading || rows.length === 0) return null;

    const totalAmount = totalRestaurantAmount + totalPartnerAmount;
    const restaurantPercentage = totalAmount > 0 ? (totalRestaurantAmount / totalAmount) * 100 : 0;
    const partnerPercentage = totalAmount > 0 ? (totalPartnerAmount / totalAmount) * 100 : 0;

    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">Amount Distribution</h3>
            <p className="text-xs text-slate-500">By recipient type</p>
          </div>
          <IndianRupee className="h-4 w-4 text-slate-400" />
        </div>
        <div className="mb-3 flex h-3 overflow-hidden rounded-full bg-slate-100">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all"
            style={{ width: `${restaurantPercentage}%` }}
          />
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all"
            style={{ width: `${partnerPercentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-slate-600">Restaurants</span>
            <span className="font-semibold text-slate-800">{restaurantPercentage.toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-slate-600">Partners</span>
            <span className="font-semibold text-slate-800">{partnerPercentage.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50">
      <AdminFeaturePage
        title="Payouts"
        description="Live restaurant earning, platform commission, and delivery payout records from the backend. Track settlements and manage disbursements."
        stats={stats}
        rows={rows}
        filters={["All", "Pending", "Approved", "Processed"]}
        columns={enhancedColumns}
        loading={loading}
        error={error}
        onRefresh={refresh}
      >
        {/* Analytics Section */}
        {!loading && rows.length > 0 && (
          <div className="space-y-4">
            <PayoutSummary />
            <div className="grid gap-4 lg:grid-cols-2">
              <ScheduleDistribution />
              <AmountDistribution />
            </div>
            <UpcomingPayouts />
            <QuickActionsBar />
          </div>
        )}

        {/* Empty State */}
        {!loading && rows.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
            <div className="mb-4 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 p-4">
              <Landmark className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">No payout records found</h3>
            <p className="mt-1 text-sm text-slate-500">Payout transactions will appear here once settlements are processed.</p>
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
