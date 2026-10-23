/**
 * Ruchi Bazaar - Super Admin Setup & Management Script
 *
 * Usage:
 *   node createSuperAdmin.js <email> <password> [name] [phone]
 *
 * Examples:
 *   node createSuperAdmin.js admin@ruchibazaar.in Admin@1234
 *   node createSuperAdmin.js myadmin@ruchibazaar.in SecretPass99! "Chief Admin" +919999999999
 *
 * If run without arguments, it will prompt interactively or offer default credentials.
 */

require("dotenv").config();
const readline = require("readline");
const bcrypt = require("bcryptjs");
const { sequelize, User } = require("./models");
const { ROLES } = require("./config/constants");

const askQuestion = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans.trim());
    })
  );
};

async function main() {
  console.log("==================================================");
  console.log("   🛡️  RUCHI BAZAAR - SUPER ADMIN CREATOR / RESET   ");
  console.log("==================================================\n");

  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established.\n");
  } catch (dbErr) {
    console.error("❌ Database connection failed:", dbErr.message);
    process.exit(1);
  }

  let [,, cliEmail, cliPassword, cliName, cliPhone] = process.argv;

  let email = cliEmail;
  let password = cliPassword;
  let name = cliName;
  let phone = cliPhone;

  // If arguments not provided via CLI, prompt interactively
  if (!email || !password) {
    console.log("No command line arguments supplied. Enter details below (or press Enter for defaults):\n");

    email = await askQuestion("Admin Email [admin@ruchibazaar.in]: ");
    if (!email) email = "admin@ruchibazaar.in";

    password = await askQuestion("Admin Password [Admin@1234]: ");
    if (!password) password = "Admin@1234";

    name = await askQuestion("Full Name [Super Admin]: ");
    if (!name) name = "Super Admin";

    phone = await askQuestion("Phone Number [+919876543210]: ");
    if (!phone) phone = "+919876543210";
  } else {
    name = name || "Super Admin";
    phone = phone || "+919876543210";
  }

  email = String(email).trim().toLowerCase();
  password = String(password).trim();
  name = String(name).trim();
  phone = String(phone).trim();

  if (!email || !email.includes("@")) {
    console.error("❌ Error: Invalid email address.");
    process.exit(1);
  }

  if (password.length < 6) {
    console.error("❌ Error: Password must be at least 6 characters.");
    process.exit(1);
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user with this email or phone exists
    let user = await User.findOne({ where: { email } });

    if (user) {
      console.log(`ℹ️  Existing account found with email "${email}". Updating to Super Admin...`);
      user.name = name;
      user.password = hashedPassword;
      user.role = ROLES.ADMIN;
      user.isActive = true;
      user.isVerified = true;
      user.authProvider = "password";
      if (phone) user.phone = phone;
      await user.save();
      console.log("✅ Admin account successfully updated!");
    } else {
      // Check phone uniqueness before creating
      const phoneUser = await User.findOne({ where: { phone } });
      if (phoneUser) {
        console.log(`ℹ️  Phone "${phone}" belongs to user "${phoneUser.email}". Updating role & password...`);
        phoneUser.email = email;
        phoneUser.name = name;
        phoneUser.password = hashedPassword;
        phoneUser.role = ROLES.ADMIN;
        phoneUser.isActive = true;
        phoneUser.isVerified = true;
        phoneUser.authProvider = "password";
        await phoneUser.save();
        console.log("✅ Admin account successfully updated!");
      } else {
        await User.create({
          name,
          email,
          phone,
          password: hashedPassword,
          role: ROLES.ADMIN,
          isActive: true,
          isVerified: true,
          authProvider: "password",
        });
        console.log("✅ New Super Admin account created successfully!");
      }
    }

    console.log("\n==================================================");
    console.log("🎉 SUPER ADMIN CREDENTIALS READY");
    console.log("==================================================");
    console.log(`📧 Email   : ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`👤 Name    : ${name}`);
    console.log(`📱 Phone   : ${phone}`);
    console.log(`👑 Role    : admin`);
    console.log("--------------------------------------------------");
    console.log("🌐 Login Portals:");
    console.log("   1. Main Admin Portal : https://mainadmin.ruchibazaar.in/Login");
    console.log("   2. Partner/Admin Hub : https://admin.ruchibazaar.in/Login");
    console.log("==================================================\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to create/update Super Admin:", err.message);
    process.exit(1);
  }
}

main();
