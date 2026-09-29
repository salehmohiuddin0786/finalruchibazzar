const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Earning", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    restaurantEarning: { type: DataTypes.FLOAT },
    platformCommission: { type: DataTypes.FLOAT },
    deliveryEarning: { type: DataTypes.FLOAT },
  });
};