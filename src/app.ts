import express from "express";
import cors from "cors";
import merchantRoutes from "./routes/merchant.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/merchants", merchantRoutes);

export default app;
