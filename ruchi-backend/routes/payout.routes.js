const express = require("express");
const router = express.Router();
const payoutController = require("../controllers/payout.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");

// Restaurant Partner routes
router.get(
  "/partner/earnings",
  protect,
  authorize("partner", "admin"),
  payoutController.getPartnerEarnings
);

router.post(
  "/partner/request",
  protect,
  authorize("partner", "admin"),
  payoutController.requestPartnerPayout
);

// Main Admin Payout & Reconciliation routes
router.get(
  "/admin/all",
  protect,
  authorize("admin"),
  payoutController.getMainAdminPayouts
);

router.put(
  "/admin/:id/approve",
  protect,
  authorize("admin"),
  payoutController.approvePayout
);
router.patch(
  "/admin/:id/approve",
  protect,
  authorize("admin"),
  payoutController.approvePayout
);

router.put(
  "/admin/:id/confirm",
  protect,
  authorize("admin"),
  payoutController.confirmPayout
);
router.patch(
  "/admin/:id/confirm",
  protect,
  authorize("admin"),
  payoutController.confirmPayout
);

router.put(
  "/admin/:id/reject",
  protect,
  authorize("admin"),
  payoutController.rejectPayout
);
router.patch(
  "/admin/:id/reject",
  protect,
  authorize("admin"),
  payoutController.rejectPayout
);

router.get(
  "/admin/reconciliation",
  protect,
  authorize("admin"),
  payoutController.getReconciliationReport
);

module.exports = router;
