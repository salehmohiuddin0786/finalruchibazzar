const express = require("express");
const router = express.Router();

const mainAdminController = require("../controllers/mainAdmin.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");

router.use(protect, authorize("admin"));

router.get("/dashboard", mainAdminController.getDashboard);

router.get("/restaurants", mainAdminController.getRestaurants);
router.patch("/restaurants/:id/approval", mainAdminController.updateRestaurantApproval);

router.get("/customers", mainAdminController.getCustomers);
router.patch("/customers/:id/status", mainAdminController.updateCustomerStatus);

router.get("/delivery-partners", mainAdminController.getDeliveryPartners);
router.patch(
  "/delivery-partners/:id/verification",
  mainAdminController.updateDeliveryPartnerVerification
);

router.get("/orders", mainAdminController.getOrders);
router.get("/payments", mainAdminController.getPayments);
router.get("/payouts", mainAdminController.getPayouts);
router.get("/earnings", mainAdminController.getEarnings);
router.get("/gst", mainAdminController.getGst);
router.get("/reviews", mainAdminController.getReviews);
router.get("/promotions", mainAdminController.getPromotions);
router.get("/reports", mainAdminController.getReports);
router.get("/sub-admins", mainAdminController.getSubAdmins);
router.get("/audit-logs", mainAdminController.getAuditLogs);

router.get("/fraud", (req, res) => {
  req.params.module = "fraud";
  return mainAdminController.getStaticModule(req, res);
});
router.get("/support", (req, res) => {
  req.params.module = "support";
  return mainAdminController.getStaticModule(req, res);
});
router.get("/notifications", (req, res) => {
  req.params.module = "notifications";
  return mainAdminController.getStaticModule(req, res);
});
router.get("/service-zones", (req, res) => {
  req.params.module = "service-zones";
  return mainAdminController.getStaticModule(req, res);
});
router.get("/settings", (req, res) => {
  req.params.module = "settings";
  return mainAdminController.getStaticModule(req, res);
});

module.exports = router;
