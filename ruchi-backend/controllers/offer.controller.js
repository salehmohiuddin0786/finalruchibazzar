const { Offer } = require("../models");

// ===========================================
// CREATE OFFER
// ===========================================
exports.createOffer = async (req, res) => {
  try {
    let {
      title,
      couponCode,
      discountPercent,
      validFrom,
      validTo,
      isActive
    } = req.body;

    title = title ? title.trim() : "";
    couponCode = couponCode ? couponCode.trim() : "";
    discountPercent = Number(discountPercent);

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required"
      });
    }

    if (!couponCode) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required"
      });
    }

    if (!discountPercent || isNaN(discountPercent) || discountPercent <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid discountPercent is required"
      });
    }

    const offer = await Offer.create({
      title,
      couponCode,
      discountPercent,
      validFrom,
      validTo,
      isActive: isActive !== undefined ? isActive : true
    });

    return res.status(201).json({
      success: true,
      message: "Offer created successfully",
      data: offer
    });

  } catch (error) {
    console.error("CREATE OFFER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating offer",
      error: error.message
    });
  }
};

// ===========================================
// GET ALL OFFERS
// ===========================================
exports.getOffers = async (req, res) => {
  try {

    const offers = await Offer.findAll({
      order: [["createdAt", "DESC"]]
    });

    return res.status(200).json({
      success: true,
      count: offers.length,
      data: offers
    });

  } catch (error) {

    console.error("GET OFFERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching offers",
      error: error.message
    });
  }
};

// ===========================================
// GET OFFER BY ID
// ===========================================
exports.getOfferById = async (req, res) => {
  try {

    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid offer ID"
      });
    }

    const offer = await Offer.findByPk(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: offer
    });

  } catch (error) {

    console.error("GET OFFER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// ===========================================
// UPDATE OFFER
// ===========================================
exports.updateOffer = async (req, res) => {
  try {

    const id = Number(req.params.id);

    const offer = await Offer.findByPk(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found"
      });
    }

    const updates = {};

    if (req.body.title !== undefined) {
      updates.title = req.body.title.trim();
    }

    if (req.body.couponCode !== undefined) {
      updates.couponCode = req.body.couponCode.trim();
    }

    if (req.body.discountPercent !== undefined) {
      const parsedDiscount = Number(req.body.discountPercent);
      if (!isNaN(parsedDiscount) && parsedDiscount > 0) {
        updates.discountPercent = parsedDiscount;
      }
    }

    if (req.body.validFrom !== undefined) {
      updates.validFrom = req.body.validFrom;
    }

    if (req.body.validTo !== undefined) {
      updates.validTo = req.body.validTo;
    }

    if (req.body.isActive !== undefined) {
      updates.isActive = req.body.isActive;
    }

    await offer.update(updates);

    return res.status(200).json({
      success: true,
      message: "Offer updated successfully",
      data: offer
    });

  } catch (error) {

    console.error("UPDATE OFFER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating offer",
      error: error.message
    });
  }
};

// ===========================================
// DELETE OFFER
// ===========================================
exports.deleteOffer = async (req, res) => {
  try {

    const id = Number(req.params.id);

    const offer = await Offer.findByPk(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found"
      });
    }

    await offer.destroy();

    return res.status(200).json({
      success: true,
      message: "Offer deleted successfully"
    });

  } catch (error) {

    console.error("DELETE OFFER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting offer",
      error: error.message
    });
  }
};