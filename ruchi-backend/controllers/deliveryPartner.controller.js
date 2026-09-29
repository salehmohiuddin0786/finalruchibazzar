const bcrypt = require("bcryptjs");
const axios = require("axios");
const { User, DeliveryPartner } = require("../models");
const generateToken = require("../utils/generateToken");

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

const findDeliveryPartnerForUser = async (user) => {
  if (user.email) {
    const partnerByEmail = await DeliveryPartner.findOne({
      where: { email: user.email },
    });

    if (partnerByEmail) return partnerByEmail;
  }

  return DeliveryPartner.findOne({
    where: { phone: user.phone },
  });
};

const listDeliveryPartners = async (req, res) => {
  try {
    const partnerProfiles = await DeliveryPartner.findAll({
      where: {
        isActive: true,
      },
      attributes: [
        "id",
        "name",
        "phone",
        "email",
        "isAvailable",
        "rating",
        "totalDeliveries",
        "vehicleType",
      ],
      order: [
        ["isAvailable", "DESC"],
        ["name", "ASC"],
      ],
    });

    const partners = await Promise.all(
      partnerProfiles.map(async (partner) => {
        const linkedUser = await findLinkedUserForPartner(partner);

        return {
          id: partner.id,
          userId: linkedUser?.id || null,
          name: partner.name,
          phone: partner.phone,
          email: partner.email,
          isAvailable: Boolean(linkedUser?.isAvailable ?? partner.isAvailable),
          rating: linkedUser?.rating || partner.rating,
          totalDeliveries: linkedUser?.totalDeliveries || partner.totalDeliveries,
          vehicleType: partner.vehicleType,
        };
      })
    );

    return res.status(200).json({
      success: true,
      partners,
    });
  } catch (error) {
    console.error("LIST DELIVERY PARTNERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load delivery partners",
    });
  }
};

const findLinkedUserForPartner = async (partner) => {
  if (partner.email) {
    const byEmail = await User.findOne({
      where: { email: partner.email, role: "partner", isActive: true },
    });

    if (byEmail) return byEmail;
  }

  return User.findOne({
    where: { phone: partner.phone, role: "partner", isActive: true },
  });
};

