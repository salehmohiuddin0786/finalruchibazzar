const express = require("express");
const router = express.Router();
const offerController = require("../controllers/offer.controller");
const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

// ==================================================
// CREATE OFFER
// ==================================================
router.post(
  "/",
  protect,
  authorize("admin", "partner"),
  offerController.createOffer
);

// ==================================================
// GET ALL OFFERS
// ==================================================
router.get("/", offerController.getOffers);

// ==================================================
// GET SINGLE OFFER BY ID
// ==================================================
router.get("/:id", offerController.getOfferById);

// ==================================================
// UPDATE OFFER
// ==================================================
router.put(
  "/:id",
  protect,
  authorize("admin", "partner"),
  offerController.updateOffer
);

// ==================================================
// DELETE OFFER
// ==================================================
router.delete(
  "/:id",
  protect,
  authorize("admin", "partner"),
  offerController.deleteOffer
);

module.exports = router;