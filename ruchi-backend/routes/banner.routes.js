const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/banner.controller");
const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

router.post(
  "/",
  protect,
  authorize("admin"),
  bannerController.createBanner
);

router.get("/", bannerController.getBanners);

module.exports = router;