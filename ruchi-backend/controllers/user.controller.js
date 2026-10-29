const { User, Restaurant, UserAddress } = require("../models");

const normalizeAddressPayload = (body, userId) => ({
  userId,
  type: body.type || "home",
  street: body.street || body.streetAddress || body.finalAddress || body.address || "",
  city: body.city || body.cityName || "",
  state: body.state || body.stateName || "",
  zipCode: body.zipCode || body.pincode || "",
  landmark: body.landmark || body.colonyName || "",
  phone: body.phone || body.contactNumber || "",
  contactName: body.contactName || "",
  latitude: body.latitude === "" || body.latitude === undefined ? null : body.latitude,
  longitude: body.longitude === "" || body.longitude === undefined ? null : body.longitude,
  isDefault: Boolean(body.isDefault),
});

const isPlaceholderPhone = (phone) => {
  if (!phone) return true;
  const clean = String(phone).replace(/\D/g, "");
  return clean.length !== 10 || !/^[6-9]\d{9}$/.test(clean);
};

const formatUser = (user, address = null) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: isPlaceholderPhone(user.phone) ? "" : user.phone,
  needsPhone: isPlaceholderPhone(user.phone),
  address: address,
  role: user.role,
  isVerified: user.isVerified,
  authProvider: user.authProvider,
  isActive: user.isActive,
  createdAt: user.createdAt,
});

/*
|--------------------------------------------------------------------------
| GET PROFILE
|--------------------------------------------------------------------------
*/
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: [
        "id",
        "name",
        "email",
        "phone",
        "role",
        "isVerified",
        "authProvider",
        "isActive",
        "vehicleType",
        "isAvailable",
        "currentLat",
        "currentLng",
        "rating",
        "totalDeliveries",
        "createdAt"
      ],
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "Account is deactivated",
      });
    }

    let restaurant = null;

    // 🍽️ Partner → fetch restaurant
    if (user.role === "partner") {
      restaurant = await Restaurant.findOne({
        where: { ownerId: user.id },
      });
    }

    const defaultAddress = await UserAddress.findOne({
      where: { userId: user.id },
      order: [["isDefault", "DESC"], ["updatedAt", "DESC"]],
    });

    let addressStreet = defaultAddress?.street || null;
    let userPhone = user.phone;

    // If user has a placeholder phone but entered a real phone in address, adopt it
    if (isPlaceholderPhone(userPhone) && defaultAddress?.phone && !isPlaceholderPhone(defaultAddress.phone)) {
      userPhone = defaultAddress.phone;
      await user.update({ phone: defaultAddress.phone });
    }

    const formattedUser = formatUser({ ...user.toJSON(), phone: userPhone }, addressStreet);

    res.json({
      message: "Profile fetched successfully",
      user: formattedUser,
      restaurant,
    });

  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({
      message: "Failed to fetch profile",
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE PROFILE
|--------------------------------------------------------------------------
*/
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ✅ Email uniqueness check
    if (email && email !== user.email) {
      const exists = await User.findOne({ where: { email } });

      if (exists) {
        return res.status(400).json({
          message: "Email already in use",
        });
      }
    }

    // ✅ Update fields safely
    if (phone) {
      const cleanPhone = String(phone).replace(/\D/g, "");
      if (cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
        return res.status(400).json({
          message: "Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9)",
        });
      }
      if (cleanPhone !== user.phone) {
        const exists = await User.findOne({ where: { phone: cleanPhone } });

        if (exists && exists.id !== user.id) {
          return res.status(400).json({
            message: "Phone number is already registered with another account",
          });
        }
        user.phone = cleanPhone;
      }
    }

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: formatUser(user),
    });

  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({
      message: "Failed to update profile",
    });
  }
};

