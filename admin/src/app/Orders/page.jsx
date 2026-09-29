"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  Truck,
  Package,
  User,
  Phone,
  MapPin,
  ChevronRight,
  RefreshCw,
  Menu,
  X,
  SlidersHorizontal,
  AlertCircle,
  Volume2,
  VolumeX,
  Mail,
  CreditCard,
  Home,
  Info,
  Sparkles,
  TrendingUp,
  ExternalLink,
} from "lucide-react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const API_URL = "http://localhost:5000/api";
const SOCKET_URL = API_URL.replace(/\/api\/?$/, "");

const ensureSocketIo = () =>
  new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("Socket is not available"));
    if (window.io) return resolve(window.io);

    const existingScript = document.querySelector("script[data-ruchi-socket]");
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.io), { once: true });
      existingScript.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = `${SOCKET_URL}/socket.io/socket.io.js`;
    script.async = true;
    script.dataset.ruchiSocket = "true";
    script.onload = () => resolve(window.io);
    script.onerror = () => reject(new Error("Unable to load live tracking"));
    document.body.appendChild(script);
  });

const formatMoney = (value) => `₹${Number(value || 0).toFixed(2)}`;

const getStatusKey = (status) => {
  const keyMap = {
    pending: "pending",
    confirmed: "confirmed",
    preparing: "preparing",
    ready: "ready",
    "on the way": "onTheWay",
    delivered: "delivered",
    cancelled: "cancelled",
  };

  return keyMap[status?.toLowerCase()] || "pending";
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "from-blue-500 to-blue-600";
    case "confirmed":
      return "from-cyan-500 to-cyan-600";
    case "preparing":
      return "from-amber-500 to-amber-600";
    case "ready":
      return "from-purple-500 to-purple-600";
    case "on the way":
      return "from-indigo-500 to-indigo-600";
    case "delivered":
      return "from-green-500 to-green-600";
    case "cancelled":
      return "from-red-500 to-red-600";
    default:
      return "from-gray-500 to-gray-600";
  }
};

const getOrderLatLng = (order) => {
  const lat =
    order?.latitude ||
    order?.lat ||
    order?.deliveryLatitude ||
    order?.deliveryLat ||
    order?.deliveryAddress?.latitude ||
    order?.deliveryAddress?.lat;

  const lng =
    order?.longitude ||
    order?.lng ||
    order?.deliveryLongitude ||
    order?.deliveryLng ||
    order?.deliveryAddress?.longitude ||
    order?.deliveryAddress?.lng;

  if (!lat || !lng) return null;

  return {
    lat,
    lng,
  };
};

const getManualAddress = (order) => {
  if (typeof order?.deliveryAddress === "string") {
    return order.deliveryAddress;
  }

  if (order?.deliveryAddress) {
    const address = order.deliveryAddress;

    return [
      address.houseNo,
      address.houseNumber,
      address.flatNo,
      address.street,
      address.streetAddress,
      address.road,
      address.colonyName,
      address.areaName,
      address.landmark ? `Landmark: ${address.landmark}` : "",
      address.city,
      address.cityName,
      address.state,
      address.stateName,
      address.pincode,
      address.postcode,
    ]
      .filter(Boolean)
      .join(", ");
  }

  return order?.address || "No address provided";
};

const getMapLink = (order) => {
  const coordinates = getOrderLatLng(order);

  if (coordinates) {
    return `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`;
  }

  const address = getManualAddress(order);

  if (address && address !== "No address provided") {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;
  }

  return null;
};

const getDeliveryTrackingLatLng = (order) => {
  const lat = order?.deliveryLat || order?.deliveryLatitude;
  const lng = order?.deliveryLng || order?.deliveryLongitude;

  if (!lat || !lng) return null;
  return { lat, lng };
};

