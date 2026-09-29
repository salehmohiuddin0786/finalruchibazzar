"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext.jsx";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  User,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Heart,
  Clock,
  Award,
  Settings,
  Edit,
  Bell,
  HelpCircle,
  LogOut,
  ShoppingBag,
  Star,
  Package,
  Calendar,
  Gift,
  Utensils,
  X,
  Check,
  AlertCircle,
  Loader,
  Plus,
  Trash2,
  Home,
  Briefcase,
  Camera,
  TrendingUp,
  Coffee,
  Zap,
  Sparkles,
  Crown,
  BadgeCheck,
  Navigation,
} from "lucide-react";

const Page = () => {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const currencySymbol = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₹";

  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    profilePic: null,
    joinDate: "",
    loyaltyPoints: 0,
    membershipLevel: "Bronze Member",
    bio: "",
    location: "",
    favoriteFood: "",
  });

  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [rewards] = useState([]);

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: `${currencySymbol}0`,
    favoriteRestaurant: "N/A",
    favoriteCuisine: "North Indian",
    averageRating: 4.8,
    deliveryStreak: 5,
  });

  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    email: "",
    bio: "",
    location: "",
    favoriteFood: "",
  });

  const [addingAddress, setAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    type: "home",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    landmark: "",
    phone: "",
    latitude: null,
    longitude: null,
    isDefault: false,
  });

  const [addingPayment, setAddingPayment] = useState(false);

  const [preferences, setPreferences] = useState({
    notifications: {
      orderUpdates: true,
      promotions: true,
      priceDrops: false,
      newRestaurants: true,
      deliveryStatus: true,
    },
    diet: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      dairyFree: false,
    },
    delivery: {
      contactless: true,
      leaveAtDoor: false,
      callBeforeDelivery: true,
    },
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/profile");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 4000);
  };

  const getToken = () => localStorage.getItem("token");

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const profileRes = await fetch(`${apiUrl}/users/profile`, { headers });

      if (!profileRes.ok) {
        throw new Error("Failed to fetch profile");
      }

      const profileData = await profileRes.json();
      const userInfo = profileData.user || profileData;

      const profile = {
        name: userInfo.name || "",
        email: userInfo.email || "",
        phone: userInfo.phone || "",
        profilePic: userInfo.profilePic || null,
        joinDate: userInfo.createdAt
          ? new Date(userInfo.createdAt).toLocaleDateString("en-IN", {
              month: "long",
              year: "numeric",
            })
          : new Date().toLocaleDateString("en-IN", {
              month: "long",
              year: "numeric",
            }),
        loyaltyPoints: Number(userInfo.loyaltyPoints || 0),
        membershipLevel: userInfo.membershipLevel || "Bronze Member",
        bio:
          userInfo.bio ||
          "🍽️ Passionate foodie exploring amazing flavors every day!",
        location: userInfo.location || "",
        favoriteFood: userInfo.favoriteFood || "",
      };

      setUserData(profile);

      setProfileForm({
        name: profile.name,
        phone: profile.phone,
        email: profile.email,
        bio: profile.bio,
        location: profile.location,
        favoriteFood: profile.favoriteFood,
      });

      try {
        const addressRes = await fetch(`${apiUrl}/users/addresses`, { headers });
        if (addressRes.ok) {
          const data = await addressRes.json();
          setAddresses(Array.isArray(data) ? data : data.addresses || []);
        }
      } catch {}

      try {
        const paymentRes = await fetch(`${apiUrl}/users/payment-methods`, {
          headers,
        });
        if (paymentRes.ok) {
          const data = await paymentRes.json();
          setPaymentMethods(
            Array.isArray(data) ? data : data.paymentMethods || []
          );
        }
      } catch {}

      try {
        const ordersRes = await fetch(`${apiUrl}/orders/user`, { headers });
        if (ordersRes.ok) {
          const data = await ordersRes.json();
          const list = Array.isArray(data) ? data : data.orders || [];
          setOrders(list);

          const total = list.reduce(
            (sum, order) =>
              sum + Number(order.totalAmount || order.total || 0),
            0
          );

          setStats((prev) => ({
            ...prev,
            totalOrders: list.length,
            totalSpent: `${currencySymbol}${Number(total || 0).toFixed(2)}`,
          }));
        }
      } catch {}

      try {
        const favRes = await fetch(`${apiUrl}/users/favorites`, { headers });
        if (favRes.ok) {
          const data = await favRes.json();
          setFavorites(Array.isArray(data) ? data : data.favorites || []);
        }
      } catch {}

      try {
        const notifRes = await fetch(`${apiUrl}/users/notifications`, {
          headers,
        });
        if (notifRes.ok) {
          const data = await notifRes.json();
          setNotifications(
            Array.isArray(data) ? data : data.notifications || []
          );
        }
      } catch {}
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reverseGeocode = async (lat, lng) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          "User-Agent": "RuchibazzarApp/1.0",
        },
      }
    );

    const data = await response.json();
    const address = data.address || {};

    return {
      street:
        data.display_name ||
        [address.house_number, address.road, address.suburb || address.neighbourhood]
          .filter(Boolean)
          .join(", ") ||
        `${lat}, ${lng}`,
      city: address.city || address.town || address.village || address.district || "",
      state: address.state || "",
      zipCode: address.postcode || "",
      landmark: address.suburb || address.neighbourhood || address.locality || "",
      latitude: lat,
      longitude: lng,
    };
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      showError("Geolocation is not supported");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const address = await reverseGeocode(latitude, longitude);

          setAddressForm((prev) => ({
            ...prev,
            street: address.street,
            city: address.city || prev.city,
            state: address.state || prev.state,
            zipCode: address.zipCode || prev.zipCode,
            landmark: address.landmark || prev.landmark,
            latitude: address.latitude,
            longitude: address.longitude,
          }));

          showSuccess("Current location fetched successfully!");
        } catch {
          showError("Unable to fetch current location");
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        setLocationLoading(false);
        showError("Please allow location access and try again");
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const updateProfile = async () => {
    try {
      const token = getToken();

      const response = await fetch(`${apiUrl}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      const updatedUser = data.user || data;

      setUserData((prev) => ({
        ...prev,
        ...updatedUser,
      }));

      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...currentUser, ...updatedUser }));

      setEditingProfile(false);
      showSuccess("Profile updated successfully!");
    } catch (err) {
      showError(err.message);
    }
  };

  const addAddress = async () => {
    try {
      const token = getToken();

      const response = await fetch(`${apiUrl}/users/addresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add address");
      }

      setAddresses((prev) => [...prev, data.address || data]);
      setAddingAddress(false);
      resetAddressForm();
      showSuccess("Address added successfully!");
    } catch (err) {
      showError(err.message);
    }
  };

  const updateAddress = async (addressId) => {
    try {
      const token = getToken();

      const response = await fetch(`${apiUrl}/users/addresses/${addressId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update address");
      }

      setAddresses((prev) =>
        prev.map((addr) => (addr.id === addressId ? data.address || data : addr))
      );

      setEditingAddressId(null);
      resetAddressForm();
      showSuccess("Address updated successfully!");
    } catch (err) {
      showError(err.message);
    }
  };

  const deleteAddress = async (addressId) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      const token = getToken();

      const response = await fetch(`${apiUrl}/users/addresses/${addressId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete address");
      }

      setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
      showSuccess("Address deleted successfully!");
    } catch (err) {
      showError(err.message);
    }
  };

  const setDefaultAddress = async (addressId) => {
    try {
      const token = getToken();

      const response = await fetch(
        `${apiUrl}/users/addresses/${addressId}/default`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to set default address");
      }

      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          isDefault: addr.id === addressId,
        }))
      );

      showSuccess("Default address updated!");
    } catch (err) {
      showError(err.message);
    }
  };

  const updatePreferences = async () => {
    try {
      const token = getToken();

      const response = await fetch(`${apiUrl}/users/preferences`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error("Failed to update preferences");
      }

      showSuccess("Preferences updated successfully!");
    } catch (err) {
      showError(err.message);
    }
  };

  const resetAddressForm = () => {
    setAddressForm({
      type: "home",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      landmark: "",
      phone: "",
      latitude: null,
      longitude: null,
      isDefault: false,
    });
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const getMembershipBadge = () => {
    const level = userData.membershipLevel;

    if (level === "Platinum Member") {
      return {
        color: "from-purple-400 to-pink-500",
        icon: <Crown className="w-4 h-4" />,
      };
    }

    if (level === "Gold Member") {
      return {
        color: "from-yellow-400 to-orange-500",
        icon: <Award className="w-4 h-4" />,
      };
    }

    if (level === "Silver Member") {
      return {
        color: "from-gray-400 to-gray-500",
        icon: <Sparkles className="w-4 h-4" />,
      };
    }

    return {
      color: "from-amber-600 to-orange-600",
      icon: <BadgeCheck className="w-4 h-4" />,
    };
  };

  const profileCompletion = Math.round(
    ([
      userData.name,
      userData.email,
      userData.phone,
      userData.location,
      userData.favoriteFood,
    ].filter(Boolean).length /
      5) *
      100
  );

  const membershipBadge = getMembershipBadge();

  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-14 h-14 text-purple-600 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-purple-700">
              Loading Profile
            </h2>
            <p className="text-gray-600 mt-2">
              Preparing your personalized dashboard...
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-28 h-28 bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold backdrop-blur-sm border-2 border-white/30 overflow-hidden">
              {userData.profilePic ? (
                <img
                  src={userData.profilePic || "/default-user.png"}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span>{userData.name?.charAt(0) || "U"}</span>
              )}
            </div>

            <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg">
              <Camera className="w-4 h-4 text-purple-600" />
            </button>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start mb-2">
              <h2 className="text-2xl font-bold">
                {userData.name || "User"}
              </h2>

              <div
                className={`bg-gradient-to-r ${membershipBadge.color} px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1`}
              >
                {membershipBadge.icon}
                {userData.membershipLevel}
              </div>
            </div>

            <p className="text-purple-100 mb-3">{userData.bio}</p>

            <div className="flex flex-wrap gap-4 text-sm justify-center md:justify-start">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {userData.email || "No email"}
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {userData.phone || "Add phone"}
              </div>

              {userData.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {userData.location}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setEditingProfile(true)}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6">
        <div className="flex justify-between mb-3">
          <h3 className="font-semibold text-gray-800">Profile Completion</h3>
          <span className="font-bold text-purple-600">
            {profileCompletion}%
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-full"
            style={{ width: `${profileCompletion}%` }}
          />
        </div>

        <p className="text-sm text-gray-500 mt-2">
          Complete your profile to unlock more rewards.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<ShoppingBag className="w-6 h-6 text-purple-600" />}
          value={stats.totalOrders}
          label="Total Orders"
        />

        <StatCard
          icon={<Award className="w-6 h-6 text-pink-600" />}
          value={userData.loyaltyPoints}
          label="Loyalty Points"
        />

        <StatCard
          icon={<Clock className="w-6 h-6 text-orange-600" />}
          value={stats.deliveryStreak}
          label="Day Streak"
        />

        <StatCard
          icon={<Star className="w-6 h-6 text-green-600" />}
          value={stats.averageRating}
          label="Avg Rating"
        />
      </div>

      {userData.favoriteFood && (
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Coffee className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-gray-800">Favorite Food</span>
          </div>
          <p className="text-gray-700">{userData.favoriteFood}</p>
        </div>
      )}

      {editingProfile && renderEditProfileModal()}
    </div>
  );

  const renderEditProfileModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex justify-between items-center sticky top-0">
          <h3 className="text-lg font-semibold text-white">Edit Profile</h3>
          <button
            onClick={() => setEditingProfile(false)}
            className="text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {[
            ["name", "Full Name"],
            ["email", "Email"],
            ["phone", "Phone Number"],
            ["location", "Location"],
            ["favoriteFood", "Favorite Food"],
          ].map(([field, label]) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
              </label>
              <input
                type={field === "email" ? "email" : "text"}
                value={profileForm[field]}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, [field]: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 text-black"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={profileForm.bio}
              onChange={(e) =>
                setProfileForm({ ...profileForm, bio: e.target.value })
              }
              rows="3"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 text-black"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 p-4 flex gap-3">
          <button
            onClick={() => setEditingProfile(false)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={updateProfile}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  const renderAddresses = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:items-center">
        <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>

        <button
          onClick={() => setAddingAddress(true)}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg flex items-center gap-2 justify-center"
        >
          <Plus className="w-4 h-4" />
          Add New Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <EmptyState
          icon={<MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />}
          title="No saved addresses"
          description="Add your delivery address for faster checkout."
          action="Add Address"
          onClick={() => setAddingAddress(true)}
        />
      ) : (
        <div className="grid gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  {address.type === "home" ? (
                    <Home className="w-5 h-5 text-purple-600" />
                  ) : (
                    <Briefcase className="w-5 h-5 text-pink-600" />
                  )}

                  <span className="font-semibold text-gray-900 capitalize">
                    {address.type}
                  </span>

                  {address.isDefault && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Default
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setAddressForm(address);
                      setEditingAddressId(address.id);
                    }}
                    className="text-gray-400 hover:text-purple-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteAddress(address.id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-700">{address.street}</p>
              <p className="text-gray-600 text-sm">
                {address.city}, {address.state} - {address.zipCode}
              </p>

              {address.landmark && (
                <p className="text-gray-500 text-sm mt-1">
                  Landmark: {address.landmark}
                </p>
              )}

              {address.phone && (
                <p className="text-gray-500 text-sm mt-1">
                  Phone: {address.phone}
                </p>
              )}

              {!address.isDefault && (
                <button
                  onClick={() => setDefaultAddress(address.id)}
                  className="mt-3 text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Set as Default
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {(addingAddress || editingAddressId) && renderAddressModal()}
    </div>
  );

  const renderAddressModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex justify-between items-center sticky top-0">
          <h3 className="text-lg font-semibold text-white">
            {editingAddressId ? "Edit Address" : "Add New Address"}
          </h3>

          <button
            onClick={() => {
              setAddingAddress(false);
              setEditingAddressId(null);
              resetAddressForm();
            }}
            className="text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex gap-3">
            {["home", "work"].map((type) => (
              <button
                key={type}
                onClick={() => setAddressForm({ ...addressForm, type })}
                className={`flex-1 px-4 py-2 rounded-lg border-2 ${
                  addressForm.type === type
                    ? "border-purple-500 bg-purple-50 text-purple-700"
                    : "border-gray-200 text-gray-600"
                }`}
              >
                {type === "home" ? (
                  <Home className="w-4 h-4 inline mr-2" />
                ) : (
                  <Briefcase className="w-4 h-4 inline mr-2" />
                )}
                {type}
              </button>
            ))}
          </div>

          <textarea
            value={addressForm.street}
            onChange={(e) =>
              setAddressForm({ ...addressForm, street: e.target.value })
            }
            rows="3"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 text-black"
            placeholder="House No., Building, Street"
          />

          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={locationLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {locationLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
            Use Current Location
          </button>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={addressForm.city}
              onChange={(e) =>
                setAddressForm({ ...addressForm, city: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-black"
              placeholder="City"
            />

            <input
              type="text"
              value={addressForm.state}
              onChange={(e) =>
                setAddressForm({ ...addressForm, state: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-black"
              placeholder="State"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={addressForm.zipCode}
              onChange={(e) =>
                setAddressForm({ ...addressForm, zipCode: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-black"
              placeholder="PIN Code"
            />

            <input
              type="tel"
              value={addressForm.phone}
              onChange={(e) =>
                setAddressForm({ ...addressForm, phone: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-black"
              placeholder="Phone"
            />
          </div>

          <input
            type="text"
            value={addressForm.landmark}
            onChange={(e) =>
              setAddressForm({ ...addressForm, landmark: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-black"
            placeholder="Landmark"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={addressForm.isDefault}
              onChange={(e) =>
                setAddressForm({
                  ...addressForm,
                  isDefault: e.target.checked,
                })
              }
              className="w-4 h-4 text-purple-600 rounded"
            />
            <span className="text-sm text-gray-700">
              Set as default address
            </span>
          </label>
        </div>

        <div className="border-t border-gray-200 p-4 flex gap-3">
          <button
            onClick={() => {
              setAddingAddress(false);
              setEditingAddressId(null);
              resetAddressForm();
            }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={() =>
              editingAddressId
                ? updateAddress(editingAddressId)
                : addAddress()
            }
            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg"
          >
            {editingAddressId ? "Update Address" : "Save Address"}
          </button>
        </div>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:items-center">
        <h2 className="text-2xl font-bold text-gray-900">Payment Methods</h2>

        <button
          onClick={() => setAddingPayment(true)}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg flex items-center gap-2 justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Payment Method
        </button>
      </div>

      <EmptyState
        icon={<CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />}
        title="No saved payment methods"
        description="You can add payment methods later."
      />
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>

      {orders.length === 0 ? (
        <EmptyState
          icon={<Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />}
          title="No orders yet"
          description="Start ordering delicious food now."
          action="Explore Restaurants"
          onClick={() => router.push("/")}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-gray-200 rounded-xl p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  {order.status || "Placed"}
                </span>
              </div>

              <p className="text-gray-700">{order.items?.length || 0} items</p>
              <p className="text-lg font-bold text-gray-900 mt-2">
                {currencySymbol}
                {Number(order.totalAmount || order.total || 0).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderFavorites = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Favorite Items</h2>

      {favorites.length === 0 ? (
        <EmptyState
          icon={<Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />}
          title="No favorite items yet"
          description="Save your favorite food and restaurants here."
          action="Browse Restaurants"
          onClick={() => router.push("/")}
        />
      ) : (
        <div className="grid gap-4">
          {favorites.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                <Utensils className="w-8 h-8 text-purple-600" />
              </div>

              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500">{item.restaurant}</p>
              </div>

              <Heart className="w-5 h-5 text-red-500 fill-current" />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Preferences</h2>

        <button
          onClick={updatePreferences}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg"
        >
          Save Preferences
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        <PreferenceGroup
          title="Notification Settings"
          data={preferences.notifications}
          onChange={(key, value) =>
            setPreferences({
              ...preferences,
              notifications: {
                ...preferences.notifications,
                [key]: value,
              },
            })
          }
        />

        <PreferenceGroup
          title="Dietary Preferences"
          data={preferences.diet}
          onChange={(key, value) =>
            setPreferences({
              ...preferences,
              diet: {
                ...preferences.diet,
                [key]: value,
              },
            })
          }
        />

        <PreferenceGroup
          title="Delivery Preferences"
          data={preferences.delivery}
          onChange={(key, value) =>
            setPreferences({
              ...preferences,
              delivery: {
                ...preferences.delivery,
                [key]: value,
              },
            })
          }
        />
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>

      {notifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />}
          title="No notifications yet"
          description="Your notifications will appear here."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`bg-white border rounded-xl p-4 ${
                !notif.read ? "border-purple-200 bg-purple-50/30" : "border-gray-200"
              }`}
            >
              <p className="font-medium text-gray-900">{notif.title}</p>
              <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderRewards = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Rewards & Offers</h2>

      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <Gift className="w-8 h-8" />
          <span className="text-3xl font-bold">
            {userData.loyaltyPoints} pts
          </span>
        </div>

        <p className="text-purple-100">Earn points on every order</p>
      </div>

      <EmptyState
        icon={<Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />}
        title="No active rewards"
        description="Rewards will appear here."
      />
    </div>
  );

  const renderHelp = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Help & Support</h2>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-2">
            Need Assistance?
          </h3>
          <p className="text-gray-600">
            Our support team is here to help you.
          </p>
        </div>

        {["Contact Support", "FAQ", "Terms & Conditions", "Privacy Policy"].map(
          (item) => (
            <button
              key={item}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              {item}
            </button>
          )
        )}
      </div>
    </div>
  );

  const tabs = [
    { id: "profile", label: "Profile", icon: <User className="w-5 h-5" /> },
    {
      id: "addresses",
      label: "Addresses",
      icon: <MapPin className="w-5 h-5" />,
      count: addresses.length,
    },
    {
      id: "payments",
      label: "Payments",
      icon: <CreditCard className="w-5 h-5" />,
      count: paymentMethods.length,
    },
    {
      id: "orders",
      label: "My Orders",
      icon: <ShoppingBag className="w-5 h-5" />,
      count: stats.totalOrders,
    },
    {
      id: "favorites",
      label: "Favorites",
      icon: <Heart className="w-5 h-5" />,
      count: favorites.length,
    },
    {
      id: "preferences",
      label: "Preferences",
      icon: <Settings className="w-5 h-5" />,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="w-5 h-5" />,
      count: notifications.filter((n) => !n.read).length,
    },
    { id: "rewards", label: "Rewards", icon: <Gift className="w-5 h-5" /> },
    {
      id: "help",
      label: "Help & Support",
      icon: <HelpCircle className="w-5 h-5" />,
    },
  ];

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 bg-clip-text text-transparent mb-2">
              My Profile
            </h1>
            <p className="text-gray-600">
              Manage your account, preferences, and orders
            </p>
          </div>

          {error && (
            <AlertBox
              type="error"
              message={error}
              onClose={() => setError(null)}
            />
          )}

          {success && <AlertBox type="success" message={success} />}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24 h-fit">
              <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-lg overflow-hidden">
                    {userData.profilePic ? (
                      <img
                        src={userData.profilePic || "/default-user.png"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      userData.name?.charAt(0) || "U"
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {userData.name || "User"}
                  </h2>

                  <div
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${membershipBadge.color} text-white mb-3`}
                  >
                    {membershipBadge.icon}
                    {userData.membershipLevel}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    Member since {userData.joinDate}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
                <div className="p-1">
                  {tabs.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg mb-1 transition-all ${
                        activeTab === item.id
                          ? "bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600 shadow-sm"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {item.icon}
                      <span className="font-medium flex-1 text-left">
                        {item.label}
                      </span>

                      {item.count > 0 && (
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                          {item.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-2xl p-6 text-white">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Quick Stats
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Orders</span>
                    <b>{stats.totalOrders}</b>
                  </div>

                  <div className="flex justify-between">
                    <span>Total Spent</span>
                    <b>{stats.totalSpent}</b>
                  </div>

                  <div className="flex justify-between">
                    <span>Avg. Rating</span>
                    <b>{stats.averageRating}</b>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              {activeTab === "profile" && renderProfile()}
              {activeTab === "addresses" && renderAddresses()}
              {activeTab === "payments" && renderPayments()}
              {activeTab === "orders" && renderOrders()}
              {activeTab === "favorites" && renderFavorites()}
              {activeTab === "preferences" && renderPreferences()}
              {activeTab === "notifications" && renderNotifications()}
              {activeTab === "rewards" && renderRewards()}
              {activeTab === "help" && renderHelp()}
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-rose-600 font-semibold"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

const StatCard = ({ icon, value, label }) => (
  <div className="bg-white rounded-xl p-4 border border-purple-100 shadow-sm">
    <div className="flex items-center justify-between mb-2">{icon}</div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    <p className="text-sm text-gray-600">{label}</p>
  </div>
);

const EmptyState = ({ icon, title, description, action, onClick }) => (
  <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
    {icon}
    <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
    <p className="text-gray-500 mb-4">{description}</p>
    {action && (
      <button
        onClick={onClick}
        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl"
      >
        {action}
      </button>
    )}
  </div>
);

const PreferenceGroup = ({ title, data, onChange }) => (
  <div className="border-b border-gray-100 pb-4 last:border-b-0">
    <h3 className="font-semibold text-gray-900 mb-3">{title}</h3>

    <div className="space-y-2">
      {Object.entries(data).map(([key, value]) => (
        <label key={key} className="flex items-center justify-between py-2">
          <span className="text-gray-700 capitalize">
            {key.replace(/([A-Z])/g, " $1").trim()}
          </span>

          <input
            type="checkbox"
            checked={value}
            onChange={(e) => onChange(key, e.target.checked)}
            className="w-5 h-5 text-purple-600 rounded"
          />
        </label>
      ))}
    </div>
  </div>
);

const AlertBox = ({ type, message, onClose }) => {
  const isError = type === "error";

  return (
    <div
      className={`mb-6 p-4 border rounded-lg flex items-center gap-3 ${
        isError
          ? "bg-red-50 border-red-200 text-red-700"
          : "bg-green-50 border-green-200 text-green-700"
      }`}
    >
      {isError ? (
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
      ) : (
        <Check className="w-5 h-5 flex-shrink-0" />
      )}

      <p className="flex-1">{message}</p>

      {onClose && (
        <button onClick={onClose}>
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default Page;
