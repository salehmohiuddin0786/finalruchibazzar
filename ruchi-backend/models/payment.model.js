const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Payment", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    paymentMethod: {
      type: DataTypes.ENUM("cash", "upi", "card", "netbanking"),
      defaultValue: "cash",
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: "INR",
    },
    status: {
      type: DataTypes.ENUM("pending", "success", "failed", "refunded"),
      defaultValue: "pending",
    },
    gatewayTransactionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gatewayOrderId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gatewaySignature: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gatewayFee: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    netAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    failureReason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });
};
