const jwt = require("jsonwebtoken");
const { User } = require("../models");

/*
---------------------------------------
🔐 PROTECT ROUTES (AUTHENTICATION)
---------------------------------------
*/
exports.protect = async (req, res, next) => {
  try {
    let token;

    // ✅ Extract token from header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // ❌ No token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }

    // ✅ Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret123"
    );

    // ✅ Get user from DB
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // ❌ Block inactive users
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "User account is blocked",
      });
    }

    // ✅ Attach user to request
    req.user = user;

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Token invalid or expired",
    });
  }
};

/*
---------------------------------------
🛡️ AUTHORIZE (ROLE-BASED ACCESS)
---------------------------------------
*/
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // ❌ No user (protect not used)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // ❌ Role not allowed
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role (${req.user.role}) not allowed`,
      });
    }

    next();
  };
};