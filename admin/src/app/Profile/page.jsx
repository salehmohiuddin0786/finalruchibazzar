"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  Star,
  Edit2,
  Camera,
  Save,
  Shield,
  Bell,
  Lock,
  CheckCircle,
  Menu as MenuIcon,
  X,
  AlertCircle,
  LogOut,
  Utensils,
  Truck,
  Timer,
  FileText,
  ExternalLink,
  Upload,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const getMediaUrl = (path) => {
  if (!path) return "";
  const value = String(path).trim();
  if (!value) return "";
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  if (value.startsWith("/")) return `${API_URL}${value}`;
  return `${API_URL}/uploads/${value}`;
};

const defaultProfile = {
  restaurantName: "",
  ownerName: "",
  phone: "",
  email: "",
  address: "",
  openingTime: "10:00",
  closingTime: "22:00",
  website: "",
  description: "",
  cuisineType: "",
  deliveryRadius: "5",
  avgPreparationTime: "25-30",
  restaurantSince: "",
  rating: 0,
  totalReviews: 0,
};

const documentFields = [
  { key: "fssaiDocument", label: "FSSAI Document" },
  { key: "gstDocument", label: "GST Certificate" },
  { key: "panCard", label: "PAN Card" },
  { key: "registrationCertificate", label: "Registration Certificate" },
  { key: "cancelledCheque", label: "Cancelled Cheque" },
  { key: "menuPdf", label: "Menu PDF" },
];

const useSidebar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return {
    isMobile,
    sidebarOpen,
    toggleSidebar: () => setSidebarOpen((prev) => !prev),
    closeSidebar: () => isMobile && setSidebarOpen(false),
  };
};

