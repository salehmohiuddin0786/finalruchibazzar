const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("AuditLog", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    action: { type: DataTypes.STRING },
    entity: { type: DataTypes.STRING },
    entityId: { type: DataTypes.INTEGER },
    performedBy: { type: DataTypes.STRING },
  });
};