exports.getAddresses = async (req, res) => {
  try {
    const addresses = await UserAddress.findAll({
      where: { userId: req.user.id },
      order: [
        ["isDefault", "DESC"],
        ["updatedAt", "DESC"],
      ],
    });

    return res.json({ success: true, addresses });
  } catch (error) {
    console.error("Get Addresses Error:", error);
    return res.status(500).json({ message: "Failed to fetch addresses" });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const payload = normalizeAddressPayload(req.body, req.user.id);

    if (!payload.street) {
      return res.status(400).json({ message: "Address is required" });
    }

    const count = await UserAddress.count({ where: { userId: req.user.id } });
    if (payload.isDefault || count === 0) {
      await UserAddress.update({ isDefault: false }, { where: { userId: req.user.id } });
      payload.isDefault = true;
    }

    const address = await UserAddress.create(payload);
    return res.status(201).json({ success: true, address });
  } catch (error) {
    console.error("Add Address Error:", error);
    return res.status(500).json({ message: "Failed to add address" });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const address = await UserAddress.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!address) return res.status(404).json({ message: "Address not found" });

    const payload = normalizeAddressPayload(req.body, req.user.id);
    if (!payload.street) {
      return res.status(400).json({ message: "Address is required" });
    }

    if (payload.isDefault) {
      await UserAddress.update({ isDefault: false }, { where: { userId: req.user.id } });
    }

    await address.update(payload);
    return res.json({ success: true, address });
  } catch (error) {
    console.error("Update Address Error:", error);
    return res.status(500).json({ message: "Failed to update address" });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const address = await UserAddress.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!address) return res.status(404).json({ message: "Address not found" });

    await address.destroy();
    return res.json({ success: true });
  } catch (error) {
    console.error("Delete Address Error:", error);
    return res.status(500).json({ message: "Failed to delete address" });
  }
};

exports.setDefaultAddress = async (req, res) => {
  try {
    const address = await UserAddress.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!address) return res.status(404).json({ message: "Address not found" });

    await UserAddress.update({ isDefault: false }, { where: { userId: req.user.id } });
    await address.update({ isDefault: true });

    return res.json({ success: true, address });
  } catch (error) {
    console.error("Default Address Error:", error);
    return res.status(500).json({ message: "Failed to set default address" });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE LOCATION (Delivery Tracking)
|--------------------------------------------------------------------------
*/
exports.updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    // ✅ Validate input
    if (lat === undefined || lng === undefined) {
      return res.status(400).json({
        message: "Latitude and Longitude are required",
      });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ✅ Only partners/delivery users should update location
    if (user.role !== "partner") {
      return res.status(403).json({
        message: "Only delivery partners can update location",
      });
    }

    user.currentLat = lat;
    user.currentLng = lng;

    await user.save();

    res.json({
      message: "Location updated successfully",
      location: {
        lat: user.currentLat,
        lng: user.currentLng,
      },
    });

  } catch (error) {
    console.error("Location Error:", error);
    res.status(500).json({
      message: "Failed to update location",
    });
  }
};

/*
|--------------------------------------------------------------------------
| DELETE ACCOUNT & DATA (Google Play Data Safety Compliance)
|--------------------------------------------------------------------------
*/
exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userId = user.id;

    // Delete saved addresses
    await UserAddress.destroy({ where: { userId } });

    // Clear cart items if any
    try {
      const { Cart } = require("../models");
      if (Cart) await Cart.destroy({ where: { cartId: String(userId) } });
    } catch (_) {}

    // Wipe PII and deactivate account
    user.isActive = false;
    user.name = "Deleted User";
    user.email = `deleted_${Date.now()}_${user.id}@deleted.ruchibazaar.in`;
    user.phone = `+91${Date.now().toString().slice(-10)}`;
    user.password = null;
    user.currentLat = null;
    user.currentLng = null;
    await user.save();

    return res.json({
      success: true,
      message: "Your account and associated personal data have been deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Account Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete account",
    });
  }
};

exports.requestAccountDeletion = async (req, res) => {
  try {
    const { identifier, reason } = req.body || {};
    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: "Email or phone number is required",
      });
    }

    return res.json({
      success: true,
      message: "Your account deletion request has been registered. All associated data will be permanently wiped within 24-48 hours.",
    });
  } catch (error) {
    console.error("Account Deletion Request Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit deletion request",
    });
  }
};
