const { getAllowedOrigins } = require("../config/corsOptions");

let io;

exports.initSocket = (server) => {
  const socketIO = require("socket.io");

  io = socketIO(server, {
    cors: {
      origin: getAllowedOrigins(),
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    let connectedDeliveryPartnerId = null;

    socket.on("joinUserRoom", (userId) => {
      const cleanId = Number(userId);
      if (cleanId > 0) {
        socket.join(`user_${cleanId}`);
      }
    });

    socket.on("joinRestaurantRoom", (restaurantId) => {
      const cleanId = Number(restaurantId);
      if (cleanId > 0) {
        socket.join(`restaurant_${cleanId}`);
      }
    });

    socket.on("joinDeliveryRoom", (partnerId) => {
      const cleanId = Number(partnerId);
      if (cleanId > 0) {
        connectedDeliveryPartnerId = cleanId;
        socket.join(`delivery_${cleanId}`);
      }
    });

    socket.on("registerDeliveryPartner", (partnerId) => {
      const cleanId = Number(partnerId);
      if (cleanId > 0) {
        connectedDeliveryPartnerId = cleanId;
        socket.join(`delivery_${cleanId}`);
      }
    });

    socket.on("joinAdminRoom", () => {
      socket.join("admin");
    });

    socket.on("joinChatRoom", (conversationId) => {
      if (conversationId) {
        socket.join(`chat_${conversationId}`);
      }
    });

    socket.on("leaveChatRoom", (conversationId) => {
      if (conversationId) {
        socket.leave(`chat_${conversationId}`);
      }
    });

    socket.on("chatTyping", ({ conversationId, senderName, isTyping }) => {
      if (conversationId) {
        socket.to(`chat_${conversationId}`).emit("chatTyping", {
          conversationId,
          senderName,
          isTyping,
        });
      }
    });

    socket.on("disconnect", () => {
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
  if (!io || !order) return;
  console.log(`📡 Socket: Emitting newOrder for Order #${order.id || order.orderId} (Restaurant: ${order.restaurantId})`);

  // Specific restaurant room
  if (order.restaurantId) {
    io.to(`restaurant_${order.restaurantId}`).emit("newOrder", order);
  }

  // Admin room and general broadcasts so open partner/admin portals receive the alert
  io.to("admin").emit("newOrder", order);
  io.to("admin").emit("adminNewOrder", order);
  io.emit("adminNewOrder", order);

  // User room for customer live updates
  if (order.userId) {
    io.to(`user_${order.userId}`).emit("orderPlaced", order);
  }
};

exports.emitOrderStatusUpdate = (order) => {
  if (!io || !order) return;
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
  if (!io || !partnerId) return;
  io.to(`delivery_${partnerId}`).emit("deliveryAssignmentRequest", payload);
};

exports.emitDeliveryRequestExpired = (partnerId, payload) => {
  if (!io || !partnerId) return;
  io.to(`delivery_${partnerId}`).emit("deliveryAssignmentExpired", payload);
};

exports.emitDeliveryRequestRejected = (partnerId, payload) => {
  if (!io || !partnerId) return;
  io.to(`delivery_${partnerId}`).emit("deliveryAssignmentRejected", payload);
};

exports.emitDeliveryAssigned = (order, partner) => {
  if (!io || !order || !partner) return;

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
  if (!io || !order) return;

  const payload = {
    orderId: order.id,
    restaurantId: order.restaurantId,
    deliveryStatus: order.deliveryStatus,
    message: "No delivery partner accepted this order",
  };

  io.to(`restaurant_${order.restaurantId}`).emit("deliveryNotAssigned", payload);
  io.to("admin").emit("deliveryNotAssigned", payload);
};

exports.emitChatMessage = (conversationId, message, conversation) => {
  if (!io || !conversationId) return;

  // Emit to users listening to this specific conversation room
  io.to(`chat_${conversationId}`).emit("newChatMessage", {
    conversationId,
    message,
    conversation,
  });

  // Also notify admins monitoring the support inbox
  io.to("admin").emit("adminChatUpdate", {
    conversationId,
    message,
    conversation,
  });
};
