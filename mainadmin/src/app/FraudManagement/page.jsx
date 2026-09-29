"use client";

import { 
  AlertTriangle, 
  Ban, 
  FileText, 
  ShieldAlert,
  Shield,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Flag,
  UserX,
  Activity,
  TrendingUp,
  Calendar,
  Download,
  Filter,
  Search,
  MoreVertical,
  MessageCircle,
  Lock,
  Unlock,
  Bell
} from "lucide-react";
import { useState } from "react";
import { AdminFeaturePage } from "../components/AdminFeaturePage";
import { money } from "../data/mainAdmin";
import { useMainAdminData } from "../lib/useMainAdminData";

// Severity configuration
const severityConfig = {
  Critical: { 
    color: "rose", 
    icon: AlertTriangle, 
    bg: "bg-rose-50", 
    text: "text-rose-700",
    border: "border-rose-200",
    badge: "bg-rose-500"
  },
  High: { 
    color: "orange", 
    icon: AlertTriangle, 
    bg: "bg-orange-50", 
    text: "text-orange-700",
    border: "border-orange-200",
    badge: "bg-orange-500"
  },
  Medium: { 
    color: "amber", 
    icon: Clock, 
    bg: "bg-amber-50", 
    text: "text-amber-700",
    border: "border-amber-200",
    badge: "bg-amber-500"
  },
  Low: { 
    color: "emerald", 
    icon: Shield, 
    bg: "bg-emerald-50", 
    text: "text-emerald-700",
    border: "border-emerald-200",
    badge: "bg-emerald-500"
  }
};

// Type configuration
const typeConfig = {
  "Payment Fraud": { icon: Ban, color: "rose" },
  "Account Takeover": { icon: UserX, color: "purple" },
  "Review Manipulation": { icon: MessageCircle, color: "amber" },
  "Commission Fraud": { icon: TrendingUp, color: "orange" },
  "Identity Theft": { icon: ShieldAlert, color: "red" },
  "Suspicious Activity": { icon: Activity, color: "blue" }
};

