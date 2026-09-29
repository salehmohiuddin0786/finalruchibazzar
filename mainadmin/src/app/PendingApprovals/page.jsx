"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminFeaturePage } from "../components/AdminFeaturePage";
import { 
  ClipboardCheck, 
  ExternalLink, 
  FileCheck, 
  Store, 
  Timer, 
  AlertTriangle, 
  ShieldCheck, 
  Eye,
  ChevronRight,
  FileText,
  Image,
  File,
  CheckCircle2,
  Clock,
  XCircle
} from "lucide-react";
import { apiRequest, getUploadUrl } from "../lib/api";

const documentFields = [
  { key: "fssaiDocument", label: "FSSAI License", icon: FileCheck, required: true },
  { key: "gstDocument", label: "GST Certificate", icon: FileText, required: true },
  { key: "panCard", label: "PAN Card", icon: File, required: true },
  { key: "registrationCertificate", label: "Registration Certificate", icon: FileCheck, required: false },
  { key: "cancelledCheque", label: "Cancelled Cheque", icon: File, required: false },
  { key: "menuPdf", label: "Menu PDF", icon: FileText, required: false },
  { key: "outletPhotos", label: "Outlet Photos", icon: Image, required: false },
];

const formatDate = (value) => {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const getStatus = (restaurant) => {
  if (restaurant.isApproved) return { label: "Approved", color: "emerald", icon: CheckCircle2 };
  if (restaurant.isOpen === false) return { label: "Rejected", color: "rose", icon: XCircle };
  return { label: "Pending", color: "amber", icon: Clock };
};

const getRiskLevel = (uploadedDocuments, totalFields) => {
  const percentage = (uploadedDocuments / totalFields) * 100;
  if (percentage < 50) return { label: "High", color: "rose", icon: AlertTriangle };
  if (percentage < 100) return { label: "Medium", color: "amber", icon: Timer };
  return { label: "Low", color: "emerald", icon: ShieldCheck };
};

const countDocuments = (restaurant) => {
  return documentFields.reduce((count, field) => {
    const value = restaurant[field.key];
    if (Array.isArray(value)) return count + (value.length > 0 ? 1 : 0);
    return count + (value ? 1 : 0);
  }, 0);
};

const toRow = (restaurant) => {
  const uploadedDocuments = countDocuments(restaurant);
  const risk = getRiskLevel(uploadedDocuments, documentFields.length);
  const status = getStatus(restaurant);

  return {
    id: restaurant.id,
    raw: restaurant,
    name: restaurant.name,
    owner: restaurant.ownerName || restaurant.owner?.name || "Not available",
    city: [restaurant.city, restaurant.state].filter(Boolean).join(", ") || "Not available",
    status: status.label, // Store just the label string for the table
    statusColor: status.color, // Store color for styling
    statusIcon: status.icon, // Store icon for rendering
    documents: `${uploadedDocuments}/${documentFields.length}`,
    risk: risk.label, // Store just the label string for the table
    riskColor: risk.color,
    riskIcon: risk.icon,
    submitted: formatDate(restaurant.createdAt),
    phone: restaurant.phone || restaurant.owner?.phone || "Not available",
    email: restaurant.email || restaurant.owner?.email || "Not available",
  };
};

export default function PendingApprovals() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const loadRestaurants = useCallback(async () => {
    try {
      setError("");
      setLoading(true);
      const data = await apiRequest("/restaurants");
      setRestaurants(data.restaurants || []);
    } catch (err) {
      setError(err.message || "Failed to load pending approvals");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRestaurants();
  }, [loadRestaurants]);

  const rows = useMemo(() => restaurants.map(toRow), [restaurants]);
  const pendingCount = rows.filter((row) => row.status === "Pending").length;
  const approvedToday = rows.filter((row) => {
    const rawDate = row.raw.updatedAt || row.raw.createdAt;
    return row.status === "Approved" && new Date(rawDate).toDateString() === new Date().toDateString();
  }).length;
  const queuedDocuments = rows.reduce((total, row) => {
    const [uploaded] = row.documents.split("/").map(Number);
    return total + uploaded;
  }, 0);

  const documentQueue = useMemo(() => {
    return restaurants.flatMap((restaurant) => {
      const status = getStatus(restaurant);
      return documentFields
        .map((field) => ({ field, value: restaurant[field.key] }))
        .filter(({ value }) => (Array.isArray(value) ? value.length > 0 : Boolean(value)))
        .map(({ field, value }) => ({
          restaurant: restaurant.name,
          restaurantId: restaurant.id,
          document: field.label,
          icon: field.icon,
          href: Array.isArray(value) ? getUploadUrl(value[0]) : getUploadUrl(value),
          status: status.label,
          statusColor: status.color,
          statusIcon: status.icon,
          uploadedAt: formatDate(restaurant.updatedAt || restaurant.createdAt),
        }));
    });
  }, [restaurants]);

  const handleRowAction = async (action, row) => {
    if (action === "view") {
      setSelectedRestaurant(row);
      return;
    }

    try {
      setError("");
      setActionLoadingId(row.id);
      const data = await apiRequest(`/restaurants/${row.id}/approval`, {
        method: "PUT",
        body: JSON.stringify({ action }),
      });

      setRestaurants((current) =>
        current.map((restaurant) => (restaurant.id === row.id ? data.restaurant : restaurant))
      );
    } catch (err) {
      setError(err.message || `Failed to ${action} restaurant`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Enhanced stats with gradients
  const stats = [
    { 
      label: "Pending Restaurants", 
      value: pendingCount, 
      change: pendingCount > 0 ? `${pendingCount} awaiting review` : "All reviewed",
      icon: Store,
      gradient: "from-blue-500 to-blue-600"
    },
    { 
      label: "Under Review", 
      value: rows.filter((row) => row.status === "Pending").length, 
      change: "In queue",
      icon: Timer,
      gradient: "from-amber-500 to-amber-600"
    },
    { 
      label: "Documents Queued", 
      value: queuedDocuments, 
      change: `${queuedDocuments} total documents`,
      icon: FileCheck,
      gradient: "from-violet-500 to-violet-600"
    },
    { 
      label: "Approved Today", 
      value: approvedToday, 
      change: approvedToday > 0 ? "+" + approvedToday : "None yet",
      icon: ClipboardCheck,
      gradient: "from-emerald-500 to-emerald-600"
    },
  ];

  // Custom StatusBadge component for the table
  const StatusBadge = ({ status, color }) => {
    const getColorClasses = () => {
      switch(color) {
        case 'emerald': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        case 'rose': return 'bg-rose-50 text-rose-700 border-rose-200';
        case 'amber': return 'bg-amber-50 text-amber-700 border-amber-200';
        default: return 'bg-slate-50 text-slate-700 border-slate-200';
      }
    };
    
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${getColorClasses()}`}>
        <span className={`h-1.5 w-1.5 rounded-full bg-${color}-500`} />
        {status}
      </span>
    );
  };

  // Custom RiskBadge component
  const RiskBadge = ({ risk, color }) => {
    const getColorClasses = () => {
      switch(color) {
        case 'rose': return 'bg-rose-50 text-rose-700';
        case 'amber': return 'bg-amber-50 text-amber-700';
        case 'emerald': return 'bg-emerald-50 text-emerald-700';
        default: return 'bg-slate-50 text-slate-700';
      }
    };
    
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getColorClasses()}`}>
        {risk}
      </span>
    );
  };

  // Enhanced columns with custom rendering
  const enhancedColumns = [
    { key: "name", label: "Restaurant" },
    { key: "owner", label: "Owner" },
    { key: "city", label: "City" },
    { 
      key: "status", 
      label: "Status", 
      render: (row) => <StatusBadge status={row.status} color={row.statusColor} />
    },
    { key: "documents", label: "Documents" },
    { 
      key: "risk", 
      label: "Risk",
      render: (row) => <RiskBadge risk={row.risk} color={row.riskColor} />
    },
  ];

  return (
    <>
      <AdminFeaturePage
        title="Pending Approvals"
        description="Review restaurant registrations, verify documents, approve, reject, suspend, block, or request additional information."
        stats={stats}
        rows={rows}
        filters={["All", "Pending", "Approved", "Rejected"]}
        columns={enhancedColumns}
        loading={loading}
        error={error}
        onRefresh={loadRestaurants}
        onRowAction={handleRowAction}
        actionLoadingId={actionLoadingId}
      >
        {/* Document Queue Section */}
        {documentQueue.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Recent Document Submissions</h3>
                <p className="text-sm text-slate-500">Quickly review recently uploaded documents</p>
              </div>
              <button 
                onClick={() => window.open("/documents/all", "_blank")}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
              >
                View all <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {documentQueue.slice(0, 6).map((doc, idx) => {
                const StatusIcon = doc.statusIcon;
                const DocIcon = doc.icon;
                return (
                  <a
                    key={`${doc.restaurant}-${doc.document}`}
                    href={doc.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    {/* Status indicator bar */}
                    <div className={`absolute left-0 top-0 h-1 w-full bg-${doc.statusColor}-500`} />
                    
                    <div className="flex items-start justify-between gap-3">
                      <div className={`rounded-lg bg-${doc.statusColor}-50 p-2.5`}>
                        {DocIcon && <DocIcon className={`h-5 w-5 text-${doc.statusColor}-600`} />}
                      </div>
                      <ExternalLink className="h-4 w-4 text-slate-300 transition-colors group-hover:text-slate-500" />
                    </div>
                    
                    <div className="mt-3">
                      <p className="font-semibold text-slate-900 line-clamp-1">{doc.document}</p>
                      <p className="mt-1 text-sm text-slate-600 line-clamp-1">{doc.restaurant}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1 rounded-full bg-${doc.statusColor}-50 px-2 py-0.5 text-xs font-medium text-${doc.statusColor}-700`}>
                          {StatusIcon && <StatusIcon className="h-3 w-3" />}
                          {doc.status}
                        </span>
                        <span className="text-xs text-slate-400">{doc.uploadedAt}</span>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Stats Insight */}
        {!loading && rows.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50/50 to-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-slate-100 p-2">
                  <AlertTriangle className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Approval Summary</p>
                  <p className="text-xs text-slate-500">
                    {pendingCount} pending • {rows.filter(r => r.status === "Approved").length} approved • {rows.filter(r => r.status === "Rejected").length} rejected
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-xs text-slate-600">Low Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-xs text-slate-600">Medium Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-rose-500" />
                  <span className="text-xs text-slate-600">High Risk</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && rows.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
            <div className="mb-4 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 p-4">
              <ClipboardCheck className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">All caught up!</h3>
            <p className="mt-1 text-sm text-slate-500">No pending restaurant applications to review.</p>
            <button
              onClick={loadRestaurants}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg"
            >
              Refresh
            </button>
          </div>
        )}
      </AdminFeaturePage>
    </>
  );
}