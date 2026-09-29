"use client";

import { 
  Download, 
  FileBarChart, 
  FileText, 
  ReceiptText,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  RefreshCw,
  Filter,
  Eye,
  CalendarDays,
  Timer,
  Settings2
} from "lucide-react";
import { AdminFeaturePage } from "../components/AdminFeaturePage";
import { exportRowsToExcel } from "../lib/excel";
import { useMainAdminData } from "../lib/useMainAdminData";

export default function Reports() {
  const { rows, data, loading, error, refresh } = useMainAdminData("/mainadmin/reports");
  const summary = data?.summary || {};
  
  // Calculate report metrics
  const activeReports = rows.filter(row => row.status === "Active" || row.status === "Approved").length;
  const pendingReports = rows.filter(row => row.status === "Pending").length;
  const gstReports = rows.filter(row => row.title?.toLowerCase().includes("gst")).length;
  const financialReports = rows.filter(row => row.title?.toLowerCase().includes("financial") || row.title?.toLowerCase().includes("earnings")).length;
  const operationalReports = rows.filter(row => row.title?.toLowerCase().includes("order") || row.title?.toLowerCase().includes("delivery")).length;
  
  // Scheduled exports (mock data - in real app would come from API)
  const scheduledExports = summary.scheduledExports || [
    { name: "Daily Sales Report", time: "10:00 AM", frequency: "Daily", format: "PDF" },
    { name: "Weekly GST Summary", time: "Monday 9 AM", frequency: "Weekly", format: "Excel" },
    { name: "Monthly Payout Report", time: "1st of month", frequency: "Monthly", format: "CSV" },
  ];
  
  const recentExports = summary.recentExports || [
    { name: "Q4 Financial Report", date: "2024-03-15", size: "2.4 MB", status: "Ready" },
    { name: "February GST Report", date: "2024-03-01", size: "1.8 MB", status: "Ready" },
    { name: "Weekly Order Summary", date: "2024-03-14", size: "856 KB", status: "Processing" },
  ];
  
  const reportCategories = [
    { name: "Financial Reports", count: financialReports, icon: FileBarChart, color: "emerald" },
    { name: "GST Reports", count: gstReports, icon: ReceiptText, color: "blue" },
    { name: "Operational Reports", count: operationalReports, icon: Activity, color: "purple" },
    { name: "Active Reports", count: activeReports, icon: CheckCircle2, color: "cyan" },
  ];

  const generateExcelReport = (reportRows = rows, filename = "reports") => {
    exportRowsToExcel({
      filename,
      sheetName: "Reports",
      rows: reportRows,
      columns: enhancedColumns,
    });
  };

  const stats = [
    { 
      label: "Report Types", 
      value: rows.length, 
      change: `${activeReports} active reports`,
      icon: FileText,
      gradient: "from-blue-500 to-blue-600"
    },
    { 
      label: "Scheduled Exports", 
      value: scheduledExports.length, 
      change: "Auto-generated",
      icon: Download,
      gradient: "from-emerald-500 to-emerald-600"
    },
    { 
      label: "GST Summaries", 
      value: gstReports, 
      change: "Tax reports",
      icon: ReceiptText,
      gradient: "from-purple-500 to-purple-600"
    },
    { 
      label: "Active Dashboards", 
      value: activeReports, 
      change: `${pendingReports} pending updates`,
      icon: FileBarChart,
      gradient: "from-amber-500 to-amber-600"
    },
  ];

  // Helper to get frequency icon and color
  const getFrequencyConfig = (frequency) => {
    const configs = {
      "Daily": { icon: Clock, color: "blue", bg: "blue-50", text: "blue-700" },
      "Weekly": { icon: Calendar, color: "purple", bg: "purple-50", text: "purple-700" },
      "Monthly": { icon: CalendarDays, color: "emerald", bg: "emerald-50", text: "emerald-700" },
      "Quarterly": { icon: Timer, color: "amber", bg: "amber-50", text: "amber-700" }
    };
    return configs[frequency] || { icon: Clock, color: "slate", bg: "slate-50", text: "slate-700" };
  };

  // Enhanced columns with custom rendering
  const enhancedColumns = [
    { 
      key: "title", 
      label: "Report",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="font-medium text-slate-900">{row.title}</p>
            <p className="text-xs text-slate-500">ID: {String(row.id || "").slice(-6) || "N/A"}</p>
          </div>
        </div>
      )
    },
    { 
      key: "scope", 
      label: "Scope",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <BarChart3 className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-sm text-slate-700">{row.scope || "All data"}</span>
        </div>
      )
    },
    { 
      key: "frequency", 
      label: "Frequency",
      render: (row) => {
        const config = getFrequencyConfig(row.frequency);
        const Icon = config.icon;
        return (
          <div className="flex items-center gap-1.5">
            <Icon className={`h-3.5 w-3.5 text-${config.color}-500`} />
            <span className="text-sm text-slate-700">{row.frequency || "On-demand"}</span>
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
          Active: { color: "emerald", icon: CheckCircle2, label: "Active" },
          Approved: { color: "emerald", icon: CheckCircle2, label: "Active" },
          Pending: { color: "amber", icon: Clock, label: "Pending" },
          Draft: { color: "slate", icon: FileText, label: "Draft" }
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

  // Report Categories Component
  const ReportCategories = () => {
    if (loading || rows.length === 0) return null;

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {reportCategories.map((category) => {
          const Icon = category.icon;
          return (
            <div 
              key={category.name} 
              className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className={`absolute right-0 top-0 rounded-bl-xl bg-${category.color}-50 px-2 py-1 text-xs font-medium text-${category.color}-700`}>
                {category.count} reports
              </div>
              <div className={`rounded-lg bg-${category.color}-100 p-2.5 w-fit`}>
                <Icon className={`h-5 w-5 text-${category.color}-600`} />
              </div>
              <p className="mt-3 text-sm font-medium text-slate-700">{category.name}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{category.count}</p>
            </div>
          );
        })}
      </div>
    );
  };

  // Scheduled Exports Component
  const ScheduledExports = () => {
    if (loading) return null;

    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 p-2">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Scheduled Exports</h3>
                <p className="text-xs text-slate-500">Auto-generated reports on schedule</p>
              </div>
            </div>
            <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1">
              <Settings2 className="h-3.5 w-3.5" />
              Manage schedules
            </button>
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {scheduledExports.map((export_, idx) => {
            const config = getFrequencyConfig(export_.frequency);
            const Icon = config.icon;
            return (
              <div key={idx} className="flex flex-wrap items-center justify-between gap-3 p-4 transition-all hover:bg-slate-50/80">
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg bg-${config.color}-50 p-2`}>
                    <Icon className={`h-4 w-4 text-${config.color}-600`} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{export_.name}</p>
                    <p className="text-xs text-slate-500">{export_.time} • {export_.format}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-full bg-${config.color}-50 px-2 py-0.5 text-xs font-medium text-${config.color}-700`}>
                    <Icon className="h-3 w-3" />
                    {export_.frequency}
                  </span>
                  <button className="rounded-lg border border-slate-200 p-1.5 transition-all hover:bg-slate-100">
                    <Download className="h-3.5 w-3.5 text-slate-500" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Recent Exports Component
  const RecentExports = () => {
    if (loading) return null;

    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-2">
                <Download className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Recent Exports</h3>
                <p className="text-xs text-slate-500">Last generated reports</p>
              </div>
            </div>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View all
            </button>
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {recentExports.map((export_, idx) => (
            <div key={idx} className="flex flex-wrap items-center justify-between gap-3 p-4 transition-all hover:bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-slate-100 p-2">
                  <FileText className="h-4 w-4 text-slate-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{export_.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-500">{export_.date}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">{export_.size}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {export_.status === "Processing" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    Processing
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                    <CheckCircle2 className="h-3 w-3" />
                    Ready
                  </span>
                )}
                <button className="rounded-lg border border-slate-200 p-1.5 transition-all hover:bg-slate-100">
                  <Download className="h-3.5 w-3.5 text-slate-500" />
                </button>
                <button className="rounded-lg border border-slate-200 p-1.5 transition-all hover:bg-slate-100">
                  <Eye className="h-3.5 w-3.5 text-slate-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Quick Stats Bar
  const QuickStatsBar = () => {
    if (loading || rows.length === 0) return null;

    const activePercentage = rows.length > 0 ? Math.round((activeReports / rows.length) * 100) : 0;

    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm p-3">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-slate-100 p-2">
            <PieChart className="h-4 w-4 text-slate-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Report Overview</p>
            <p className="text-xs text-slate-500">
              {activeReports} active • {pendingReports} pending • {activePercentage}% availability
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-all hover:bg-slate-50">
            <Filter className="h-3.5 w-3.5" />
            Filter
          </button>
          <button
            type="button"
            onClick={() => generateExcelReport(rows, "mainadmin-reports")}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-slate-900"
          >
            <Download className="h-3.5 w-3.5" />
            Generate Report
          </button>
        </div>
      </div>
    );
  };

  // Export Formats Component
  const ExportFormats = () => (
    <button
      type="button"
      onClick={() => generateExcelReport(rows, "mainadmin-reports")}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50"
    >
      <Download className="h-3.5 w-3.5" />
      Excel
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50">
      <AdminFeaturePage
        title="Reports"
        description="Live report scopes generated from backend counts and totals. Access financial, operational, and tax reports."
        stats={stats}
        rows={rows}
        filters={["All", "Active", "Pending", "Draft"]}
        columns={enhancedColumns}
        loading={loading}
        error={error}
        onRefresh={refresh}
      >
        {/* Analytics Section */}
        {!loading && rows.length > 0 && (
          <div className="space-y-4">
            <ReportCategories />
            <QuickStatsBar />
            <div className="grid gap-6 lg:grid-cols-2">
              <ScheduledExports />
              <RecentExports />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-slate-100 p-2">
                  <TrendingUp className="h-4 w-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Export Format Available</p>
                  <p className="text-xs text-slate-500">Download reports in Excel format</p>
                </div>
              </div>
              <ExportFormats />
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && rows.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
            <div className="mb-4 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 p-4">
              <FileBarChart className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">No reports found</h3>
            <p className="mt-1 text-sm text-slate-500">Reports will appear here once generated from the system.</p>
            <button
              onClick={() => generateExcelReport(rows, "first-report")}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg"
            >
              Generate First Report
            </button>
          </div>
        )}
      </AdminFeaturePage>
    </div>
  );
}
