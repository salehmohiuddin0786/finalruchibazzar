"use client";
import { useState, useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import {
  Bell,
  Search,
  User,
  LogOut,
  Settings,
  HelpCircle,
  ChevronDown,
  Moon,
  Sun,
  Menu,
  Mail,
  Calendar,
  Award,
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
  Gift,
  Star,
  Clock,
  Activity,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  clearMainAdminSession,
  getMainAdminSessionSnapshot,
  parseMainAdminSession,
  subscribeToMainAdminSession,
} from "../lib/api";
import { useMainAdminData } from "../lib/useMainAdminData";

const getServerSessionSnapshot = () => "";

const SuperHeader = ({ onMenuClick }) => {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const sessionSnapshot = useSyncExternalStore(
    subscribeToMainAdminSession,
    getMainAdminSessionSnapshot,
    getServerSessionSnapshot
  );
  const session = useMemo(() => parseMainAdminSession(sessionSnapshot), [sessionSnapshot]);
  const { rows: notificationRows } = useMainAdminData("/mainadmin/notifications");
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowMobileSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = notificationRows.map((row, index) => ({
    id: row.id || index + 1,
    title: row.title,
    message: `${row.channel || "Notification"} for ${row.audience || "Admins"}`,
    time: row.status || "Live",
    type: row.channel === "Email" ? "order" : row.channel === "SMS" ? "payment" : "vendor",
    read: row.status === "Sent",
  }));

  const unreadCount = notifications.filter((n) => !n.read).length;
  const adminName = session?.user?.name || "Super Admin";
  const adminEmail = session?.user?.email || "admin@ruchibazaar.com";
  const adminInitials = adminName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    clearMainAdminSession();
    setShowProfileMenu(false);
    router.replace("/Login");
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order': return { icon: Mail, bg: "bg-blue-50", color: "text-blue-600" };
      case 'vendor': return { icon: User, bg: "bg-purple-50", color: "text-purple-600" };
      case 'delivery': return { icon: Award, bg: "bg-green-50", color: "text-green-600" };
      case 'payment': return { icon: Calendar, bg: "bg-amber-50", color: "text-amber-600" };
      default: return { icon: Bell, bg: "bg-slate-50", color: "text-slate-600" };
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 shadow-lg backdrop-blur-xl">
        {/* Top Gradient Bar */}
        <div className="h-0.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
        
        <div className="px-3 sm:px-5 lg:px-8">
          <div className="flex min-h-16 min-w-0 items-center justify-between gap-2 py-2 sm:h-16 sm:py-0">
            {/* Left Section - Menu Button & Welcome */}
            <div className="flex min-w-0 items-center gap-2 sm:gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={onMenuClick}
                className="rounded-lg p-2 transition-all duration-200 hover:bg-slate-100 active:scale-95 md:hidden"
                aria-label="Toggle sidebar"
              >
                <Menu className="h-5 w-5 text-slate-600" />
              </button>

              {/* Desktop Welcome Message */}
              <div className="hidden min-w-0 sm:block">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 opacity-75 blur" />
                    <div className="relative rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 p-1">
                      <Sparkles className="h-3.5 w-3.5 text-white" />
                    </div>
                  </div>
                  <h2 className="truncate text-base font-semibold text-slate-800 lg:text-lg">
                    {getGreeting()}, <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{adminName.split(" ")[0]}</span>
                  </h2>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Calendar className="h-3 w-3" />
                    {formatDate(currentTime)}
                  </div>
                  <div className="h-1 w-1 rounded-full bg-slate-300" />
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="h-3 w-3" />
                    {formatTime(currentTime)}
                  </div>
                </div>
              </div>

              {/* Mobile Welcome */}
              <div className="min-w-0 sm:hidden">
                <h2 className="text-sm font-medium text-slate-700">{getGreeting()}</h2>
                <p className="text-xs text-slate-500">{formatTime(currentTime)}</p>
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex shrink-0 items-center gap-1 sm:gap-2 lg:gap-3">
              {/* Desktop Search Bar */}
              <div className="relative hidden md:block group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-emerald-500" />
                <input
                  type="text"
                  placeholder="Search orders, vendors, partners..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-44 pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all duration-200 lg:w-64 xl:w-80"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600" />
                  </button>
                )}
              </div>

              {/* Mobile Search Toggle */}
              <button
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="rounded-lg p-2 transition-all duration-200 hover:bg-slate-100 active:scale-95 md:hidden"
                aria-label="Search"
              >
                <Search className="h-5 w-5 text-slate-600" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="relative rounded-lg p-2 transition-all duration-200 hover:bg-slate-100 active:scale-95 group"
                aria-label="Toggle theme"
              >
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                {isDarkMode ? (
                  <Sun className="relative h-5 w-5 text-amber-500" />
                ) : (
                  <Moon className="relative h-5 w-5 text-slate-600" />
                )}
              </button>

              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative rounded-lg p-2 transition-all duration-200 hover:bg-slate-100 active:scale-95 group"
                  aria-label="Notifications"
                >
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                  <Bell className="relative h-5 w-5 text-slate-600" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-red-500 text-[10px] font-bold text-white shadow-lg animate-pulse">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="fixed left-3 right-3 z-50 mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in slide-in-from-top-2 fade-in-0 duration-200 sm:absolute sm:left-auto sm:right-0 sm:w-[calc(100vw-1.5rem)] sm:max-w-md">
                    <div className="bg-gradient-to-r from-slate-50 to-white px-5 py-4 border-b border-slate-100">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 p-1.5">
                            <Bell className="h-4 w-4 text-white" />
                          </div>
                          <h3 className="font-semibold text-slate-800">Notifications</h3>
                        </div>
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                          {unreadCount} new
                        </span>
                      </div>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <div className="rounded-full bg-slate-100 p-3 mb-3">
                            <Bell className="h-6 w-6 text-slate-400" />
                          </div>
                          <p className="text-sm font-medium text-slate-700">No notifications</p>
                          <p className="text-xs text-slate-400">You&apos;re all caught up!</p>
                        </div>
                      ) : (
                        notifications.map((notification) => {
                          const { icon: Icon, bg, color } = getNotificationIcon(notification.type);
                          return (
                            <div
                              key={notification.id}
                              className={`group relative p-4 transition-all duration-200 hover:bg-slate-50 cursor-pointer ${
                                !notification.read ? "bg-emerald-50/30" : ""
                              }`}
                            >
                              {!notification.read && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-r-full" />
                              )}
                              <div className="flex min-w-0 gap-3">
                                <div className={`shrink-0 rounded-xl ${bg} p-2.5`}>
                                  <Icon className={`h-4 w-4 ${color}`} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="break-words text-sm font-semibold text-slate-800">
                                    {notification.title}
                                  </p>
                                  <p className="mt-0.5 break-words text-xs text-slate-500">
                                    {notification.message}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1.5">
                                    <Clock className="h-3 w-3 text-slate-400" />
                                    <p className="text-xs text-slate-400">{notification.time}</p>
                                  </div>
                                </div>
                                {!notification.read && (
                                  <div className="shrink-0">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                    
                    <div className="border-t border-slate-100 bg-slate-50/50 p-3 text-center">
                      <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                        View All Notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Menu */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 rounded-xl p-1.5 transition-all duration-200 hover:bg-slate-100 active:scale-95 group"
                >
                  <div className="relative">
                    <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-75 transition-opacity duration-300" />
                    <div className="relative h-9 w-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">{adminInitials || "SA"}</span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-slate-700">{adminName}</p>
                    <p className="text-xs text-slate-500">{adminEmail}</p>
                  </div>
                  <ChevronDown className="hidden md:block h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:rotate-180" />
                </button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div className="fixed left-3 right-3 z-50 mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in slide-in-from-top-2 fade-in-0 duration-200 sm:absolute sm:left-auto sm:right-0 sm:w-64">
                    <div className="bg-gradient-to-r from-slate-50 to-white px-4 py-4 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md flex items-center justify-center">
                          <span className="text-white font-bold text-lg">{adminInitials || "SA"}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-800">{adminName}</p>
                          <p className="truncate text-xs text-slate-500">{adminEmail}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Shield className="h-3 w-3 text-emerald-500" />
                            <p className="text-xs text-emerald-600 font-medium">Super Admin</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <Link
                        href="/Profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors group"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <div className="rounded-lg bg-slate-100 p-1.5 group-hover:bg-emerald-100 transition-colors">
                          <User className="h-4 w-4 text-slate-500 group-hover:text-emerald-600" />
                        </div>
                        Your Profile
                      </Link>
                      <Link
                        href="/Settings"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors group"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <div className="rounded-lg bg-slate-100 p-1.5 group-hover:bg-emerald-100 transition-colors">
                          <Settings className="h-4 w-4 text-slate-500 group-hover:text-emerald-600" />
                        </div>
                        Settings
                      </Link>
                      <Link
                        href="/SupportCenter"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors group"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <div className="rounded-lg bg-slate-100 p-1.5 group-hover:bg-emerald-100 transition-colors">
                          <HelpCircle className="h-4 w-4 text-slate-500 group-hover:text-emerald-600" />
                        </div>
                        Help & Support
                      </Link>
                      <div className="border-t border-slate-100 my-2" />
                      <button
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors group"
                        onClick={handleLogout}
                      >
                        <div className="rounded-lg bg-rose-50 p-1.5 group-hover:bg-rose-100 transition-colors">
                          <LogOut className="h-4 w-4 text-rose-500" />
                        </div>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="hidden lg:flex items-center gap-3 pl-3 border-l border-slate-200">
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                    <p className="text-xs font-medium text-slate-500">Today&apos;s Revenue</p>
                  </div>
                  <p className="text-sm font-bold text-slate-800">₹12,450</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {showMobileSearch && (
            <div className="md:hidden py-3 border-t border-slate-100 animate-in slide-in-from-top-1 fade-in-0 duration-200" ref={searchRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search orders, vendors, partners..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="h-4 w-4 text-slate-400" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default SuperHeader;
