import dotenv from "dotenv";
import http from "http";
import { Server as SocketIoServer } from "socket.io";
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
const io = new SocketIoServer(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*", // Restrict to specific origins in production
    methods: ["GET", "POST"],
  },
});

// Map to store user ID and their socket IDs
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Handle room joining
  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room ${userId}`);
  });

  // Handle sending messages
  socket.on("sendMessage", ({ conversationId, message }) => {
    console.log(`Message sent to conversation ${conversationId}:`, message);

    // TODO: Save the message to the database

    // Broadcast message to the recipient(s) in the room
    io.to(conversationId).emit("message", message);
  });

  // Handle client disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Export the Socket.IO instance
export { io };

// Connect to MongoDB and start the server
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error("Failed to connect to the database:", error);
    process.exit(1); // Exit the application if the database connection fails
  });
