"use client";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import StatsCard from "./components/StatsCard";
import {
  TrendingUp,
  ShoppingCart,
  IndianRupee,
  Clock,
  Star,
  BarChart3,
  Package,
  ChefHat,
  Users,
  Menu,
  AlertCircle,
  RefreshCw,
  LogOut,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();

  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [restaurantData, setRestaurantData] = useState(null);

  const [dashboardData, setDashboardData] = useState({
    stats: {
      todaysOrders: 0,
      todaysEarnings: 0,
      pendingOrders: 0,
      customerRating: 0,
    },
    recentOrders: [],
    popularItems: [],
    revenueData: {
      currentMonth: 0,
      lastMonth: 0,
      percentageChange: 0,
      monthlyData: [],
    },
    quickStats: {
      avgOrderValue: 0,
      customerSatisfaction: 0,
      peakHours: "7-9 PM",
      tableTurnover: 0,
    },
  });

  const setMockData = () => {
    setDashboardData({
      stats: {
        todaysOrders: 25,
        todaysEarnings: 12500,
        pendingOrders: 6,
        customerRating: 4.5,
      },
      recentOrders: [
        {
          id: "ORD-1024",
          customer: "Rahul Sharma",
          items: 3,
          amount: 850,
          status: "preparing",
          time: "10:30 AM",
        },
        {
          id: "ORD-1023",
          customer: "Priya Patel",
          items: 2,
          amount: 650,
          status: "delivered",
          time: "10:15 AM",
        },
        {
          id: "ORD-1022",
          customer: "Amit Kumar",
          items: 4,
          amount: 1250,
          status: "preparing",
          time: "9:45 AM",
        },
        {
          id: "ORD-1021",
          customer: "Neha Singh",
          items: 1,
          amount: 350,
          status: "pending",
          time: "9:30 AM",
        },
        {
          id: "ORD-1020",
          customer: "Vikram Mehta",
          items: 2,
          amount: 720,
          status: "delivered",
          time: "9:15 AM",
        },
      ],
      popularItems: [
        { name: "Chicken Biryani", sales: 145, revenue: 43500 },
        { name: "Butter Chicken", sales: 98, revenue: 29400 },
        { name: "Paneer Tikka", sales: 76, revenue: 22800 },
        { name: "Garlic Naan", sales: 210, revenue: 31500 },
        { name: "Mango Lassi", sales: 156, revenue: 23400 },
      ],
      revenueData: {
        currentMonth: 185000,
        lastMonth: 160500,
        percentageChange: 15.2,
        monthlyData: [40, 65, 80, 60, 90, 75, 85, 70, 95, 65, 80, 70],
      },
      quickStats: {
        avgOrderValue: 520,
        customerSatisfaction: 94,
        peakHours: "7-9 PM",
        tableTurnover: 2.8,
      },
    });
  };

  const fetchDashboardData = useCallback(async (showRefresh = false) => {
    if (showRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    setError("");

    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) {
        setMockData();
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/partner/dashboard",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        setMockData();
        return;
      }

      const data = await response.json();

      setDashboardData({
        stats: {
          todaysOrders: data.todaysOrders || 0,
          todaysEarnings: data.todaysEarnings || 0,
          pendingOrders: data.pendingOrders || 0,
          customerRating: data.customerRating || 0,
        },
        recentOrders: Array.isArray(data.recentOrders)
          ? data.recentOrders
          : [],
        popularItems: Array.isArray(data.popularItems)
          ? data.popularItems
          : [],
        revenueData: {
          currentMonth: data.currentMonthRevenue || 0,
          lastMonth: data.lastMonthRevenue || 0,
          percentageChange: data.revenuePercentageChange || 0,
          monthlyData: Array.isArray(data.monthlyRevenueData)
            ? data.monthlyRevenueData
            : Array(12).fill(0),
        },
        quickStats: {
          avgOrderValue: data.avgOrderValue || 0,
          customerSatisfaction: data.customerSatisfaction || 0,
          peakHours: data.peakHours || "7-9 PM",
          tableTurnover: data.tableTurnover || 0,
        },
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Showing demo data.");
      setMockData();
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("restaurant");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("restaurant");

    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    setMockData();
    setError("Logged out. Using demo data.");
    setRestaurantData(null);
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const closeSidebar = () => {
    if (isMobile) setSidebarOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "preparing":
        return "bg-amber-100 text-amber-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getOrderIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "✓";
      case "preparing":
        return "👨‍🍳";
      case "pending":
        return "⏱️";
      case "cancelled":
        return "✕";
      default:
        return "📦";
    }
  };

  const statsData = [
    {
      title: "Today's Orders",
      value: dashboardData.stats.todaysOrders.toString(),
      change: `+${Math.round(dashboardData.stats.todaysOrders * 0.12)}%`,
      trend: "up",
      icon: ShoppingCart,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      title: "Today's Earnings",
      value: `₹${dashboardData.stats.todaysEarnings.toLocaleString("en-IN")}`,
      change: `+${Math.round(dashboardData.stats.todaysEarnings * 0.0018)}%`,
      trend: "up",
      icon: IndianRupee,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-500",
    },
    {
      title: "Pending Orders",
      value: dashboardData.stats.pendingOrders.toString(),
      change: dashboardData.stats.pendingOrders > 5 ? "+2%" : "-2%",
      trend: dashboardData.stats.pendingOrders > 5 ? "up" : "down",
      icon: Clock,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-500",
    },
    {
      title: "Customer Rating",
      value: dashboardData.stats.customerRating.toFixed(1),
      change: "+0.2",
      trend: "up",
      icon: Star,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent" />
          <p className="mt-4 text-gray-600 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      {isMobile && !sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="md:hidden fixed top-4 left-4 z-50 p-3 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg active:scale-95"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      )}

      <button
        onClick={() => fetchDashboardData(true)}
        disabled={isRefreshing}
        className="fixed bottom-20 right-3 md:bottom-8 md:right-24 z-40 p-3 rounded-full bg-white text-gray-700 shadow-lg disabled:opacity-50"
        aria-label="Refresh data"
      >
        <RefreshCw size={20} className={isRefreshing ? "animate-spin" : ""} />
      </button>

      <button
        onClick={handleLogout}
        className="fixed bottom-3 right-3 md:bottom-8 md:right-8 z-40 p-3 rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 active:scale-95"
        aria-label="Logout"
      >
        <LogOut size={20} />
      </button>

      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={closeSidebar}
        />
      )}

      {error && (
        <div className="fixed top-20 left-3 right-3 md:left-auto md:right-4 z-50">
          <div className="bg-blue-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm">
            <AlertCircle size={18} />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError("")}>✕</button>
          </div>
        </div>
      )}

      <div className="flex min-w-0">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={closeSidebar}
          onToggle={toggleSidebar}
        />

        <div className="flex-1 min-w-0 min-h-screen overflow-x-hidden text-black">
          <Header
            title={restaurantData?.name || "Dashboard Overview"}
            subtitle="Welcome back to your restaurant dashboard!"
            onMenuClick={toggleSidebar}
            sidebarOpen={sidebarOpen}
          />

          <main className="p-3 sm:p-4 md:p-6 overflow-x-hidden">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
              {statsData.map((stat, index) => (
                <StatsCard key={index} {...stat} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="lg:col-span-2 min-w-0">
                <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-gray-800">
                        Revenue Overview
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">
                        Last 30 days performance
                      </p>
                    </div>
                  </div>

                  <div className="h-72 overflow-x-auto">
                    <div className="min-w-[620px]">
                      <div className="flex items-end h-48 gap-2 px-2">
                        {dashboardData.revenueData.monthlyData.map(
                          (value, index) => {
                            const maxValue = Math.max(
                              ...dashboardData.revenueData.monthlyData,
                              1
                            );
                            const height = (value / maxValue) * 100;
                            const months = [
                              "Jan",
                              "Feb",
                              "Mar",
                              "Apr",
                              "May",
                              "Jun",
                              "Jul",
                              "Aug",
                              "Sep",
                              "Oct",
                              "Nov",
                              "Dec",
                            ];

                            return (
                              <div
                                key={index}
                                className="flex-1 flex flex-col items-center"
                              >
                                <div
                                  className="w-7 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg"
                                  style={{ height: `${height}%` }}
                                />
                                <div className="text-xs text-gray-500 mt-2">
                                  {months[index]}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 px-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl md:text-3xl font-bold text-gray-800">
                            ₹
                            {(
                              dashboardData.revenueData.currentMonth / 1000
                            ).toFixed(1)}
                            K
                          </div>
                          <div className="text-sm text-gray-500">
                            Total Revenue
                          </div>
                        </div>

                        <div
                          className={`flex items-center px-4 py-2 rounded-lg text-sm ${
                            dashboardData.revenueData.percentageChange >= 0
                              ? "text-green-600 bg-green-50"
                              : "text-red-600 bg-red-50"
                          }`}
                        >
                          <TrendingUp size={18} className="mr-2" />
                          {dashboardData.revenueData.percentageChange.toFixed(
                            1
                          )}
                          % from last month
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 min-w-0">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800">
                      Recent Orders
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      Latest customer orders
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {dashboardData.recentOrders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 hover:bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center min-w-0">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getOrderIcon(order.status)}
                        </div>

                        <div className="ml-3 min-w-0">
                          <div className="font-medium text-gray-800 truncate">
                            {order.id}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {order.customer} • {order.items} items
                          </div>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <div className="font-bold text-gray-800">
                          ₹{order.amount}
                        </div>
                        <span
                          className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => router.push("/Orders")}
                  className="w-full mt-6 py-3 text-blue-600 hover:bg-blue-50 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <Package size={16} />
                  View All Orders
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 min-w-0">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800">
                      Popular Items
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      Best selling dishes
                    </p>
                  </div>
                  <ChefHat className="text-gray-400" size={24} />
                </div>

                <div className="space-y-3">
                  {dashboardData.popularItems.slice(0, 5).map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 hover:bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                          {item.name
                            .split(" ")
                            .map((word) => word[0])
                            .join("")}
                        </div>

                        <div className="ml-3 min-w-0">
                          <div className="font-medium text-gray-800 truncate">
                            {item.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.sales} orders
                          </div>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <div className="font-bold text-gray-800">
                          ₹{item.revenue.toLocaleString("en-IN")}
                        </div>
                        <div className="text-sm text-gray-500">revenue</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Avg. Order Value",
                    value: `₹${dashboardData.quickStats.avgOrderValue}`,
                    icon: BarChart3,
                    color: "from-blue-500 to-blue-600",
                  },
                  {
                    title: "Customer Satisfaction",
                    value: `${dashboardData.quickStats.customerSatisfaction}%`,
                    icon: Users,
                    color: "from-green-500 to-green-600",
                  },
                  {
                    title: "Peak Hours",
                    value: dashboardData.quickStats.peakHours,
                    icon: Clock,
                    color: "from-purple-500 to-purple-600",
                  },
                  {
                    title: "Table Turnover",
                    value: `${dashboardData.quickStats.tableTurnover}x`,
                    icon: TrendingUp,
                    color: "from-amber-500 to-amber-600",
                  },
                ].map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={index}
                      className={`bg-gradient-to-br ${item.color} rounded-2xl p-4 md:p-6 text-white shadow-lg`}
                    >
                      <div className="flex items-center justify-between mb-4 gap-3">
                        <h4 className="font-bold text-base md:text-lg">
                          {item.title}
                        </h4>
                        <Icon className="opacity-80 shrink-0" size={24} />
                      </div>

                      <div className="text-2xl md:text-3xl font-bold mb-2 break-words">
                        {item.value}
                      </div>

                      <div className="text-white/80 text-sm">
                        Updated today
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 pb-20 md:pb-0 text-center text-gray-500 text-xs sm:text-sm">
              Data updated in real-time • Last refresh:{" "}
              {new Date().toLocaleTimeString()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;