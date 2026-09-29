const axios = require("axios");

exports.verifyRecaptcha = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is required",
      });
    }

    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: token,
        },
      }
    );

    if (!response.data.success) {
      return res.status(400).json({
        success: false,
        message: "reCAPTCHA verification failed",
      });
    }

    res.json({
      success: true,
      message: "reCAPTCHA verified",
    });

  } catch (error) {
    console.error("Recaptcha Error:", error);
    res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
};