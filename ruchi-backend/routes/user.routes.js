const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile,
  updateLocation,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  deleteAccount,
  requestAccountDeletion,
} = require("../controllers/user.controller");

const { protect } = require("../middlewares/auth.middleware");

/*
|--------------------------------------------------------------------------
| USER ROUTES
|--------------------------------------------------------------------------
*/

// 👤 Get Profile
router.get("/profile", protect, getProfile);

// ✏️ Update Profile (name, email)
router.put("/profile", protect, updateProfile);

router.get("/addresses", protect, getAddresses);
router.post("/addresses", protect, addAddress);
router.put("/addresses/:id", protect, updateAddress);
router.delete("/addresses/:id", protect, deleteAddress);
router.put("/addresses/:id/default", protect, setDefaultAddress);

// 📍 Update Live Location (for delivery tracking)
router.put("/location", protect, updateLocation);

// 🗑️ Delete Account & Data (In-app and Web-triggered)
router.delete("/profile", protect, deleteAccount);
router.delete("/account", protect, deleteAccount);
router.post("/delete-request", requestAccountDeletion);

module.exports = router;
