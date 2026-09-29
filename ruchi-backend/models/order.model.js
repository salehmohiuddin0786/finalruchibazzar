const { DataTypes } = require("sequelize");
const { ORDER_STATUS, PAYMENT_STATUS, DELIVERY_STATUS } = require("../config/constants");

module.exports = (sequelize) => {
  return sequelize.define("Order", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    restaurantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    userId: {
      type: DataTypes.INTEGER,
    },

    // 💰 PRICING
    originalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    discount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    couponCode: {
      type: DataTypes.STRING,
    },

    // 📦 ORDER STATUS
    status: {
      type: DataTypes.ENUM(...Object.values(ORDER_STATUS)),
      defaultValue: ORDER_STATUS.PENDING,
    },

    paymentStatus: {
      type: DataTypes.ENUM(...Object.values(PAYMENT_STATUS)),
      defaultValue: PAYMENT_STATUS.PENDING,
    },

    deliveryAddress: {
      type: DataTypes.STRING,
    },

    // 🚚 DELIVERY PARTNER
    deliveryPartnerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    // 📍 DELIVERY STATUS
    deliveryStatus: {
      type: DataTypes.ENUM(...Object.values(DELIVERY_STATUS)),
      defaultValue: DELIVERY_STATUS.NOT_ASSIGNED,
    },

    assignmentExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    // ⏱️ TRACKING
    pickedAt: {
      type: DataTypes.DATE,
    },

    deliveredAt: {
      type: DataTypes.DATE,
    },

    // 📍 LIVE LOCATION (optional)
    deliveryLat: {
      type: DataTypes.FLOAT,
    },

    deliveryLng: {
      type: DataTypes.FLOAT,
    },
  });
};
