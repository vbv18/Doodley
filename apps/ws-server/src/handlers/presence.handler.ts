import type { AuthenticatedWs } from "../types/client.js";
import type { RoomManager } from "../managers/room.manager.js";
import { sendError } from "../utils/send.js";

export function handleCursor(
  ws: AuthenticatedWs,
  roomId: number,
  x: number,
  y: number,
  roomManager: RoomManager,
): void {
  if (ws.roomId !== roomId) {
    sendError(ws, "Not in this room");
    return;
  }

  if (!roomManager.hasMember(roomId, ws.user.id)) {
    sendError(ws, "Not a member of this room");
    return;
  }

  // Broadcast cursor to everyone in the room except sender
  roomManager.broadcastToRoom(
    roomId,
    {
      type: "presence:cursor",
      userId: ws.user.id,
      x,
      y,
    },
    ws.user.id,
  );
}
