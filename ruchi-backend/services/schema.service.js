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
