"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle, Clock, IndianRupee, MapPin, Package, X, XCircle } from "lucide-react";
import { deliveryApi, getDeliveryToken } from "../lib/deliveryApi";

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

const getStoredPartnerId = () => {
  if (typeof window === "undefined") return null;

  try {
    const user = JSON.parse(localStorage.getItem("deliveryUser") || "null");
    if (user?.id) return user.id;
  } catch {
    // Ignore malformed local storage values.
  }

  try {
    const partner = JSON.parse(localStorage.getItem("deliveryPartner") || "null");
    if (partner?.userId) return partner.userId;
    if (partner?.id) return partner.id;
  } catch {
    // Ignore malformed local storage values.
  }

  return null;
};

function CountdownTimer({ expiresAt, seconds, onExpire }) {
  const [remaining, setRemaining] = useState(seconds || 30);

  useEffect(() => {
    const tick = () => {
      const next = expiresAt
        ? Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 1000))
        : Math.max(0, seconds || 30);
      setRemaining(next);
      if (next === 0) onExpire?.();
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [expiresAt, seconds, onExpire]);

  const progress = Math.max(0, Math.min(100, (remaining / (seconds || 30)) * 100));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-gray-600">
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          Response time
        </span>
        <span className="font-semibold text-gray-900">{remaining}s</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default function DeliveryAssignmentPopup() {
  const [request, setRequest] = useState(null);
  const [busyAction, setBusyAction] = useState("");
  const [error, setError] = useState("");

  const partnerId = useMemo(getStoredPartnerId, []);

  useEffect(() => {
    if (!partnerId || !getDeliveryToken()) return undefined;

    let socket;
    let cancelled = false;

    const connect = () => {
      if (cancelled || !window.io) return;

      socket = window.io(API_ORIGIN, {
        transports: ["websocket", "polling"],
        reconnection: true,
      });

      socket.emit("registerDeliveryPartner", partnerId);
      socket.emit("joinDeliveryRoom", partnerId);

      socket.on("connect", () => {
        socket.emit("registerDeliveryPartner", partnerId);
      });

      socket.on("deliveryAssignmentRequest", (payload) => {
        setError("");
        setBusyAction("");
        setRequest(payload);
      });

      socket.on("deliveryAssignmentExpired", (payload) => {
        if (payload?.orderId === request?.orderId) setRequest(null);
      });

      socket.on("deliveryAssignmentAccepted", (payload) => {
        if (payload?.orderId === request?.orderId) setRequest(null);
      });
    };

    if (window.io) {
      connect();
    } else {
      const script = document.createElement("script");
      script.src = `${API_ORIGIN}/socket.io/socket.io.js`;
      script.async = true;
      script.onload = connect;
      document.body.appendChild(script);
    }

    return () => {
      cancelled = true;
      if (socket) socket.disconnect();
    };
  }, [partnerId, request?.orderId]);

  const respond = async (action) => {
    if (!request?.orderId || busyAction) return;

    try {
      setBusyAction(action);
      setError("");
      await deliveryApi(`/delivery/${request.orderId}/${action}`, { method: "POST" });
      if (action === "accept") {
        window.dispatchEvent(new Event("deliveryOrdersChanged"));
      }
      setRequest(null);
    } catch (err) {
      const message = err.message || "Could not respond to this request";
      setError(message);

      if (message.toLowerCase().includes("no longer active") || message.toLowerCase().includes("expired")) {
        window.setTimeout(() => {
          setRequest(null);
          window.dispatchEvent(new Event("deliveryOrdersChanged"));
        }, 1200);
      }
    } finally {
      setBusyAction("");
    }
  };

  if (!request) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 px-3 py-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
        <div className="border-b border-gray-100 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">New delivery request</p>
              <h2 className="mt-1 text-lg font-bold text-gray-950">Order #{request.orderId}</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-emerald-50 p-2 text-emerald-600">
                <Package className="h-5 w-5" />
              </div>
              <button
                type="button"
                onClick={() => setRequest(null)}
                className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close delivery request"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">{request.restaurantName}</p>
            <p className="mt-1 flex gap-2 text-xs text-gray-600">
              <MapPin className="mt-0.5 h-4 w-4 flex-none text-gray-400" />
              <span>{request.pickupAddress}</span>
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Deliver to</p>
            <p className="mt-1 flex gap-2 text-sm text-gray-700">
              <MapPin className="mt-0.5 h-4 w-4 flex-none text-rose-500" />
              <span>{request.deliveryAddress}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="flex items-center gap-1 text-xs text-gray-500">
                <IndianRupee className="h-3.5 w-3.5" />
                Amount
              </p>
              <p className="mt-1 text-base font-bold text-gray-950">
                ₹{Number(request.totalAmount || 0).toLocaleString("en-IN")}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-xs text-gray-500">Distance</p>
              <p className="mt-1 text-base font-bold text-gray-950">
                {request.distance === null ? "N/A" : `${request.distance} km`}
              </p>
            </div>
          </div>

          <CountdownTimer
            expiresAt={request.expiresAt}
            seconds={request.countdownSeconds}
            onExpire={() => {
              setError("This delivery request expired");
              window.setTimeout(() => setRequest(null), 800);
            }}
          />

          {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</p>}

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => respond("reject")}
              disabled={Boolean(busyAction)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
            >
              <XCircle className="h-4 w-4" />
              {busyAction === "reject" ? "Rejecting..." : "Reject"}
            </button>
            <button
              type="button"
              onClick={() => respond("accept")}
              disabled={Boolean(busyAction)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
            >
              <CheckCircle className="h-4 w-4" />
              {busyAction === "accept" ? "Accepting..." : "Accept"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
