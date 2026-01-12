import { Router } from "express";
import { createOrder, getOrderStatus } from "../controllers/order.controller";

const router = Router();

router.post("/", createOrder);
router.get("/:orderId", getOrderStatus);

export default router;
