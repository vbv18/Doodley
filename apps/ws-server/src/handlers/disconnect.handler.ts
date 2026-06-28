import { leaveRoom } from "../utils/handler.js";
import type { AuthenticatedWs } from "../types/client.js";
import type { ConnectionManager } from "../managers/connection.manager.js";
import type { RoomManager } from "../managers/room.manager.js";

export function handleDisconnect(
  ws: AuthenticatedWs,
  connectionManager: ConnectionManager,
  roomManager: RoomManager,
): void {
  connectionManager.remove(ws.user.id, ws);

  if (ws.roomId !== undefined) {
    leaveRoom(ws, ws.roomId, roomManager);
  }
}
