import { Router } from "express";
import { alchemyWebhook } from "../controllers/webhook.controller";

const router = Router();

router.post("/alchemy", alchemyWebhook);

export default router;
