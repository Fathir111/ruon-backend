import { Request, Response } from "express";
import { prisma } from "../prisma";
import { emitToMerchant } from "../socket";

export async function alchemyWebhook(req: Request, res: Response) {
  try {
    const activity = req.body?.event?.activity?.[0];
    if (!activity) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    // ⚠️ SIMPLIFIKASI (sementara)
    const orderId = activity.log?.data?.orderId;
    const amount = activity.log?.data?.amount;
    const payerAddress = activity.log?.topics?.[1];
    const txHash = activity.transactionHash;

    if (!orderId || !txHash) {
      return res.status(400).json({ error: "Missing orderId or txHash" });
    }

    const order = await prisma.order.findUnique({
      where: { orderId },
    });

    if (!order || order.status !== "PENDING") {
      return res.json({ ok: true });
    }

    const updated = await prisma.order.update({
      where: { orderId },
      data: {
        status: "PAID",
        txHash,
        payerAddress,
        paidAt: new Date(),
      },
    });

    // 🔥 EMIT KE MERCHANT
    emitToMerchant(updated.merchantId, "payment:received", {
      orderId: updated.orderId,
      amount: updated.amount.toString(),
      payerAddress,
      txHash,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Webhook error" });
  }
}
