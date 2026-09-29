// User Roles
const ROLES = {
  ADMIN: "admin",
  PARTNER: "partner",
  CUSTOMER: "customer",
  DELIVERY: "delivery",
};

// Order Status
const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  ACCEPTED: "accepted",
  PREPARING: "preparing",
  READY: "ready",
  READY_FOR_PICKUP: "READY_FOR_PICKUP",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  PICKED_UP: "picked_up",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

const DELIVERY_STATUS = {
  NOT_ASSIGNED: "NOT_ASSIGNED",
  ASSIGNING: "ASSIGNING",
  ASSIGNED: "ASSIGNED",
  PICKED: "PICKED",
  ON_THE_WAY: "ON_THE_WAY",
  DELIVERED: "DELIVERED",
  LEGACY_NOT_ASSIGNED: "not_assigned",
  LEGACY_ASSIGNED: "assigned",
  LEGACY_PICKED: "picked",
  LEGACY_ON_THE_WAY: "on_the_way",
  LEGACY_DELIVERED: "delivered",
};

// Payment Status
const PAYMENT_STATUS = {
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
};

// Commission %
const PLATFORM_COMMISSION_PERCENT = 20;

// Pagination Default
const DEFAULT_PAGE_SIZE = 10;

// JWT Expiry
const JWT_EXPIRES_IN = "7d";

module.exports = {
  ROLES,
  ORDER_STATUS,
  DELIVERY_STATUS,
  PAYMENT_STATUS,
  PLATFORM_COMMISSION_PERCENT,
  DEFAULT_PAGE_SIZE,
  JWT_EXPIRES_IN,
};
