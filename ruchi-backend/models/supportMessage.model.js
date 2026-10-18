const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const SupportMessage = sequelize.define(
    "SupportMessage",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      conversationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      senderType: {
        type: DataTypes.ENUM("user", "agent", "system"),
        allowNull: false,
        defaultValue: "user",
      },
      senderId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      senderName: {
        type: DataTypes.STRING(120),
        allowNull: false,
        defaultValue: "User",
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "support_messages",
      timestamps: true,
      indexes: [
        { fields: ["conversationId"] },
        { fields: ["senderType"] },
        { fields: ["createdAt"] },
      ],
    }
  );

  return SupportMessage;
};
