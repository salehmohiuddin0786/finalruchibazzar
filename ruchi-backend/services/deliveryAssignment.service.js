const { Op, Transaction } = require("sequelize");
const { sequelize, Order, User, Restaurant } = require("../models");
const { ORDER_STATUS, DELIVERY_STATUS } = require("../config/constants");
const orderSocket = require("../sockets/order.socket");

const ASSIGNMENT_TIMEOUT_MS = 30 * 1000;
const sessions = new Map();

const toRad = (value) => (Number(value) * Math.PI) / 180;

const calculateDistanceKm = (lat1, lng1, lat2, lng2) => {
  if ([lat1, lng1, lat2, lng2].some((value) => value === null || value === undefined || Number.isNaN(Number(value)))) {
    return null;
  }

  const earthRadiusKm = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const clearSession = (orderId) => {
  const session = sessions.get(Number(orderId));
  if (session?.timer) clearTimeout(session.timer);
  sessions.delete(Number(orderId));
};

const getOrderWithRestaurant = (orderId, transaction) =>
  Order.findByPk(orderId, {
    include: [{ model: Restaurant, as: "restaurant" }],
    transaction,
    lock: transaction ? transaction.LOCK.UPDATE : undefined,
  });

const buildDeliveryRequestPayload = (order, partner, distanceKm) => ({
  orderId: order.id,
  restaurantName: order.restaurant?.name || "Restaurant",
  pickupAddress: order.restaurant?.address || "Pickup address not available",
  deliveryAddress: order.deliveryAddress || "Delivery address not available",
  totalAmount: Number(order.totalAmount || 0),
  distance: distanceKm === null ? null : Number(distanceKm.toFixed(2)),
  countdownSeconds: ASSIGNMENT_TIMEOUT_MS / 1000,
  expiresAt: order.assignmentExpiresAt,
  partnerId: partner.id,
});

const getAvailablePartners = async (restaurant) => {
  const partners = await User.findAll({
    where: {
      role: { [Op.in]: ["delivery", "partner"] },
      isAvailable: true,
      isActive: true,
    },
    attributes: ["id", "name", "phone", "currentLat", "currentLng", "rating", "totalDeliveries"],
  });

  return partners
    .map((partner) => ({
      partner,
      distanceKm: calculateDistanceKm(
        restaurant?.latitude,
        restaurant?.longitude,
        partner.currentLat,
        partner.currentLng
      ),
    }))
    .sort((a, b) => {
      if (a.distanceKm === null && b.distanceKm === null) return 0;
      if (a.distanceKm === null) return 1;
      if (b.distanceKm === null) return -1;
      return a.distanceKm - b.distanceKm;
    });
};

const markNotAssigned = async (orderId) => {
  const order = await Order.findByPk(orderId);
  if (!order || order.deliveryStatus === DELIVERY_STATUS.ASSIGNED) return order;

  order.deliveryPartnerId = null;
  order.deliveryStatus = DELIVERY_STATUS.NOT_ASSIGNED;
  order.assignmentExpiresAt = null;
  await order.save();

  orderSocket.emitDeliveryNotAssigned(order);
  return order;
};

const requestNextPartner = async (orderId) => {
  const session = sessions.get(Number(orderId));
  if (!session) return;

  const candidate = session.candidates[session.index];

  if (!candidate) {
    clearSession(orderId);
    await markNotAssigned(orderId);
    return;
  }

  const expiresAt = new Date(Date.now() + ASSIGNMENT_TIMEOUT_MS);
  const order = await getOrderWithRestaurant(orderId);

  if (!order || order.deliveryStatus === DELIVERY_STATUS.ASSIGNED) {
    clearSession(orderId);
    return;
  }

  order.deliveryPartnerId = candidate.partner.id;
  order.deliveryStatus = DELIVERY_STATUS.ASSIGNING;
  order.assignmentExpiresAt = expiresAt;
  await order.save();

  session.currentPartnerId = candidate.partner.id;
  session.currentExpiresAt = expiresAt;
  sessions.set(Number(orderId), session);

  const payload = buildDeliveryRequestPayload(order, candidate.partner, candidate.distanceKm);
  orderSocket.emitDeliveryRequest(candidate.partner.id, payload);

  session.timer = setTimeout(async () => {
    const latestSession = sessions.get(Number(orderId));
    if (!latestSession || latestSession.currentPartnerId !== candidate.partner.id) return;

    orderSocket.emitDeliveryRequestExpired(candidate.partner.id, { orderId: order.id });
    latestSession.index += 1;
    latestSession.timer = null;
    sessions.set(Number(orderId), latestSession);
    await requestNextPartner(orderId);
  }, ASSIGNMENT_TIMEOUT_MS);
};

exports.startDeliveryAssignment = async (orderId) => {
  clearSession(orderId);

  const order = await getOrderWithRestaurant(orderId);
  if (!order) throw new Error("Order not found");
  if (order.deliveryStatus === DELIVERY_STATUS.ASSIGNED) return order;

  const candidates = await getAvailablePartners(order.restaurant);

  if (!candidates.length) {
    await markNotAssigned(order.id);
    return order;
  }

  sessions.set(Number(order.id), {
    orderId: Number(order.id),
    candidates,
    index: 0,
    currentPartnerId: null,
    currentExpiresAt: null,
    timer: null,
  });

  await requestNextPartner(order.id);
  return order;
};

exports.acceptDeliveryAssignment = async ({ orderId, partnerId }) => {
  const session = sessions.get(Number(orderId));

  if (session && session.currentPartnerId !== Number(partnerId)) {
    const error = new Error("This delivery request is no longer active");
    error.statusCode = 409;
    throw error;
  }

  if (session?.currentExpiresAt && new Date(session.currentExpiresAt) <= new Date()) {
    const error = new Error("Delivery request expired");
    error.statusCode = 409;
    throw error;
  }

  const result = await sequelize.transaction(
    { isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED },
    async (transaction) => {
      const order = await getOrderWithRestaurant(orderId, transaction);
      const partner = await User.findByPk(partnerId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!order) {
        const error = new Error("Order not found");
        error.statusCode = 404;
        throw error;
      }

      if (!partner || !["partner", "delivery"].includes(partner.role) || !partner.isActive) {
        const error = new Error("Delivery partner not available");
        error.statusCode = 404;
        throw error;
      }

      if (order.deliveryStatus === DELIVERY_STATUS.ASSIGNED) {
        const error = new Error("Order already assigned");
        error.statusCode = 409;
        throw error;
      }

      if (
        order.deliveryStatus !== DELIVERY_STATUS.ASSIGNING ||
        Number(order.deliveryPartnerId) !== Number(partner.id)
      ) {
        const error = new Error("This delivery request is no longer active");
        error.statusCode = 409;
        throw error;
      }

      if (order.assignmentExpiresAt && new Date(order.assignmentExpiresAt) <= new Date()) {
        const error = new Error("Delivery request expired");
        error.statusCode = 409;
        throw error;
      }

      if (!partner.isAvailable) {
        const error = new Error("Partner is no longer available");
        error.statusCode = 409;
        throw error;
      }

      await order.update(
        {
          deliveryPartnerId: partner.id,
          status: ORDER_STATUS.OUT_FOR_DELIVERY,
          deliveryStatus: DELIVERY_STATUS.ASSIGNED,
          assignmentExpiresAt: null,
        },
        { transaction }
      );

      await partner.update({ isAvailable: false }, { transaction });

      return { order, partner };
    }
  );

  clearSession(orderId);
  orderSocket.emitDeliveryAssigned(result.order, result.partner);
  return result.order;
};

exports.rejectDeliveryAssignment = async ({ orderId, partnerId }) => {
  const session = sessions.get(Number(orderId));

  if (!session || session.currentPartnerId !== Number(partnerId)) {
    const order = await Order.findByPk(orderId);

    if (
      !order ||
      order.deliveryStatus !== DELIVERY_STATUS.ASSIGNING ||
      Number(order.deliveryPartnerId) !== Number(partnerId)
    ) {
      return { skipped: true };
    }

    await order.update({
      deliveryPartnerId: null,
      deliveryStatus: DELIVERY_STATUS.NOT_ASSIGNED,
      assignmentExpiresAt: null,
    });

    orderSocket.emitDeliveryRequestRejected(partnerId, { orderId: Number(orderId) });
    exports.startDeliveryAssignment(orderId).catch((error) => {
      console.error("Delivery reassignment after reject failed:", error.message);
    });

    return { skipped: false };
  }

  if (session.timer) clearTimeout(session.timer);
  orderSocket.emitDeliveryRequestRejected(partnerId, { orderId: Number(orderId) });

  session.index += 1;
  session.timer = null;
  sessions.set(Number(orderId), session);
  await requestNextPartner(orderId);

  return { skipped: false };
};

exports.handlePartnerDisconnected = async (partnerId) => {
  for (const [orderId, session] of sessions.entries()) {
    if (session.currentPartnerId === Number(partnerId)) {
      if (session.timer) clearTimeout(session.timer);
      session.index += 1;
      session.timer = null;
      sessions.set(orderId, session);
      await requestNextPartner(orderId);
    }
  }
};
