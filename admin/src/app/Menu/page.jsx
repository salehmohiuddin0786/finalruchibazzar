"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Plus,
  X,
  Search,
  Grid,
  List,
  ChevronDown,
  Download,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ChefHat,
  Utensils,
  Image as ImageIcon,
  Filter,
  AlertTriangle,
  Store,
  Menu as MenuIcon,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000";

const getToken = () =>
  typeof window !== "undefined"
    ? localStorage.getItem("token") || sessionStorage.getItem("token")
    : null;

const getStorage = () =>
  typeof window !== "undefined" && localStorage.getItem("token")
    ? localStorage
    : sessionStorage;

const StatCard = ({ icon: Icon, title, value, bgColor }) => (
  <div
    className={`${bgColor} relative overflow-hidden rounded-3xl p-5 md:p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}
  >
    <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full" />
    <div className="absolute -right-2 bottom-2 w-14 h-14 bg-white/10 rounded-full" />

    <div className="relative flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-white/85 text-xs md:text-sm font-semibold mb-1 truncate">
          {title}
        </p>
        <h3 className="text-2xl md:text-4xl font-extrabold text-white">
          {value}
        </h3>
      </div>

      <div className="p-3 md:p-4 bg-white/20 backdrop-blur rounded-2xl shrink-0 shadow-inner">
        <Icon className="text-white w-6 h-6 md:w-7 md:h-7" />
      </div>
    </div>
  </div>
);

const DeleteModal = ({ isOpen, onClose, onConfirm, dishName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative min-h-screen flex items-center justify-center p-3">
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-orange-500 p-6 text-center">
            <AlertTriangle className="text-white mx-auto mb-3" size={44} />
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Delete Item
            </h2>
          </div>

          <div className="p-5 text-center">
            <p className="text-gray-800 text-lg mb-2">Are you sure?</p>
            <p className="text-gray-600 font-medium mb-6 break-words">
              &quot;{dishName}&quot;
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                onClick={onConfirm}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl flex items-center justify-center gap-2 transition"
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DishFormModal = ({ type, onClose, onSubmit, restaurantId, dish }) => {
  const isEdit = type === "edit";

  const [formData, setFormData] = useState({
    name: dish?.name || "",
    price: dish?.price || "",
    description: dish?.description || "",
    isAvailable: dish?.isAvailable ?? true,
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(
    dish?.image
      ? dish.image.startsWith("http")
        ? dish.image
        : `${API}${dish.image}`
      : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: "Image size should be less than 5MB",
      }));
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        image: "Please upload image file only",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, image: file }));
    setImagePreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: null }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Dish name is required";
    if (!formData.price || Number(formData.price) <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!isEdit && !formData.image)
      newErrors.image = "Dish image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("price", formData.price);
    submitData.append("description", formData.description);
    submitData.append("isAvailable", String(formData.isAvailable));

    if (!isEdit) submitData.append("restaurantId", restaurantId);
    if (formData.image) submitData.append("image", formData.image);

    if (isEdit) {
      await onSubmit(dish.id, submitData);
    } else {
      await onSubmit(submitData);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative min-h-screen flex items-center justify-center p-3 sm:p-4">
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
          <div
            className={`rounded-t-3xl p-5 md:p-6 flex justify-between items-start gap-4 ${
              isEdit
                ? "bg-gradient-to-r from-purple-600 to-pink-600"
                : "bg-gradient-to-r from-blue-600 to-purple-600"
            }`}
          >
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white">
                {isEdit ? "Edit Menu Item" : "Add New Menu Item"}
              </h2>
              <p className="text-white/80 text-sm">
                {isEdit ? "Update dish details" : "Create a new dish"}
              </p>
            </div>

            <button onClick={onClose} className="shrink-0">
              <X className="text-white" size={26} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-5">
            <div>
              <label className="text-sm font-semibold text-gray-800">
                Dish Name *
              </label>
              <input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full mt-1 px-4 py-3 border-2 border-gray-200 focus:border-blue-500 rounded-xl text-gray-900 outline-none transition"
                placeholder="Chicken Biryani"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-800">
                Price *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full mt-1 px-4 py-3 border-2 border-gray-200 focus:border-blue-500 rounded-xl text-gray-900 outline-none transition"
                placeholder="299"
              />
              {errors.price && (
                <p className="text-red-600 text-sm mt-1">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-800">
                Description *
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full mt-1 px-4 py-3 border-2 border-gray-200 focus:border-blue-500 rounded-xl text-gray-900 outline-none transition"
                placeholder="Describe dish..."
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-800">
                Dish Image {isEdit ? "" : "*"}
              </label>

              <div className="relative mt-1 border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-xl p-4 md:p-6 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />

                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-full h-40 md:h-48 object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <ImageIcon className="mx-auto text-gray-400" size={44} />
                    <p className="text-gray-600 text-sm mt-2">Upload image</p>
                  </div>
                )}
              </div>

              {errors.image && (
                <p className="text-red-600 text-sm mt-1">{errors.image}</p>
              )}
            </div>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <span className="font-semibold text-gray-800">Available</span>
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) =>
                  setFormData({ ...formData, isAvailable: e.target.checked })
                }
              />
            </label>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 border rounded-xl hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl disabled:opacity-60 shadow-lg hover:shadow-xl transition"
              >
                {isSubmitting
                  ? isEdit
                    ? "Updating..."
                    : "Creating..."
                  : isEdit
                  ? "Update Dish"
                  : "Create Dish"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const EnhancedDishCard = ({ dish, onDelete, onEdit }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const imageUrl = dish.image
    ? dish.image.startsWith("http")
      ? dish.image
      : `${API}${dish.image}`
    : null;

  return (
    <>
      <div className="group bg-white rounded-[1.7rem] shadow-lg hover:shadow-2xl overflow-hidden border border-gray-100 min-w-0 hover:-translate-y-1 transition-all duration-300">
        <div className="relative h-44 sm:h-52 bg-gray-100 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={dish.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <ChefHat className="text-gray-400" size={52} />
            </div>
          )}

          <div className="absolute top-3 right-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold shadow ${
                dish.isAvailable
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {dish.isAvailable ? "Available" : "Unavailable"}
            </span>
          </div>
        </div>

        <div className="p-4 md:p-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-lg md:text-xl font-extrabold text-gray-900 truncate">
              {dish.name}
            </h3>

            <p className="text-lg md:text-2xl font-extrabold text-blue-600 shrink-0">
              ₹{dish.price}
            </p>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {dish.description}
          </p>

          <div className="flex gap-2 border-t pt-4">
            <button
              onClick={() => onEdit(dish)}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-purple-100 text-purple-700 hover:bg-purple-600 hover:text-white rounded-xl text-sm font-semibold transition-all"
            >
              <Edit2 size={16} />
              Edit
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-100 text-red-700 hover:bg-red-600 hover:text-white rounded-xl text-sm font-semibold transition-all"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>
      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          onDelete(dish.id);
          setShowDeleteModal(false);
        }}
        dishName={dish.name}
      />
    </>
  );
};

const Menu = () => {
  const router = useRouter();

  const [dishes, setDishes] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);

  useEffect(() => {
    const checkScreen = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("restaurant");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("restaurant");

    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";

    router.push("/Login");
  };

  const fetchRestaurantDetails = async () => {
    const token = getToken();

    const response = await fetch(`${API}/api/restaurants/my-restaurant`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Restaurant not found");

    const restaurantData = data.restaurant || data.data || data;

    setRestaurant(restaurantData);
    getStorage().setItem("restaurant", JSON.stringify(restaurantData));

    return restaurantData;
  };

  const fetchDishes = async (restaurantId) => {
    const token = getToken();

    const response = await axios.get(
      `${API}/api/dishes/restaurant/${restaurantId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const result = response.data.data || response.data.dishes || response.data;

    setDishes(Array.isArray(result) ? result : []);
  };

  useEffect(() => {
    let active = true;

    const init = async () => {
      try {
        setLoading(true);
        setPageError("");

        const token = getToken();
        const userData =
          localStorage.getItem("user") || sessionStorage.getItem("user");

        if (!token || !userData) {
          router.push("/Login");
          return;
        }

        const parsedUser = JSON.parse(userData);

        if (parsedUser.role !== "partner") {
          router.push("/Login");
          return;
        }

        if (!active) return;

        setUser(parsedUser);

        let restaurantData = null;

        const storedRestaurant =
          localStorage.getItem("restaurant") ||
          sessionStorage.getItem("restaurant");

        if (storedRestaurant) {
          try {
            restaurantData = JSON.parse(storedRestaurant);
            setRestaurant(restaurantData);
          } catch {
            restaurantData = null;
          }
        }

        if (!restaurantData?.id) restaurantData = await fetchRestaurantDetails();

        if (restaurantData?.id) await fetchDishes(restaurantData.id);
      } catch (error) {
        console.error("Menu init error:", error);

        if (active) {
          setPageError(error.message || "Unable to load menu");
          setRestaurant(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    init();

    return () => {
      active = false;
    };
  }, [router]);

  const refreshDishes = async () => {
    if (restaurant?.id) await fetchDishes(restaurant.id);
  };

  const handleAddDish = async (formData) => {
    try {
      const token = getToken();

      await axios.post(`${API}/api/dishes`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      await refreshDishes();
      setShowAddModal(false);
    } catch (err) {
      console.error("Add dish error:", err);

      if (err.response?.status === 401) handleLogout();

      alert(err.response?.data?.message || "Failed to add dish");
    }
  };

  const handleEditDish = async (id, formData) => {
    try {
      const token = getToken();

      await axios.put(`${API}/api/dishes/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      await refreshDishes();
      setShowEditModal(false);
      setSelectedDish(null);
    } catch (err) {
      console.error("Edit dish error:", err);

      if (err.response?.status === 401) handleLogout();

      alert(err.response?.data?.message || "Failed to update dish");
    }
  };

  const deleteDish = async (id) => {
    try {
      const token = getToken();

      await axios.delete(`${API}/api/dishes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await refreshDishes();
    } catch (err) {
      console.error("Delete dish error:", err);

      if (err.response?.status === 401) handleLogout();

      alert(err.response?.data?.message || "Failed to delete dish");
    }
  };

  const stats = {
    total: dishes.length,
    available: dishes.filter((d) => d.isAvailable).length,
    unavailable: dishes.filter((d) => !d.isAvailable).length,
  };

  const filteredDishes = dishes.filter((dish) => {
    const matchesSearch =
      dish.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dish.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAvailability =
      availabilityFilter === "all" ||
      (availabilityFilter === "available" && dish.isAvailable) ||
      (availabilityFilter === "unavailable" && !dish.isAvailable);

    return matchesSearch && matchesAvailability;
  });

  if (loading) {
    return (
      <div className="flex min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 md:h-20 md:w-20 border-4 border-blue-600 border-t-transparent mx-auto mb-4" />
            <p className="text-gray-800 text-base md:text-lg font-medium">
              Loading your menu...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 overflow-x-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl text-center w-full max-w-md">
          <Store className="mx-auto text-red-600 mb-4" size={48} />

          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Restaurant not found
          </h2>

          <p className="text-gray-600 mb-2 text-sm md:text-base">
            {pageError || "Please complete your partner registration first."}
          </p>

          <button
            onClick={() => router.push("/partner-register")}
            className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-xl mt-4"
          >
            Complete Registration
          </button>

          <button
            onClick={handleLogout}
            className="block mx-auto text-gray-500 mt-4"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {isMobile && !sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-[70] p-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl lg:hidden active:scale-95 transition"
          aria-label="Open sidebar"
        >
          <MenuIcon size={22} />
        </button>
      )}

      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed lg:static inset-y-0 left-0 z-[60] transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <Sidebar
          restaurantName={restaurant.name}
          onLogout={handleLogout}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onToggle={() => setSidebarOpen((prev) => !prev)}
        />
      </div>

      <div className="flex-1 min-w-0 overflow-x-hidden">
        <Header
          title="Menu Management"
          restaurantName={restaurant.name}
          userName={user?.name}
          onLogout={handleLogout}
          onMenuClick={() => setSidebarOpen(true)}
          sidebarOpen={sidebarOpen}
        />

        <div className="p-3 sm:p-4 md:p-6 overflow-x-hidden">
          <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-[2rem] p-5 md:p-8 mb-6 md:mb-8 text-white overflow-hidden shadow-2xl">
            <div className="absolute -top-20 -right-20 w-52 h-52 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-yellow-300/20 rounded-full blur-3xl" />

            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-white/80 text-sm font-medium mb-2">
                  Restaurant Partner Panel
                </p>

                <h2 className="text-2xl md:text-4xl font-extrabold mb-2 truncate">
                  Welcome back, {restaurant.name}! 👋
                </h2>

                <p className="text-white/85 text-sm md:text-base">
                  Manage your dishes, availability, pricing, and menu updates
                  easily.
                </p>
              </div>

              <div className="bg-white/20 backdrop-blur rounded-3xl p-4 w-fit shadow-xl">
                <Store className="w-12 h-12 md:w-16 md:h-16" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
            <StatCard
              icon={Utensils}
              title="Total Items"
              value={stats.total}
              bgColor="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700"
            />

            <StatCard
              icon={Eye}
              title="Available"
              value={stats.available}
              bgColor="bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600"
            />

            <div className="col-span-2 lg:col-span-1">
              <StatCard
                icon={EyeOff}
                title="Unavailable"
                value={stats.unavailable}
                bgColor="bg-gradient-to-br from-rose-400 via-red-500 to-orange-600"
              />
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl p-4 md:p-6 mb-6 md:mb-8 border border-white">
            <div className="flex flex-col xl:flex-row gap-3">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />

                <input
                  type="text"
                  placeholder="Search dishes..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 focus:border-purple-500 rounded-2xl text-gray-900 outline-none transition"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full xl:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl flex items-center justify-center gap-2 transition"
              >
                <Filter size={20} />
                Filters
                <ChevronDown size={16} />
              </button>

              <div className="w-full xl:w-auto flex bg-gray-100 rounded-2xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex-1 xl:flex-none p-3 rounded-xl transition ${
                    viewMode === "grid"
                      ? "bg-white shadow text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  <Grid size={20} className="mx-auto" />
                </button>

                <button
                  onClick={() => setViewMode("list")}
                  className={`flex-1 xl:flex-none p-3 rounded-xl transition ${
                    viewMode === "list"
                      ? "bg-white shadow text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  <List size={20} className="mx-auto" />
                </button>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="w-full xl:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition"
              >
                <Plus size={20} />
                Add New Item
              </button>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
                {["all", "available", "unavailable"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setAvailabilityFilter(filter)}
                    className={`px-4 py-2 rounded-full text-sm capitalize transition ${
                      availabilityFilter === filter
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="min-w-0">
              <h2 className="text-xl md:text-3xl font-extrabold text-gray-900 truncate">
                {restaurant.name} Menu
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
                Showing {filteredDishes.length} of {dishes.length}
              </p>
            </div>

            <button
              onClick={() => {
                const dataStr = JSON.stringify(filteredDishes, null, 2);
                const dataUri =
                  "data:application/json;charset=utf-8," +
                  encodeURIComponent(dataStr);
                const link = document.createElement("a");
                link.href = dataUri;
                link.download = `${restaurant.name}-menu.json`;
                link.click();
              }}
              className="w-full md:w-auto px-4 py-2 text-gray-700 bg-white hover:bg-gray-50 rounded-xl flex items-center justify-center gap-2 shadow transition"
            >
              <Download size={18} />
              Export
            </button>
          </div>

          {filteredDishes.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {filteredDishes.map((dish) => (
                  <EnhancedDishCard
                    key={dish.id}
                    dish={dish}
                    onDelete={deleteDish}
                    onEdit={(dish) => {
                      setSelectedDish(dish);
                      setShowEditModal(true);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDishes.map((dish) => (
                  <div
                    key={dish.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 transition"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-extrabold text-gray-900 truncate">
                        {dish.name}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {dish.description}
                      </p>
                    </div>

                    <p className="text-lg md:text-xl font-extrabold text-blue-600">
                      ₹{dish.price}
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedDish(dish);
                          setShowEditModal(true);
                        }}
                        className="flex items-center gap-1 px-3 py-2 bg-purple-100 text-purple-700 hover:bg-purple-600 hover:text-white rounded-xl text-sm font-semibold transition"
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>

                      <button
                        onClick={() => deleteDish(dish.id)}
                        className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 hover:bg-red-600 hover:text-white rounded-xl text-sm font-semibold transition"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-16 text-center">
              <ChefHat className="mx-auto text-blue-600 mb-4" size={52} />

              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                No menu items found
              </h3>

              <button
                onClick={() => setShowAddModal(true)}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl mt-4 shadow-lg"
              >
                Add First Item
              </button>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <DishFormModal
          type="add"
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddDish}
          restaurantId={restaurant.id}
        />
      )}

      {showEditModal && selectedDish && (
        <DishFormModal
          type="edit"
          onClose={() => {
            setShowEditModal(false);
            setSelectedDish(null);
          }}
          onSubmit={handleEditDish}
          dish={selectedDish}
        />
      )}
    </div>
  );
};

export default Menu;