"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Bell, X, ArrowRight, Volume2, VolumeX } from "lucide-react";
import { playOrderNotificationSound } from "../lib/notificationSound";

const getSocketUrl = () => {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host.includes("ruchibazaar.in") || host.includes("ruchibazaar.com")) {
      return "https://api.ruchibazaar.in";
    }
  }
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000/api";
  return base.replace(/\/api\/?$/, "");
};

const loadSocketIo = () =>
  new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("No window"));
    if (window.io) return resolve(window.io);

    const existingScript = document.querySelector("script[data-ruchi-socket]");
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.io), { once: true });
      existingScript.addEventListener("error", () => {
        // Fallback to CDN
        loadCdnSocketIo().then(resolve).catch(reject);
      }, { once: true });
      return;
    }

    const script = document.createElement("script");
    const socketUrl = getSocketUrl();
    script.src = `${socketUrl}/socket.io/socket.io.js`;
    script.async = true;
    script.dataset.ruchiSocket = "true";
    script.onload = () => resolve(window.io);
    script.onerror = () => {
      // Fallback to reliable CDN if backend socket script fails
      loadCdnSocketIo().then(resolve).catch(reject);
    };
    document.body.appendChild(script);
  });

const loadCdnSocketIo = () =>
  new Promise((resolve, reject) => {
    if (window.io) return resolve(window.io);
    const cdnScript = document.createElement("script");
    cdnScript.src = "https://cdn.socket.io/4.7.5/socket.io.min.js";
    cdnScript.async = true;
    cdnScript.onload = () => resolve(window.io);
    cdnScript.onerror = () => reject(new Error("Failed to load socket.io from CDN"));
    document.body.appendChild(cdnScript);
  });

export default function PartnerOrderNotifications() {
  const router = useRouter();
  const [activeAlert, setActiveAlert] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const recentOrdersRef = useRef(new Set());
  const socketRef = useRef(null);

  const handleNewOrder = useCallback((order) => {
    if (!order) return;
    const orderId = order.id || order.orderId;
    if (!orderId) return;

    // Check if order belongs to this restaurant
    try {
      const restData = localStorage.getItem("restaurant");
      if (restData) {
        const restaurant = JSON.parse(restData);
        if (order.restaurantId && Number(order.restaurantId) !== Number(restaurant.id)) {
          return; // Ignore order for other restaurants
        }
      }
    } catch (e) {
      // ignore
    }

    // Deduplicate within 15 seconds
    if (recentOrdersRef.current.has(orderId)) return;
    recentOrdersRef.current.add(orderId);
    setTimeout(() => {
      recentOrdersRef.current.delete(orderId);
    }, 15000);

    // Play sound if enabled
    if (soundEnabled) {
      playOrderNotificationSound();
    }

    // Show desktop notification
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        try {
          new Notification("🔔 New Order Received!", {
            body: `Order #${order.orderNumber || orderId} • Total: ₹${order.totalAmount || order.total || order.amount || ""}`,
            icon: "/Logo.png",
            tag: `ruchi-order-${orderId}`,
          });
        } catch (err) {
          console.warn("Notification error:", err);
        }
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission();
      }
    }

    // Set floating alert banner
    setActiveAlert(order);

    // Dispatch global event for pages to update in real time
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("ruchi-order-received", { detail: order }));
    }
  }, [soundEnabled]);

  useEffect(() => {
    let isCancelled = false;

    // Request notification permission on first user click anywhere
    const requestPerm = () => {
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
        Notification.requestPermission().catch(() => {});
      }
    };
    window.addEventListener("click", requestPerm, { once: true });

    loadSocketIo()
      .then((io) => {
        if (isCancelled || !io) return;
        const socketUrl = getSocketUrl();
        const socket = io(socketUrl, {
          transports: ["websocket", "polling"],
          reconnection: true,
          reconnectionAttempts: 20,
          reconnectionDelay: 1500,
        });
        socketRef.current = socket;

        socket.on("connect", () => {
          console.log("Connected to order notification socket:", socket.id);
          try {
            const restData = localStorage.getItem("restaurant");
            if (restData) {
              const restaurant = JSON.parse(restData);
              if (restaurant?.id) {
                socket.emit("joinRestaurantRoom", restaurant.id);
              }
            }
            socket.emit("joinAdminRoom");
          } catch (e) {
            // ignore
          }
        });

        socket.on("newOrder", handleNewOrder);
        socket.on("adminNewOrder", handleNewOrder);
      })
      .catch((err) => {
        console.warn("Could not connect partner order notification socket:", err.message);
      });

    return () => {
      isCancelled = true;
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      window.removeEventListener("click", requestPerm);
    };
  }, [handleNewOrder]);

  if (!activeAlert) return null;

  const orderNum = activeAlert.orderNumber || `ORD-${activeAlert.id}`;
  const totalAmount = activeAlert.totalAmount || activeAlert.total || activeAlert.amount || 0;
  const customerName = activeAlert.customerDetails?.name || activeAlert.customer || activeAlert.user?.name || "Customer";

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-lg animate-bounce-short shadow-2xl">
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 text-white rounded-2xl p-4 sm:p-5 border-2 border-white/30 backdrop-blur-md shadow-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative p-2.5 bg-white/20 rounded-xl backdrop-blur-sm shrink-0">
            <Bell className="w-6 h-6 text-yellow-300 animate-spin" style={{ animationDuration: "2s" }} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-white text-red-600 px-2 py-0.5 rounded-full uppercase tracking-wider">
                New Order
              </span>
              <span className="text-sm font-semibold truncate text-white/90">
                #{orderNum}
              </span>
            </div>
            <p className="text-sm font-bold text-white truncate mt-1">
              ₹{totalAmount} • {customerName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setSoundEnabled((prev) => !prev)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            title={soundEnabled ? "Mute alert sound" : "Unmute alert sound"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-white/60" />}
          </button>

          <button
            onClick={() => {
              setActiveAlert(null);
              router.push("/Orders");
            }}
            className="flex items-center gap-1.5 bg-white text-red-600 hover:bg-red-50 px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
          >
            <span>View</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveAlert(null)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white/80 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
