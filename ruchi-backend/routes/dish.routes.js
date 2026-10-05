const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");
const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

const dishController = require("../controllers/dish.controller");

// ===============================
// CREATE DISH (Admin or Partner)
// ===============================
router.post(
  "/",
  protect,
  authorize("partner", "admin"),
  upload.single("image"),
  dishController.createDish
);

// ===============================
// UPDATE DISH (Admin or Partner)
// ===============================
router.put(
  "/:id",
  protect,
  authorize("partner", "admin"),
  upload.single("image"),
  dishController.updateDish
);

// ===============================
// DELETE DISH (Admin or Partner)
// ===============================
router.delete(
  "/:id",
  protect,
  authorize("partner", "admin"),
  dishController.deleteDish
);

// ===============================
// GET ALL DISHES
// ===============================
router.get("/", dishController.getAllDishes);

// ===============================
// GET DISHES BY RESTAURANT
// ===============================
router.get(
  "/restaurant/:restaurantId",
  dishController.getDishesByRestaurant
);

module.exports = router;