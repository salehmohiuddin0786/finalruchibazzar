const { Order, Restaurant, User } = require("../models");
const { Op } = require("sequelize");

exports.getAdminAnalytics = async () => {
  try {
    const totalUsers = await User.count();
    const totalRestaurants = await Restaurant.count();
    const totalOrders = await Order.count();

    const totalRevenue = await Order.sum("totalAmount");

    const todayOrders = await Order.count({
      where: {
        createdAt: {
          [Op.gte]: new Date().setHours(0, 0, 0, 0),
        },
      },
    });

    return {
      totalUsers,
      totalRestaurants,
      totalOrders,
      totalRevenue: totalRevenue || 0,
      todayOrders,
    };
  } catch (error) {
    throw new Error("Analytics fetch failed: " + error.message);
  }
};