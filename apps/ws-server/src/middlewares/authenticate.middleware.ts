import { prisma } from "@repo/db";
import { verifyAccessToken } from "../utils/auth.js";

export async function authenticateWs(token: string) {
  const decoded = verifyAccessToken(token);

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.id,
    },
    select: {
      id: true,
      name: true,
      globalRole: true,
    },
  });

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}
