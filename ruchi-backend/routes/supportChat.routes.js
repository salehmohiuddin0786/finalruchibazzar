const express = require("express");
const router = express.Router();
const supportChatController = require("../controllers/supportChat.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");

// Customer or Guest live chat routes
router.post("/conversation", supportChatController.getOrCreateConversation);
router.get("/conversations/:id", supportChatController.getConversationById);
router.post("/message", supportChatController.sendMessage);
router.post("/read", supportChatController.markAsRead);

// Authorized Staff / Superadmin support inbox routes
router.get("/admin/conversations", protect, authorize("admin", "subadmin"), supportChatController.getAdminConversations);
router.patch("/admin/conversations/:id/status", protect, authorize("admin", "subadmin"), supportChatController.updateConversationStatus);

module.exports = router;
