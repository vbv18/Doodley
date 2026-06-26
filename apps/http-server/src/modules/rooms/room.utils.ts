import crypto from "crypto";

import { prisma } from "@repo/db";
import { ROOM_CODE_LENGTH } from "@repo/config";

export const ROOM_ROLE_RANK = {
  OWNER: 4,
  ADMIN: 3,
  EDITOR: 2,
  VIEWER: 1,
} as const;

export async function generateUniqueRoomCode(): Promise<string> {
  while (true) {
    const roomCode = crypto
      .randomBytes(ROOM_CODE_LENGTH)
      .toString("base64url")
      .slice(0, ROOM_CODE_LENGTH)
      .toUpperCase();

    const exists = await prisma.room.findUnique({
      where: {
        roomCode,
      },
    });

    if (!exists) {
      return roomCode;
    }
  }
}

export function generateInviteToken() {
  return crypto.randomBytes(32).toString("hex");
}
