const { User, Restaurant, Order } = require("../models");

exports.getDashboardStats = async (req, res) => {
  try {
    const users = await User.count();
    const restaurants = await Restaurant.count();
    const orders = await Order.count();

    res.json({ users, restaurants, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.blockUser = async (req, res) => {
  const { id } = req.params;
  await User.update({ isActive: false }, { where: { id } });
  res.json({ message: "User blocked" });
};