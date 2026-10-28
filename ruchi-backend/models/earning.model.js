const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Earning", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    restaurantId: { type: DataTypes.INTEGER, allowNull: true },
    orderId: { type: DataTypes.INTEGER, allowNull: true },
    grossFoodSales: { type: DataTypes.FLOAT, defaultValue: 0 },
    taxAmount: { type: DataTypes.FLOAT, defaultValue: 0 },
    discountAmount: { type: DataTypes.FLOAT, defaultValue: 0 },
    restaurantFundedDiscount: { type: DataTypes.FLOAT, defaultValue: 0 },
    platformFundedDiscount: { type: DataTypes.FLOAT, defaultValue: 0 },
    commissionRate: { type: DataTypes.FLOAT, defaultValue: 2 },
    restaurantEarning: { type: DataTypes.FLOAT, defaultValue: 0 },
    platformCommission: { type: DataTypes.FLOAT, defaultValue: 0 },
    deliveryEarning: { type: DataTypes.FLOAT, defaultValue: 0 },
    status: {
      type: DataTypes.ENUM("accrued", "settled", "reversed", "cancelled"),
      defaultValue: "accrued",
    },
    settlementId: { type: DataTypes.INTEGER, allowNull: true },
    payoutId: { type: DataTypes.INTEGER, allowNull: true },
  });
};
