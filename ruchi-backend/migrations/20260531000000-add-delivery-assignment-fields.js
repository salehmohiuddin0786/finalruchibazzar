"use strict";

const deliveryStatuses = [
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
  "delivered",
];

module.exports = {
  async up(queryInterface, Sequelize) {
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

    await queryInterface.changeColumn("Orders", "deliveryStatus", {
      type: Sequelize.ENUM(...deliveryStatuses),
      defaultValue: "NOT_ASSIGNED",
    });

    await queryInterface.addColumn("Orders", "assignmentExpiresAt", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.changeColumn("Users", "role", {
      type: Sequelize.ENUM("customer", "partner", "delivery", "admin"),
      allowNull: false,
      defaultValue: "customer",
    });

    await queryInterface.addColumn("DeliveryPartners", "role", {
      type: Sequelize.ENUM("delivery", "partner"),
      defaultValue: "delivery",
    });
    await queryInterface.addColumn("DeliveryPartners", "isActive", {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    });
    await queryInterface.addColumn("DeliveryPartners", "currentLat", {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    await queryInterface.addColumn("DeliveryPartners", "currentLng", {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    await queryInterface.addColumn("DeliveryPartners", "rating", {
      type: Sequelize.FLOAT,
      defaultValue: 5,
    });
    await queryInterface.addColumn("DeliveryPartners", "totalDeliveries", {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("DeliveryPartners", "totalDeliveries");
    await queryInterface.removeColumn("DeliveryPartners", "rating");
    await queryInterface.removeColumn("DeliveryPartners", "currentLng");
    await queryInterface.removeColumn("DeliveryPartners", "currentLat");
    await queryInterface.removeColumn("DeliveryPartners", "isActive");
    await queryInterface.removeColumn("DeliveryPartners", "role");
    await queryInterface.removeColumn("Orders", "assignmentExpiresAt");

    await queryInterface.changeColumn("Orders", "deliveryStatus", {
      type: Sequelize.ENUM("not_assigned", "assigned", "picked", "on_the_way", "delivered"),
      defaultValue: "not_assigned",
    });

    await queryInterface.changeColumn("Orders", "status", {
      type: Sequelize.ENUM("pending", "accepted", "preparing", "ready", "picked_up", "delivered", "cancelled"),
      defaultValue: "pending",
    });

    await queryInterface.changeColumn("Users", "role", {
      type: Sequelize.ENUM("customer", "partner", "admin"),
      allowNull: false,
      defaultValue: "customer",
    });
  },
};
