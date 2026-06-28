import { prisma } from "@repo/db";
import { MAX_CHAT_MESSAGE_LENGTH } from "@repo/config";

import type { AuthenticatedWs } from "../types/client.js";
import type { RoomManager } from "../managers/room.manager.js";
import { sendError } from "../utils/send.js";

export async function handleChat(
  ws: AuthenticatedWs,
  roomId: number,
  message: string,
  roomManager: RoomManager,
): Promise<void> {
  if (ws.roomId !== roomId) {
    sendError(ws, "Not in this room");
    return;
  }

  if (!roomManager.hasMember(roomId, ws.user.id)) {
    sendError(ws, "Not a member of this room");
    return;
  }

  const trimmed = message?.trim();

  if (!trimmed || trimmed.length === 0) {
    sendError(ws, "Message cannot be empty");
    return;
  }

  if (trimmed.length > MAX_CHAT_MESSAGE_LENGTH) {
    sendError(ws, `Message exceeds ${MAX_CHAT_MESSAGE_LENGTH} characters`);
    return;
  }

  // Persist to DB
  const chat = await prisma.chat.create({
    data: {
      roomId,
      userId: ws.user.id,
      message: trimmed,
    },
    select: {
      createdAt: true,
    },
  });

  // Broadcast to all members including sender
  roomManager.broadcastToRoom(roomId, {
    type: "chat:message",
    context: trimmed,
    userId: ws.user.id,
    userName: ws.user.name,
    createdAt: chat.createdAt.toISOString(),
  });
}
