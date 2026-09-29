const { DataTypes } = require("sequelize");

// ✅ ROLES (centralized & reusable)
const ROLES = {
  CUSTOMER: "customer",
  PARTNER: "partner",
  DELIVERY: "delivery",
  ADMIN: "admin",
};

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      // 👤 BASIC INFO
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: true, // ✅ optional (OTP users may not give email)
        unique: true,
        validate: {
          isEmail: true,
        },
      },

      phone: {
        type: DataTypes.STRING,
        allowNull: false, // ✅ REQUIRED for OTP login
        unique: true,
        validate: {
          is: /^\+?[1-9]\d{9,14}$/, // ✅ valid phone format
        },
      },

      password: {
        type: DataTypes.STRING,
        allowNull: true, // ✅ optional (OTP users don’t need password)
      },

      // 🔐 ROLE SYSTEM
      role: {
        type: DataTypes.ENUM(...Object.values(ROLES)),
        allowNull: false,
        defaultValue: ROLES.CUSTOMER,
      },

      // 🟢 ACCOUNT STATUS
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },

      // ✅ OTP VERIFICATION STATUS
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      // 🔐 AUTH PROVIDER (future proof)
      authProvider: {
        type: DataTypes.ENUM("otp", "password", "google"),
        defaultValue: "otp",
      },

      // =========================
      // 🚚 DELIVERY PARTNER FIELDS
      // =========================

      vehicleType: {
        type: DataTypes.ENUM("bike", "scooter", "car"),
        allowNull: true,
      },

      isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      // 📍 CURRENT LOCATION
      currentLat: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },

      currentLng: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },

      // ⭐ RATING SYSTEM
      rating: {
        type: DataTypes.FLOAT,
        defaultValue: 5.0,
      },

      totalDeliveries: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      timestamps: true,
      tableName: "Users",

      indexes: [
        {
          unique: true,
          fields: ["email"],
        },
        {
          unique: true,
          fields: ["phone"],
        },
        {
          fields: ["role"],
        },
      ],
    }
  );

  // ✅ EXPORT ROLES
  User.ROLES = ROLES;

  return User;
};
