const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const SupportConversation = sequelize.define(
    "SupportConversation",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      sessionId: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      userName: {
        type: DataTypes.STRING(120),
        allowNull: false,
        defaultValue: "Guest User",
      },
      userEmail: {
        type: DataTypes.STRING(120),
        allowNull: true,
      },
      userPhone: {
        type: DataTypes.STRING(32),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("open", "in_progress", "resolved"),
        allowNull: false,
        defaultValue: "open",
      },
      lastMessage: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      lastSender: {
        type: DataTypes.ENUM("user", "agent", "system"),
        allowNull: true,
        defaultValue: "user",
      },
      unreadUserCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      unreadAdminCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      lastActivityAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "support_conversations",
      timestamps: true,
      indexes: [
        { fields: ["sessionId"], unique: true },
        { fields: ["userId"] },
        { fields: ["status"] },
        { fields: ["lastActivityAt"] },
      ],
    }
  );

  return SupportConversation;
};
