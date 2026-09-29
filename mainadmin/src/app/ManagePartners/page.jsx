"use client";

import { 
  CheckCircle, 
  Clock, 
  Star, 
  Truck, 
  MapPin, 
  Bike, 
  Car, 
  Award,
  TrendingUp,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Navigation,
  UserCheck,
  ShieldCheck,
  Calendar
} from "lucide-react";
import { AdminFeaturePage } from "../components/AdminFeaturePage";
import { apiRequest } from "../lib/api";
import { useMainAdminData } from "../lib/useMainAdminData";

export default function ManagePartners() {
  const { rows, setRows, loading, error, refresh } = useMainAdminData("/mainadmin/delivery-partners");

  const handleRowAction = async (action, row) => {
    if (!["approve", "reject"].includes(action)) return;
    await apiRequest(`/mainadmin/delivery-partners/${row.id}/verification`, {
      method: "PATCH",
      body: JSON.stringify({ action }),
    });

    setRows((current) =>
      current.map((item) =>
        item.id === row.id ? { ...item, status: action === "approve" ? "Approved" : "Rejected" } : item
      )
    );
  };

  // Calculate enhanced metrics
  const totalPartners = rows.length;
  const approvedCount = rows.filter((row) => row.status === "Approved").length;
  const pendingCount = rows.filter((row) => row.status === "Pending").length;
  const rejectedCount = rows.filter((row) => row.status === "Rejected").length;
  const suspendedCount = rows.filter((row) => row.status === "Suspended").length;
  
  const totalRating = rows.reduce((sum, row) => sum + Number(row.rating || 0), 0);
  const averageRating = totalPartners > 0 ? (totalRating / totalPartners).toFixed(1) : "0.0";
  
  // Zone distribution
  const zones = {};
  rows.forEach(row => {
    const zone = row.zone || "Unassigned";
    zones[zone] = (zones[zone] || 0) + 1;
  });
  const topZone = Object.entries(zones).sort((a, b) => b[1] - a[1])[0];
  
  // Vehicle type distribution
  const vehicleTypes = {
    bike: rows.filter(row => row.vehicle?.toLowerCase().includes("bike")).length,
    car: rows.filter(row => row.vehicle?.toLowerCase().includes("car")).length,
    scooter: rows.filter(row => row.vehicle?.toLowerCase().includes("scooter")).length,
  };
  
  // Top rated partners
  const topRated = [...rows].sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0)).slice(0, 3);
  
  // Approval rate
  const approvalRate = totalPartners > 0 ? Math.round((approvedCount / totalPartners) * 100) : 0;

  const stats = [
    { 
      label: "Total Partners", 
      value: totalPartners, 
      change: `${totalPartners} active drivers`,
      icon: Truck,
      gradient: "from-blue-500 to-blue-600"
    },
    { 
      label: "Approved", 
      value: approvedCount, 
      change: `${approvalRate}% approval rate`,
      icon: CheckCircle,
      gradient: "from-emerald-500 to-emerald-600"
    },
    { 
      label: "Pending Review", 
      value: pendingCount, 
      change: pendingCount > 0 ? `${pendingCount} waiting` : "All verified",
      icon: Clock,
      gradient: "from-amber-500 to-amber-600"
    },
    { 
      label: "Avg Rating", 
      value: averageRating, 
      change: `${averageRating} / 5.0 stars`,
      icon: Star,
      gradient: "from-yellow-500 to-yellow-600"
    },
  ];

  // Helper to get vehicle icon
  const getVehicleIcon = (vehicle) => {
    if (!vehicle) return Truck;
    const vehicleLower = vehicle.toLowerCase();
    if (vehicleLower.includes("bike")) return Bike;
    if (vehicleLower.includes("scooter")) return Bike;
    if (vehicleLower.includes("car")) return Car;
    return Truck;
  };

  // Helper to get rating stars
  const RatingStars = ({ rating }) => {
    const numRating = Number(rating || 0);
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 >= 0.5;
    
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${
              i < fullStars 
                ? "fill-yellow-400 text-yellow-400" 
                : i === fullStars && hasHalfStar
                ? "fill-yellow-400 text-yellow-400 half-star"
                : "text-slate-300"
            }`}
          />
        ))}
        <span className="ml-1.5 text-xs font-medium text-slate-600">{numRating.toFixed(1)}</span>
      </div>
    );
  };

  // Enhanced columns with custom rendering
  const enhancedColumns = [
    { 
      key: "name", 
      label: "Partner",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-semibold text-white shadow-md">
            {row.name?.charAt(0) || "D"}
          </div>
          <div>
            <p className="font-medium text-slate-900">{row.name || "Not provided"}</p>
            <p className="text-xs text-slate-500">ID: {String(row.id || "").slice(-6) || "N/A"}</p>
          </div>
        </div>
      )
    },
    { key: "phone", label: "Phone" },
    { 
      key: "zone", 
      label: "Zone",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-sm text-slate-700">{row.zone || "Unassigned"}</span>
        </div>
      )
    },
    { 
      key: "vehicle", 
      label: "Vehicle",
      render: (row) => {
        const VehicleIcon = getVehicleIcon(row.vehicle);
        return (
          <div className="flex items-center gap-1.5">
            <VehicleIcon className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-sm text-slate-700">{row.vehicle || "Not specified"}</span>
          </div>
        );
      }
    },
    { 
      key: "rating", 
      label: "Rating",
      render: (row) => <RatingStars rating={row.rating} />
    },
    { key: "docs", label: "Documents" },
    { 
      key: "status", 
      label: "Status", 
      badge: true,
      render: (row) => {
        const statusConfig = {
          Approved: { color: "emerald", icon: CheckCircle },
          Pending: { color: "amber", icon: Clock },
          Rejected: { color: "rose", icon: ThumbsDown },
          Suspended: { color: "red", icon: ShieldCheck }
        };
        const config = statusConfig[row.status] || statusConfig.Pending;
        const StatusIcon = config.icon;
        
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border bg-${config.color}-50 text-${config.color}-700 border-${config.color}-200`}>
            <StatusIcon className="h-3 w-3" />
            {row.status}
          </span>
        );
      }
    },
  ];

  // Partner Insights Component
  const PartnerInsights = () => {
    if (loading || rows.length === 0) return null;

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50/50 to-white p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-100 p-2">
              <MapPin className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">Top Zone</span>
          </div>
          <p className="mt-2 text-xl font-bold text-slate-900">{topZone?.[0] || "N/A"}</p>
          <p className="text-xs text-slate-500">{topZone?.[1] || 0} partners assigned</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-cyan-50/50 to-white p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-cyan-100 p-2">
              <Bike className="h-4 w-4 text-cyan-600" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-cyan-600">Vehicle Fleet</span>
          </div>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-sm">
              <span>Bikes</span>
              <span className="font-semibold">{vehicleTypes.bike}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Cars</span>
              <span className="font-semibold">{vehicleTypes.car}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-emerald-50/50 to-white p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-emerald-100 p-2">
              <Award className="h-4 w-4 text-emerald-600" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Top Rated</span>
          </div>
          <p className="mt-2 text-sm font-medium text-slate-900 truncate">{topRated[0]?.name || "N/A"}</p>
          <p className="text-xs text-slate-500">⭐ {topRated[0]?.rating || 0} / 5.0</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-purple-50/50 to-white p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-purple-100 p-2">
              <UserCheck className="h-4 w-4 text-purple-600" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-purple-600">Active Partners</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-purple-600">{approvedCount}</p>
          <p className="text-xs text-slate-500">{Math.round((approvedCount / totalPartners) * 100)}% of total</p>
        </div>
      </div>
    );
  };

  // Top Performers Component
  const TopPerformers = () => {
    if (loading || rows.length === 0 || topRated.length === 0) return null;

    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 bg-gradient-to-r from-amber-50 to-transparent px-5 py-3">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-600" />
            <h3 className="text-sm font-semibold text-slate-900">🏆 Top Performing Partners</h3>
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {topRated.map((partner, idx) => {
            const VehicleIcon = getVehicleIcon(partner.vehicle);
            return (
              <div key={partner.id} className="flex flex-wrap items-center justify-between gap-4 p-4 transition-all hover:bg-slate-50/80">
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${
                    idx === 0 ? "from-amber-500 to-amber-600" : 
                    idx === 1 ? "from-slate-400 to-slate-500" : 
                    "from-amber-600 to-amber-700"
                  } text-sm font-bold text-white shadow-md`}>
                    #{idx + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{partner.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <VehicleIcon className="h-3 w-3 text-slate-400" />
                      <span className="text-xs text-slate-500">{partner.zone}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <RatingStars rating={partner.rating} />
                  <div className="flex items-center gap-1">
                    <Truck className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">{partner.deliveries || 0} deliveries</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50">
      <AdminFeaturePage
        title="Delivery Partners"
        description="Manage delivery partner profiles, verify KYC documents, track performance metrics, and handle account status changes."
        stats={stats}
        rows={rows}
        filters={["All", "Approved", "Pending", "Rejected", "Suspended"]}
        columns={enhancedColumns}
        loading={loading}
        error={error}
        onRefresh={refresh}
        onRowAction={handleRowAction}
        actionLoadingId={null}
      >
        {/* Partner Insights Section */}
        {!loading && rows.length > 0 && (
          <div className="space-y-4">
            <PartnerInsights />
            <TopPerformers />
          </div>
        )}

        {/* Quick Stats Bar */}
        {!loading && rows.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm p-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-slate-100 p-2">
                  <Navigation className="h-4 w-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Partners Overview</p>
                  <p className="text-xs text-slate-500">
                    {approvedCount} active • {pendingCount} pending • {rejectedCount} rejected • {suspendedCount} suspended
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1">
                  <ThumbsUp className="h-3 w-3 text-emerald-600" />
                  <span className="text-xs font-medium text-emerald-700">{approvalRate}% Approved</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1">
                  <Clock className="h-3 w-3 text-amber-600" />
                  <span className="text-xs font-medium text-amber-700">{pendingCount} Pending</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && rows.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
            <div className="mb-4 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 p-4">
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">No delivery partners found</h3>
            <p className="mt-1 text-sm text-slate-500">Partner applications will appear here once submitted.</p>
            <button
              onClick={refresh}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg"
            >
              Refresh
            </button>
          </div>
        )}
      </AdminFeaturePage>
    </div>
  );
}
