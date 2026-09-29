let io;

exports.initSocket = (server) => {
  const socketIO = require("socket.io");

  io = socketIO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);
    let connectedDeliveryPartnerId = null;

    socket.on("joinUserRoom", (userId) => {
      socket.join(`user_${userId}`);
    });

    socket.on("joinRestaurantRoom", (restaurantId) => {
      socket.join(`restaurant_${restaurantId}`);
    });

    socket.on("joinDeliveryRoom", (partnerId) => {
      connectedDeliveryPartnerId = Number(partnerId);
      socket.join(`delivery_${partnerId}`);
    });

    socket.on("registerDeliveryPartner", (partnerId) => {
      connectedDeliveryPartnerId = Number(partnerId);
      socket.join(`delivery_${partnerId}`);
    });

    socket.on("joinAdminRoom", () => {
      socket.join("admin");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
      if (connectedDeliveryPartnerId) {
        const { handlePartnerDisconnected } = require("../services/deliveryAssignment.service");
        handlePartnerDisconnected(connectedDeliveryPartnerId).catch((error) => {
          console.error("Delivery disconnect handling failed:", error.message);
        });
      }
    });
  });

  return io;
};

exports.emitOrderCreated = (order) => {
  if (!io) return;
  io.to(`restaurant_${order.restaurantId}`).emit("newOrder", order);
  io.to(`user_${order.userId}`).emit("orderPlaced", order);
};

exports.emitOrderStatusUpdate = (order) => {
  if (!io) return;
  io.to(`user_${order.userId}`).emit("orderStatusUpdated", order);
  io.to(`restaurant_${order.restaurantId}`).emit("orderStatusUpdated", order);

  if (order.deliveryPartnerId) {
    io.to(`delivery_${order.deliveryPartnerId}`).emit("deliveryUpdate", order);
  }
};

exports.emitDeliveryLocationUpdate = (order) => {
  if (!io || !order) return;

  const payload = {
    orderId: order.id,
    restaurantId: order.restaurantId,
    userId: order.userId,
    deliveryPartnerId: order.deliveryPartnerId,
    deliveryLat: order.deliveryLat,
    deliveryLng: order.deliveryLng,
    status: order.status,
    deliveryStatus: order.deliveryStatus,
    updatedAt: new Date().toISOString(),
  };

  io.to(`user_${order.userId}`).emit("deliveryLocationUpdated", payload);
  io.to(`restaurant_${order.restaurantId}`).emit("deliveryLocationUpdated", payload);

  if (order.deliveryPartnerId) {
    io.to(`delivery_${order.deliveryPartnerId}`).emit("deliveryLocationUpdated", payload);
  }
};

exports.emitDeliveryRequest = (partnerId, payload) => {
  if (!io) return;
  io.to(`delivery_${partnerId}`).emit("deliveryAssignmentRequest", payload);
};

exports.emitDeliveryRequestExpired = (partnerId, payload) => {
  if (!io) return;
  io.to(`delivery_${partnerId}`).emit("deliveryAssignmentExpired", payload);
};

exports.emitDeliveryRequestRejected = (partnerId, payload) => {
  if (!io) return;
  io.to(`delivery_${partnerId}`).emit("deliveryAssignmentRejected", payload);
};

exports.emitDeliveryAssigned = (order, partner) => {
  if (!io) return;

  const payload = {
    orderId: order.id,
    deliveryPartnerId: partner.id,
    deliveryPartnerName: partner.name,
    status: order.status,
    deliveryStatus: order.deliveryStatus,
  };

  io.to(`restaurant_${order.restaurantId}`).emit("deliveryAssigned", payload);
  io.to(`user_${order.userId}`).emit("deliveryAssigned", payload);
  io.to(`delivery_${partner.id}`).emit("deliveryAssignmentAccepted", payload);
};

exports.emitDeliveryNotAssigned = (order) => {
  if (!io) return;

  const payload = {
    orderId: order.id,
    restaurantId: order.restaurantId,
    deliveryStatus: order.deliveryStatus,
    message: "No delivery partner accepted this order",
  };

  io.to(`restaurant_${order.restaurantId}`).emit("deliveryNotAssigned", payload);
  io.to("admin").emit("deliveryNotAssigned", payload);
};
