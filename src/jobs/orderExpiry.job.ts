import { prisma } from "../prisma";
import { io } from "../socket";

const EXPIRY_MINUTES = 5;
const CHECK_INTERVAL_MS = 30_000; // 30 detik

export function startOrderExpiryJob() {
  console.log("⏱️ Order expiry job started");

  setInterval(async () => {
    const expiredBefore = new Date(
      Date.now() - EXPIRY_MINUTES * 60 * 1000
    );

    const expiredOrders = await prisma.order.findMany({
      where: {
        status: "PENDING",
        createdAt: {
          lt: expiredBefore,
        },
      },
    });

    for (const order of expiredOrders) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "EXPIRED" },
      });

      // 🔥 Emit ke merchant
      io.to(order.merchantId).emit("order:expired", {
        orderId: order.orderId,
      });

      console.log(`⌛ Order expired: ${order.orderId}`);
    }
  }, CHECK_INTERVAL_MS);
}