export default function FraudManagement() {
  const { rows, data, loading, error, refresh } = useMainAdminData("/mainadmin/fraud");
  const [selectedCase, setSelectedCase] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState("all");
  
  const summary = data?.summary || {};
  
  // Calculate metrics
  const activeCases = rows.length;
  const criticalCases = rows.filter((row) => row.severity === "Critical").length;
  const highCases = rows.filter((row) => row.severity === "High").length;
  const blockedAccounts = rows.filter((row) => row.type?.includes("Blocked") || row.action?.includes("Block")).length;
  const resolvedCases = summary.resolvedCases || 0;
  const totalImpact = summary.totalImpact || 0;
  
  // Cases by severity
  const severityDistribution = {
    Critical: criticalCases,
    High: highCases,
    Medium: rows.filter((row) => row.severity === "Medium").length,
    Low: rows.filter((row) => row.severity === "Low").length
  };

  const stats = [
    { 
      label: "Active Cases", 
      value: activeCases, 
      change: `${criticalCases} critical`,
      icon: ShieldAlert,
      gradient: "from-blue-500 to-blue-600"
    },
    { 
      label: "Critical Cases", 
      value: criticalCases, 
      change: "Immediate action required",
      icon: AlertTriangle,
      gradient: "from-rose-500 to-rose-600"
    },
    { 
      label: "Blocked Accounts", 
      value: blockedAccounts, 
      change: `${blockedAccounts} accounts blocked`,
      icon: Ban,
      gradient: "from-slate-500 to-slate-600"
    },
    { 
      label: "Total Impact", 
      value: money(totalImpact),
      change: "Estimated loss prevented",
      icon: FileText,
      gradient: "from-emerald-500 to-emerald-600"
    },
  ];

  // Helper to get severity component
  const SeverityBadge = ({ severity }) => {
    const config = severityConfig[severity] || severityConfig.Low;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.bg} ${config.text} border ${config.border}`}>
        <Icon className="h-3 w-3" />
        {severity}
      </span>
    );
  };

  // Helper to get type icon
  const TypeIcon = ({ type }) => {
    const config = typeConfig[type] || { icon: Shield, color: "slate" };
    const Icon = config.icon;
    const colorMap = {
      rose: "text-rose-600",
      purple: "text-purple-600",
      amber: "text-amber-600",
      orange: "text-orange-600",
      red: "text-red-600",
      blue: "text-blue-600",
      slate: "text-slate-600"
    };
    
    return (
      <div className={`rounded-lg p-1.5 bg-${config.color}-50`}>
        <Icon className={`h-3.5 w-3.5 ${colorMap[config.color]}`} />
      </div>
    );
  };

  // Enhanced columns with custom rendering
  const enhancedColumns = [
    { 
      key: "caseId", 
      label: "Case ID",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-200">
            <Flag className="h-3.5 w-3.5 text-slate-500" />
          </div>
          <div>
            <p className="font-mono text-sm font-medium text-slate-700">{row.caseId}</p>
            <p className="text-xs text-slate-400">Reported {row.date || "recently"}</p>
          </div>
        </div>
      )
    },
    { 
      key: "type", 
      label: "Category",
      render: (row) => (
        <div className="flex items-center gap-2">
          <TypeIcon type={row.type} />
          <span className="text-sm text-slate-700">{row.type || "Unknown"}</span>
        </div>
      )
    },
    { 
      key: "subject", 
      label: "Subject",
      render: (row) => (
        <div>
          <p className="text-sm font-medium text-slate-800">{row.subject}</p>
          {row.description && (
            <p className="text-xs text-slate-500 line-clamp-1">{row.description}</p>
          )}
        </div>
      )
    },
    { 
      key: "severity", 
      label: "Severity",
      render: (row) => <SeverityBadge severity={row.severity} />
    },
    { 
      key: "action", 
      label: "Recommended Action",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="text-sm text-slate-600">{row.action || "Investigate"}</span>
        </div>
      )
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setSelectedCase(row)}
            className="rounded-lg p-1.5 transition-all hover:bg-slate-100"
            aria-label="View details"
          >
            <Eye className="h-4 w-4 text-slate-500" />
          </button>
          <button 
            className="rounded-lg p-1.5 transition-all hover:bg-slate-100"
            aria-label="More options"
          >
            <MoreVertical className="h-4 w-4 text-slate-500" />
          </button>
        </div>
      )
    }
  ];

  // Severity Distribution Component
  const SeverityDistribution = () => {
    if (loading || rows.length === 0) return null;

    const total = Object.values(severityDistribution).reduce((a, b) => a + b, 0);
    
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">Severity Distribution</h3>
            <p className="text-xs text-slate-500">Cases by risk level</p>
          </div>
          <Activity className="h-4 w-4 text-slate-400" />
        </div>
        <div className="space-y-3">
          {Object.entries(severityDistribution).map(([severity, count]) => {
            const config = severityConfig[severity];
            const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
            return (
              <div key={severity}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${config.badge}`} />
                    <span className="font-medium text-slate-700">{severity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800">{count}</span>
                    <span className="text-xs text-slate-500">{percentage}%</span>
                  </div>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div 
                    className={`h-full rounded-full bg-${config.color}-500 transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Quick Stats Cards
  const QuickStats = () => {
    if (loading || rows.length === 0) return null;

    const resolutionRate = activeCases + resolvedCases > 0 
      ? Math.round((resolvedCases / (activeCases + resolvedCases)) * 100) 
      : 0;

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-rose-50/50 to-white p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-rose-100 p-2">
              <AlertTriangle className="h-4 w-4 text-rose-600" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-rose-600">Critical</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-rose-600">{criticalCases}</p>
          <p className="text-xs text-slate-500">Requires immediate attention</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-emerald-50/50 to-white p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-emerald-100 p-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Resolution Rate</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-600">{resolutionRate}%</p>
          <p className="text-xs text-slate-500">{resolvedCases} cases resolved</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50/50 to-white p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-100 p-2">
              <Ban className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">Actions Taken</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-600">{blockedAccounts}</p>
          <p className="text-xs text-slate-500">Accounts blocked/suspended</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-purple-50/50 to-white p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-purple-100 p-2">
              <Bell className="h-4 w-4 text-purple-600" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-purple-600">Alert Status</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-purple-600">{activeCases}</p>
          <p className="text-xs text-slate-500">Active monitoring</p>
        </div>
      </div>
    );
  };

  // Recent Activity Component
  const RecentActivity = () => {
    const activities = summary.recentActivities || [
      { id: 1, action: "Case F-2024-001 reviewed", user: "Admin", time: "5 min ago", type: "review" },
      { id: 2, action: "Suspicious transaction detected", user: "System", time: "1 hour ago", type: "alert" },
      { id: 3, action: "Account #CUST-789 blocked", user: "Security Team", time: "2 hours ago", type: "action" }
    ];

    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 p-2">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Recent Activity</h3>
                <p className="text-xs text-slate-500">Latest fraud detection actions</p>
              </div>
            </div>
            <button className="text-sm font-medium text-purple-600 hover:text-purple-700">
              View all
            </button>
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-3 p-4 transition-all hover:bg-slate-50/80">
              <div className="rounded-lg bg-slate-100 p-2">
                {activity.type === "alert" ? (
                  <Bell className="h-4 w-4 text-amber-600" />
                ) : activity.type === "action" ? (
                  <Lock className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Eye className="h-4 w-4 text-blue-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">{activity.action}</p>
                <p className="text-xs text-slate-500">by {activity.user} • {activity.time}</p>
              </div>
            </div>
          ))}
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
            <Shield className="h-4 w-4 text-slate-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Fraud Overview</p>
            <p className="text-xs text-slate-500">
              {criticalCases} critical • {highCases} high priority
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-all hover:bg-slate-50"
          >
            <Filter className="h-3.5 w-3.5" />
            Filter
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-rose-500 to-rose-600 px-3 py-1.5 text-xs font-medium text-white transition-all hover:shadow-lg">
            <Download className="h-3.5 w-3.5" />
            Export Report
          </button>
        </div>
      </div>
    );
  };

  // Case Details Modal
  const CaseDetailsModal = () => {
    if (!selectedCase) return null;

    const severity = severityConfig[selectedCase.severity] || severityConfig.Low;
    const SeverityIcon = severity.icon;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm">
        <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl animate-in fade-in-0 zoom-in-95 duration-200">
          <div className={`rounded-t-xl ${severity.bg} border-b p-5`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 ${severity.bg}`}>
                  <SeverityIcon className={`h-5 w-5 ${severity.text}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{selectedCase.caseId}</h3>
                  <p className="text-sm text-slate-600">{selectedCase.type}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCase(null)}
                className="rounded-lg p-1.5 hover:bg-white/50 transition-colors"
              >
                <XCircle className="h-5 w-5 text-slate-500" />
              </button>
            </div>
          </div>
          
          <div className="space-y-4 p-5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Subject</label>
              <p className="mt-1 text-sm font-medium text-slate-800">{selectedCase.subject}</p>
            </div>
            
            {selectedCase.description && (
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Description</label>
                <p className="mt-1 text-sm text-slate-600">{selectedCase.description}</p>
              </div>
            )}
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Severity</label>
                <div className="mt-2">
                  <SeverityBadge severity={selectedCase.severity} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Recommended Action</label>
                <p className="mt-1 text-sm text-slate-600">{selectedCase.action || "Investigate"}</p>
              </div>
            </div>
            
            {selectedCase.relatedAccounts && (
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Related Accounts</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedCase.relatedAccounts.map((account) => (
                    <span key={account} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                      {account}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-2 border-t border-slate-100 p-4">
            <button 
              onClick={() => setSelectedCase(null)}
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50"
            >
              Close
            </button>
            <button className="flex-1 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-rose-700">
              Take Action
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50">
      <AdminFeaturePage
        title="Fraud Management"
        description="Monitor, detect, and manage fraudulent activities across the platform. Track cases, block suspicious accounts, and review alerts."
        stats={stats}
        rows={rows}
        filters={["All", "Critical", "High", "Medium", "Low"]}
        columns={enhancedColumns}
        loading={loading}
        error={error}
        onRefresh={refresh}
      >
        {/* Analytics Section */}
        {!loading && rows.length > 0 && (
          <div className="space-y-4">
            <QuickStats />
            <div className="grid gap-6 lg:grid-cols-2">
              <SeverityDistribution />
              <RecentActivity />
            </div>
            <QuickActionsBar />
          </div>
        )}

        {/* Empty State */}
        {!loading && rows.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
            <div className="mb-4 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 p-4">
              <Shield className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">No fraud cases detected</h3>
            <p className="mt-1 text-sm text-slate-500">All systems operating normally. No suspicious activities found.</p>
            <button
              onClick={refresh}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg"
            >
              Refresh
            </button>
          </div>
        )}

        {/* Case Details Modal */}
        <CaseDetailsModal />
      </AdminFeaturePage>
    </div>
  );
}
