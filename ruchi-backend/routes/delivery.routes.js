const express = require("express");
const router = express.Router();

const deliveryController = require("../controllers/delivery.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");
const { validateOrderAssignmentParam } = require("../middlewares/deliveryAssignment.middleware");

/*
---------------------------------------
🚚 DELIVERY ROUTES (SECURE + CLEAN)
---------------------------------------
*/

// ✅ Assign Delivery Partner (ADMIN ONLY)
router.put(
  "/assign/:id",
  protect,
  authorize("admin"),
  deliveryController.assignDeliveryPartner
);

// ✅ Get My Deliveries (PARTNER)
router.get(
  "/my-orders",
  protect,
  authorize("partner"),
  deliveryController.getMyDeliveries
);

router.get("/dashboard", protect, authorize("partner"), deliveryController.getDashboard);
router.get("/history", protect, authorize("partner"), deliveryController.getHistory);
router.get("/earnings", protect, authorize("partner"), deliveryController.getEarnings);
router.get("/profile", protect, authorize("partner"), deliveryController.getProfile);
router.get("/ratings", protect, authorize("partner"), deliveryController.getRatings);
router.put("/availability", protect, authorize("partner"), deliveryController.updateAvailability);
router.post("/:id/accept", protect, authorize("partner", "delivery"), validateOrderAssignmentParam, deliveryController.acceptAssignment);
router.post("/:id/reject", protect, authorize("partner", "delivery"), validateOrderAssignmentParam, deliveryController.rejectAssignment);

// ✅ Pickup Order
router.put(
  "/pick/:id",
  protect,
  authorize("partner"),
  deliveryController.pickOrder
);

// ✅ Start Delivery
router.put(
  "/start/:id",
  protect,
  authorize("partner"),
  deliveryController.startDelivery
);

// ✅ Complete Delivery
router.put(
  "/complete/:id",
  protect,
  authorize("partner"),
  deliveryController.completeDelivery
);

// ✅ Update Live Location
router.put(
  "/location/:id",
  protect,
  authorize("partner"),
  deliveryController.updateLocation
);

module.exports = router;
