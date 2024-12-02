// src/server.js

import dotenv from "dotenv";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import jwt from "jsonwebtoken";

import connectDB from "./src/config/db.js";
import config from "./src/config/index.js";
import app from "./src/app.js";
import { logger } from "./src/utils/logger.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO server
const io = new SocketIOServer(server, {
  cors: {
    origin: config.clientURL, // Update with your client URL
    methods: ["GET", "POST"],
  },
});

// Map to store user ID and their socket IDs
const userSocketMap = new Map();

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Authenticate socket connection
  socket.on("authenticate", ({ token }) => {
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      const userId = decoded.userId;

      // Store user ID and socket ID
      userSocketMap.set(userId, socket.id);
      socket.userId = userId;

      console.log(`User ${userId} authenticated with socket ${socket.id}`);
    } catch (error) {
      console.log("Socket authentication failed:", error.message);
      socket.emit("unauthorized");
      socket.disconnect();
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    if (socket.userId) {
      userSocketMap.delete(socket.userId);
    }
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Export io and userSocketMap for use in other modules
export { io, userSocketMap };

// Connect to MongoDB and start the server
connectDB().then(() => {
  server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
});
