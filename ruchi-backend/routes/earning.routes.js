const express = require("express");
const router = express.Router();
const earningController = require("../controllers/earning.controller");
const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

router.get(
  "/",
  protect,
  authorize("admin", "partner"),
  earningController.getEarnings
);

module.exports = router;