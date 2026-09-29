const { Op } = require("sequelize");
const { Order, User, Restaurant, Earning, DeliveryPartner } = require("../models");
const {
  acceptDeliveryAssignment,
  rejectDeliveryAssignment,
} = require("../services/deliveryAssignment.service");
const { ORDER_STATUS } = require("../config/constants");
const orderSocket = require("../sockets/order.socket");

const ACTIVE_STATUSES = ["assigned", "picked", "on_the_way", "ASSIGNED", "PICKED", "ON_THE_WAY"];
const DELIVERY_EARNING_RATE = 40;

const normalizeDeliveryStatus = (status) => {
  const map = {
    NOT_ASSIGNED: "not_assigned",
    ASSIGNING: "assigning",
    ASSIGNED: "assigned",
    PICKED: "picked",
    ON_THE_WAY: "on_the_way",
    DELIVERED: "delivered",
  };
  return map[status] || status || "not_assigned";
};

const getOrderStatusForDeliveryStatus = (status) => {
  const normalized = normalizeDeliveryStatus(status);

  if (normalized === "picked") return ORDER_STATUS.PICKED_UP;
  if (normalized === "on_the_way") return ORDER_STATUS.OUT_FOR_DELIVERY;
  if (normalized === "delivered") return ORDER_STATUS.DELIVERED;

  return null;
};

const findPartnerProfile = async (user) => {
  if (user.email) {
    const byEmail = await DeliveryPartner.findOne({ where: { email: user.email } });
    if (byEmail) return byEmail;
  }

  return DeliveryPartner.findOne({ where: { phone: user.phone } });
};

const getAssignedOrders = async (user, deliveryStatuses) => {
  const partner = await findPartnerProfile(user);
  const partnerIds = [user.id, partner?.id].filter(Boolean);

  return Order.findAll({
    where: {
      deliveryPartnerId: { [Op.in]: partnerIds },
      ...(deliveryStatuses
        ? { deliveryStatus: { [Op.in]: deliveryStatuses } }
        : { deliveryStatus: { [Op.ne]: "ASSIGNING" } }),
    },
    include: [
      { model: User, as: "user", attributes: ["id", "name", "email", "phone"] },
      { model: Restaurant, as: "restaurant", attributes: ["id", "name", "address", "restaurantPhone"] },
      { model: Earning, as: "earning", required: false },
    ],
    order: [["createdAt", "DESC"]],
  });
};

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const getDeliveryFee = (order) =>
  Number(order.earning?.deliveryEarning || Math.max(DELIVERY_EARNING_RATE, Math.round(Number(order.totalAmount || 0) * 0.08)));

const formatOrder = (order) => {
  const customer = order.user || {};
  const restaurant = order.restaurant || {};
  const createdAt = order.createdAt ? new Date(order.createdAt) : new Date();
  const deliveredAt = order.deliveredAt ? new Date(order.deliveredAt) : null;
  const deliveryFee = getDeliveryFee(order);

  return {
    id: `RB-${order.id}`,
    rawId: order.id,
    customer: customer.name || "Customer",
    address: order.deliveryAddress || "Address not available",
    status: normalizeDeliveryStatus(order.deliveryStatus),
    amount: formatCurrency(order.totalAmount),
    amountValue: Number(order.totalAmount || 0),
    items: 0,
    time: createdAt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    distance: "2.5 km",
    phone: customer.phone || "",
    priority: Number(order.totalAmount || 0) > 700 ? "high" : Number(order.totalAmount || 0) > 400 ? "medium" : "low",
    restaurant: restaurant.name || "Restaurant",
    restaurantAddress: restaurant.address || "",
    rating: 5,
    deliveryFee: formatCurrency(deliveryFee),
    deliveryFeeValue: deliveryFee,
    paymentMethod: order.paymentStatus === "paid" ? "Online" : "Cash",
    deliveryLat: order.deliveryLat,
    deliveryLng: order.deliveryLng,
    deliveryPartnerId: order.deliveryPartnerId,
    orderDate: createdAt.toISOString().slice(0, 10),
    estimatedTime: "30 min",
    customerNote: "",
    completedAt: deliveredAt
      ? deliveredAt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
      : null,
    earnings: deliveryFee,
    tip: 0,
    duration: order.pickedAt && order.deliveredAt
      ? `${Math.max(1, Math.round((new Date(order.deliveredAt) - new Date(order.pickedAt)) / 60000))} min`
      : "30 min",
  };
};

