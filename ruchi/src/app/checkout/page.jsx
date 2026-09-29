"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiShoppingCart,
  FiMapPin,
  FiCreditCard,
  FiCheckCircle,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiTruck,
  FiPhone,
  FiUser,
  FiArrowLeft,
  FiArrowRight,
  FiAlertCircle,
  FiTag,
  FiGift,
  FiNavigation,
  FiCompass,
  FiLoader,
  FiMap,
  FiX,
  FiHome as FiHomeIcon,
  FiBookmark,
} from "react-icons/fi";
import { FaMoneyBillWave } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getMediaUrl, hideBrokenImage } from "../utils/media";

const steps = ["Cart Review", "Delivery Details", "Payment", "Confirmation"];

const formatINR = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));
};

const cleanAddressParts = (parts) => {
  const cleaned = [];

  parts.forEach((part) => {
    if (!part) return;

    const value = String(part).trim();
    if (!value) return;

    const exists = cleaned.some(
      (item) => item.toLowerCase() === value.toLowerCase()
    );

    if (!exists) cleaned.push(value);
  });

  return cleaned;
};

const getBestColonyName = (address, displayName = "") => {
  const colony =
    address.neighbourhood ||
    address.residential ||
    address.suburb ||
    address.quarter ||
    address.locality ||
    address.hamlet ||
    address.village ||
    "";

  if (colony) return colony;

  const firstPart = displayName.split(",")[0]?.trim();

  if (
    firstPart &&
    !["adilabad", "telangana", "india"].includes(firstPart.toLowerCase())
  ) {
    return firstPart;
  }

  return "";
};

