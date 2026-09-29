"use client";

import { BadgePercent, Gift, Image, Truck } from "lucide-react";
import { AdminFeaturePage } from "../components/AdminFeaturePage";
import { useMainAdminData } from "../lib/useMainAdminData";

export default function Promotions() {
  const { rows, loading, error, refresh } = useMainAdminData("/mainadmin/promotions");

  return (
    <AdminFeaturePage
      title="Promotions"
      description="Live coupon and offer campaigns from the backend."
      stats={[
        { label: "Campaigns", value: rows.length, icon: Gift },
        { label: "Active", value: rows.filter((row) => row.status === "Active").length, icon: BadgePercent },
        { label: "Draft", value: rows.filter((row) => row.status === "Draft").length, icon: Image },
        { label: "Delivery Offers", value: rows.filter((row) => row.type?.includes("Delivery")).length, icon: Truck },
      ]}
      rows={rows}
      filters={["All", "Active", "Draft"]}
      columns={[
        { key: "name", label: "Campaign" },
        { key: "type", label: "Type" },
        { key: "audience", label: "Audience" },
        { key: "discount", label: "Discount" },
        { key: "status", label: "Status", badge: true },
      ]}
      loading={loading}
      error={error}
      onRefresh={refresh}
    />
  );
}
