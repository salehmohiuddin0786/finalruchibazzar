"use client";

import { Headphones, MessageSquare, TicketCheck, Timer } from "lucide-react";
import { AdminFeaturePage } from "../components/AdminFeaturePage";
import { useMainAdminData } from "../lib/useMainAdminData";

export default function SupportCenter() {
  const { rows, loading, error, refresh } = useMainAdminData("/mainadmin/support");

  return (
    <AdminFeaturePage
      title="Support Center"
      description="Support rows from the backend. Wire this endpoint to a ticket table when support storage is added."
      stats={[
        { label: "Open Tickets", value: rows.filter((row) => row.status === "Open").length, icon: TicketCheck },
        { label: "Avg Response", value: "Live", icon: Timer },
        { label: "Live Chats", value: 0, icon: MessageSquare },
        { label: "Resolved", value: rows.filter((row) => row.status === "Resolved").length, icon: Headphones },
      ]}
      rows={rows}
      filters={["All", "Open", "Resolved"]}
      columns={[
        { key: "id", label: "Ticket" },
        { key: "from", label: "From" },
        { key: "subject", label: "Subject" },
        { key: "priority", label: "Priority" },
        { key: "status", label: "Status", badge: true },
      ]}
      loading={loading}
      error={error}
      onRefresh={refresh}
    />
  );
}
