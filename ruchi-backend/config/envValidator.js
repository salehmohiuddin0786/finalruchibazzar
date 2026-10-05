/**
 * Production Environment Variables Validator
 * Validates critical configuration on server startup without leaking secret values.
 */

const INSECURE_JWT_SECRETS = new Set([
  "secret123",
  "supersecretkey",
  "123456",
  "jwtsecret",
  "changeme",
  "password",
]);

exports.validateEnv = () => {
  const isProduction = process.env.NODE_ENV === "production";
  const missing = [];

  const required = [
    { key: "DB_NAME", desc: "Database Name" },
    { key: "DB_USER", desc: "Database Username" },
    { key: "DB_HOST", desc: "Database Host" },
  ];

  required.forEach(({ key, desc }) => {
    if (!process.env[key] || String(process.env[key]).trim() === "") {
      missing.push(`${key} (${desc})`);
    }
  });

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret || String(jwtSecret).trim() === "") {
    if (isProduction) {
      missing.push("JWT_SECRET (Authentication Secret)");
    } else {
      console.warn("⚠️  [SECURITY WARNING] JWT_SECRET is not set in development. Using temporary development secret.");
      process.env.JWT_SECRET = "dev_temporary_secret_key_ruchibazaar_2026";
    }
  } else if (isProduction) {
    if (jwtSecret.length < 32 || INSECURE_JWT_SECRETS.has(jwtSecret.toLowerCase())) {
      console.error(
        "❌ [CRITICAL SECURITY ERROR] JWT_SECRET in production must be a secure, random string of at least 32 characters."
      );
      process.exit(1);
    }
  }

  if (missing.length > 0) {
    console.error("❌ [CONFIG ERROR] Missing required environment variable(s):");
    missing.forEach((item) => console.error(`   - ${item}`));
    console.error("Please configure these variables in your .env or environment before starting the server.");
    process.exit(1);
  }
};
