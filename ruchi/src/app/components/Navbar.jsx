"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  MapPin,
  Heart,
  Truck,
  Gift,
  Clock,
  ChevronDown,
  User,
  Home,
  Store,
  Tag,
  ClipboardList,
  Pizza,
  Beef,
  Fish,
  Salad,
  Cake,
  Coffee,
  Navigation,
} from "lucide-react";
import Image from "next/image";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [userLocation, setUserLocation] = useState("Select location");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const searchRef = useRef(null);
  const menuRef = useRef(null);
  const locationRef = useRef(null);
  const mobileSearchRef = useRef(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const getCartId = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("cartId");
  };

  const fetchCartCount = async () => {
    try {
      const cartId = getCartId();

      if (!cartId) {
        setCartItemsCount(0);
        return;
      }

      const response = await fetch(`${apiUrl}/Cart/${cartId}`);

      if (!response.ok) {
        setCartItemsCount(0);
        return;
      }

      const data = await response.json();

      const cartItems = Array.isArray(data)
        ? data
        : Array.isArray(data.items)
        ? data.items
        : Array.isArray(data.cartItems)
        ? data.cartItems
        : Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.cart?.items)
        ? data.cart.items
        : [];

      const totalCount = cartItems.reduce(
        (sum, item) => sum + Number(item.quantity || 1),
        0
      );

      setCartItemsCount(totalCount);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCartItemsCount(0);
    }
  };

  const saveLocation = ({ locationName, latitude, longitude }) => {
    setUserLocation(locationName);

    localStorage.setItem("userLocation", locationName);
    localStorage.setItem("userLatitude", latitude.toString());
    localStorage.setItem("userLongitude", longitude.toString());

    window.dispatchEvent(new Event("locationUpdated"));
  };

  const goToNearestRestaurants = (latitude, longitude) => {
    router.push(`/Restaurants?nearby=true&lat=${latitude}&lng=${longitude}`);
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          let locationString = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                "Accept-Language": "en",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            const address = data.address || {};

            const area =
              address.suburb ||
              address.neighbourhood ||
              address.city_district ||
              address.city ||
              address.town ||
              address.village ||
              address.county ||
              address.state;

            if (area) {
              locationString = address.state
                ? `${area}, ${address.state}`
                : area;
            }
          }

          saveLocation({
            locationName: locationString,
            latitude,
            longitude,
          });

          setShowLocationMenu(false);
          setIsMenuOpen(false);
          goToNearestRestaurants(latitude, longitude);
        } catch (error) {
          console.error("Error getting location details:", error);

          const fallbackLocation = `${latitude.toFixed(4)}, ${longitude.toFixed(
            4
          )}`;

          saveLocation({
            locationName: fallbackLocation,
            latitude,
            longitude,
          });

          setShowLocationMenu(false);
          setIsMenuOpen(false);
          goToNearestRestaurants(latitude, longitude);
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        setIsGettingLocation(false);

        if (error.code === error.PERMISSION_DENIED) {
          setLocationError("Please allow location permission");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setLocationError("Location unavailable");
        } else if (error.code === error.TIMEOUT) {
          setLocationError("Location request timed out");
        } else {
          setLocationError("Unable to get location");
        }

        console.error("Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      }
    );
  };

  useEffect(() => {
    const savedLocation = localStorage.getItem("userLocation");

    if (savedLocation) {
      setUserLocation(savedLocation);
    }
  }, []);

  useEffect(() => {
    fetchCartCount();

    const handleCartUpdate = () => fetchCartCount();

    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("storage", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("storage", handleCartUpdate);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);

    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchSuggestions(false);
      }

      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(e.target) &&
        isMobileSearchOpen
      ) {
        setIsMobileSearchOpen(false);
      }

      if (menuRef.current && !menuRef.current.contains(e.target) && isMenuOpen) {
        setIsMenuOpen(false);
      }

      if (locationRef.current && !locationRef.current.contains(e.target)) {
        setShowLocationMenu(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isMenuOpen, isMobileSearchOpen]);

  useEffect(() => {
    if (isMenuOpen || isMobileSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen, isMobileSearchOpen]);

  const navigateTo = (path) => {
    router.push(path);
    setIsMenuOpen(false);
    setIsMobileSearchOpen(false);
    setShowSearchSuggestions(false);
  };

  const handleSearch = (query = searchQuery) => {
    const finalQuery = query.trim();

    if (!finalQuery) return;

    router.push(`/search?q=${encodeURIComponent(finalQuery)}`);
    setSearchQuery("");
    setShowSearchSuggestions(false);
    setIsMobileSearchOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const locations = [
    { id: "adilabad", name: "Adilabad, Telangana" },
    { id: "hyderabad", name: "Hyderabad, Telangana" },
    { id: "nizamabad", name: "Nizamabad, Telangana" },
    { id: "warangal", name: "Warangal, Telangana" },
  ];

  const handleLocationSelect = (location) => {
    setUserLocation(location.name);
    setShowLocationMenu(false);
    setIsMenuOpen(false);
    setLocationError(null);

    localStorage.setItem("userLocation", location.name);
    localStorage.removeItem("userLatitude");
    localStorage.removeItem("userLongitude");

    router.push(`/Restaurants?location=${encodeURIComponent(location.name)}`);
  };

  const navItems = [
    { label: "Home", icon: Home, path: "/" },
    { label: "Restaurants", icon: Store, path: "/Restaurants" },
    { label: "Offers", icon: Tag, path: "/Offers" },
    { label: "Orders", icon: ClipboardList, path: "/Orders" },
    { label: "Cart", icon: ShoppingBag, path: "/Cart", badge: true },
  ];

  const searchSuggestions = [
    { id: 1, text: "Chicken Biryani", type: "dish" },
    { id: 2, text: "Margherita Pizza", type: "dish" },
    { id: 3, text: "Fresh Vegetables", type: "category" },
    { id: 4, text: "Organic Fruits", type: "category" },
    { id: 5, text: "Burger King", type: "restaurant" },
    { id: 6, text: "Coffee", type: "category" },
  ];

  const popularCategories = [
    { name: "Pizza", icon: Pizza },
    { name: "Burger", icon: Beef },
    { name: "Sushi", icon: Fish },
    { name: "Salad", icon: Salad },
    { name: "Dessert", icon: Cake },
    { name: "Coffee", icon: Coffee },
  ];

  return (
    <>
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs sm:text-sm">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Truck size={14} className="sm:w-4 sm:h-4 animate-pulse" />
              <span className="whitespace-nowrap">30 min Delivery</span>
            </div>

            <span className="hidden xs:inline text-white/80">|</span>

            <div className="hidden xs:flex items-center gap-1.5">
              <Gift size={14} className="sm:w-4 sm:h-4" />
              <span className="whitespace-nowrap">50% OFF First Order</span>
            </div>
          </div>

          <button
            onClick={() => navigateTo("/Orders")}
            className="font-medium hover:text-white/80 transition-colors whitespace-nowrap ml-2"
          >
            Order Now <span className="hidden xs:inline">→</span>
          </button>
        </div>
      </div>

      <nav
        className={`sticky top-0 z-50 bg-white border-b border-gray-200 transition-shadow duration-200 ${
          isScrolled ? "shadow-lg" : ""
        } ${isMobileSearchOpen ? "shadow-lg" : ""}`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-14 sm:h-16 lg:h-20 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
              <button
                className="lg:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-900"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={20} className="sm:w-6 sm:h-6" />
              </button>

              <button
                onClick={() => navigateTo("/")}
                className="hidden lg:flex items-center gap-2 sm:gap-3 group"
              >
               <div className="relative w-26 h-26 sm:w-40 sm:h-40 lg:w-28 lg:h-28">
  <Image
  src="/Logo.png"
  alt="Ruchi Bazaar Logo"
  fill
  sizes="96px"
  style={{ objectFit: "contain" }}
  priority
  className="mix-blend-multiply group-hover:scale-105 transition-transform duration-200"
/>
</div>

                <div className="hidden xs:block">
                  <h1 className="text-base sm:text-xl lg:text-2xl font-black text-gray-900 leading-tight">
                    Ruchi Bazaar
                  </h1>
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-600">
                    <Clock size={10} className="sm:w-3 sm:h-3 text-red-500" />
                    <span>Fresh & Fast</span>
                  </div>
                </div>
              </button>

              <div className="hidden lg:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.path;

                  return (
                    <button
                      key={item.path}
                      onClick={() => navigateTo(item.path)}
                      className={`relative px-3 xl:px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                        active
                          ? "bg-red-50 text-red-600"
                          : "text-gray-900 hover:text-red-600 hover:bg-red-50"
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>

                      {item.badge && cartItemsCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                          {cartItemsCount > 9 ? "9+" : cartItemsCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:hidden absolute left-1/2 transform -translate-x-1/2">
              <button
                onClick={() => navigateTo("/")}
                className="flex items-center gap-2"
              >
                <div className="relative w-7 h-7 sm:w-8 sm:h-8">
                  <Image
                    src="/Logo.png"
                    alt="Ruchi Bazaar Logo"
                    fill
                    sizes="32px"
                    style={{ objectFit: "contain" }}
                    priority
                  />
                </div>
                <span className="font-black text-base sm:text-lg text-gray-900">
                  Ruchi Bazaar
                </span>
              </button>
            </div>

            <div className="hidden lg:block flex-1 max-w-2xl mx-6" ref={searchRef}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-500" />
                </div>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSearchSuggestions(true)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search restaurants, dishes..."
                  className="w-full pl-10 pr-10 py-2.5 lg:py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 text-gray-900 placeholder-gray-500"
                />

                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    aria-label="Clear search"
                  >
                    <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                  </button>
                )}

                {showSearchSuggestions && (
                  <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                    <div className="p-4 max-h-96 overflow-y-auto">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        Popular Searches
                      </h3>

                      <div className="space-y-2">
                        {searchSuggestions.map((suggestion) => (
                          <button
                            key={suggestion.id}
                            onClick={() => handleSearch(suggestion.text)}
                            className="flex items-center gap-3 w-full p-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                          >
                            <Search className="w-4 h-4 text-gray-500" />
                            <div>
                              <div className="font-medium text-gray-900">
                                {suggestion.text}
                              </div>
                              <div className="text-xs text-gray-600 capitalize">
                                {suggestion.type}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 lg:gap-4">
              <div className="hidden lg:block relative" ref={locationRef}>
                <button
                  onClick={() => setShowLocationMenu((prev) => !prev)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-900"
                  disabled={isGettingLocation}
                >
                  <MapPin className="w-5 h-5 text-red-500" />

                  <div className="text-left">
                    <div className="text-sm font-semibold">Location</div>
                    <div className="text-xs text-gray-600 truncate max-w-[140px]">
                      {isGettingLocation ? "Getting location..." : userLocation}
                    </div>
                  </div>

                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>

                {showLocationMenu && (
                  <div className="absolute top-full mt-2 right-0 w-72 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        Select Location
                      </h3>

                      <button
                        onClick={getCurrentLocation}
                        disabled={isGettingLocation}
                        className="w-full text-left px-3 py-3 rounded-lg mb-3 bg-red-50 hover:bg-red-100 transition-colors flex items-center gap-3 disabled:opacity-70"
                      >
                        <Navigation className="w-4 h-4 text-red-600" />
                        <div>
                          <span className="font-medium text-red-600">
                            {isGettingLocation
                              ? "Getting location..."
                              : "Use Current Location"}
                          </span>

                          {locationError && (
                            <p className="text-xs text-red-500 mt-1">
                              {locationError}
                            </p>
                          )}
                        </div>
                      </button>

                      <h4 className="text-xs font-medium text-gray-500 mb-2 px-3">
                        Popular Locations
                      </h4>

                      {locations.map((location) => (
                        <button
                          key={location.id}
                          onClick={() => handleLocationSelect(location)}
                          className={`w-full text-left px-3 py-2.5 rounded-lg mb-1 last:mb-0 transition-colors ${
                            userLocation === location.name
                              ? "bg-red-50 text-red-600 font-medium"
                              : "hover:bg-gray-100 text-gray-900"
                          }`}
                        >
                          {location.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => navigateTo("/favorites")}
                className="hidden lg:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Favorites"
              >
                <Heart className="w-5 h-5 text-gray-900" />
              </button>

              <button
                onClick={() => navigateTo("/Cart")}
                className="relative p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-900 group"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-200" />

                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold min-w-5 h-5 px-1 rounded-full flex items-center justify-center">
                    {cartItemsCount > 9 ? "9+" : cartItemsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => navigateTo("/profile")}
                className="hidden lg:flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Profile"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </button>

              <button
                onClick={() => setIsMobileSearchOpen(true)}
                className="lg:hidden p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 text-gray-900"
                aria-label="Search"
              >
                <Search className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
        </div>

        {isMobileSearchOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-white" ref={mobileSearchRef}>
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-3 p-4 border-b border-gray-200">
                <button
                  onClick={() => {
                    setIsMobileSearchOpen(false);
                    setSearchQuery("");
                    setShowSearchSuggestions(false);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-900"
                  aria-label="Close search"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-gray-500" />
                  </div>

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSearchSuggestions(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search restaurants, dishes..."
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 text-gray-900 placeholder-gray-500"
                    autoFocus
                  />

                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Popular Categories
                  </h3>

                  <div className="grid grid-cols-3 gap-3">
                    {popularCategories.map((category) => {
                      const Icon = category.icon;

                      return (
                        <button
                          key={category.name}
                          onClick={() => {
                            router.push(`/category/${category.name.toLowerCase()}`);
                            setIsMobileSearchOpen(false);
                          }}
                          className="flex flex-col items-center gap-2 p-3 bg-gray-50 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <Icon className="w-6 h-6 text-gray-900" />
                          <span className="text-xs font-medium text-gray-900">
                            {category.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Popular Searches
                  </h3>

                  <div className="space-y-2">
                    {searchSuggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        onClick={() => handleSearch(suggestion.text)}
                        className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                      >
                        <Search className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="font-medium text-gray-900">
                            {suggestion.text}
                          </div>
                          <div className="text-xs text-gray-600 capitalize">
                            {suggestion.type}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="lg:hidden px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {popularCategories.map((category) => {
              const Icon = category.icon;

              return (
                <button
                  key={category.name}
                  onClick={() =>
                    router.push(`/category/${category.name.toLowerCase()}`)
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-red-100 rounded-full transition-colors whitespace-nowrap flex-shrink-0"
                >
                  <Icon className="w-4 h-4 text-gray-900" />
                  <span className="text-sm font-medium text-gray-900">
                    {category.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-gray-900/20 backdrop-blur-md animate-fadeIn"
            onClick={() => setIsMenuOpen(false)}
          />

          <div
            ref={menuRef}
            className="absolute left-0 top-0 w-80 max-w-[90%] h-full bg-white shadow-xl animate-slideIn"
          >
            <div className="h-full flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12">
                      <Image
                        src="/Logo.png"
                        alt="Ruchi Bazaar Logo"
                        fill
                        sizes="48px"
                        style={{ objectFit: "contain" }}
                        className="rounded-xl"
                      />
                    </div>

                    <div>
                      <h2 className="font-bold text-gray-900 text-lg">
                        Ruchi Bazaar
                      </h2>
                      <p className="text-sm text-gray-600">Fresh & Fast</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-900"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">Welcome Back!</p>
                    <p className="text-sm text-gray-600">
                      Sign in for better experience
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto py-4">
                <div className="px-4">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.path;

                    return (
                      <button
                        key={item.path}
                        onClick={() => navigateTo(item.path)}
                        className={`flex items-center gap-4 w-full p-3 rounded-lg mb-2 transition-colors ${
                          active
                            ? "bg-red-50 text-red-600 font-semibold"
                            : "hover:bg-gray-100 text-gray-900"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-base">{item.label}</span>

                        {item.badge && cartItemsCount > 0 && (
                          <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {cartItemsCount > 9 ? "9+" : cartItemsCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 px-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 px-3">
                    Your Location
                  </h3>

                  <button
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                    className="w-full text-left px-3 py-3 rounded-lg mb-3 bg-red-50 hover:bg-red-100 transition-colors flex items-center gap-3 disabled:opacity-70"
                  >
                    <Navigation className="w-4 h-4 text-red-600" />

                    <div>
                      <span className="font-medium text-red-600">
                        {isGettingLocation
                          ? "Getting location..."
                          : "Use Current Location"}
                      </span>

                      {locationError && (
                        <p className="text-xs text-red-500 mt-1">
                          {locationError}
                        </p>
                      )}
                    </div>
                  </button>

                  <h4 className="text-xs font-medium text-gray-500 mb-2 px-3">
                    Popular Locations
                  </h4>

                  <div className="space-y-1">
                    {locations.map((location) => (
                      <button
                        key={location.id}
                        onClick={() => handleLocationSelect(location)}
                        className={`w-full text-left px-3 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                          userLocation === location.name
                            ? "bg-red-50 text-red-600 font-medium"
                            : "hover:bg-gray-100 text-gray-900"
                        }`}
                      >
                        <MapPin className="w-4 h-4" />
                        {location.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200">
                <button
                  onClick={() => navigateTo("/Orders")}
                  className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-orange-600 transition-all duration-200"
                >
                  Order Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigateTo(item.path)}
                className={`flex flex-col items-center justify-center transition-colors relative ${
                  active ? "text-red-600" : "text-gray-900 hover:text-red-600"
                }`}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />

                <span className="text-[10px] sm:text-xs font-medium mt-1">
                  {item.label}
                </span>

                {item.badge && cartItemsCount > 0 && (
                  <span className="absolute -top-1 right-1/4 bg-red-500 text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                    {cartItemsCount > 9 ? "9+" : cartItemsCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-16 lg:hidden" />

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }

        @media (min-width: 480px) {
          .xs\\:inline {
            display: inline;
          }

          .xs\\:block {
            display: block;
          }

          .xs\\:flex {
            display: flex;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;