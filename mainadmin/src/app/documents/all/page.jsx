"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ExternalLink, File, FileCheck, FileText, Image, RefreshCw, Search } from "lucide-react";
import SuperLayout from "../../SuperLayout/page";
import { apiRequest, getUploadUrl } from "../../lib/api";

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

const getRestaurantStatus = (restaurant) => {
  if (restaurant.isApproved) return "Approved";
  if (restaurant.isOpen === false) return "Rejected";
  return "Pending";
};

const toDocumentRows = (restaurants) =>
  restaurants.flatMap((restaurant) =>
    documentFields.flatMap((field) => {
      const value = restaurant[field.key];
      const files = Array.isArray(value) ? value : value ? [value] : [];

      return files.map((filePath, index) => ({
        id: `${restaurant.id}-${field.key}-${index}`,
        restaurant: restaurant.name || "Restaurant",
        owner: restaurant.ownerName || restaurant.owner?.name || "Not available",
        document: field.label,
        required: field.required,
        status: getRestaurantStatus(restaurant),
        uploadedAt: formatDate(restaurant.updatedAt || restaurant.createdAt),
        href: getUploadUrl(filePath),
        icon: field.icon,
      }));
    })
  );

export default function AllDocumentsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRestaurants = useCallback(async () => {
    try {
      setError("");
      setLoading(true);
      const data = await apiRequest("/restaurants");
      setRestaurants(data.restaurants || []);
    } catch (err) {
      setError(err.message || "Failed to load restaurant documents");
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRestaurants();
  }, [loadRestaurants]);

  const rows = useMemo(() => toDocumentRows(restaurants), [restaurants]);
  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return rows;

    return rows.filter((row) =>
      [row.restaurant, row.owner, row.document, row.status].join(" ").toLowerCase().includes(normalized)
    );
  }, [query, rows]);

  return (
    <SuperLayout>
      <div className="min-w-0 space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h1 className="break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl xl:text-4xl">
              Restaurant Documents
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-500">
              Review uploaded restaurant verification documents from every vendor application.
            </p>
          </div>
          <button
            onClick={loadRestaurants}
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 disabled:opacity-60 sm:w-auto"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-100 bg-rose-50 px-5 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-400"
                placeholder="Search documents..."
              />
            </div>
          </div>

          <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {loading && rows.length === 0 ? (
              <div className="col-span-full py-12 text-center text-sm text-slate-500">Loading documents...</div>
            ) : filteredRows.length === 0 ? (
              <div className="col-span-full py-12 text-center text-sm text-slate-500">No documents found.</div>
            ) : (
              filteredRows.map((row) => {
                const Icon = row.icon;
                return (
                  <a
                    key={row.id}
                    href={row.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group min-w-0 rounded-lg border border-slate-100 bg-white p-4 transition-all hover:border-slate-200 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="rounded-lg bg-slate-100 p-2.5">
                          <Icon className="h-5 w-5 text-slate-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="break-words text-sm font-semibold text-slate-900">{row.document}</p>
                          <p className="mt-1 break-words text-sm text-slate-600">{row.restaurant}</p>
                          <p className="mt-1 break-words text-xs text-slate-400">{row.owner}</p>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-slate-500" />
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                        {row.status}
                      </span>
                      <span className="text-xs text-slate-400">{row.uploadedAt}</span>
                    </div>
                  </a>
                );
              })
            )}
          </div>
        </div>
      </div>
    </SuperLayout>
  );
}
