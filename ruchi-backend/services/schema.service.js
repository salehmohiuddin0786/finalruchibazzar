const { sequelize } = require("../models");

const tableExists = async (queryInterface, tableName) => {
  try {
    await queryInterface.describeTable(tableName);
    return true;
  } catch {
    return false;
  }
};

const addColumnIfMissing = async (queryInterface, Sequelize, tableName, columnName, definition) => {
  try {
    const table = await queryInterface.describeTable(tableName);
    if (!table[columnName]) {
      await queryInterface.addColumn(tableName, columnName, definition);
    }
  } catch (err) {
    // Column might already exist or table not available
  }
};

exports.ensureDeliveryAssignmentSchema = async () => {
  const queryInterface = sequelize.getQueryInterface();
  const Sequelize = sequelize.Sequelize;

  try {
    if (await tableExists(queryInterface, "Orders")) {
      try {
        await queryInterface.changeColumn("Orders", "status", {
          type: Sequelize.ENUM(
            "pending",
            "confirmed",
            "accepted",
            "preparing",
            "ready",
            "READY_FOR_PICKUP",
            "OUT_FOR_DELIVERY",
            "picked_up",
            "delivered",
            "cancelled"
          ),
          defaultValue: "pending",
        });
      } catch (err) {
        // ENUM or column already up to date in MySQL
      }

      try {
        await sequelize.query("UPDATE Orders SET status = 'pending' WHERE status IS NULL OR status = ''");
      } catch {}

      try {
        await sequelize.query("UPDATE Orders SET deliveryStatus = UPPER(deliveryStatus) WHERE deliveryStatus IS NOT NULL AND deliveryStatus != ''");
        await sequelize.query("UPDATE Orders SET deliveryStatus = 'NOT_ASSIGNED' WHERE deliveryStatus IS NULL OR deliveryStatus = ''");
      } catch {
        // Ignore if table/columns don't exist yet
      }

      try {
        await queryInterface.changeColumn("Orders", "deliveryStatus", {
          type: Sequelize.ENUM(
            "NOT_ASSIGNED",
            "ASSIGNING",
            "ASSIGNED",
            "PICKED",
            "ON_THE_WAY",
            "DELIVERED",
            "CANCELLED"
          ),
          defaultValue: "NOT_ASSIGNED",
        });
      } catch (err) {
        // Safe catch: MySQL may complain if ENUM already has duplicate/identical values
      }

      await addColumnIfMissing(queryInterface, Sequelize, "Orders", "assignmentExpiresAt", {
        type: Sequelize.DATE,
        allowNull: true,
      });

      // 💳 FINTECH & PAYMENT FIELDS
      await addColumnIfMissing(queryInterface, Sequelize, "Orders", "subtotal", {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      });
      await addColumnIfMissing(queryInterface, Sequelize, "Orders", "taxAmount", {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      });
      await addColumnIfMissing(queryInterface, Sequelize, "Orders", "deliveryFee", {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      });
      await addColumnIfMissing(queryInterface, Sequelize, "Orders", "platformFee", {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      });
      await addColumnIfMissing(queryInterface, Sequelize, "Orders", "paymentMethod", {
        type: Sequelize.STRING,
        defaultValue: "cash",
      });
      await addColumnIfMissing(queryInterface, Sequelize, "Orders", "gatewayTransactionId", {
        type: Sequelize.STRING,
        allowNull: true,
      });
      await addColumnIfMissing(queryInterface, Sequelize, "Orders", "distanceKm", {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      });
      await addColumnIfMissing(queryInterface, Sequelize, "Orders", "discountFundedBy", {
        type: Sequelize.ENUM("restaurant", "platform", "none"),
        defaultValue: "none",
      });
      await addColumnIfMissing(queryInterface, Sequelize, "Orders", "restaurantFundedDiscount", {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      });
      await addColumnIfMissing(queryInterface, Sequelize, "Orders", "platformFundedDiscount", {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      });
      await addColumnIfMissing(queryInterface, Sequelize, "Orders", "platformCommission", {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      });
      await addColumnIfMissing(queryInterface, Sequelize, "Orders", "restaurantEarning", {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      });
      await addColumnIfMissing(queryInterface, Sequelize, "Orders", "deliveryEarning", {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      });
    }

    if (await tableExists(queryInterface, "Offers")) {
      await addColumnIfMissing(queryInterface, Sequelize, "Offers", "fundedBy", {
        type: Sequelize.ENUM("restaurant", "platform"),
        defaultValue: "restaurant",
      });
    }

    if (await tableExists(queryInterface, "Earnings")) {
      await addColumnIfMissing(queryInterface, Sequelize, "Earnings", "restaurantId", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
      await addColumnIfMissing(queryInterface, Sequelize, "Earnings", "grossFoodSales", {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      });
      await addColumnIfMissing(queryInterface, Sequelize, "Earnings", "taxAmount", {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      });
      await addColumnIfMissing(queryInterface, Sequelize, "Earnings", "discountAmount", {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      });
      await addColumnIfMissing(queryInterface, Sequelize, "Earnings", "restaurantFundedDiscount", {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      });
      await addColumnIfMissing(queryInterface, Sequelize, "Earnings", "platformFundedDiscount", {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      });
      await addColumnIfMissing(queryInterface, Sequelize, "Earnings", "commissionRate", {
        type: Sequelize.FLOAT,
        defaultValue: 2,
      });
      await addColumnIfMissing(queryInterface, Sequelize, "Earnings", "status", {
        type: Sequelize.ENUM("accrued", "settled", "reversed", "cancelled"),
        defaultValue: "accrued",
      });
      await addColumnIfMissing(queryInterface, Sequelize, "Earnings", "settlementId", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
      await addColumnIfMissing(queryInterface, Sequelize, "Earnings", "payoutId", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

    if (await tableExists(queryInterface, "Restaurants")) {
      await addColumnIfMissing(queryInterface, Sequelize, "Restaurants", "payoutSchedule", {
        type: Sequelize.STRING,
        defaultValue: "weekly",
      });
      await addColumnIfMissing(queryInterface, Sequelize, "Restaurants", "commissionRate", {
        type: Sequelize.FLOAT,
        defaultValue: 2,
      });
    }

    if (await tableExists(queryInterface, "Payments")) {
      await addColumnIfMissing(queryInterface, Sequelize, "Payments", "foodSubtotal", {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      });
      await addColumnIfMissing(queryInterface, Sequelize, "Payments", "taxAmount", {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      });
      await addColumnIfMissing(queryInterface, Sequelize, "Payments", "deliveryFee", {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      });
    }

    if (await tableExists(queryInterface, "Users")) {
      try {
        await queryInterface.changeColumn("Users", "role", {
          type: Sequelize.ENUM("customer", "partner", "delivery", "admin"),
          allowNull: false,
          defaultValue: "customer",
        });
      } catch (err) {
        // Column already matches
      }
    }

    if (await tableExists(queryInterface, "DeliveryPartners")) {
      await addColumnIfMissing(queryInterface, Sequelize, "DeliveryPartners", "role", {
        type: Sequelize.ENUM("delivery", "partner"),
        defaultValue: "delivery",
      });
      await addColumnIfMissing(queryInterface, Sequelize, "DeliveryPartners", "isActive", {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      });
      await addColumnIfMissing(queryInterface, Sequelize, "DeliveryPartners", "currentLat", {
        type: Sequelize.FLOAT,
        allowNull: true,
      });
      await addColumnIfMissing(queryInterface, Sequelize, "DeliveryPartners", "currentLng", {
        type: Sequelize.FLOAT,
        allowNull: true,
      });
      await addColumnIfMissing(queryInterface, Sequelize, "DeliveryPartners", "rating", {
        type: Sequelize.FLOAT,
        defaultValue: 5,
      });
      await addColumnIfMissing(queryInterface, Sequelize, "DeliveryPartners", "totalDeliveries", {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      });
    }
  } catch (err) {
    console.warn("⚠️ Non-fatal schema migration notice:", err.message);
  }
};
