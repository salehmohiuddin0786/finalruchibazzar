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
} = require("../models");

const { ORDER_STATUS, DELIVERY_STATUS } = require("../config/constants");
const { calculateAndCreateEarning } = require("../services/commission.service");
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

  const payload = {
    userId,
    type: savedAddress?.type || "home",
    street,
    city: savedAddress?.city || savedAddress?.cityName || "",
    state: savedAddress?.state || savedAddress?.stateName || "",
    zipCode: savedAddress?.zipCode || savedAddress?.pincode || "",
    landmark: savedAddress?.landmark || savedAddress?.colonyName || "",
    phone: savedAddress?.phone || savedAddress?.contactNumber || "",
    contactName: savedAddress?.contactName || "",
    latitude: latitude === "" || latitude === undefined ? null : latitude,
    longitude: longitude === "" || longitude === undefined ? null : longitude,
  };

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
  subtotal: Number(order.originalAmount || 0),
  deliveryFee: 0,

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
    name: order.user?.name || "N/A",
    phone: order.user?.phone || "N/A",
    email: order.user?.email || "N/A",
  },

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

    const deliveryLat =
      latitude !== undefined && latitude !== null && latitude !== ""
        ? Number(latitude)
        : null;

    const deliveryLng =
      longitude !== undefined && longitude !== null && longitude !== ""
        ? Number(longitude)
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

      await offer.increment("usedCount", { transaction });
    }

    const order = await Order.create(
      {
        userId,
        restaurantId,
        originalAmount,
        totalAmount: finalAmount,
        discount,
        couponCode: appliedCoupon,
        deliveryAddress,

        // ✅ Save latitude and longitude here
        deliveryLat,
        deliveryLng,

        status: ORDER_STATUS.PENDING,
        deliveryStatus: DELIVERY_STATUS.NOT_ASSIGNED,
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

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const updates = { status };
    let assignedPartner = null;

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
