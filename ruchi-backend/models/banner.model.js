const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Banner", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING },
    image: { type: DataTypes.STRING },
    link: { type: DataTypes.STRING },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  });
};