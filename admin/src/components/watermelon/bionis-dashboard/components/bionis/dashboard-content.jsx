"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  IndianRupee,
  ShoppingCart,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChefHat,
  Truck,
  ArrowUpRight,
  RefreshCw,
  Search,
  Filter,
  ShieldCheck,
  Wallet,
  ExternalLink,
  Store,
  ChevronRight,
  Package,
  Layers,
  FileCheck2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ScoreDonut } from "./shared";
import { CalendarIcon } from "./icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000/api";

const timelineOptions = [
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "month", label: "This Month" },
];

export function DashboardContent() {
  const [timeline, setTimeline] = useState("today");
  const [chartView, setChartView] = useState("weekly"); // "weekly" | "monthly"
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLiveOnline, setIsLiveOnline] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [errorNotice, setErrorNotice] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Filters for recent orders table
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const [restaurant, setRestaurant] = useState({
    id: null,
    name: "Ruchi Partner",
    address: "Adilabad, Telangana",
    phone: "",
    rating: 4.8,
    commissionRate: 2,
    isOpen: true,
  });

  const [stats, setStats] = useState({
    todaysOrders: 0,
    todaysGrossSales: 0,
    todaysEarnings: 0,
    todaysCommission: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    availableBalance: 0,
    pendingSettlement: 0,
    grossFoodSales: 0,
    netEarnings: 0,
    totalCommission: 0,
    customerRating: 4.8,
  });

  const [orderStatusBreakdown, setOrderStatusBreakdown] = useState({
    pending: 0,
    confirmed: 0,
    preparing: 0,
    ready: 0,
    on_the_way: 0,
    delivered: 0,
    cancelled: 0,
  });

  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentPayouts, setRecentPayouts] = useState([]);

  // Mock data for development preview when unauthenticated
  const setDemoData = useCallback(() => {
    setIsPreviewMode(true);
    setRestaurant({
      id: 999,
      name: "Ruchi Spice Kitchen (Adilabad)",
      address: "Cinema Road, Adilabad, Telangana",
      phone: "+91 9985960692",
      rating: 4.85,
      commissionRate: 2,
      isOpen: true,
    });
    setStats({
      todaysOrders: 18,
      todaysGrossSales: 9450,
      todaysEarnings: 9261, // 98%
      todaysCommission: 189, // 2%
      pendingOrders: 4,
      completedOrders: 13,
      cancelledOrders: 1,
      availableBalance: 14250,
      pendingSettlement: 3500,
      grossFoodSales: 168400,
      netEarnings: 165032,
      totalCommission: 3368,
      customerRating: 4.85,
    });
    setOrderStatusBreakdown({
      pending: 1,
      confirmed: 1,
      preparing: 2,
      ready: 1,
      on_the_way: 2,
      delivered: 13,
      cancelled: 1,
    });
    setWeeklyData([
      { day: "Sun", revenue: 8400, orders: 16 },
      { day: "Mon", revenue: 6200, orders: 12 },
      { day: "Tue", revenue: 7100, orders: 14 },
      { day: "Wed", revenue: 8900, orders: 17 },
      { day: "Thu", revenue: 9450, orders: 18 },
      { day: "Fri", revenue: 11200, orders: 22 },
      { day: "Sat", revenue: 14500, orders: 28 },
    ]);
    setMonthlyRevenueData([
      { month: "Jan", revenue: 125000 },
      { month: "Feb", revenue: 138000 },
      { month: "Mar", revenue: 142000 },
      { month: "Apr", revenue: 156000 },
      { month: "May", revenue: 149000 },
      { month: "Jun", revenue: 165000 },
      { month: "Jul", revenue: 172000 },
      { month: "Aug", revenue: 168000 },
      { month: "Sep", revenue: 181000 },
      { month: "Oct", revenue: 165032 },
      { month: "Nov", revenue: 0 },
      { month: "Dec", revenue: 0 },
    ]);
    setPopularItems([
      { name: "Special Chicken Biryani", sales: 148, revenue: 38480, category: "Biryani" },
      { name: "Butter Chicken & Naan Combo", sales: 112, revenue: 26880, category: "Curries" },
      { name: "Paneer Butter Masala", sales: 94, revenue: 19740, category: "Vegetarian" },
      { name: "Hyderabadi Mutton Dum Biryani", sales: 86, revenue: 30100, category: "Biryani" },
      { name: "Adilabad Tandoori Platter", sales: 64, revenue: 17920, category: "Starters" },
    ]);
    setRecentOrders([
      {
        id: "ORD-1082",
        rawId: 1082,
        customer: "Rajesh Kumar",
        customerPhone: "+91 98480 12345",
        deliveryAddress: "Near Collectorate, Adilabad",
        items: 2,
        itemsDetail: "1x Special Chicken Biryani, 1x Garlic Naan",
        grossFoodSales: 420,
        subtotal: 420,
        platformCommission: 8.4,
        netRestaurantEarning: 411.6,
        status: "preparing",
        paymentStatus: "paid",
        time: "10 mins ago",
      },
      {
        id: "ORD-1081",
        rawId: 1081,
        customer: "Sana Begum",
        customerPhone: "+91 94401 56789",
        deliveryAddress: "Kailash Nagar, Adilabad",
        items: 3,
        itemsDetail: "2x Butter Chicken, 2x Butter Naan",
        grossFoodSales: 680,
        subtotal: 680,
        platformCommission: 13.6,
        netRestaurantEarning: 666.4,
        status: "ready",
        paymentStatus: "paid",
        time: "24 mins ago",
      },
      {
        id: "ORD-1080",
        rawId: 1080,
        customer: "Venkatesh Rao",
        customerPhone: "+91 99887 44321",
        deliveryAddress: "Bhavani Nagar, Adilabad",
        items: 1,
        itemsDetail: "1x Paneer Butter Masala",
        grossFoodSales: 240,
        subtotal: 240,
        platformCommission: 4.8,
        netRestaurantEarning: 235.2,
        status: "pending",
        paymentStatus: "paid",
        time: "32 mins ago",
      },
      {
        id: "ORD-1079",
        rawId: 1079,
        customer: "Mohd Imran",
        customerPhone: "+91 97000 88219",
        deliveryAddress: "Railway Station Road, Adilabad",
        items: 4,
        itemsDetail: "2x Mutton Dum Biryani, 2x Thums Up",
        grossFoodSales: 760,
        subtotal: 760,
        platformCommission: 15.2,
        netRestaurantEarning: 744.8,
        status: "delivered",
        paymentStatus: "paid",
        time: "1 hour ago",
      },
      {
        id: "ORD-1078",
        rawId: 1078,
        customer: "Ananya Sharma",
        customerPhone: "+91 98492 11440",
        deliveryAddress: "Housing Board Colony, Adilabad",
        items: 2,
        itemsDetail: "1x Veg Fried Rice, 1x Veg Manchurian",
        grossFoodSales: 350,
        subtotal: 350,
        platformCommission: 7.0,
        netRestaurantEarning: 343.0,
        status: "delivered",
        paymentStatus: "paid",
        time: "2 hours ago",
      },
    ]);
    setRecentPayouts([
      {
        id: "PAY-501",
        payoutNumber: "PAY-2026-10-W4",
        amount: 14250,
        status: "paid",
        utrNumber: "HDFC9823419082",
        createdAt: "2026-10-24T10:00:00Z",
      },
      {
        id: "PAY-500",
        payoutNumber: "PAY-2026-10-W3",
        amount: 18600,
        status: "paid",
        utrNumber: "SBIN8871239012",
        createdAt: "2026-10-17T11:30:00Z",
      },
      {
        id: "PAY-499",
        payoutNumber: "PAY-2026-10-W2",
        amount: 12900,
        status: "paid",
        utrNumber: "ICIC7765102938",
        createdAt: "2026-10-10T09:15:00Z",
      },
    ]);
  }, []);

  const fetchDashboardData = useCallback(
    async (showRefresh = false) => {
      if (showRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setErrorNotice("");

      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");

        if (!token) {
          setDemoData();
          return;
        }

        const res = await fetch(`${API_URL}/partner/dashboard`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          console.warn("Backend /partner/dashboard returned HTTP", res.status);
          setDemoData();
          return;
        }

        const data = await res.json();
        if (data.success) {
          setIsPreviewMode(false);
          if (data.restaurant) {
            setRestaurant(data.restaurant);
            setIsLiveOnline(data.restaurant.isOpen !== false);
          }
          if (data.stats) {
            setStats(data.stats);
          }
          if (data.orderStatusBreakdown) {
            setOrderStatusBreakdown(data.orderStatusBreakdown);
          }
          if (Array.isArray(data.weeklyData)) {
            setWeeklyData(data.weeklyData);
          }
          if (Array.isArray(data.monthlyRevenueData)) {
            // Map 12 months array into graph points
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const formatted = data.monthlyRevenueData.map((val, idx) => ({
              month: monthNames[idx] || `M${idx + 1}`,
              revenue: Number(val) || 0,
            }));
            setMonthlyRevenueData(formatted);
          }
          if (Array.isArray(data.popularItems)) {
            setPopularItems(data.popularItems);
          }
          if (Array.isArray(data.recentOrders)) {
            setRecentOrders(data.recentOrders);
          }
          if (Array.isArray(data.recentPayouts)) {
            setRecentPayouts(data.recentPayouts);
          }
        } else {
          setDemoData();
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setDemoData();
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [setDemoData]
  );

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Order status update action (Order Lifecycle)
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token || isPreviewMode) {
        // Optimistic UI update in preview mode
        setRecentOrders((prev) =>
          prev.map((ord) =>
            ord.rawId === orderId || ord.id === orderId
              ? { ...ord, status: newStatus }
              : ord
          )
        );
        showToast(`Order status updated to "${newStatus}" (Demo simulation)`);
        setUpdatingOrderId(null);
        return;
      }

      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const resData = await res.json();
      if (res.ok && resData.success) {
        setRecentOrders((prev) =>
          prev.map((ord) =>
            ord.rawId === orderId || ord.id === orderId
              ? { ...ord, status: newStatus }
              : ord
          )
        );
        showToast(`Order marked as "${newStatus}"`);
      } else {
        showToast(resData.message || "Failed to update status");
      }
    } catch (e) {
      showToast("Network error updating order");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return recentOrders.filter((ord) => {
      const matchesSearch =
        !orderSearchQuery ||
        ord.id?.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        ord.customer?.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        ord.customerPhone?.includes(orderSearchQuery);

      const matchesStatus =
        orderStatusFilter === "all" ||
        ord.status?.toLowerCase() === orderStatusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [recentOrders, orderSearchQuery, orderStatusFilter]);

  // Fulfillment score calculation
  const fulfillmentScore = useMemo(() => {
    const total =
      (orderStatusBreakdown.delivered || 0) +
      (orderStatusBreakdown.cancelled || 0);
    if (total === 0) return 98;
    const rate = Math.round(
      ((orderStatusBreakdown.delivered || 0) / total) * 100
    );
    return Math.max(75, Math.min(100, rate));
  }, [orderStatusBreakdown]);

  const selectedLabel =
    timelineOptions.find((o) => o.value === timeline)?.label ?? "Today";

  // Pie chart data for order status
  const statusPieData = useMemo(() => {
    return [
      { name: "Delivered", value: orderStatusBreakdown.delivered || 0, color: "#16a34a" },
      { name: "Preparing", value: orderStatusBreakdown.preparing || 0, color: "#f59e0b" },
      { name: "Ready", value: orderStatusBreakdown.ready || 0, color: "#0284c7" },
      { name: "On Way", value: orderStatusBreakdown.on_the_way || 0, color: "#8b5cf6" },
      { name: "Pending", value: orderStatusBreakdown.pending || 0, color: "#dc2626" },
      { name: "Cancelled", value: orderStatusBreakdown.cancelled || 0, color: "#9ca3af" },
    ].filter((item) => item.value > 0);
  }, [orderStatusBreakdown]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[420px] gap-3">
        <RefreshCw className="size-8 animate-spin text-red-600" />
        <p className="text-sm font-medium text-gray-500">
          Loading Ruchi Bazaar live operations...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="size-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Development Preview Banner */}
      {isPreviewMode && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-amber-900 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-amber-200/60 text-amber-800">
              <Store className="size-4" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Development Preview Mode
              </p>
              <p className="text-xs text-amber-700">
                Showing sample Adilabad restaurant analytics (2% Platform Commission • 98% Net Food Share).
              </p>
            </div>
          </div>
          <Link
            href="/Login"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
          >
            Log In as Approved Partner
          </Link>
        </div>
      )}

      {/* Top Header & Greeting Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
              {restaurant.name}
            </h1>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold",
                isLiveOnline
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-gray-100 text-gray-600"
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  isLiveOnline ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
                )}
              />
              {isLiveOnline ? "Accepting Orders (Adilabad)" : "Store Paused"}
            </span>
          </div>
          <p className="text-xs md:text-sm text-gray-500">
            Adilabad Kitchen Hub • Strict 2% Platform Commission Active (No GST)
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="h-10 gap-2 rounded-xl px-3.5 text-xs font-semibold tracking-tight shadow-xs border-gray-200"
              >
                <CalendarIcon className="size-4 text-red-600" />
                <span>{selectedLabel}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bionis-dashboard min-w-36">
              <DropdownMenuRadioGroup
                value={timeline}
                onValueChange={(val) => setTimeline(val)}
              >
                {timelineOptions.map((opt) => (
                  <DropdownMenuRadioItem
                    key={opt.value}
                    value={opt.value}
                    className="text-xs cursor-pointer font-medium text-gray-600 data-[state=checked]:text-red-600 data-[state=checked]:font-bold"
                  >
                    {opt.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            className="size-10 rounded-xl border-gray-200"
            onClick={() => fetchDashboardData(true)}
            disabled={isRefreshing}
            title="Refresh Live Data"
          >
            <RefreshCw
              className={cn("size-4 text-gray-600", isRefreshing && "animate-spin text-red-600")}
            />
          </Button>

          <Link
            href="/Orders?filter=active"
            className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <span>Live Kitchen</span>
            <span className="size-1.5 rounded-full bg-white animate-ping" />
          </Link>
        </div>
      </div>

      {/* Financial Health Banner (2% Commission + 98% Share + Delivery Slalbs) */}
      <section className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-4 md:p-5 rounded-2xl border border-red-200/70 bg-gradient-to-r from-red-50/70 via-white to-orange-50/50 shadow-xs">
        <div className="flex items-center gap-3.5">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white shadow-xs">
            <ShieldCheck className="size-6" />
          </span>
          <div>
            <h2 className="text-sm md:text-base font-bold text-gray-900 leading-tight">
              Ruchi Bazaar Financial Transparency Model
            </h2>
            <p className="text-xs text-gray-600 mt-0.5">
              Fixed <strong>2% Commission</strong> on food subtotal • <strong>98% Net Food Share</strong> to Restaurant • Delivery Fees (₹15/₹18/₹21/₹21+₹3/km) go <strong>100% to Driver</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
          <Link
            href="/Earnings"
            className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 hover:underline"
          >
            <span>Detailed Ledger</span>
            <ArrowUpRight className="size-3.5" />
          </Link>
          <Link
            href="/Earnings?tab=withdraw"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Wallet className="size-3.5" />
            <span>Withdraw Balance</span>
          </Link>
        </div>
      </section>

      {/* 6 Core KPI Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* Card 1: Today's Gross Food Sales */}
        <article className="flex flex-col justify-between p-4 rounded-2xl border border-gray-200/80 bg-white shadow-xs hover:border-red-200 transition-all">
          <div className="flex items-center justify-between gap-2">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <ShoppingCart className="size-3.5" />
            </span>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Sales
            </span>
          </div>
          <div className="mt-3">
            <p className="text-xs text-gray-500 font-medium">Gross Food Sales</p>
            <p className="text-2xl font-bold text-gray-900 tracking-tight mt-0.5">
              ₹{(timeline === "today" ? stats.todaysGrossSales : stats.grossFoodSales).toLocaleString("en-IN")}
            </p>
            <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
              <span>{timeline === "today" ? "Today's total orders" : "Cumulative food total"}</span>
            </p>
          </div>
        </article>

        {/* Card 2: Net Restaurant Earnings (98%) */}
        <article className="flex flex-col justify-between p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/20 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between gap-2">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <IndianRupee className="size-3.5" />
            </span>
            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded uppercase">
              98% Net
            </span>
          </div>
          <div className="mt-3">
            <p className="text-xs text-emerald-800 font-semibold">Your Food Share</p>
            <p className="text-2xl font-extrabold text-emerald-900 tracking-tight mt-0.5">
              ₹{(timeline === "today" ? stats.todaysEarnings : stats.netEarnings).toLocaleString("en-IN")}
            </p>
            <p className="text-[11px] text-emerald-700/80 mt-1">
              Credited directly to wallet
            </p>
          </div>
        </article>

        {/* Card 3: Platform Commission (2%) */}
        <article className="flex flex-col justify-between p-4 rounded-2xl border border-red-200/70 bg-red-50/20 shadow-xs hover:border-red-300 transition-all">
          <div className="flex items-center justify-between gap-2">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <ShieldCheck className="size-3.5" />
            </span>
            <span className="text-[10px] font-extrabold text-red-700 bg-red-100 px-1.5 py-0.5 rounded uppercase">
              2% Fee
            </span>
          </div>
          <div className="mt-3">
            <p className="text-xs text-red-800 font-semibold">Platform Fee</p>
            <p className="text-2xl font-bold text-red-900 tracking-tight mt-0.5">
              ₹{(timeline === "today" ? stats.todaysCommission : stats.totalCommission).toLocaleString("en-IN")}
            </p>
            <p className="text-[11px] text-red-700/80 mt-1">
              Strict 2% • 0% GST
            </p>
          </div>
        </article>

        {/* Card 4: Available Withdrawal Balance */}
        <article className="flex flex-col justify-between p-4 rounded-2xl border border-gray-200/80 bg-white shadow-xs hover:border-emerald-200 transition-all">
          <div className="flex items-center justify-between gap-2">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <Wallet className="size-3.5" />
            </span>
            <Link
              href="/Earnings?tab=withdraw"
              className="text-[11px] font-bold text-purple-600 hover:underline"
            >
              Payout →
            </Link>
          </div>
          <div className="mt-3">
            <p className="text-xs text-gray-500 font-medium">Available Balance</p>
            <p className="text-2xl font-bold text-gray-900 tracking-tight mt-0.5">
              ₹{Number(stats.availableBalance || 0).toLocaleString("en-IN")}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              Min withdrawal ₹100
            </p>
          </div>
        </article>

        {/* Card 5: Orders Snapshot */}
        <article className="flex flex-col justify-between p-4 rounded-2xl border border-gray-200/80 bg-white shadow-xs hover:border-gray-300 transition-all">
          <div className="flex items-center justify-between gap-2">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Clock className="size-3.5" />
            </span>
            <span className="text-[11px] font-bold text-amber-600">
              {stats.pendingOrders} Active
            </span>
          </div>
          <div className="mt-3">
            <p className="text-xs text-gray-500 font-medium">Orders Count</p>
            <p className="text-2xl font-bold text-gray-900 tracking-tight mt-0.5">
              {stats.todaysOrders || (stats.completedOrders + stats.pendingOrders)}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              {stats.completedOrders} fulfilled today
            </p>
          </div>
        </article>

        {/* Card 6: Customer Rating & Satisfaction */}
        <article className="flex flex-col justify-between p-4 rounded-2xl border border-gray-200/80 bg-white shadow-xs hover:border-gray-300 transition-all">
          <div className="flex items-center justify-between gap-2">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
              <Store className="size-3.5" />
            </span>
            <span className="text-[11px] font-bold text-orange-600">
              ★ {restaurant.rating || 4.8}
            </span>
          </div>
          <div className="mt-3">
            <p className="text-xs text-gray-500 font-medium">Fulfillment Score</p>
            <p className="text-2xl font-bold text-gray-900 tracking-tight mt-0.5">
              {fulfillmentScore}%
            </p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">
              Adilabad Top Rated
            </p>
          </div>
        </article>
      </section>

      {/* Performance & Analytics Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Net Revenue & Order Volume Trends (2 Cols) */}
        <article className="lg:col-span-2 flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                  <TrendingUp className="size-4" />
                </span>
                <h3 className="text-base font-bold text-gray-900">
                  Revenue & Order Volume
                </h3>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Net restaurant food earnings (98%) across days
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setChartView("weekly")}
                className={cn(
                  "px-3 py-1 rounded-lg transition-all cursor-pointer",
                  chartView === "weekly"
                    ? "bg-white text-gray-900 shadow-xs"
                    : "text-gray-500 hover:text-gray-800"
                )}
              >
                7-Day Weekly
              </button>
              <button
                onClick={() => setChartView("monthly")}
                className={cn(
                  "px-3 py-1 rounded-lg transition-all cursor-pointer",
                  chartView === "monthly"
                    ? "bg-white text-gray-900 shadow-xs"
                    : "text-gray-500 hover:text-gray-800"
                )}
              >
                12-Month Annual
              </button>
            </div>
          </div>

          <div className="h-68 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              {chartView === "weekly" ? (
                <AreaChart
                  data={weeklyData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#dc2626" stopOpacity={0.24} />
                      <stop offset="100%" stopColor="#dc2626" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis
                    dataKey="day"
                    stroke="#9ca3af"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `₹${val}`}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const rev = Number(payload[0].value || 0);
                        const ords = payload[0].payload?.orders || 0;
                        return (
                          <div className="bg-gray-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1">
                            <p className="font-bold text-gray-300">{label}</p>
                            <p className="text-emerald-400 font-semibold">
                              Net Food Earning: ₹{rev.toLocaleString("en-IN")}
                            </p>
                            <p className="text-gray-300">
                              Estimated Orders: {ords}
                            </p>
                            <p className="text-[10px] text-gray-400 pt-1 border-t border-gray-700">
                              2% Platform fee deducted at source
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#dc2626"
                    strokeWidth={2.5}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              ) : (
                <BarChart
                  data={monthlyRevenueData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis
                    dataKey="month"
                    stroke="#9ca3af"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `₹${Math.round(val / 1000)}k`}
                  />
                  <Tooltip
                    formatter={(val) => [`₹${Number(val).toLocaleString("en-IN")}`, "Net Earnings"]}
                  />
                  <Bar dataKey="revenue" fill="#dc2626" radius={[6, 6, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100 mt-2">
            <span>Weekly gross volume includes food items only</span>
            <span className="font-bold text-emerald-600">
              Delivery fees go 100% to drivers
            </span>
          </div>
        </article>

        {/* Right: Order Status Distribution & Donut (1 Col) */}
        <article className="flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                  <ChefHat className="size-4" />
                </span>
                <h3 className="text-base font-bold text-gray-900">
                  Kitchen Operations
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {fulfillmentScore}% On-Time
              </span>
            </div>

            <div className="flex items-center justify-center py-2">
              <div className="relative size-36">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusPieData.length ? statusPieData : [{ name: "Active", value: 1, color: "#16a34a" }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={64}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {(statusPieData.length ? statusPieData : [{ color: "#16a34a" }]).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-black text-gray-900">
                    {orderStatusBreakdown.delivered || 0}
                  </span>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    Fulfilled
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-3">
              <div className="flex items-center justify-between text-xs py-1 border-b border-gray-100">
                <span className="flex items-center gap-2 text-gray-600">
                  <span className="size-2 rounded-full bg-emerald-600" />
                  Delivered Successfully
                </span>
                <span className="font-bold text-gray-900">{orderStatusBreakdown.delivered || 0}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1 border-b border-gray-100">
                <span className="flex items-center gap-2 text-gray-600">
                  <span className="size-2 rounded-full bg-amber-500" />
                  Preparing in Kitchen
                </span>
                <span className="font-bold text-amber-600">{orderStatusBreakdown.preparing || 0}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1 border-b border-gray-100">
                <span className="flex items-center gap-2 text-gray-600">
                  <span className="size-2 rounded-full bg-sky-500" />
                  Ready for Pickup
                </span>
                <span className="font-bold text-sky-600">{orderStatusBreakdown.ready || 0}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1 border-b border-gray-100">
                <span className="flex items-center gap-2 text-gray-600">
                  <span className="size-2 rounded-full bg-red-600" />
                  New Orders Pending
                </span>
                <span className="font-bold text-red-600">{orderStatusBreakdown.pending || 0}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1">
                <span className="flex items-center gap-2 text-gray-600">
                  <span className="size-2 rounded-full bg-gray-400" />
                  Cancelled
                </span>
                <span className="font-bold text-gray-500">{orderStatusBreakdown.cancelled || 0}</span>
              </div>
            </div>
          </div>

          <Link
            href="/Orders"
            className="w-full mt-4 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors"
          >
            <span>Open Order Manager</span>
            <ChevronRight className="size-3.5" />
          </Link>
        </article>
      </section>

      {/* Popular Menu Items & Recent Financial Transactions Row */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Menu Items Card */}
        <article className="flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs">
          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                  <Layers className="size-4" />
                </span>
                <h3 className="text-base font-bold text-gray-900">
                  Popular Dishes
                </h3>
              </div>
              <Link
                href="/Menu"
                className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline"
              >
                Manage Menu →
              </Link>
            </div>

            <div className="divide-y divide-gray-100">
              {popularItems.length === 0 ? (
                <p className="text-xs text-gray-400 py-6 text-center">
                  No dish sales recorded yet.
                </p>
              ) : (
                popularItems.slice(0, 5).map((item, idx) => (
                  <div key={item.name} className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-600">
                        #{idx + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {item.category || "Main Dish"} • {item.sales} orders
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs font-bold text-gray-900">
                        ₹{Number(item.revenue || 0).toLocaleString("en-IN")}
                      </p>
                      <p className="text-[10px] text-emerald-600 font-semibold">
                        ₹{Math.round(Number(item.revenue || 0) * 0.98).toLocaleString("en-IN")} net
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>High-demand Adilabad favourites</span>
            <span className="font-semibold text-gray-700">
              98% partner retention
            </span>
          </div>
        </article>

        {/* Recent Settlements & UTR Bank Transfers Card */}
        <article className="flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs">
          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <FileCheck2 className="size-4" />
                </span>
                <h3 className="text-base font-bold text-gray-900">
                  Weekly Bank Settlements
                </h3>
              </div>
              <Link
                href="/Earnings?tab=payouts"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                All Payouts →
              </Link>
            </div>

            <div className="divide-y divide-gray-100">
              {recentPayouts.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="text-xs text-gray-400">No bank settlements generated yet.</p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Withdrawals are processed weekly with direct UTR transfer confirmation.
                  </p>
                </div>
              ) : (
                recentPayouts.slice(0, 4).map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-2.5">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900">
                          {p.payoutNumber || `PAY-${p.id}`}
                        </span>
                        <span
                          className={cn(
                            "px-1.5 py-0.2 rounded text-[10px] font-bold uppercase",
                            p.status === "paid"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          )}
                        >
                          {p.status}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-gray-500">
                        UTR: <strong className="text-gray-800">{p.utrNumber || "Processing"}</strong>
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-extrabold text-gray-900">
                        ₹{Number(p.approvedAmount || p.amount || 0).toLocaleString("en-IN")}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "Recent"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>Mandatory bank UTR for all payout releases</span>
            <Link
              href="/Earnings?tab=withdraw"
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              Request Withdrawal
            </Link>
          </div>
        </article>
      </section>

      {/* Live Recent Orders Table (Order Lifecycle) */}
      <section className="flex flex-col gap-4 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                <ChefHat className="size-4" />
              </span>
              <h3 className="text-base font-bold text-gray-900">
                Recent Restaurant Orders
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage incoming customer orders, kitchen prep, and live status
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 size-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order #, customer..."
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                className="h-9 pl-8 pr-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 w-48 sm:w-56"
              />
            </div>

            <select
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value)}
              className="h-9 px-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-gray-700 font-medium cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready for Pickup</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-3.5">Order</th>
                <th className="py-3 px-3.5">Customer & Destination</th>
                <th className="py-3 px-3.5">Items Ordered</th>
                <th className="py-3 px-3.5 text-right">Food Subtotal</th>
                <th className="py-3 px-3.5 text-right text-red-600">2% Fee</th>
                <th className="py-3 px-3.5 text-right text-emerald-700 font-bold">98% Your Share</th>
                <th className="py-3 px-3.5 text-center">Status</th>
                <th className="py-3 px-3.5 text-right">Kitchen Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const status = String(ord.status || "pending").toLowerCase();
                  return (
                    <tr key={ord.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span className="font-bold text-gray-900 block">{ord.id}</span>
                        <span className="text-[10px] text-gray-400">{ord.time}</span>
                      </td>

                      <td className="py-3 px-3.5 min-w-[150px]">
                        <p className="font-bold text-gray-900">{ord.customer}</p>
                        <p className="text-[10px] text-gray-500">{ord.customerPhone}</p>
                        <p className="text-[10px] text-gray-400 truncate max-w-xs">{ord.deliveryAddress}</p>
                      </td>

                      <td className="py-3 px-3.5 max-w-xs">
                        <p className="text-xs text-gray-800 line-clamp-1">
                          {ord.itemsDetail || `${ord.items} items`}
                        </p>
                        <span className="text-[10px] text-gray-400">
                          {ord.items} {ord.items === 1 ? "dish" : "dishes"}
                        </span>
                      </td>

                      <td className="py-3 px-3.5 text-right whitespace-nowrap font-semibold text-gray-900">
                        ₹{Number(ord.grossFoodSales || ord.subtotal || 0).toFixed(2)}
                      </td>

                      <td className="py-3 px-3.5 text-right whitespace-nowrap text-red-600 font-semibold">
                        ₹{Number(ord.platformCommission || 0).toFixed(2)}
                      </td>

                      <td className="py-3 px-3.5 text-right whitespace-nowrap text-emerald-700 font-bold">
                        ₹{Number(ord.netRestaurantEarning || 0).toFixed(2)}
                      </td>

                      <td className="py-3 px-3.5 text-center whitespace-nowrap">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize",
                            status === "delivered" && "bg-emerald-100 text-emerald-800",
                            status === "preparing" && "bg-amber-100 text-amber-800",
                            status === "ready" && "bg-sky-100 text-sky-800",
                            status === "pending" && "bg-red-100 text-red-800",
                            status === "cancelled" && "bg-gray-100 text-gray-600"
                          )}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="py-3 px-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {status === "pending" && (
                            <button
                              onClick={() => handleUpdateOrderStatus(ord.rawId || ord.id, "preparing")}
                              disabled={updatingOrderId === (ord.rawId || ord.id)}
                              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
                            >
                              Prepare
                            </button>
                          )}
                          {status === "preparing" && (
                            <button
                              onClick={() => handleUpdateOrderStatus(ord.rawId || ord.id, "ready")}
                              disabled={updatingOrderId === (ord.rawId || ord.id)}
                              className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
                            >
                              Ready
                            </button>
                          )}
                          {status === "ready" && (
                            <button
                              onClick={() => handleUpdateOrderStatus(ord.rawId || ord.id, "delivered")}
                              disabled={updatingOrderId === (ord.rawId || ord.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
                            >
                              Delivered
                            </button>
                          )}
                          <Link
                            href={`/Orders`}
                            className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                            title="View Full Order"
                          >
                            <ExternalLink className="size-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
          <span>
            Showing {filteredOrders.length} of {recentOrders.length} recent orders
          </span>
          <Link
            href="/Orders"
            className="font-bold text-red-600 hover:text-red-700 hover:underline"
          >
            Manage All Orders & Live Dispatch →
          </Link>
        </div>
      </section>
    </div>
  );
}