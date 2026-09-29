const express = require("express");
const router = express.Router();
const offerController = require("../controllers/offer.controller");

// ==================================================
// CREATE OFFER
// ==================================================
router.post("/", offerController.createOffer);

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
router.put("/:id", offerController.updateOffer);

// ==================================================
// DELETE OFFER
// ==================================================
router.delete("/:id", offerController.deleteOffer);

module.exports = router;