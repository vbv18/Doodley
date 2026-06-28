import type { AuthenticatedWs } from "../types/client.js";
import type { RoomManager } from "../managers/room.manager.js";

export function leaveRoom(
  ws: AuthenticatedWs,
  roomId: number,
  roomManager: RoomManager,
): void {
  if (!roomManager.hasMember(roomId, ws.user.id)) return;

  roomManager.removeMember(roomId, ws.user.id);
  ws.roomId = undefined;
  ws.roomRole = undefined;

  roomManager.broadcastToRoom(roomId, {
    type: "presence:leave",
    userId: ws.user.id,
  });
}
