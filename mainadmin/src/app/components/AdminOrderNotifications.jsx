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

    const existingScript = document.querySelector("script[data-ruchi-admin-socket]");
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.io), { once: true });
      existingScript.addEventListener("error", () => {
        loadCdnSocketIo().then(resolve).catch(reject);
      }, { once: true });
      return;
    }

    const script = document.createElement("script");
    const socketUrl = getSocketUrl();
    script.src = `${socketUrl}/socket.io/socket.io.js`;
    script.async = true;
    script.dataset.ruchiAdminSocket = "true";
    script.onload = () => resolve(window.io);
    script.onerror = () => {
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

export default function AdminOrderNotifications() {
  const router = useRouter();
  const [activeAlert, setActiveAlert] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const recentOrdersRef = useRef(new Set());
  const socketRef = useRef(null);

  const handleNewOrder = useCallback((order) => {
    if (!order) return;
    const orderId = order.id || order.orderId;
    if (!orderId) return;

    if (recentOrdersRef.current.has(orderId)) return;
    recentOrdersRef.current.add(orderId);
    setTimeout(() => {
      recentOrdersRef.current.delete(orderId);
    }, 15000);

    if (soundEnabled) {
      playOrderNotificationSound();
    }

    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        try {
          new Notification("🔔 New Order Received (Admin)", {
            body: `Order #${order.orderNumber || orderId} • ₹${order.totalAmount || order.total || order.amount || ""} • ${order.restaurant?.name || order.restaurantName || "Restaurant"}`,
            icon: "/favicon.ico",
            tag: `ruchi-admin-order-${orderId}`,
          });
        } catch (err) {
          console.warn("Notification error:", err);
        }
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission();
      }
    }

    setActiveAlert(order);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("ruchi-admin-order-received", { detail: order }));
    }
  }, [soundEnabled]);

  useEffect(() => {
    let isCancelled = false;

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
          console.log("Superadmin connected to order notification socket:", socket.id);
          socket.emit("joinAdminRoom");
        });

        socket.on("newOrder", handleNewOrder);
        socket.on("adminNewOrder", handleNewOrder);
      })
      .catch((err) => {
        console.warn("Could not connect admin order notification socket:", err.message);
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
  const restaurantName = activeAlert.restaurant?.name || activeAlert.restaurantName || "Restaurant";
  const customerName = activeAlert.customerDetails?.name || activeAlert.customer || activeAlert.user?.name || "Customer";

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-lg shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-700 backdrop-blur-md shadow-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl shrink-0">
            <Bell className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Live Order
              </span>
              <span className="text-sm font-semibold truncate text-slate-200">
                #{orderNum}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-300 truncate mt-1">
              ₹{totalAmount} • {restaurantName} ({customerName})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setSoundEnabled((prev) => !prev)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            title={soundEnabled ? "Mute alert sound" : "Unmute alert sound"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={() => {
              setActiveAlert(null);
              router.push("/AllOrders");
            }}
            className="flex items-center gap-1.5 bg-emerald-500 text-slate-950 hover:bg-emerald-400 px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
          >
            <span>Orders</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveAlert(null)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
