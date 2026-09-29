// app/delivery/profile/page.jsx
"use client";

import React, { useEffect, useState } from "react";
import SuperLayout from "../SuperLayout/page";
import { deliveryApi } from "../lib/deliveryApi";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Bike,
  ShieldCheck,
  Star,
  Package,
  Clock,
  Wallet,
  Edit,
  Camera,
  BadgeCheck,
  CreditCard,
  FileText,
  Calendar,
  IndianRupee,
  CheckCircle,
  AlertCircle,
  Navigation,
  Home,
} from "lucide-react";

export default function DeliveryPartnerProfile() {
  const [isOnline, setIsOnline] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let mounted = true;

    deliveryApi("/delivery/profile")
      .then((data) => {
        if (!mounted) return;
        setProfile(data);
        setIsOnline(Boolean(data.stats?.isAvailable));
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  const user = profile?.user;
  const partnerProfile = profile?.partner;
  const profileStats = profile?.stats;

  const partner = {
    name: user?.name || partnerProfile?.name || "Delivery Partner",
    partnerId: `DP-${user?.id || partnerProfile?.id || "1024"}`,
    phone: user?.phone || partnerProfile?.phone || "",
    email: user?.email || partnerProfile?.email || "",
    address: partnerProfile?.address || [partnerProfile?.city, partnerProfile?.pincode].filter(Boolean).join(" ") || "Address not available",
    joiningDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "15 Jan 2024",
    rating: profileStats?.rating || 5,
    totalDeliveries: profileStats?.totalDeliveries || 0,
    onlineHours: profileStats?.onlineHours || 0,
    earnings: profileStats?.totalEarnings || 0,
    profileCompletion: 92,
  };

  const vehicle = {
    type: partnerProfile?.vehicleType || "Bike",
    number: partnerProfile?.vehicleRegistrationNumber || partnerProfile?.vehicleNumber || "Not added",
    model: partnerProfile?.vehicleType || "Not added",
    license: partnerProfile?.drivingLicenseNumber || "Not added",
    insurance: partnerProfile?.vehicleInsurance || "Not added",
  };

  const bank = {
    accountName: partnerProfile?.accountHolderName || partner.name,
    bankName: "Bank account",
    accountNumber: "•••• •••• 1234",
    upi: partnerProfile?.upiId || "Not added",
  };

  const documents = [
    { name: "Aadhaar Card", status: "verified" },
    { name: "Driving License", status: "verified" },
    { name: "Vehicle RC", status: "verified" },
    { name: "Insurance", status: "pending" },
  ];

  const getStatusBadge = (status) => {
    if (status === "verified") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700">
          <CheckCircle size={12} />
          Verified
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-700">
        <AlertCircle size={12} />
        Pending
      </span>
    );
  };

  return (
    <SuperLayout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 p-6 text-white">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white shadow-lg">
                  <User size={46} />
                </div>
                <button className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-lg hover:scale-105 transition">
                  <Camera size={17} />
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-3xl font-bold">{partner.name}</h1>
                  <BadgeCheck className="text-white" size={24} />
                </div>
                <p className="text-emerald-100">Delivery Partner ID: {partner.partnerId}</p>
                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm border border-white/20">
                    ⭐ {partner.rating} Rating
                  </span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm border border-white/20">
                    Joined {partner.joiningDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  const next = !isOnline;
                  setIsOnline(next);
                  deliveryApi("/delivery/availability", {
                    method: "PUT",
                    body: JSON.stringify({ isAvailable: next }),
                  }).catch(() => setIsOnline(!next));
                }}
                className={`px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                  isOnline
                    ? "bg-white text-emerald-600"
                    : "bg-white/20 text-white border border-white/20"
                }`}
              >
                {isOnline ? "Online" : "Offline"}
              </button>

              <button className="bg-white/20 hover:bg-white/30 px-5 py-3 rounded-xl text-sm font-medium transition-all backdrop-blur-sm border border-white/20 flex items-center gap-2">
                <Edit size={17} />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <Package className="text-emerald-600 mb-3" size={26} />
            <p className="text-sm text-gray-500">Total Deliveries</p>
            <p className="text-2xl font-bold text-gray-900">{partner.totalDeliveries}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <Star className="text-amber-500 mb-3 fill-amber-400" size={26} />
            <p className="text-sm text-gray-500">Average Rating</p>
            <p className="text-2xl font-bold text-gray-900">{partner.rating}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <Clock className="text-blue-600 mb-3" size={26} />
            <p className="text-sm text-gray-500">Online Hours</p>
            <p className="text-2xl font-bold text-gray-900">{partner.onlineHours}h</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <IndianRupee className="text-emerald-600 mb-3" size={26} />
            <p className="text-sm text-gray-500">Total Earnings</p>
            <p className="text-2xl font-bold text-gray-900">₹{partner.earnings}</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Info */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
              <button className="text-emerald-600 text-sm font-medium flex items-center gap-1">
                <Edit size={15} />
                Edit
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard icon={User} label="Full Name" value={partner.name} />
              <InfoCard icon={Phone} label="Phone Number" value={partner.phone} />
              <InfoCard icon={Mail} label="Email Address" value={partner.email} />
              <InfoCard icon={MapPin} label="Location" value={partner.address} />
              <InfoCard icon={Calendar} label="Joining Date" value={partner.joiningDate} />
              <InfoCard icon={Navigation} label="Current Status" value={isOnline ? "Online" : "Offline"} />
            </div>
          </div>

          {/* Completion */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>

            <div className="relative">
              <ShieldCheck size={34} className="mb-4" />
              <h3 className="text-lg font-semibold mb-2">Profile Completion</h3>
              <p className="text-4xl font-bold mb-4">{partner.profileCompletion}%</p>

              <div className="w-full bg-white/20 rounded-full h-3 mb-4">
                <div
                  className="bg-white rounded-full h-3"
                  style={{ width: `${partner.profileCompletion}%` }}
                ></div>
              </div>

              <p className="text-sm text-emerald-100">
                Complete your insurance verification to reach 100%.
              </p>
            </div>
          </div>
        </div>

        {/* Vehicle and Bank */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vehicle Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Bike size={22} className="text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Vehicle Details</h3>
            </div>

            <div className="space-y-3">
              <DetailRow label="Vehicle Type" value={vehicle.type} />
              <DetailRow label="Vehicle Number" value={vehicle.number} />
              <DetailRow label="Vehicle Model" value={vehicle.model} />
              <DetailRow label="Driving License" value={vehicle.license} />
              <DetailRow label="Insurance" value={vehicle.insurance} />
            </div>
          </div>

          {/* Bank Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Wallet size={22} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Payment Details</h3>
            </div>

            <div className="space-y-3">
              <DetailRow label="Account Name" value={bank.accountName} />
              <DetailRow label="Bank Name" value={bank.bankName} />
              <DetailRow label="Account Number" value={bank.accountNumber} />
              <DetailRow label="UPI ID" value={bank.upi} />
            </div>

            <button className="w-full mt-5 py-2.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium border border-emerald-200 rounded-xl hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2">
              <CreditCard size={16} />
              Update Payment Method
            </button>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-2">
              <FileText size={22} className="text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-800">KYC Documents</h2>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {documents.map((doc, index) => (
              <div key={index} className="p-5 flex items-center justify-between hover:bg-gray-50/60">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center">
                    <FileText size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{doc.name}</p>
                    <p className="text-xs text-gray-500">Uploaded document</p>
                  </div>
                </div>

                {getStatusBadge(doc.status)}
              </div>
            ))}
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Home size={22} className="text-emerald-600" />
            <h3 className="font-semibold text-gray-800">Saved Address</h3>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
            <p className="text-sm text-gray-700">
              H.No 12-3-45, Near Bus Stand, Adilabad, Telangana - 504001
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </SuperLayout>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-sm transition">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
          <Icon size={19} className="text-emerald-600" />
        </div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-sm font-medium text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
  );
}
