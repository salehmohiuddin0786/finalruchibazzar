const express = require("express");
const router = express.Router();
const partnerController = require("../controllers/partner.controller");
const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

router.get(
  "/dashboard",
  protect,
  authorize("partner"),
  partnerController.getPartnerDashboard
);

module.exports = router;