"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  UtensilsCrossed, 
  DollarSign, 
  Tag, 
  User, 
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
  Store,
  LogOut,
  Settings,
  BarChart3,
  Home,
  Package,
  TrendingUp,
  Percent,
  ShieldCheck
} from "lucide-react";

const Sidebar = ({ isOpen, onClose, onToggle }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [restaurantName, setRestaurantName] = useState("");
  const [userName, setUserName] = useState("");
  const [userInitial, setUserInitial] = useState("P");

  // Load user and restaurant data
  useEffect(() => {
    const loadData = () => {
      try {
        const restaurantData = localStorage.getItem("restaurant");
        const userData = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        
        if (!token || !userData) {
          router.push("/Login");
          return;
        }
        
        if (restaurantData) {
          const restaurant = JSON.parse(restaurantData);
          setRestaurantName(restaurant.name || "");
        }
        
        if (userData) {
          const user = JSON.parse(userData);
          setUserName(user.name || "");
          setUserInitial(user.name?.charAt(0).toUpperCase() || "P");
        }
      } catch (error) {
        console.error("Error loading sidebar data:", error);
      }
    };
    
    loadData();
  }, [router]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 1024);
      
      // Auto-collapse on tablet
      if (width >= 640 && width < 1024) {
        setIsCollapsed(true);
      } else if (width >= 1024) {
        setIsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("restaurant");
    localStorage.removeItem("partnerToken");
    router.push("/Login");
  };

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/Orders", label: "Orders", icon: ShoppingBag },
    { path: "/Menu", label: "Menu", icon: UtensilsCrossed },
    { path: "/Earnings", label: "Earnings", icon: DollarSign },
    // { path: "/partner/analytics", label: "Analytics", icon: BarChart3 },
    { path: "/Offers", label: "Offers", icon: Percent },
    { path: "/Profile", label: "Profile", icon: Settings },
    { path: "/Policies", label: "Policies & Terms", icon: ShieldCheck },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Mobile Menu Button */}
      {isMobile && !isOpen && (
        <button
          onClick={onToggle}
          className="fixed top-4 left-4 z-30 p-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky
          top-0 left-0
          h-screen
          bg-white
          shadow-xl
          z-50
          transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed && !isMobile ? "w-20" : "w-72"}
          ${isMobile ? "w-72" : ""}
          border-r border-gray-100
          flex flex-col
        `}
      >
        {/* Header Section */}
        <div className="flex-shrink-0 p-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              {/* Logo */}
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-md">
                <Store className="text-white" size={22} />
              </div>
              
              {/* Restaurant Name */}
              {(!isCollapsed || isMobile) && (
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-bold text-gray-800 truncate">
                    {restaurantName || "Restaurant"}
                  </h2>
                  <p className="text-xs text-gray-500 truncate">Partner Dashboard</p>
                </div>
              )}
            </div>

            {/* Close/Colapse Buttons */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {isMobile ? (
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              ) : (
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  {isCollapsed ? (
                    <ChevronRight size={20} className="text-gray-500" />
                  ) : (
                    <ChevronLeft size={20} className="text-gray-500" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* User Info Section (Mobile/Expanded Only)
        {(!isCollapsed || isMobile) && (
          <div className="flex-shrink-0 p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center text-white font-bold shadow-md">
                  {userInitial}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-800 truncate">{userName || "Partner"}</p>
                <p className="text-xs text-gray-500 truncate">Restaurant Owner</p>
              </div>
            </div>
          </div>
        )} */}

        {/* Navigation Section */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={handleLinkClick}
                  className={`
                    flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                    ${isActive 
                      ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md shadow-red-100" 
                      : "text-gray-600 hover:bg-gray-50"
                    }
                    ${isCollapsed && !isMobile ? "justify-center" : ""}
                  `}
                  title={isCollapsed && !isMobile ? item.label : ""}
                >
                  <Icon 
                    size={22} 
                    className={`flex-shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? "text-white" : "text-gray-500 group-hover:text-red-500"
                    }`} 
                  />
                  
                  {(!isCollapsed || isMobile) && (
                    <>
                      <span className="font-medium text-sm flex-1 truncate">
                        {item.label}
                      </span>
                      {isActive && (
                        <div className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0" />
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer Section */}
        <div className="flex-shrink-0 p-4 border-t border-gray-100 bg-gray-50/50">
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
              text-red-600 hover:bg-red-50 group
              ${isCollapsed && !isMobile ? "justify-center" : ""}
            `}
            title={isCollapsed && !isMobile ? "Sign Out" : ""}
          >
            <LogOut size={22} className="flex-shrink-0 transition-transform group-hover:scale-110" />
            
            {(!isCollapsed || isMobile) && (
              <span className="font-medium text-sm">Sign Out</span>
            )}
          </button>
        </div>

        {/* Collapsed User Avatar (Tablet/Desktop Only) */}
        {isCollapsed && !isMobile && (
          <div className="flex-shrink-0 p-4 border-t border-gray-100 flex justify-center">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center text-white font-bold shadow-md">
                {userInitial}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Body Lock */}
      {isOpen && isMobile && (
        <style jsx global>{`
          body {
            overflow: hidden;
          }
        `}</style>
      )}
    </>
  );
};

export default Sidebar;