const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/google", authController.googleAuth);
router.post("/google-portal", authController.googlePortalLogin);
router.post("/partner/login", authController.loginPartner);
router.post("/mainadmin/signup", authController.signupMainAdmin);
router.post("/mainadmin/login", authController.loginMainAdmin);

module.exports = router;
