const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Offer", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    couponCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    // ✅ Better precision than FLOAT
    discountPercent: {
      type: DataTypes.DECIMAL(5, 2), // e.g. 10.50%
      allowNull: false,
    },

    // ✅ OPTIONAL (VERY IMPORTANT FEATURES)
    minOrderAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    maxDiscount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },

    usageLimit: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    usedCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    validFrom: {
      type: DataTypes.DATE,
    },

    validTo: {
      type: DataTypes.DATE,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });
};