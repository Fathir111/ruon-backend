import express from "express";
import cors from "cors";
import merchantRoutes from "./routes/merchant.routes";
import orderRoutes from "./routes/order.routes";
import webhookRoutes from "./routes/webhook.routes";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/merchants", merchantRoutes);
app.use("/api", orderRoutes);
app.use("/api/webhook", webhookRoutes)
export default app;