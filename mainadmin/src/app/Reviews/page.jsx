"use client";

import { Flag, MessageCircleWarning, Star, Trash2 } from "lucide-react";
import { AdminFeaturePage } from "../components/AdminFeaturePage";
import { useMainAdminData } from "../lib/useMainAdminData";

export default function Reviews() {
  const { rows, loading, error, refresh } = useMainAdminData("/mainadmin/reviews");

  return (
    <AdminFeaturePage
      title="Reviews"
      description="Live customer review moderation data from the backend."
      stats={[
        { label: "Reviews", value: rows.length, icon: Star },
        { label: "Flagged", value: rows.filter((row) => row.status === "Under Review").length, icon: Flag },
        { label: "Low Ratings", value: rows.filter((row) => Number(row.rating) <= 2).length, icon: MessageCircleWarning },
        { label: "Approved", value: rows.filter((row) => row.status === "Approved").length, icon: Trash2 },
      ]}
      rows={rows}
      filters={["All", "Approved", "Under Review"]}
      columns={[
        { key: "id", label: "Review" },
        { key: "restaurant", label: "Restaurant" },
        { key: "customer", label: "Customer" },
        { key: "rating", label: "Rating" },
        { key: "issue", label: "Issue" },
        { key: "status", label: "Status", badge: true },
      ]}
      loading={loading}
      error={error}
      onRefresh={refresh}
    />
  );
}
