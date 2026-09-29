"use client";

import { Bell, Mail, Megaphone, Smartphone } from "lucide-react";
import { AdminFeaturePage } from "../components/AdminFeaturePage";
import { useMainAdminData } from "../lib/useMainAdminData";

export default function Notifications() {
  const { rows, loading, error, refresh } = useMainAdminData("/mainadmin/notifications");

  return (
    <AdminFeaturePage
      title="Notifications"
      description="Notification rows returned from the backend notification module."
      stats={[
        { label: "Messages", value: rows.length, icon: Smartphone },
        { label: "Sent", value: rows.filter((row) => row.status === "Sent").length, icon: Bell },
        { label: "Draft", value: rows.filter((row) => row.status === "Draft").length, icon: Mail },
        { label: "Broadcasts", value: rows.filter((row) => row.channel === "Broadcast").length, icon: Megaphone },
      ]}
      rows={rows}
      filters={["All", "Sent", "Draft"]}
      columns={[
        { key: "title", label: "Message" },
        { key: "channel", label: "Channel" },
        { key: "audience", label: "Audience" },
        { key: "status", label: "Status", badge: true },
      ]}
      loading={loading}
      error={error}
      onRefresh={refresh}
    />
  );
}
