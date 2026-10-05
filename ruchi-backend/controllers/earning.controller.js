const { Earning, Order, Restaurant } = require("../models");

exports.getEarnings = async (req, res) => {
  try {
    if (req.user && req.user.role === "partner") {
      const restaurant = await Restaurant.findOne({
        where: { ownerId: req.user.id },
      });

      if (!restaurant) {
        return res.json([]);
      }

      const earnings = await Earning.findAll({
        include: [
          {
            model: Order,
            as: "order",
            where: { restaurantId: restaurant.id },
            attributes: ["id", "totalAmount", "status", "createdAt"],
          },
        ],
      });

      return res.json(earnings);
    }

    // Admin can view all platform earnings
    const earnings = await Earning.findAll({
      include: [
        {
          model: Order,
          as: "order",
          attributes: ["id", "restaurantId", "totalAmount", "status", "createdAt"],
        },
      ],
    });

    return res.json(earnings);
  } catch (error) {
    console.error("GET EARNINGS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch earnings",
    });
  }
};