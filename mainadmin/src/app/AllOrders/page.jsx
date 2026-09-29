"use client";

import { CheckCircle, IndianRupee, ShoppingBag, Truck } from "lucide-react";
import { AdminFeaturePage } from "../components/AdminFeaturePage";
import { money, parseCurrency } from "../data/mainAdmin";
import { useMainAdminData } from "../lib/useMainAdminData";

export default function AllOrders() {
  const { rows, loading, error, refresh } = useMainAdminData("/mainadmin/orders");

  return (
    <AdminFeaturePage
      title="Order Management"
      description="Live platform orders from the backend with customer, restaurant, payment, status, and delivery partner."
      stats={[
        { label: "Total Orders", value: rows.length, icon: ShoppingBag },
        {
          label: "Revenue",
          value: money(rows.reduce((sum, row) => sum + parseCurrency(row.amount), 0)),
          icon: IndianRupee,
        },
        { label: "Delivered", value: rows.filter((row) => row.status === "Delivered").length, icon: CheckCircle },
        { label: "Assigned Partners", value: rows.filter((row) => row.partner !== "Not assigned").length, icon: Truck },
      ]}
      rows={rows}
      filters={["All", "Pending", "Accepted", "Preparing", "Ready", "Delivered", "Cancelled"]}
      columns={[
        { key: "id", label: "Order" },
        { key: "customer", label: "Customer" },
        { key: "restaurant", label: "Restaurant" },
        { key: "amount", label: "Amount" },
        { key: "payment", label: "Payment" },
        { key: "status", label: "Status", badge: true },
      ]}
      loading={loading}
      error={error}
      onRefresh={refresh}
    />
  );
}
