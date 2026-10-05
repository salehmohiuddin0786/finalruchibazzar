const DEFAULT_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
  "http://localhost:3004",
  "http://localhost:3005",
  "http://localhost:4000",
  "http://localhost:4001",
  "http://localhost:4002",
  "http://localhost:4003",
  "https://ruchibazaar.in",
  "https://www.ruchibazaar.in",
];

const getAllowedOrigins = () => {
  const envOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean)
    : [];

  const clientUrl = process.env.CLIENT_URL ? [process.env.CLIENT_URL.trim()] : [];

  return Array.from(new Set([...DEFAULT_ORIGINS, ...envOrigins, ...clientUrl]));
};

const corsOptions = {
  origin: (origin, callback) => {
    const allowed = getAllowedOrigins();
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin || allowed.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS policy: Not allowed by CORS origin validation"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

module.exports = {
  getAllowedOrigins,
  corsOptions,
};