const OrderCard = ({
  order,
  isExpanded,
  onToggleDetails,
  onUpdateStatus,
  deliveryPartners = [],
}) => {
  const [updating, setUpdating] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState(
    order.deliveryPartnerId ? String(order.deliveryPartnerId) : ""
  );

  useEffect(() => {
    let isMounted = true;
    queueMicrotask(() => {
      if (isMounted) {
        setSelectedPartnerId(order.deliveryPartnerId ? String(order.deliveryPartnerId) : "");
      }
    });
    return () => { isMounted = false; };
  }, [order.deliveryPartnerId]);

  const getStatusBadge = (status) => {
    const config = {
      pending: {
        color: "bg-blue-50 text-blue-700 border-blue-200",
        icon: Clock,
        label: "Pending",
        glow: "shadow-blue-200",
      },
      confirmed: {
        color: "bg-cyan-50 text-cyan-700 border-cyan-200",
        icon: CheckCircle,
        label: "Confirmed",
        glow: "shadow-cyan-200",
      },
      preparing: {
        color: "bg-amber-50 text-amber-700 border-amber-200",
        icon: RefreshCw,
        label: "Preparing",
        glow: "shadow-amber-200",
      },
      ready: {
        color: "bg-purple-50 text-purple-700 border-purple-200",
        icon: CheckCircle,
        label: "Ready",
        glow: "shadow-purple-200",
      },
      "on the way": {
        color: "bg-indigo-50 text-indigo-700 border-indigo-200",
        icon: Truck,
        label: "On the Way",
        glow: "shadow-indigo-200",
      },
      delivered: {
        color: "bg-green-50 text-green-700 border-green-200",
        icon: CheckCircle,
        label: "Delivered",
        glow: "shadow-green-200",
      },
      cancelled: {
        color: "bg-red-50 text-red-700 border-red-200",
        icon: XCircle,
        label: "Cancelled",
        glow: "shadow-red-200",
      },
    };

    const statusKey = status?.toLowerCase() || "pending";
    const { color, icon: Icon, label, glow } = config[statusKey] || config.pending;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${color} shadow-sm ${glow}`}
      >
        <Icon size={12} className="stroke-current" />
        {label}
      </span>
    );
  };

  const handleStatusUpdate = async (newStatus, options = {}) => {
    setUpdating(true);
    await onUpdateStatus(order.id, newStatus, options);
    setUpdating(false);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const manualAddress = getManualAddress(order);
  const mapLink = getMapLink(order);
  const coordinates = getOrderLatLng(order);
  const liveCoordinates = getDeliveryTrackingLatLng(order);
  const liveMapLink = liveCoordinates
    ? `https://www.google.com/maps?q=${liveCoordinates.lat},${liveCoordinates.lng}`
    : null;

  return (
    <div className="group relative">
      <div
        className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl transition-all duration-500 border border-white/40 hover:shadow-2xl hover:scale-[1.01] ${
          isExpanded ? "ring-2 ring-blue-400/50 shadow-2xl" : ""
        }`}
      >
        <div className="p-5 cursor-pointer transition-all duration-300" onClick={onToggleDetails}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl blur-md opacity-40 group-hover:opacity-60 transition-all" />
                <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  #{order.id}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 tracking-tight">
                  Order #{order.orderNumber || `ORD-${order.id}`}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <Clock size={12} className="text-gray-400" />
                  <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-bold text-gray-900 text-lg">
                  {formatMoney(order.totalAmount)}
                </p>
                <p className="text-xs text-gray-500">{order.items?.length || 0} items</p>
              </div>
              {getStatusBadge(order.status)}
              <ChevronRight
                size={20}
                className={`text-gray-400 transition-all duration-300 ${
                  isExpanded ? "rotate-90 text-blue-500" : ""
                }`}
              />
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="border-t border-gray-100/80 bg-gradient-to-b from-gray-50/50 to-white/80 p-5 rounded-b-2xl">
            <div className="mb-5">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <div className="p-1 bg-blue-100 rounded-lg">
                  <User size={14} className="text-blue-600" />
                </div>
                Customer Details
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-gray-100/80 hover:shadow-md transition-all">
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <User size={10} /> Customer Name
                  </p>
                  <p className="font-medium text-gray-800 flex items-center gap-2">
                    <User size={14} className="text-blue-500" />
                    {order.customerDetails?.name || order.customer || "N/A"}
                  </p>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-gray-100/80 hover:shadow-md transition-all">
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Phone size={10} /> Phone Number
                  </p>
                  <p className="font-medium text-gray-800 flex items-center gap-2">
                    <Phone size={14} className="text-green-500" />
                    {order.customerDetails?.phone || order.phone || "N/A"}
                  </p>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-gray-100/80 hover:shadow-md transition-all">
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Mail size={10} /> Email Address
                  </p>
                  <p className="font-medium text-gray-800 flex items-center gap-2">
                    <Mail size={14} className="text-purple-500" />
                    {order.customerDetails?.email || "N/A"}
                  </p>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-gray-100/80 hover:shadow-md transition-all">
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <CreditCard size={10} /> Payment Method
                  </p>
                  <p className="font-medium text-gray-800 flex items-center gap-2">
                    <CreditCard size={14} className="text-orange-500" />
                    {order.paymentMethod?.text ||
                      order.paymentMethod?.type ||
                      order.paymentMethod ||
                      "Cash on Delivery"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-5">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <div className="p-1 bg-red-100 rounded-lg">
                  <MapPin size={14} className="text-red-600" />
                </div>
                Delivery Address
              </h4>

              <div className="bg-gradient-to-r from-white to-gray-50/80 rounded-xl p-4 shadow-sm border-l-4 border-red-400">
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Manual Address
                    </p>

                    <div className="flex items-start gap-2">
                      <Home size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700 leading-relaxed">{manualAddress}</p>
                    </div>
                  </div>

                  {mapLink && (
                    <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                      <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">
                        Exact Location
                      </p>

                      {coordinates && (
                        <p className="text-xs text-blue-700 mb-2">
                          Coordinates: {coordinates.lat}, {coordinates.lng}
                        </p>
                      )}

                      <a
                        href={mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
                      >
                        <MapPin size={16} />
                        Open Exact Location In Map
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {(order.deliveryPartnerName || order.deliveryPartnerId || liveCoordinates) && (
              <div className="mb-5">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <div className="p-1 bg-indigo-100 rounded-lg">
                    <Truck size={14} className="text-indigo-600" />
                  </div>
                  Delivery Partner Live Tracking
                </h4>

                <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50 p-4 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase text-indigo-700">Assigned Partner</p>
                      <p className="font-bold text-gray-900 mt-1">
                        {order.deliveryPartnerName || "Delivery partner assigned"}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {liveCoordinates
                          ? `Live position: ${Number(liveCoordinates.lat).toFixed(5)}, ${Number(liveCoordinates.lng).toFixed(5)}`
                          : "Waiting for the partner to share live location"}
                      </p>
                    </div>

                    {liveMapLink && (
                      <a
                        href={liveMapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
                      >
                        <MapPin size={16} />
                        Open Live Map
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="mb-5">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <div className="p-1 bg-green-100 rounded-lg">
                  <Package size={14} className="text-green-600" />
                </div>
                Order Items
              </h4>

              <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50/80">
                      <tr>
                        <th className="px-4 py-3 text-left text-gray-600 font-semibold">Item</th>
                        <th className="px-4 py-3 text-center text-gray-600 font-semibold">Qty</th>
                        <th className="px-4 py-3 text-right text-gray-600 font-semibold">Price</th>
                        <th className="px-4 py-3 text-right text-gray-600 font-semibold">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items?.map((item, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-2 text-gray-800 font-medium">
                            {item.dish?.name || item.name || "Item"}
                          </td>
                          <td className="px-4 py-2 text-center text-gray-600">{item.quantity}</td>
                          <td className="px-4 py-2 text-right text-gray-600">{formatMoney(item.price)}</td>
                          <td className="px-4 py-2 text-right font-bold text-gray-800">
                            {formatMoney(Number(item.price || 0) * Number(item.quantity || 1))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50/80">
                      <tr>
                        <td colSpan="3" className="px-4 py-2 text-right text-gray-600">Subtotal:</td>
                        <td className="px-4 py-2 text-right font-medium">{formatMoney(order.subtotal)}</td>
                      </tr>
                      {Number(order.discount || 0) > 0 && (
                        <tr>
                          <td colSpan="3" className="px-4 py-2 text-right text-green-600">Discount:</td>
                          <td className="px-4 py-2 text-right text-green-600">-{formatMoney(order.discount)}</td>
                        </tr>
                      )}
                      <tr>
                        <td colSpan="3" className="px-4 py-2 text-right text-gray-600">Delivery Fee:</td>
                        <td className="px-4 py-2 text-right">{formatMoney(order.deliveryFee)}</td>
                      </tr>
                      <tr className="border-t border-gray-200">
                        <td colSpan="3" className="px-4 py-3 text-right font-bold text-gray-800">Total:</td>
                        <td className="px-4 py-3 text-right font-bold text-blue-600 text-lg">
                          {formatMoney(order.totalAmount)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {order.specialInstructions && (
              <div className="mb-5">
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Info size={14} className="text-yellow-500" />
                  Special Instructions
                </h4>
                <div className="bg-yellow-50/70 rounded-xl p-3 border border-yellow-200 backdrop-blur-sm">
                  <p className="text-sm text-yellow-800 italic">&quot;{order.specialInstructions}&quot;</p>
                </div>
              </div>
            )}

            {order.status?.toLowerCase() !== "delivered" &&
              order.status?.toLowerCase() !== "cancelled" && (
                <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-200/80">
                  {order.status?.toLowerCase() === "pending" && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate("confirmed")}
                        disabled={updating}
                        className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl text-sm font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-md shadow-cyan-200"
                      >
                        <CheckCircle size={16} />
                        Confirm Order
                      </button>
                      <button
                        onClick={() => setShowCancelConfirm(true)}
                        disabled={updating}
                        className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-md shadow-red-200"
                      >
                        <XCircle size={16} />
                        Cancel Order
                      </button>
                    </>
                  )}

                  {order.status?.toLowerCase() === "confirmed" && (
                    <button
                      onClick={() => handleStatusUpdate("preparing")}
                      disabled={updating}
                      className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl text-sm font-medium hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-md shadow-amber-200"
                    >
                      <RefreshCw size={16} />
                      Start Preparing
                    </button>
                  )}

                  {order.status?.toLowerCase() === "preparing" && (
                    <button
                      onClick={() => handleStatusUpdate("ready")}
                      disabled={updating}
                      className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-purple-600 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-md shadow-purple-200"
                    >
                      <CheckCircle size={16} />
                      Mark as Ready
                    </button>
                  )}

                  {order.status?.toLowerCase() === "ready" && (
                    <div className="flex flex-wrap items-center gap-3">
                      <select
                        value={selectedPartnerId}
                        onChange={(event) => setSelectedPartnerId(event.target.value)}
                        disabled={updating}
                        className="min-w-[220px] px-4 py-2.5 bg-white border border-indigo-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
                      >
                        <option value="">Select delivery partner</option>
                        {deliveryPartners.map((partner) => (
                          <option key={partner.id} value={partner.id}>
                            {partner.name}
                            {partner.isAvailable ? " - Available" : " - Busy"}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() =>
                          handleStatusUpdate("on the way", {
                            deliveryPartnerId: selectedPartnerId,
                          })
                        }
                        disabled={updating || !selectedPartnerId}
                        className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-indigo-600 hover:to-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-md shadow-indigo-200"
                      >
                        <Truck size={16} />
                        Assign Delivery
                      </button>
                    </div>
                  )}

                  {order.status?.toLowerCase() === "on the way" && (
                    <button
                      onClick={() => handleStatusUpdate("delivered")}
                      disabled={updating}
                      className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl text-sm font-medium hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-md shadow-green-200"
                    >
                      <CheckCircle size={16} />
                      Mark as Delivered
                    </button>
                  )}
                </div>
              )}

            {showCancelConfirm && (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-white/50 animate-in zoom-in duration-200">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto">
                    <AlertCircle className="text-red-600" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                    Cancel Order?
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    Are you sure you want to cancel Order #{order.orderNumber || order.id}? This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowCancelConfirm(false)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-all"
                    >
                      No, Keep Order
                    </button>
                    <button
                      onClick={() => {
                        handleStatusUpdate("cancelled");
                        setShowCancelConfirm(false);
                      }}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 font-medium transition-all"
                    >
                      Yes, Cancel Order
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Orders = () => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [restaurantData, setRestaurantData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef(null);
  const previousOrdersRef = useRef([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    preparing: 0,
    ready: 0,
    onTheWay: 0,
    delivered: 0,
    cancelled: 0,
  });
  const [dateRange, setDateRange] = useState("today");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/sounds/notification.mp3");
      audioRef.current.preload = "auto";
      audioRef.current.volume = 0.7;

      const savedSoundPreference = localStorage.getItem("soundEnabled");
      if (savedSoundPreference !== null) {
        setSoundEnabled(savedSoundPreference === "true");
      }

      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
  }, []);

  const playNotificationSound = useCallback(() => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => console.log("Audio play failed:", err));
    }
  }, [soundEnabled]);

  const checkForNewOrders = useCallback(
    (newOrders, oldOrders) => {
      if (!oldOrders.length) return;

      const oldOrderIds = new Set(oldOrders.map((order) => order.id));
      const newOrderIds = newOrders
        .filter((order) => !oldOrderIds.has(order.id))
        .map((order) => order.id);

      if (newOrderIds.length > 0) {
        playNotificationSound();

        if (Notification.permission === "granted") {
          newOrderIds.forEach((orderId) => {
            const newOrder = newOrders.find((o) => o.id === orderId);
            if (newOrder) {
              new Notification("🔔 New Order Received!", {
                body: `Order #${newOrder.orderNumber} from ${
                  newOrder.customerDetails?.name || newOrder.customer || "Customer"
                } - ${formatMoney(newOrder.totalAmount)}`,
                icon: "/restaurant-icon.png",
                tag: `order-${orderId}`,
              });
            }
          });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission();
        }

        setSuccessMessage(
          `🔔 ${newOrderIds.length} new order${newOrderIds.length > 1 ? "s" : ""} received!`
        );
        setTimeout(() => setSuccessMessage(""), 5000);

        const originalTitle = document.title;
        document.title = `🔔 ${newOrderIds.length} New Order${
          newOrderIds.length > 1 ? "s" : ""
        }!`;
        setTimeout(() => {
          document.title = originalTitle;
        }, 5000);
      }
    },
    [playNotificationSound]
  );

  const fetchDeliveryPartners = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${API_URL}/delivery-partner/available`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch delivery partners");

      const data = await response.json();
      setDeliveryPartners(data.partners || []);
    } catch (err) {
      console.error("Error fetching delivery partners:", err);
    }
  }, []);

  const fetchOrders = useCallback(
    async (showRefresh = false, page = 1, silent = false) => {
      if (showRefresh) setIsRefreshing(true);
      else if (!silent) setIsLoading(true);

      setError("");

      try {
        const token = localStorage.getItem("token");
        const restaurant = JSON.parse(localStorage.getItem("restaurant") || "null");

        if (!token || !restaurant) {
          router.push("/Login");
          return;
        }

        const params = new URLSearchParams({
          page: page.toString(),
          limit: pagination.limit.toString(),
          dateRange,
          ...(filter !== "all" && { status: filter }),
          ...(searchTerm && { search: searchTerm }),
        });

        const response = await fetch(
          `${API_URL}/orders/restaurant/${restaurant.id}?${params}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("restaurant");
            router.push("/Login");
            return;
          }

          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        const formattedOrders = data.orders || [];

        if (!silent && previousOrdersRef.current.length > 0) {
          checkForNewOrders(formattedOrders, previousOrdersRef.current);
        }

        previousOrdersRef.current = formattedOrders;
        setOrders(formattedOrders);

        setStats({
          total: data.totalOrders || formattedOrders.length,
          pending:
            data.stats?.pending ||
            formattedOrders.filter((o) => o.status === "pending").length,
          confirmed:
            data.stats?.confirmed ||
            formattedOrders.filter((o) => o.status === "confirmed").length,
          preparing:
            data.stats?.preparing ||
            formattedOrders.filter((o) => o.status === "preparing").length,
          ready:
            data.stats?.ready ||
            formattedOrders.filter((o) => o.status === "ready").length,
          onTheWay:
            data.stats?.onTheWay ||
            formattedOrders.filter((o) => o.status === "on the way").length,
          delivered:
            data.stats?.delivered ||
            formattedOrders.filter((o) => o.status === "delivered").length,
          cancelled:
            data.stats?.cancelled ||
            formattedOrders.filter((o) => o.status === "cancelled").length,
        });

        setPagination({
          page: data.currentPage || 1,
          limit: data.limit || 20,
          total: data.totalOrders || 0,
          totalPages: data.totalPages || 1,
        });
      } catch (err) {
        console.error("Error fetching orders:", err);
        if (!silent) setError("Failed to load orders. Please try again.");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [router, filter, searchTerm, dateRange, pagination.limit, checkForNewOrders]
  );

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      const restaurant = localStorage.getItem("restaurant");

      if (!token || !user) {
        router.push("/Login");
        return false;
      }

      try {
        const userData = JSON.parse(user);

        if (userData.role !== "partner") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("restaurant");
          router.push("/Login");
          return false;
        }

        if (restaurant) setRestaurantData(JSON.parse(restaurant));
        return true;
      } catch (err) {
        console.error("Auth check error:", err);
        router.push("/Login");
        return false;
      }
    };

    if (checkAuth()) {
      fetchOrders();
      fetchDeliveryPartners();
      const intervalId = setInterval(() => {
        fetchOrders(false, pagination.page, true);
      }, 10000);

      return () => clearInterval(intervalId);
    }
  }, [router, fetchOrders, fetchDeliveryPartners, pagination.page]);

  useEffect(() => {
    if (!restaurantData?.id) return undefined;

    let socket;
    let cancelled = false;

    const mergeLiveLocation = (payload) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          Number(order.id) === Number(payload.orderId)
            ? {
                ...order,
                deliveryLat: payload.deliveryLat,
                deliveryLng: payload.deliveryLng,
                deliveryStatus: payload.deliveryStatus || order.deliveryStatus,
              }
            : order
        )
      );
    };

    ensureSocketIo()
      .then((io) => {
        if (cancelled || !io) return;
        socket = io(SOCKET_URL, { transports: ["websocket", "polling"] });
        socket.emit("joinRestaurantRoom", restaurantData.id);
        socket.on("deliveryLocationUpdated", mergeLiveLocation);
        socket.on("deliveryAssigned", () => fetchOrders(false, pagination.page, true));
        socket.on("orderStatusUpdated", () => fetchOrders(false, pagination.page, true));
        socket.on("newOrder", () => fetchOrders(false, pagination.page, true));
      })
      .catch((err) => console.error("Live tracking socket error:", err));

    return () => {
      cancelled = true;
      if (socket) socket.disconnect();
    };
  }, [restaurantData?.id, fetchOrders, pagination.page]);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
      document.body.style.overflow = "unset";
    };
  }, []);

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    localStorage.setItem("soundEnabled", String(newState));

    if (newState) {
      playNotificationSound();
      setSuccessMessage("🔊 Sound notifications enabled");
    } else {
      setSuccessMessage("🔇 Sound notifications disabled");
    }

    setTimeout(() => setSuccessMessage(""), 2000);
  };

  const updateOrderStatus = async (orderId, newStatus, options = {}) => {
    try {
      const token = localStorage.getItem("token");
      const selectedPartner = deliveryPartners.find(
        (partner) => String(partner.id) === String(options.deliveryPartnerId)
      );

      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          ...(options.deliveryPartnerId && {
            deliveryPartnerId: options.deliveryPartnerId,
          }),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to update order status");
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
                ...(options.deliveryPartnerId && {
                  deliveryPartnerId: options.deliveryPartnerId,
                  deliveryPartnerName: selectedPartner?.name || "",
                }),
              }
            : order
        )
      );

      setStats((prev) => {
        const updated = { ...prev };
        const oldOrder = orders.find((o) => o.id === orderId);

        if (oldOrder) {
          const oldStatusKey = getStatusKey(oldOrder.status);
          if (updated[oldStatusKey] > 0) updated[oldStatusKey] -= 1;
        }

        const newStatusKey = getStatusKey(newStatus);
        updated[newStatusKey] = (updated[newStatusKey] || 0) + 1;
        return updated;
      });

      setSuccessMessage(
        selectedPartner
          ? `Order #${orderId} assigned to ${selectedPartner.name}`
          : `Order #${orderId} marked as ${newStatus}`
      );
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error updating order status:", err);
      setError(err.message || "Failed to update order status");
      setTimeout(() => setError(""), 3000);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    if (isMobile) document.body.style.overflow = !sidebarOpen ? "hidden" : "unset";
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
      document.body.style.overflow = "unset";
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleRefresh = () => {
    fetchOrders(true);
  };

  const handleExport = async () => {
    alert("Export triggered");
  };

  const filteredOrders = orders
    .filter((order) => {
      if (filter === "all") return true;
      return order.status?.toLowerCase() === filter.toLowerCase();
    })
    .filter((order) => {
      if (!searchTerm) return true;

      const lowerSearch = searchTerm.toLowerCase();

      return (
        order.customerDetails?.name?.toLowerCase().includes(lowerSearch) ||
        order.customerDetails?.phone?.includes(searchTerm) ||
        order.orderNumber?.toLowerCase().includes(lowerSearch) ||
        order.id?.toString().includes(searchTerm)
      );
    });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent" />
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  const MobileFilterDrawer = () => (
    <>
      {showMobileFilters && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setShowMobileFilters(false)}
        />
      )}

      <div
        className={`fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg rounded-t-3xl z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
          showMobileFilters ? "translate-y-0" : "translate-y-full"
        } shadow-2xl`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Filter Orders</h3>
            <button
              onClick={() => setShowMobileFilters(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Order Status
              </label>
              <div className="space-y-2">
                {[
                  { value: "all", label: "All Orders", icon: "📦" },
                  { value: "pending", label: "New Orders", icon: "🆕" },
                  { value: "confirmed", label: "Confirmed", icon: "✅" },
                  { value: "preparing", label: "Preparing", icon: "👨‍🍳" },
                  { value: "ready", label: "Ready", icon: "✅" },
                  { value: "on the way", label: "On the Way", icon: "🚚" },
                  { value: "delivered", label: "Delivered", icon: "✅" },
                  { value: "cancelled", label: "Cancelled", icon: "❌" },
                ].map(({ value, label, icon }) => (
                  <button
                    key={value}
                    onClick={() => {
                      setFilter(value);
                      setShowMobileFilters(false);
                    }}
                    className={`w-full px-4 py-3 rounded-xl text-left font-medium transition-all ${
                      filter === value
                        ? `bg-gradient-to-r ${getStatusColor(value)} text-white shadow-md`
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>
                        {icon} {label}
                      </span>
                      <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                        {value === "all"
                          ? orders.length
                          : orders.filter((o) => o.status?.toLowerCase() === value).length}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
      {isMobile && !sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="md:hidden fixed top-4 left-4 z-50 p-3 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:from-red-600 hover:to-red-700 transition-all active:scale-95"
        >
          <Menu size={20} />
        </button>
      )}

      <button
        onClick={toggleSound}
        className="fixed bottom-24 left-4 md:bottom-8 md:left-8 z-40 p-3 rounded-full bg-white text-gray-700 shadow-lg hover:shadow-xl transition-all active:scale-95"
      >
        {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>

      {isMobile && (
        <button
          onClick={() => setShowMobileFilters(true)}
          className="md:hidden fixed bottom-24 right-4 z-50 p-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all active:scale-95"
        >
          <SlidersHorizontal size={24} />
          {filter !== "all" && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
              1
            </span>
          )}
        </button>
      )}

      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="fixed bottom-24 right-20 md:bottom-8 md:right-8 z-40 p-3 rounded-full bg-white text-gray-700 shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-50"
      >
        <RefreshCw size={20} className={isRefreshing ? "animate-spin" : ""} />
      </button>

      {successMessage && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top duration-300">
          <div
            className={`${
              successMessage.includes("new order")
                ? "bg-gradient-to-r from-green-500 to-emerald-600"
                : "bg-green-500"
            } text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2`}
          >
            <CheckCircle size={20} />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top duration-300">
          <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="ml-2 hover:bg-red-600 rounded-full p-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {sidebarOpen && isMobile && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={closeSidebar} />
      )}

      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} onToggle={toggleSidebar} />

        <div className="flex-1 min-h-screen text-black transition-all duration-300 w-full md:w-auto overflow-x-hidden">
          <Header
            title="Orders Management"
            subtitle={
              restaurantData?.name
                ? `Managing orders for ${restaurantData.name}`
                : "Track, manage, and fulfill customer orders efficiently"
            }
            onMenuClick={toggleSidebar}
            sidebarOpen={sidebarOpen}
          />

          <main className="p-4 md:p-6 pb-24 md:pb-6">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-all" />
                <div className="relative bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/50 hover:shadow-xl transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-xs font-semibold uppercase tracking-wide">
                        Total Orders
                      </p>
                      <h3 className="text-2xl font-bold text-gray-800 mt-1">
                        {stats.total}
                      </h3>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-2xl">
                      <Package className="text-blue-600" size={24} />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-xs text-gray-500">
                    <TrendingUp size={12} className="mr-1 text-green-500" />
                    Live tracking
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-all" />
                <div className="relative bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-600 text-xs font-semibold uppercase tracking-wide">
                        Pending
                      </p>
                      <h3 className="text-2xl font-bold text-gray-800 mt-1">
                        {stats.pending}
                      </h3>
                    </div>
                    <div className="p-3 bg-amber-100 rounded-2xl">
                      <Clock className="text-amber-600" size={24} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-all" />
                <div className="relative bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 text-xs font-semibold uppercase tracking-wide">
                        Preparing
                      </p>
                      <h3 className="text-2xl font-bold text-gray-800 mt-1">
                        {stats.preparing}
                      </h3>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-2xl">
                      <RefreshCw className="text-purple-600" size={24} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-all" />
                <div className="relative bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 text-xs font-semibold uppercase tracking-wide">
                        Delivered
                      </p>
                      <h3 className="text-2xl font-bold text-gray-800 mt-1">
                        {stats.delivered}
                      </h3>
                    </div>
                    <div className="p-3 bg-green-100 rounded-2xl">
                      <CheckCircle className="text-green-600" size={24} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-5 mb-6 border border-white/60">
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search by order ID, customer name or phone..."
                    className="w-full pl-10 pr-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="hidden md:flex items-center justify-between">
                  <div className="flex gap-3">
                    <select
                      className="px-4 py-2 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    >
                      <option value="all">All Orders</option>
                      <option value="pending">New Orders</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                      <option value="on the way">On the Way</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="px-4 py-2 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="today">Today</option>
                      <option value="yesterday">Yesterday</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                    </select>
                  </div>

                  <button
                    onClick={handleExport}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <Download size={18} /> Export
                  </button>
                </div>

                <div className="hidden md:flex flex-wrap gap-2 mt-2">
                  {[
                    { value: "all", label: "All", icon: "📦", count: stats.total },
                    { value: "pending", label: "New", icon: "🆕", count: stats.pending },
                    { value: "confirmed", label: "Confirmed", icon: "✅", count: stats.confirmed },
                    { value: "preparing", label: "Prep", icon: "👨‍🍳", count: stats.preparing },
                    { value: "ready", label: "Ready", icon: "✅", count: stats.ready },
                    { value: "on the way", label: "On Way", icon: "🚚", count: stats.onTheWay },
                    { value: "delivered", label: "Done", icon: "✅", count: stats.delivered },
                  ].map(({ value, label, icon, count }) => (
                    <button
                      key={value}
                      onClick={() => setFilter(value)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        filter === value
                          ? `bg-gradient-to-r ${getStatusColor(value)} text-white shadow-md`
                          : "bg-white/70 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {icon} {label}
                      <span className="ml-1.5 bg-white/30 px-1.5 py-0.5 rounded-full text-xs">
                        {count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Sparkles size={18} className="text-blue-500" /> Orders ({filteredOrders.length})
                </h2>
                {(filter !== "all" || searchTerm) && (
                  <button
                    onClick={() => {
                      setFilter("all");
                      setSearchTerm("");
                    }}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>

              {filteredOrders.length > 0 ? (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      isExpanded={expandedOrder === order.id}
                      onToggleDetails={() => toggleOrderDetails(order.id)}
                      onUpdateStatus={updateOrderStatus}
                      deliveryPartners={deliveryPartners}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-10 text-center border border-white/50">
                  <Package className="mx-auto text-gray-400 mb-3" size={48} />
                  <h3 className="text-lg font-bold text-gray-700 mb-2">No orders found</h3>
                  <p className="text-gray-500">
                    {searchTerm
                      ? `No orders match "${searchTerm}"`
                      : `No ${filter === "all" ? "" : `${filter} `}orders`}
                  </p>
                </div>
              )}
            </div>

            {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchOrders(false, pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-5 py-2.5 bg-white/80 backdrop-blur rounded-xl shadow disabled:opacity-50 hover:bg-white transition-all"
                  >
                    Previous
                  </button>
                  <span className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow">
                    {pagination.page} / {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => fetchOrders(false, pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-5 py-2.5 bg-white/80 backdrop-blur rounded-xl shadow disabled:opacity-50 hover:bg-white transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <MobileFilterDrawer />
    </div>
  );
};

export default Orders;
