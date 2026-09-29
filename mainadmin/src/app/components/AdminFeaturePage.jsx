"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle,
  Clipboard,
  Download,
  ExternalLink,
  FileText,
  Eye,
  Filter,
  MoreVertical,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  X,
  XCircle,
  TrendingUp,
  Users,
  Activity,
  AlertCircle,
} from "lucide-react";
import SuperLayout from "../SuperLayout/page";
import { statusStyles } from "../data/mainAdmin";
import { exportRowsToExcel } from "../lib/excel";
import { getUploadUrl } from "../lib/api";

const cardTone = [
  "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20",
  "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20",
  "bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/20",
  "bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/20",
  "bg-gradient-to-br from-violet-500 to-violet-600 text-white shadow-lg shadow-violet-500/20",
  "bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/20",
];

const getRowKey = (row, index) => row.id || row.name || row.caseId || row.orderId || index;

const isPlainValue = (value) =>
  value === null ||
  value === undefined ||
  ["string", "number", "boolean"].includes(typeof value);

const humanizeKey = (key) =>
  String(key || "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") return "Not available";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) {
    if (!value.length) return "Not available";
    if (value.every(isPlainValue)) return value.map(formatValue).join(", ");
    return `${value.length} item${value.length === 1 ? "" : "s"}`;
  }
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
};

const visibleEntries = (record) =>
  Object.entries(record || {}).filter(([key, value]) => key !== "password" && key !== "raw" && value !== undefined);

const documentLabels = {
  fssaiDocument: "FSSAI License",
  gstDocument: "GST Certificate",
  panCard: "PAN Card",
  registrationCertificate: "Registration Certificate",
  cancelledCheque: "Cancelled Cheque",
  menuPdf: "Menu PDF",
  outletPhotos: "Outlet Photos",
  aadhaarFrontPhoto: "Aadhaar Front",
  aadhaarBackPhoto: "Aadhaar Back",
  drivingLicensePhoto: "Driving License",
  vehicleInsurance: "Vehicle Insurance",
  pucCertificate: "PUC Certificate",
  cancelledChequePhoto: "Cancelled Cheque",
  profilePhoto: "Profile Photo",
};

const documentKeyPattern = /(document|photo|certificate|cheque|pdf|panCard|aadhaar|insurance|license)/i;
const documentPathPattern = /^(https?:\/\/|\/uploads\/|uploads\/|data:image\/|data:application\/pdf|.*\.(pdf|png|jpe?g|webp|gif)(\?.*)?$)/i;

const getRowDocuments = (row) => {
  const source = row?.raw || row || {};
  return Object.entries(source).flatMap(([key, value]) => {
    if (!documentKeyPattern.test(key)) return [];
    const values = Array.isArray(value) ? value : value ? [value] : [];

    return values
      .filter((item) => typeof item === "string" && documentPathPattern.test(item.trim()))
      .map((item, index) => ({
        id: `${key}-${index}`,
        label: documentLabels[key] || humanizeKey(key),
        href: getUploadUrl(item),
      }));
  });
};

const renderCellValue = (row, column) => {
  if (typeof column.render === "function") return column.render(row);
  if (column.badge) return <StatusBadge value={row[column.key]} />;
  return formatValue(row[column.key]);
};

