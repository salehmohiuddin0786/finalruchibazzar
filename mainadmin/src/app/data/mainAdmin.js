import {
  BadgeIndianRupee,
  Bell,
  ClipboardCheck,
  CreditCard,
  FileBarChart,
  FileText,
  Gift,
  Headphones,
  ListChecks,
  MapPinned,
  ReceiptText,
  Settings,
  ShieldAlert,
  ShoppingBag,
  Star,
  Store,
  Truck,
  UserCog,
  Users,
  Wallet,
  ShieldCheck,
} from "lucide-react";

export const parseCurrency = (value) => {
  const parsed = Number(String(value ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

export const money = (value) => `₹${parseCurrency(value).toLocaleString("en-IN")}`;

export const statusStyles = {
  Active: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Blocked: "bg-red-50 text-red-700 border-red-100",
  Cancelled: "bg-rose-50 text-rose-700 border-rose-100",
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Draft: "bg-slate-50 text-slate-700 border-slate-100",
  Failed: "bg-rose-50 text-rose-700 border-rose-100",
  Open: "bg-blue-50 text-blue-700 border-blue-100",
  Pending: "bg-amber-50 text-amber-700 border-amber-100",
  Rejected: "bg-rose-50 text-rose-700 border-rose-100",
  Resolved: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Sent: "bg-indigo-50 text-indigo-700 border-indigo-100",
  Success: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Suspended: "bg-orange-50 text-orange-700 border-orange-100",
  "Under Review": "bg-sky-50 text-sky-700 border-sky-100",
  Verified: "bg-emerald-50 text-emerald-700 border-emerald-100",
};

export const navSections = [
  {
    label: "Operate",
    items: [
      { name: "Dashboard", href: "/SuperDashboard", icon: FileBarChart },
      { name: "Restaurants", href: "/ManageVendors", icon: Store },
      { name: "Pending Approvals", href: "/PendingApprovals", icon: ClipboardCheck },
      { name: "Customers", href: "/ManageCustomers", icon: Users },
      { name: "Delivery Partners", href: "/ManagePartners", icon: Truck },
      { name: "Orders", href: "/AllOrders", icon: ShoppingBag },
    ],
  },
  {
    label: "Finance",
    items: [
      { name: "Earnings", href: "/Earnings", icon: BadgeIndianRupee },
      { name: "Payments", href: "/Payments", icon: CreditCard },
      { name: "Payouts", href: "/Payouts", icon: Wallet },
      { name: "GST Management", href: "/GSTManagement", icon: ReceiptText },
      { name: "Reports", href: "/Reports", icon: FileText },
    ],
  },
  {
    label: "Risk & Growth",
    items: [
      { name: "Fraud Management", href: "/FraudManagement", icon: ShieldAlert },
      { name: "Reviews", href: "/Reviews", icon: Star },
      { name: "Support Center", href: "/SupportCenter", icon: Headphones },
      { name: "Promotions", href: "/Promotions", icon: Gift },
      { name: "Notifications", href: "/Notifications", icon: Bell },
    ],
  },
  {
    label: "Platform",
    items: [
      { name: "Service Zones", href: "/ServiceZones", icon: MapPinned },
      { name: "Sub Admins", href: "/SubAdmins", icon: UserCog },
      { name: "Audit Logs", href: "/AuditLogs", icon: ListChecks },
      { name: "Settings", href: "/Settings", icon: Settings },
      { name: "Platform Policies", href: "/Policies", icon: ShieldCheck },
    ],
  },
];
