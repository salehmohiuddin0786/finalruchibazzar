const express = require("express");
const router = express.Router();
const multer = require("multer");

const dishController = require("../controllers/dish.controller");

// ===============================
// MULTER CONFIG
// ===============================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ===============================
// CREATE DISH
// ===============================
router.post(
  "/",
  upload.single("image"),   // ✅ REQUIRED
  dishController.createDish
);

// ===============================
// UPDATE DISH
// ===============================
router.put(
  "/:id",
  upload.single("image"),   // ✅ REQUIRED
  dishController.updateDish
);

// ===============================
// DELETE DISH
// ===============================
router.delete("/:id", dishController.deleteDish);

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