const express = require("express");
const router = express.Router();
const partnerController = require("../controllers/partner.controller");
const payoutController = require("../controllers/payout.controller");
const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

router.get(
  "/dashboard",
  protect,
  authorize("partner", "admin"),
  partnerController.getPartnerDashboard
);

router.get(
  "/earnings",
  protect,
  authorize("partner", "admin"),
  payoutController.getPartnerEarnings
);

router.post(
  "/payout-request",
  protect,
  authorize("partner", "admin"),
  payoutController.requestPartnerPayout
);

module.exports = router;