const MapSelectionModal = ({ isOpen, onClose, onSelectLocation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const searchPlaces = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&addressdetails=1&limit=10&countrycodes=in`,
        {
          headers: { "User-Agent": "RuchiBazaar/1.0" },
        }
      );

      const data = await response.json();
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error searching places:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onSelectLocation(
        selectedLocation.display_name,
        selectedLocation.lat,
        selectedLocation.lon
      );
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <FiMap className="text-xl" />
            Select Location on Map
          </h3>

          <button onClick={onClose} className="text-white/80 hover:text-white">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchPlaces()}
                placeholder="Search for area, street, or landmark..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
              />

              <button
                onClick={searchPlaces}
                disabled={isSearching}
                className="px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:shadow-md transition-all disabled:opacity-50"
              >
                {isSearching ? (
                  <FiLoader className="w-5 h-5 animate-spin" />
                ) : (
                  "Search"
                )}
              </button>
            </div>
          </div>

          {searchResults.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Search Results:
              </p>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <div
                    key={result.place_id || index}
                    onClick={() => setSelectedLocation(result)}
                    className={`p-3 rounded-xl cursor-pointer transition-all ${
                      selectedLocation?.place_id === result.place_id
                        ? "bg-orange-50 border-2 border-orange-500"
                        : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <FiMapPin className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />

                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {result.display_name?.split(",")[0]}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {result.display_name}
                        </p>
                      </div>

                      {selectedLocation?.place_id === result.place_id && (
                        <FiCheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-8 text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiMap className="w-10 h-10 text-orange-500" />
            </div>
            <p className="text-gray-600 text-sm">
              Search for your location above
              <br />
              Click on a result to select it
            </p>
            <p className="text-xs text-gray-400 mt-2">Powered by OpenStreetMap</p>
          </div>
        </div>

        <div className="border-t border-gray-200 p-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirmLocation}
            disabled={!selectedLocation}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:shadow-md transition-all disabled:opacity-50"
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
};

const CheckoutPage = () => {
  const router = useRouter();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);

  const [cartItems, setCartItems] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([]);

  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState(false);
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [availableOffers, setAvailableOffers] = useState([]);
  const [showOffers, setShowOffers] = useState(false);

  const [deliveryDetails, setDeliveryDetails] = useState({
    houseNo: "",
    landmark: "",
    streetAddress: "",
    finalAddress: "",
    contactNumber: "",
    contactName: "",
    colonyName: "",
    areaName: "",
    cityName: "",
    stateName: "",
    pincode: "",
    latitude: null,
    longitude: null,
  });

  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [locationSuccess, setLocationSuccess] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
    upiId: "",
  });

  const [validationErrors, setValidationErrors] = useState({});

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  };

  const getCartId = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("cartId");
    }
    return null;
  };

  const getUserData = () => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (user) {
        try {
          return JSON.parse(user);
        } catch {
          return null;
        }
      }
    }
    return null;
  };

  const fillAddressFromSaved = (address) => {
    setDeliveryDetails((prev) => ({
      ...prev,
      houseNo: "",
      landmark: address.landmark || "",
      streetAddress: address.street || "",
      finalAddress: cleanAddressParts([
        address.street,
        address.landmark ? `Landmark: ${address.landmark}` : "",
        address.city,
        address.state,
        address.zipCode,
      ]).join(", "),
      contactNumber: address.phone || prev.contactNumber,
      contactName: address.contactName || prev.contactName,
      colonyName: address.landmark || "",
      areaName: "",
      cityName: address.city || "",
      stateName: address.state || "",
      pincode: address.zipCode || "",
      latitude: address.latitude || null,
      longitude: address.longitude || null,
    }));

    setValidationErrors((prev) => ({
      ...prev,
      streetAddress: "",
      contactName: "",
      contactNumber: "",
    }));
  };

  const fetchSavedAddresses = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await fetch(`${apiUrl}/users/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) return;

      const data = await response.json();
      const list = Array.isArray(data) ? data : data.addresses || [];
      setSavedAddresses(list);

      const defaultAddress = list.find((address) => address.isDefault) || list[0];
      if (defaultAddress) fillAddressFromSaved(defaultAddress);
    } catch (err) {
      console.error("Error loading saved addresses:", err);
    }
  };

  const getItemPrice = (item) => {
    return Number(item?.dish?.price ?? item?.price ?? 0);
  };

  const combineAddress = () => {
    return cleanAddressParts([
      deliveryDetails.houseNo,
      deliveryDetails.streetAddress,
      deliveryDetails.landmark ? `Landmark: ${deliveryDetails.landmark}` : "",
      deliveryDetails.colonyName,
      deliveryDetails.areaName,
      deliveryDetails.cityName,
      deliveryDetails.stateName,
      deliveryDetails.pincode,
    ]).join(", ");
  };

  useEffect(() => {
    const combined = combineAddress();

    setDeliveryDetails((prev) => {
      if (prev.finalAddress === combined) return prev;
      return {
        ...prev,
        finalAddress: combined,
      };
    });
  }, [
    deliveryDetails.houseNo,
    deliveryDetails.landmark,
    deliveryDetails.streetAddress,
    deliveryDetails.colonyName,
    deliveryDetails.areaName,
    deliveryDetails.cityName,
    deliveryDetails.stateName,
    deliveryDetails.pincode,
  ]);

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&namedetails=1&extratags=1`,
        {
          headers: {
            "User-Agent": "RuchiBazaar/1.0",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to get address");

      const data = await response.json();
      console.log("LOCATION DATA:", data);

      if (!data?.address) return null;

      const address = data.address;

      const houseNo = address.house_number || "";

      const road =
        address.road ||
        address.street ||
        address.pedestrian ||
        address.footway ||
        "";

      const colonyName = getBestColonyName(address, data.display_name);

      const areaName =
        address.city_district ||
        address.county ||
        address.state_district ||
        "";

      const cityName =
        address.city ||
        address.town ||
        address.municipality ||
        address.village ||
        address.district ||
        "Adilabad";

      const stateName = address.state || "Telangana";
      const pincode = address.postcode || "";

      const streetAddress = cleanAddressParts([houseNo, road, colonyName]).join(
        ", "
      );

      const finalAddress = cleanAddressParts([
        houseNo,
        road,
        colonyName || areaName,
        cityName,
        stateName,
        pincode,
      ]).join(", ");

      setDeliveryDetails((prev) => ({
        ...prev,
        houseNo: houseNo || prev.houseNo,
        streetAddress: streetAddress || colonyName || prev.streetAddress,
        landmark: colonyName || prev.landmark,
        colonyName,
        areaName,
        cityName,
        stateName,
        pincode,
        latitude: lat,
        longitude: lng,
        finalAddress: finalAddress || data.display_name || prev.finalAddress,
      }));

      return {
        houseNo,
        streetAddress,
        landmark: colonyName,
        colony: colonyName,
        area: areaName,
        city: cityName,
        state: stateName,
        pincode,
        fullAddress: finalAddress || data.display_name,
      };
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      return null;
    }
  };

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    setLocationError("");
    setLocationSuccess(false);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsLoadingLocation(false);
      return;
    }

    const loadingTimeout = setTimeout(() => {
      setLocationError("Still fetching your location... Please wait or enter manually");
    }, 8000);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        clearTimeout(loadingTimeout);
        const { latitude, longitude } = position.coords;

        try {
          const detailedAddress = await reverseGeocode(latitude, longitude);

          if (detailedAddress) {
            setLocationError("");
            setLocationSuccess(true);
            setTimeout(() => setLocationSuccess(false), 3000);

            setValidationErrors((prev) => ({
              ...prev,
              streetAddress: "",
            }));
          } else {
            setLocationError(
              "Could not get detailed address. Please enter manually."
            );
          }
        } catch (err) {
          setLocationError(
            "Could not get your complete address. Please check and edit manually."
          );
          console.error("Location processing error:", err);
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (geoError) => {
        clearTimeout(loadingTimeout);
        let message = "Unable to get your location. ";

        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            message +=
              "Please allow location access in your browser settings and try again.";
            break;
          case geoError.POSITION_UNAVAILABLE:
            message +=
              "Location information is unavailable. Please check your GPS/internet connection.";
            break;
          case geoError.TIMEOUT:
            message +=
              "Location request timed out. Please try again or enter manually.";
            break;
          default:
            message += "Please enter your address manually.";
        }

        setLocationError(message);
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }
    );
  };

  const handleMapLocationSelect = (address, lat, lon) => {
    if (lat && lon) {
      reverseGeocode(lat, lon);
    } else {
      const addressParts = address.split(",");
      const streetAddress = addressParts.slice(0, 2).join(",").trim();

      setDeliveryDetails((prev) => ({
        ...prev,
        streetAddress: streetAddress || address,
      }));
    }

    setValidationErrors((prev) => ({
      ...prev,
      streetAddress: "",
    }));
  };

  const loadPromoCode = () => {
    const savedPromo = sessionStorage.getItem("appliedPromo");
    const savedDiscount = sessionStorage.getItem("promoDiscount");

    if (savedPromo && savedDiscount) {
      try {
        setAppliedPromo(JSON.parse(savedPromo));
        setPromoDiscount(Number(savedDiscount || 0));
      } catch (e) {
        console.error("Error loading promo code:", e);
      }
    }
  };

  const savePromoCode = (promo, discount) => {
    if (promo && discount) {
      sessionStorage.setItem("appliedPromo", JSON.stringify(promo));
      sessionStorage.setItem("promoDiscount", String(discount));
    } else {
      sessionStorage.removeItem("appliedPromo");
      sessionStorage.removeItem("promoDiscount");
    }
  };

  const fetchAvailableOffers = async () => {
    try {
      const response = await fetch(`${apiUrl}/offers`);

      if (response.ok) {
        const result = await response.json();
        setAvailableOffers(Array.isArray(result.data) ? result.data : []);
      }
    } catch (err) {
      console.error("Error fetching offers:", err);
    }
  };

  const fetchCart = async () => {
    try {
      const cartId = getCartId();

      if (!cartId) {
        setCartItems([]);
        setInitialLoading(false);
        return;
      }

      const response = await fetch(`${apiUrl}/Cart/${cartId}`);

      if (!response.ok) throw new Error("Failed to fetch cart");

      const data = await response.json();

      setCartItems(
        Array.isArray(data.items) ? data.items : Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError("Failed to load cart items");
      setCartItems([]);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    loadPromoCode();
    fetchAvailableOffers();

    const user = getUserData();

    if (user) {
      setDeliveryDetails((prev) => ({
        ...prev,
        contactName: user.name || "",
        contactNumber: user.phone || "",
      }));
    }

    fetchSavedAddresses();
    fetchCart();
  }, []);

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const response = await fetch(`${apiUrl}/Cart/update/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) throw new Error("Failed to update quantity");

      await fetchCart();

      if (appliedPromo) {
        setAppliedPromo(null);
        setPromoDiscount(0);
        savePromoCode(null, null);
      }

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Error updating quantity:", err);
      setError("Failed to update cart");
    }
  };

  const removeItem = async (itemId) => {
    try {
      const response = await fetch(`${apiUrl}/Cart/delete/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to remove item");

      await fetchCart();

      if (appliedPromo) {
        setAppliedPromo(null);
        setPromoDiscount(0);
        savePromoCode(null, null);
      }

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Error removing item:", err);
      setError("Failed to remove item");
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + getItemPrice(item) * Number(item.quantity || 1);
    }, 0);
  };

  const calculateTax = (value) => {
    return Math.max(value, 0) * 0.05;
  };

  const calculateDeliveryFee = (value) => {
    return value > 500 ? 0 : 40;
  };

  const subtotal = calculateSubtotal();
  const deliveryFee = calculateDeliveryFee(subtotal);
  const tax = calculateTax(subtotal - promoDiscount);
  const total = Math.max(subtotal + deliveryFee + tax - promoDiscount, 0);

  const validatePromoCode = (code) => {
    const offer = availableOffers.find(
      (o) => o.couponCode?.toUpperCase() === code.toUpperCase()
    );

    if (!offer) return { valid: false, message: "Invalid promo code" };
    if (!offer.isActive) return { valid: false, message: "This promo code has expired" };

    const now = new Date();

    if (offer.validFrom && now < new Date(offer.validFrom)) {
      return { valid: false, message: "This offer has not started yet" };
    }

    if (offer.validTo && now > new Date(offer.validTo)) {
      return { valid: false, message: "This offer has expired" };
    }

    if (offer.minOrderAmount && subtotal < Number(offer.minOrderAmount)) {
      return {
        valid: false,
        message: `Minimum order amount of ${formatINR(
          offer.minOrderAmount
        )} required`,
      };
    }

    let discount = (subtotal * Number(offer.discountPercent || 0)) / 100;

    if (offer.maxDiscount && discount > Number(offer.maxDiscount)) {
      discount = Number(offer.maxDiscount);
    }

    return {
      valid: true,
      discount,
      offer,
      message: `Promo code applied! ${offer.discountPercent}% OFF`,
    };
  };

  const applyPromoCode = (directCode = null) => {
    setPromoError("");

    const code = directCode || promoCodeInput;

    if (!code.trim()) {
      setPromoError("Please enter a promo code");
      return;
    }

    const validation = validatePromoCode(code);

    if (validation.valid) {
      setPromoDiscount(Number(validation.discount || 0));
      setAppliedPromo(validation.offer);
      setPromoSuccess(true);
      setPromoError("");
      setShowPromoInput(false);
      setPromoCodeInput("");

      savePromoCode(validation.offer, Number(validation.discount || 0));
      setTimeout(() => setPromoSuccess(false), 3000);
    } else {
      setPromoError(validation.message);
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoDiscount(0);
    savePromoCode(null, null);
  };

  const handleDeliveryChange = (e) => {
    const { name, value } = e.target;

    setDeliveryDetails((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePaymentChange = (e) => {
    setPaymentDetails({
      ...paymentDetails,
      [e.target.name]: e.target.value,
    });
  };

  const validateDeliveryDetails = () => {
    const errors = {};

    if (!deliveryDetails.streetAddress) {
      errors.streetAddress = "Street address is required";
    }

    if (!deliveryDetails.contactNumber) {
      errors.contactNumber = "Contact number is required";
    }

    if (!deliveryDetails.contactName) {
      errors.contactName = "Contact name is required";
    }

    if (
      deliveryDetails.contactNumber &&
      !/^[6-9]\d{9}$/.test(deliveryDetails.contactNumber)
    ) {
      errors.contactNumber = "Please enter a valid 10-digit Indian mobile number";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePaymentDetails = () => {
    if (paymentMethod === "card" || paymentMethod === "debit") {
      const errors = {};

      if (!paymentDetails.cardNumber) errors.cardNumber = "Card number is required";
      if (!paymentDetails.cardName) errors.cardName = "Name on card is required";
      if (!paymentDetails.expiry) errors.expiry = "Expiry date is required";
      if (!paymentDetails.cvv) errors.cvv = "CVV is required";

      if (
        paymentDetails.cardNumber &&
        !/^\d{16}$/.test(paymentDetails.cardNumber.replace(/\s/g, ""))
      ) {
        errors.cardNumber = "Please enter a valid 16-digit card number";
      }

      if (
        paymentDetails.expiry &&
        !/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(paymentDetails.expiry)
      ) {
        errors.expiry = "Please enter a valid expiry date (MM/YY)";
      }

      if (paymentDetails.cvv && !/^\d{3}$/.test(paymentDetails.cvv)) {
        errors.cvv = "Please enter a valid 3-digit CVV";
      }

      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
    }

    if (paymentMethod === "upi") {
      if (!paymentDetails.upiId) {
        setValidationErrors({ upiId: "UPI ID is required" });
        return false;
      }

      if (!/^[\w.-]+@[\w.-]+$/.test(paymentDetails.upiId)) {
        setValidationErrors({ upiId: "Please enter a valid UPI ID" });
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    setError("");

    if (activeStep === 0) {
      if (cartItems.length === 0) {
        setError("Your cart is empty");
        return;
      }
      setActiveStep(1);
      return;
    }

    if (activeStep === 1) {
      if (!validateDeliveryDetails()) {
        setError("Please fill in all required delivery details");
        return;
      }
      setActiveStep(2);
      return;
    }

    if (activeStep === 2) {
      if (!validatePaymentDetails()) {
        setError("Please fill in all payment details correctly");
        return;
      }
      handlePlaceOrder();
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
    setError("");
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError("");

    try {
      const restaurantId = cartItems[0]?.dish?.restaurantId || cartItems[0]?.restaurantId;

      if (!restaurantId) throw new Error("Restaurant information missing");

      const token = getAuthToken();

      const items = cartItems.map((item) => ({
        dishId: item.dishId,
        quantity: Number(item.quantity || 1),
        price: getItemPrice(item),
      }));

      const orderData = {
        items,
        restaurantId,
        deliveryAddress: deliveryDetails.finalAddress || combineAddress(),
        couponCode: appliedPromo?.couponCode || null,
        latitude: deliveryDetails.latitude,
        longitude: deliveryDetails.longitude,
        savedAddress: {
          type: "home",
          street: deliveryDetails.finalAddress || combineAddress(),
          city: deliveryDetails.cityName,
          state: deliveryDetails.stateName,
          zipCode: deliveryDetails.pincode,
          landmark: deliveryDetails.landmark || deliveryDetails.colonyName,
          phone: deliveryDetails.contactNumber,
          contactName: deliveryDetails.contactName,
        },
      };

      const response = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(orderData),
      });

      const responseText = await response.text();

      if (!response.ok) {
        let errorMessage = "Failed to place order";

        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = responseText || `Server responded with ${response.status}`;
        }

        throw new Error(errorMessage);
      }

      const order = JSON.parse(responseText);

      setCreatedOrder(order.order || order);
      setOrderSuccess(true);
      setActiveStep(3);

      localStorage.removeItem("cartId");
      savePromoCode(null, null);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Error placing order:", err);
      setError(err.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading checkout...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const renderCartReview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <FiShoppingCart className="text-xl" />
              Review Your Items
            </h3>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-12 px-6">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShoppingCart className="text-3xl text-gray-400" />
              </div>

              <p className="text-gray-500">Your cart is empty</p>

              <button
                onClick={() => router.push("/")}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Browse Restaurants
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {cartItems.map((item) => {
                const price = getItemPrice(item);
                const quantity = Number(item.quantity || 1);

                return (
                  <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="w-20 h-20 flex-shrink-0 relative rounded-xl overflow-hidden shadow-md">
                        {item.dish?.image ? (
                          <img
                            src={getMediaUrl(item.dish.image, apiUrl)}
                            alt={item.dish?.name || "Dish"}
                            className="w-full h-full object-cover"
                            onError={hideBrokenImage}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">🍽️</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-grow">
                        <h4 className="font-semibold text-gray-800 text-lg">
                          {item.dish?.name || "Unknown Dish"}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatINR(price)} each
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
                          onClick={() => updateQuantity(item.id, quantity - 1)}
                          disabled={quantity <= 1}
                        >
                          <FiMinus className="text-gray-600" />
                        </button>

                        <span className="w-8 text-center font-semibold">{quantity}</span>

                        <button
                          className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center hover:shadow-md transition-all"
                          onClick={() => updateQuantity(item.id, quantity + 1)}
                        >
                          <FiPlus className="text-white" />
                        </button>
                      </div>

                      <div className="text-right min-w-[100px]">
                        <span className="font-bold text-orange-600 text-lg">
                          {formatINR(price * quantity)}
                        </span>
                      </div>

                      <button
                        className="text-red-400 hover:text-red-600 p-2 transition-colors"
                        onClick={() => removeItem(item.id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-lg sticky top-24 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
            <h3 className="text-lg font-semibold text-white">Order Summary</h3>
          </div>

          <div className="p-6">
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">{formatINR(subtotal)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span className="flex items-center gap-1">
                  <FiTruck className="text-gray-400" />
                  Delivery Fee
                </span>
                {deliveryFee === 0 ? (
                  <span className="text-green-600 font-medium">FREE</span>
                ) : (
                  <span>{formatINR(deliveryFee)}</span>
                )}
              </div>

              <div className="flex justify-between text-gray-600">
                <span>GST (5%)</span>
                <span>{formatINR(tax)}</span>
              </div>

              {appliedPromo && promoDiscount > 0 && (
                <div className="flex justify-between text-green-600 pt-2 border-t border-gray-200">
                  <span className="flex items-center gap-1">
                    <FiTag className="text-green-500" />
                    Discount ({appliedPromo.discountPercent}% OFF)
                  </span>
                  <span>-{formatINR(promoDiscount)}</span>
                </div>
              )}
            </div>

            {subtotal < 500 && subtotal > 0 && (
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-3 mb-4">
                <p className="text-sm text-orange-700 flex items-center gap-2">
                  <FiAlertCircle className="flex-shrink-0" />
                  Add {formatINR(500 - subtotal)} more for FREE delivery
                </p>
              </div>
            )}

            {!appliedPromo ? (
              <div className="mb-4">
                {showPromoInput ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter promo code"
                        value={promoCodeInput}
                        onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
                      />

                      <button
                        onClick={() => applyPromoCode()}
                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm rounded-lg hover:shadow-md transition-all"
                      >
                        Apply
                      </button>
                    </div>

                    {promoError && <p className="text-xs text-red-500">{promoError}</p>}

                    <button
                      onClick={() => setShowPromoInput(false)}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowPromoInput(true)}
                      className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
                    >
                      <FiTag className="w-4 h-4" />
                      Have a promo code?
                    </button>

                    {availableOffers.length > 0 && (
                      <button
                        onClick={() => setShowOffers(!showOffers)}
                        className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
                      >
                        <FiGift className="w-4 h-4" />
                        View Available Offers ({availableOffers.length})
                      </button>
                    )}
                  </div>
                )}

                {showOffers && !appliedPromo && (
                  <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Available Offers:</p>

                    {availableOffers.filter((o) => o.isActive).map((offer) => (
                      <div
                        key={offer.id}
                        className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-800">{offer.title}</p>
                            <p className="text-xs text-orange-600 font-medium">
                              {offer.discountPercent}% OFF
                            </p>
                            <p className="text-xs text-gray-500">
                              Min order: {formatINR(offer.minOrderAmount || 199)}
                            </p>
                          </div>

                          <button
                            onClick={() => applyPromoCode(offer.couponCode)}
                            className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-lg hover:shadow-md transition-all"
                          >
                            Apply
                          </button>
                        </div>

                        <p className="text-xs text-gray-400 mt-1">Code: {offer.couponCode}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-green-700 flex items-center gap-1">
                    <FiCheckCircle className="text-green-600" />
                    {appliedPromo.title || "Promo"} applied!
                  </span>
                  <p className="text-xs text-green-600">Code: {appliedPromo.couponCode}</p>
                </div>

                <button onClick={removePromoCode} className="text-green-700 hover:text-green-800">
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-800 text-lg">Total</span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-orange-600">
                    {formatINR(total)}
                  </span>

                  {appliedPromo && (
                    <p className="text-xs text-green-600">
                      You saved {formatINR(promoDiscount)}
                    </p>
                  )}
                </div>
              </div>

              <p className="text-xs text-gray-500">Including all taxes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDeliveryDetails = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <FiMapPin className="text-xl" />
              Delivery Address
            </h3>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={getCurrentLocation}
                disabled={isLoadingLocation}
                className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium hover:bg-white/30 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isLoadingLocation ? (
                  <>
                    <FiLoader className="w-4 h-4 animate-spin" />
                    Getting Location...
                  </>
                ) : (
                  <>
                    <FiNavigation className="w-4 h-4" />
                    Use Current Location
                  </>
                )}
              </button>

              <button
                onClick={() => setShowMapModal(true)}
                className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium hover:bg-white/30 transition-all flex items-center gap-2"
              >
                <FiMap className="w-4 h-4" />
                Select on Map
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {locationError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-red-600 text-sm">
              <FiAlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p>{locationError}</p>
                {locationError.includes("allow location access") && (
                  <button
                    onClick={() => {
                      alert(
                        "Please check your browser settings to enable location access.\n\nChrome: Settings > Privacy and security > Site settings > Location"
                      );
                    }}
                    className="text-xs underline mt-1"
                  >
                    How to enable location?
                  </button>
                )}
              </div>
            </div>
          )}

          {locationSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-center gap-2 text-sm">
              <FiCheckCircle />
              Location detected successfully. Please verify your address below.
            </div>
          )}

          {(deliveryDetails.latitude || deliveryDetails.longitude) && (
            <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700 flex items-center gap-2">
              <FiCheckCircle className="w-3 h-3" />
              Coordinates captured: {deliveryDetails.latitude}, {deliveryDetails.longitude}
            </div>
          )}

          {savedAddresses.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FiBookmark className="text-orange-500" />
                Saved address suggestions
              </p>
              <div className="grid grid-cols-1 gap-3">
                {savedAddresses.slice(0, 3).map((address) => (
                  <button
                    key={address.id}
                    type="button"
                    onClick={() => fillAddressFromSaved(address)}
                    className="text-left rounded-xl border border-orange-100 bg-orange-50/60 p-3 hover:border-orange-300 hover:bg-orange-50 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-bold text-gray-900 capitalize">
                        {address.type || "home"}
                      </span>
                      {address.isDefault && (
                        <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[11px] font-semibold text-white">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-700 line-clamp-2">{address.street}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {cleanAddressParts([address.city, address.state, address.zipCode]).join(", ")}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <FiHomeIcon className="text-orange-500" />
                House / Flat / Building Number
              </label>

              <input
                type="text"
                name="houseNo"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-black"
                value={deliveryDetails.houseNo}
                onChange={handleDeliveryChange}
                placeholder="e.g., Flat 201, Tower B"
              />
            </div>

            {deliveryDetails.colonyName && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs font-medium text-blue-700 mb-1">📍 Detected Colony/Area:</p>
                <p className="text-sm text-gray-700 font-medium">{deliveryDetails.colonyName}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <FiCompass className="text-orange-500" />
                Street Address / Road Name / Colony *
              </label>

              <input
                type="text"
                name="streetAddress"
                className={`w-full px-4 py-3 rounded-xl border ${
                  validationErrors.streetAddress ? "border-red-500" : "border-gray-200"
                } focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-black`}
                value={deliveryDetails.streetAddress}
                onChange={handleDeliveryChange}
                placeholder="e.g., Khoja Colony, Main Road"
              />

              {validationErrors.streetAddress && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.streetAddress}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <FiBookmark className="text-orange-500" />
                Landmark
              </label>

              <input
                type="text"
                name="landmark"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-black"
                value={deliveryDetails.landmark}
                onChange={handleDeliveryChange}
                placeholder="e.g., Near City Mall, Opposite Bank"
              />
            </div>

            {(deliveryDetails.areaName || deliveryDetails.cityName) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {deliveryDetails.areaName && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Area / District
                    </label>
                    <input
                      type="text"
                      value={deliveryDetails.areaName}
                      disabled
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 text-sm"
                    />
                  </div>
                )}

                {deliveryDetails.cityName && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">City</label>
                    <input
                      type="text"
                      value={deliveryDetails.cityName}
                      disabled
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 text-sm"
                    />
                  </div>
                )}
              </div>
            )}

            {(deliveryDetails.stateName || deliveryDetails.pincode) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {deliveryDetails.stateName && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">State</label>
                    <input
                      type="text"
                      value={deliveryDetails.stateName}
                      disabled
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 text-sm"
                    />
                  </div>
                )}

                {deliveryDetails.pincode && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">PIN Code</label>
                    <input
                      type="text"
                      value={deliveryDetails.pincode}
                      disabled
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 text-sm"
                    />
                  </div>
                )}
              </div>
            )}

            {deliveryDetails.finalAddress && (
              <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                <p className="text-sm font-medium text-orange-700 mb-2 flex items-center gap-2">
                  <FiCheckCircle className="w-4 h-4" />
                  Complete Address Preview:
                </p>

                <p className="text-sm text-gray-700 leading-relaxed">
                  {deliveryDetails.finalAddress}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => {
                      const newAddress = prompt(
                        "Edit address if needed:",
                        deliveryDetails.finalAddress
                      );
                      if (newAddress) {
                        setDeliveryDetails((prev) => ({
                          ...prev,
                          finalAddress: newAddress,
                          streetAddress: newAddress,
                        }));
                      }
                    }}
                    className="text-xs text-orange-600 hover:text-orange-700 underline"
                  >
                    Edit address
                  </button>

                  {deliveryDetails.latitude && deliveryDetails.longitude && (
                    <a
                      href={`https://www.google.com/maps?q=${deliveryDetails.latitude},${deliveryDetails.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-700 underline"
                    >
                      Open exact location in Google Maps
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <FiUser className="text-orange-500" />
                    Contact Name *
                  </label>

                  <input
                    type="text"
                    name="contactName"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      validationErrors.contactName ? "border-red-500" : "border-gray-200"
                    } focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-black`}
                    value={deliveryDetails.contactName}
                    onChange={handleDeliveryChange}
                    placeholder="Your full name"
                  />

                  {validationErrors.contactName && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.contactName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <FiPhone className="text-orange-500" />
                    Contact Number *
                  </label>

                  <input
                    type="tel"
                    name="contactNumber"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      validationErrors.contactNumber ? "border-red-500" : "border-gray-200"
                    } focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-black`}
                    value={deliveryDetails.contactNumber}
                    onChange={handleDeliveryChange}
                    placeholder="10-digit mobile number"
                    maxLength="10"
                  />

                  {validationErrors.contactNumber && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.contactNumber}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MapSelectionModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        onSelectLocation={handleMapLocationSelect}
      />
    </div>
  );

  const renderPayment = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <FiCreditCard className="text-xl" />
            Payment Method
          </h3>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {["card", "debit", "upi", "cash"].map((method) => (
              <label
                key={method}
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  paymentMethod === method
                    ? "border-orange-500 bg-orange-50 shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="hidden"
                />

                <div className="flex flex-col items-center gap-2">
                  {method === "cash" ? (
                    <FaMoneyBillWave
                      className={`text-2xl ${
                        paymentMethod === method ? "text-orange-500" : "text-gray-400"
                      }`}
                    />
                  ) : method === "upi" ? (
                    <span
                      className={`text-2xl font-bold ${
                        paymentMethod === method ? "text-orange-500" : "text-gray-400"
                      }`}
                    >
                      UPI
                    </span>
                  ) : (
                    <FiCreditCard
                      className={`text-2xl ${
                        paymentMethod === method ? "text-orange-500" : "text-gray-400"
                      }`}
                    />
                  )}

                  <span
                    className={`text-sm font-medium ${
                      paymentMethod === method ? "text-orange-500" : "text-gray-600"
                    }`}
                  >
                    {method === "card"
                      ? "Credit Card"
                      : method === "debit"
                      ? "Debit Card"
                      : method === "upi"
                      ? "UPI"
                      : "Cash"}
                  </span>
                </div>
              </label>
            ))}
          </div>

          {(paymentMethod === "card" || paymentMethod === "debit") && (
            <div className="space-y-4 animate-fadeIn">
              <input
                type="text"
                name="cardNumber"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                value={paymentDetails.cardNumber}
                onChange={handlePaymentChange}
                placeholder="Card Number"
                maxLength="19"
              />

              {validationErrors.cardNumber && (
                <p className="text-sm text-red-500">{validationErrors.cardNumber}</p>
              )}

              <input
                type="text"
                name="cardName"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                value={paymentDetails.cardName}
                onChange={handlePaymentChange}
                placeholder="Name on Card"
              />

              {validationErrors.cardName && (
                <p className="text-sm text-red-500">{validationErrors.cardName}</p>
              )}

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="expiry"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                  value={paymentDetails.expiry}
                  onChange={handlePaymentChange}
                  placeholder="MM/YY"
                  maxLength="5"
                />

                <input
                  type="password"
                  name="cvv"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                  value={paymentDetails.cvv}
                  onChange={handlePaymentChange}
                  placeholder="CVV"
                  maxLength="3"
                />
              </div>

              {validationErrors.expiry && (
                <p className="text-sm text-red-500">{validationErrors.expiry}</p>
              )}

              {validationErrors.cvv && (
                <p className="text-sm text-red-500">{validationErrors.cvv}</p>
              )}
            </div>
          )}

          {paymentMethod === "upi" && (
            <div className="space-y-4 animate-fadeIn">
              <input
                type="text"
                name="upiId"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                value={paymentDetails.upiId}
                onChange={handlePaymentChange}
                placeholder="username@upi"
              />

              {validationErrors.upiId && (
                <p className="text-sm text-red-500">{validationErrors.upiId}</p>
              )}
            </div>
          )}

          {paymentMethod === "cash" && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 flex items-start gap-3">
              <FaMoneyBillWave className="text-green-500 text-xl flex-shrink-0 mt-1" />
              <p className="text-sm text-green-700">
                Pay with cash when your order is delivered.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <FiCheckCircle className="text-white text-4xl" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmed! 🎉</h2>

        <p className="text-gray-600 mb-6">
          Thank you for your order. Your order has been placed successfully.
        </p>

        {createdOrder && (
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Order #{createdOrder.id}</h3>

            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full shadow-md">
              <FiTruck />
              <span className="text-sm font-medium">Preparing your order</span>
            </div>

            <p className="text-sm text-gray-600 mt-2">
              Total: {formatINR(createdOrder.totalAmount || total)}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Link href="/orders" className="block w-full">
            <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all">
              View My Orders
            </button>
          </Link>

          <Link href="/" className="block w-full">
            <button className="w-full border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );

  const getStepContent = (step) => {
    if (step === 0) return renderCartReview();
    if (step === 1) return renderDeliveryDetails();
    if (step === 2) return renderPayment();
    return renderConfirmation();
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-orange-600 mb-8">
            Checkout
          </h1>

          <div className="flex justify-between items-center mb-8 relative overflow-x-auto">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 rounded-full"></div>

            {steps.map((label, index) => (
              <div
                key={label}
                className="relative z-10 flex flex-col items-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 min-w-fit"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 transition-all ${
                    index <= activeStep
                      ? index < activeStep
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                        : "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                      : "bg-white border-2 border-gray-300 text-gray-400"
                  }`}
                >
                  {index + 1}
                </div>

                <span
                  className={`text-sm font-medium whitespace-nowrap ${
                    index <= activeStep ? "text-gray-800" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>

          {promoSuccess && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700">
              <FiCheckCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm flex-1">Promo code applied successfully!</p>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex justify-between items-center">
              <span className="flex items-center gap-2">
                <FiAlertCircle />
                {error}
              </span>

              <button className="text-red-500 hover:text-red-600" onClick={() => setError("")}>
                ×
              </button>
            </div>
          )}

          {orderSuccess ? renderConfirmation() : getStepContent(activeStep)}

          {!orderSuccess && (
            <div className="flex justify-between mt-8 max-w-2xl mx-auto">
              <button
                className="px-8 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                <FiArrowLeft className="inline mr-2" />
                Back
              </button>

              <button
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                onClick={handleNext}
                disabled={loading || cartItems.length === 0}
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Processing...
                  </>
                ) : activeStep === 2 ? (
                  "Place Order"
                ) : (
                  <>
                    Next
                    <FiArrowRight />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default CheckoutPage;
