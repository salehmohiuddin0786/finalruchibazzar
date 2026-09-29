const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Restaurant } = require("../models");

const uploadDir = path.join(__dirname, "../uploads/restaurants");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "application/pdf",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images and PDF files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

exports.uploadRestaurantFiles = upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
  { name: "fssaiDocument", maxCount: 1 },
  { name: "gstDocument", maxCount: 1 },
  { name: "panCard", maxCount: 1 },
  { name: "registrationCertificate", maxCount: 1 },
  { name: "cancelledCheque", maxCount: 1 },
  { name: "menuPdf", maxCount: 1 },
  { name: "outletPhotos", maxCount: 5 },
]);

const getFilePath = (req, fieldName) => {
  if (!req.files || !req.files[fieldName]) return null;
  return `/uploads/restaurants/${req.files[fieldName][0].filename}`;
};

const getMultipleFilePaths = (req, fieldName) => {
  if (!req.files || !req.files[fieldName]) return [];
  return req.files[fieldName].map(
    (file) => `/uploads/restaurants/${file.filename}`
  );
};

const saveDataUrlImage = (value, prefix = "restaurant") => {
  if (!value || typeof value !== "string") return null;

  const match = value.match(/^data:image\/(png|jpe?g|webp);base64,(.+)$/i);
  if (!match) return null;

  const extension = match[1].toLowerCase() === "jpeg" ? "jpg" : match[1].toLowerCase();
  const base64 = match[2];

  try {
    const buffer = Buffer.from(base64, "base64");
    if (!buffer.length) return null;

    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${prefix}.${extension}`;
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, buffer);

    return `/uploads/restaurants/${filename}`;
  } catch {
    return null;
  }
};

const keepPathOrUrl = (value) => {
  if (!value || typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.startsWith("data:image/")) return null;
  return trimmed;
};

const parseBoolean = (value) => {
  return (
    value === true ||
    value === "true" ||
    value === "Yes" ||
    value === "yes" ||
    value === "1"
  );
};

const safeJsonParse = (value, fallback = []) => {
  try {
    if (value === undefined || value === null || value === "") return fallback;
    if (Array.isArray(value)) return value;

    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const parseCuisineType = (body, oldRestaurant) => {
  if (body.cuisines) {
    return safeJsonParse(body.cuisines, oldRestaurant?.cuisines || []);
  }

  if (body.cuisineType) {
    if (Array.isArray(body.cuisineType)) return body.cuisineType;

    return String(body.cuisineType)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return oldRestaurant?.cuisines || [];
};

const toNumber = (value, fallback = null) => {
  if (value === undefined || value === null || value === "") return fallback;
  const number = Number(value);
  return Number.isNaN(number) ? fallback : number;
};

const buildRestaurantData = (req, oldRestaurant = null) => {
  const body = req.body || {};
  const outletPhotos = getMultipleFilePaths(req, "outletPhotos");

  return {
    ownerId: req.user.id,

    name: body.restaurantName || body.name || oldRestaurant?.name,
    ownerName: body.ownerName || oldRestaurant?.ownerName,
    ownerPhone: body.ownerPhone || body.phone || oldRestaurant?.ownerPhone,
    ownerEmail: body.ownerEmail || body.email || oldRestaurant?.ownerEmail,

    restaurantPhone:
      body.restaurantPhone || body.phone || oldRestaurant?.restaurantPhone,
    restaurantEmail:
      body.restaurantEmail || body.email || oldRestaurant?.restaurantEmail,

    address: body.address || oldRestaurant?.address,
    landmark: body.landmark || oldRestaurant?.landmark,
    pincode: body.pincode || oldRestaurant?.pincode,
    city: body.city || oldRestaurant?.city,
    state: body.state || oldRestaurant?.state,

    latitude: toNumber(body.latitude, oldRestaurant?.latitude || null),
    longitude: toNumber(body.longitude, oldRestaurant?.longitude || null),

    logo:
      getFilePath(req, "logo") ||
      saveDataUrlImage(body.logo || body.image, "logo") ||
      keepPathOrUrl(body.image) ||
      keepPathOrUrl(body.logo) ||
      oldRestaurant?.logo ||
      null,

    coverImage:
      getFilePath(req, "coverImage") ||
      saveDataUrlImage(body.coverImage, "cover") ||
      keepPathOrUrl(body.coverImage) ||
      oldRestaurant?.coverImage ||
      null,

    fssaiNumber: body.fssaiNumber || oldRestaurant?.fssaiNumber,
    fssaiDocument:
      getFilePath(req, "fssaiDocument") ||
      oldRestaurant?.fssaiDocument ||
      null,

    gstNumber: body.gstNumber || oldRestaurant?.gstNumber,
    gstDocument:
      getFilePath(req, "gstDocument") || oldRestaurant?.gstDocument || null,

    panNumber: body.panNumber || oldRestaurant?.panNumber,
    panCard: getFilePath(req, "panCard") || oldRestaurant?.panCard || null,

    registrationCertificate:
      getFilePath(req, "registrationCertificate") ||
      oldRestaurant?.registrationCertificate ||
      null,

    businessType: body.businessType || oldRestaurant?.businessType,

    cuisines: parseCuisineType(body, oldRestaurant),

    foodType: body.foodType || oldRestaurant?.foodType,

    preparationTime: toNumber(
      body.preparationTime || body.avgPreparationTime,
      oldRestaurant?.preparationTime || null
    ),

    minimumOrderValue: toNumber(
      body.minimumOrderValue,
      oldRestaurant?.minimumOrderValue || null
    ),

    deliveryRadius: toNumber(
      body.deliveryRadius,
      oldRestaurant?.deliveryRadius || null
    ),

    openingTime: body.openingTime || oldRestaurant?.openingTime,
    closingTime: body.closingTime || oldRestaurant?.closingTime,

    dineIn:
      body.dineIn !== undefined
        ? parseBoolean(body.dineIn)
        : oldRestaurant?.dineIn || false,

    takeaway:
      body.takeaway !== undefined
        ? parseBoolean(body.takeaway)
        : oldRestaurant?.takeaway ?? true,

    accountHolderName:
      body.accountHolderName || oldRestaurant?.accountHolderName,

    bankName: body.bankName || oldRestaurant?.bankName,
    accountNumber: body.accountNumber || oldRestaurant?.accountNumber,
    ifscCode: body.ifscCode || oldRestaurant?.ifscCode,
    upiId: body.upiId || oldRestaurant?.upiId,

    cancelledCheque:
      getFilePath(req, "cancelledCheque") ||
      oldRestaurant?.cancelledCheque ||
      null,

    outletPhotos:
      outletPhotos.length > 0 ? outletPhotos : oldRestaurant?.outletPhotos || [],

    menuPdf: getFilePath(req, "menuPdf") || oldRestaurant?.menuPdf || null,

    aboutRestaurant:
      body.aboutRestaurant ||
      body.description ||
      oldRestaurant?.aboutRestaurant,

    popularDishes: body.popularDishes || oldRestaurant?.popularDishes,
    referralCode: body.referralCode || oldRestaurant?.referralCode,

    isPhoneVerified:
      body.isPhoneVerified !== undefined
        ? parseBoolean(body.isPhoneVerified)
        : oldRestaurant?.isPhoneVerified || false,

    isApproved: oldRestaurant?.isApproved || false,
    isOpen:
      body.isOpen !== undefined
        ? parseBoolean(body.isOpen)
        : oldRestaurant?.isOpen ?? true,
  };
};

exports.createRestaurant = async (req, res) => {
  try {
    const body = req.body || {};

    if (!body.restaurantName && !body.name) {
      return res.status(400).json({
        success: false,
        message: "Restaurant name is required",
      });
    }

    if (!body.ownerPhone && !body.phone) {
      return res.status(400).json({
        success: false,
        message: "Owner phone number is required",
      });
    }

    let restaurant = await Restaurant.findOne({
      where: { ownerId: req.user.id },
    });

    if (restaurant && req.user.role !== "admin") {
      const updateData = buildRestaurantData(req, restaurant);
      await restaurant.update(updateData);

      return res.status(200).json({
        success: true,
        message: "Restaurant updated successfully",
        restaurant,
      });
    }

    const restaurantData = buildRestaurantData(req, null);
    restaurant = await Restaurant.create(restaurantData);

    return res.status(201).json({
      success: true,
      message: "Restaurant registered successfully. Waiting for admin approval.",
      restaurant,
    });
  } catch (error) {
    console.error("Create Restaurant Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllRestaurants = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || undefined;
    const restaurants = await Restaurant.findAll({
      order: [["createdAt", "DESC"]],
      ...(limit ? { limit } : {}),
    });

    return res.json({
      success: true,
      count: restaurants.length,
      restaurants,
    });
  } catch (error) {
    console.error("Get Restaurants Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getDistanceKm = (lat1, lng1, lat2, lng2) => {
  const toRadians = (value) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

exports.getNearbyRestaurants = async (req, res) => {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const radius = Number(req.query.radius) || 10;

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({
        success: false,
        message: "Valid lat and lng are required",
        restaurants: [],
      });
    }

    const restaurants = await Restaurant.findAll({
      order: [["createdAt", "DESC"]],
    });

    const nearbyRestaurants = restaurants
      .map((restaurant) => {
        const plainRestaurant = restaurant.get({ plain: true });
        const restaurantLat = Number(plainRestaurant.latitude);
        const restaurantLng = Number(plainRestaurant.longitude);

        if (!Number.isFinite(restaurantLat) || !Number.isFinite(restaurantLng)) {
          return null;
        }

        const distance = getDistanceKm(lat, lng, restaurantLat, restaurantLng);
        return {
          ...plainRestaurant,
          distance: Number(distance.toFixed(1)),
        };
      })
      .filter((restaurant) => restaurant && restaurant.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    return res.json({
      success: true,
      count: nearbyRestaurants.length,
      restaurants: nearbyRestaurants,
    });
  } catch (error) {
    console.error("Get Nearby Restaurants Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
      restaurants: [],
    });
  }
};

exports.getMyRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      where: { ownerId: req.user.id },
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    return res.json({
      success: true,
      restaurant,
    });
  } catch (error) {
    console.error("Get My Restaurant Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateMyRestaurantProfile = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      where: { ownerId: req.user.id },
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found for this partner",
      });
    }

    const updateData = buildRestaurantData(req, restaurant);
    await restaurant.update(updateData);

    return res.status(200).json({
      success: true,
      message: "Restaurant profile updated successfully",
      restaurant,
    });
  } catch (error) {
    console.error("Update My Restaurant Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    return res.json({
      success: true,
      restaurant,
    });
  } catch (error) {
    console.error("Get Restaurant Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    if (req.user.role !== "admin" && restaurant.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this restaurant",
      });
    }

    const updateData = buildRestaurantData(req, restaurant);
    await restaurant.update(updateData);

    return res.json({
      success: true,
      message: "Restaurant updated successfully",
      restaurant,
    });
  } catch (error) {
    console.error("Update Restaurant Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateRestaurantApproval = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const action = String(req.body?.action || "").toLowerCase();

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Action must be approve or reject",
      });
    }

    await restaurant.update({
      isApproved: action === "approve",
      isOpen: action === "approve",
    });

    return res.json({
      success: true,
      message:
        action === "approve"
          ? "Restaurant approved successfully"
          : "Restaurant rejected successfully",
      restaurant,
    });
  } catch (error) {
    console.error("Restaurant Approval Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    await restaurant.destroy();

    return res.json({
      success: true,
      message: "Restaurant deleted successfully",
    });
  } catch (error) {
    console.error("Delete Restaurant Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
