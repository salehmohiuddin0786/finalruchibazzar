const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

router.get(
  "/dashboard",
  protect,
  authorize("admin"),
  adminController.getDashboardStats
);

router.put(
  "/block-user/:id",
  protect,
  authorize("admin"),
  adminController.blockUser
);

module.exports = router;