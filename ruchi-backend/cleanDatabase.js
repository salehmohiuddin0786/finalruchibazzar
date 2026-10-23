/**
 * Ruchi Bazaar - Dynamic Database Cleaner Script
 * Cleans all sample/operational data and keeps ONLY the Super Admin account.
 * Works dynamically across Windows and Linux (handles case-sensitivity & missing tables).
 *
 * Usage:
 *   node cleanDatabase.js
 */

require("dotenv").config();
const { sequelize } = require("./models");

async function cleanDatabase() {
  console.log("==================================================");
  console.log("   🧹 RUCHI BAZAAR - DATABASE CLEANER             ");
  console.log("==================================================\n");

  try {
    await sequelize.authenticate();
    console.log("✅ Database connected.\n");

    // Disable foreign key checks for clean truncation / deletion
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0;");

    // Fetch all existing tables in the database
    const [tablesResult] = await sequelize.query("SHOW TABLES;");
    const existingTables = tablesResult.map((row) => Object.values(row)[0]);

    console.log(`📋 Found ${existingTables.length} tables in database: ${existingTables.join(", ")}\n`);

    // Find the users table (case-insensitive check for 'users')
    const userTable = existingTables.find((t) => t.toLowerCase() === "users");

    for (const table of existingTables) {
      // Skip users table and SequelizeMeta / migrations table
      if (table.toLowerCase() === "users" || table.toLowerCase() === "sequelize_meta" || table.toLowerCase() === "sequelizemeta") {
        continue;
      }

      try {
        await sequelize.query(`TRUNCATE TABLE \`${table}\`;`);
        console.log(`🧹 Emptied table: ${table}`);
      } catch (err) {
        try {
          await sequelize.query(`DELETE FROM \`${table}\`;`);
          console.log(`🧹 Emptied table (via DELETE): ${table}`);
        } catch (innerErr) {
          console.warn(`⚠️ Could not empty table ${table}: ${innerErr.message}`);
        }
      }
    }

    if (userTable) {
      // Delete all users who are not admin
      await sequelize.query(`DELETE FROM \`${userTable}\` WHERE \`role\` != 'admin';`);
      console.log(`🧹 Deleted all non-admin users from \`${userTable}\`.`);

      // Find super admin
      const [admins] = await sequelize.query(
        `SELECT id, email, name FROM \`${userTable}\` WHERE \`role\` = 'admin' LIMIT 1;`
      );

      if (admins && admins.length > 0) {
        const adminId = admins[0].id;
        if (adminId !== 1) {
          await sequelize.query(`UPDATE \`${userTable}\` SET \`id\` = 1 WHERE \`id\` = ${adminId};`);
        }
        await sequelize.query(`ALTER TABLE \`${userTable}\` AUTO_INCREMENT = 2;`);
        console.log(`✅ Super Admin preserved as User #1 (${admins[0].email}).`);
      } else {
        console.log("⚠️ No Super Admin found in users table! You can run 'npm run create-admin' to create one.");
      }
    } else {
      console.warn("⚠️ Users table not found in database.");
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
