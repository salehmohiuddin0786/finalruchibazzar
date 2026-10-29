const {
  sequelize,
  Order,
  OrderItem,
  Offer,
  User,
  Restaurant,
  Dish,
  DeliveryPartner,
  UserAddress,
  Payment,
  Earning,
} = require("../models");

const { ORDER_STATUS, DELIVERY_STATUS } = require("../config/constants");
const {
  calculateAndCreateEarning,
  reverseOrCancelEarning,
} = require("../services/commission.service");
const {
  calculateDistanceKm,
  calculateOrderFinancials,
} = require("../services/finance.service");
const { sendNotification } = require("../services/notification.service");
const orderSocket = require("../sockets/order.socket");

const findLinkedUserForPartner = async (partner) => {
  if (partner.email) {
    const byEmail = await User.findOne({
      where: { email: partner.email, role: "partner", isActive: true },
    });

    if (byEmail) return byEmail;
  }

  return User.findOne({
    where: { phone: partner.phone, role: "partner", isActive: true },
  });
};

const isPlaceholderPhone = (phone) => {
  if (!phone) return true;
  const clean = String(phone).replace(/\D/g, "");
  return clean.length !== 10 || !/^[6-9]\d{9}$/.test(clean);
};

const saveCustomerAddressFromOrder = async ({ userId, deliveryAddress, latitude, longitude, savedAddress }) => {
  const street =
    savedAddress?.street ||
    savedAddress?.streetAddress ||
    savedAddress?.finalAddress ||
    deliveryAddress;

  if (!userId || !street) return;

  const existing = await UserAddress.findOne({
    where: { userId, street },
  });

  const rawContactPhone = String(savedAddress?.phone || savedAddress?.contactNumber || "").replace(/\D/g, "");
  const validContactPhone = rawContactPhone.length === 10 && /^[6-9]\d{9}$/.test(rawContactPhone) ? rawContactPhone : "";

  const payload = {
    userId,
    type: savedAddress?.type || "home",
    street,
    city: savedAddress?.city || savedAddress?.cityName || "",
    state: savedAddress?.state || savedAddress?.stateName || "",
    zipCode: savedAddress?.zipCode || savedAddress?.pincode || "",
    landmark: savedAddress?.landmark || savedAddress?.colonyName || "",
    phone: validContactPhone || savedAddress?.phone || savedAddress?.contactNumber || "",
    contactName: savedAddress?.contactName || "",
    latitude: latitude === "" || latitude === undefined ? null : latitude,
    longitude: longitude === "" || longitude === undefined ? null : longitude,
  };

  // If user currently has placeholder phone or no phone, adopt valid contact phone
  if (validContactPhone) {
    try {
      const user = await User.findByPk(userId);
      if (user && (!user.phone || isPlaceholderPhone(user.phone))) {
        const phoneTaken = await User.findOne({ where: { phone: validContactPhone } });
        if (!phoneTaken || phoneTaken.id === user.id) {
          user.phone = validContactPhone;
          if (payload.contactName && (!user.name || user.name === "Google User")) {
            user.name = payload.contactName;
          }
          await user.save();
        }
      }
    } catch (e) {
      console.warn("Could not auto-update user phone from order:", e.message);
    }
  }

  if (existing) {
    await existing.update(payload);
    return;
  }

  const count = await UserAddress.count({ where: { userId } });
  await UserAddress.create({ ...payload, isDefault: count === 0 });
};

/*
---------------------------------------
HELPER: FORMAT ORDER FOR FRONTEND
---------------------------------------
*/
const getDisplayOrderStatus = (order) => {
  const status = String(order.status || "").toLowerCase();
  const deliveryStatus = String(order.deliveryStatus || "").toLowerCase();

  if (status === "out_for_delivery" || deliveryStatus === "on_the_way") return "on the way";
  if (status === "picked_up" || deliveryStatus === "picked") return "on the way";
  if (status === "delivered" || deliveryStatus === "delivered") return "delivered";

  return order.status;
};

