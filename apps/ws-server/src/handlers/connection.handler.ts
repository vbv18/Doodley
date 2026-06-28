import { prisma } from "@repo/db";
import { MAX_ROOM_MEMBERS } from "@repo/config";
import { sendError, send } from "../utils/send.js";
import { handleDisconnect } from "./disconnect.handler.js";
import { handleChat } from "./chat.handler.js";
import { handleWhiteboard } from "./whiteboard.handler.js";
import { handleCursor } from "./presence.handler.js";
import { leaveRoom } from "../utils/handler.js";
import {
  loadWhiteboardFromRedis,
  isRedisAvailable,
} from "../services/redis.service.js";
import type { ClientMessage } from "@repo/types";
import type { AuthenticatedWs } from "../types/client.js";
import type { ConnectionManager } from "../managers/connection.manager.js";
import type { RoomManager } from "../managers/room.manager.js";

export function handleConnection(
  ws: AuthenticatedWs,
  connectionManager: ConnectionManager,
  roomManager: RoomManager,
): void {
  connectionManager.add(ws.user.id, ws);

  ws.on("message", async (raw) => {
    let message: ClientMessage;

    try {
      message = JSON.parse(raw.toString()) as ClientMessage;
    } catch {
      sendError(ws, "Invalid message format");
      return;
    }

    try {
      switch (message.type) {
        case "join-room":
          await handleJoinRoom(ws, message.roomId, roomManager);
          break;

        case "leave-room":
          handleLeaveRoom(ws, message.roomId, roomManager);
          break;

        case "whiteboard:update":
          handleWhiteboard(ws, message.roomId, message.elements, roomManager);
          break;

        case "chat:message":
          await handleChat(ws, message.roomId, message.message, roomManager);
          break;

        case "presence:cursor":
          handleCursor(ws, message.roomId, message.x, message.y, roomManager);
          break;

        default:
          sendError(ws, "Unknown message type");
      }
    } catch (err) {
      console.error("[ws] message handler error:", err);
      sendError(ws, "Internal server error");
    }
  });

  ws.on("close", () => {
    handleDisconnect(ws, connectionManager, roomManager);
  });

  ws.on("error", (err) => {
    console.error(`[ws] socket error for user ${ws.user.id}:`, err);
  });
}

async function handleJoinRoom(
  ws: AuthenticatedWs,
  roomId: number,
  roomManager: RoomManager,
): Promise<void> {
  if (!Number.isInteger(roomId) || roomId <= 0) {
    sendError(ws, "Invalid room id");
    return;
  }

  const membership = await prisma.roomMember.findUnique({
    where: {
      userId_roomId: {
        userId: ws.user.id,
        roomId,
      },
    },
    select: {
      role: true,
    },
  });

  if (!membership) {
    sendError(ws, "Not a member of this room");
    return;
  }

  if (ws.roomId === roomId) {
    sendError(ws, "Already in this room");
    return;
  }

  // Leave previous room if any
  if (ws.roomId !== undefined) {
    leaveRoom(ws, ws.roomId, roomManager);
  }

  const room = roomManager.getOrCreate(roomId);

  if (room.members.size >= MAX_ROOM_MEMBERS) {
    sendError(ws, "Room is full");
    return;
  }

  ws.roomId = roomId;
  ws.roomRole = membership.role;

  roomManager.addMember(roomId, {
    ws,
    userId: ws.user.id,
    name: ws.user.name,
    role: membership.role,
  });

  let whiteboardElements = roomManager.getWhiteboardElements(roomId);

  if (whiteboardElements.length === 0) {
    if (isRedisAvailable()) {
      const cached = await loadWhiteboardFromRedis(roomId);

      if (cached && cached.length > 0) {
        whiteboardElements = cached;
        roomManager.setWhiteboardElements(roomId, cached);
      }
    }

    if (whiteboardElements.length === 0) {
      const snapshot = await prisma.whiteboardVersion.findFirst({
        where: { roomId },
        orderBy: { createdAt: "desc" },
        select: { snapshot: true },
      });

      if (snapshot?.snapshot) {
        whiteboardElements = snapshot.snapshot as unknown[];
        roomManager.setWhiteboardElements(roomId, whiteboardElements);
      }
    }
  }

  send(ws, {
    type: "room:state",
    whiteboardElements: roomManager.getWhiteboardElements(roomId),
    members: roomManager.getPresenceList(roomId),
  });

  roomManager.broadcastToRoom(
    roomId,
    {
      type: "presence:join",
      userId: ws.user.id,
      name: ws.user.name,
    },
    ws.user.id,
  );
}

function handleLeaveRoom(
  ws: AuthenticatedWs,
  roomId: number,
  roomManager: RoomManager,
): void {
  if (ws.roomId !== roomId) {
    sendError(ws, "Not in this room");
    return;
  }

  leaveRoom(ws, roomId, roomManager);
}
