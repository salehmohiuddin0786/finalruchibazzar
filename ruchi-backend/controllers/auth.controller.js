const bcrypt = require("bcryptjs");
const axios = require("axios");
const crypto = require("crypto");
const { User, Restaurant } = require("../models");
const generateToken = require("../utils/generateToken");

const ROLES = {
  CUSTOMER: "customer",
  PARTNER: "partner",
  ADMIN: "admin",
};

const normalizeIndianPhone = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");
  const withoutCountryCode =
    digits.startsWith("91") && digits.length === 12 ? digits.slice(2) : digits;

  if (!/^[6-9]\d{9}$/.test(withoutCountryCode)) {
    return null;
  }

  return withoutCountryCode;
};

const lookupFirebaseUser = async (idToken) => {
  const apiKey = process.env.FIREBASE_WEB_API_KEY;

  if (!apiKey) {
    const error = new Error("Firebase API key missing");
    error.statusCode = 500;
    throw error;
  }

  if (!idToken) {
    const error = new Error("Firebase verification token is required");
    error.statusCode = 400;
    throw error;
  }

  try {
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      { idToken },
      { headers: { "Content-Type": "application/json" } }
    );

    const firebaseUser = response.data?.users?.[0];

    if (!firebaseUser) {
      const error = new Error("Firebase user not found");
      error.statusCode = 401;
      throw error;
    }

    return firebaseUser;
  } catch (error) {
    if (error.statusCode) throw error;

    const firebaseError = new Error(
      error.response?.data?.error?.message || "Firebase verification failed"
    );
    firebaseError.statusCode = error.response?.status || 401;
    throw firebaseError;
  }
};

const verifyFirebaseGoogleToken = async (idToken) => {
  const firebaseUser = await lookupFirebaseUser(idToken);
  const providerIds = (firebaseUser.providerUserInfo || []).map(
    (provider) => provider.providerId
  );

  if (!providerIds.includes("google.com")) {
    const error = new Error("Google verification failed");
    error.statusCode = 401;
    throw error;
  }

  if (!firebaseUser.email) {
    const error = new Error("Google account email is required");
    error.statusCode = 400;
    throw error;
  }

  return firebaseUser;
};

const makeGooglePlaceholderPhone = (firebaseUid) => {
  const hash = crypto.createHash("sha256").update(firebaseUid).digest("hex");
  const numeric = BigInt(`0x${hash}`).toString().slice(0, 14);
  return numeric.padEnd(14, "0").replace(/^0/, "9");
};

const formatUserResponse = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  isVerified: user.isVerified,
});

const RESTAURANT_UNDER_REVIEW_MESSAGE =
  "Your account is under review. Please wait for admin approval.";

const getApprovedPartnerRestaurant = async (user, res) => {
  if (user.role !== ROLES.PARTNER) return null;

  const restaurant = await Restaurant.findOne({
    where: { ownerId: user.id },
  });

  if (!restaurant) {
    res.status(403).json({
      success: false,
      code: "RESTAURANT_PROFILE_MISSING",
      message: "Restaurant profile not found. Please complete registration.",
    });
    return false;
  }

  if (!restaurant.isApproved) {
    res.status(403).json({
      success: false,
      code: "RESTAURANT_UNDER_REVIEW",
      message: RESTAURANT_UNDER_REVIEW_MESSAGE,
    });
    return false;
  }

  return restaurant;
};

