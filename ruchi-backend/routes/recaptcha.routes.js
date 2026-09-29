const express = require("express");
const router = express.Router();

const { verifyRecaptcha } = require("../controllers/recaptcha.controller");

router.post("/verify-recaptcha", verifyRecaptcha);

module.exports = router;