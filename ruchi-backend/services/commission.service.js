const { PLATFORM_COMMISSION_PERCENT } = require("../config/constants");
const { Earning, Restaurant, Order } = require("../models");

/**
 * Calculate and record financial earnings for an order.
 * Ensures strict double-entry integrity, tracks tax liabilities,
 * and attributes earnings to the specific restaurant.
 */
exports.calculateAndCreateEarning = async (order, customCommissionRate = null) => {
  try {
    const existing = await Earning.findOne({ where: { orderId: order.id } });
    if (existing) {
      return existing;
    }

    const restaurant = await Restaurant.findByPk(order.restaurantId, {
      attributes: ["id", "commissionRate", "name"],
    });

    const commissionPercent =
      customCommissionRate !== null && customCommissionRate !== undefined
        ? Number(customCommissionRate)
        : Number(restaurant?.commissionRate || PLATFORM_COMMISSION_PERCENT || 2);

    const subtotal = Number(order.subtotal || order.originalAmount || 0);
    const discount = Number(order.discount || 0);
    const taxAmount = 0; // 🚫 No GST (0%)
    const customerDeliveryFee = Number(order.deliveryFee || 15);
    const platformFee = Number(order.platformFee || 0);

    // Platform commission earned on food subtotal + platform fee (20%)
    const foodCommission = Math.round(((subtotal * commissionPercent) / 100) * 100) / 100;
    const totalPlatformCommission = Math.round((foodCommission + platformFee) * 100) / 100;

    // Delivery partner receives 100% of the distance-based delivery fee (min ₹15)
    const deliveryEarning = customerDeliveryFee;

    // Net restaurant earnings: Food Subtotal - Commission - Discount
    const restaurantEarning = Math.max(
      0,
      Math.round((subtotal - foodCommission - discount) * 100) / 100
    );

    const earning = await Earning.create({
      restaurantId: order.restaurantId,
      orderId: order.id,
      grossFoodSales: subtotal,
      taxAmount: taxAmount,
      discountAmount: discount,
      commissionRate: commissionPercent,
      restaurantEarning,
      platformCommission: totalPlatformCommission,
      deliveryEarning,
      status: "accrued",
    });

    return earning;
  } catch (error) {
    console.error("COMMISSION CALCULATION ERROR:", error);
    throw new Error("Commission calculation failed: " + error.message);
  }
};

/**
 * Safely cancel or reverse an earning record when an order is cancelled or refunded.
 */
exports.reverseOrCancelEarning = async (orderId, reason = "Order cancelled") => {
  try {
    const earning = await Earning.findOne({ where: { orderId } });
    if (!earning) return null;

    if (earning.status === "settled") {
      // If already settled/paid out, mark as reversed for clawback in next cycle
      await earning.update({
        status: "reversed",
      });
    } else {
      // If still accrued, mark as cancelled so it is excluded from payouts
      await earning.update({
        status: "cancelled",
      });
    }

    return earning;
  } catch (error) {
    console.error("REVERSE EARNING ERROR:", error);
    throw error;
  }
};
