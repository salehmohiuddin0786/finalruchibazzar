"use client";

import { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { DashboardContent } from "@/components/watermelon/bionis-dashboard/components/bionis/dashboard-content";
import "@/components/watermelon/bionis-dashboard/dashboard.css";
import { Menu } from "lucide-react";

export default function Dashboard() {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [restaurantData, setRestaurantData] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 1024);
      if (width >= 1024) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem("restaurant") ||
        sessionStorage.getItem("restaurant");
      if (stored) {
        setRestaurantData(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => {
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F9FAFB]">
      {/* Mobile Menu Button */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 z-40 p-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg active:scale-95 transition-transform"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      )}

      {/* Mobile Drawer Overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity"
          onClick={closeSidebar}
        />
      )}

      <div className="flex min-w-0">
        {/* Existing untouched Ruchi Bazaar Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={closeSidebar}
          onToggle={toggleSidebar}
        />

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 min-h-screen overflow-x-hidden text-gray-900">
          {/* Existing untouched Ruchi Bazaar Header */}
          <Header
            title={restaurantData?.name || "Dashboard Overview"}
            subtitle="Welcome back to your restaurant dashboard!"
            onMenuClick={toggleSidebar}
            sidebarOpen={sidebarOpen}
          />

          {/* Bionis-styled Main Dashboard Content Only */}
          <main className="p-3 sm:p-4 md:p-6 lg:p-8 overflow-x-hidden bionis-dashboard">
            <DashboardContent />
          </main>
        </div>
      </div>
    </div>
  );
}
