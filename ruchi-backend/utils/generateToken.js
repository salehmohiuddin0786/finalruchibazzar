const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign(
    { id: id },
    process.env.JWT_SECRET || "secret123",
    {
      expiresIn: "7d",
    }
  );
};

module.exports = generateToken;