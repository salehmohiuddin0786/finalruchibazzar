const express = require("express");
const router = express.Router();

const {
  registerDeliveryPartner,
  loginDeliveryPartner,
  googleLoginDeliveryPartner,
  listDeliveryPartners,
} = require("../controllers/deliveryPartner.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");

// ✅ Signup
router.post("/signup", registerDeliveryPartner);

// ✅ Login
router.post("/login", loginDeliveryPartner);

router.post("/google", googleLoginDeliveryPartner);

router.get(
  "/available",
  protect,
  authorize("admin", "partner"),
  listDeliveryPartners
);

module.exports = router;
