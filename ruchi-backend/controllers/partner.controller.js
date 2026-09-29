const { Restaurant, Order } = require("../models");

exports.getPartnerDashboard = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      where: { ownerId: req.user.id },
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant profile not found. Please complete registration.",
      });
    }

    if (!restaurant.isApproved) {
      return res.status(403).json({
        success: false,
        code: "RESTAURANT_UNDER_REVIEW",
        message: "Your account is under review. Please wait for admin approval.",
      });
    }

    const orders = await Order.count({
      where: { restaurantId: restaurant.id },
    });

    res.json({ restaurant, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
