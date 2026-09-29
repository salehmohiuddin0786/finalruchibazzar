"use client";

import {
  Bell,
  Search,
  ChevronDown,
  LogOut,
  Settings,
  User,
  Store,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Header = ({ title, subtitle, onMenuClick, sidebarOpen }) => {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [restaurantName, setRestaurantName] = useState("");
  const [userName, setUserName] = useState("");
  const [userInitial, setUserInitial] = useState("P");

  useEffect(() => {
    const loadUserData = () => {
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
          setRestaurantName(restaurant.name || "Restaurant");
        }

        const user = JSON.parse(userData);
        setUserName(user.name || "Partner");
        setUserInitial(user.name?.charAt(0).toUpperCase() || "P");
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("restaurant");
    localStorage.removeItem("partnerToken");
    router.push("/Login");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div className="px-3 sm:px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between gap-2">
          {/* Left */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            {!sidebarOpen && onMenuClick && (
              <button
                onClick={onMenuClick}
                className="lg:hidden shrink-0 p-2 rounded-lg hover:bg-gray-100"
                aria-label="Open menu"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            )}

            <div className="min-w-0">
              <h1 className="text-base sm:text-lg md:text-2xl font-bold text-gray-800 flex items-center gap-2 min-w-0">
                <Store className="w-5 h-5 md:w-6 md:h-6 text-red-500 shrink-0" />
                <span className="truncate max-w-[150px] xs:max-w-[200px] sm:max-w-[300px] md:max-w-none">
                  {restaurantName || title || "Restaurant Dashboard"}
                </span>
              </h1>

              {subtitle && (
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block truncate mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden xl:flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search orders, menu items..."
              className="bg-transparent border-none outline-none px-2 text-sm w-64"
            />
          </div>

          {/* Right */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button className="relative p-2 rounded-lg hover:bg-gray-100">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 p-1.5 md:p-2 rounded-lg hover:bg-gray-100"
              >
                <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                  {userInitial}
                </div>

                <div className="hidden md:block text-left max-w-[130px]">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {userName || "Partner"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    Restaurant Owner
                  </p>
                </div>

                <ChevronDown
                  className={`w-4 h-4 text-gray-500 hidden md:block transition-transform ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDropdown(false)}
                  />

                  <div className="absolute right-0 mt-2 w-[calc(100vw-24px)] max-w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {userName}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {restaurantName}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Restaurant Partner
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        router.push("/partner/profile");
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                    >
                      <User className="w-4 h-4 text-gray-500" />
                      Profile Settings
                    </button>

                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        router.push("/partner/settings");
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                    >
                      <Settings className="w-4 h-4 text-gray-500" />
                      Restaurant Settings
                    </button>

                    <div className="border-t border-gray-100 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mt-3 xl:hidden">
          <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none px-2 text-sm w-full"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;