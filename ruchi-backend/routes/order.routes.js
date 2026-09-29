const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order.controller");
const deliveryController = require("../controllers/delivery.controller");

const { protect, authorize } = require("../middlewares/auth.middleware");
const { validateOrderAssignmentParam } = require("../middlewares/deliveryAssignment.middleware");

/*
---------------------------------------
📦 CUSTOMER ROUTES
---------------------------------------
*/

router.post("/", protect, authorize("customer"), orderController.createOrder);

// ✅ BOTH ROUTES (no mismatch issue)
router.get("/user", protect, authorize("customer"), orderController.getUserOrders);
router.get("/my-orders", protect, authorize("customer"), orderController.getUserOrders);

/*
---------------------------------------
🍴 RESTAURANT ROUTES
---------------------------------------
*/

router.get(
  "/restaurant/:restaurantId",
  protect,
  authorize("admin", "partner"),
  orderController.getRestaurantOrders
);

router.put(
  "/:id/status",
  protect,
  authorize("admin", "partner"),
  orderController.updateOrderStatus
);

/*
---------------------------------------
🚚 DELIVERY ROUTES
---------------------------------------
*/

router.put("/:id/assign", protect, authorize("admin"), deliveryController.assignDeliveryPartner);
router.get("/delivery/my-orders", protect, authorize("partner"), deliveryController.getMyDeliveries);
router.post("/:id/delivery/accept", protect, authorize("partner", "delivery"), validateOrderAssignmentParam, deliveryController.acceptAssignment);
router.post("/:id/delivery/reject", protect, authorize("partner", "delivery"), validateOrderAssignmentParam, deliveryController.rejectAssignment);
router.put("/:id/pick", protect, authorize("partner"), deliveryController.pickOrder);
router.put("/:id/start", protect, authorize("partner"), deliveryController.startDelivery);
router.put("/:id/deliver", protect, authorize("partner"), deliveryController.completeDelivery);
router.put("/:id/location", protect, authorize("partner"), deliveryController.updateLocation);

/*
---------------------------------------
📄 COMMON
---------------------------------------
*/

router.get("/:id", protect, orderController.getOrderById);

module.exports = router;
