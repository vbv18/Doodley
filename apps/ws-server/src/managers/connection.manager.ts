import type { AuthenticatedWs } from "../types/client.js";

export class ConnectionManager {
  private users = new Map<number, Set<AuthenticatedWs>>();

  add(userId: number, ws: AuthenticatedWs): void {
    if (!this.users.has(userId)) {
      this.users.set(userId, new Set());
    }

    this.users.get(userId)!.add(ws);
  }

  remove(userId: number, ws: AuthenticatedWs): void {
    const sockets = this.users.get(userId);

    if (!sockets) return;

    sockets.delete(ws);

    if (sockets.size === 0) {
      this.users.delete(userId);
    }
  }

  getSockets(userId: number): Set<AuthenticatedWs> {
    return this.users.get(userId) ?? new Set();
  }

  isOnline(userId: number): boolean {
    const sockets = this.users.get(userId);
    return sockets !== undefined && sockets.size > 0;
  }
}