const buildStats = (orders, partner, user) => {
  const deliveredOrders = orders.filter((order) => normalizeDeliveryStatus(order.deliveryStatus) === "delivered");
  const activeOrders = orders.filter((order) => ACTIVE_STATUSES.includes(order.deliveryStatus));
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayOrders = orders.filter((order) => new Date(order.createdAt).toISOString().slice(0, 10) === todayKey);
  const totalEarnings = deliveredOrders.reduce((sum, order) => sum + getDeliveryFee(order), 0);
  const todayEarnings = todayOrders.reduce((sum, order) => sum + getDeliveryFee(order), 0);

  return {
    activeOrders: activeOrders.length,
    todaysEarnings: todayEarnings,
    totalDeliveries: user.totalDeliveries || deliveredOrders.length,
    rating: user.rating || 5,
    totalEarnings,
    onlineHours: 0,
    isAvailable: Boolean(user.isAvailable || partner?.isAvailable),
    kycStatus: partner?.kycStatus || "pending",
  };
};

exports.assignDeliveryPartner = async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const { deliveryPartnerId } = req.body;

    if (!orderId || !deliveryPartnerId) {
      return res.status(400).json({ success: false, message: "Order ID and delivery partner ID are required" });
    }

    const order = await Order.findByPk(orderId);
    const partner = await DeliveryPartner.findByPk(deliveryPartnerId);

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (!partner || !partner.isActive) {
      return res.status(404).json({ success: false, message: "Delivery partner not found" });
    }

    order.deliveryPartnerId = partner.id;
    order.deliveryStatus = "ASSIGNED";
    await order.save();

    return res.status(200).json({ success: true, message: "Order assigned successfully", order: formatOrder(order) });
  } catch (error) {
    console.error("ASSIGN ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const partner = await findPartnerProfile(req.user);
    const orders = await getAssignedOrders(req.user);
    const formattedOrders = orders.map(formatOrder);
    const stats = buildStats(orders, partner, req.user);

    return res.json({
      success: true,
      stats,
      activeDeliveries: formattedOrders.filter((order) => ACTIVE_STATUSES.includes(order.status)),
      recentDeliveries: formattedOrders.slice(0, 5),
      partner,
      user: req.user,
    });
  } catch (error) {
    console.error("DELIVERY DASHBOARD ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyDeliveries = async (req, res) => {
  try {
    const orders = await getAssignedOrders(req.user);
    return res.json({
      success: true,
      orders: orders.map(formatOrder),
    });
  } catch (error) {
    console.error("MY DELIVERIES ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const orders = await getAssignedOrders(req.user, ["delivered"]);
    return res.json({
      success: true,
      deliveries: orders.map(formatOrder),
    });
  } catch (error) {
    console.error("DELIVERY HISTORY ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEarnings = async (req, res) => {
  try {
    const orders = await getAssignedOrders(req.user, ["delivered"]);
    const transactions = orders.map(formatOrder);
    const todayKey = new Date().toISOString().slice(0, 10);
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date();
    monthStart.setDate(1);

    const sumByDate = (predicate) =>
      orders.filter(predicate).reduce((sum, order) => sum + getDeliveryFee(order), 0);

    const earnings = {
      today: sumByDate((order) => new Date(order.createdAt).toISOString().slice(0, 10) === todayKey),
      week: sumByDate((order) => new Date(order.createdAt) >= weekStart),
      month: sumByDate((order) => new Date(order.createdAt) >= monthStart),
      total: sumByDate(() => true),
      pending: 0,
      withdrawable: sumByDate(() => true),
    };

    return res.json({
      success: true,
      earnings,
      transactions,
      weeklyData: [],
      bonuses: [],
    });
  } catch (error) {
    console.error("DELIVERY EARNINGS ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const partner = await findPartnerProfile(req.user);
    const orders = await getAssignedOrders(req.user, ["delivered"]);
    const stats = buildStats(orders, partner, req.user);

    return res.json({
      success: true,
      user: req.user,
      partner,
      stats,
    });
  } catch (error) {
    console.error("DELIVERY PROFILE ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRatings = async (req, res) => {
  try {
    return res.json({
      success: true,
      ratings: {
        overall: req.user.rating || 5,
        total: req.user.totalDeliveries || 0,
        breakdown: { 5: req.user.totalDeliveries || 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      },
      reviews: [],
      achievements: [],
    });
  } catch (error) {
    console.error("DELIVERY RATINGS ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAvailability = async (req, res) => {
  try {
    const isAvailable = Boolean(req.body?.isAvailable);
    const partner = await findPartnerProfile(req.user);

    req.user.isAvailable = isAvailable;
    await req.user.save();

    if (partner) {
      partner.isAvailable = isAvailable;
      await partner.save();
    }

    return res.json({ success: true, isAvailable });
  } catch (error) {
    console.error("DELIVERY AVAILABILITY ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.acceptAssignment = async (req, res) => {
  try {
    const order = await acceptDeliveryAssignment({
      orderId: Number(req.params.id),
      partnerId: req.user.id,
    });

    return res.json({
      success: true,
      message: "Delivery assigned successfully",
      order: formatOrder(order),
    });
  } catch (error) {
    console.error("DELIVERY ACCEPT ERROR:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.rejectAssignment = async (req, res) => {
  try {
    await rejectDeliveryAssignment({
      orderId: Number(req.params.id),
      partnerId: req.user.id,
    });

    return res.json({
      success: true,
      message: "Delivery request rejected",
    });
  } catch (error) {
    console.error("DELIVERY REJECT ERROR:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateOrderStatus = async (req, res, status, fields = {}) => {
  try {
    const partner = await findPartnerProfile(req.user);
    const partnerIds = [req.user.id, partner?.id].filter(Boolean);
    const order = await Order.findOne({
      where: {
        id: Number(req.params.id),
        deliveryPartnerId: { [Op.in]: partnerIds },
      },
    });

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.deliveryStatus = status;
    const orderStatus = getOrderStatusForDeliveryStatus(status);
    if (orderStatus) order.status = orderStatus;
    Object.assign(order, fields);
    await order.save();

    if (normalizeDeliveryStatus(status) === "delivered") {
      req.user.totalDeliveries = Number(req.user.totalDeliveries || 0) + 1;
      req.user.isAvailable = true;
      await req.user.save();

      if (partner) {
        partner.totalDeliveries = Number(partner.totalDeliveries || 0) + 1;
        partner.isAvailable = true;
        await partner.save();
      }
    }

    orderSocket.emitOrderStatusUpdate(order);
    return res.json({ success: true, order: formatOrder(order) });
  } catch (error) {
    console.error("DELIVERY STATUS ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.pickOrder = (req, res) => updateOrderStatus(req, res, "PICKED", { pickedAt: new Date() });
exports.startDelivery = (req, res) => updateOrderStatus(req, res, "ON_THE_WAY");
exports.completeDelivery = (req, res) => updateOrderStatus(req, res, "DELIVERED", { deliveredAt: new Date() });

exports.updateLocation = async (req, res) => {
  try {
    const lat = Number(req.body?.lat);
    const lng = Number(req.body?.lng);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return res.status(400).json({ success: false, message: "Valid latitude and longitude are required" });
    }

    const partner = await findPartnerProfile(req.user);
    const partnerIds = [req.user.id, partner?.id].filter(Boolean);
    const order = await Order.findOne({
      where: {
        id: Number(req.params.id),
        deliveryPartnerId: { [Op.in]: partnerIds },
      },
    });

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.deliveryLat = lat;
    order.deliveryLng = lng;
    await order.save();

    req.user.currentLat = lat;
    req.user.currentLng = lng;
    await req.user.save();

    if (partner) {
      partner.currentLat = lat;
      partner.currentLng = lng;
      await partner.save();
    }

    orderSocket.emitDeliveryLocationUpdate(order);

    return res.json({ success: true, order: formatOrder(order) });
  } catch (error) {
    console.error("DELIVERY LOCATION ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