export default function Profile() {
  const router = useRouter();
  const { isMobile, sidebarOpen, toggleSidebar, closeSidebar } = useSidebar();

  const [profileData, setProfileData] = useState(defaultProfile);
  const [profileImage, setProfileImage] = useState("");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [showMobileTabs, setShowMobileTabs] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState("");
  const [restaurantRecord, setRestaurantRecord] = useState({});
  const [documentFiles, setDocumentFiles] = useState({});
  const [previewDocument, setPreviewDocument] = useState(null);

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Restaurant", icon: Building2 },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        const restaurantData = localStorage.getItem("restaurant");

        if (!token || !userData) {
          router.push("/Login");
          return;
        }

        const user = JSON.parse(userData);
        let restaurant = restaurantData ? JSON.parse(restaurantData) : {};

        try {
          const response = await fetch(`${API_URL}/api/restaurants/my-restaurant`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json().catch(() => ({}));
          if (response.ok) {
            restaurant = data.restaurant || data.data || data || restaurant;
            localStorage.setItem("restaurant", JSON.stringify(restaurant));
          }
        } catch {
          // Keep the locally cached restaurant if the refresh fails.
        }

        setRestaurantRecord(restaurant);

        setProfileData({
          restaurantName: restaurant.name || restaurant.restaurantName || "",
          ownerName: restaurant.ownerName || user.name || "",
          phone: restaurant.restaurantPhone || restaurant.ownerPhone || user.phone || "",
          email: restaurant.restaurantEmail || restaurant.ownerEmail || user.email || "",
          address: restaurant.address || "",
          openingTime: restaurant.openingTime || "10:00",
          closingTime: restaurant.closingTime || "22:00",
          website: restaurant.website || "",
          description: restaurant.aboutRestaurant || restaurant.description || "",
          cuisineType: Array.isArray(restaurant.cuisines)
            ? restaurant.cuisines.join(", ")
            : Array.isArray(restaurant.cuisineType)
            ? restaurant.cuisineType.join(", ")
            : restaurant.cuisineType || "",
          deliveryRadius: restaurant.deliveryRadius || "5",
          avgPreparationTime: restaurant.avgPreparationTime || restaurant.preparationTime || "25-30",
          restaurantSince: restaurant.restaurantSince || "",
          rating: Number(restaurant.rating || 0),
          totalReviews: Number(restaurant.totalReviews || 0),
        });

        setProfileImage(getMediaUrl(restaurant.image || restaurant.logo || ""));
      } catch (err) {
        console.error(err);
        setError("Failed to load profile data.");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [router]);

  useEffect(() => {
    document.body.style.overflow = isMobile && sidebarOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobile, sidebarOpen]);

  const stats = useMemo(
    () => [
      { label: "Total Orders", value: "2,450", icon: Utensils, color: "bg-blue-500" },
      { label: "Customers", value: "850", icon: User, color: "bg-green-500" },
      { label: "Revenue", value: "₹1.2L", icon: Star, color: "bg-purple-500" },
      {
        label: "Rating",
        value: Number(profileData.rating || 0).toFixed(1),
        icon: Star,
        color: "bg-amber-500",
      },
    ],
    [profileData.rating]
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setProfileImage(reader.result);
    reader.readAsDataURL(file);
    setProfileImageFile(file);
  };

  const handleDocumentChange = (key, file) => {
    if (!file) return;

    const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload PDF, JPG, PNG, or WEBP files only.");
      return;
    }

    setDocumentFiles((prev) => ({ ...prev, [key]: file }));
  };

  const handleSaveProfile = async () => {
    setError("");
    setSaveSuccess(false);
    setIsSaving(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/Login");
        return;
      }

      const payload = new FormData();
      payload.append("name", profileData.restaurantName);
      payload.append("restaurantName", profileData.restaurantName);
      payload.append("ownerName", profileData.ownerName);
      payload.append("phone", profileData.phone);
      payload.append("email", profileData.email);
      payload.append("address", profileData.address);
      payload.append("openingTime", profileData.openingTime);
      payload.append("closingTime", profileData.closingTime);
      payload.append("website", profileData.website);
      payload.append("description", profileData.description);
      payload.append("cuisineType", profileData.cuisineType);
      payload.append("deliveryRadius", profileData.deliveryRadius);
      payload.append("avgPreparationTime", profileData.avgPreparationTime);
      payload.append("restaurantSince", profileData.restaurantSince);

      if (profileImageFile) {
        payload.append("logo", profileImageFile);
      }

      Object.entries(documentFiles).forEach(([key, file]) => {
        if (file) payload.append(key, file);
      });

      const response = await fetch(`${API_URL}/api/restaurants/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Failed to save profile.");
      }

      const updatedRestaurant = data.restaurant || {};

      localStorage.setItem("restaurant", JSON.stringify(updatedRestaurant));
      setRestaurantRecord(updatedRestaurant);
      setProfileImage(getMediaUrl(updatedRestaurant.image || updatedRestaurant.logo || ""));
      setProfileImageFile(null);
      setDocumentFiles({});

      const oldUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...oldUser,
          name: profileData.ownerName,
          email: profileData.email,
          phone: profileData.phone,
        })
      );

      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("restaurant");
    router.push("/Login");
  };

  const Field = ({ label, icon: Icon, name, type = "text", textarea = false }) => (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        {Icon && <Icon size={16} />}
        {label}
      </label>

      {isEditing ? (
        textarea ? (
          <textarea
            name={name}
            value={profileData[name] || ""}
            onChange={handleInputChange}
            rows={3}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
          />
        ) : (
          <input
            type={type}
            name={name}
            value={profileData[name] || ""}
            onChange={handleInputChange}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
          />
        )
      ) : (
        <div className="min-h-[46px] rounded-xl bg-gray-50 px-4 py-3 text-sm font-medium text-gray-800">
          {profileData[name] || "Not set"}
        </div>
      )}
    </div>
  );

  const DocumentPreviewModal = () => {
    if (!previewDocument) return null;

    const href = previewDocument.href;
    const isPdf = /\.pdf($|\?)/i.test(href);

    return (
      <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-3 backdrop-blur-sm sm:items-center">
        <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="flex items-center justify-between gap-3 border-b p-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Document preview</p>
              <h3 className="truncate text-lg font-extrabold text-gray-900">{previewDocument.label}</h3>
            </div>
            <button onClick={() => setPreviewDocument(null)} className="rounded-full p-2 hover:bg-gray-100">
              <X size={20} />
            </button>
          </div>

          <div className="h-[70vh] bg-gray-100">
            {isPdf ? (
              <iframe title={previewDocument.label} src={href} className="h-full w-full" />
            ) : (
              <img src={href} alt={previewDocument.label} className="h-full w-full object-contain" />
            )}
          </div>

          <div className="flex justify-end gap-2 border-t p-3">
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              <ExternalLink size={16} />
              Open
            </a>
            <button
              onClick={() => setPreviewDocument(null)}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const DocumentCard = ({ field }) => {
    const uploadedPath = restaurantRecord?.[field.key];
    const selectedFile = documentFiles[field.key];
    const href = selectedFile ? URL.createObjectURL(selectedFile) : getMediaUrl(uploadedPath);
    const hasDocument = Boolean(href);

    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-red-600" />
              <h3 className="font-bold text-gray-900">{field.label}</h3>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {selectedFile ? selectedFile.name : hasDocument ? "Uploaded" : "Not uploaded"}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
              hasDocument ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
            }`}
          >
            {hasDocument ? "Available" : "Missing"}
          </span>
        </div>

        {hasDocument && (
          <button
            type="button"
            onClick={() => setPreviewDocument({ label: field.label, href })}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <ExternalLink size={16} />
            Preview
          </button>
        )}

        {isEditing && (
          <label className="mt-3 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700">
            <Upload size={16} />
            {hasDocument ? "Change document" : "Upload document"}
            <input
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(event) => handleDocumentChange(field.key, event.target.files?.[0])}
            />
          </label>
        )}
      </div>
    );
  };

  const MobileTabsDrawer = () => (
    <>
      {showMobileTabs && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setShowMobileTabs(false)}
        />
      )}

      <div
        className={`fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] rounded-t-3xl bg-white shadow-2xl transition-transform duration-300 md:hidden ${
          showMobileTabs ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-bold text-gray-900">Menu</h3>
          <button onClick={() => setShowMobileTabs(false)} className="rounded-full p-2 hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-2 p-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setShowMobileTabs(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl p-4 font-medium transition ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-red-500 to-orange-500 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl bg-red-50 p-4 font-medium text-red-600"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-black">
      {isMobile && !sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed left-4 top-4 z-50 rounded-full bg-red-600 p-3 text-white shadow-lg md:hidden"
        >
          <MenuIcon size={24} />
        </button>
      )}

      {isMobile && (
        <button
          onClick={() => setShowMobileTabs(true)}
          className="fixed bottom-24 right-4 z-40 rounded-full bg-red-600 p-4 text-white shadow-lg md:hidden"
        >
          <Building2 size={24} />
        </button>
      )}

      {sidebarOpen && isMobile && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={closeSidebar} />
      )}

      {saveSuccess && (
        <div className="fixed right-4 top-20 z-50 flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-white shadow-lg">
          <CheckCircle size={20} />
          Profile saved successfully!
        </div>
      )}

      {error && (
        <div className="fixed right-4 top-20 z-50 flex max-w-sm items-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-white shadow-lg">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={() => setError("")}>
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} onToggle={toggleSidebar} />

        <div className="min-h-screen flex-1">
          <Header
            title={profileData.restaurantName || "Restaurant Profile"}
            subtitle="Manage your restaurant profile and settings"
            onMenuClick={toggleSidebar}
            sidebarOpen={sidebarOpen}
            onClose={closeSidebar}
          />

          <main className="p-4 pb-24 md:p-6">
            <section className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-orange-500 to-red-500 p-5 text-white shadow-xl md:p-7">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white/40 bg-white/20">
                    {profileImage ? (
                      <img src={profileImage} alt="Restaurant" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Building2 size={38} />
                      </div>
                    )}

                    {isEditing && (
                      <label className="absolute bottom-1 right-1 cursor-pointer rounded-full bg-white p-2 text-red-600 shadow">
                        <Camera size={16} />
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                    )}
                  </div>

                  <div>
                    <h1 className="text-2xl font-extrabold md:text-3xl">
                      {profileData.restaurantName || "Your Restaurant"}
                    </h1>
                    <p className="mt-1 max-w-2xl text-sm text-white/90">
                      {profileData.description || "Add your restaurant description to attract more customers."}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-3 text-sm">
                      <span className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1">
                        <Star size={15} className="fill-yellow-300 text-yellow-300" />
                        {Number(profileData.rating || 0).toFixed(1)} ({profileData.totalReviews} reviews)
                      </span>
                      <span className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1">
                        <Clock size={15} />
                        {profileData.openingTime} - {profileData.closingTime}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="rounded-xl bg-white/20 px-5 py-3 font-semibold text-white backdrop-blur hover:bg-white/30"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-red-600 shadow disabled:opacity-60"
                      >
                        <Save size={18} />
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-red-600 shadow"
                    >
                      <Edit2 size={18} />
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </section>

            <section className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-gray-500">{stat.label}</p>
                        <h3 className="mt-1 text-xl font-extrabold text-gray-900">{stat.value}</h3>
                      </div>
                      <div className={`rounded-xl p-3 ${stat.color}`}>
                        <Icon className="text-white" size={18} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>

            <section className="grid grid-cols-1 gap-6 lg:grid-cols-4">
              <aside className="hidden lg:block">
                <div className="sticky top-24 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-100">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`mb-1 flex w-full items-center gap-3 rounded-xl p-4 text-left font-semibold transition ${
                          activeTab === tab.id ? "bg-red-50 text-red-600" : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <Icon size={18} />
                        {tab.label}
                      </button>
                    );
                  })}

                  <button
                    onClick={handleLogout}
                    className="mt-3 flex w-full items-center gap-3 rounded-xl bg-red-50 p-4 font-semibold text-red-600"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </div>
              </aside>

              <div className="lg:col-span-3">
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 md:p-6">
                  {activeTab === "profile" && (
                    <>
                      <h2 className="mb-6 text-xl font-extrabold text-gray-900">Profile Details</h2>

                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <Field label="Restaurant Name" icon={Building2} name="restaurantName" />
                        <Field label="Owner Name" icon={User} name="ownerName" />
                        <Field label="Phone Number" icon={Phone} name="phone" type="tel" />
                        <Field label="Email Address" icon={Mail} name="email" type="email" />
                        <Field label="Opening Time" icon={Clock} name="openingTime" type="time" />
                        <Field label="Closing Time" icon={Clock} name="closingTime" type="time" />
                      </div>

                      <div className="mt-5 space-y-5">
                        <Field label="Address" icon={MapPin} name="address" textarea />
                        <Field label="Description" icon={Utensils} name="description" textarea />
                      </div>
                    </>
                  )}

                  {activeTab === "settings" && (
                    <>
                      <h2 className="mb-6 text-xl font-extrabold text-gray-900">Restaurant Settings</h2>

                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <Field label="Cuisine Type" icon={Utensils} name="cuisineType" />
                        <Field label="Website" icon={Globe} name="website" />
                        <Field label="Delivery Radius KM" icon={Truck} name="deliveryRadius" />
                        <Field label="Avg Preparation Time" icon={Timer} name="avgPreparationTime" />
                        <Field label="Restaurant Since" icon={Clock} name="restaurantSince" type="date" />
                      </div>

                      <p className="mt-4 rounded-xl bg-orange-50 p-4 text-sm text-orange-700">
                        For multiple cuisine types, use comma format: Biryani, Fast Food, Chinese
                      </p>
                    </>
                  )}

                  {activeTab === "documents" && (
                    <>
                      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h2 className="text-xl font-extrabold text-gray-900">Restaurant Documents</h2>
                          <p className="mt-1 text-sm text-gray-500">
                            Preview uploaded documents and change them while editing your profile.
                          </p>
                        </div>
                        {!isEditing && (
                          <button
                            onClick={() => setIsEditing(true)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                          >
                            <Edit2 size={16} />
                            Edit documents
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {documentFields.map((field) => (
                          <DocumentCard key={field.key} field={field} />
                        ))}
                      </div>
                    </>
                  )}

                  {activeTab === "security" && (
                    <>
                      <h2 className="mb-6 text-xl font-extrabold text-gray-900">Security</h2>

                      <div className="space-y-4">
                        <div className="rounded-xl border border-gray-100 p-4">
                          <div className="flex items-center gap-3">
                            <Lock className="text-red-600" />
                            <div>
                              <h3 className="font-bold text-gray-900">Password & Login</h3>
                              <p className="text-sm text-gray-500">
                                Your login is protected using your authentication token.
                              </p>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={handleLogout}
                          className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white shadow hover:bg-red-700"
                        >
                          Logout from this device
                        </button>
                      </div>
                    </>
                  )}

                  {activeTab === "notifications" && (
                    <>
                      <h2 className="mb-6 text-xl font-extrabold text-gray-900">Notifications</h2>

                      <div className="space-y-4">
                        {["New orders", "Order cancelled", "Payment received", "Customer reviews"].map((item) => (
                          <div
                            key={item}
                            className="flex items-center justify-between rounded-xl border border-gray-100 p-4"
                          >
                            <div>
                              <h3 className="font-bold text-gray-900">{item}</h3>
                              <p className="text-sm text-gray-500">Receive alerts for {item.toLowerCase()}.</p>
                            </div>
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                              Active
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      <MobileTabsDrawer />
      <DocumentPreviewModal />

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t bg-white px-4 py-2 md:hidden">
        <div className="flex justify-around">
          {tabs.slice(0, 3).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center px-3 py-1 text-xs ${
                  activeTab === tab.id ? "text-red-600" : "text-gray-500"
                }`}
              >
                <Icon size={22} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
