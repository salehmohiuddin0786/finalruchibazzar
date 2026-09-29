const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");
const { protect } = require("../middlewares/auth.middleware");

router.post("/", protect, reviewController.createReview);

module.exports = router;