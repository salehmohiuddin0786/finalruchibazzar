const { SupportConversation, SupportMessage, User } = require("../models");
const jwt = require("jsonwebtoken");

// Helper to optionally extract authenticated user from token without throwing
const getOptionalUser = async (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded?.id) {
        const user = await User.findByPk(decoded.id);
        if (user && user.isActive) return user;
      }
    }
  } catch (e) {
    // Guest or expired token
  }
  return null;
};

// 1. Get or Create conversation for session/user
exports.getOrCreateConversation = async (req, res) => {
  try {
    const { sessionId, name, email, phone } = req.body;
    if (!sessionId) {
      return res.status(400).json({ success: false, message: "sessionId is required" });
    }

    const authUser = await getOptionalUser(req);

    let conversation = await SupportConversation.findOne({
      where: { sessionId },
      include: [
        {
          model: SupportMessage,
          as: "messages",
          limit: 100,
          order: [["createdAt", "ASC"]],
        },
      ],
    });

    if (!conversation) {
      conversation = await SupportConversation.create({
        sessionId,
        userId: authUser ? authUser.id : null,
        userName: authUser ? authUser.name : (name || "Guest Customer"),
        userEmail: authUser ? authUser.email : (email || null),
        userPhone: authUser ? authUser.phone : (phone || null),
        status: "open",
        lastActivityAt: new Date(),
      });

      // Reload with messages empty array
      conversation = await SupportConversation.findByPk(conversation.id, {
        include: [{ model: SupportMessage, as: "messages" }],
      });
    } else if (authUser && !conversation.userId) {
      // Associate existing guest session to user upon login
      await conversation.update({
        userId: authUser.id,
        userName: authUser.name,
        userEmail: authUser.email || conversation.userEmail,
        userPhone: authUser.phone || conversation.userPhone,
      });
    }

    return res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error("Chat getOrCreate error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to initialize conversation" });
  }
};

// 2. Post a message to conversation
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, text, sessionId } = req.body;

    if (!conversationId || !text || !text.trim()) {
      return res.status(400).json({ success: false, message: "conversationId and message text are required" });
    }

    const trimmedText = text.trim();
    if (trimmedText.length > 2000) {
      return res.status(400).json({ success: false, message: "Message exceeds maximum allowed length of 2000 characters" });
    }

    const conversation = await SupportConversation.findByPk(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    const authUser = await getOptionalUser(req);
    const isStaff = authUser && (authUser.role === "admin" || authUser.role === "subadmin");

    // Authorization check: if not staff, verify ownership via userId or sessionId
    if (!isStaff) {
      if (conversation.userId && authUser && conversation.userId !== authUser.id) {
        return res.status(403).json({ success: false, message: "Unauthorized access to this conversation" });
      }
      if (!conversation.userId && sessionId && conversation.sessionId !== sessionId) {
        return res.status(403).json({ success: false, message: "Unauthorized access to this conversation" });
      }
    }

    const senderType = isStaff ? "agent" : "user";
    const senderId = authUser ? authUser.id : null;
    const senderName = isStaff ? (authUser.name || "Support Team") : (conversation.userName || "Customer");

    const message = await SupportMessage.create({
      conversationId: conversation.id,
      senderType,
      senderId,
      senderName,
      text: trimmedText,
      isRead: false,
    });

    // Update conversation metadata
    const updateData = {
      lastMessage: trimmedText,
      lastSender: senderType,
      lastActivityAt: new Date(),
    };

    if (isStaff) {
      updateData.unreadUserCount = conversation.unreadUserCount + 1;
    } else {
      updateData.unreadAdminCount = conversation.unreadAdminCount + 1;
      if (conversation.status === "resolved") {
        updateData.status = "open"; // Reopen on customer response
      }
    }

    await conversation.update(updateData);

    // Emit live socket event to room
    try {
      const { emitChatMessage } = require("../sockets/order.socket");
      if (typeof emitChatMessage === "function") {
        emitChatMessage(conversation.id, message, conversation);
      }
    } catch (sockErr) {
      console.warn("Socket notification warning:", sockErr.message);
    }

    return res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error("Chat sendMessage error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to send message" });
  }
};

// 3. Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    const { conversationId, userType } = req.body;
    if (!conversationId) {
      return res.status(400).json({ success: false, message: "conversationId is required" });
    }

    const conversation = await SupportConversation.findByPk(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    if (userType === "agent") {
      await SupportConversation.update({ unreadAdminCount: 0 }, { where: { id: conversationId } });
      await SupportMessage.update({ isRead: true }, { where: { conversationId, senderType: "user" } });
    } else {
      await SupportConversation.update({ unreadUserCount: 0 }, { where: { id: conversationId } });
      await SupportMessage.update({ isRead: true }, { where: { conversationId, senderType: "agent" } });
    }

    return res.status(200).json({ success: true, message: "Marked as read" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to mark as read" });
  }
};

// 4. Admin Support Inbox - list all conversations
exports.getAdminConversations = async (req, res) => {
  try {
    const { status, search } = req.query;
    const where = {};

    if (status && status !== "All") {
      where.status = status.toLowerCase();
    }

    const conversations = await SupportConversation.findAll({
      where,
      order: [["lastActivityAt", "DESC"]],
      limit: 100,
    });

    return res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    console.error("getAdminConversations error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch conversations" });
  }
};

// 5. Admin Support Inbox - update conversation status
exports.updateConversationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["open", "in_progress", "resolved"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const conversation = await SupportConversation.findByPk(id);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    await conversation.update({ status });

    return res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to update conversation" });
  }
};

// 6. Get single conversation by ID (with full message history)
exports.getConversationById = async (req, res) => {
  try {
    const { id } = req.params;
    const authUser = await getOptionalUser(req);
    const isStaff = authUser && (authUser.role === "admin" || authUser.role === "subadmin");

    const conversation = await SupportConversation.findByPk(id, {
      include: [
        {
          model: SupportMessage,
          as: "messages",
          limit: 250,
          order: [["createdAt", "ASC"]],
        },
      ],
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    if (!isStaff) {
      const sessionId = req.query.sessionId || req.headers["x-session-id"];
      if (conversation.userId && authUser && conversation.userId !== authUser.id) {
        return res.status(403).json({ success: false, message: "Unauthorized" });
      }
      if (!conversation.userId && sessionId && conversation.sessionId !== sessionId) {
        return res.status(403).json({ success: false, message: "Unauthorized" });
      }
    }

    return res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch conversation" });
  }
};

