import { Server } from "socket.io";
import http from "http";
export let io: Server;

export function initSocket(server: any) {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN,
    },
  });
  

  io.on("connection", (socket) => {
    socket.on("join", ({ merchantId }) => {
      socket.join(merchantId);
    });
  });
}

export function emitToMerchant(merchantId: string, event: string, payload: any) {
  if (!io) return;
  io.to(merchantId).emit(event, payload);
}
