const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Payout", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    payoutNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    restaurantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    approvedAmount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "approved",
        "processing",
        "paid",
        "failed",
        "reversed",
        "on_hold",
        "reconciliation_required"
      ),
      defaultValue: "pending",
    },
    beneficiaryName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    accountNumberMasked: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ifscCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bankName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    upiId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentMode: {
      type: DataTypes.ENUM("NEFT", "RTGS", "IMPS", "UPI", "MANUAL_BANK_TRANSFER"),
      defaultValue: "MANUAL_BANK_TRANSFER",
    },
    utrNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    failureReason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reconciliationStatus: {
      type: DataTypes.ENUM("unverified", "matched", "discrepancy"),
      defaultValue: "unverified",
    },
    reconciliationNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    initiatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    processedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
};
