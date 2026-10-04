const express = require("express");
const cors = require("cors");
const path = require("path");

const apiLimiter = require("./middlewares/rateLimit.middleware");
const { errorHandler } = require("./middlewares/error.middleware");

const userRoutes = require("./routes/user.routes");

const app = express();

/*
|--------------------------------------------------------------------------
| Global Middlewares
|--------------------------------------------------------------------------
*/

app.use(
  cors({
    origin: [
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
      "https://ruchibazaar.in"
    ],
    credentials: true,
  })
);

// ✅ Body parsers
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// ✅ Static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/*
|--------------------------------------------------------------------------
| Rate Limiting
|--------------------------------------------------------------------------
*/
app.use("/api", apiLimiter);

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
