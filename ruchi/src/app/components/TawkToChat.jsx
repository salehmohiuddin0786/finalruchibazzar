"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Script from "next/script";
import { MessageCircle, X, RotateCw, Headphones, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const TAWK_PROPERTY_ID = "6ae37d7e11474f347101d63d";
const TAWK_WIDGET_ID = "1k64a4dm2";
const DIRECT_CHAT_URL = `https://tawk.to/chat/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;

export default function TawkToChat() {
  const { user } = useAuth();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(1);
  const [showTooltip, setShowTooltip] = useState(false);
  const iframeRef = useRef(null);

  // Sync visitor details with Tawk.to
  const syncVisitorDetails = useCallback(() => {
    if (!user || typeof window === "undefined" || !window.Tawk_API) return;

    if (typeof window.Tawk_API.setAttributes === "function") {
      const attributes = {};
      if (user.name) attributes.name = user.name;
      if (user.email) attributes.email = user.email;
      if (user.phone) attributes.phone = user.phone;

      if (Object.keys(attributes).length > 0) {
        window.Tawk_API.setAttributes(attributes, (error) => {
          if (error) console.warn("Tawk.to attributes error:", error);
        });
      }
    }
  }, [user]);

  const handleOpenPopup = useCallback(() => {
    setIsPopupOpen(true);
    setIsIframeLoading(true);
    setShowTooltip(false);
  }, []);

  const handleClosePopup = useCallback(() => {
    setIsPopupOpen(false);
  }, []);

  const handleReloadIframe = useCallback(() => {
    setIsIframeLoading(true);
    setIframeKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.openTawkChat = handleOpenPopup;

    const handleOpenEvent = () => handleOpenPopup();
    window.addEventListener("open-tawk-chat", handleOpenEvent);

    // Setup Tawk background initialization & hide raw widget
    const interval = setInterval(() => {
      if (window.Tawk_API) {
        syncVisitorDetails();

        if (typeof window.Tawk_API.hideWidget === "function") {
          window.Tawk_API.hideWidget();
        }

        window.Tawk_API.onLoad = () => {
          syncVisitorDetails();
          if (typeof window.Tawk_API.hideWidget === "function") {
            window.Tawk_API.hideWidget();
          }
        };

        clearInterval(interval);
      }
    }, 400);

    // Show hint tooltip after 6 seconds
    const tooltipTimer = setTimeout(() => {
      setShowTooltip(true);
    }, 6000);

    const autoHideTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 15000);

    return () => {
      delete window.openTawkChat;
      window.removeEventListener("open-tawk-chat", handleOpenEvent);
      clearInterval(interval);
      clearTimeout(tooltipTimer);
      clearTimeout(autoHideTimer);
    };
  }, [handleOpenPopup, syncVisitorDetails]);

  // Lock background scroll when popup is open
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (isPopupOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
    };
  }, [isPopupOpen]);

  return (
    <>
      {/* Background Tawk.to script to register analytics & notifications */}
      <Script
        id="tawk-to-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var Tawk_API = Tawk_API || {};
            var Tawk_LoadStart = new Date();
            (function(){
              var s1 = document.createElement("script"),
                  s0 = document.getElementsByTagName("script")[0];
              s1.async = true;
              s1.src = 'https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}';
              s1.charset = 'UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
            })();
          `,
        }}
      />

      {/* Global CSS to suppress any intrusive native raw full-screen widget */}
      <style jsx global>{`
        #tawk-bubble-container,
        .tawk-min-container,
        div[class*="tawk-min-container"] {
          display: none !important;
        }
      `}</style>

      {/* 1. Mobile-friendly Floating Action Pill */}
      {!isPopupOpen && (
        <aside
          aria-label="Customer Live Support"
          className="fixed right-3 sm:right-6 bottom-20 sm:bottom-24 lg:bottom-6 z-40 transition-all duration-300"
        >
          {showTooltip && (
            <div className="absolute right-0 bottom-full mb-2 w-52 sm:w-60 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-orange-200 text-gray-800 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <button
                onClick={() => setShowTooltip(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-0.5 rounded-full"
                aria-label="Close message"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-orange-600">Need Help?</span>
              </div>
              <p className="text-xs leading-relaxed text-gray-600">
                Chat with our live support team directly here!
              </p>
            </div>
          )}

          <button
            onClick={handleOpenPopup}
            className="group flex items-center gap-2.5 bg-gradient-to-r from-orange-500 via-rose-500 to-red-600 text-white px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-full shadow-2xl hover:shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/60 backdrop-blur-sm"
            title="Chat with Ruchi Bazaar Support"
            aria-label="Open Live Chat Support"
          >
            <div className="relative flex items-center justify-center">
              <MessageCircle className="w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform group-hover:scale-110" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white" />
              </span>
            </div>

            <div className="flex flex-col text-left">
              <span className="text-xs sm:text-sm font-bold tracking-wide leading-tight">
                Live Chat
              </span>
              <span className="hidden sm:inline text-[10px] text-orange-100 font-medium leading-none">
                Online now
              </span>
            </div>
          </button>
        </aside>
      )}

      {/* 2. Responsive Popup Modal with Dimmed Backdrop */}
      {isPopupOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="support-popup-title"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={handleClosePopup}
        >
          {/* Modal Container */}
          <div
            className="relative w-full sm:max-w-md h-[82vh] sm:h-[650px] max-h-[88vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Drag Indicator Bar */}
            <div className="sm:hidden w-full flex justify-center pt-2 pb-1 bg-gradient-to-r from-orange-500 via-rose-500 to-red-600">
              <div className="w-10 h-1 bg-white/40 rounded-full" />
            </div>

            {/* Popup Header */}
            <header className="bg-gradient-to-r from-orange-500 via-rose-500 to-red-600 text-white px-4 sm:px-5 py-3 flex items-center justify-between shrink-0 shadow-sm">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 border border-white/30">
                  <Headphones className="w-5 h-5" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
                </div>

                <div className="min-w-0">
                  <h3
                    id="support-popup-title"
                    className="font-bold text-sm sm:text-base text-white truncate flex items-center gap-1.5"
                  >
                    Ruchi Bazaar Support
                    <ShieldCheck className="w-3.5 h-3.5 text-orange-200 shrink-0" />
                  </h3>
                  <p className="text-[11px] sm:text-xs text-white/90 truncate flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span>Active Now • Instant replies</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleReloadIframe}
                  className="p-1.5 rounded-full hover:bg-white/20 active:scale-95 text-white/90 hover:text-white transition-colors"
                  title="Reload chat"
                  aria-label="Reload chat"
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                <button
                  onClick={handleClosePopup}
                  className="p-1.5 rounded-full hover:bg-white/20 active:scale-95 text-white/90 hover:text-white transition-colors"
                  title="Close support chat"
                  aria-label="Close support chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </header>

            {/* Popup Chat Body */}
            <div className="relative flex-1 w-full h-full bg-gray-50 overflow-hidden">
              {isIframeLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-10 gap-3">
                  <div className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-semibold text-gray-500">
                    Connecting to live support...
                  </p>
                </div>
              )}

              <iframe
                key={iframeKey}
                ref={iframeRef}
                src={DIRECT_CHAT_URL}
                title="Ruchi Bazaar Customer Support Chat"
                className="w-full h-full border-0"
                allow="camera; microphone; autoplay"
                onLoad={() => setIsIframeLoading(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
