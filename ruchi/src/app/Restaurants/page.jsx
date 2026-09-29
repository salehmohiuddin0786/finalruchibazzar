"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Filter, Star, Clock, MapPin, ChevronRight, Heart,
  CheckCircle, Truck, Shield, Zap, Flame, Leaf, Sparkles,
  Award, Sandwich, Pizza, ChefHat, ThumbsUp, TrendingUp,
  ShoppingBag, Navigation, Users, Crown, Rocket, Percent,
  ArrowRight, X, UtensilsCrossed, IceCream, Coffee as CoffeeIcon,
  Loader, IndianRupee, Gift, Bell, ChevronDown, Menu,
  BadgeCheck, Sun, Moon, Eye, Tag, CreditCard,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getMediaUrl } from "../utils/media";

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
    <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-100"></div>
    <div className="p-5">
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-gray-200 rounded w-16"></div>
        <div className="h-6 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="h-16 bg-gray-200 rounded-lg"></div>
        <div className="h-16 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="h-12 bg-gray-200 rounded-xl"></div>
    </div>
  </div>
);

const RestaurantsPage = () => {
  const router = useRouter();
  const mainContentRef = useRef(null);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortBy, setSortBy] = useState("recommended");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [loadedImages, setLoadedImages] = useState({});

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const IMAGE_BASE = API_BASE.replace("/api", "");
  const currencySymbol = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₹";

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const getRandomColor = () => {
    const colors = [
      "from-orange-100 to-red-100",
      "from-amber-100 to-yellow-100",
      "from-blue-50 to-teal-50",
      "from-emerald-50 to-green-50",
      "from-red-50 to-orange-50",
      "from-pink-50 to-rose-50",
      "from-purple-50 to-indigo-50",
      "from-cyan-50 to-blue-50",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getImageUrl = (restaurant) => {
    const image =
      restaurant.logo ||
      restaurant.image ||
      restaurant.coverImage ||
      restaurant.outletPhotos?.[0];

    if (!image) return "";

    const value = String(image).trim();

  // ✅ base64 image support
    if (value.startsWith("data:image")) {
      return value;
    }

    return getMediaUrl(value, API_BASE);
  };

  const formatMoney = (value, fallbackValue = 0) => {
    const amount = Number(value);
    const safeAmount = Number.isFinite(amount) ? amount : fallbackValue;
    return `${currencySymbol}${safeAmount}`;
  };

  const getPriceRange = (restaurant) => {
    if (restaurant.priceRange) return restaurant.priceRange;

    const minimumOrderValue = Number(restaurant.minimumOrderValue);
    if (!Number.isFinite(minimumOrderValue)) return `${currencySymbol}${currencySymbol}`;
    if (minimumOrderValue <= 150) return currencySymbol;
    if (minimumOrderValue <= 300) return `${currencySymbol}${currencySymbol}`;
    return `${currencySymbol}${currencySymbol}${currencySymbol}`;
  };

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE}/restaurants`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch restaurants");
      }

      const restaurantList = Array.isArray(data)
        ? data
        : data.restaurants || data.data || [];

      const transformedData = restaurantList.map((restaurant) => ({
        id: restaurant.id,
        name: restaurant.name || "Restaurant",
        description:
          restaurant.aboutRestaurant ||
          restaurant.description ||
          "Authentic cuisine restaurant",
        address: restaurant.address || "Location available",
        cuisine: Array.isArray(restaurant.cuisines)
          ? restaurant.cuisines.join(", ")
          : restaurant.cuisines || restaurant.cuisine || "Various Cuisine",
        rating: restaurant.rating || 4.5,
        reviewCount: restaurant.reviewCount || Math.floor(Math.random() * 1000) + 100,
        deliveryTime: restaurant.deliveryTime || "25-35 min",
        deliveryFee: formatMoney(restaurant.deliveryFee, 0),
        minOrder: formatMoney(restaurant.minimumOrderValue, 99),
        tags: Array.isArray(restaurant.cuisines)
          ? restaurant.cuisines.slice(0, 3)
          : ["Fresh", "Quality"],
        priceRange: getPriceRange(restaurant),
        distance: restaurant.distance || `${(Math.random() * 3 + 0.5).toFixed(1)} km`,
        featured: restaurant.featured || false,
        offers: restaurant.offers || ["Special Offer"],
        color: getRandomColor(),
        isOpen: restaurant.isOpen !== undefined ? restaurant.isOpen : true,
        imageUrl: getImageUrl(restaurant),
        ownerId: restaurant.ownerId,
        discount: restaurant.discount || Math.floor(Math.random() * 30) + 10,
        isNew: restaurant.isNew || Math.random() > 0.85,
        isTrending: restaurant.isTrending || Math.random() > 0.8,
      }));

      setRestaurants(transformedData);
    } catch (err) {
      console.error("Error fetching restaurants:", err);
      setError(err.message || "Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return updated;
    });
  };

  const viewMenu = (restaurantId) => {
    router.push(`/Restaurants/${restaurantId}`);
  };

  const handleImageLoad = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  const categories = [
    { id: "all", label: "All", icon: UtensilsCrossed, gradient: "from-gray-500 to-gray-600" },
    { id: "fast-food", label: "Fast Food", icon: Sandwich, gradient: "from-orange-500 to-red-500" },
    { id: "italian", label: "Italian", icon: Pizza, gradient: "from-green-500 to-emerald-500" },
    { id: "asian", label: "Asian", icon: UtensilsCrossed, gradient: "from-red-500 to-rose-500" },
    { id: "indian", label: "Indian", icon: Flame, gradient: "from-orange-600 to-amber-600" },
    { id: "vegetarian", label: "Veg", icon: Leaf, gradient: "from-green-400 to-lime-500" },
    { id: "dessert", label: "Desserts", icon: IceCream, gradient: "from-pink-400 to-rose-400" },
    { id: "coffee", label: "Cafés", icon: CoffeeIcon, gradient: "from-amber-600 to-yellow-600" },
  ];

  const priceRanges = [
    { id: "all", label: "All Price", icon: IndianRupee, description: "Any budget" },
    { id: "low", label: currencySymbol, description: "Budget Friendly", icon: IndianRupee },
    { id: "medium", label: `${currencySymbol}${currencySymbol}`, description: "Moderate", icon: IndianRupee },
    { id: "high", label: `${currencySymbol}${currencySymbol}${currencySymbol}`, description: "Premium", icon: Crown },
  ];

  const sortOptions = [
    { id: "recommended", label: "Recommended", icon: ThumbsUp, description: "Based on your taste" },
    { id: "rating", label: "Highest Rated", icon: Star, description: "Top reviewed first" },
    { id: "delivery-time", label: "Fastest Delivery", icon: Rocket, description: "Quickest arrival" },
    { id: "price-low", label: "Price: Low to High", icon: IndianRupee, description: "Budget first" },
    { id: "price-high", label: "Price: High to Low", icon: TrendingUp, description: "Premium first" },
  ];

  // Move these declarations BEFORE any useEffect that depends on them
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const cuisine = restaurant.cuisine?.toLowerCase() || "";
    const name = restaurant.name?.toLowerCase() || "";

    if (selectedCategory !== "all" && !cuisine.includes(selectedCategory.replace("-", " "))) {
      return false;
    }

    if (priceFilter !== "all") {
      if (priceFilter === "low" && restaurant.priceRange !== currencySymbol) return false;
      if (priceFilter === "medium" && restaurant.priceRange !== `${currencySymbol}${currencySymbol}`) return false;
      if (priceFilter === "high" && restaurant.priceRange !== `${currencySymbol}${currencySymbol}${currencySymbol}`) return false;
    }

    if (ratingFilter > 0 && restaurant.rating < ratingFilter) return false;

    if (searchQuery && !name.includes(searchQuery.toLowerCase()) && !cuisine.includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "delivery-time":
        return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
      case "price-low":
        return a.priceRange.length - b.priceRange.length;
      case "price-high":
        return b.priceRange.length - a.priceRange.length;
      default:
        return b.featured ? 1 : -1;
    }
  });

  // Move the scroll effect here, AFTER sortedRestaurants is declared
  useEffect(() => {
    if (mainContentRef.current && !loading && sortedRestaurants.length > 0) {
      mainContentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [sortedRestaurants.length, loading]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="bg-white min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <X className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to load restaurants</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchRestaurants}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" style={{ animation: 'spinSlow 20s linear infinite' }}></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6" style={{ animation: 'fadeDown 0.6s ease forwards' }}>
                <Sparkles className="w-5 h-5 text-yellow-300" style={{ animation: 'spinSlow 3s linear infinite' }} />
                <span className="text-white font-medium">2,500+ Happy Customers Today</span>
              </div>

              <h1 className="text-4xl md:text-7xl font-black text-white mb-6 leading-tight" style={{ animation: 'fadeUp 0.6s ease forwards 0.1s', opacity: 0 }}>
                Discover & Order
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-300">
                  Amazing Food
                </span>
              </h1>

              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto" style={{ animation: 'fadeUp 0.6s ease forwards 0.2s', opacity: 0 }}>
                Fresh, fast, and delivered to your door. Explore the best restaurants in your city.
              </p>

              {/* Search Bar in Hero */}
              <div className="max-w-2xl mx-auto" style={{ animation: 'fadeUp 0.6s ease forwards 0.3s', opacity: 0 }}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                  <div className="relative bg-white rounded-2xl shadow-2xl">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for restaurants, cuisines, or dishes..."
                      className="w-full pl-14 pr-24 py-5 bg-white rounded-2xl focus:outline-none text-gray-900 text-lg"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300">
                      Search
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-8 mt-12" style={{ animation: 'fadeUp 0.6s ease forwards 0.4s', opacity: 0 }}>
                {[
                  { icon: Truck, value: "30min", label: "Avg. Delivery" },
                  { icon: Shield, value: `${restaurants.length}+`, label: "Restaurants" },
                  { icon: Star, value: "4.8", label: "Avg. Rating" },
                  { icon: Users, value: "10k+", label: "Daily Orders" },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3"
                    >
                      <Icon className="w-6 h-6 text-white" />
                      <div className="text-left">
                        <div className="font-bold text-xl text-white">{item.value}</div>
                        <div className="text-sm text-white/80">{item.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
              <path fill="#f9fafb" fillOpacity="1" d="M0,256L48,240C96,224,192,192,288,192C384,192,480,224,576,224C672,224,768,192,864,176C960,160,1056,160,1152,176C1248,192,1344,224,1392,240L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
        </div>

        <main ref={mainContentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Categories Section */}
          <div className="mb-12" style={{ animation: 'fadeUp 0.6s ease forwards', opacity: 0 }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Explore Categories</h2>
                <p className="text-gray-500 mt-1">Find your favorite cuisine</p>
              </div>
              <button className="text-red-500 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto no-scrollbar">
              <div className="flex gap-4 pb-4">
                {categories.map((category, idx) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`group flex-shrink-0 transition-all duration-500 ${
                        selectedCategory === category.id ? "scale-105" : "hover:scale-105"
                      }`}
                      style={{ animationDelay: `${idx * 0.05}s`, animation: 'fadeUp 0.4s ease forwards', opacity: 0 }}
                    >
                      <div
                        className={`w-24 h-24 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300 ${
                          selectedCategory === category.id
                            ? `bg-gradient-to-br ${category.gradient} shadow-lg`
                            : "bg-white border-2 border-gray-200 hover:border-red-300"
                        }`}
                      >
                        <Icon
                          className={`w-8 h-8 transition-colors ${
                            selectedCategory === category.id ? "text-white" : "text-gray-600 group-hover:text-red-500"
                          }`}
                        />
                        <span
                          className={`text-xs font-semibold ${
                            selectedCategory === category.id ? "text-white" : "text-gray-700"
                          }`}
                        >
                          {category.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Filters and Controls Bar */}
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-8 sticky top-20 z-30 backdrop-blur-sm bg-white/95" style={{ animation: 'fadeUp 0.6s ease forwards 0.1s', opacity: 0 }}>
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
              {/* Results Count */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <ChefHat className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    {sortedRestaurants.length} Restaurants Found
                  </h3>
                  <p className="text-sm text-gray-500">Showing best matches for you</p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                {/* Search Input */}
                <div className="relative flex-1 lg:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search restaurants..."
                    className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                      <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>

                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden px-5 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl flex items-center gap-2 font-semibold"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>

                {/* Sort Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="px-5 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center gap-2 font-semibold text-gray-700 transition-all duration-300"
                  >
                    <TrendingUp className="w-4 h-4" />
                    Sort: {sortOptions.find(o => o.id === sortBy)?.label}
                    <ChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? "rotate-180" : ""}`} />
                  </button>

                  {showSortDropdown && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50" style={{ animation: 'fadeDown 0.3s ease forwards' }}>
                      {sortOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.id}
                            onClick={() => {
                              setSortBy(option.id);
                              setShowSortDropdown(false);
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors ${
                              sortBy === option.id ? "bg-red-50 text-red-600" : "text-gray-700"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <div>
                              <div className="font-semibold text-sm">{option.label}</div>
                              <div className="text-xs text-gray-400">{option.description}</div>
                            </div>
                            {sortBy === option.id && <CheckCircle className="w-4 h-4 ml-auto text-red-500" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* View Toggle */}
                <div className="hidden md:flex bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${viewMode === "grid" ? "bg-white shadow-md text-red-500" : "text-gray-500"}`}
                  >
                    <Menu className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${viewMode === "list" ? "bg-white shadow-md text-red-500" : "text-gray-500"}`}
                  >
                    <Menu className="w-4 h-4 rotate-90" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategory !== "all" || priceFilter !== "all" || ratingFilter > 0 || searchQuery) && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">Active filters:</span>
                {selectedCategory !== "all" && (
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm flex items-center gap-1 hover:bg-red-200 transition-colors"
                  >
                    {categories.find(c => c.id === selectedCategory)?.label}
                    <X className="w-3 h-3" />
                  </button>
                )}
                {priceFilter !== "all" && (
                  <button
                    onClick={() => setPriceFilter("all")}
                    className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm flex items-center gap-1 hover:bg-blue-200 transition-colors"
                  >
                    {priceRanges.find(p => p.id === priceFilter)?.label}
                    <X className="w-3 h-3" />
                  </button>
                )}
                {ratingFilter > 0 && (
                  <button
                    onClick={() => setRatingFilter(0)}
                    className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm flex items-center gap-1 hover:bg-yellow-200 transition-colors"
                  >
                    {ratingFilter}+ Stars
                    <X className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setPriceFilter("all");
                    setRatingFilter(0);
                    setSearchQuery("");
                  }}
                  className="px-3 py-1 text-gray-500 text-sm hover:text-red-500 transition-colors"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Restaurant Grid/List */}
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "flex flex-col gap-4"
          }>
            {sortedRestaurants.map((restaurant, index) => (
              <div
                key={restaurant.id}
                onMouseEnter={() => setHoveredCard(restaurant.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`group cursor-pointer transition-all duration-500 ${
                  viewMode === "grid" 
                    ? "bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:-translate-y-2 hover:border-red-200"
                    : "bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl flex flex-col md:flex-row"
                }`}
                style={{ animation: 'fadeUp 0.5s ease forwards', animationDelay: `${index * 0.03}s`, opacity: 0 }}
                onClick={() => viewMenu(restaurant.id)}
              >
                {/* Image Section */}
                <div className={`relative overflow-hidden ${viewMode === "grid" ? "h-52" : "h-48 md:h-auto md:w-72"} bg-gradient-to-br ${restaurant.color}`}>
                  {restaurant.imageUrl ? (
                    <>
                      {!loadedImages[restaurant.id] && (
                        <div className="absolute inset-0 animate-pulse bg-gray-200"></div>
                      )}
                      <img
                        src={restaurant.imageUrl}
                        alt={restaurant.name}
                        className={`w-full h-full object-cover transition-all duration-700 ${
                          hoveredCard === restaurant.id ? "scale-110" : "scale-100"
                        } ${loadedImages[restaurant.id] ? "opacity-100" : "opacity-0"}`}
                        onLoad={() => handleImageLoad(restaurant.id)}
                        onError={(event) => {
                          console.log("Image not loading:", restaurant.imageUrl);
                          handleImageLoad(restaurant.id);
                        }}
                      />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ChefHat className="w-16 h-16 text-white/50" />
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {restaurant.isNew && (
                      <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                        NEW
                      </span>
                    )}
                    {restaurant.isTrending && (
                      <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <Flame className="w-3 h-3" /> Trending
                      </span>
                    )}
                    {restaurant.discount > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {restaurant.discount}% OFF
                      </span>
                    )}
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => toggleFavorite(restaurant.id, e)}
                    className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg"
                  >
                    <Heart
                      className={`w-5 h-5 transition-all ${
                        favorites.has(restaurant.id)
                          ? "text-red-500 fill-red-500 scale-110"
                          : "text-gray-400 group-hover:text-red-400"
                      }`}
                    />
                  </button>

                  {/* Rating Badge */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-sm font-bold">{restaurant.rating}</span>
                    <span className="text-white/70 text-xs">({restaurant.reviewCount})</span>
                  </div>

                  {/* Delivery Time */}
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                    <Clock className="w-3 h-3 text-blue-500" />
                    <span className="text-xs font-semibold">{restaurant.deliveryTime}</span>
                  </div>
                </div>

                {/* Content Section */}
                <div className={`p-5 flex-1 ${viewMode === "list" ? "flex flex-col justify-between" : ""}`}>
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1">
                          {restaurant.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{restaurant.distance}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs text-gray-500">{restaurant.cuisine.split(",")[0]}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-red-500">{restaurant.priceRange}</div>
                        <div className="text-xs text-gray-400">min {restaurant.minOrder}</div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 line-clamp-2 mt-2">{restaurant.description}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {restaurant.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Offers */}
                    {restaurant.offers && restaurant.offers.length > 0 && (
                      <div className="mt-3 flex items-center gap-2">
                        <div className="bg-red-50 px-2 py-1 rounded-lg flex items-center gap-1">
                          <Gift className="w-3 h-3 text-red-500" />
                          <span className="text-xs text-red-600 font-medium">{restaurant.offers[0]}</span>
                        </div>
                        {restaurant.offers.length > 1 && (
                          <span className="text-xs text-gray-400">+{restaurant.offers.length - 1} more</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Order Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      viewMenu(restaurant.id);
                    }}
                    disabled={!restaurant.isOpen}
                    className={`mt-4 w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                      restaurant.isOpen
                        ? "bg-gradient-to-r from-red-500 to-orange-500 text-white hover:shadow-lg hover:scale-[1.02]"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {restaurant.isOpen ? (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        Order Now
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    ) : (
                      "Closed"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {sortedRestaurants.length === 0 && (
            <div className="text-center py-20" style={{ animation: 'fadeUp 0.6s ease forwards', opacity: 0 }}>
              <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-16 h-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No restaurants found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or search criteria</p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setPriceFilter("all");
                  setRatingFilter(0);
                  setSearchQuery("");
                }}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Promotional Banner */}
          <div className="mt-16 relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 p-8 md:p-12" style={{ animation: 'fadeUp 0.6s ease forwards 0.2s', opacity: 0 }}>
            <div className="absolute inset-0">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-yellow-200/20 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                  <Percent className="w-4 h-4 text-white" />
                  <span className="text-white font-medium">Limited Time Offer</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-white mb-3">
                  Get 50% OFF Your First Order!
                </h3>
                <p className="text-white/90 mb-6 max-w-md">
                  Use promo code at checkout and enjoy exclusive discounts on your favorite meals.
                </p>
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
                    <code className="text-white font-mono text-xl tracking-wider">WELCOME50</code>
                  </div>
                  <button className="px-6 py-3 bg-white text-red-600 font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300">
                    Claim Your Deal
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <Truck className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">Free</div>
                  <div className="text-sm text-white/80">Delivery</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-sm text-white/80">Secure</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-sm text-white/80">Support</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />

      {/* Mobile Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden" style={{ animation: 'fadeIn 0.3s ease forwards' }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto" style={{ animation: 'slideUp 0.4s ease forwards' }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Price Range</h4>
              <div className="grid grid-cols-2 gap-3">
                {priceRanges.map((range) => {
                  const Icon = range.icon;
                  return (
                    <button
                      key={range.id}
                      onClick={() => setPriceFilter(range.id)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        priceFilter === range.id
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 hover:border-red-200"
                      }`}
                    >
                      <Icon className="w-5 h-5 mx-auto mb-1" />
                      <span className="font-bold block text-center">{range.label}</span>
                      <span className="text-xs text-gray-400 block text-center">{range.description}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Minimum Rating</h4>
              <div className="grid grid-cols-4 gap-2">
                {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setRatingFilter(ratingFilter === rating ? 0 : rating)}
                    className={`py-3 rounded-xl border-2 transition-all duration-300 ${
                      ratingFilter === rating
                        ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                        : "border-gray-200 hover:border-yellow-200"
                    }`}
                  >
                    <span className="font-bold">{rating}+ ★</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setPriceFilter("all");
                  setRatingFilter(0);
                  setSearchQuery("");
                  setShowFilters(false);
                }}
                className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-600"
              >
                Reset All
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .sticky {
          position: sticky;
          top: 80px;
        }
      `}</style>
    </>
  );
};

export default RestaurantsPage;
