const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

const { corsOptions } = require("./config/corsOptions");
const { apiLimiter, authLimiter, orderLimiter } = require("./middlewares/rateLimit.middleware");
const { errorHandler } = require("./middlewares/error.middleware");

const userRoutes = require("./routes/user.routes");

const app = express();

// Trust reverse proxy (Nginx, Cloudflare, AWS ALB) for accurate IP rate limiting and protocol detection
app.set("trust proxy", 1);

/*
|--------------------------------------------------------------------------
| Security HTTP Headers (Helmet)
|--------------------------------------------------------------------------
*/
app.use(
  helmet({
    // Allow static assets (like food images in /uploads) to be loaded by frontends running on different origins/ports
    crossOriginResourcePolicy: { policy: "cross-origin" },
    // Allow OAuth popups (e.g. Google Sign-In) to communicate with parent window without COOP blocking window.closed
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    contentSecurityPolicy: false, // Keep disabled on API server to prevent breaking API consumers
  })
);

/*
|--------------------------------------------------------------------------
| CORS Configuration
|--------------------------------------------------------------------------
*/
app.use(cors(corsOptions));

// ✅ Body parsers with safe payload size limits
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// ✅ Static uploads (served safely)
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    dotfiles: "ignore",
    index: false,
    maxAge: "1d",
  })
);

/*
|--------------------------------------------------------------------------
| Rate Limiting
|--------------------------------------------------------------------------
*/
// Global API rate limit
app.use("/api", apiLimiter);

// Strict rate limit on authentication endpoints (brute-force defense)
app.use("/api/auth", authLimiter);
app.use("/api/delivery-partner/login", authLimiter);
app.use("/api/delivery-partner/signup", authLimiter);

// Specific rate limit on order placement
app.use("/api/orders", orderLimiter);

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// 🔐 Auth
app.use("/api/auth", require("./routes/auth.routes"));

// 👤 Users
app.use("/api/users", userRoutes);

// 🛡️ Role-based
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/mainadmin", require("./routes/mainAdmin.routes"));
app.use("/api/partner", require("./routes/partner.routes"));

// 🍽️ Core
app.use("/api/restaurants", require("./routes/restaurant.routes"));
app.use("/api/dishes", require("./routes/dish.routes"));
app.use("/api/orders", require("./routes/order.routes"));

// 🚚 Delivery
app.use("/api/delivery", require("./routes/delivery.routes"));
app.use("/api/delivery-partner", require("./routes/deliveryPartner.routes"));

// 💰 Extra
app.use("/api/earnings", require("./routes/earning.routes"));
app.use("/api/reviews", require("./routes/review.routes"));
app.use("/api/offers", require("./routes/offer.routes"));
app.use("/api/banners", require("./routes/banner.routes"));
app.use("/api/cart", require("./routes/cart.routes"));
app.use("/api/Cart", require("./routes/cart.routes"));
app.use("/api", require("./routes/recaptcha.routes"));

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Ruchi Bazaar API is running",
    environment: process.env.NODE_ENV || "development",
  });
});

/*
|--------------------------------------------------------------------------
| 404 Handler
|--------------------------------------------------------------------------
*/
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/
app.use(errorHandler);

module.exports = app;
