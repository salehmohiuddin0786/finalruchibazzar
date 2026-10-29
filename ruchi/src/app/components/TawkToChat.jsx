"use client";

import { useEffect, useState, useCallback } from "react";
import Script from "next/script";
import { MessageCircle, Headphones, Sparkles, X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const TAWK_PROPERTY_ID = "6ae37d7e11474f347101d63d";
const TAWK_WIDGET_ID = "1k64a4dm2";
const DIRECT_CHAT_URL = `https://tawk.to/chat/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;

export default function TawkToChat() {
  const { user } = useAuth();
  const [isTawkLoaded, setIsTawkLoaded] = useState(false);
  const [isChatMaximized, setIsChatMaximized] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  // Sync visitor details with Tawk.to dashboard
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

  // Open the chat popup seamlessly on both mobile and desktop
  const handleOpenChat = useCallback(() => {
    if (typeof window === "undefined") return;

    if (window.Tawk_API) {
      try {
        if (typeof window.Tawk_API.showWidget === "function") {
          window.Tawk_API.showWidget();
        }
        if (typeof window.Tawk_API.maximize === "function") {
          window.Tawk_API.maximize();
          setIsChatMaximized(true);
          return;
        }
        if (typeof window.Tawk_API.popup === "function") {
          window.Tawk_API.popup();
          return;
        }
      } catch (err) {
        console.warn("Tawk maximize call failed:", err);
      }
    }

    // Direct mobile popup fallback if script is still loading or in WebView
    const popupWidth = Math.min(window.innerWidth || 420, 450);
    const popupHeight = Math.min(window.innerHeight || 650, 700);
    const left = ((window.innerWidth || screen.width) - popupWidth) / 2;
    const top = ((window.innerHeight || screen.height) - popupHeight) / 2;

    window.open(
      DIRECT_CHAT_URL,
      "RuchiBazaarSupportChat",
      `width=${popupWidth},height=${popupHeight},top=${top},left=${left},scrollbars=yes,resizable=yes`
    );
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Attach global window trigger so any page/component can call window.openTawkChat()
    window.openTawkChat = handleOpenChat;

    const handleOpenEvent = () => handleOpenChat();
    window.addEventListener("open-tawk-chat", handleOpenEvent);

    // Setup Tawk callbacks once script mounts
    const interval = setInterval(() => {
      if (window.Tawk_API) {
        setIsTawkLoaded(true);
        syncVisitorDetails();

        window.Tawk_API.onLoad = () => {
          setIsTawkLoaded(true);
          syncVisitorDetails();
        };

        window.Tawk_API.onChatMaximized = () => {
          setIsChatMaximized(true);
          document.body.classList.add("tawk-mobile-open");
        };

        window.Tawk_API.onChatMinimized = () => {
          setIsChatMaximized(false);
          document.body.classList.remove("tawk-mobile-open");
        };

        clearInterval(interval);
      }
    }, 400);

    // Show friendly hint tooltip briefly after 5 seconds
    const promptTimer = setTimeout(() => {
      setShowPrompt(true);
    }, 5000);

    const autoHidePrompt = setTimeout(() => {
      setShowPrompt(false);
    }, 14000);

    return () => {
      delete window.openTawkChat;
      window.removeEventListener("open-tawk-chat", handleOpenEvent);
      clearInterval(interval);
      clearTimeout(promptTimer);
      clearTimeout(autoHidePrompt);
      if (typeof document !== "undefined") {
        document.body.classList.remove("tawk-mobile-open");
      }
    };
  }, [handleOpenChat, syncVisitorDetails]);

  return (
    <>
      {/* 1. Official Tawk.to Script with Mobile Safe Positioning */}
      <Script
        id="tawk-to-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var Tawk_API = Tawk_API || {};
            var Tawk_LoadStart = new Date();

            // Mobile-responsive offset: float safely above mobile bottom navigation bar
            Tawk_API.customStyle = {
              visibility: {
                desktop: {
                  position: 'br',
                  xOffset: 20,
                  yOffset: 20
                },
                mobile: {
                  position: 'br',
                  xOffset: 16,
                  yOffset: 85
                }
              },
              zIndex: 2147483640
            };

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

      {/* 2. Global Mobile Responsive CSS for Tawk.to Popup & Bubble */}
      <style jsx global>{`
        /* Position default tawk bubble safely above mobile bottom navigation (h-14/h-16) */
        @media (max-width: 1024px) {
          #tawk-bubble-container,
          .tawk-min-container,
          div[class*="tawk-min-container"] {
            bottom: calc(85px + env(safe-area-inset-bottom, 0px)) !important;
            right: 16px !important;
            z-index: 99999 !important;
          }
        }

        /* Prevent mobile popup modal overflow and horizontal shifts */
        @media (max-width: 768px) {
          iframe[title*="chat" i],
          iframe[src*="tawk.to"] {
            max-width: 100vw !important;
          }

          body.tawk-mobile-open {
            overflow: hidden !important;
          }
        }
      `}</style>

      {/* 3. Branded Mobile-Responsive Floating Popup Pill */}
      {!isChatMaximized && (
        <aside
          aria-label="Customer Live Support"
          className="fixed right-3 sm:right-6 bottom-20 sm:bottom-24 lg:bottom-6 z-40 transition-all duration-300"
        >
          {/* Friendly prompt bubble */}
          {showPrompt && (
            <div className="absolute right-0 bottom-full mb-2 w-52 sm:w-60 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-orange-200 text-gray-800 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <button
                onClick={() => setShowPrompt(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-0.5 rounded-full"
                aria-label="Close message"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-orange-600">Live Support</span>
              </div>
              <p className="text-xs leading-relaxed text-gray-600">
                Have questions about your order or food? Tap here to chat with us!
              </p>
            </div>
          )}

          {/* Floating Action Button */}
          <button
            onClick={handleOpenChat}
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
    </>
  );
}