const formatOrder = (order) => ({
  id: order.id,
  orderNumber: `ORD-${order.id}`,
  status: getDisplayOrderStatus(order),
  createdAt: order.createdAt,

  totalAmount: Number(order.totalAmount || 0),
  discount: Number(order.discount || 0),
  subtotal: Number(order.subtotal || order.originalAmount || 0),
  taxAmount: Number(order.taxAmount || 0),
  deliveryFee: Number(order.deliveryFee || 0),
  platformFee: Number(order.platformFee || 0),
  paymentMethod: order.paymentMethod || "cash",
  paymentStatus: order.paymentStatus || "pending",

  // FinTech breakdown snapshots
  restaurantEarning: Number(
    order.restaurantEarning !== undefined && order.restaurantEarning !== null
      ? order.restaurantEarning
      : Number(order.subtotal || order.originalAmount || 0) * 0.98 - Number(order.restaurantFundedDiscount || 0)
  ),
  platformCommission: Number(
    order.platformCommission !== undefined && order.platformCommission !== null
      ? order.platformCommission
      : Number(order.subtotal || order.originalAmount || 0) * 0.02
  ),
  deliveryEarning: Number(order.deliveryEarning || order.deliveryFee || 0),
  distanceKm: Number(order.distanceKm || 0),
  discountFundedBy: order.discountFundedBy || "none",
  restaurantFundedDiscount: Number(order.restaurantFundedDiscount || 0),
  platformFundedDiscount: Number(order.platformFundedDiscount || 0),

  deliveryAddress: order.deliveryAddress,
  deliveryPartnerId: order.deliveryPartnerId,
  deliveryPartnerName: order.deliveryPartner?.name || null,
  deliveryStatus: order.deliveryStatus,
  driver: order.deliveryPartner
    ? {
        id: order.deliveryPartner.id,
        name: order.deliveryPartner.name,
        phone: order.deliveryPartner.phone,
      }
    : null,

  // ✅ Coordinates saved in backend
  deliveryLat: order.deliveryLat,
  deliveryLng: order.deliveryLng,

  customerDetails: {
    name: order.user?.name || "Customer",
    phone: !isPlaceholderPhone(order.user?.phone)
      ? order.user?.phone
      : (order.savedAddress?.phone || (typeof order.deliveryAddress === "object" ? order.deliveryAddress?.phone : "") || "N/A"),
    email: order.user?.email || "N/A",
  },
  customerPhone: !isPlaceholderPhone(order.user?.phone)
    ? order.user?.phone
    : (order.savedAddress?.phone || (typeof order.deliveryAddress === "object" ? order.deliveryAddress?.phone : "") || ""),

  restaurant: order.restaurant || null,

  items:
    order.orderItems?.map((item) => ({
      id: item.id,
      dishId: item.dishId,
      name: item.dish?.name || "Item",
      image: item.dish?.image || null,
      quantity: Number(item.quantity || 1),
      price: Number(item.price || 0),
      dish: item.dish || null,
    })) || [],
});