/*
---------------------------------------
🚚 DELIVERY PARTNER SIGNUP
---------------------------------------
*/
const registerDeliveryPartner = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      firebaseIdToken,

      dob,
      age,
      gender,
      address,
      city,
      pincode,
      preferredZone,

      aadhaarNumber,
      panNumber,
      voterId,

      vehicleType,
      vehicleNumber,
      drivingLicenseNumber,
      drivingLicenseExpiry,
      vehicleRegistrationNumber,
      vehicleInsurance,
      pucCertificate,

      bankAccountNumber,
      ifscCode,
      accountHolderName,
      upiId,

      referralCode,
      educationQualification,
      experience,
      emergencyContact,
    } = req.body;

    const isGoogleRegistration = !!firebaseIdToken;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name and phone are required",
      });
    }

    if (!password && !isGoogleRegistration) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    if (isGoogleRegistration) {
      const firebaseUser = await verifyFirebaseGoogleToken(firebaseIdToken);

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Google account email is required",
        });
      }

      if (String(firebaseUser.email || "").toLowerCase() !== String(email).toLowerCase()) {
        return res.status(400).json({
          success: false,
          message: "Google account email does not match registration email",
        });
      }
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
        });
      }
    }

    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number",
      });
    }

    if (password && password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    if (age && Number(age) < 18) {
      return res.status(400).json({
        success: false,
        message: "Delivery partner must be 18 or above",
      });
    }

    if (aadhaarNumber && !/^[0-9]{12}$/.test(aadhaarNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Aadhaar number",
      });
    }

    if (panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid PAN number",
      });
    }

    if (emergencyContact && !/^[0-9]{10}$/.test(emergencyContact)) {
      return res.status(400).json({
        success: false,
        message: "Invalid emergency contact number",
      });
    }

    const existingPhone = await User.findOne({ where: { phone } });

    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone number already registered",
      });
    }

    if (email) {
      const existingEmail = await User.findOne({ where: { email } });

      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already registered",
        });
      }
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const user = await User.create({
      name: name.trim(),
      email: email ? email.trim() : null,
      phone,
      password: hashedPassword,
      role: "partner",
      isAvailable: false,
      isActive: true,
      isVerified: true,
      authProvider: isGoogleRegistration ? "google" : "password",
    });

    const partner = await DeliveryPartner.create({
      name: name.trim(),
      phone,
      email: email ? email.trim() : null,

      dob: dob || null,
      age: age || null,
      gender: gender || null,
      address: address || null,
      city: city || null,
      pincode: pincode || null,
      preferredZone: preferredZone || null,

      aadhaarNumber: aadhaarNumber || null,
      panNumber: panNumber ? panNumber.toUpperCase() : null,
      voterId: voterId || null,

      vehicleType: vehicleType || "bike",
      vehicleNumber: vehicleNumber || vehicleRegistrationNumber || null,
      drivingLicenseNumber: drivingLicenseNumber || null,
      drivingLicenseExpiry: drivingLicenseExpiry || null,
      vehicleRegistrationNumber: vehicleRegistrationNumber || null,
      vehicleInsurance: vehicleInsurance || null,
      pucCertificate: pucCertificate || null,

      bankAccountNumber: bankAccountNumber || null,
      ifscCode: ifscCode ? ifscCode.toUpperCase() : null,
      accountHolderName: accountHolderName || null,
      upiId: upiId || null,

      referralCode: referralCode || null,
      educationQualification: educationQualification || null,
      experience: experience || null,
      emergencyContact: emergencyContact || null,

      isAvailable: false,
      isVerified: false,
      kycStatus: "pending",
    });

    const token = generateToken(user.id);

    return res.status(201).json({
      success: true,
      message: "Delivery partner registered successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      partner,
    });
  } catch (error) {
    console.error("PARTNER REGISTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/*
---------------------------------------
🚚 DELIVERY PARTNER LOGIN
---------------------------------------
*/
const loginDeliveryPartner = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if ((!email && !phone) || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/phone and password are required",
      });
    }

    const whereCondition = email
      ? { email, role: "partner" }
      : { phone, role: "partner" };

    const user = await User.findOne({
      where: whereCondition,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Delivery partner not found",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is blocked",
      });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "Please login with Google",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const partner = await findDeliveryPartnerForUser(user);

    const token = generateToken(user.id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      partner,
    });
  } catch (error) {
    console.error("PARTNER LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/*
---------------------------------------
📦 EXPORTS
---------------------------------------
*/
const googleLoginDeliveryPartner = async (req, res) => {
  try {
    const { firebaseIdToken } = req.body || {};
    const firebaseUser = await verifyFirebaseGoogleToken(firebaseIdToken);
    const email = String(firebaseUser.email || "").toLowerCase();

    const user = await User.findOne({
      where: { email, role: "partner" },
    });

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "No delivery partner account found for this Google email",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is blocked",
      });
    }

    const partner = await findDeliveryPartnerForUser(user);

    if (!partner) {
      return res.status(403).json({
        success: false,
        message: "This Google account is not registered as a delivery partner",
      });
    }

    user.name = user.name || firebaseUser.displayName || email.split("@")[0];
    user.isVerified = true;
    user.authProvider = user.authProvider || "google";
    await user.save();

    const token = generateToken(user.id);

    return res.status(200).json({
      success: true,
      message: "Google login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      partner,
    });
  } catch (error) {
    console.error("DELIVERY GOOGLE LOGIN ERROR:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Google login failed",
    });
  }
};

module.exports = {
  registerDeliveryPartner,
  loginDeliveryPartner,
  googleLoginDeliveryPartner,
  listDeliveryPartners,
};
