const { PLATFORM_COMMISSION_PERCENT } = require("../config/constants");
const { Earning } = require("../models");

exports.calculateAndCreateEarning = async (order) => {
  try {
    const total = order.totalAmount;

    const platformCommission =
      (total * PLATFORM_COMMISSION_PERCENT) / 100;

    const deliveryEarning = total * 0.05; // 5% to delivery
    const restaurantEarning =
      total - platformCommission - deliveryEarning;

    const earning = await Earning.create({
      orderId: order.id,
      restaurantEarning,
      platformCommission,
      deliveryEarning,
    });

    return earning;
  } catch (error) {
    throw new Error("Commission calculation failed: " + error.message);
  }
};