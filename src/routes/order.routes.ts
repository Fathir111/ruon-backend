import { Router } from "express";
import { createOrder, getOrderStatus } from "../controllers/order.controller";

const router = Router();

router.post("/orders", createOrder);
router.get("/orders/:orderId", getOrderStatus);

export default router;
