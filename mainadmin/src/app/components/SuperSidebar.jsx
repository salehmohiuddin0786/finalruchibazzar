"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Bell,
  Settings,
  User,
  Shield,
  Activity,
} from "lucide-react";
import { useState, useEffect } from "react";
import { navSections } from "../data/mainAdmin";
import { clearMainAdminSession } from "../lib/api";

const SuperSidebar = ({ isMobileOpen = false, onMobileClose }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (active) {
        setMounted(true);
        const savedState = localStorage.getItem("sidebarCollapsed");
        if (savedState !== null) {
          setIsCollapsed(savedState === "true");
        }
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", newState);
  };

  const linkClass = (href) => {
    const isActive = pathname === href;
    const baseClasses = "relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group";
    const activeClasses = "bg-gradient-to-r from-emerald-50 to-emerald-100/50 text-emerald-700 font-semibold shadow-sm";
    const inactiveClasses = "text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-0.5";
    const collapsedClasses = isCollapsed ? "md:justify-center md:px-2" : "";
    
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${collapsedClasses}`;
  };

  const iconWrapperClass = (href) => {
    const isActive = pathname === href;
    const baseClasses = "relative transition-all duration-300";
    const activeClasses = "text-emerald-600";
    const inactiveClasses = "text-slate-400 group-hover:text-emerald-500";
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  const getIconBackground = (href) => {
    const isActive = pathname === href;
    if (isActive) return "bg-emerald-100";
    return "bg-transparent group-hover:bg-emerald-50";
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-40 md:hidden animate-in fade-in-0 duration-300"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 h-dvh md:h-screen 
          bg-gradient-to-b from-white via-white to-slate-50/50
          shadow-xl flex flex-col transition-all duration-500 ease-out z-50
          border-r border-slate-200/50
          ${isMobileOpen ? "left-0" : "-left-72"} w-72 md:left-0
          ${isCollapsed ? "md:w-20" : "md:w-64"}
        `}
      >
        {/* Logo Section */}
        <div className={`relative p-4 border-b border-slate-200/50 bg-white/50 backdrop-blur-sm ${
          isCollapsed ? "md:flex-col md:gap-4" : ""
        }`}>
          {/* Decorative gradient line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
          
          <div className={`flex items-center justify-between ${
            isCollapsed ? "md:flex-col" : ""
          }`}>
            <div className={`flex items-center gap-2.5 ${
              isCollapsed ? "md:flex-col" : ""
            }`}>
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-300" />
                <div className="relative w-9 h-9 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">RB</span>
                </div>
              </div>
              <div className={`overflow-hidden transition-all duration-300 ${
                isCollapsed ? "md:hidden" : ""
              }`}>
                <h2 className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  RuchiBazzar
                </h2>
                <p className="text-[10px] font-medium text-emerald-600 tracking-wide">Admin Portal</p>
              </div>
            </div>

            {/* Collapse Button - Desktop only */}
            <button
              onClick={toggleCollapse}
              className="hidden md:flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 transition-all duration-300 hover:scale-105 group"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-600 transition-colors" />
              ) : (
                <ChevronLeft className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-600 transition-colors" />
              )}
            </button>
            
            <button
              onClick={onMobileClose}
              className="rounded-lg p-1.5 transition-all duration-200 hover:bg-slate-100 md:hidden"
              aria-label="Close menu"
            >
              <X className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className={`flex-1 space-y-3 overflow-y-auto py-4 overscroll-contain scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300 ${
          isCollapsed ? "md:px-2" : "px-3"
        }`}>
          {navSections.map((section, sectionIdx) => (
            <div key={section.label} className="space-y-1.5">
              {!isCollapsed && (
                <div className="px-4 pt-2 pb-1">
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {section.label}
                    </p>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                  </div>
                </div>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                const isHovered = hoveredItem === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={linkClass(item.href)}
                    onClick={onMobileClose}
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-r-full" />
                    )}
                    
                    {/* Icon container */}
                    <div className={`relative p-1.5 rounded-lg transition-all duration-300 ${getIconBackground(item.href)}`}>
                      <Icon className={`w-5 h-5 transition-all duration-300 ${iconWrapperClass(item.href)} ${
                        isHovered && !isActive ? "scale-110" : ""
                      }`} />
                      {isActive && (
                        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      )}
                    </div>
                    
                    {/* Label */}
                    <span className={`truncate text-sm font-medium transition-all duration-300 ${
                      isCollapsed ? "md:hidden" : ""
                    } ${isActive ? "text-emerald-700" : "text-slate-600 group-hover:text-slate-900"}`}>
                      {item.name}
                    </span>
                    
                    {/* Hover tooltip for collapsed state */}
                    {isCollapsed && isHovered && mounted && (
                      <div className="fixed left-20 z-50 ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded-md shadow-lg whitespace-nowrap animate-in fade-in-0 zoom-in-95 slide-in-from-left-2">
                        {item.name}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="space-y-2 p-3 border-t border-slate-200/50 bg-gradient-to-t from-white to-transparent">
          {/* Status Indicator */}
          {!isCollapsed && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50/50 border border-emerald-100">
              <div className="relative">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping opacity-75" />
              </div>
              <span className="text-xs font-medium text-emerald-700">System Active</span>
              <Shield className="w-3 h-3 text-emerald-500 ml-auto" />
            </div>
          )}
          
          {/* User Section */}
          <div className={`flex items-center gap-3 p-2 rounded-xl transition-all duration-300 ${
            !isCollapsed ? "bg-gradient-to-r from-slate-50 to-white" : "justify-center"
          }`}>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur opacity-0 group-hover:opacity-60 transition duration-300" />
              <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md cursor-pointer">
                <span className="text-white text-sm font-bold">AD</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
            
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">Admin User</p>
                <p className="text-[10px] text-slate-500 truncate">admin@ruchibazzar.com</p>
              </div>
            )}
            
            {!isCollapsed && (
              <button 
                className="p-1.5 rounded-lg hover:bg-slate-100 transition-all duration-200 hover:scale-105"
                aria-label="Settings"
              >
                <Settings className="w-4 h-4 text-slate-400 hover:text-emerald-600 transition-colors" />
              </button>
            )}
          </div>

          {/* Logout Button */}
          <button
            className={`relative flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all duration-300 group overflow-hidden ${
              isCollapsed ? "md:justify-center md:px-2" : ""
            }`}
            onClick={() => {
              clearMainAdminSession();
              router.replace("/Login");
            }}
          >
            {/* Hover background animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-rose-50 to-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10">
              <LogOut className={`w-5 h-5 transition-all duration-300 text-slate-400 group-hover:text-rose-600 group-hover:scale-110 ${
                isCollapsed ? "md:mx-auto" : ""
              }`} />
            </div>
            
            <span className={`relative z-10 text-sm font-medium text-slate-600 group-hover:text-rose-600 transition-colors duration-300 ${
              isCollapsed ? "md:hidden" : ""
            }`}>
              Logout
            </span>
            
            {!isCollapsed && (
              <Sparkles className="relative z-10 w-3.5 h-3.5 text-slate-300 group-hover:text-rose-400 transition-all duration-300 ml-auto opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0" />
            )}
          </button>
        </div>
      </aside>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  );
};

export default SuperSidebar;