const http = require("http");
const app = require("./app");
const { connectDB } = require("./config/db");
const { sequelize } = require("./models");
const { initSocket } = require("./sockets/order.socket");
const { ensureDeliveryAssignmentSchema } = require("./services/schema.service");

require("dotenv").config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

const startServer = async () => {
  try {
    // Connect database
    await connectDB();

    // Keep existing databases compatible with delivery assignment fields.
    await ensureDeliveryAssignmentSchema();

    // Sync models (DO NOT use alter:true in production)
    await sequelize.sync(); 

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
  }
};

startServer();
