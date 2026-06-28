import type { AuthenticatedWs } from "../types/client.js";
import type { RoomState, RoomMember } from "../types/room.js";
import type { ServerMessage } from "@repo/types";

export class RoomManager {
  private rooms = new Map<number, RoomState>();

  getOrCreate(roomId: number): RoomState {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, {
        roomId,
        members: new Map(),
        whiteboardElements: [],
      });
    }
    return this.rooms.get(roomId)!;
  }

  get(roomId: number): RoomState | undefined {
    return this.rooms.get(roomId);
  }

  addMember(roomId: number, member: RoomMember): void {
    const room = this.getOrCreate(roomId);
    room.members.set(member.userId, member);
  }

  removeMember(roomId: number, userId: number): void {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.members.delete(userId);

    if (room.members.size === 0) {
      this.rooms.delete(roomId);
    }
  }

  getMember(roomId: number, userId: number): RoomMember | undefined {
    return this.rooms.get(roomId)?.members.get(userId);
  }

  hasMember(roomId: number, userId: number): boolean {
    return this.rooms.get(roomId)?.members.has(userId) ?? false;
  }

  setWhiteboardElements(roomId: number, elements: unknown[]): void {
    const room = this.rooms.get(roomId);
    if (!room) return;
    room.whiteboardElements = elements;
  }

  getWhiteboardElements(roomId: number): unknown[] {
    return this.rooms.get(roomId)?.whiteboardElements ?? [];
  }

  broadcastToRoom(
    roomId: number,
    message: ServerMessage,
    excludeUserId?: number,
  ): void {
    const room = this.rooms.get(roomId);
    if (!room) return;

    const payload = JSON.stringify(message);

    for (const [userId, member] of room.members) {
      if (excludeUserId !== undefined && userId === excludeUserId) continue;

      if (member.ws.readyState === member.ws.OPEN) {
        member.ws.send(payload);
      }
    }
  }

  sendToUser(roomId: number, userId: number, message: ServerMessage): void {
    const member = this.getMember(roomId, userId);
    if (!member) return;

    if (member.ws.readyState === member.ws.OPEN) {
      member.ws.send(JSON.stringify(message));
    }
  }

  getPresenceList(roomId: number): { userId: number; name: string }[] {
    const room = this.rooms.get(roomId);
    if (!room) return [];

    return Array.from(room.members.values()).map((m) => ({
      userId: m.userId,
      name: m.name,
    }));
  }
}
