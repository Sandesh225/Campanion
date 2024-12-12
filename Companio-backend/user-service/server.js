// server.js
import dotenv from "dotenv";
import http from "http";
import connectDB from "./src/config/db.js";
import config from "./src/config/index.js";
import app from "./src/app.js";
import { logger } from "./src/utils/logger.js";
import {
  initializeSocket,
  userSocketMap,
} from "./src/services/socketService.js";

dotenv.config();

const PORT = config.port || 3000;
const server = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);

// Connect to the database and start the server
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error("Failed to connect to the database:", error);
    process.exit(1);
  });

// Export io and userSocketMap for use in other modules
export { io, userSocketMap };