/*
---------------------------------------
CREATE ORDER
---------------------------------------
*/
exports.createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  let committed = false;

  try {
    const {
      items,
      restaurantId,
      deliveryAddress,
      couponCode,
      latitude,
      longitude,
      savedAddress,
      paymentMethod = "cash",
    } = req.body;

    if (!req.user || req.user.role !== "customer") {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: "Only customers allowed",
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Items required",
      });
    }

    if (!restaurantId || !deliveryAddress) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Restaurant & address required",
      });
    }

    const rawLat = latitude ?? req.body.deliveryLat ?? req.body.lat;
    const rawLng = longitude ?? req.body.deliveryLng ?? req.body.lng;

    const deliveryLat =
      rawLat !== undefined && rawLat !== null && rawLat !== ""
        ? Number(rawLat)
        : null;

    const deliveryLng =
      rawLng !== undefined && rawLng !== null && rawLng !== ""
        ? Number(rawLng)
        : null;

    if (
      (deliveryLat !== null && Number.isNaN(deliveryLat)) ||
      (deliveryLng !== null && Number.isNaN(deliveryLng))
    ) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Invalid latitude or longitude",
      });
    }

    const userId = req.user.id;

    const originalAmount = items.reduce((sum, item) => {
      return sum + Number(item.price || 0) * Number(item.quantity || 1);
    }, 0);

    let discount = 0;
    let finalAmount = originalAmount;
    let appliedCoupon = null;

    if (couponCode) {
      const offer = await Offer.findOne({
        where: {
          couponCode: couponCode.trim(),
          isActive: true,
        },
      });

      if (!offer) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "Invalid coupon",
        });
      }

      const now = new Date();

      if (offer.validFrom && now < new Date(offer.validFrom)) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "Offer not started",
        });
      }

      if (offer.validTo && now > new Date(offer.validTo)) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "Offer expired",
        });
      }

      if (
        offer.minOrderAmount &&
        originalAmount < Number(offer.minOrderAmount)
      ) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Minimum ₹${offer.minOrderAmount}`,
        });
      }

      discount =
        (originalAmount * Number(offer.discountPercent || 0)) / 100;

      if (offer.maxDiscount && discount > Number(offer.maxDiscount)) {
        discount = Number(offer.maxDiscount);
      }

      finalAmount = originalAmount - discount;
      appliedCoupon = offer.couponCode;
      appliedCouponFundedBy = offer.fundedBy || (offer.restaurantId ? "restaurant" : "platform");

      await offer.increment("usedCount", { transaction });
    }

    // 📍 CALCULATE DISTANCE FOR DELIVERY CHARGES
    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    if (!restaurant.isApproved) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "This restaurant is currently under review and cannot accept orders yet.",
      });
    }

    if (!restaurant.isOpen) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "This restaurant is currently closed for orders.",
      });
    }

    const distanceKm = calculateDistanceKm(
      restaurant.latitude,
      restaurant.longitude,
      deliveryLat,
      deliveryLng
    );

    // 💰 CENTRALIZED FINANCIAL CALCULATION ENGINE
    const financials = calculateOrderFinancials({
      foodSubtotal: originalAmount,
      distanceKm,
      discount,
      discountFundedBy: appliedCoupon ? appliedCouponFundedBy : "none",
      customCommissionRate: restaurant.commissionRate,
      platformFee: 0,
    });

    const finalOrderTotal = financials.customerTotal;

    const order = await Order.create(
      {
        userId,
        restaurantId,
        originalAmount,
        subtotal: financials.foodSubtotal,
        taxAmount: financials.taxAmount,
        deliveryFee: financials.deliveryFee,
        platformFee: financials.platformFee,
        totalAmount: finalOrderTotal,
        discount: financials.discount,
        couponCode: appliedCoupon,
        discountFundedBy: financials.discountFundedBy,
        restaurantFundedDiscount: financials.restaurantFundedDiscount,
        platformFundedDiscount: financials.platformFundedDiscount,
        platformCommission: financials.platformCommission,
        restaurantEarning: financials.restaurantNetEarning,
        deliveryEarning: financials.deliveryPartnerEarning,
        distanceKm: financials.distanceKm !== null ? financials.distanceKm : 0,
        deliveryAddress,
        deliveryLat,
        deliveryLng,
        paymentMethod: paymentMethod || "cash",
        status: ORDER_STATUS.PENDING,
        deliveryStatus: DELIVERY_STATUS.NOT_ASSIGNED,
        paymentStatus: "pending",
      },
      { transaction }
    );

    await OrderItem.bulkCreate(
      items.map((item) => ({
        orderId: order.id,
        dishId: item.dishId,
        quantity: Number(item.quantity || 1),
        price: Number(item.price || 0),
      })),
      { transaction }
    );

    await Payment.create(
      {
        orderId: order.id,
        userId,
        paymentMethod: ["cash", "upi", "card", "netbanking"].includes(paymentMethod)
          ? paymentMethod
          : "cash",
        amount: finalOrderTotal,
        netAmount: finalOrderTotal,
        foodSubtotal: financials.foodSubtotal,
        taxAmount: financials.taxAmount,
        deliveryFee: financials.deliveryFee,
        status: "pending",
      },
      { transaction }
    );

    await transaction.commit();
    committed = true;

    calculateAndCreateEarning(order).catch(() => {});

    saveCustomerAddressFromOrder({
      userId,
      deliveryAddress,
      latitude: deliveryLat,
      longitude: deliveryLng,
      savedAddress,
    }).catch((addressError) => {
      console.error("SAVE ORDER ADDRESS ERROR:", addressError.message);
    });

    sendNotification({
      userId,
      title: "Order Placed",
      message: `Order #${order.id} placed`,
    }).catch(() => {});

    let fullOrder = order;

    try {
      fullOrder = await Order.findByPk(order.id, {
        include: [
          {
            model: OrderItem,
            as: "orderItems",
            include: [{ model: Dish, as: "dish" }],
          },
          { model: User, as: "user" },
          { model: Restaurant, as: "restaurant" },
          { model: DeliveryPartner, as: "deliveryPartner" },
        ],
      });
    } catch (lookupError) {
      console.error("CREATE ORDER LOOKUP ERROR:", lookupError.message);
    }

    return res.status(201).json({
      success: true,
      order: formatOrder(fullOrder || order),
    });
  } catch (error) {
    if (!committed && !transaction.finished) {
      await transaction.rollback();
    }

    console.error("CREATE ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
---------------------------------------
GET USER ORDERS
---------------------------------------
*/
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          include: [{ model: Dish, as: "dish" }],
        },
        { model: User, as: "user" },
        { model: Restaurant, as: "restaurant" },
        { model: DeliveryPartner, as: "deliveryPartner" },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      orders: orders.map(formatOrder),
    });
  } catch (error) {
    console.error("GET USER ORDERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
---------------------------------------
GET RESTAURANT ORDERS
---------------------------------------
*/
exports.getRestaurantOrders = async (req, res) => {
  try {
    const restaurantId = Number(req.params.restaurantId);

    if (!restaurantId || Number.isNaN(restaurantId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid restaurantId",
      });
    }

    if (req.user && req.user.role === "partner") {
      const restaurant = await Restaurant.findByPk(restaurantId);
      if (!restaurant || restaurant.ownerId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Access denied. You can only view orders for your own restaurant.",
        });
      }
    }

    const orders = await Order.findAll({
      where: { restaurantId },
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          include: [{ model: Dish, as: "dish" }],
        },
        { model: User, as: "user" },
        { model: Restaurant, as: "restaurant" },
        { model: DeliveryPartner, as: "deliveryPartner" },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      orders: orders.map(formatOrder),
    });
  } catch (error) {
    console.error("GET RESTAURANT ORDERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
---------------------------------------
GET ORDER BY ID
---------------------------------------
*/
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          include: [{ model: Dish, as: "dish" }],
        },
        { model: User, as: "user" },
        { model: Restaurant, as: "restaurant" },
        { model: DeliveryPartner, as: "deliveryPartner" },
      ],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (req.user && req.user.role !== "admin") {
      const isCustomer = order.userId === req.user.id;
      const isRestaurantOwner = order.restaurant && order.restaurant.ownerId === req.user.id;
      const isAssignedDelivery =
        order.deliveryPartnerId === req.user.id ||
        (order.deliveryPartner &&
          (order.deliveryPartner.phone === req.user.phone ||
            order.deliveryPartner.email === req.user.email));

      if (!isCustomer && !isRestaurantOwner && !isAssignedDelivery) {
        return res.status(403).json({
          success: false,
          message: "Access denied. You are not authorized to view this order.",
        });
      }
    }

    return res.status(200).json({
      success: true,
      order: formatOrder(order),
    });
  } catch (error) {
    console.error("GET ORDER BY ID ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
---------------------------------------
UPDATE ORDER STATUS
---------------------------------------
*/
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, deliveryPartnerId } = req.body;

    const order = await Order.findByPk(req.params.id, {
      include: [{ model: Restaurant, as: "restaurant" }],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (req.user && req.user.role === "partner") {
      if (!order.restaurant || order.restaurant.ownerId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Access denied. You can only update orders for your own restaurant.",
        });
      }
    }

    const updates = { status };
    let assignedPartner = null;

    // 💰 FINTECH STATUS SYNCHRONIZATION
    if (status === ORDER_STATUS.CANCELLED) {
      reverseOrCancelEarning(order.id, "Order cancelled").catch(() => {});
      Payment.update(
        { status: "refunded", failureReason: "Order cancelled" },
        { where: { orderId: order.id } }
      ).catch(() => {});
      updates.paymentStatus = "failed";
    } else if (status === ORDER_STATUS.DELIVERED) {
      updates.paymentStatus = "success";
      updates.deliveredAt = new Date();
      Payment.update(
        { status: "success", paidAt: new Date() },
        { where: { orderId: order.id } }
      ).catch(() => {});
    }

    if (deliveryPartnerId) {
      assignedPartner = await DeliveryPartner.findByPk(deliveryPartnerId);

      if (
        !assignedPartner ||
        !assignedPartner.isActive
      ) {
        return res.status(404).json({
          success: false,
          message: "Delivery partner not found",
        });
      }

      updates.deliveryPartnerId = assignedPartner.id;
      updates.deliveryStatus = DELIVERY_STATUS.ASSIGNED;
      updates.assignmentExpiresAt = null;
    }

    await order.update(updates);

    if (assignedPartner) {
      const linkedUser = await findLinkedUserForPartner(assignedPartner);
      await assignedPartner.update({ isAvailable: false });
      if (linkedUser) await linkedUser.update({ isAvailable: false });
      order.status = ORDER_STATUS.OUT_FOR_DELIVERY;
      await order.save();
      orderSocket.emitDeliveryAssigned(order, {
        id: linkedUser?.id || assignedPartner.id,
        name: assignedPartner.name,
      });
      orderSocket.emitOrderStatusUpdate(order);
    }

    sendNotification({
      userId: order.userId,
      title: "Order Update",
      message: `Order #${order.id} is ${status}`,
    }).catch(() => {});

    return res.status(200).json({
      success: true,
      order: formatOrder(order),
    });
  } catch (error) {
    console.error("UPDATE ORDER STATUS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
