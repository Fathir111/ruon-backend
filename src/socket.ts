import { Server } from 'socket.io';
import http from 'http';

let io: Server;

export function initSocket(server: http.Server) {
  io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log('🟢 socket connected:', socket.id);

    socket.on('join', ({ merchantId }) => {
      socket.join(merchantId);
      console.log('merchant join room:', merchantId);
    });
  });
}

export function emitToMerchant(
  merchantId: string,
  event: string,
  payload: any
) {
  io.to(merchantId).emit(event, payload);
}
