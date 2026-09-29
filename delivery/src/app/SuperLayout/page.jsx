"use client";
import { useState, useEffect } from "react";
import DeliverySidebar from "../components/DeliverySidebar";
import DeliveryHeader from "../components/DeliveryHeader";

const SuperLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (active) setMounted(true);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      const tablet = width >= 768 && width < 1024;
      
      setIsMobile(mobile);
      setIsTablet(tablet);
      
      // Auto close sidebar on mobile, open on tablet/desktop
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Handle body scroll lock when mobile sidebar is open
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, sidebarOpen]);

  if (!mounted) {
    return null;
  }

  // Determine sidebar width based on screen size and state
  const getSidebarWidth = () => {
    if (isMobile) {
      return sidebarOpen ? 'w-72' : 'w-0';
    } else if (isTablet) {
      return sidebarOpen ? 'w-64' : 'w-20';
    } else {
      return sidebarOpen ? 'w-64' : 'w-20';
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div 
        className={`
          fixed lg:relative z-30 h-full transition-all duration-300 ease-in-out
          ${getSidebarWidth()}
          ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
          ${isMobile && sidebarOpen ? 'shadow-xl' : ''}
        `}
      >
        <DeliverySidebar 
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          onClose={closeSidebar}
          isMobile={isMobile}
        />
      </div>

      {/* Main Content Area */}
      <div 
        className={`
          flex-1 flex flex-col h-full transition-all duration-300
          ${!isMobile && sidebarOpen ? 'lg:ml-0' : 'lg:ml-0'}
        `}
      >
        <DeliveryHeader 
          toggleSidebar={toggleSidebar}
          isSidebarOpen={sidebarOpen}
          isMobile={isMobile}
        />

        {/* Overlay for mobile */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-20 animate-fadeIn"
            onClick={closeSidebar}
            aria-label="Close sidebar"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                closeSidebar();
              }
            }}
          />
        )}

        {/* Main Content with responsive padding */}
        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className={`
            ${isMobile ? 'p-3' : isTablet ? 'p-5' : 'p-6 lg:p-8'}
            min-h-full min-w-0
          `}>
            <div className={`
              mx-auto min-w-0
              ${isMobile ? 'max-w-full' : 'max-w-7xl'}
            `}>
              {/* Content wrapper with responsive spacing */}
              <div className="min-w-0 space-y-4 md:space-y-6">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add custom scrollbar styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-in-out;
        }
        
        /* Custom scrollbar */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
        
        /* Mobile touch optimizations */
        @media (max-width: 767px) {
          * {
            -webkit-tap-highlight-color: transparent;
          }
          
          input, button, a {
            touch-action: manipulation;
          }
        }
      `}</style>
    </div>
  );
};

export default SuperLayout;
