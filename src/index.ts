import http from 'http';
import dotenv from 'dotenv';
import app from './app';
import { initSocket } from './socket';
import orderRoutes from "./routes/order.routes";
import { startOrderExpiryJob } from "./jobs/orderExpiry.job";


app.use("/api/orders", orderRoutes);

dotenv.config();

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`🚀 RUON Backend running on port ${PORT}`);
});
startOrderExpiryJob();


initSocket(server);



