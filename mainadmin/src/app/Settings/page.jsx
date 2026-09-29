"use client";

import { CreditCard, Megaphone, Percent, Settings as SettingsIcon } from "lucide-react";
import { AdminFeaturePage } from "../components/AdminFeaturePage";
import { useMainAdminData } from "../lib/useMainAdminData";

export default function Settings() {
  const { rows, loading, error, refresh } = useMainAdminData("/mainadmin/settings");

  return (
    <AdminFeaturePage
      title="Platform Settings"
      description="Platform configuration rows returned from the backend settings module."
      stats={[
        { label: "Settings Groups", value: rows.length, icon: SettingsIcon },
        { label: "Commission", value: rows.find((row) => row.title?.includes("Commission"))?.value || "Backend", icon: Percent },
        { label: "Payments", value: rows.find((row) => row.title?.includes("Payment"))?.value || "Backend", icon: CreditCard },
        { label: "Notifications", value: rows.find((row) => row.title?.includes("Notification"))?.value || "Backend", icon: Megaphone },
      ]}
      rows={rows}
      filters={["All"]}
      columns={[
        { key: "title", label: "Setting" },
        { key: "value", label: "Current Value" },
      ]}
      loading={loading}
      error={error}
      onRefresh={refresh}
    />
  );
}
