const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "UserAddress",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      type: { type: DataTypes.STRING, defaultValue: "home" },
      street: { type: DataTypes.TEXT, allowNull: false },
      city: { type: DataTypes.STRING, allowNull: true },
      state: { type: DataTypes.STRING, allowNull: true },
      zipCode: { type: DataTypes.STRING, allowNull: true },
      landmark: { type: DataTypes.STRING, allowNull: true },
      phone: { type: DataTypes.STRING, allowNull: true },
      contactName: { type: DataTypes.STRING, allowNull: true },
      latitude: { type: DataTypes.FLOAT, allowNull: true },
      longitude: { type: DataTypes.FLOAT, allowNull: true },
      isDefault: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      timestamps: true,
      tableName: "UserAddresses",
      indexes: [{ fields: ["userId"] }],
    }
  );
};
