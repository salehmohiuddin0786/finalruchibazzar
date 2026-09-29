"use client";

import { MapPinned, Pin, Route, Truck } from "lucide-react";
import { AdminFeaturePage } from "../components/AdminFeaturePage";
import { useMainAdminData } from "../lib/useMainAdminData";

export default function ServiceZones() {
  const { rows, loading, error, refresh } = useMainAdminData("/mainadmin/service-zones");

  return (
    <AdminFeaturePage
      title="Service Zones"
      description="Delivery zone rows returned from the backend service-zone module."
      stats={[
        { label: "Delivery Zones", value: rows.length, icon: MapPinned },
        { label: "Pincodes", value: rows.reduce((sum, row) => sum + String(row.pincodes || "").split(",").filter(Boolean).length, 0), icon: Pin },
        { label: "Assigned Partners", value: rows.reduce((sum, row) => sum + Number(row.partners || 0), 0), icon: Truck },
        { label: "Restricted Areas", value: 0, icon: Route },
      ]}
      rows={rows}
      filters={["All", "Active", "Under Review"]}
      columns={[
        { key: "zone", label: "Zone" },
        { key: "pincodes", label: "Pincodes" },
        { key: "partners", label: "Partners" },
        { key: "status", label: "Status", badge: true },
      ]}
      loading={loading}
      error={error}
      onRefresh={refresh}
    />
  );
}
