/**
 * Ruchi Bazaar — Centralized Financial Calculation Service
 * 
 * Source of Truth: Ruchi_Bazaar_Costing_and_Earnings_Breakdown.pdf
 * Rules:
 * 1. Platform Commission: 2.0% of food subtotal
 * 2. Restaurant Share: 98.0% of food subtotal minus restaurant-funded discounts
 * 3. Distance-Based Delivery Fee:
 *    - <= 5.0 km: Rs. 15.00
 *    - 5.1 km – 6.0 km: Rs. 18.00
 *    - 6.1 km – 7.0 km: Rs. 21.00
 *    - > 7.0 km: Rs. 21.00 + Rs. 3.00 per additional km (ceiling rounded)
 * 4. Delivery Partner Share: 100% of collected delivery fee
 * 5. GST / Tax Liability: 0% (Tax exempt / removed)
 * 6. Minimum Withdrawal Balance: Rs. 100.00
 */

const { PLATFORM_COMMISSION_PERCENT } = require("../config/constants");

/**
 * Calculate distance in kilometers between two GPS coordinates using Haversine formula
 */
const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (
    lat1 === undefined || lat1 === null || Number.isNaN(Number(lat1)) ||
    lon1 === undefined || lon1 === null || Number.isNaN(Number(lon1)) ||
    lat2 === undefined || lat2 === null || Number.isNaN(Number(lat2)) ||
    lon2 === undefined || lon2 === null || Number.isNaN(Number(lon2))
  ) {
    return null;
  }

  const toRad = (value) => (Number(value) * Math.PI) / 180;
  const earthRadiusKm = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadiusKm * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place (e.g. 5.5 km)
};

/**
 * Distance-based delivery fee calculation
 */
const calculateDeliveryFee = (distanceKm) => {
  if (distanceKm === null || distanceKm === undefined || Number.isNaN(Number(distanceKm))) {
    return 15; // Local town base fee
  }

  const dist = Number(distanceKm);
  if (dist <= 5.0) {
    return 15;
  }
  if (dist <= 6.0) {
    return 18;
  }
  if (dist <= 7.0) {
    return 21;
  }

  // Beyond 7 km: Rs. 21 + Rs. 3 per additional kilometer
  const additionalKm = Math.ceil(dist - 7.0);
  return 21 + additionalKm * 3;
};

/**
 * Centralized financial breakdown calculation for any order
 */
const calculateOrderFinancials = ({
  foodSubtotal = 0,
  distanceKm = null,
  discount = 0,
  discountFundedBy = "restaurant", // "restaurant" | "platform" | "none"
  customCommissionRate = null,
  platformFee = 0,
}) => {
  const subtotal = Math.max(0, Math.round(Number(foodSubtotal || 0) * 100) / 100);
  const commRate =
    customCommissionRate !== null && customCommissionRate !== undefined
      ? Number(customCommissionRate)
      : Number(PLATFORM_COMMISSION_PERCENT || 2);

  // 1. Platform commission (2% on eligible food subtotal)
  const platformCommission = Math.round(((subtotal * commRate) / 100) * 100) / 100;

  // 2. Delivery fee & driver earning (100% of collected delivery fee)
  const deliveryFee = calculateDeliveryFee(distanceKm);
  const deliveryPartnerEarning = deliveryFee;

  // 3. Tax liability (0% GST)
  const taxAmount = 0;

  // 4. Discount allocation
  const totalDiscount = Math.min(subtotal, Math.max(0, Math.round(Number(discount || 0) * 100) / 100));
  let restaurantFundedDiscount = 0;
  let platformFundedDiscount = 0;

  if (totalDiscount > 0) {
    if (discountFundedBy === "platform") {
      platformFundedDiscount = totalDiscount;
      restaurantFundedDiscount = 0;
    } else {
      // Default: Merchant funded promotion
      restaurantFundedDiscount = totalDiscount;
      platformFundedDiscount = 0;
    }
  }

  // 5. Net restaurant earnings: Food Subtotal - Commission - Restaurant-funded discount
  const restaurantNetEarning = Math.max(
    0,
    Math.round((subtotal - platformCommission - restaurantFundedDiscount) * 100) / 100
  );

  // 6. Total amount payable by customer
  const customerTotal = Math.max(
    0,
    Math.round((subtotal - totalDiscount + deliveryFee + taxAmount + Number(platformFee || 0)) * 100) / 100
  );

  // 7. Net platform revenue: Commission + Platform Fee - Platform-funded discount
  const platformNetRevenue = Math.round(
    (platformCommission + Number(platformFee || 0) - platformFundedDiscount) * 100
  ) / 100;

  // 8. Double-entry validation (customer total must match the 3-way split)
  const splitSum = Math.round((restaurantNetEarning + deliveryPartnerEarning + platformNetRevenue) * 100) / 100;
  const isReconciled = Math.abs(customerTotal - splitSum) < 0.01;

  return {
    foodSubtotal: subtotal,
    distanceKm: distanceKm !== null ? Number(distanceKm) : null,
    deliveryFee,
    taxAmount,
    platformFee: Number(platformFee || 0),
    discount: totalDiscount,
    discountFundedBy: totalDiscount > 0 ? discountFundedBy : "none",
    restaurantFundedDiscount,
    platformFundedDiscount,
    commissionRate: commRate,
    platformCommission,
    restaurantGrossShare: subtotal,
    restaurantNetEarning,
    deliveryPartnerEarning,
    customerTotal,
    platformNetRevenue,
    isReconciled,
  };
};

module.exports = {
  calculateDistanceKm,
  calculateDeliveryFee,
  calculateOrderFinancials,
};
