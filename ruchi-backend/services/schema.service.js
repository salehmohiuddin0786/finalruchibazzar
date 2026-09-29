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
  const table = await queryInterface.describeTable(tableName);
  if (!table[columnName]) {
    await queryInterface.addColumn(tableName, columnName, definition);
  }
};

exports.ensureDeliveryAssignmentSchema = async () => {
  const queryInterface = sequelize.getQueryInterface();
  const Sequelize = sequelize.Sequelize;

  if (await tableExists(queryInterface, "Orders")) {
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

    await sequelize.query("UPDATE Orders SET status = 'pending' WHERE status IS NULL OR status = ''");

    await queryInterface.changeColumn("Orders", "deliveryStatus", {
      type: Sequelize.ENUM(
        "NOT_ASSIGNED",
        "ASSIGNING",
        "ASSIGNED",
        "PICKED",
        "ON_THE_WAY",
        "DELIVERED",
        "not_assigned",
        "assigned",
        "picked",
        "on_the_way",
        "delivered"
      ),
      defaultValue: "NOT_ASSIGNED",
    });

    await sequelize.query("UPDATE Orders SET deliveryStatus = 'NOT_ASSIGNED' WHERE deliveryStatus IS NULL OR deliveryStatus = ''");

    await addColumnIfMissing(queryInterface, Sequelize, "Orders", "assignmentExpiresAt", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  }

  if (await tableExists(queryInterface, "Users")) {
    await queryInterface.changeColumn("Users", "role", {
      type: Sequelize.ENUM("customer", "partner", "delivery", "admin"),
      allowNull: false,
      defaultValue: "customer",
    });
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
};