function DetailValue({ value, depth = 0 }) {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <p className="text-sm font-medium text-slate-500">Not available</p>;
    }

    if (value.every(isPlainValue)) {
      return <p className="break-words text-sm font-semibold text-slate-900">{formatValue(value)}</p>;
    }

    return (
      <div className="space-y-3">
        {value.map((item, index) => (
          <div key={index} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Item {index + 1}</p>
            <DetailValue value={item} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  }

  if (value && typeof value === "object") {
    const entries = visibleEntries(value);
    if (entries.length === 0) {
      return <p className="text-sm font-medium text-slate-500">Not available</p>;
    }

    return (
      <div className={depth === 0 ? "grid gap-4 sm:grid-cols-2" : "space-y-3"}>
        {entries.map(([key, nestedValue]) => (
          <div key={key} className="rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4 transition-all hover:shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{humanizeKey(key)}</p>
            <div className="mt-2">
              <DetailValue value={nestedValue} depth={depth + 1} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <p className="break-words text-sm font-semibold text-slate-800">{formatValue(value)}</p>;
}

export function StatusBadge({ value }) {
  const style = statusStyles[value] || "bg-slate-100 text-slate-700 border-slate-200";
  return (
    <span className={`inline-flex max-w-full items-center rounded-full border px-2.5 py-1 text-xs font-medium shadow-sm ${style}`}>
      <span className="mr-1 h-1.5 w-1.5 rounded-full bg-current opacity-60" />
      {value}
    </span>
  );
}

function ViewDetailsPopup({ title, row, columns, onClose, onApprove, onReject, actionLoadingId }) {
  if (!row) return null;

  const fullRecord = row.raw || row;
  const columnKeys = new Set(columns.map((column) => column.key));
  const extraEntries = Object.entries(row).filter(
    ([key, value]) => key !== "raw" && !columnKeys.has(key) && isPlainValue(value)
  );
  const rawEntries = visibleEntries(fullRecord);

  return (
    <div className="fixed inset-0 z-[100] flex animate-in fade-in-0 zoom-in-95 items-end justify-center bg-slate-950/70 px-2 py-3 backdrop-blur-md duration-200 sm:items-center sm:px-3 sm:py-6">
      <div className="admin-modal w-full max-w-3xl overflow-hidden rounded-xl border border-white/20 bg-white shadow-2xl transition-all sm:rounded-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 p-4 text-white sm:gap-4 sm:p-5">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">Record details</p>
            <h2 className="mt-1 break-words text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-white/60 transition-all hover:bg-white/15 hover:text-white hover:scale-105"
            aria-label="Close view popup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[78vh] space-y-4 overflow-y-auto p-4 sm:max-h-[70vh] sm:space-y-5 sm:p-7">
          <div className="grid gap-4 sm:grid-cols-2">
            {columns.map((column) => (
              <div key={column.key} className="rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{column.label}</p>
                <div className="mt-2 min-w-0 break-words text-sm font-semibold text-slate-900">
                  {renderCellValue(row, column)}
                </div>
              </div>
            ))}
          </div>

          {extraEntries.length > 0 && (
            <div className="mt-5 overflow-hidden rounded-xl border border-slate-100">
              <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3 sm:px-5">
                <p className="text-sm font-bold text-slate-900">More information</p>
              </div>
              <div className="divide-y divide-slate-100">
                {extraEntries.map(([key, value]) => (
                  <div key={key} className="grid gap-2 px-4 py-3 sm:grid-cols-[180px_1fr] sm:gap-6 sm:px-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{key}</p>
                    <p className="break-words text-sm font-medium text-slate-800">{formatValue(value)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-4 py-4 sm:px-5">
              <p className="text-sm font-bold text-slate-900">Complete information</p>
              <p className="mt-1 text-xs text-slate-500">Full safe record details from the backend.</p>
            </div>
            <div className="p-4 sm:p-5">
              {rawEntries.length > 0 ? (
                <DetailValue value={fullRecord} />
              ) : (
                <p className="text-sm font-medium text-slate-500">No additional details found.</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/80 p-3 sm:flex-row sm:justify-end sm:p-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-100 hover:shadow-sm sm:w-auto"
          >
            Close
          </button>
          {onApprove && (
            <button
              type="button"
              onClick={onApprove}
              disabled={actionLoadingId === row.id}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:from-emerald-700 hover:to-emerald-800 hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-60 sm:w-auto"
            >
              <CheckCircle className="h-4 w-4" />
              Approve
            </button>
          )}
          {onReject && (
            <button
              type="button"
              onClick={onReject}
              disabled={actionLoadingId === row.id}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-rose-600 to-rose-700 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:from-rose-700 hover:to-rose-800 hover:shadow-lg hover:shadow-rose-500/25 disabled:opacity-60 sm:w-auto"
            >
              <XCircle className="h-4 w-4" />
              Reject
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function RowActionMenu({ open, row, canMutate, onClose, onView, onApprove, onReject, onCopy, onViewDocuments }) {
  if (!open) return null;

  const documents = getRowDocuments(row);

  const runAction = (callback) => {
    onClose?.();
    callback?.();
  };

  return (
      <div className="action-menu overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
        <button
          type="button"
          onClick={() => runAction(onView)}
          className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition-all hover:bg-blue-50 hover:text-blue-700"
        >
          <Eye className="h-4 w-4" />
          View details
        </button>
        <button
          type="button"
          onClick={() => runAction(onCopy)}
          className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition-all hover:bg-slate-50"
        >
          <Clipboard className="h-4 w-4" />
          Copy record
        </button>
        {documents.length > 0 && (
          <button
            type="button"
            onClick={() => runAction(onViewDocuments)}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition-all hover:bg-indigo-50 hover:text-indigo-700"
          >
            <FileText className="h-4 w-4" />
            View documents
          </button>
        )}
        {canMutate && (
          <>
            <div className="border-t border-slate-100" />
            <button
              type="button"
              onClick={() => runAction(onApprove)}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-emerald-700 transition-all hover:bg-emerald-50"
            >
              <CheckCircle className="h-4 w-4" />
              Approve
            </button>
            <button
              type="button"
              onClick={() => runAction(onReject)}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-rose-700 transition-all hover:bg-rose-50"
            >
              <XCircle className="h-4 w-4" />
              Reject
            </button>
          </>
        )}
      </div>
  );
}
function DocumentsPopup({ row, onClose }) {
  if (!row) return null;

  const documents = getRowDocuments(row);
  const title = row.name || row.account || row.restaurant || row.title || "Uploaded documents";

  return (
    <div className="fixed inset-0 z-[110] flex animate-in fade-in-0 zoom-in-95 items-end justify-center bg-slate-950/70 px-2 py-3 backdrop-blur-md duration-200 sm:items-center sm:px-3 sm:py-6">
      <div className="admin-modal w-full max-w-4xl overflow-hidden rounded-xl border border-white/20 bg-white shadow-2xl sm:rounded-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-indigo-800 via-slate-900 to-slate-800 p-4 text-white sm:p-5">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">Uploaded documents</p>
            <h2 className="mt-1 break-words text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-white/60 transition-all hover:bg-white/15 hover:text-white"
            aria-label="Close documents popup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[78vh] overflow-y-auto p-4 sm:max-h-[74vh] sm:p-5">
          {documents.length === 0 ? (
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-8 text-center text-sm text-slate-500">
              No uploaded documents found for this record.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {documents.map((document) => {
                const isPdf = /\.pdf($|\?)/i.test(document.href);
                return (
                  <div key={document.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">{document.label}</p>
                        <p className="truncate text-xs text-slate-500">{document.href}</p>
                      </div>
                      <a
                        href={document.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Open
                      </a>
                    </div>
                    <div className="aspect-[4/3] bg-slate-100">
                      {isPdf ? (
                        <iframe title={document.label} src={document.href} className="h-full w-full" />
                      ) : (
                        <img src={document.href} alt={document.label} className="h-full w-full object-contain" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AdminFeaturePage({
  title,
  description,
  stats = [],
  rows = [],
  columns = [],
  primaryAction = "Export",
  secondaryAction = "Refresh",
  filters = ["All"],
  loading = false,
  error = "",
  onRefresh,
  onRowAction,
  actionLoadingId = null,
  children,
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(filters[0] || "All");
  const [viewRow, setViewRow] = useState(null);
  const [documentsRow, setDocumentsRow] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesQuery = !normalized || Object.values(row).join(" ").toLowerCase().includes(normalized);
      const matchesFilter = filter === "All" || Object.values(row).includes(filter);
      return matchesQuery && matchesFilter;
    });
  }, [filter, query, rows]);

  const canMutateRows = typeof onRowAction === "function";
  const closeRowMenu = () => setOpenMenu(null);

  const toggleRowMenu = (event, key, row) => {
    event.stopPropagation();

    if (openMenu?.key === key) {
      closeRowMenu();
      return;
    }

    setOpenMenu({ key, row });
  };

  const handleView = (row) => {
    closeRowMenu();
    setViewRow(row);
    onRowAction?.("view", row);
  };

  const handleApprove = (row) => {
    closeRowMenu();
    onRowAction?.("approve", row);
  };

  const handleReject = (row) => {
    closeRowMenu();
    onRowAction?.("reject", row);
  };

  const handleCopy = async (row, key) => {
    closeRowMenu();
    const text = JSON.stringify(row.raw || row, (field, value) => (field === "password" ? undefined : value), 2);

    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1300);
    } catch {
      setCopiedKey(null);
    }
  };

  const handleExport = () => {
    exportRowsToExcel({
      filename: title,
      sheetName: title,
      rows: filteredRows,
      columns,
    });
  };

  // Helper to get icon for stat
  const getStatIcon = (index, customIcon) => {
    if (customIcon) return customIcon;
    const icons = [Users, TrendingUp, Activity, AlertCircle];
    return icons[index % icons.length] || Shield;
  };

  return (
    <SuperLayout>
      <ViewDetailsPopup
        title={title}
        row={viewRow}
        columns={columns}
        onClose={() => setViewRow(null)}
        onApprove={canMutateRows && viewRow ? () => handleApprove(viewRow) : null}
        onReject={canMutateRows && viewRow ? () => handleReject(viewRow) : null}
        actionLoadingId={actionLoadingId}
      />
      <DocumentsPopup row={documentsRow} onClose={() => setDocumentsRow(null)} />

      <div className="min-w-0 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h1 className="break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl xl:text-4xl bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-500 leading-relaxed">{description}</p>
          </div>
          <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:flex sm:justify-end">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-all hover:from-slate-900 hover:to-slate-950 hover:shadow-lg hover:shadow-slate-900/20 active:scale-95 sm:flex-none sm:px-5"
            >
              <Download className="h-4 w-4" />
              {primaryAction}
            </button>
            <button
              onClick={onRefresh}
              disabled={loading}
              className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none sm:px-5"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              {secondaryAction}
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="animate-in slide-in-from-top-2 fade-in-0 duration-200 rounded-xl border border-rose-100 bg-gradient-to-r from-rose-50 to-white px-5 py-3.5 text-sm text-rose-700 shadow-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        {stats.length > 0 && (
          <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = getStatIcon(index, stat.icon);
              return (
                <div
                  key={stat.label}
                  className="group relative min-w-0 overflow-hidden rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 sm:p-5"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-gradient-to-br from-slate-100 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="flex items-start justify-between gap-3">
                    <div className={`rounded-xl p-2.5 ${cardTone[index % cardTone.length]}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    {stat.change && (
                      <span className="inline-flex max-w-[60%] items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                        <TrendingUp className="h-3 w-3" />
                        <span className="truncate">{stat.change}</span>
                      </span>
                    )}
                  </div>
                  <p className="mt-4 break-words text-xs font-semibold uppercase tracking-wide text-slate-500">{stat.label}</p>
                  <p className="mt-1 break-words text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
              );
            })}
          </div>
        )}

        {children}

        {/* Main Table Card */}
        <div className="feature-card min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          {/* Search and Filter Bar */}
          <div className="border-b border-slate-100 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 p-4 text-white sm:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                    <Activity className="h-4 w-4 text-cyan-200" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Live records</p>
                    <h2 className="truncate text-lg font-bold tracking-tight sm:text-xl">{title} Table</h2>
                  </div>
                </div>
                <p className="mt-2 text-xs text-white/55 sm:text-sm">
                  Showing {filteredRows.length.toLocaleString("en-IN")} of {rows.length.toLocaleString("en-IN")} records
                </p>
              </div>

              <div className="grid gap-2 lg:grid-cols-[minmax(240px,420px)_minmax(160px,220px)_auto]">
                <div className="relative min-w-0">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/10 py-2 pl-9 pr-3 text-sm text-white outline-none transition-all placeholder:text-white/35 focus:border-cyan-300/70 focus:bg-white/15 focus:ring-2 focus:ring-cyan-300/20"
                    placeholder={`Search ${title.toLowerCase()}...`}
                  />
                </div>
                <select
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                  className="h-11 min-w-0 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white outline-none transition-all focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/20 [&_option]:text-slate-900"
                >
                  {filters.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 text-sm font-semibold text-white transition-all hover:bg-white/15" aria-label="Filter">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filter</span>
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto bg-slate-50/70 p-3 md:block">
            <table className="w-max min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr>
                  <th className="sticky top-0 z-10 px-3 py-2 text-left text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    #
                  </th>
                  {columns.map((column) => (
                    <th key={column.key} className="sticky top-0 z-10 px-4 py-2 text-left text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      <span className="inline-flex items-center gap-2">
                        {column.icon && <column.icon className="h-3.5 w-3.5 text-slate-400" />}
                        {column.label}
                      </span>
                    </th>
                  ))}
                  <th className="sticky right-0 top-0 z-20 bg-slate-50/95 px-4 py-2 text-right text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 backdrop-blur">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 2} className="rounded-2xl bg-white px-4 py-14 text-center text-sm text-slate-500 shadow-sm">
                      <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                        <RefreshCw className="h-5 w-5 animate-spin text-slate-500" />
                      </span>
                      <p className="font-semibold text-slate-900">Loading {title.toLowerCase()}...</p>
                      <p className="mt-1 text-xs text-slate-500">Pulling the latest backend records.</p>
                    </td>
                  </tr>
                ) : filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 2} className="rounded-2xl bg-white px-4 py-14 text-center text-sm text-slate-500 shadow-sm">
                      <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                        <Search className="h-5 w-5 text-slate-500" />
                      </span>
                      <p className="font-semibold text-slate-900">No records found</p>
                      <p className="mt-1 text-xs text-slate-500">Try changing the search or filter.</p>
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row, index) => {
                    const key = getRowKey(row, index);
                    const isMenuOpen = openMenu?.key === key;

                    return (
                      <>
                        <tr
                          key={key}
                          className="table-row-pop group"
                          style={{ animationDelay: `${Math.min(index, 10) * 30}ms` }}
                        >
                          <td className="rounded-l-2xl border-y border-l border-slate-100 bg-white px-3 py-4 text-sm text-slate-400 shadow-sm transition-all group-hover:border-cyan-100 group-hover:bg-cyan-50/30 group-hover:text-cyan-700">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500 group-hover:bg-cyan-100 group-hover:text-cyan-700">
                              {index + 1}
                            </span>
                          </td>
                          {columns.map((column) => (
                            <td key={column.key} className="border-y border-slate-100 bg-white px-4 py-4 text-sm text-slate-700 shadow-sm transition-all group-hover:border-cyan-100 group-hover:bg-cyan-50/30">
                              <div className="min-w-[120px] max-w-[240px] break-words">
                                {renderCellValue(row, column)}
                              </div>
                            </td>
                          ))}
                          <td className="sticky right-0 z-10 rounded-r-2xl border-y border-r border-slate-100 bg-white px-4 py-4 shadow-sm transition-all group-hover:border-cyan-100 group-hover:bg-cyan-50">
                            <div className="relative flex justify-end gap-1">
                              <button 
                                onClick={() => handleView(row)} 
                                className="rounded-lg border border-transparent p-2 transition-all hover:border-blue-100 hover:bg-blue-50 hover:text-blue-700" 
                                aria-label="View"
                              >
                                <Eye className="h-4 w-4 text-slate-500 group-hover:text-slate-700" />
                              </button>
                              <button
                                onClick={() => handleApprove(row)}
                                disabled={!canMutateRows || actionLoadingId === row.id}
                                className="rounded-lg border border-transparent p-2 transition-all hover:border-emerald-100 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label="Approve"
                              >
                                <CheckCircle className="h-4 w-4 text-emerald-600" />
                              </button>
                              <button
                                onClick={() => handleReject(row)}
                                disabled={!canMutateRows || actionLoadingId === row.id}
                                className="rounded-lg border border-transparent p-2 transition-all hover:border-rose-100 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label="Reject"
                              >
                                <XCircle className="h-4 w-4 text-rose-600" />
                              </button>
                              <button
                                type="button"
                                onClick={(event) => toggleRowMenu(event, key, row)}
                                className="rounded-lg border border-transparent p-2 transition-all hover:border-slate-200 hover:bg-white hover:shadow-sm"
                                aria-label="More actions"
                              >
                                <MoreVertical className="h-4 w-4 text-slate-500" />
                              </button>
                              {copiedKey === key && (
                                <span className="absolute -right-2 -top-2 z-20 rounded-full bg-slate-900 px-2 py-1 text-xs font-semibold text-white shadow-lg animate-in fade-in-0 zoom-in-95">
                                  Copied
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                        {isMenuOpen && (
                          <tr className="table-row-pop">
                            <td colSpan={columns.length + 2} className="px-0 pb-2 pt-0">
                              <div className="flex justify-end pr-4">
                                <div className="w-52">
                                  <RowActionMenu
                                    open={isMenuOpen}
                                    row={row}
                                    canMutate={canMutateRows}
                                    onClose={closeRowMenu}
                                    onView={() => handleView(row)}
                                    onApprove={() => handleApprove(row)}
                                    onReject={() => handleReject(row)}
                                    onCopy={() => handleCopy(row, key)}
                                    onViewDocuments={() => setDocumentsRow(row)}
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="space-y-3 bg-slate-50/80 p-3 md:hidden">
            {loading && filteredRows.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
                <RefreshCw className="mb-3 h-5 w-5 animate-spin" />
                <p className="font-semibold text-slate-900">Loading...</p>
              </div>
            ) : filteredRows.length === 0 ? (
              <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
                <Search className="mx-auto mb-3 h-5 w-5" />
                <p className="font-semibold text-slate-900">No records found</p>
              </div>
            ) : (
              filteredRows.map((row, index) => {
                const key = getRowKey(row, index);
                const isMenuOpen = openMenu?.key === key;

                return (
                  <div
                    key={key}
                    className="feature-card relative min-w-0 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:border-cyan-100 hover:shadow-md"
                    style={{ animationDelay: `${Math.min(index, 10) * 40}ms` }}
                  >
                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-3 text-white">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">Record {index + 1}</p>
                          <div className="mt-1 break-words text-sm font-bold">
                            {columns[0] ? renderCellValue(row, columns[0]) : formatValue(row.id)}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(event) => toggleRowMenu(event, key, row)}
                          className="rounded-lg bg-white/10 p-2 text-white transition hover:bg-white/15"
                          aria-label="More actions"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-3 p-4">
                      {columns.slice(1, 6).map((column) => (
                        <div key={column.key} className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                          <span className="block min-w-0 break-words text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                            {column.label}
                          </span>
                          <span className="mt-1 block min-w-0 break-words text-sm font-semibold text-slate-800 [&>*]:max-w-full">
                            {renderCellValue(row, column)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 bg-white px-4 py-3">
                      <button onClick={() => handleView(row)} className="inline-flex items-center gap-1.5 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition-all hover:bg-blue-100" aria-label="View">
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </button>
                      <button 
                        onClick={() => handleApprove(row)} 
                        disabled={!canMutateRows || actionLoadingId === row.id} 
                        className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition-all hover:bg-emerald-100 disabled:opacity-40" 
                        aria-label="Approve"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Approve
                      </button>
                      <button 
                        onClick={() => handleReject(row)} 
                        disabled={!canMutateRows || actionLoadingId === row.id} 
                        className="inline-flex items-center gap-1.5 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition-all hover:bg-rose-100 disabled:opacity-40" 
                        aria-label="Reject"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Reject
                      </button>
                    </div>
                    {isMenuOpen && (
                      <div className="border-t border-slate-100 bg-slate-50 p-3">
                        <RowActionMenu
                          open={isMenuOpen}
                          row={row}
                          canMutate={canMutateRows}
                          onClose={closeRowMenu}
                          onView={() => handleView(row)}
                          onApprove={() => handleApprove(row)}
                          onReject={() => handleReject(row)}
                          onCopy={() => handleCopy(row, key)}
                          onViewDocuments={() => setDocumentsRow(row)}
                        />
                      </div>
                    )}
                    {copiedKey === key && (
                      <span className="absolute right-3 top-3 z-20 rounded-full bg-slate-900 px-2 py-1 text-xs font-semibold text-white shadow-lg animate-in fade-in-0 zoom-in-95">
                        Copied
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </SuperLayout>
  );
}
