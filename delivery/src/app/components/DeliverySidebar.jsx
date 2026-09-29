// app/components/DeliverySidebar.jsx
"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  IndianRupee,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Store,
  ChevronDown,
  Award,
  TrendingUp,
  Moon,
  Sun,
  Sparkles,
  Leaf,
  Heart,
  ShieldCheck
} from 'lucide-react';

export default function DeliverySidebar({ isOpen, setIsOpen, isMobile }) {
  const pathname = usePathname();
  const [showEarningsMenu, setShowEarningsMenu] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  
  // Use a ref to track if we're on mobile to prevent hover conflicts
  const isMobileRef = useRef(isMobile);

  // Update ref when isMobile changes
  useEffect(() => {
    isMobileRef.current = isMobile;
  }, [isMobile]);

  const mainMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/', badge: null },
    { name: 'Active Orders', icon: Package, path: '/Orders', badge: '3' },
    { name: 'Earnings', icon: IndianRupee, path: '/earnings', badge: '₹850' },
    { name: 'History', icon: Clock, path: '/history', badge: null },
    { name: 'Ratings', icon: Star, path: '/ratings', badge: '4.9' },
    { name: 'Policies & Support', icon: ShieldCheck, path: '/policies', badge: null },
  ];

  // Add body scroll lock for mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, isOpen]);

  // Handle hover for desktop ONLY
  const handleMouseEnter = () => {
    if (!isMobileRef.current && !isOpen) {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        setHoverTimeout(null);
      }
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobileRef.current && isOpen) {
      const timeout = setTimeout(() => {
        setIsOpen(false);
      }, 300);
      setHoverTimeout(timeout);
    }
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  const isActive = (path) => pathname === path;
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

  return (
    <>
      {/* Mobile Overlay with blur */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static top-0 left-0 h-full 
          bg-gradient-to-b from-white to-emerald-50/30 dark:from-gray-900 dark:to-gray-800
          text-gray-700 dark:text-gray-200 transition-all duration-300 ease-in-out z-50
          ${isOpen 
            ? (isMobile ? 'w-[85vw] max-w-[320px]' : 'w-64') 
            : (isMobile ? 'w-0' : 'w-20')
          }
          ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
          shadow-2xl shadow-emerald-900/20 dark:shadow-black/40
          flex flex-col border-r border-emerald-100/50 dark:border-gray-700
          backdrop-blur-xl
          ${isMobile && !isOpen ? 'overflow-hidden' : ''}
        `}
        onMouseEnter={!isMobile ? handleMouseEnter : undefined}
        onMouseLeave={!isMobile ? handleMouseLeave : undefined}
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none"></div>
        
        {/* Logo Area */}
        <div className={`relative flex items-center h-16 px-3 border-b border-emerald-100/50 dark:border-gray-700
          ${isOpen ? 'justify-between' : 'justify-center'}`}>
          {isOpen ? (
            <div className="flex items-center gap-2 group">
              <div className="relative">
                <div className="w-9 h-9 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
                  <Store className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-1.5 h-1.5 text-white" />
                </div>
              </div>
              <div>
                <span className="font-bold text-base block bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                  Ruchi Bazaar
                </span>
                <span className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70 flex items-center gap-1">
                  <Leaf size={8} className="text-emerald-500" />
                  Fresh Delivery Partner
                </span>
              </div>
            </div>
          ) : (
            <div className="relative group">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
                <Store className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-pulse"></div>
            </div>
          )}
          
          {/* Close button for desktop when open */}
          {isOpen && !isMobile && (
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg transition-all"
            >
              <ChevronLeft size={16} className="text-emerald-600 dark:text-emerald-400" />
            </button>
          )}

          {/* Mobile close button */}
          {isMobile && isOpen && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="p-2 hover:bg-emerald-100 dark:hover:bg-gray-700 rounded-lg transition-all"
              aria-label="Close sidebar"
            >
              <ChevronLeft size={18} className="text-emerald-600 dark:text-emerald-400" />
            </button>
          )}
        </div>

        {/* Toggle Button - Desktop ONLY */}
        {!isMobile && !isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="absolute -right-3 top-[3.5rem] w-6 h-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-10"
          >
            <ChevronRight size={12} className="text-white" />
          </button>
        )}

        {/* Online Status - Only show when open */}
        {isOpen && (
          <div className="mx-2 mt-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-lg border border-emerald-200/50 dark:border-emerald-800/50 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
                <div className="absolute inset-0 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                  Online for deliveries
                  <Award size={10} className="text-amber-500" />
                </p>
                <p className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70">Ready to serve fresh!</p>
              </div>
              <button 
                className="text-[10px] bg-white/80 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 px-2 py-1 rounded-lg text-emerald-700 dark:text-emerald-300 font-medium transition-all border border-emerald-200 dark:border-gray-600"
                onClick={(e) => e.stopPropagation()}
              >
                Break
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Main Navigation */}
          <nav className="px-2 mt-3">
            <p className={`text-[10px] font-semibold text-emerald-700/60 dark:text-emerald-400/60 mb-2 px-2 tracking-wider ${!isOpen && 'text-center'}`}>
              {isOpen ? 'DELIVERY DASHBOARD' : '•••'}
            </p>
            {mainMenuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`
                    flex items-center gap-2 px-2 py-2 mb-1 rounded-lg
                    transition-all duration-200 group relative overflow-hidden
                    ${active 
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-gray-800 hover:text-emerald-700 dark:hover:text-emerald-400'
                    }
                  `}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isMobile) {
                      setIsOpen(false);
                    }
                  }}
                >
                  {/* Active indicator */}
                  {active && (
                    <div className="absolute left-0 w-0.5 h-5 bg-white rounded-r-full" />
                  )}
                  
                  <Icon size={16} className={`${!isOpen && 'mx-auto'} ${active ? 'text-white' : ''}`} />
                  
                  {isOpen && (
                    <>
                      <span className="flex-1 text-xs font-medium">{item.name}</span>
                      {item.badge && (
                        <span className={`
                          text-[10px] px-1.5 py-0.5 rounded-full font-medium
                          ${active 
                            ? 'bg-white/20 text-white' 
                            : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400'
                          }
                        `}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Earnings Summary */}
          {isOpen && (
            <div className="px-2 mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEarningsMenu(!showEarningsMenu);
                }}
                className="w-full flex items-center justify-between px-2 py-2 text-xs text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-gray-800 rounded-lg transition-all"
              >
                <span className="font-medium flex items-center gap-1.5">
                  <TrendingUp size={14} />
                  TODAY&apos;S EARNINGS
                </span>
                <ChevronDown size={14} className={`transform transition-all duration-300 ${showEarningsMenu ? 'rotate-180' : ''}`} />
              </button>
              
              {showEarningsMenu && (
                <div className="mt-2 space-y-2 animate-slideDown">
                  <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg p-3 text-white shadow-md">
                    <p className="text-[10px] text-emerald-100 flex items-center gap-1">
                      <span className="w-1 h-1 bg-amber-300 rounded-full"></span>
                      Current Balance
                    </p>
                    <p className="text-xl font-bold mt-0.5">₹2,450</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-[10px] text-emerald-100">Today&apos;s earning</span>
                      <span className="text-xs font-semibold flex items-center gap-1">
                        ₹850
                        <TrendingUp size={10} className="text-amber-300" />
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="bg-emerald-50/80 dark:bg-gray-800 rounded-lg p-2 border border-emerald-100 dark:border-gray-700">
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400">This Week</p>
                      <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">₹5.2k</p>
                      <p className="text-[8px] text-emerald-600/70 dark:text-emerald-400/70">+8%</p>
                    </div>
                    <div className="bg-emerald-50/80 dark:bg-gray-800 rounded-lg p-2 border border-emerald-100 dark:border-gray-700">
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400">This Month</p>
                      <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">₹18.4k</p>
                      <p className="text-[8px] text-emerald-600/70 dark:text-emerald-400/70">+15%</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="relative border-t border-emerald-100/50 dark:border-gray-700 bg-gradient-to-t from-emerald-50/50 dark:from-gray-800/50 to-transparent">
          {/* Dark Mode Toggle */}
          {isOpen && (
            <div className="px-2 pt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDarkMode(!isDarkMode);
                }}
                className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-gray-800 transition-all text-xs"
              >
                <div className="relative w-4 h-4">
                  <Sun size={14} className={`absolute transition-all duration-300 ${isDarkMode ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
                  <Moon size={14} className={`absolute transition-all duration-300 ${isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`} />
                </div>
                <span className="flex-1 text-left text-xs">Dark Mode</span>
                <div className={`w-7 h-4 rounded-full transition-colors ${isDarkMode ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  <div className={`w-3 h-3 rounded-full bg-white transform transition-transform ${isDarkMode ? 'translate-x-3.5' : 'translate-x-0.5'} mt-0.5 shadow-sm`}></div>
                </div>
              </button>
            </div>
          )}

          {/* Profile Section */}
          <div className="p-2">
            <div className="mt-2 pt-2 border-t border-emerald-100/50 dark:border-gray-700">
              <div className="flex items-center gap-2 px-2 group">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-xs font-bold text-white">RB</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                  <Heart size={8} className="absolute -top-1 -left-1 text-red-500 fill-red-500" />
                </div>
                
                {isOpen ? (
                  <>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1">
                        Ruchi Bazaar
                        <Award size={10} className="text-amber-500" />
                      </p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 truncate">Premium Partner</p>
                    </div>
                    <button 
                      className="p-1.5 hover:bg-emerald-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLogout();
                      }}
                    >
                      <LogOut size={14} className="text-emerald-600 dark:text-emerald-400" />
                    </button>
                  </>
                ) : (
                  <div className="relative group">
                    <div className="absolute left-full ml-2 px-1.5 py-0.5 bg-emerald-800 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      Ruchi Bazaar
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              {isOpen && (
                <div className="grid grid-cols-3 gap-1 mt-3 px-2">
                  <div className="bg-emerald-50 dark:bg-gray-800 rounded-lg p-1.5 text-center">
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400">Orders</p>
                    <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">156</p>
                    <p className="text-[8px] text-emerald-600/70 dark:text-emerald-400/70">this week</p>
                  </div>
                  <div className="bg-amber-50 dark:bg-gray-800 rounded-lg p-1.5 text-center">
                    <p className="text-[10px] text-amber-600 dark:text-amber-400">Rating</p>
                    <p className="text-sm font-bold text-amber-700 dark:text-amber-300">4.9</p>
                    <p className="text-[8px] text-amber-600/70 dark:text-amber-400/70">★ 245</p>
                  </div>
                  <div className="bg-teal-50 dark:bg-gray-800 rounded-lg p-1.5 text-center">
                    <p className="text-[10px] text-teal-600 dark:text-teal-400">Points</p>
                    <p className="text-sm font-bold text-teal-700 dark:text-teal-300">2.4k</p>
                    <p className="text-[8px] text-teal-600/70 dark:text-teal-400/70">redeem</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
        
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }

        /* Mobile optimizations */
        @media (max-width: 1023px) {
          aside {
            -webkit-tap-highlight-color: transparent;
          }
          
          button, a {
            min-height: 44px;
            touch-action: manipulation;
          }
        }
      `}</style>
    </>
  );
}
