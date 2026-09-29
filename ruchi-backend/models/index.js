const { sequelize } = require("../config/db");

/* ================= MODELS ================= */
const User = require("./user.model")(sequelize);
const Restaurant = require("./restaurant.model")(sequelize);
const Dish = require("./dish.model")(sequelize);
const Order = require("./order.model")(sequelize);
const OrderItem = require("./orderItem.model")(sequelize);
const DeliveryPartner = require("./deliveryPartner.model")(sequelize);
const Earning = require("./earning.model")(sequelize);
const Review = require("./review.model")(sequelize);
const Offer = require("./offer.model")(sequelize);
const Banner = require("./banner.model")(sequelize);
const AuditLog = require("./auditLog.model")(sequelize);
const Cart = require("./cart.model")(sequelize);
const UserAddress = require("./userAddress.model")(sequelize);

/* ================= ASSOCIATIONS ================= */
const initAssociations = () => {

  /* ---------- USER ---------- */
  User.hasMany(Restaurant, { foreignKey: "ownerId", as: "restaurants" });
  Restaurant.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

  User.hasMany(Order, { foreignKey: "userId", as: "orders" });
  Order.belongsTo(User, { foreignKey: "userId", as: "user" });

  User.hasMany(Review, { foreignKey: "userId", as: "reviews" });
  Review.belongsTo(User, { foreignKey: "userId", as: "user" });

  User.hasMany(UserAddress, { foreignKey: "userId", as: "addresses" });
  UserAddress.belongsTo(User, { foreignKey: "userId", as: "user" });


  /* ---------- RESTAURANT ---------- */
  Restaurant.hasMany(Dish, { foreignKey: "restaurantId", as: "dishes" });
  Dish.belongsTo(Restaurant, { foreignKey: "restaurantId", as: "restaurant" });

  Restaurant.hasMany(Order, { foreignKey: "restaurantId", as: "orders" });
  Order.belongsTo(Restaurant, { foreignKey: "restaurantId", as: "restaurant" });

  Restaurant.hasMany(Review, { foreignKey: "restaurantId", as: "reviews" });
  Review.belongsTo(Restaurant, { foreignKey: "restaurantId", as: "restaurant" });

  Restaurant.hasMany(Offer, { foreignKey: "restaurantId", as: "offers" });
  Offer.belongsTo(Restaurant, { foreignKey: "restaurantId", as: "restaurant" });


  /* ---------- ORDER ---------- */
  Order.hasMany(OrderItem, { foreignKey: "orderId", as: "orderItems" });
  OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });

  Order.hasOne(Earning, { foreignKey: "orderId", as: "earning" });
  Earning.belongsTo(Order, { foreignKey: "orderId", as: "order" });

  DeliveryPartner.hasMany(Order, {
    foreignKey: "deliveryPartnerId",
    as: "deliveries",
  });

  Order.belongsTo(DeliveryPartner, {
    foreignKey: "deliveryPartnerId",
    as: "deliveryPartner",
  });


  /* ---------- DISH ---------- */
  Dish.hasMany(OrderItem, { foreignKey: "dishId", as: "orderItems" });
  OrderItem.belongsTo(Dish, { foreignKey: "dishId", as: "dish" });

  // ✅ CART RELATION (IMPORTANT FIX)
  Dish.hasMany(Cart, { foreignKey: "dishId", as: "cartItems" });

  // ⚠️ FIX: use SAME alias everywhere ("dish")
  Cart.belongsTo(Dish, { foreignKey: "dishId", as: "dish" });
};

/* ================= SAFE INIT ================= */
initAssociations();

/* ================= EXPORTS ================= */
module.exports = {
  sequelize,
  User,
  Restaurant,
  Dish,
  Order,
  OrderItem,
  DeliveryPartner,
  Earning,
  Review,
  Offer,
  Banner,
  AuditLog,
  Cart,
  UserAddress,
};
