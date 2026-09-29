// app/components/EnhancedDeliveryDashboard.jsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import SuperLayout from "./SuperLayout/page";
import { deliveryApi, formatRupee } from "./lib/deliveryApi";
import {
  Package,
  IndianRupee,
  Truck,
  Clock,
  CheckCircle,
  MapPin,
  Phone,
  Users,
  Star,
  Navigation,
  AlertCircle,
  ChevronRight,
  Award,
  Calendar,
  Filter,
  TrendingUp,
  Wallet,
  Zap,
  Gift,
  Shield,
  MoreVertical,
  MessageCircle,
  Bell,
  Download,
  Share2,
  Target,
  Coffee,
  Battery,
  Wifi,
  Thermometer
} from "lucide-react";

export default function EnhancedDeliveryDashboard() {
  const [onlineStatus, setOnlineStatus] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [currentTime, setCurrentTime] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [dashboardError, setDashboardError] = useState("");
  const [isTogglingAvailability, setIsTogglingAvailability] = useState(false);
  const [updatingDeliveryId, setUpdatingDeliveryId] = useState(null);

  const loadDashboard = async (silent = false) => {
    if (!silent) setIsLoadingDashboard(true);
    if (!silent) setDashboardError("");

    try {
      const data = await deliveryApi('/delivery/dashboard');
      setDashboardData(data);
      setOnlineStatus(Boolean(data.stats?.isAvailable));
    } catch (err) {
      if (!silent) setDashboardError(err.message || "Failed to load dashboard");
    } finally {
      if (!silent) setIsLoadingDashboard(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    const intervalId = setInterval(() => loadDashboard(true), 60000);
    const handleOrdersChanged = () => loadDashboard(true);
    window.addEventListener("deliveryOrdersChanged", handleOrdersChanged);
    return () => {
      clearInterval(intervalId);
      window.removeEventListener("deliveryOrdersChanged", handleOrdersChanged);
    };
  }, []);

  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileMenuOpen(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Enhanced stats with gradients
  const stats = [
    {
      title: "Active Orders",
      value: "3",
      description: "Ready for pickup",
      icon: Package,
      gradient: "from-blue-500 to-blue-600",
      lightBg: "bg-blue-50",
      trend: "+2 today",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "Today's Earnings",
      value: "₹850",
      description: "Including tips",
      icon: IndianRupee,
      gradient: "from-green-500 to-green-600",
      lightBg: "bg-green-50",
      trend: "+12%",
      iconBg: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      title: "Total Deliveries",
      value: "1,247",
      description: "Lifetime",
      icon: Truck,
      gradient: "from-purple-500 to-purple-600",
      lightBg: "bg-purple-50",
      trend: "This month: 156",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      title: "Rating",
      value: "4.9",
      description: "245 reviews",
      icon: Star,
      gradient: "from-amber-500 to-amber-600",
      lightBg: "bg-amber-50",
      trend: "Top 10%",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600"
    },
  ];

  // Active deliveries with more details
  const activeDeliveries = [
    {
      id: "ORD-12345",
      customer: "Rajesh Kumar",
      address: "Andheri East, Mumbai - 400069",
      restaurant: "Spicy Hub",
      restaurantAddress: "Andheri West, Mumbai - 400053",
      amount: "₹450",
      status: "picked_up",
      time: "10 min",
      distance: "2.5 km",
      phone: "+91 98765 43210",
      pickupCode: "1234",
      priority: "high",
      customerNote: "Leave at door, call upon arrival",
      items: [
        { name: "Chicken Biryani", quantity: 2 },
        { name: "Butter Naan", quantity: 3 },
        { name: "Paneer Butter Masala", quantity: 1 }
      ],
      estimatedDelivery: "7:45 PM",
      orderTime: "7:15 PM"
    },
    {
      id: "ORD-12346",
      customer: "Priya Sharma",
      address: "Borivali West, Mumbai - 400092",
      restaurant: "Biryani Point",
      restaurantAddress: "Borivali East, Mumbai - 400066",
      amount: "₹780",
      status: "assigned",
      time: "15 min",
      distance: "3.2 km",
      phone: "+91 87654 32109",
      pickupCode: "5678",
      priority: "medium",
      items: [
        { name: "Hyderabadi Biryani", quantity: 1 },
        { name: "Gulab Jamun", quantity: 2 },
        { name: "Raita", quantity: 1 }
      ],
      estimatedDelivery: "8:15 PM",
      orderTime: "7:30 PM"
    },
    {
      id: "ORD-12347",
      customer: "Amit Patel",
      address: "Chembur, Mumbai - 400071",
      restaurant: "Fresh Bites",
      restaurantAddress: "Chembur East, Mumbai - 400074",
      amount: "₹320",
      status: "waiting",
      time: "5 min",
      distance: "1.8 km",
      phone: "+91 76543 21098",
      pickupCode: "9012",
      priority: "low",
      customerNote: "Ring bell twice",
      items: [
        { name: "Veg Burger", quantity: 2 },
        { name: "French Fries", quantity: 1 },
        { name: "Cold Coffee", quantity: 1 }
      ],
      estimatedDelivery: "8:05 PM",
      orderTime: "7:45 PM"
    },
  ];

  const liveStats = dashboardData?.stats;
  const displayStats = liveStats
    ? [
        {
          ...stats[0],
          value: String(liveStats.activeOrders || 0),
          trend: `${dashboardData?.activeDeliveries?.length || 0} live`,
        },
        {
          ...stats[1],
          value: formatRupee(liveStats.todaysEarnings || 0),
          trend: "Today",
        },
        {
          ...stats[2],
          value: String(liveStats.totalDeliveries || 0),
          trend: "Lifetime",
        },
        {
          ...stats[3],
          value: Number(liveStats.rating || 0).toFixed(1),
          trend: liveStats.kycStatus ? `KYC ${liveStats.kycStatus}` : "Rating",
        },
      ]
    : stats;
  const displayActiveDeliveries = dashboardData
    ? dashboardData.activeDeliveries || []
    : [];
  const displayUser = dashboardData?.user;

  const normalizeDeliveryStatus = (status) => {
    const value = String(status || "").toLowerCase();
    if (value === "picked_up") return "picked";
    if (value === "out_for_delivery") return "on_the_way";
    return value;
  };

  const filteredActiveDeliveries = displayActiveDeliveries.filter((delivery) => {
    if (selectedFilter === "all") return true;
    return normalizeDeliveryStatus(delivery.status) === selectedFilter;
  });

  const getDeliveryRawId = (delivery) =>
    delivery.rawId || String(delivery.id || "").replace(/\D/g, "");

  const getItemCount = (delivery) =>
    Array.isArray(delivery.items) ? delivery.items.length : Number(delivery.items || 0);

  const getShortAddress = (address) => String(address || "Address not available").split(",")[0];

  const getMapUrl = (address) =>
    address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : "";

  const callCustomer = (phone) => {
    const cleanPhone = String(phone || "").replace(/[^\d+]/g, "");
    if (!cleanPhone) return;
    window.location.href = `tel:${cleanPhone}`;
  };

  const openNavigation = (address) => {
    const url = getMapUrl(address);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  const toggleAvailability = async () => {
    setIsTogglingAvailability(true);
    setDashboardError("");

    try {
      const nextStatus = !onlineStatus;
      await deliveryApi("/delivery/availability", {
        method: "PUT",
        body: JSON.stringify({ isAvailable: nextStatus }),
      });
      setOnlineStatus(nextStatus);
      await loadDashboard(true);
    } catch (err) {
      setDashboardError(err.message || "Failed to update availability");
    } finally {
      setIsTogglingAvailability(false);
    }
  };

  const updateDeliveryStep = async (delivery, action) => {
    const orderId = getDeliveryRawId(delivery);
    if (!orderId) return;

    setUpdatingDeliveryId(delivery.id);
    setDashboardError("");

    try {
      await deliveryApi(`/delivery/${action}/${orderId}`, { method: "PUT" });
      await loadDashboard(true);
    } catch (err) {
      setDashboardError(err.message || "Failed to update delivery");
    } finally {
      setUpdatingDeliveryId(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      assigned: { 
        color: "bg-yellow-100 text-yellow-700 border-yellow-200", 
        icon: Clock, 
        label: "Assigned",
        gradient: "from-yellow-500 to-yellow-600"
      },
      picked: {
        color: "bg-blue-100 text-blue-700 border-blue-200", 
        icon: Package, 
        label: "Picked Up",
        gradient: "from-blue-500 to-blue-600"
      },
      picked_up: {
        color: "bg-blue-100 text-blue-700 border-blue-200",
        icon: Package,
        label: "Picked Up",
        gradient: "from-blue-500 to-blue-600"
      },
      on_the_way: {
        color: "bg-indigo-100 text-indigo-700 border-indigo-200",
        icon: Navigation,
        label: "On The Way",
        gradient: "from-indigo-500 to-indigo-600"
      },
      delivered: {
        color: "bg-green-100 text-green-700 border-green-200",
        icon: CheckCircle,
        label: "Delivered",
        gradient: "from-green-500 to-green-600"
      },
      waiting: { 
        color: "bg-orange-100 text-orange-700 border-orange-200", 
        icon: AlertCircle, 
        label: "At Restaurant",
        gradient: "from-orange-500 to-orange-600"
      },
    };
    const config = statusConfig[normalizeDeliveryStatus(status)];
    const Icon = config?.icon || Package;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium border ${config?.color}`}>
        <Icon className="w-3 h-3" />
        {config?.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: { color: "bg-red-100 text-red-700 border-red-200", label: "High Priority", icon: Zap },
      medium: { color: "bg-yellow-100 text-yellow-700 border-yellow-200", label: "Medium", icon: Clock },
      low: { color: "bg-green-100 text-green-700 border-green-200", label: "Low", icon: CheckCircle },
    };
    const config = priorityConfig[priority] || priorityConfig.medium;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  return (
    <SuperLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Header - Fixed at top */}
       

      

        {/* Main Content - Add top padding for mobile fixed header */}
        <div className="pt-16 md:pt-0 px-3 sm:px-4 md:px-6 pb-8 max-w-7xl mx-auto">
          {/* Desktop Top Bar - Hidden on mobile */}
          <div className="hidden md:flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{currentTime}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                  3
                </span>
              </button>
              <button className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
                <Download className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Welcome Banner - Mobile Optimized */}
          <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl md:rounded-2xl p-4 md:p-6 text-white overflow-hidden mb-4 md:mb-6">
            <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-32 md:w-48 h-32 md:h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-lg md:text-2xl font-bold">
                      Welcome back, {displayUser?.name || "Partner"}! 👋
                    </h1>
                    <span className={`${onlineStatus ? "bg-green-400" : "bg-gray-400"} text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1`}>
                      <span className={`w-1.5 h-1.5 bg-white rounded-full ${onlineStatus ? "animate-pulse" : ""}`}></span>
                      <span>{onlineStatus ? "Online" : "Offline"}</span>
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-blue-100">
                    <span className="font-bold text-white">3 active deliveries</span> • Track your earnings
                  </p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <button className="flex-1 md:flex-none bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors backdrop-blur-sm">
                    Schedule
                  </button>
                  <button
                    onClick={toggleAvailability}
                    disabled={isTogglingAvailability}
                    className="flex-1 md:flex-none bg-white text-blue-600 px-4 py-2 rounded-lg text-xs md:text-sm font-medium hover:bg-blue-50 transition-colors shadow-lg disabled:opacity-60"
                  >
                    {isTogglingAvailability ? "Updating..." : onlineStatus ? "On Shift" : "Start Shift"}
                  </button>
                </div>
              </div>
              
              {/* Quick Stats - Grid for mobile */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mt-4 md:mt-8">
                <div className="bg-white/10 rounded-lg p-2 md:p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-1 mb-1">
                    <Target className="w-3 h-3 text-blue-200" />
                    <p className="text-[10px] md:text-xs text-blue-100">Goal</p>
                  </div>
                  <p className="text-sm md:text-xl font-bold">₹1.5k</p>
                  <div className="w-full h-1 bg-white/20 rounded-full mt-1">
                    <div className="w-3/4 h-1 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-2 md:p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-1 mb-1">
                    <Clock className="w-3 h-3 text-blue-200" />
                    <p className="text-[10px] md:text-xs text-blue-100">Online</p>
                  </div>
                  <p className="text-sm md:text-xl font-bold">4h 30m</p>
                </div>
                <div className="bg-white/10 rounded-lg p-2 md:p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-1 mb-1">
                    <CheckCircle className="w-3 h-3 text-blue-200" />
                    <p className="text-[10px] md:text-xs text-blue-100">Done</p>
                  </div>
                  <p className="text-sm md:text-xl font-bold">8</p>
                </div>
                <div className="bg-white/10 rounded-lg p-2 md:p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-1 mb-1">
                    <TrendingUp className="w-3 h-3 text-blue-200" />
                    <p className="text-[10px] md:text-xs text-blue-100">Accept</p>
                  </div>
                  <p className="text-sm md:text-xl font-bold">98%</p>
                </div>
              </div>
            </div>
          </div>

          {dashboardError && (
            <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{dashboardError}</span>
            </div>
          )}

          {isLoadingDashboard && (
            <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700 flex items-center gap-2">
              <Clock className="w-4 h-4 animate-pulse" />
              <span>Loading live dashboard...</span>
            </div>
          )}

          {/* Stats Cards - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
            {displayStats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 md:p-3 rounded-lg md:rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}>
                    <stat.icon className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  {stat.trend && (
                    <span className="text-[10px] md:text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">
                      {stat.trend}
                    </span>
                  )}
                </div>
                
                <p className="text-xl md:text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <h3 className="text-xs md:text-sm font-medium text-gray-700">{stat.title}</h3>
                <p className="text-[10px] md:text-xs text-gray-500 mt-1">{stat.description}</p>
              </div>
            ))}
          </div>

          {/* Status & Quick Actions - Stack on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4 md:mb-6">
            {/* Online Status Card */}
            <div className="lg:col-span-1">
              <div className={`rounded-xl md:rounded-2xl p-4 md:p-6 text-white h-full transition-all ${
                onlineStatus 
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                  : 'bg-gradient-to-br from-gray-600 to-gray-700'
              }`}>
                <div className="flex flex-col items-start justify-between gap-4 h-full">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div className={`w-2 h-2 md:w-3 md:h-3 bg-white rounded-full ${onlineStatus ? 'animate-pulse' : ''}`}></div>
                        {onlineStatus && (
                          <div className="absolute inset-0 w-2 h-2 md:w-3 md:h-3 bg-white rounded-full animate-ping opacity-75"></div>
                        )}
                      </div>
                      <span className="text-sm md:text-base font-semibold">You&apos;re {onlineStatus ? 'Online' : 'Offline'}</span>
                    </div>
                    <button
                      onClick={toggleAvailability}
                      disabled={isTogglingAvailability}
                      className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors backdrop-blur-sm disabled:opacity-60"
                    >
                      {isTogglingAvailability ? "Updating..." : `Go ${onlineStatus ? 'Offline' : 'Online'}`}
                    </button>
                  </div>
                  
                  <p className="text-xs md:text-sm text-white/80">
                    {onlineStatus 
                      ? 'Receiving delivery requests in real-time.' 
                      : 'Not receiving requests. Go online to start earning.'}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <div className="bg-white/10 rounded-lg p-2 md:p-3">
                      <p className="text-[10px] md:text-xs text-white/70">Acceptance</p>
                      <p className="text-sm md:text-base font-semibold">{onlineStatus ? "Online" : "Offline"}</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 md:p-3">
                      <p className="text-[10px] md:text-xs text-white/70">Completion</p>
                      <p className="text-sm md:text-base font-semibold">{liveStats?.totalDeliveries || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions - 2x2 grid on mobile */}
            <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
              <button className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg md:rounded-xl flex items-center justify-center mb-2 mx-auto md:mx-0">
                  <Zap className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <p className="text-xs md:text-sm font-medium text-gray-900 text-center md:text-left">Quick Start</p>
                <p className="text-[10px] md:text-xs text-gray-500 text-center md:text-left">Begin delivery</p>
              </button>
              
              <button className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg md:rounded-xl flex items-center justify-center mb-2 mx-auto md:mx-0">
                  <Wallet className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <p className="text-xs md:text-sm font-medium text-gray-900 text-center md:text-left">Withdraw</p>
                <p className="text-[10px] md:text-xs text-gray-500 text-center md:text-left">₹2,450</p>
              </button>
              
              <button className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg md:rounded-xl flex items-center justify-center mb-2 mx-auto md:mx-0">
                  <Gift className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <p className="text-xs md:text-sm font-medium text-gray-900 text-center md:text-left">Rewards</p>
                <p className="text-[10px] md:text-xs text-gray-500 text-center md:text-left">250 pts</p>
              </button>
              
              <button className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg md:rounded-xl flex items-center justify-center mb-2 mx-auto md:mx-0">
                  <Shield className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <p className="text-xs md:text-sm font-medium text-gray-900 text-center md:text-left">Insurance</p>
                <p className="text-[10px] md:text-xs text-gray-500 text-center md:text-left">Active</p>
              </button>
            </div>
          </div>

          {/* Active Deliveries Section */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4 md:mb-6">
            {/* Header - Mobile optimized */}
            <div className="p-4 md:p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-base md:text-lg font-semibold text-gray-900">Active Deliveries</h2>
                  <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    {filteredActiveDeliveries.length}
                  </span>
                </div>
                
                {/* Filter buttons - Horizontal scroll on mobile */}
                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                  <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg flex-shrink-0">
                    {['all', 'assigned', 'picked', 'on_the_way'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setSelectedFilter(filter)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                          selectedFilter === filter 
                            ? 'bg-white text-gray-900 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {filter === 'on_the_way' ? 'On Way' : filter === 'picked' ? 'Picked' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </button>
                    ))}
                  </div>
                  
                  <Link 
                    href="/Orders" 
                    className="text-xs md:text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    <span>View All</span>
                    <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Deliveries List */}
            <div className="divide-y divide-gray-100">
              {filteredActiveDeliveries.map((delivery) => (
                <div key={delivery.id} className="p-4 md:p-6 hover:bg-gray-50 transition-colors">
                  {/* Top Row */}
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 w-full">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs md:text-sm font-semibold text-gray-900">{delivery.id}</span>
                          {getPriorityBadge(delivery.priority)}
                        </div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            Code: {delivery.pickupCode}
                          </span>
                          <span className="text-[10px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                            {getItemCount(delivery)} items
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="self-end sm:self-auto">
                      {getStatusBadge(delivery.status)}
                    </div>
                  </div>

                  {/* Details Grid - Mobile optimized */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-3">
                    {/* Customer Info */}
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                        {delivery.customer?.charAt(0) || "C"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs md:text-sm font-medium text-gray-900 truncate">{delivery.customer}</p>
                        <p className="text-[10px] md:text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{getShortAddress(delivery.address)}</span>
                        </p>
                        {delivery.customerNote && (
                          <p className="text-[10px] text-blue-600 bg-blue-50 p-1 rounded mt-1 truncate">
                            📝 {delivery.customerNote}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Restaurant Info */}
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs md:text-sm font-medium text-gray-900 truncate">{delivery.restaurant}</p>
                        <p className="text-[10px] md:text-xs text-gray-500 truncate">{getShortAddress(delivery.restaurantAddress)}</p>
                      </div>
                    </div>

                    {/* Delivery Details - Horizontal on mobile */}
                    <div className="flex items-center justify-between md:justify-end gap-4">
                      <div>
                        <p className="text-[10px] md:text-xs text-gray-500">Amount</p>
                        <p className="text-sm md:text-lg font-bold text-gray-900">{delivery.amount}</p>
                      </div>
                      <div className="w-px h-8 bg-gray-200"></div>
                      <div>
                        <p className="text-[10px] md:text-xs text-gray-500">Distance</p>
                        <p className="text-xs md:text-sm font-medium">{delivery.distance}</p>
                      </div>
                      <div className="w-px h-8 bg-gray-200 hidden xs:block"></div>
                      <div className="hidden xs:block">
                        <p className="text-[10px] md:text-xs text-gray-500">Time</p>
                        <p className="text-xs md:text-sm font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {delivery.time}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => callCustomer(delivery.phone)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200"
                        title="Call customer"
                      >
                        <Phone className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => openNavigation(delivery.address)}
                        className="p-2 hover:bg-green-50 rounded-lg transition-colors border border-gray-200"
                        title="Navigate to customer"
                      >
                        <Navigation className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-purple-50 rounded-lg transition-colors border border-gray-200">
                        <MessageCircle className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {normalizeDeliveryStatus(delivery.status) === "assigned" && (
                        <button
                          onClick={() => updateDeliveryStep(delivery, "pick")}
                          disabled={updatingDeliveryId === delivery.id}
                          className="flex-1 sm:flex-none px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg text-xs font-medium hover:shadow-lg flex items-center justify-center gap-1 disabled:opacity-60"
                        >
                          <Package className="w-4 h-4" />
                          <span>{updatingDeliveryId === delivery.id ? "Updating..." : "Picked Up"}</span>
                        </button>
                      )}
                      {normalizeDeliveryStatus(delivery.status) === "picked" && (
                        <button
                          onClick={() => updateDeliveryStep(delivery, "start")}
                          disabled={updatingDeliveryId === delivery.id}
                          className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg text-xs font-medium hover:shadow-lg flex items-center justify-center gap-1 disabled:opacity-60"
                        >
                          <Navigation className="w-4 h-4" />
                          <span>{updatingDeliveryId === delivery.id ? "Updating..." : "Start Delivery"}</span>
                        </button>
                      )}
                      {normalizeDeliveryStatus(delivery.status) === "on_the_way" && (
                        <button
                          onClick={() => updateDeliveryStep(delivery, "complete")}
                          disabled={updatingDeliveryId === delivery.id}
                          className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-lg text-xs font-medium hover:shadow-lg flex items-center justify-center gap-1 disabled:opacity-60"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>{updatingDeliveryId === delivery.id ? "Updating..." : "Mark Delivered"}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {!isLoadingDashboard && filteredActiveDeliveries.length === 0 && (
                <div className="p-8 text-center">
                  <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-sm font-semibold text-gray-800">No active deliveries</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    New assignments will appear here when you are online.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Stats - Responsive grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm md:text-base font-semibold text-gray-900">Today&apos;s Summary</h3>
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
              </div>
              <div className="space-y-2 md:space-y-3">
                <div className="flex justify-between items-center text-xs md:text-sm">
                  <span className="text-gray-600">Distance</span>
                  <span className="font-medium bg-gray-100 px-3 py-1 rounded-full">{displayActiveDeliveries.length} active</span>
                </div>
                <div className="flex justify-between items-center text-xs md:text-sm">
                  <span className="text-gray-600">Time</span>
                  <span className="font-medium bg-gray-100 px-3 py-1 rounded-full">{liveStats?.onlineHours || 0}h</span>
                </div>
                <div className="flex justify-between items-center text-xs md:text-sm">
                  <span className="text-gray-600">Fuel</span>
                  <span className="font-medium bg-gray-100 px-3 py-1 rounded-full">₹120</span>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs md:text-sm font-semibold">Net Earnings</span>
                    <span className="text-lg md:text-xl font-bold text-green-600">₹730</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm md:text-base font-semibold text-gray-900">Achievements</h3>
                <Award className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />
              </div>
              <div className="flex items-center gap-2 p-2 md:p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-medium truncate">Speed Demon</p>
                  <p className="text-[10px] md:text-xs text-gray-500 truncate">15 deliveries in 4h</p>
                </div>
                <span className="text-[10px] bg-green-100 text-green-600 px-2 py-1 rounded-full whitespace-nowrap">New</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600 rounded-xl md:rounded-2xl p-4 md:p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="w-4 h-4 md:w-5 md:h-5" />
                  <h3 className="text-sm md:text-base font-semibold">Refer & Earn</h3>
                </div>
                
                <p className="text-xs md:text-sm text-white/90 mb-3">
                  Earn <span className="font-bold text-yellow-300">₹500</span> per referral
                </p>
                
                <div className="flex gap-2">
                  <div className="flex-1 bg-white/20 rounded-lg px-3 py-2 text-xs font-mono truncate">
                    REF2024
                  </div>
                  <button className="bg-white text-purple-600 px-4 py-2 rounded-lg text-xs font-medium hover:bg-purple-50 transition-colors shadow-lg whitespace-nowrap">
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Live Map Preview */}
          <div className="mt-4 bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                <h3 className="text-sm md:text-base font-semibold text-gray-900">Live Traffic</h3>
              </div>
              <button className="text-xs md:text-sm text-blue-600 hover:text-blue-700 font-medium">
                View Map →
              </button>
            </div>
            <div className="h-32 md:h-40 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Navigation className="w-6 h-6 md:w-8 md:h-8 text-blue-500 mx-auto mb-1" />
                <p className="text-xs md:text-sm text-gray-600">{displayActiveDeliveries.length} active deliveries in your area</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
          <div className="flex items-center justify-around">
            <button className="flex flex-col items-center p-2 text-blue-600">
              <Package className="w-5 h-5" />
              <span className="text-[10px] mt-1">Orders</span>
            </button>
            <button className="flex flex-col items-center p-2 text-gray-600">
              <Truck className="w-5 h-5" />
              <span className="text-[10px] mt-1">Deliveries</span>
            </button>
            <button className="flex flex-col items-center p-2 text-gray-600">
              <Wallet className="w-5 h-5" />
              <span className="text-[10px] mt-1">Earnings</span>
            </button>
            <button className="flex flex-col items-center p-2 text-gray-600">
              <Users className="w-5 h-5" />
              <span className="text-[10px] mt-1">Profile</span>
            </button>
          </div>
        </div>

        {/* Add padding for mobile bottom nav */}
        <div className="md:hidden h-16"></div>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        @media (max-width: 640px) {
          .xs\\:block {
            display: block;
          }
        }
      `}</style>
    </SuperLayout>
  );
}
