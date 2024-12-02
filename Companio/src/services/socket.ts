// src/services/socket.ts

import { io, Socket } from "socket.io-client";
import Config from "../config";

let socket: Socket | null = null;

export const connectSocket = (userId: string) => {
  socket = io(Config.SOCKET_URL, {
    query: { userId },
  });

  socket.on("connect", () => {
    console.log("Connected to Socket.IO server");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from Socket.IO server");
  });
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};

export const subscribeToNewMatches = (callback: (match: any) => void) => {
  if (!socket) return;
  socket.on("new-match", (matchData: any) => {
    callback(matchData);
  });
};
