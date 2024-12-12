// src/services/socketService.js
import { Server as SocketIoServer } from "socket.io";
import { logger } from "../utils/logger.js";

const userSocketMap = new Map();

const initializeSocket = (server) => {
  const io = new SocketIoServer(server, {
    cors: {
      origin: process.env.CLIENT_URL || "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    logger.info(`New client connected: ${socket.id}`);

    socket.on("joinRoom", (userId) => {
      socket.join(userId);
      userSocketMap.set(userId, socket.id);
      logger.info(`User ${userId} joined room ${userId}`);
    });

    socket.on("disconnect", () => {
      logger.info(`Client disconnected: ${socket.id}`);
      // Remove user from userSocketMap
      for (const [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(userId);
          logger.info(`User ${userId} removed from userSocketMap`);
          break;
        }
      }
    });
  });

  return io;
};

export { initializeSocket, userSocketMap };
