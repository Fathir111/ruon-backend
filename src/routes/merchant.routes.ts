import { Router } from "express";
import {
  createMerchant,
  getMerchantByWallet,
} from "../controllers/merchant.controller";

const router = Router();

router.post("/", createMerchant);
router.get("/:walletAddress", getMerchantByWallet);

export default router;
