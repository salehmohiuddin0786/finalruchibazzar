/**
 * Ruchi Bazaar - Database Cleaner Script
 * Cleans all sample/operational data and keeps ONLY the Super Admin account.
 *
 * Usage:
 *   node cleanDatabase.js
 */

require("dotenv").config();
const { sequelize, User } = require("./models");

async function cleanDatabase() {
  console.log("==================================================");
  console.log("   🧹 RUCHI BAZAAR - DATABASE CLEANER             ");
  console.log("==================================================\n");

  try {
    await sequelize.authenticate();
    console.log("✅ Database connected.\n");

    // Disable foreign key checks for clean truncation / deletion
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0;");

    const tablesToClear = [
      "support_messages",
      "support_conversations",
      "carts",
      "orderitems",
      "earnings",
      "orders",
      "useraddresses",
      "reviews",
      "offers",
      "dishes",
      "restaurants",
      "deliverypartners",
      "banners",
      "auditlogs",
    ];

    for (const table of tablesToClear) {
      try {
        await sequelize.query(`TRUNCATE TABLE \`${table}\`;`);
        console.log(`🧹 Emptied table: ${table}`);
      } catch (err) {
        // Fallback to DELETE if TRUNCATE has foreign key issue
        await sequelize.query(`DELETE FROM \`${table}\`;`);
        console.log(`🧹 Deleted rows from: ${table}`);
      }
    }

    // Delete all users who are not admin
    await sequelize.query("DELETE FROM `users` WHERE `role` != 'admin';");
    console.log("🧹 Deleted all non-admin users.");

    // Ensure super admin id is 1 and auto_increment is set to 2
    const adminUser = await User.findOne({ where: { role: "admin" } });
    if (adminUser) {
      await sequelize.query(`UPDATE \`users\` SET \`id\` = 1 WHERE \`id\` = ${adminUser.id};`);
      await sequelize.query("ALTER TABLE `users` AUTO_INCREMENT = 2;");
      console.log(`✅ Super Admin preserved as User #1 (${adminUser.email}).`);
    } else {
      console.log("⚠️ No Super Admin found! Please run: npm run create-admin");
    }

    // Re-enable foreign key checks
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1;");

    console.log("\n==================================================");
    console.log("🎉 DATABASE CLEANED SUCCESSFULLY!");
    console.log("Only Super Admin remains in the entire database.");
    console.log("==================================================\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Cleanup failed:", error.message);
    process.exit(1);
  }
}

cleanDatabase();
