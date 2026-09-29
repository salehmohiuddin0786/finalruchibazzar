"use client";

import { Clock, FileClock, ListChecks, Shield } from "lucide-react";
import { AdminFeaturePage } from "../components/AdminFeaturePage";
import { useMainAdminData } from "../lib/useMainAdminData";

export default function AuditLogs() {
  const { rows, loading, error, refresh } = useMainAdminData("/mainadmin/audit-logs");

  return (
    <AdminFeaturePage
      title="Audit Logs"
      description="Live auditable admin actions recorded in the backend."
      stats={[
        { label: "Actions", value: rows.length, icon: ListChecks },
        { label: "Security Actions", value: rows.filter((row) => row.reason?.includes("User")).length, icon: Shield },
        { label: "Latest Event", value: rows[0]?.time || "None", icon: Clock },
        { label: "Retained Logs", value: "DB", icon: FileClock },
      ]}
      rows={rows}
      filters={["All"]}
      columns={[
        { key: "action", label: "Action" },
        { key: "user", label: "User / Entity" },
        { key: "admin", label: "Admin" },
        { key: "time", label: "Date & Time" },
        { key: "reason", label: "Reason" },
      ]}
      loading={loading}
      error={error}
      onRefresh={refresh}
    />
  );
}
