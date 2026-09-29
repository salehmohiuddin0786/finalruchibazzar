"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext.jsx";
import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  Loader,
  X,
  Tag,
  MapPin,
  Clock,
  ChevronRight,
  AlertCircle,
  LogIn,
  User,
  Shield,
  CreditCard,
  Truck,
  Star,
  Info,
  Heart,
  ChevronDown,
  CheckCircle,
  Gift,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getMediaUrl, hideBrokenImage } from "../utils/media";

const CartPage = () => {
  const router = useRouter();
  const { isAuthenticated, user, loading: authLoading } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [savedItems, setSavedItems] = useState([]);
  const [showSavedItems, setShowSavedItems] = useState(false);
  const [quantityUpdateLoading, setQuantityUpdateLoading] = useState(null);
  const [availableOffers, setAvailableOffers] = useState([]);
  const [showOffers, setShowOffers] = useState(false);
  const [promoSuccess, setPromoSuccess] = useState(false);
  const [promoError, setPromoError] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const currencySymbol = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₹";

  const getCartId = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("cartId");
    }
    return null;
  };

  const getItemPrice = (item) => {
    return Number(item?.dish?.price ?? item?.price ?? 0);
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/Cart");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const now = new Date();
    const deliveryTime = new Date(now.getTime() + 45 * 60000);
    setEstimatedDelivery(
      deliveryTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }, []);

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
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");

      const response = await fetch(`${apiUrl}/Cart/${cartId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }

      const data = await response.json();

      setCartItems(
        Array.isArray(data.items)
          ? data.items
          : Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError(err.message);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedItems = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${apiUrl}/Cart/saved-items`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSavedItems(
          Array.isArray(data.items)
            ? data.items
            : Array.isArray(data)
            ? data
            : []
        );
      }
    } catch (err) {
      console.error("Failed to fetch saved items:", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchSavedItems();
      fetchAvailableOffers();
    } else {
      fetchCart();
    }
  }, [isAuthenticated]);

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setQuantityUpdateLoading(itemId);
    setUpdating(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${apiUrl}/Cart/update/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      await fetchCart();

      if (promoApplied) {
        setPromoApplied(false);
        setPromoDiscount(0);
        setAppliedPromo(null);

        if (typeof window !== "undefined") {
          sessionStorage.removeItem("appliedPromo");
          sessionStorage.removeItem("promoDiscount");
        }
      }

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Error updating quantity:", err);
      setError("Failed to update cart");
    } finally {
      setUpdating(false);
      setQuantityUpdateLoading(null);
    }
  };

  const removeItem = async (itemId) => {
    setUpdating(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${apiUrl}/Cart/delete/${itemId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        throw new Error("Failed to remove item");
      }

      await fetchCart();

      if (promoApplied) {
        setPromoApplied(false);
        setPromoDiscount(0);
        setAppliedPromo(null);

        if (typeof window !== "undefined") {
          sessionStorage.removeItem("appliedPromo");
          sessionStorage.removeItem("promoDiscount");
        }
      }

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Error removing item:", err);
      setError("Failed to remove item");
    } finally {
      setUpdating(false);
    }
  };

  const saveForLater = async (item) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${apiUrl}/Cart/save-for-later`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ itemId: item.id }),
      });

      if (response.ok) {
        await removeItem(item.id);
        await fetchSavedItems();
      }
    } catch (err) {
      console.error("Failed to save item:", err);
    }
  };

  const moveToCart = async (savedItem) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${apiUrl}/Cart/move-to-cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ savedItemId: savedItem.id }),
      });

      if (response.ok) {
        await fetchCart();
        await fetchSavedItems();
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (err) {
      console.error("Failed to move item:", err);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + getItemPrice(item) * Number(item.quantity || 1);
    }, 0);
  };

  const calculateTax = (value) => value * 0.05;

  const calculateDeliveryFee = (value) => (value > 500 ? 0 : 40);

  const subtotal = calculateSubtotal();
  const deliveryFee = calculateDeliveryFee(subtotal);
  const tax = calculateTax(Math.max(subtotal - promoDiscount, 0));
  const total = Math.max(subtotal + deliveryFee + tax - promoDiscount, 0);

  const itemCount = cartItems.reduce(
    (count, item) => count + Number(item.quantity || 0),
    0
  );

  const getMinOrderValue = (title) => {
    const titleLower = title?.toLowerCase() || "";
    if (titleLower.includes("grocery")) return 499;
    if (titleLower.includes("restaurant")) return 299;
    return 199;
  };

  const getMaxDiscountAmount = (discountPercent) => {
    const discount = Number(discountPercent);
    if (discount >= 50) return 500;
    if (discount >= 30) return 300;
    if (discount >= 20) return 200;
    return 100;
  };

  const validatePromoCode = (code) => {
    const offer = availableOffers.find(
      (o) => o.couponCode?.toUpperCase() === code.toUpperCase()
    );

    if (!offer) {
      return { valid: false, message: "Invalid promo code" };
    }

    if (!offer.isActive) {
      return { valid: false, message: "This promo code has expired" };
    }

    const now = new Date();

    if (offer.validFrom && now < new Date(offer.validFrom)) {
      return { valid: false, message: "This offer has not started yet" };
    }

    if (offer.validTo && now > new Date(offer.validTo)) {
      return { valid: false, message: "This offer has expired" };
    }

    const minOrderValue = Number(
      offer.minOrderAmount || getMinOrderValue(offer.title)
    );

    if (subtotal < minOrderValue) {
      return {
        valid: false,
        message: `Minimum order amount of ${currencySymbol}${minOrderValue} required for this promo`,
      };
    }

    let discount = 0;

    if (offer.discountPercent) {
      discount = (subtotal * Number(offer.discountPercent)) / 100;

      const maxDiscount = Number(
        offer.maxDiscount || getMaxDiscountAmount(offer.discountPercent)
      );

      if (maxDiscount && discount > maxDiscount) {
        discount = maxDiscount;
      }
    }

    return {
      valid: true,
      discount,
      offer,
      message: `Promo code applied! ${offer.discountPercent}% OFF`,
    };
  };

  const applyPromoCode = () => {
    setPromoError("");

    if (!promoCode.trim()) {
      setPromoError("Please enter a promo code");
      return;
    }

    const validation = validatePromoCode(promoCode);

    if (validation.valid) {
      setPromoDiscount(Number(validation.discount || 0));
      setPromoApplied(true);
      setAppliedPromo(validation.offer);
      setPromoSuccess(true);
      setPromoError("");
      setShowPromoInput(false);

      sessionStorage.setItem("appliedPromo", JSON.stringify(validation.offer));
      sessionStorage.setItem(
        "promoDiscount",
        String(Number(validation.discount || 0))
      );
      sessionStorage.setItem("promoCode", validation.offer.couponCode);

      setTimeout(() => setPromoSuccess(false), 3000);
    } else {
      setPromoError(validation.message);
      setPromoApplied(false);
      setPromoDiscount(0);
      setAppliedPromo(null);
    }
  };

  const removePromoCode = () => {
    setPromoApplied(false);
    setPromoDiscount(0);
    setAppliedPromo(null);
    setPromoCode("");
    setPromoError("");

    sessionStorage.removeItem("appliedPromo");
    sessionStorage.removeItem("promoDiscount");
    sessionStorage.removeItem("promoCode");
  };

  const quickApplyOffer = (offer) => {
    const validation = validatePromoCode(offer.couponCode);

    if (validation.valid) {
      setPromoDiscount(Number(validation.discount || 0));
      setPromoApplied(true);
      setAppliedPromo(offer);
      setPromoSuccess(true);
      setPromoError("");
      setShowOffers(false);

      sessionStorage.setItem("appliedPromo", JSON.stringify(offer));
      sessionStorage.setItem(
        "promoDiscount",
        String(Number(validation.discount || 0))
      );
      sessionStorage.setItem("promoCode", offer.couponCode);

      setTimeout(() => setPromoSuccess(false), 3000);
    } else {
      setPromoError(validation.message);
    }
  };

  const proceedToCheckout = () => {
    sessionStorage.setItem("checkoutCartItems", JSON.stringify(cartItems));
    sessionStorage.setItem("checkoutSubtotal", subtotal.toString());
    sessionStorage.setItem("checkoutTotal", total.toString());

    if (promoApplied && appliedPromo) {
      sessionStorage.setItem("checkoutPromoCode", appliedPromo.couponCode);
      sessionStorage.setItem(
        "checkoutPromoDiscount",
        promoDiscount.toString()
      );
    }

    router.push("/checkout");
  };

  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your cart...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogIn className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Login Required
            </h2>
            <p className="text-gray-600 mb-8">
              Please log in to view your cart and proceed with checkout
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push("/login?redirect=/Cart")}
                className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-xl"
              >
                Log In
              </button>
              <button
                onClick={() => router.push("/register?redirect=/Cart")}
                className="w-full py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Back</span>
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
                  Your Cart
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-2">
                  {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
                </p>
              </div>

              {user && (
                <div className="flex items-center gap-2 bg-white px-3 sm:px-4 py-2 rounded-lg shadow-sm">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                  <span className="text-xs sm:text-sm text-gray-600">
                    {user.name || user.email}
                  </span>
                </div>
              )}
            </div>
          </div>

          {promoSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm flex-1">
                Promo code applied successfully! You saved {currencySymbol}
                {promoDiscount.toFixed(2)}.
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm flex-1">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto hover:bg-red-100 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {cartItems.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <ShoppingCart className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                Your cart is empty
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto">
                Looks like you haven&apos;t added anything to your cart yet.
              </p>

              {savedItems.length > 0 && (
                <div className="mb-6">
                  <button
                    onClick={() => setShowSavedItems(!showSavedItems)}
                    className="flex items-center justify-center gap-2 text-purple-600 hover:text-purple-700 mx-auto"
                  >
                    <Heart className="w-4 h-4" />
                    <span>You have {savedItems.length} saved items</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        showSavedItems ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
              )}

              <button
                onClick={() => router.push("/")}
                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-xl inline-flex items-center gap-2 text-sm sm:text-base"
              >
                Browse Restaurants
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
              <div className="flex-1 space-y-4 sm:space-y-6">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="p-4 sm:p-6 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800">
                      Cart Items ({itemCount})
                    </h3>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {cartItems.map((item) => {
                      const price = getItemPrice(item);
                      const itemTotal = price * Number(item.quantity || 1);

                      return (
                        <div key={item.id} className="p-4 sm:p-6">
                          <div className="flex flex-col xs:flex-row gap-4">
                            <div className="w-full xs:w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              {item.dish?.image ? (
                                <img
                                  src={getMediaUrl(item.dish.image, apiUrl)}
                                  alt={item.dish?.name || "Dish"}
                                  className="w-full h-full object-cover"
                                  onError={hideBrokenImage}
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                  <span className="text-gray-400 text-2xl">
                                    🍽️
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                                <div>
                                  <h4 className="font-semibold text-gray-900 text-base sm:text-lg">
                                    {item.dish?.name || "Unknown Dish"}
                                  </h4>
                                  <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">
                                    {item.dish?.description || "Delicious dish"}
                                  </p>
                                </div>

                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="p-2 hover:bg-red-50 rounded-full transition-colors group self-start sm:self-center"
                                  disabled={updating}
                                >
                                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-red-500" />
                                </button>
                              </div>

                              <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 mt-4">
                                <div className="flex items-baseline gap-1">
                                  <span className="text-lg sm:text-xl font-bold text-gray-900">
                                    {currencySymbol}
                                    {price.toFixed(2)}
                                  </span>
                                  <span className="text-xs sm:text-sm text-gray-500">
                                    each
                                  </span>
                                </div>

                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() =>
                                      updateQuantity(
                                        item.id,
                                        Number(item.quantity || 1) - 1
                                      )
                                    }
                                    className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center disabled:opacity-50"
                                    disabled={updating || item.quantity <= 1}
                                  >
                                    <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
                                  </button>

                                  <span className="font-semibold w-8 text-center text-sm sm:text-base">
                                    {quantityUpdateLoading === item.id ? (
                                      <Loader className="w-4 h-4 animate-spin mx-auto" />
                                    ) : (
                                      item.quantity
                                    )}
                                  </span>

                                  <button
                                    onClick={() =>
                                      updateQuantity(
                                        item.id,
                                        Number(item.quantity || 1) + 1
                                      )
                                    }
                                    className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center disabled:opacity-50"
                                    disabled={updating}
                                  >
                                    <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                  </button>
                                </div>
                              </div>

                              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                                <span className="text-xs sm:text-sm text-gray-500">
                                  Item total
                                </span>
                                <span className="font-semibold text-red-500 text-sm sm:text-base">
                                  {currencySymbol}
                                  {itemTotal.toFixed(2)}
                                </span>
                              </div>

                              <button
                                onClick={() => saveForLater(item)}
                                className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 hover:text-purple-600 transition mt-2"
                              >
                                <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                                Save for later
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                    <h3 className="font-semibold text-gray-800">
                      Delivery Instructions
                    </h3>
                  </div>

                  <textarea
                    placeholder="Add delivery instructions"
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg text-xs sm:text-sm text-black placeholder-gray-400 focus:ring-2 focus:ring-red-500"
                    rows="2"
                  />
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => router.push("/")}
                    className="text-red-500 hover:text-red-600 font-semibold flex items-center gap-2 text-sm sm:text-base"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Continue Shopping
                  </button>
                </div>
              </div>

              <div className="lg:w-96">
                <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 sticky top-24">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Order Summary
                  </h3>

                  <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({itemCount} items)</span>
                      <span>
                        {currencySymbol}
                        {subtotal.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between text-gray-600">
                      <span>Tax (5%)</span>
                      <span>
                        {currencySymbol}
                        {tax.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between text-gray-600">
                      <span className="flex items-center gap-1">
                        <Truck className="w-4 h-4" />
                        Delivery Fee
                      </span>
                      {deliveryFee === 0 ? (
                        <span className="text-green-600 font-medium">
                          FREE
                        </span>
                      ) : (
                        <span>
                          {currencySymbol}
                          {deliveryFee.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {promoApplied && (
                      <div className="flex justify-between text-green-600 pt-2 border-t border-gray-200">
                        <span className="flex items-center gap-1">
                          <Tag className="w-4 h-4" />
                          Discount ({appliedPromo?.discountPercent}% OFF)
                        </span>
                        <span>
                          -{currencySymbol}
                          {promoDiscount.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>

                  {!promoApplied ? (
                    <div className="mt-4">
                      {showPromoInput ? (
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Enter promo code"
                              value={promoCode}
                              onChange={(e) =>
                                setPromoCode(e.target.value.toUpperCase())
                              }
                              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-black placeholder-gray-400 focus:ring-2 focus:ring-red-500"
                            />
                            <button
                              onClick={applyPromoCode}
                              className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                            >
                              Apply
                            </button>
                          </div>

                          {promoError && (
                            <p className="text-xs text-red-500">
                              {promoError}
                            </p>
                          )}

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
                            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600"
                          >
                            <Tag className="w-4 h-4" />
                            Have a promo code?
                          </button>

                          {availableOffers.length > 0 && (
                            <button
                              onClick={() => setShowOffers(!showOffers)}
                              className="flex items-center gap-2 text-sm text-purple-500 hover:text-purple-600"
                            >
                              <Gift className="w-4 h-4" />
                              View Available Offers ({availableOffers.length})
                            </button>
                          )}
                        </div>
                      )}

                      {showOffers && !promoApplied && (
                        <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                          <p className="text-xs font-semibold text-gray-700 mb-2">
                            Available Offers:
                          </p>
                          {availableOffers
                            .filter((o) => o.isActive)
                            .map((offer) => (
                              <div
                                key={offer.id}
                                className="p-2 bg-gray-50 rounded-lg border border-gray-200"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <p className="text-xs font-semibold text-gray-800">
                                      {offer.title}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      {offer.discountPercent}% OFF
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Min order: ₹
                                      {offer.minOrderAmount ||
                                        getMinOrderValue(offer.title)}
                                    </p>
                                  </div>

                                  <button
                                    onClick={() => quickApplyOffer(offer)}
                                    className="px-2 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600"
                                  >
                                    Apply
                                  </button>
                                </div>

                                <p className="text-xs text-gray-400 mt-1">
                                  Code: {offer.couponCode}
                                </p>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mt-4 p-2 bg-green-50 rounded-lg flex items-center justify-between">
                      <div>
                        <span className="text-xs sm:text-sm text-green-700 font-medium">
                          {appliedPromo?.title || "Promo"} applied!
                        </span>
                        <p className="text-xs text-green-600">
                          Code: {appliedPromo?.couponCode}
                        </p>
                      </div>

                      <button
                        onClick={removePromoCode}
                        className="text-green-700 hover:text-green-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {subtotal < 500 && subtotal > 0 && (
                    <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                      <p className="text-xs sm:text-sm text-orange-700 flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        Add {currencySymbol}
                        {(500 - subtotal).toFixed(2)} more for FREE delivery
                      </p>
                    </div>
                  )}

                  <div className="border-t border-gray-200 mt-4 pt-4">
                    <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <div className="text-right">
                        <span>
                          {currencySymbol}
                          {total.toFixed(2)}
                        </span>
                        {promoApplied && (
                          <p className="text-xs text-green-600">
                            You saved {currencySymbol}
                            {promoDiscount.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Including all taxes
                    </p>
                  </div>

                  <button
                    onClick={proceedToCheckout}
                    className="w-full mt-6 py-3 sm:py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                    disabled={cartItems.length === 0 || updating}
                  >
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                    Proceed to Checkout
                  </button>

                  <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Secure
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      30 min delivery
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      100% fresh
                    </div>
                  </div>

                  <div className="mt-4 p-2 bg-blue-50 rounded-lg text-center">
                    <p className="text-xs text-blue-700 flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3" />
                      Estimated delivery by {estimatedDelivery}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />

      <style jsx>{`
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
      `}</style>
    </>
  );
};

export default CartPage;