const register = async (req, res) => {
  try {
    const { name, email, phone: rawPhone, password, role, firebaseIdToken } = req.body || {};
    const phone = normalizeIndianPhone(rawPhone);
    let firebaseUser = null;
    const isGoogleRegistration = !!firebaseIdToken;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, email and valid phone are required",
      });
    }

    if (role === ROLES.ADMIN) {
      return res.status(403).json({
        success: false,
        message: "Admin registration is not allowed",
      });
    }

    if (isGoogleRegistration) {
      firebaseUser = await verifyFirebaseGoogleToken(firebaseIdToken);

      if (String(firebaseUser.email || "").toLowerCase() !== String(email).toLowerCase()) {
        return res.status(400).json({
          success: false,
          message: "Google account email does not match registration email",
        });
      }
    }

    if (!password && !isGoogleRegistration) {
      return res.status(400).json({
        success: false,
        message: "Password required",
      });
    }

    const userRole = role === ROLES.PARTNER ? ROLES.PARTNER : ROLES.CUSTOMER;
    const existingEmail = await User.findOne({ where: { email } });
    const existingPhone = await User.findOne({ where: { phone } });

    if (existingPhone) {
      if (existingEmail && existingEmail.id !== existingPhone.id) {
        return res.status(400).json({
          success: false,
          message: "This email is already used by another account",
        });
      }

      existingPhone.name = name;
      existingPhone.email = email;
      existingPhone.role = userRole;
      existingPhone.isVerified = true;
      existingPhone.authProvider = isGoogleRegistration ? "google" : "password";
      existingPhone.password = password ? await bcrypt.hash(password, 10) : null;

      await existingPhone.save();

      const restaurant = await Restaurant.findOne({
        where: { ownerId: existingPhone.id },
      });
      const token = generateToken(existingPhone.id);

      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        token,
        user: formatUserResponse(existingPhone),
        restaurant,
      });
    }

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already registered. Please login or use another email.",
      });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password: password ? await bcrypt.hash(password, 10) : null,
      role: userRole,
      isVerified: true,
      authProvider: isGoogleRegistration ? "google" : "password",
    });

    const token = generateToken(user.id);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user: formatUserResponse(user),
      restaurant: null,
    });
  } catch (error) {
    console.error("Register Error:", error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        success: false,
        message: "Email or phone already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email & password required",
      });
    }

    const user = await User.findOne({ where: { email } });

    if (!user || !user.password) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const restaurant = await getApprovedPartnerRestaurant(user, res);
    if (restaurant === false) return;

    const token = generateToken(user.id);

    return res.json({
      success: true,
      message: "Login successful",
      requiresOtp: false,
      token,
      user,
      restaurant,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const googleAuth = async (req, res) => {
  try {
    const { firebaseIdToken } = req.body || {};
    const firebaseUser = await verifyFirebaseGoogleToken(firebaseIdToken);
    const email = String(firebaseUser.email || "").toLowerCase();

    let user = await User.findOne({ where: { email } });

    if (!user) {
      user = await User.create({
        name: firebaseUser.displayName || email.split("@")[0] || "Google User",
        email,
        phone: makeGooglePlaceholderPhone(firebaseUser.localId),
        password: null,
        role: ROLES.CUSTOMER,
        isVerified: true,
        authProvider: "google",
      });
    } else {
      if (user.role !== ROLES.CUSTOMER) {
        return res.status(403).json({
          success: false,
          message: "Please use the appropriate login portal",
        });
      }

      user.name = user.name || firebaseUser.displayName || email.split("@")[0];
      user.isVerified = true;
      user.authProvider = user.authProvider || "google";
      await user.save();
    }

    const token = generateToken(user.id);

    return res.json({
      success: true,
      message: "Google authentication successful",
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Google authentication failed",
    });
  }
};

const googlePortalLogin = async (req, res) => {
  try {
    const { firebaseIdToken } = req.body || {};
    const firebaseUser = await verifyFirebaseGoogleToken(firebaseIdToken);
    const email = String(firebaseUser.email || "").toLowerCase();

    const user = await User.findOne({ where: { email } });

    if (!user || ![ROLES.ADMIN, ROLES.PARTNER].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "No admin or partner account found for this Google email",
      });
    }

    user.name = user.name || firebaseUser.displayName || email.split("@")[0];
    user.isVerified = true;
    user.authProvider = user.authProvider || "google";
    await user.save();

    const restaurant = await getApprovedPartnerRestaurant(user, res);
    if (restaurant === false) return;

    const token = generateToken(user.id);

    return res.json({
      success: true,
      message: "Google login successful",
      token,
      user: formatUserResponse(user),
      restaurant,
    });
  } catch (error) {
    console.error("Google Portal Login Error:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Google login failed",
    });
  }
};

const loginPartner = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const user = await User.findOne({
      where: {
        email,
        role: ROLES.PARTNER,
      },
    });

    if (!user || !user.password) {
      return res.status(400).json({
        success: false,
        message: "Partner not found",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const restaurant = await getApprovedPartnerRestaurant(user, res);
    if (restaurant === false) return;

    const token = generateToken(user.id);

    return res.json({
      success: true,
      message: "Partner login successful",
      token,
      user,
      restaurant,
    });
  } catch (error) {
    console.error("Partner Login Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const signupMainAdmin = async (req, res) => {
  try {
    const { name, email, phone: rawPhone, password, signupCode } = req.body || {};
    const phone = normalizeIndianPhone(rawPhone);

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, valid phone and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const adminCount = await User.count({ where: { role: ROLES.ADMIN } });
    const configuredSignupCode = process.env.MAINADMIN_SIGNUP_CODE;

    if (adminCount > 0) {
      if (!configuredSignupCode) {
        return res.status(403).json({
          success: false,
          message: "Admin signup is locked. Configure MAINADMIN_SIGNUP_CODE to invite more admins.",
        });
      }

      if (signupCode !== configuredSignupCode) {
        return res.status(403).json({
          success: false,
          message: "Invalid admin signup code",
        });
      }
    }

    const existingEmail = await User.findOne({ where: { email } });
    const existingPhone = await User.findOne({ where: { phone } });

    if (existingEmail || existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Email or phone already registered",
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone,
      password: await bcrypt.hash(password, 10),
      role: ROLES.ADMIN,
      isActive: true,
      isVerified: true,
      authProvider: "password",
    });

    const token = generateToken(user.id);

    return res.status(201).json({
      success: true,
      message: "Main admin account created successfully",
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error("Main Admin Signup Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const loginMainAdmin = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      where: { email: String(email).trim().toLowerCase(), role: ROLES.ADMIN },
    });

    if (!user || !user.password) {
      return res.status(400).json({
        success: false,
        message: "Main admin account not found",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Main admin account is blocked",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user.id);

    return res.json({
      success: true,
      message: "Main admin login successful",
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error("Main Admin Login Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

module.exports = {
  register,
  login,
  googleAuth,
  googlePortalLogin,
  loginPartner,
  signupMainAdmin,
  loginMainAdmin,
};
