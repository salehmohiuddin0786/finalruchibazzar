// app/components/DeliveryHeader.jsx
"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import {
  Bell,
  Search,
  Menu,
  User,
  ChevronDown,
  Settings,
  LogOut,
  HelpCircle,
  Moon,
  Sun,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  X,
  MessageCircle,
  Calendar,
  Award,
  Store,
  Leaf,
  Sparkles,
  Heart,
  Zap,
  MapPin,
  Phone,
  Star
} from 'lucide-react';

export default function DeliveryHeader({ toggleSidebar, isSidebarOpen, pageTitle = "Dashboard", isMobile }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount, setNotificationCount] = useState(3);
  const [currentTime, setCurrentTime] = useState('');
  const [mounted, setMounted] = useState(false);
  
  const { theme, setTheme } = useTheme();
  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const searchInputRef = useRef(null);

  // Handle mounting for theme
  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (active) setMounted(true);
    });
    return () => {
      active = false;
    };
  }, []);

  // Update time
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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when modal opens
  useEffect(() => {
    if (showSearchModal && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [showSearchModal]);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal(true);
      }
      
      if (e.key === 'Escape') {
        setShowSearchModal(false);
        setShowProfileMenu(false);
        setShowNotifications(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("deliveryToken");
    localStorage.removeItem("deliveryUser");
    localStorage.removeItem("deliveryPartner");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("partnerToken");
    document.cookie = "deliveryToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/login";
  };

  const notifications = [
    { 
      id: 1, 
      title: 'New order #RB-2024-001', 
      description: 'Express delivery from Spicy Bites',
      time: '2 min ago', 
      read: false,
      icon: Package,
      color: 'emerald',
      amount: '₹450'
    },
    { 
      id: 2, 
      title: 'Payment received', 
      description: 'Order #RB-2024-045 + ₹25 tip',
      time: '15 min ago', 
      read: false,
      icon: TrendingUp,
      color: 'green',
      amount: '₹1,250'
    },
    { 
      id: 3, 
      title: 'Delivery completed', 
      description: 'Customer rated 5 stars',
      time: '1 hour ago', 
      read: true,
      icon: CheckCircle,
      color: 'teal',
      rating: 5
    },
    { 
      id: 4, 
      title: 'New message', 
      description: 'Customer: "Thanks for the quick delivery!"',
      time: '2 hours ago', 
      read: true,
      icon: MessageCircle,
      color: 'orange'
    },
    { 
      id: 5, 
      title: 'Peak hour bonus', 
      description: 'Extra ₹50 for deliveries 12-2 PM',
      time: '3 hours ago', 
      read: true,
      icon: Zap,
      color: 'amber',
      amount: '₹50'
    },
  ];

  const stats = [
    { label: "Today's Orders", value: '18', icon: Package, color: 'emerald', change: '+4' },
    { label: 'Completion', value: '98%', icon: CheckCircle, color: 'green', change: '+2%' },
    { label: 'Avg. Time', value: '24m', icon: Clock, color: 'purple', change: '-3m' },
  ];

  const recentSearches = ['RB-2024-001', 'Spicy Bites', 'Jubilee Hills', 'Express Delivery'];

  const markAllAsRead = () => {
    setNotificationCount(0);
  };

  const getNotificationIcon = (notification) => {
    const IconComponent = notification.icon;
    const colorClasses = {
      emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400',
      green: 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400',
      purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400',
      orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400',
      amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400',
      teal: 'bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-400',
    };

    return (
      <div className={`w-9 h-9 rounded-lg ${colorClasses[notification.color]} flex items-center justify-center flex-shrink-0`}>
        <IconComponent size={16} />
      </div>
    );
  };

  const getChangeColor = (stat) => {
    if (stat.change.startsWith('+')) return 'text-emerald-600';
    if (stat.change.startsWith('-')) return stat.label.includes('Time') ? 'text-emerald-600' : 'text-rose-600';
    return 'text-gray-500';
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Handle menu toggle
  const handleMenuClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (toggleSidebar) {
      toggleSidebar();
    }
  };

  return (
    <>
      <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-emerald-100/50 dark:border-gray-800 sticky top-0 z-30 shadow-sm">
        <div className="px-3 sm:px-4 lg:px-6">
          {/* Main Header Row */}
          <div className="flex h-16 min-w-0 items-center justify-between">
            {/* Left Section */}
            <div className="flex min-w-0 items-center gap-2">
              {isMobile && (
                <button
                  onClick={handleMenuClick}
                  className="p-2 hover:bg-emerald-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 relative group focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  aria-label="Toggle menu"
                  aria-expanded={isSidebarOpen}
                >
                  <Menu size={20} className="text-emerald-700 dark:text-emerald-400" />
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-[10px] font-medium bg-emerald-800 text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Menu
                  </span>
                </button>
              )}
              
              {/* Ruchi Bazaar Branding */}
              <div className="hidden md:flex items-center">
                <div className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-800 px-3 py-1.5 rounded-lg border border-emerald-100/50 dark:border-gray-700">
                  <Store size={16} className="text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Ruchi Bazaar</span>
                  <span className="text-gray-300 dark:text-gray-600 text-sm">/</span>
                  <span className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">{pageTitle}</span>
                  <Leaf size={12} className="text-emerald-500 ml-1" />
                </div>
              </div>

              {/* Live Date/Time */}
              <div className="hidden lg:flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-emerald-100 dark:border-gray-700 rounded-lg px-2.5 py-1">
                <Calendar size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs text-gray-600 dark:text-gray-300">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <span className="text-gray-300 dark:text-gray-600 text-xs">|</span>
                <Clock size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs text-gray-600 dark:text-gray-300">{currentTime}</span>
              </div>
            </div>

            {/* Center - Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <button
                onClick={() => setShowSearchModal(true)}
                className="w-full group"
              >
                <div className="flex items-center w-full px-3 py-2 bg-emerald-50/50 dark:bg-gray-800 border border-emerald-100 dark:border-gray-700 rounded-lg text-xs">
                  <Search size={16} className="text-gray-400 mr-2 group-hover:text-emerald-500 transition-colors" />
                  <span className="flex-1 text-left text-gray-500 dark:text-gray-400">Search orders...</span>
                  <div className="flex items-center gap-0.5 text-[10px]">
                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 border border-emerald-200 dark:border-gray-600 rounded font-mono text-emerald-700 dark:text-emerald-400">
                      {typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}
                    </kbd>
                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 border border-emerald-200 dark:border-gray-600 rounded font-mono text-emerald-700 dark:text-emerald-400">
                      K
                    </kbd>
                  </div>
                </div>
              </button>
            </div>

            {/* Right Section */}
            <div className="flex shrink-0 items-center gap-1">
              {/* Quick Stats */}
              <div className="hidden xl:flex items-center gap-1 mr-1">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  const colorClasses = {
                    emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400',
                    green: 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400',
                    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400',
                  };
                  const changeColor = getChangeColor(stat);
                  
                  return (
                    <div key={index} className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-gray-800 border border-emerald-100 dark:border-gray-700 rounded-lg">
                      <div className={`w-6 h-6 rounded-md ${colorClasses[stat.color]} flex items-center justify-center`}>
                        <Icon size={12} />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">{stat.label}</p>
                        <div className="flex items-center gap-0.5">
                          <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">{stat.value}</p>
                          <span className={`text-[8px] ${changeColor}`}>{stat.change}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Theme Toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 hover:bg-emerald-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 relative group"
                  aria-label="Toggle theme"
                >
                  <div className="relative w-4 h-4">
                    <Sun size={16} className={`absolute text-emerald-600 dark:text-emerald-400 transition-all duration-300 ${theme === 'dark' ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
                    <Moon size={16} className={`absolute text-emerald-600 dark:text-emerald-400 transition-all duration-300 ${theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`} />
                  </div>
                </button>
              )}

              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 hover:bg-emerald-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 relative group"
                  aria-label="Notifications"
                >
                  <Bell size={18} className="text-emerald-700 dark:text-emerald-400" />
                  {notificationCount > 0 && (
                    <>
                      <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping"></span>
                      <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                      <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-gradient-to-r from-rose-500 to-red-500 text-white text-[10px] font-medium flex items-center justify-center rounded-full px-1">
                        {notificationCount}
                      </span>
                    </>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 z-50 mt-2 w-[calc(100vw-1.5rem)] max-w-80 overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-2xl animate-slideDown dark:border-gray-700 dark:bg-gray-800">
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-semibold text-white">Notifications</h3>
                          <p className="text-xs text-emerald-100 mt-0.5">
                            {unreadNotifications} unread
                          </p>
                        </div>
                        {unreadNotifications > 0 && (
                          <button 
                            onClick={markAllAsRead}
                            className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-white text-[10px] font-medium transition-colors"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="max-h-[360px] overflow-y-auto">
                      {notifications.map((notif) => (
                        <div 
                          key={notif.id} 
                          className={`p-3 hover:bg-emerald-50/50 dark:hover:bg-gray-700 cursor-pointer border-b border-emerald-100 dark:border-gray-700 last:border-0 transition-all ${!notif.read ? 'bg-gradient-to-r from-emerald-50/30 to-transparent dark:from-emerald-900/20' : ''}`}
                        >
                          <div className="flex gap-2">
                            {getNotificationIcon(notif)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className={`text-xs font-medium ${!notif.read ? 'text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300'}`}>
                                    {notif.title}
                                  </p>
                                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{notif.description}</p>
                                </div>
                                {notif.amount && (
                                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/50 px-1.5 py-0.5 rounded">
                                    {notif.amount}
                                  </span>
                                )}
                                {notif.rating && (
                                  <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                    <Star size={8} className="fill-amber-400" />
                                    {notif.rating}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="text-[10px] text-gray-400 dark:text-gray-500">{notif.time}</span>
                                {!notif.read && (
                                  <span className="w-1 h-1 bg-emerald-600 rounded-full"></span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-2 bg-gradient-to-r from-emerald-50 to-white dark:from-gray-800 dark:to-gray-800 border-t border-emerald-100 dark:border-gray-700">
                      <button className="w-full text-center text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 py-1.5 hover:bg-emerald-100/50 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium">
                        View all
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Menu */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1 pr-2 hover:bg-emerald-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 group"
                >
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-600 rounded-lg flex items-center justify-center text-white font-semibold shadow-sm">
                      <Store size={16} />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                    <Heart size={8} className="absolute -top-1 -left-1 text-red-500 fill-red-500" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1">
                      Ruchi Bazaar
                      <Sparkles size={10} className="text-amber-500" />
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                      Premium Partner
                    </p>
                  </div>
                  <ChevronDown size={12} className={`text-gray-500 dark:text-gray-400 hidden md:block transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 z-50 mt-2 w-[calc(100vw-1.5rem)] max-w-56 overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-2xl animate-slideDown dark:border-gray-700 dark:bg-gray-800">
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center text-white font-bold text-base border border-white/30">
                          RB
                        </div>
                        <div className="text-white">
                          <p className="font-medium text-sm">Ruchi Bazaar</p>
                          <p className="text-[10px] text-emerald-100 truncate">partner@ruchibazaar.com</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20">
                        <div className="text-center">
                          <p className="text-[10px] text-emerald-100">Orders</p>
                          <p className="text-xs font-semibold text-white">156</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-emerald-100">Rating</p>
                          <p className="text-xs font-semibold text-white flex items-center justify-center gap-0.5">
                            4.9 <Star size={10} className="fill-amber-300" />
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-emerald-100">Points</p>
                          <p className="text-xs font-semibold text-white">2.4k</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-1">
                      <Link 
                        href="/profile" 
                        className="flex items-center gap-2 px-2 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg transition-all"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <div className="w-6 h-6 bg-emerald-100 dark:bg-gray-700 rounded flex items-center justify-center">
                          <User size={12} className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="flex-1">My Profile</span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400">✨</span>
                      </Link>
                      
                      <Link 
                        href="/" 
                        className="flex items-center gap-2 px-2 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg transition-all"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <div className="w-6 h-6 bg-emerald-100 dark:bg-gray-700 rounded flex items-center justify-center">
                          <Calendar size={12} className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="flex-1">Schedule</span>
                        <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-full">3</span>
                      </Link>
                      
                      <Link 
                        href="/profile" 
                        className="flex items-center gap-2 px-2 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg transition-all"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <div className="w-6 h-6 bg-emerald-100 dark:bg-gray-700 rounded flex items-center justify-center">
                          <Settings size={12} className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="flex-1">Settings</span>
                      </Link>
                      
                      <Link 
                        href="/profile" 
                        className="flex items-center gap-2 px-2 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg transition-all"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <div className="w-6 h-6 bg-emerald-100 dark:bg-gray-700 rounded flex items-center justify-center">
                          <HelpCircle size={12} className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="flex-1">Support</span>
                      </Link>
                      
                      <div className="border-t border-emerald-100 dark:border-gray-700 my-1"></div>
                      
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-2 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/50 rounded-lg w-full transition-all"
                      >
                        <div className="w-6 h-6 bg-rose-100 dark:bg-rose-900/50 rounded flex items-center justify-center">
                          <LogOut size={12} className="text-rose-600 dark:text-rose-400" />
                        </div>
                        <span className="flex-1 text-left">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-3">
            <button
              onClick={() => setShowSearchModal(true)}
              className="w-full"
            >
              <div className="flex items-center w-full px-3 py-2 bg-emerald-50/50 dark:bg-gray-800 border border-emerald-100 dark:border-gray-700 rounded-lg text-xs">
                <Search size={14} className="text-gray-400 mr-2" />
                <span className="flex-1 text-left text-gray-500 dark:text-gray-400">Search orders...</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-white dark:bg-gray-700 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-gray-600">
                  {typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘K' : 'Ctrl+K'}
                </span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-3 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden animate-slideDown">
            <div className="p-3 border-b border-emerald-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Search size={18} className="text-emerald-500 dark:text-emerald-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search orders, customers..."
                  className="flex-1 text-sm outline-none bg-transparent dark:text-gray-100"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  onClick={() => setShowSearchModal(false)}
                  className="p-1.5 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X size={16} className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="p-3 border-b border-emerald-100 dark:border-gray-700 bg-emerald-50/30 dark:bg-gray-700/50">
              <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 mb-2">RECENT SEARCHES</p>
              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    className="px-2 py-1 bg-white dark:bg-gray-700 border border-emerald-200 dark:border-gray-600 rounded-lg text-xs text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => {
                      setSearchQuery(search);
                      // Handle search
                    }}
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3">
              <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 mb-2">QUICK ACTIONS</p>
              <div className="grid grid-cols-2 gap-1.5">
                <button 
                  className="flex items-center gap-2 p-2 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg transition-colors border border-emerald-100 dark:border-gray-700"
                  onClick={() => {
                    setShowSearchModal(false);
                    // Navigate to new order
                  }}
                >
                  <div className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900/50 rounded flex items-center justify-center">
                    <Package size={12} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-xs text-gray-700 dark:text-gray-300">New Order</span>
                </button>
                <button 
                  className="flex items-center gap-2 p-2 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg transition-colors border border-emerald-100 dark:border-gray-700"
                  onClick={() => {
                    setShowSearchModal(false);
                    // Navigate to find restaurant
                  }}
                >
                  <div className="w-6 h-6 bg-teal-100 dark:bg-teal-900/50 rounded flex items-center justify-center">
                    <Store size={12} className="text-teal-600 dark:text-teal-400" />
                  </div>
                  <span className="text-xs text-gray-700 dark:text-gray-300">Find</span>
                </button>
                <button 
                  className="flex items-center gap-2 p-2 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg transition-colors border border-emerald-100 dark:border-gray-700"
                  onClick={() => {
                    setShowSearchModal(false);
                    // Navigate to track order
                  }}
                >
                  <div className="w-6 h-6 bg-amber-100 dark:bg-amber-900/50 rounded flex items-center justify-center">
                    <MapPin size={12} className="text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="text-xs text-gray-700 dark:text-gray-300">Track</span>
                </button>
                <button 
                  className="flex items-center gap-2 p-2 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg transition-colors border border-emerald-100 dark:border-gray-700"
                  onClick={() => {
                    setShowSearchModal(false);
                    // Navigate to support
                  }}
                >
                  <div className="w-6 h-6 bg-rose-100 dark:bg-rose-900/50 rounded flex items-center justify-center">
                    <Phone size={12} className="text-rose-600 dark:text-rose-400" />
                  </div>
                  <span className="text-xs text-gray-700 dark:text-gray-300">Support</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.15s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.15s ease-out;
        }
      `}</style>
    </>
  );
}
