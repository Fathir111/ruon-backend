import http from 'http';
import dotenv from 'dotenv';
import app from './app';
import { initSocket } from './socket';


dotenv.config();

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 RUON Backend running on port ${PORT}`);
});
