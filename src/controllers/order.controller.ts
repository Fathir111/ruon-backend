import { Request, Response } from "express";
import { prisma } from "../prisma";
import crypto from "crypto";

/**
 * POST /api/orders
 */
export async function createOrder(req: Request, res: Response) {
  const { merchantId, amount } = req.body;

  if (!merchantId || !amount) {
    return res.status(400).json({ error: "merchantId & amount required" });
  }

  let amountBigInt: bigint;
  try {
    amountBigInt = BigInt(amount);
  } catch {
    return res.status(400).json({ error: "amount must be bigint string" });
  }

  const merchant = await prisma.merchant.findUnique({
    where: { id: merchantId },
  });

  if (!merchant) {
    return res.status(404).json({ error: "Merchant not found" });
  }

  const orderId = crypto.randomBytes(4).toString("hex").toUpperCase();

  const order = await prisma.order.create({
    data: {
      merchantId: merchant.id,
      orderId,
      amount: amountBigInt,
      status: "PENDING",
    },
  });

  res.json({
    orderId: order.orderId,
    amount: order.amount.toString(),
    merchantAddress: merchant.walletAddress,
    merchantName: merchant.name,
    qrData: `ethereum:${merchant.walletAddress}@11155111/pay?amount=${order.amount.toString()}&orderId=${order.orderId}`,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });
}

/**
 * GET /api/orders/:orderId
 * (Polling)
 */
export async function getOrderStatus(req: Request, res: Response) {
  const { orderId } = req.params;

  const order = await prisma.order.findUnique({
    where: { orderId },
  });

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  res.json({
    orderId: order.orderId,
    status: order.status,
    amount: order.amount.toString(),
    paidAt: order.paidAt,
    txHash: order.txHash,
  });
}
