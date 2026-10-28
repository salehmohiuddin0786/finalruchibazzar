const { PLATFORM_COMMISSION_PERCENT } = require("../config/constants");
const { Earning, Restaurant, Order } = require("../models");
const { calculateOrderFinancials } = require("./finance.service");

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

    const restaurant = await Restaurant.findByPk(order.restaurantId);

    const commissionPercent =
      customCommissionRate !== null && customCommissionRate !== undefined
        ? Number(customCommissionRate)
        : Number(order.commissionRate || restaurant?.commissionRate || PLATFORM_COMMISSION_PERCENT || 2);

    const financials = calculateOrderFinancials({
      foodSubtotal: order.subtotal || order.originalAmount || 0,
      distanceKm: order.distanceKm,
      discount: order.discount || 0,
      discountFundedBy: order.discountFundedBy || (order.restaurantFundedDiscount > 0 ? "restaurant" : order.platformFundedDiscount > 0 ? "platform" : "none"),
      customCommissionRate: commissionPercent,
      platformFee: order.platformFee || 0,
    });

    const earning = await Earning.create({
      restaurantId: order.restaurantId,
      orderId: order.id,
      grossFoodSales: financials.foodSubtotal,
      taxAmount: financials.taxAmount,
      discountAmount: financials.discount,
      restaurantFundedDiscount: financials.restaurantFundedDiscount,
      platformFundedDiscount: financials.platformFundedDiscount,
      commissionRate: financials.commissionRate,
      restaurantEarning: financials.restaurantNetEarning,
      platformCommission: financials.platformCommission,
      deliveryEarning: financials.deliveryPartnerEarning,
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
