import { Request, Response } from "express";
import { prisma } from "../prisma";

/**
 * POST /api/merchants
 */
export async function createMerchant(req: Request, res: Response) {
  const { walletAddress, name } = req.body;

  if (!walletAddress || !name) {
    return res.status(400).json({
      error: "walletAddress & name required",
    });
  }

  try {
    const merchant = await prisma.merchant.create({
      data: {
        walletAddress,
        name,
      },
    });

    return res.json({
      id: merchant.id,
      walletAddress: merchant.walletAddress,
      name: merchant.name,
    });
  } catch (err: any) {
    if (err.code === "P2002") {
      return res.status(409).json({
        error: "Merchant already exists",
      });
    }

    return res.status(500).json({
      error: "Internal server error",
    });
  }
}

/**
 * GET /api/merchants/:walletAddress
 */
export async function getMerchantByWallet(req: Request, res: Response) {
  const { walletAddress } = req.params;

  // 🔴 WAJIB ADA (ini yang bikin error lu kemarin)
  if (!walletAddress) {
    return res.status(400).json({
      error: "walletAddress is required",
    });
  }

  const merchant = await prisma.merchant.findUnique({
    where: {
      walletAddress,
    },
  });

  if (!merchant) {
    return res.status(404).json({
      error: "Merchant not found",
    });
  }

  return res.json({
    id: merchant.id,
    walletAddress: merchant.walletAddress,
    name: merchant.name,
  });
}
