import type { Request, Response } from "express";

import { prisma } from "@repo/db";

export async function basic(req: Request, res: Response) {
  return res.status(200).json({
    success: true,
    service: "http-server",
    timestamp: new Date().toISOString(),
  });
}

export async function database(req: Request, res: Response) {
  await prisma.$queryRaw`SELECT 1`;

  return res.status(200).json({
    success: true,
    database: "connected",
    timestamp: new Date().toISOString(),
  });
}
