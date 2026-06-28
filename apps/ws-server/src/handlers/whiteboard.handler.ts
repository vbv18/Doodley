import { prisma } from "@repo/db";
import { sendError } from "../utils/send.js";
import {
  saveWhiteboardToRedis,
  isRedisAvailable,
} from "../services/redis.service.js";
import { RoomRole } from "@repo/types";
import { RoomPermissions, SNAPSHOT_DEBOUNCE_MS } from "@repo/config";
import type { AuthenticatedWs } from "../types/client.js";
import type { RoomManager } from "../managers/room.manager.js";

const EDITOR_ROLES: readonly RoomRole[] = RoomPermissions["EDIT_WHITEBOARD"];

const snapshotTimers = new Map<number, ReturnType<typeof setTimeout>>();

export function handleWhiteboard(
  ws: AuthenticatedWs,
  roomId: number,
  elements: unknown[],
  roomManager: RoomManager,
): void {
  if (ws.roomId !== roomId) {
    sendError(ws, "Not in this room");
    return;
  }

  if (!ws.roomRole || !EDITOR_ROLES.includes(ws.roomRole)) {
    sendError(ws, "Insufficient permissions to edit whiteboard");
    return;
  }

  if (!roomManager.hasMember(roomId, ws.user.id)) {
    sendError(ws, "Not a member of this room");
    return;
  }

  roomManager.setWhiteboardElements(roomId, elements);

  roomManager.broadcastToRoom(
    roomId,
    {
      type: "whiteboard:update",
      elements,
      userId: ws.user.id,
    },
    ws.user.id,
  );

  if (isRedisAvailable()) {
    saveWhiteboardToRedis(roomId, elements).catch((err) => {
      console.error(`[ws] redis write failed for room ${roomId}:`, err);
    });
  }

  scheduleSnapshot(roomId, ws.user.id, elements);
}

function scheduleSnapshot(
  roomId: number,
  userId: number,
  elements: unknown[],
): void {
  const existing = snapshotTimers.get(roomId);
  if (existing) {
    clearTimeout(existing);
  }

  const timer = setTimeout(async () => {
    snapshotTimers.delete(roomId);
    try {
      await prisma.whiteboardVersion.create({
        data: {
          roomId,
          createdById: userId,
          snapshot: elements as object[],
        },
      });
    } catch (err) {
      console.error(`[ws] DB snapshot failed for room ${roomId}:`, err);
    }
  }, SNAPSHOT_DEBOUNCE_MS);

  snapshotTimers.set(roomId, timer);
}
